import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import CustomStore from 'devextreme/data/custom_store';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CompanyInfoService } from 'src/app/core/services/settings/company-info.service';
import swal from 'sweetalert2';
import { UpdateCompanyModel } from 'src/app/core/models/settings/company-info/company/update-company.model';
import { DatePipe } from '@angular/common';
import { AuthService } from 'src/app/core/services/auth/auth.service';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  providers: [DatePipe]
})
export class CompanyComponent implements OnInit {
  dataSource: any;
  companyForm: FormGroup;
  modalRef: NgbModalRef;
  isEditMode = false;
  currentCompanyId: number | null = null;

  hasListPermission: boolean;
  hasCreatePermission: boolean;
  hasUpdatePermission: boolean;
  hasDeletePermission: boolean;

  @ViewChild('companyModal', { static: true }) companyModal: any;

  constructor(
    private companyInfoService: CompanyInfoService,
    private toastrService: ToastrService,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.setPermissions();

    this.companyForm = this.fb.group({
      name: ['', Validators.required]
    });

    this.dataSource = new CustomStore({
      key: 'id',
      load: () => this.companyInfoService.getCompanies().toPromise()
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
    this.hasListPermission = this.authService.hasPermission('company-list');
    this.hasCreatePermission = this.authService.hasPermission('company-create');
    this.hasUpdatePermission = this.authService.hasPermission('company-update');
    this.hasDeletePermission = this.authService.hasPermission('company-delete');
  }

  openCompanyAddModal() {
    this.isEditMode = false;
    this.currentCompanyId = null;
    this.companyForm.reset({
      name: ''
    });
    this.modalRef = this.modalService.open(this.companyModal, { size: 'lg' });
  }

  openCompanyEditModal(data: any) {
    this.isEditMode = true;
    this.currentCompanyId = data.row.data.id;
    this.companyForm.patchValue(data.row.data);
    this.modalRef = this.modalService.open(this.companyModal, { size: 'lg' });
  }

  closeModal() {
    this.modalRef.close();
  }

  submitForm() {
    if (this.companyForm.valid) {
      const formValues = this.companyForm.value;
      if (this.isEditMode && this.currentCompanyId !== null) {
        const updateModel: UpdateCompanyModel = {
          id: this.currentCompanyId,
          ...formValues
        };
        this.companyInfoService.updateCompany(updateModel).subscribe(
          (response) => {
            this.toastrService.success('Şirket başarıyla güncellendi.', 'Başarılı');
            this.closeModal();
            setTimeout(() => window.location.reload(), 1000);
          },
          (error) => {
            this.toastrService.error('Şirket güncellenirken bir hata oluştu.', 'Hata');
          }
        );
      } else {
        this.companyInfoService.createCompany(formValues).subscribe(
          (response) => {
            this.toastrService.success('Şirket başarıyla eklendi.', 'Başarılı');
            this.closeModal();
            setTimeout(() => window.location.reload(), 1000);
          },
          (error) => {
            this.toastrService.error('Şirket eklenirken bir hata oluştu.', 'Hata');
          }
        );
      }
    } else {
      this.toastrService.warning('Lütfen formu kontrol edin.', 'Uyarı');
    }
  }

  deleteCompany(e: any) {
    swal({
      heightAuto: false,
      title: "Silmek İstediğinize Emin misiniz?",
      text: "'" + e.row.data.name + "' şirketi silinecek!",
      type: 'question',
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: 'Evet, Sil',
      cancelButtonText: 'Hayır',
    }).then((willDelete) => {
      if (willDelete.value) {
        this.companyInfoService.deleteCompany(e.row.data.id).subscribe(res => {
          this.toastrService.success("Şirket Silindi.", "İşlem Başarılı");
          setTimeout(() => window.location.reload(), 1000);
        },
          err => {
            this.toastrService.error("Bir Hata Oluştu. Lütfen Daha Sonra Tekrar Deneyiniz.", "Hata");
          });
      }
    });
  }
}
