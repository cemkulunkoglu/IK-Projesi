import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Observable, BehaviorSubject, Subscription, Subject } from 'rxjs';
import { UserOvertimeService } from 'src/app/core/services/users/user-overtime.service';

@Component({
  selector: 'app-overtime-update',
  templateUrl: './overtime-update.component.html',
  styleUrls: ['./overtime-update.component.scss']
})
export class OvertimeUpdateComponent implements OnInit {
  @Output() userOvertimeEdit = new EventEmitter<string>();
  isLoading$: Observable<boolean>;
  isLoadingSubject: BehaviorSubject<boolean>;
  private unsubscribe: Subscription[] = [];
  overtimeUpdateForm: FormGroup;

  @Input() overtimeId: number;
  userId: number;

  _onDestroy = new Subject<void>();
  message: string;

  constructor(
    private fb: FormBuilder,
    private overtimeService: UserOvertimeService,
    private toastrService: ToastrService
  ) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.isLoading$ = this.isLoadingSubject.asObservable();
  }

  ngOnInit() {
    this.overtimeUpdateForm = this.fb.group({
      id: ["", Validators.required],
      userId: [this.userId, Validators.required],
      description: ["", Validators.required],
      timeHour: ["", Validators.required],
      timeMinute: ["", Validators.required],
      startDate: ["", Validators.required],
      skipApprovalProcess: [false],
      sendInformationalEmailToEmployee: [false]
    });

    this.overtimeService.getUserOvertimeById(this.overtimeId).subscribe(res => {
      this.overtimeUpdateForm.controls["id"].setValue(res.data.id);
      this.overtimeUpdateForm.controls["userId"].setValue(res.data.userId);
      this.overtimeUpdateForm.controls["description"].setValue(res.data.description);
      this.overtimeUpdateForm.controls["timeHour"].setValue(res.data.timeHour);
      this.overtimeUpdateForm.controls["timeMinute"].setValue(res.data.timeMinute);
      this.overtimeUpdateForm.controls["startDate"].setValue(res.data.startDate);
      this.overtimeUpdateForm.controls["skipApprovalProcess"].setValue(res.data.skipApprovalProcess);
      this.overtimeUpdateForm.controls["sendInformationalEmailToEmployee"].setValue(res.data.sendInformationalEmailToEmployee);
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  adjustForTimezone(date: Date): Date {
    const timeOffsetInMS: number = date.getTimezoneOffset() * 60000;
    date.setTime(date.getTime() - timeOffsetInMS);
    return date;
  }

  saveOvertime() {
    this.isLoadingSubject.next(true);
    this.message = "";
    if (this.overtimeUpdateForm.valid) {
      this.overtimeUpdateForm.value.startDate = this.adjustForTimezone(new Date(this.overtimeUpdateForm.value.startDate));
      this.overtimeService.updateUserOvertime(this.overtimeUpdateForm.value).subscribe(
        res => {
          if (res.data == 0) {
            this.toastrService.warning(res.messages[0].toString());
            this.isLoadingSubject.next(false);
            this.userOvertimeEdit.emit("true");
          } else {
            this.toastrService.success("İşlem Başarılı");
            this.isLoadingSubject.next(false);
            this.userOvertimeEdit.emit("true");
          }
        },
        err => {
          err.error.messages.forEach(element => {
            this.message += element + '. ';
          });
          this.toastrService.error(this.message, "Hata");
          this.isLoadingSubject.next(false);
          this.userOvertimeEdit.emit("true");
        }
      );
    } else {
      this.toastrService.warning("Formu Kontrol Ediniz.", "Uyarı");
      this.isLoadingSubject.next(false);
    }
  }
}
