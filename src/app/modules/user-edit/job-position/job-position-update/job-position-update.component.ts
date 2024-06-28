import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable, ReplaySubject, Subject, Subscription, takeUntil } from 'rxjs';
import { WorkingMethodEnum, WorkingMethodLabelMapping } from 'src/app/core/enums/user/job-position/working-method-enum.model.enum';
import { BaseCompanyModel } from 'src/app/core/models/settings/base-company.model';
import { BranchOfficeModel } from 'src/app/core/models/settings/company-info/branch-office/branch-office.model';
import { CompanyModel } from 'src/app/core/models/settings/company-info/company/company.model';
import { DepartmentModel } from 'src/app/core/models/settings/company-info/department/department.model';
import { JobTitleModel } from 'src/app/core/models/settings/company-info/job-title/job-title.model';
import { CompanyInfoService } from 'src/app/core/services/settings/company-info.service';
import { UserService } from 'src/app/core/services/users/users.service';

@Component({
  selector: 'app-job-position-update',
  templateUrl: './job-position-update.component.html'
})
export class JobPositionUpdateComponent implements OnInit {
  @Output() userJobPositionEdit = new EventEmitter<string>();
  isLoading$: Observable<boolean>;
  isLoadingSubject: BehaviorSubject<boolean>;
  private unsubscribe: Subscription[] = [];

  jobPositionUpdateForm: FormGroup;

  //#region Company
  companyList: Array<CompanyModel>;
  companyFilteredData: ReplaySubject<(CompanyModel)[]> = new ReplaySubject<(CompanyModel)[]>(1);
  companySearch: FormControl = new FormControl();
  selectedCompanyId: number;
  selectedCompany: number;
  //#endregion

  //#region BranchOffice
  branchOfficeList: Array<BranchOfficeModel>;
  branchOfficeFilteredData: ReplaySubject<(BranchOfficeModel)[]> = new ReplaySubject<(BranchOfficeModel)[]>(1);
  branchOfficeSearch: FormControl = new FormControl();
  selectedBranchOfficeId: number;
  selectedBranchOffice: number;
  //#endregion

  //#region Department
  departmentList: Array<DepartmentModel>;
  departmentFilteredData: ReplaySubject<(DepartmentModel)[]> = new ReplaySubject<(DepartmentModel)[]>(1);
  departmentSearch: FormControl = new FormControl();
  selectedDepartmentId: number;
  selectedDepartment: number;
  //#endregion

  //#region JobTitle
  jobTitleList: Array<JobTitleModel>;
  jobTitleFilteredData: ReplaySubject<(JobTitleModel)[]> = new ReplaySubject<(JobTitleModel)[]>(1);
  jobTitleSearch: FormControl = new FormControl();
  selectedJobTitleId: number;
  selectedJobTitle: number;
  //#endregion

  //#region Manager
  managerList: Array<BaseCompanyModel>;
  managerFilteredData: ReplaySubject<(BaseCompanyModel)[]> = new ReplaySubject<(BaseCompanyModel)[]>(1);
  managerSearch: FormControl = new FormControl();
  selectedManagerId: number;
  selectedManager: number;
  //#endregion

  //#region WorkingMethod
  workingMethodLabelMapping = WorkingMethodLabelMapping;
  workingMethodSources = Object.values(WorkingMethodEnum).filter(value => typeof value === 'number');
  //#endregion
  @Input() jobPositionId: number;

  _onDestroy = new Subject<void>();
  message: string;

  constructor(private fb: FormBuilder,
    private companyInfoService: CompanyInfoService,
    private userService: UserService,
    private toastrService: ToastrService) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.isLoading$ = this.isLoadingSubject.asObservable();

    this.companyInfoService.getCompanies().subscribe(res => {
      this.companyList = res;
      this.filterCompanyData();
    });
  }

  ngOnInit() {
    this.jobPositionUpdateForm = this.fb.group({
      id: [],
      userId: [],
      companyId: [],
      branchOfficeId: [],
      departmentId: [],
      jobTitleId: ["", Validators.required],
      approvalProcessUnitId: [],
      managerId: [],
      workingMethod: [],
      startDate: ["", Validators.required],
      endDate: []
    });

    this.userService.getUserJobPositionById(this.jobPositionId).subscribe(res => {
      this.jobPositionUpdateForm.controls["id"].setValue(res.data.id);
      this.jobPositionUpdateForm.controls["userId"].setValue(res.data.userId);
      if (res.data.companyId != null && res.data.branchOfficeId != null && res.data.departmentId != null) {
        this.companyInfoService.getBranchOfficesByCompanyId(res.data.companyId).subscribe(r => { this.branchOfficeList = r; this.filterBranchOfficeData(); });
        this.companyInfoService.getDepartmentByBranchOfficesId(res.data.branchOfficeId).subscribe(r => {
          this.departmentList = r;
          this.filterDepartmentData();
          this.managerList = r.filter(f => f.id == res.data.departmentId)[0].managers;
          this.filterManagerData();
        });
        this.companyInfoService.getJobTitleByDepartmentId(res.data.departmentId).subscribe(r => { this.jobTitleList = r; this.filterJobTitleData(); });
      }
      this.jobPositionUpdateForm.controls["companyId"].setValue(res.data.companyId);
      this.jobPositionUpdateForm.controls["branchOfficeId"].setValue(res.data.branchOfficeId);
      this.jobPositionUpdateForm.controls["departmentId"].setValue(res.data.departmentId);
      this.jobPositionUpdateForm.controls["jobTitleId"].setValue(res.data.jobTitleId);
      this.jobPositionUpdateForm.controls["managerId"].setValue(res.data.managerId);
      this.jobPositionUpdateForm.controls["approvalProcessUnitId"].setValue(res.data.approvalProcessUnitId);
      this.jobPositionUpdateForm.controls["workingMethod"].setValue(res.data.workingMethod);
      this.jobPositionUpdateForm.controls["startDate"].setValue(res.data.startDate);
      this.jobPositionUpdateForm.controls["endDate"].setValue(res.data.endDate);
    });

    this.companySearch.valueChanges.pipe(takeUntil(this._onDestroy)).subscribe(() => { this.filterCompanyData(); });
    this.branchOfficeSearch.valueChanges.pipe(takeUntil(this._onDestroy)).subscribe(() => { this.filterBranchOfficeData(); });
    this.departmentSearch.valueChanges.pipe(takeUntil(this._onDestroy)).subscribe(() => { this.filterDepartmentData(); });
    this.jobTitleSearch.valueChanges.pipe(takeUntil(this._onDestroy)).subscribe(() => { this.filterJobTitleData(); });
    this.managerSearch.valueChanges.pipe(takeUntil(this._onDestroy)).subscribe(() => { this.filterManagerData(); });
  }

  ngOnDestroy(): void {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  onChangeCompany() {
    this.companyInfoService.getBranchOfficesByCompanyId(this.selectedCompanyId).subscribe(res => { this.branchOfficeList = res; this.filterBranchOfficeData(); });
  }

  onChangeBranchOffice() {
    this.companyInfoService.getDepartmentByBranchOfficesId(this.selectedBranchOfficeId).subscribe(res => { this.departmentList = res; this.filterDepartmentData(); });
  }

  onChangeDepartment() {
    this.companyInfoService.getJobTitleByDepartmentId(this.selectedDepartmentId).subscribe(res => { this.jobTitleList = res; this.filterJobTitleData(); });
    this.managerList = this.departmentList.filter(f => f.id == this.selectedDepartmentId)[0].managers;
    this.filterManagerData();
  }
  adjustForTimezone(date: Date): Date {
    var timeOffsetInMS: number = date.getTimezoneOffset() * 60000;
    date.setTime(date.getTime() - timeOffsetInMS);
    return date;
};
  saveJobPosition() {
    this.isLoadingSubject.next(true);
    this.message = "";
    if (this.jobPositionUpdateForm.valid) {
      this.jobPositionUpdateForm.value.startDate = this.adjustForTimezone(new Date(this.jobPositionUpdateForm.value.startDate));
      if(this.jobPositionUpdateForm.value.endDate!=null){

        this.jobPositionUpdateForm.value.endDate = this.adjustForTimezone(new Date(this.jobPositionUpdateForm.value.endDate));
      }
      this.userService.updateUserJobPosition(this.jobPositionUpdateForm.value).subscribe(
        res => {
          if (res.data == 0) {
            this.toastrService.warning(res.messages[0].toString());
            this.isLoadingSubject.next(false);
            this.userJobPositionEdit.emit("true");
          } else {
            this.toastrService.success("İşlem Başarılı");
            this.isLoadingSubject.next(false);
            this.userJobPositionEdit.emit("true");
          }
        },
        err => {
          err.error.messages.forEach(element => {
            this.message += element + '. ';
          });
          this.toastrService.error(this.message, "Hata");
          this.isLoadingSubject.next(false);
          this.userJobPositionEdit.emit("true");
        }
      );
    } else {
      this.toastrService.warning("Formu Kontrol Ediniz.", "Uyarı");
      this.isLoadingSubject.next(false);
    }
  }


  filterCompanyData() {
    let search = this.companySearch.value;
    if (!search) {
      this.companyFilteredData.next(this.companyList.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.companyFilteredData.next(
      this.companyList.filter(
        (x: any) => x.name.toLowerCase().indexOf(search) > -1
      )
    );
  };

  filterBranchOfficeData() {
    let search = this.branchOfficeSearch.value;
    if (!search) {
      this.branchOfficeFilteredData.next(this.branchOfficeList.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.branchOfficeFilteredData.next(
      this.branchOfficeList.filter(
        (x: any) => x.name.toLowerCase().indexOf(search) > -1
      )
    );
  };

  filterDepartmentData() {
    let search = this.departmentSearch.value;
    if (!search) {
      this.departmentFilteredData.next(this.departmentList.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.departmentFilteredData.next(
      this.departmentList.filter(
        (x: any) => x.name.toLowerCase().indexOf(search) > -1
      )
    );
  };

  filterJobTitleData() {
    let search = this.jobTitleSearch.value;
    if (!search) {
      this.jobTitleFilteredData.next(this.jobTitleList.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.jobTitleFilteredData.next(
      this.jobTitleList.filter(
        (x: any) => x.name.toLowerCase().indexOf(search) > -1
      )
    );
  };

  filterManagerData() {
    let search = this.managerSearch.value;
    if (!search) {
      this.managerFilteredData.next(this.managerList.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.managerFilteredData.next(
      this.managerList.filter(
        (x: any) => x.name.toLowerCase().indexOf(search) > -1
      )
    );
  };
}
