import { Component, EventEmitter, Input, OnInit, OnDestroy, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Observable, BehaviorSubject, Subscription, Subject } from 'rxjs';
import { LeaveTypeEnumLabelMapping, LeaveTypeEnum } from 'src/app/core/enums/user/leave/leave-type-enum.model';
import { StatusTypeEnumLabelMapping, StatusTypeEnum } from 'src/app/core/enums/user/leave/status-type-enum.model';
import { UserDemandService } from 'src/app/core/services/users/user-demand.service';
import { UserService } from 'src/app/core/services/users/users.service';

@Component({
  selector: 'app-update-leave-information',
  templateUrl: './update-leave-information.component.html',
  styleUrls: ['./update-leave-information.component.scss']
})
export class UpdateLeaveInformationComponent implements OnInit, OnDestroy {
  @Output() userLeaveEdit = new EventEmitter<string>();
  isLoading$: Observable<boolean>;
  isLoadingSubject: BehaviorSubject<boolean>;
  private unsubscribe: Subscription[] = [];
  leaveUpdateForm: FormGroup;

  //#region CurrencyType
  leaveTypeEnumLabelMapping = LeaveTypeEnumLabelMapping;
  leaveTypeEnum = Object.values(LeaveTypeEnum).filter(value => typeof value === 'number');
  //#endregion

  //#region Period
  statusTypeEnumLabelMapping = StatusTypeEnumLabelMapping;
  statusTypeEnum = Object.values(StatusTypeEnum).filter(value => typeof value === 'number');
  //#endregion

  @Input() leaveId: number;
  departmentUsers: Array<{ id: number, name: string }> = [];

  _onDestroy = new Subject<void>();
  message: string;

  constructor(private fb: FormBuilder,
    private userService: UserService,
    private userDemandService: UserDemandService,
    private toastrService: ToastrService) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.isLoading$ = this.isLoadingSubject.asObservable();
  }

  ngOnInit() {
    this.leaveUpdateForm = this.fb.group({
      id: ["", Validators.required],
      userId: ["", Validators.required],
      leaveTypeId: ["", Validators.required],
      endDate: ["", Validators.required],
      startDate: ["", Validators.required],
      returnDate: ["", Validators.required],
      description: ["", Validators.required],
      status: ["", Validators.required],
      temporaryUserId: [""]
    });

    this.loadLeaveData();
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

  loadLeaveData() {
    this.userDemandService.getUserLeaveById(this.leaveId).subscribe(res => {
      this.leaveUpdateForm.controls["id"].setValue(res.data.id);
      this.leaveUpdateForm.controls["userId"].setValue(res.data.userId);
      this.leaveUpdateForm.controls["leaveTypeId"].setValue(res.data.leaveTypeId);
      this.leaveUpdateForm.controls["endDate"].setValue(res.data.endDate);
      this.leaveUpdateForm.controls["startDate"].setValue(res.data.startDate);
      this.leaveUpdateForm.controls["returnDate"].setValue(res.data.returnDate);
      this.leaveUpdateForm.controls["description"].setValue(res.data.description);
      this.leaveUpdateForm.controls["status"].setValue(res.data.status);
      this.leaveUpdateForm.controls["temporaryUserId"].setValue(res.data.temporaryUserId);

      this.loadDepartmentUsers(res.data.userId);
    });
  }

  loadDepartmentUsers(userId: number) {
    this.userService.getDepartmentUsersByUserId(userId).subscribe(res => {
      this.departmentUsers = res;
      if (this.departmentUsers.length === 0) {
        this.leaveUpdateForm.get('temporaryUserId').disable();
        this.leaveUpdateForm.get('temporaryUserId').clearValidators();
      } else {
        this.leaveUpdateForm.get('temporaryUserId').enable();
        this.leaveUpdateForm.get('temporaryUserId').setValidators([Validators.required]);
      }
    });
  }

  saveLeave() {
    this.isLoadingSubject.next(true);
    this.message = "";
    if (this.leaveUpdateForm.valid) {
      this.leaveUpdateForm.value.startDate = this.adjustForTimezone(new Date(this.leaveUpdateForm.value.startDate));
      this.leaveUpdateForm.value.endDate = this.adjustForTimezone(new Date(this.leaveUpdateForm.value.endDate));
      this.leaveUpdateForm.value.returnDate = this.adjustForTimezone(new Date(this.leaveUpdateForm.value.returnDate));
      this.userDemandService.updateUserLeave(this.leaveUpdateForm.value).subscribe(
        res => {
          if (res.data == 0) {
            this.toastrService.warning(res.messages[0].toString());
            this.isLoadingSubject.next(false);
            this.userLeaveEdit.emit("true");
          } else {
            this.toastrService.success("İşlem Başarılı");
            this.isLoadingSubject.next(false);
            this.userLeaveEdit.emit("true");
          }
        },
        err => {
          err.error.messages.forEach(element => {
            this.message += element + '. ';
          });
          this.toastrService.error(this.message, "Hata");
          this.isLoadingSubject.next(false);
          this.userLeaveEdit.emit("true");
        }
      );
    } else {
      this.toastrService.warning("Formu Kontrol Ediniz.", "Uyarı");
      this.isLoadingSubject.next(false);
    }
  }
}
