import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable, ReplaySubject, Subject, Subscription, takeUntil } from 'rxjs';
import { AccountTypeEnum, AccountTypeLabelMapping } from 'src/app/core/enums/user/other-information/account-type-enum.model.enum';
import { CountryModel } from 'src/app/core/models/location/country.model';
import { LocationService } from 'src/app/core/services/location/location.service';
import { UserService } from 'src/app/core/services/users/users.service';
import { AuthService } from 'src/app/core/services/auth/auth.service';

@Component({
  selector: 'app-other-information',
  templateUrl: './other-information.component.html'
})
export class OtherInformationComponent implements OnInit, OnDestroy {
  @Input() userId: number;
  isLoading$: Observable<boolean>;
  isLoadingSubject: BehaviorSubject<boolean>;
  private unsubscribe: Subscription[] = [];
  _onDestroy = new Subject<void>();

  saveOtherInformationForm: FormGroup;

  //#region Country
  countryList: Array<CountryModel>;
  countryFilteredData: ReplaySubject<(CountryModel)[]> = new ReplaySubject<(CountryModel)[]>(1);
  countrySearch: FormControl = new FormControl();
  selectedCountryId: number;
  selectedCountry: number;
  //#endregion Country

  accountTypeLabelMapping = AccountTypeLabelMapping;
  accountTypeSources = Object.values(AccountTypeEnum).filter(value => typeof value === 'number');

  message: string;

  constructor(private fb: FormBuilder,
    public userService: UserService,
    private locationService: LocationService,
    private toastrService: ToastrService,
    private authService: AuthService) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.isLoading$ = this.isLoadingSubject.asObservable();
  }

  ngOnInit() {
    this.saveOtherInformationForm = this.fb.group({
      userId: ["", Validators.required],
      district: [""],
      city: [""],
      countryId: [""],
      address: [""],
      postCode: [""],
      homePhone: [""],
      bankName: [""],
      accountType: [""],
      accountNumber: [""],
      iban: [""],
      emergencyContactPerson: [""],
      emergencyContactDegree: [""],
      emergencyContactPhone: [""],
      connectionName: [""],
      connectionAddress: [""],
    });

    this.userService.getUserOtherInformationByUserId(this.userId).subscribe(res => {
      this.locationService.getCountries().subscribe(countryRes => {
        this.countryList = countryRes;
        this.filterCountryData();
        if (res.data != null) {
          this.saveOtherInformationForm.patchValue(res.data);
          this.selectedCountry = res.data.countryId;
        } else {
          this.saveOtherInformationForm.controls["userId"].setValue(this.userId);
        }
      });
    });

    this.countrySearch.valueChanges.pipe(takeUntil(this._onDestroy)).subscribe(() => { this.filterCountryData(); });
  }

  ngOnDestroy(): void {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  filterCountryData() {
    let search = this.countrySearch.value;
    if (!search) {
      this.countryFilteredData.next(this.countryList.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.countryFilteredData.next(
      this.countryList.filter(
        (x: any) => x.name.toLowerCase().indexOf(search) > -1
      )
    );
  }

  onInputNumberOnly(event: Event) {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/[^0-9]/g, '');
  }

  saveOtherInformation() {
    console.log(this.saveOtherInformationForm.value);
    this.isLoadingSubject.next(true);
    this.message = "";
    if (this.saveOtherInformationForm.valid) {
      this.userService.saveUserOtherInformation(this.saveOtherInformationForm.value).subscribe(
        res => {
          this.toastrService.success("İşlem Başarılı");
          this.isLoadingSubject.next(false);
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
