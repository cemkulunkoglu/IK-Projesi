import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { MatExpansionModule } from '@angular/material/expansion';
import { RouterModule } from '@angular/router';
import { DxDataGridModule, DxButtonModule, DxBulletModule, DxTemplateModule, DxToastModule } from 'devextreme-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { NgxMatDateAdapter, NgxMatDatetimePickerModule, NgxMatNativeDateModule, NgxMatTimepickerModule } from '@angular-material-components/datetime-picker';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatButtonModule } from '@angular/material/button';
import { CustomDateAdapter } from '../../Request/date-helper';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { SystemSettingsComponent } from './system-settings.component';
import { AccessSettingsComponent } from './access-settings/access-settings.component';
import { NotificationSettingsComponent } from './notification-settings/notification-settings.component';
import { ProfileSettingsComponent } from './profile-settings/profile-settings.component';
import { SecuritySettingsComponent } from './security-settings/security-settings.component';
import { RequestSettingsComponent } from './request-settings/request-settings.component';
import { MatTreeModule } from '@angular/material/tree';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';

@NgModule({
    providers: [
        { provide: MAT_DATE_LOCALE, useValue: "tr-TR" },
        { provide: NgxMatDateAdapter, useClass: CustomDateAdapter },
        { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: "{ useUtc: true }" }
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        DxToastModule,
        DxDataGridModule,
        DxButtonModule,
        DxBulletModule,
        DxTemplateModule,
        MatExpansionModule,
        InlineSVGModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatDividerModule,
        MatSlideToggleModule,
        MatIconModule,
        NgxMatDatetimePickerModule,
        MatDatepickerModule,
        MatNativeDateModule,
        NgxMatTimepickerModule,
        NgxMatNativeDateModule,
        NgxMatSelectSearchModule,
        MatButtonModule,
        MatTreeModule,
        MatCheckboxModule,
        MatChipsModule,
        RouterModule.forChild([
            {
                path: '',
                component: SystemSettingsComponent
            }
        ])
    ],
    declarations: [
        SystemSettingsComponent,
        AccessSettingsComponent,
        NotificationSettingsComponent,
        ProfileSettingsComponent,
        RequestSettingsComponent,
        SecuritySettingsComponent
    ],
    exports: [
        SystemSettingsComponent,
        AccessSettingsComponent,
        NotificationSettingsComponent,
        ProfileSettingsComponent,
        RequestSettingsComponent,
        SecuritySettingsComponent
    ]
})
export class SystemSettingsModule { }
