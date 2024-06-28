import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { DxBulletModule, DxButtonModule, DxDataGridModule, DxTemplateModule } from 'devextreme-angular';
import { MatExpansionModule } from '@angular/material/expansion';
import { RouterModule } from '@angular/router';
import { UsersComponent } from './users.component';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { CustomDateAdapter } from '../Request/date-helper';
import { NgxMatDateAdapter } from '@angular-material-components/datetime-picker';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';

@NgModule({
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: "tr-TR" },
    { provide: NgxMatDateAdapter, useClass: CustomDateAdapter },
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: "{ useUtc: true }" }
  ],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    DxDataGridModule,
    DxButtonModule,
    DxBulletModule,
    DxTemplateModule,
    MatExpansionModule,
    MatDialogModule,
    ReactiveFormsModule,
    InlineSVGModule,
    MatSelectModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatInputModule,
    MatButtonModule,
    RouterModule.forChild([
      {
        path: '',
        component: UsersComponent
      }
    ])
  ],
  declarations: [UsersComponent]
})
export class UsersModule { }
