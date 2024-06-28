import { Component, EventEmitter, Input, OnInit, Output, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Observable, BehaviorSubject, Subscription, Subject } from 'rxjs';
import { UserEducationService } from 'src/app/core/services/users/user-education.service';
import { UserService } from 'src/app/core/services/users/users.service';
import { EducationsService } from 'src/app/core/services/settings/educations.service';
import { UserEducationCreateModel } from 'src/app/core/models/users/education/user-education-create.model';
import { EducationsModel } from 'src/app/core/models/settings/educations/educations.model';
import { UserEducationStatusLabelMapping, UserEducationStatusTypeEnum } from 'src/app/core/enums/user/education/user-education-status.enum.model';

@Component({
  selector: 'app-education-create',
  templateUrl: './education-create.component.html'
})
export class EducationCreateComponent implements OnInit, OnDestroy {
  @Output() userEducationCreate = new EventEmitter<string>();
  @Input() userId: number;
  isLoading$: Observable<boolean>;
  isLoadingSubject: BehaviorSubject<boolean>;
  private unsubscribe: Subscription[] = [];
  educationCreateForm: FormGroup;
  private _onDestroy = new Subject<void>();
  private message: string;
  selectedRating: number = 0;

  educations: EducationsModel[] = [];

  minDate: Date = new Date();
  defaultTime: any;

  UserEducationStatusTypeEnum = UserEducationStatusTypeEnum;
  userEducationStatusTypeSources = Object.values(UserEducationStatusTypeEnum).filter(value => typeof value === 'number');
  UserEducationStatusLabelMapping = UserEducationStatusLabelMapping;

  constructor(
    private fb: FormBuilder,
    public userService: UserService,
    public userEducationService: UserEducationService,
    private educationsService: EducationsService,
    private toastrService: ToastrService
  ) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.isLoading$ = this.isLoadingSubject.asObservable();
  }

  ngOnInit() {
    this.initializeForm();
    this.loadEducations();
    this.educationCreateForm.get('rating').valueChanges.subscribe(value => {
      this.selectedRating = value;
    });
  }

  initializeForm() {
    this.educationCreateForm = this.fb.group({
      userId: [this.userId, Validators.required],
      educationId: ["", Validators.required],
      userEducationStatus: ["", Validators.required],
      description: ["", Validators.required],
      completionDate: ["", Validators.required],
      rating: ["", [Validators.required, Validators.min(1), Validators.max(10)]],
    });
  }

  loadEducations() {
    this.educationsService.getEducations().subscribe(
      (educations) => {
        this.educations = educations;
      },
      (error) => {
        this.toastrService.error('Eğitim verileri yüklenirken bir hata oluştu.', 'Hata');
      }
    );
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
  }

  saveEducation() {
    this.isLoadingSubject.next(true);
    this.message = "";
    if (this.educationCreateForm.valid) {
      const formData: UserEducationCreateModel = this.educationCreateForm.value;
      formData.completionDate = this.adjustForTimezone(new Date(formData.completionDate));

      this.userEducationService.createUserEducation(formData).subscribe(
        res => {
          if (res.data == 0) {
            this.toastrService.warning(res.messages[0].toString());
          } else {
            this.toastrService.success("İşlem Başarılı");
            this.userEducationCreate.emit("true");
            setTimeout(() => window.location.reload(), 1000);
          }
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
}
