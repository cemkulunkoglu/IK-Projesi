import { Component, OnInit, ViewChild } from '@angular/core';
import CustomStore from 'devextreme/data/custom_store';
import { ToastrService } from 'ngx-toastr';
import { CompanyInfoService } from 'src/app/core/services/settings/company-info.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import swal from 'sweetalert2';
import { UpdateBranchOfficeModel } from 'src/app/core/models/settings/company-info/branch-office/update-branch-office.model';

@Component({
  selector: 'app-branch-office',
  templateUrl: './branch-office.component.html'
})
export class BranchOfficeComponent implements OnInit {

  dataSource: CustomStore;
  companyDataList: any[];
  branchOfficeForm: FormGroup;
  modalRef: NgbModalRef;
  isEditMode = false;
  currentBranchOfficeId: number | null = null;

  hasListPermission: boolean;
  hasCreatePermission: boolean;
  hasUpdatePermission: boolean;
  hasDeletePermission: boolean;

  @ViewChild('branchOfficeModal', { static: true }) branchOfficeModal: any;

  constructor(
    private companyInfoService: CompanyInfoService,
    private toastrService: ToastrService,
    private fb: FormBuilder,
    private modalService: NgbModal,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.setPermissions();

    this.branchOfficeForm = this.fb.group({
      name: ['', Validators.required],
      companyId: [null, Validators.required]
    });

    this.SetCompanyDataList();

    this.dataSource = new CustomStore({
      key: 'id',
      load: () => this.companyInfoService.getBranchOffices().toPromise()
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
    this.hasListPermission = this.authService.hasPermission('branch-office-list');
    this.hasCreatePermission = this.authService.hasPermission('branch-office-create');
    this.hasUpdatePermission = this.authService.hasPermission('branch-office-update');
    this.hasDeletePermission = this.authService.hasPermission('branch-office-delete');
  }

  SetCompanyDataList() {
    this.companyInfoService.getCompanies().subscribe(res => {
      this.companyDataList = res;
    });
  }

  openBranchOfficeAddModal() {
    this.isEditMode = false;
    this.currentBranchOfficeId = null;
    this.branchOfficeForm.reset();
    this.modalRef = this.modalService.open(this.branchOfficeModal);
  }

  openBranchOfficeEditModal(data: any) {
    this.isEditMode = true;
    this.currentBranchOfficeId = data.row.data.id;
    this.branchOfficeForm.patchValue(data.row.data);
    this.modalRef = this.modalService.open(this.branchOfficeModal);
  }

  closeModal() {
    this.modalRef.close();
  }

  submitForm() {
    if (this.branchOfficeForm.valid) {
      const formValues = this.branchOfficeForm.value;
      if (this.isEditMode && this.currentBranchOfficeId !== null) {
        const updateModel: UpdateBranchOfficeModel = {
          id: this.currentBranchOfficeId,
          ...formValues
        };
        this.companyInfoService.updateBranchOffice(updateModel).subscribe(
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
        this.companyInfoService.createBranchOffice(formValues).subscribe(
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

  deleteBranchOffice(e: any) {
    swal({
      heightAuto: false,
      title: "Silmek İstediğinize Emin misiniz?",
      text: "'" + e.row.data.name + "' şube silinecek!",
      type: 'question',
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: 'Evet, Sil',
      cancelButtonText: 'Hayır',
    }).then((willDelete) => {
      if (willDelete.value) {
        this.companyInfoService.deleteBranchOffice(e.row.data.id).subscribe(res => {
          this.toastrService.success("Şube Silindi.", "İşlem Başarılı");
          setTimeout(() => window.location.reload(), 1000);
        },
          err => {
            this.toastrService.error("Bir Hata Oluştu. Lütfen Daha Sonra Tekrar Deneyiniz.", "Hata");
          });
      }
    });
  }
}
