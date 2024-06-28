import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';
import { BaseResponse } from 'src/app/core/models/base-response';
import { SystemSettingService } from 'src/app/core/services/settings/system-setting.service';
import { SecuritySettingsModel } from 'src/app/core/models/settings/system-setting/security-settings.model';

@Component({
  selector: 'app-security-settings',
  templateUrl: './security-settings.component.html'
})
export class SecuritySettingsComponent implements OnInit, OnDestroy {
  isLoading$: Observable<boolean>;
  isLoadingSubject: BehaviorSubject<boolean>;
  securitySettingsForm: FormGroup;
  private unsubscribe: Subscription[] = [];
  private _onDestroy = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private systemSettingService: SystemSettingService,
    private toastrService: ToastrService
  ) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.isLoading$ = this.isLoadingSubject.asObservable();
  }

  ngOnInit(): void {
    this.securitySettingsForm = this.fb.group({
      id: [0],
      logoutWhenBrowserClosed: [false],
      logoutAfterTenMinutes: [false],
      minPasswordLength: [0, Validators.required],
      lowerAndUpperCaseRequired: [false],
      numberRequired: [false],
      specialCharacterRequired: [false]
    });

    this.loadSecuritySettings();
  }

  ngOnDestroy(): void {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  loadSecuritySettings(): void {
    this.isLoadingSubject.next(true);
    this.systemSettingService.getSecuritySettings().subscribe(
      (response: BaseResponse<SecuritySettingsModel>) => {
        this.isLoadingSubject.next(false);
        if (response && response.data) {
          const data = response.data[0];
          this.securitySettingsForm.patchValue({
            id: data.id,
            logoutWhenBrowserClosed: data.logoutWhenBrowserClosed,
            logoutAfterTenMinutes: data.logoutAfterTenMinutes,
            minPasswordLength: data.minPasswordLength,
            lowerAndUpperCaseRequired: data.lowerAndUpperCaseRequired,
            numberRequired: data.numberRequired,
            specialCharacterRequired: data.specialCharacterRequired
          });
        } else {
          this.toastrService.error('Güvenlik ayarları yüklenemedi!', "Hata");
        }
      },
      error => {
        this.isLoadingSubject.next(false);
        this.toastrService.error('Güvenlik ayarları yüklenirken hata oluştu.', "Hata");
      }
    );
  }

  saveSecuritySettings(): void {
    if (this.securitySettingsForm.invalid) {
      this.toastrService.warning('Lütfen formu kontrol edin', 'Uyarı');
      return;
    }

    this.isLoadingSubject.next(true);
    const formValue: SecuritySettingsModel = this.securitySettingsForm.value;
    this.systemSettingService.updateSecuritySetting(formValue).subscribe(
      (response: BaseResponse<void>) => {
        this.isLoadingSubject.next(false);
        if (response) {
          this.toastrService.success('Güvenlik ayarları başarıyla güncellendi');
          setTimeout(() => window.location.reload(), 1000);
        } else {
          this.toastrService.error('Güvenlik ayarları güncellenemedi', "Hata");
        }
      },
      error => {
        this.isLoadingSubject.next(false);
        this.toastrService.error('Güvenlik ayarları güncellenirken hata oluştu.', "Hata");
      }
    );
  }
}
