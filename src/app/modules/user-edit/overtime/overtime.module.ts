import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { DxBulletModule, DxButtonModule, DxDataGridModule, DxTemplateModule, DxToastModule } from 'devextreme-angular';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { NgxMatDatetimePickerModule, NgxMatNativeDateModule, NgxMatTimepickerModule } from '@angular-material-components/datetime-picker';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DateAdapter, MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { MatExpansionModule } from '@angular/material/expansion';
import { CustomDateAdapter } from '../../Request/date-helper';
import { OvertimeComponent } from './overtime.component';
import { OvertimeCreateComponent } from './overtime-create/overtime-create.component';
import { OvertimeUpdateComponent } from './overtime-update/overtime-update.component';
import { MatCheckboxModule } from '@angular/material/checkbox';

@NgModule({
    providers: [
        { provide: MAT_DATE_LOCALE, useValue: "tr-TR" },
        { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: "{ useUtc: true }" },
        { provide: DateAdapter, useClass: CustomDateAdapter }
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
        MatCheckboxModule,
    ],
    declarations: [
        OvertimeComponent,
        OvertimeCreateComponent,
        OvertimeUpdateComponent
    ],
    exports: [
        OvertimeComponent,
        OvertimeCreateComponent,
        OvertimeUpdateComponent
    ]
})
export class OvertimeModule { }
