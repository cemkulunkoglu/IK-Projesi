import { Component, OnInit, ViewChild } from '@angular/core';
import CustomStore from 'devextreme/data/custom_store';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs';
import { GridUtil } from 'src/app/_metronic/kt/_utils/GridUtil';
import { CreateJobTitleModel } from 'src/app/core/models/settings/company-info/job-title/create-job-title.model';
import { UpdateJobTitleModel } from 'src/app/core/models/settings/company-info/job-title/update-job-title.model';
import { CompanyInfoService } from 'src/app/core/services/settings/company-info.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/core/services/auth/auth.service';

@Component({
  selector: 'app-job-title',
  templateUrl: './job-title.component.html'
})
export class JobTitleComponent implements OnInit {

  dataSource: CustomStore;
  departmentDataList: any[];
  jobTitleForm: FormGroup;
  modalRef: NgbModalRef;
  isEditMode = false;
  currentJobTitleId: number | null = null;

  hasListPermission: boolean;
  hasCreatePermission: boolean;
  hasUpdatePermission: boolean;
  hasDeletePermission: boolean;

  @ViewChild('jobTitleModal', { static: true }) jobTitleModal: any;

  constructor(
    private companyInfoService: CompanyInfoService,
    private toastrService: ToastrService,
    private fb: FormBuilder,
    private modalService: NgbModal,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.setPermissions();

    this.jobTitleForm = this.fb.group({
      name: ['', Validators.required],
      departmentId: [null, Validators.required]
    });

    this.SetDepartmentDataList();

    this.dataSource = new CustomStore({
      key: 'id',
      load: () => this.companyInfoService.getJobTitles().toPromise()
        .then(data => ({
          data: data,
          totalCount: data.length
        }))
        .catch(error => {
          throw error;
        })
    });
  }

  setPermissions() {
    this.hasListPermission = this.authService.hasPermission('job-title-list');
    this.hasCreatePermission = this.authService.hasPermission('job-title-create');
    this.hasUpdatePermission = this.authService.hasPermission('job-title-update');
    this.hasDeletePermission = this.authService.hasPermission('job-title-delete');
  }

  SetDepartmentDataList() {
    this.companyInfoService.getDepartments().subscribe(res => {
      this.departmentDataList = res;
    });
  }

  openJobTitleAddModal() {
    this.isEditMode = false;
    this.currentJobTitleId = null;
    this.jobTitleForm.reset();
    this.modalRef = this.modalService.open(this.jobTitleModal);
  }

  openJobTitleEditModal(data: any) {
    this.isEditMode = true;
    this.currentJobTitleId = data.row.data.id;
    this.jobTitleForm.patchValue(data.row.data);
    this.modalRef = this.modalService.open(this.jobTitleModal);
  }

  closeModal() {
    this.modalRef.close();
  }

  submitForm() {
    if (this.jobTitleForm.valid) {
      const formValues = this.jobTitleForm.value;
      if (this.isEditMode && this.currentJobTitleId !== null) {
        const updateModel: UpdateJobTitleModel = {
          id: this.currentJobTitleId,
          ...formValues
        };
        this.companyInfoService.updateJobTitle(updateModel).subscribe(
          (response) => {
            this.toastrService.success('Ünvan başarıyla güncellendi.', 'Başarılı');
            this.closeModal();
            setTimeout(() => window.location.reload(), 1000);
          },
          (error) => {
            this.toastrService.error('Ünvan güncellenirken bir hata oluştu.', 'Hata');
          }
        );
      } else {
        this.companyInfoService.createJobTitle(formValues).subscribe(
          (response) => {
            this.toastrService.success('Ünvan başarıyla eklendi.', 'Başarılı');
            this.closeModal();
            setTimeout(() => window.location.reload(), 1000);
          },
          (error) => {
            this.toastrService.error('Ünvan eklenirken bir hata oluştu.', 'Hata');
          }
        );
      }
    } else {
      this.toastrService.warning('Lütfen formu kontrol edin.', 'Uyarı');
    }
  }

  deleteJobTitle(e: any) {
    this.companyInfoService.deleteJobTitle(e.row.data.id).subscribe(res => {
      this.toastrService.success("Ünvan Silindi.", "Başarılı");
      this.dataSource.load();
    }, err => {
      this.toastrService.error("Bir Hata Oluştu. Lütfen Daha Sonra Tekrar Deneyiniz.", "Hata");
    });
  }
}
