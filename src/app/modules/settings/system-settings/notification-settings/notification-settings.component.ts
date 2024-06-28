import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatSelectChange } from '@angular/material/select';
import { BaseResponse } from 'src/app/core/models/base-response';
import { NotificationSettingsModel } from 'src/app/core/models/settings/system-setting/notification-settings.model';
import { SystemSettingService } from 'src/app/core/services/settings/system-setting.service';
import { AccessTypeEnum, AccessTypeLabelMapping } from 'src/app/core/enums/user/access-type-enum.model';
import { UserService } from 'src/app/core/services/users/users.service';

@Component({
  selector: 'app-notification-settings',
  templateUrl: './notification-settings.component.html',
})
export class NotificationSettingsComponent implements OnInit, OnDestroy {
  isLoading$: Observable<boolean>;
  isLoadingSubject: BehaviorSubject<boolean>;
  notificationSettingsForm: FormGroup;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  private unsubscribe: Subscription[] = [];
  private _onDestroy = new Subject<void>();
  managersList: any[] = [];

  AccessTypeEnum = AccessTypeEnum;
  AccessTypeLabelMapping = AccessTypeLabelMapping;

  constructor(
    private fb: FormBuilder,
    private systemSettingService: SystemSettingService,
    private toastrService: ToastrService,
    private userService: UserService
  ) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.isLoading$ = this.isLoadingSubject.asObservable();
  }

  ngOnInit(): void {
    this.notificationSettingsForm = this.fb.group({
      id: [0],
      newsletterSubscribeEmail: ['', [Validators.required, Validators.email]],
      firstTrialProcessEnding: [0, Validators.required],
      secondTrialProcessEnding: [0, Validators.required],
      endOfContract: [0, Validators.required],
      sendLeaveNotification: [false],
      sendExtaLeaveNotification: [false],
      addLeaveFormToEmail: [false],
      sendAdvancePaymentNotification: [false],
      sendSalaryBonusPaymentNotification: [false],
      sendExpenseNotification: [false],
      sendBonusPaymentNotification: [false],
      celebrateBirthday: [false],
      endOfEducationWeek: [0, Validators.required],
      notificationSettingManagers: [[]]
    });

    this.loadNotificationSettings();
    this.loadManagers();
  }

  ngOnDestroy(): void {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  loadNotificationSettings(): void {
    this.isLoadingSubject.next(true);
    this.systemSettingService.getNotificationSettings().subscribe(
      (response: BaseResponse<NotificationSettingsModel>) => {
        this.isLoadingSubject.next(false);
        if (response && response.data) {
          const data = response.data[0];
          this.notificationSettingsForm.patchValue({
            id: data.id,
            newsletterSubscribeEmail: data.newsletterSubscribeEmail,
            firstTrialProcessEnding: data.firstTrialProcessEnding,
            secondTrialProcessEnding: data.secondTrialProcessEnding,
            endOfContract: data.endOfContract,
            sendLeaveNotification: data.sendLeaveNotification,
            sendExtaLeaveNotification: data.sendExtaLeaveNotification,
            addLeaveFormToEmail: data.addLeaveFormToEmail,
            sendAdvancePaymentNotification: data.sendAdvancePaymentNotification,
            sendSalaryBonusPaymentNotification: data.sendSalaryBonusPaymentNotification,
            sendExpenseNotification: data.sendExpenseNotification,
            sendBonusPaymentNotification: data.sendBonusPaymentNotification,
            celebrateBirthday: data.celebrateBirthday,
            endOfEducationWeek: data.endOfEducationWeek,
            notificationSettingManagers: data.notificationSettingManagers || []
          });
        } else {
          this.toastrService.error('Bildirim ayarları yüklenemedi!', "Hata");
        }
      },
      error => {
        this.isLoadingSubject.next(false);
        this.toastrService.error('Bildirim ayarları yüklenirken hata oluştu.', "Hata");
      }
    );
  }

  loadManagers(): void {
    this.userService.getUsersByAccessType(AccessTypeEnum.Manager).subscribe(
      (response: BaseResponse<any>) => {
        if (response && response.data) {
          this.managersList = response.data;
        } else {
          this.toastrService.error('Yöneticiler yüklenemedi!', "Hata");
        }
      },
      error => {
        this.toastrService.error('Yöneticiler yüklenirken hata oluştu.', "Hata");
      }
    );
  }

  saveNotificationSettings(): void {
    if (this.notificationSettingsForm.invalid) {
      this.toastrService.warning('Lütfen formu kontrol edin', 'Uyarı');
      return;
    }

    this.isLoadingSubject.next(true);
    const formValue: NotificationSettingsModel = this.notificationSettingsForm.value;
    this.systemSettingService.updateNotificationSetting(formValue).subscribe(
      (response: BaseResponse<void>) => {
        this.isLoadingSubject.next(false);
        if (response) {
          this.toastrService.success('Bildirim ayarları başarıyla güncellendi');
          setTimeout(() => window.location.reload(), 1000);
        } else {
          this.toastrService.error('Bildirim ayarları güncellenemedi', "Hata");
        }
      },
      error => {
        this.isLoadingSubject.next(false);
        this.toastrService.error('Bildirim ayarları güncellenirken hata oluştu.', "Hata");
      }
    );
  }

  addManager(event: MatSelectChange): void {
    const managerId = event.value;
    const managers = this.notificationSettingsForm.get('notificationSettingManagers').value;
    if (!managers.includes(managerId)) {
      managers.push(managerId);
      this.notificationSettingsForm.get('notificationSettingManagers').setValue(managers);
    }
  }

  removeManager(manager: number): void {
    const managers = this.notificationSettingsForm.get('notificationSettingManagers').value;
    const index = managers.indexOf(manager);

    if (index >= 0) {
      managers.splice(index, 1);
      this.notificationSettingsForm.get('notificationSettingManagers').setValue(managers);
    }
  }

  getManagerName(managerId: number): string {
    const manager = this.managersList.find(m => m.id === managerId);
    return manager ? manager.name + ' ' + manager.surname : '';
  }

}
