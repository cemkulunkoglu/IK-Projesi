import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompanyInfoComponent } from './company-info.component';
import { RouterModule } from '@angular/router';
import { DevExtremeModule, DxBulletModule, DxButtonModule, DxDataGridModule, DxTagBoxModule, DxTemplateModule, DxToastModule } from 'devextreme-angular';
import { HttpClientModule } from '@angular/common/http';
import { CompanyComponent } from './company/company.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { BranchOfficeComponent } from './branch-office/branch-office.component';
import { DepartmentComponent } from './department/department.component';
import { JobTitleComponent } from './job-title/job-title.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { NgxMatDatetimePickerModule, NgxMatTimepickerModule, NgxMatNativeDateModule } from '@angular-material-components/datetime-picker';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@NgModule({
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
    DxTagBoxModule,
    RouterModule.forChild([
      {
        path: '',
        component: CompanyInfoComponent
      }
    ])
  ],
  declarations: [
    CompanyInfoComponent,
    CompanyComponent,
    BranchOfficeComponent,
    DepartmentComponent,
    JobTitleComponent
  ],
  exports: [
    CompanyInfoComponent,
    CompanyComponent,
    BranchOfficeComponent,
    DepartmentComponent,
    JobTitleComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CompanyInfoModule { }
