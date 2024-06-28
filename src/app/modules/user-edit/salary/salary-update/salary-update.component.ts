import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';
import { CurrencyTypeEnum, CurrencyTypeLabelMapping } from 'src/app/core/enums/user/salary/currency-type-enum.model.enum';
import { PeriodEnum, PeriodLabelMapping } from 'src/app/core/enums/user/salary/period-enum.model.enum';
import { SalaryTypeEnum, SalaryTypeLabelMapping } from 'src/app/core/enums/user/salary/salary-type-enum.model.enum';
import { CompanyInfoService } from 'src/app/core/services/settings/company-info.service';
import { UserService } from 'src/app/core/services/users/users.service';

@Component({
  selector: 'app-salary-update',
  templateUrl: './salary-update.component.html'
})
export class SalaryUpdateComponent implements OnInit {
  @Output() userSalaryEdit = new EventEmitter<string>();
  isLoading$: Observable<boolean>;
  isLoadingSubject: BehaviorSubject<boolean>;
  private unsubscribe: Subscription[] = [];
  salaryUpdateForm: FormGroup;

  //#region CurrencyType
  currencyTypeLabelMapping = CurrencyTypeLabelMapping;
  currencyTypeSources = Object.values(CurrencyTypeEnum).filter(value => typeof value === 'number');
  //#endregion

  //#region Period
  periodLabelMapping = PeriodLabelMapping;
  periodSources = Object.values(PeriodEnum).filter(value => typeof value === 'number');
  //#endregion

  //#region SalaryType
  salaryTypeLabelMapping = SalaryTypeLabelMapping;
  salaryTypeSources = Object.values(SalaryTypeEnum).filter(value => typeof value === 'number');
  //#endregion

  @Input() salaryId: number;

  _onDestroy = new Subject<void>();
  message: string;

  constructor(private fb: FormBuilder,
    private companyInfoService: CompanyInfoService,
    private userService: UserService,
    private toastrService: ToastrService) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.isLoading$ = this.isLoadingSubject.asObservable();
  }

  ngOnInit() {
    this.salaryUpdateForm = this.fb.group({
      id: ["", Validators.required],
      userId: ["", Validators.required],
      salary: ["", Validators.required],
      currencyType: ["", Validators.required],
      startDate: ["", Validators.required],
      period: ["", Validators.required],
      salaryType: ["", Validators.required],
    });

    this.userService.getUserSalaryById(this.salaryId).subscribe(res => {
      this.salaryUpdateForm.controls["id"].setValue(res.data.id);
      this.salaryUpdateForm.controls["userId"].setValue(res.data.userId);
      this.salaryUpdateForm.controls["salary"].setValue(res.data.salary);
      this.salaryUpdateForm.controls["currencyType"].setValue(res.data.currencyType);
      this.salaryUpdateForm.controls["startDate"].setValue(res.data.startDate);
      this.salaryUpdateForm.controls["period"].setValue(res.data.period);
      this.salaryUpdateForm.controls["salaryType"].setValue(res.data.salaryType);
    })
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
  saveSalary() {
    this.isLoadingSubject.next(true);
    this.message = "";
    if (this.salaryUpdateForm.valid) {
      this.salaryUpdateForm.value.startDate = this.adjustForTimezone(new Date(this.salaryUpdateForm.value.startDate));
      this.userService.updateUserSalary(this.salaryUpdateForm.value).subscribe(
        res => {
          if (res.data == 0) {
            this.toastrService.warning(res.messages[0].toString());
            this.isLoadingSubject.next(false);
            this.userSalaryEdit.emit("true");
          } else {
            this.toastrService.success("İşlem Başarılı");
            this.isLoadingSubject.next(false);
            this.userSalaryEdit.emit("true");
          }
        },
        err => {
          err.error.messages.forEach(element => {
            this.message += element + '. ';
          });
          this.toastrService.error(this.message, "Hata");
          this.isLoadingSubject.next(false);
          this.userSalaryEdit.emit("true");
        }
      );
    } else {
      this.toastrService.warning("Formu Kontrol Ediniz.", "Uyarı");
      this.isLoadingSubject.next(false);
    }
  }

  onInputNumberOnly(event: Event) {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/[^0-9]/g, '');
  }
}
