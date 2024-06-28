import { ChangeDetectorRef, Component, Input, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable, ReplaySubject, Subject, Subscription, takeUntil } from 'rxjs';
import { BloodTypeEnum, BloodTypeLabelMapping } from 'src/app/core/enums/user/personel-information/blood-type-enum.model';
import { EducationStatusEnum, EducationStatusLabelMapping } from 'src/app/core/enums/user/personel-information/education-status-enum.model';
import { GenderEnum, GenderLabelMapping } from 'src/app/core/enums/user/personel-information/gender-enum.model';
import { MaritalStatusEnum, MaritalStatusLabelMapping } from 'src/app/core/enums/user/personel-information/marital-status-enum.model';
import { MilitaryStatusEnum, MilitaryStatusLabelMapping } from 'src/app/core/enums/user/personel-information/military-status-enum.model';
import { ObstacleDegreeEnum, ObstacleDegreeLabelMapping } from 'src/app/core/enums/user/personel-information/obstacle-degree-enum.model';
import { SpousesEmploymentStatusEnum, SpousesEmploymentStatusLabelMapping } from 'src/app/core/enums/user/personel-information/spouses-employment-status-enum.model';
import { CountryModel } from 'src/app/core/models/location/country.model';
import { LocationService } from 'src/app/core/services/location/location.service';
import { UserService } from 'src/app/core/services/users/users.service';
import { AuthService } from 'src/app/core/services/auth/auth.service';

@Component({
  selector: 'app-personel-information',
  templateUrl: './personel-information.component.html'
})
export class PersonelInformationComponent implements OnInit, OnDestroy {
  @Input() userId: number;

  isLoading$: Observable<boolean>;
  isLoadingSubject: BehaviorSubject<boolean>;
  private unsubscribe: Subscription[] = [];
  _onDestroy = new Subject<void>();
  isMilitaryPostponementDate: boolean;

  savePersonelInformationForm: FormGroup;
  nationalityList: Array<CountryModel>;
  nationalityFilteredData: ReplaySubject<(CountryModel)[]> = new ReplaySubject<(CountryModel)[]>(1);
  nationalitySearch: FormControl = new FormControl();
  selectedNationalityId: number;
  selectedNationality: number;
  selectedMilitaryStatus: MilitaryStatusEnum;

  maritalStatusLabelMapping = MaritalStatusLabelMapping;
  maritalStatusSources = Object.values(MaritalStatusEnum).filter(value => typeof value === 'number');
  spousesEmploymentStatusLabelMapping = SpousesEmploymentStatusLabelMapping;
  spousesEmploymentStatusSources = Object.values(SpousesEmploymentStatusEnum).filter(value => typeof value === 'number');
  genderLabelMapping = GenderLabelMapping;
  genderSources = Object.values(GenderEnum).filter(value => typeof value === 'number');
  obstacleDegreeLabelMapping = ObstacleDegreeLabelMapping;
  obstacleDegreeSources = Object.values(ObstacleDegreeEnum).filter(value => typeof value === 'number');
  bloodTypeLabelMapping = BloodTypeLabelMapping;
  bloodTypeSources = Object.values(BloodTypeEnum).filter(value => typeof value === 'number');
  militaryStatusLabelMapping = MilitaryStatusLabelMapping;
  militaryStatusSources = Object.values(MilitaryStatusEnum).filter(value => typeof value === 'number');
  educationStatusLabelMapping = EducationStatusLabelMapping;
  educationStatusSources = Object.values(EducationStatusEnum).filter(value => typeof value === 'number');

  message: string;

  constructor(private fb: FormBuilder,
    public userService: UserService,
    private locationService: LocationService,
    private toastrService: ToastrService,
    private cdr: ChangeDetectorRef,
    private authService: AuthService) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.isLoading$ = this.isLoadingSubject.asObservable();
  }

  ngOnInit() {
    this.isMilitaryPostponementDate = false;

    this.savePersonelInformationForm = this.fb.group({
      userId: ["", Validators.required],
      dateOfBirth: ["", [Validators.required]],
      identityNumber: ["", [Validators.required, Validators.pattern(/^[0-9]{11}$/)]],
      maritalStatus: [""],
      spousesEmploymentStatus: [""],
      gender: [""],
      obstacleDegree: [""],
      nationalityId: [""],
      numberOfChildren: [""],
      bloodType: [""],
      militaryStatus: [""],
      militaryPostponementDate: [""],
      educationStatus: [""],
      highestLevelOfEducationCompleted: [""],
      lastCompletedEducationalInstitution: [""]
    });

    this.userService.getUserPersonelInformationByUserId(this.userId).subscribe(res => {
      this.locationService.getCountries().subscribe(res => { this.nationalityList = res; this.filterNationalityData(); });
      if (res.data != null) {
        this.savePersonelInformationForm.patchValue({
          userId: res.data.userId,
          dateOfBirth: res.data.dateOfBirth,
          identityNumber: res.data.identityNumber,
          maritalStatus: res.data.maritalStatus,
          spousesEmploymentStatus: res.data.spousesEmploymentStatus,
          gender: res.data.gender,
          obstacleDegree: res.data.obstacleDegree,
          nationalityId: res.data.nationalityId,
          numberOfChildren: res.data.numberOfChildren,
          bloodType: res.data.bloodType,
          militaryStatus: res.data.militaryStatus,
          militaryPostponementDate: res.data.militaryPostponementDate,
          educationStatus: res.data.educationStatus,
          highestLevelOfEducationCompleted: res.data.highestLevelOfEducationCompleted,
          lastCompletedEducationalInstitution: res.data.lastCompletedEducationalInstitution
        });

        this.selectedMilitaryStatus = res.data.militaryStatus;
        this.onChangeMilitaryStatus();
      } else {
        this.savePersonelInformationForm.controls["userId"].setValue(this.userId);
      }
    });

    this.nationalitySearch.valueChanges.pipe(takeUntil(this._onDestroy)).subscribe(() => { this.filterNationalityData(); });
  }

  filterNationalityData() {
    let search = this.nationalitySearch.value;
    if (!search) {
      this.nationalityFilteredData.next(this.nationalityList.slice());
      return;
    } else {
      search = search.toLowerCase().replace(/[\s-]/g, '');
    }
    this.nationalityFilteredData.next(
      this.nationalityList.filter(
        (x: any) => x.name.toLowerCase().replace(/[\s-]/g, '').indexOf(search) > -1 || x.code.toLowerCase().replace(/[\s-]/g, '').indexOf(search) > -1
      )
    );
  };

  onChangeMilitaryStatus() {
    if (this.selectedMilitaryStatus === MilitaryStatusEnum.Delayed) {
      this.isMilitaryPostponementDate = true;
    } else {
      this.isMilitaryPostponementDate = false;
      this.savePersonelInformationForm.controls["militaryPostponementDate"].setValue(null);
    }
    if (this.selectedMilitaryStatus === MilitaryStatusEnum.Exempt || this.selectedMilitaryStatus === MilitaryStatusEnum.Done) {
      this.savePersonelInformationForm.controls["militaryPostponementDate"].disable();
    } else {
      this.savePersonelInformationForm.controls["militaryPostponementDate"].enable();
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  adjustForTimezone(date: Date): Date {
    var timeOffsetInMS: number = date.getTimezoneOffset() * 60000;
    date.setTime(date.getTime() - timeOffsetInMS);
    return date;
  };

  savePersonelInformation() {
    this.isLoadingSubject.next(true);
    this.message = "";

    if (this.savePersonelInformationForm.valid) {
      if (this.savePersonelInformationForm.value.dateOfBirth != null) {
        this.savePersonelInformationForm.value.dateOfBirth = this.adjustForTimezone(new Date(this.savePersonelInformationForm.value.dateOfBirth));
      }
      if (this.savePersonelInformationForm.value.militaryPostponementDate != null) {
        this.savePersonelInformationForm.value.militaryPostponementDate = this.adjustForTimezone(new Date(this.savePersonelInformationForm.value.militaryPostponementDate));
      }
      if (this.savePersonelInformationForm.value.obstacleDegree === "") {
        this.savePersonelInformationForm.value.obstacleDegree = null;
      }
      if (this.savePersonelInformationForm.value.spousesEmploymentStatus === "") {
        this.savePersonelInformationForm.value.spousesEmploymentStatus = null;
      }

      this.userService.saveUserPersonelInformation(this.savePersonelInformationForm.value).subscribe(
        res => {
          this.toastrService.success("İşlem Başarılı");
          this.isLoadingSubject.next(false);
          this.cdr.detectChanges();
          // this.router.navigate(['/usermanagement/user']);
        },
        err => {
          err.error.messages.forEach(element => {
            this.message += element + '. ';
          });
          this.toastrService.error(this.message, "Hata");
          this.isLoadingSubject.next(false);
        }
      );
    } else {
      this.toastrService.warning("Formu Kontrol Ediniz.", "Uyarı");
      this.isLoadingSubject.next(false);
    }
  }

  hasPermission(permission: string): boolean {
    return this.authService.hasPermission(permission);
  }
}
