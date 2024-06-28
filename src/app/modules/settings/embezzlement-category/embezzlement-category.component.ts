import { Component, OnInit, ViewChild } from '@angular/core';
import CustomStore from 'devextreme/data/custom_store';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { EmbezzlementCategoryCreateModel } from 'src/app/core/models/users/embezzlement-category/embezzlement-category-create.model';
import { EmbezzlementCategoryUpdateModel } from 'src/app/core/models/users/embezzlement-category/embezzlement-category-update.model';
import { EmbezzlementCategoryService } from 'src/app/core/services/settings/embezzlement-category.service';
import swal from 'sweetalert2';
import { GridUtil } from 'src/app/_metronic/kt/_utils/GridUtil';
import { AuthService } from 'src/app/core/services/auth/auth.service';

@Component({
  selector: 'app-embezzlement-category',
  templateUrl: './embezzlement-category.component.html',
  styleUrls: ['./embezzlement-category.component.scss']
})
export class EmbezzlementCategoryComponent implements OnInit {
  dataSource: CustomStore;
  categoryForm: FormGroup;
  modalRef: NgbModalRef;
  isEditMode = false;
  currentCategoryId: number | null = null;

  hasListPermission: boolean;
  hasCreatePermission: boolean;
  hasUpdatePermission: boolean;
  hasDeletePermission: boolean;

  @ViewChild('categoryModal', { static: true }) categoryModal: any;

  constructor(
    private embezzlementCategoryService: EmbezzlementCategoryService,
    private toastrService: ToastrService,
    private fb: FormBuilder,
    private modalService: NgbModal,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.setPermissions();

    this.categoryForm = this.fb.group({
      name: ['', Validators.required]
    });

    this.dataSource = new CustomStore({
      key: 'id',
      load: () => GridUtil.handleGridResponse(this.embezzlementCategoryService.getEmbezzlementCategories())
    });
  }

  setPermissions() {
    this.hasListPermission = this.authService.hasPermission('user-embezzlement-category-list');
    this.hasCreatePermission = this.authService.hasPermission('create-embezzlement-category');
    this.hasUpdatePermission = this.authService.hasPermission('update-embezzlement-category');
    this.hasDeletePermission = this.authService.hasPermission('delete-embezzlement-category');
  }

  openCategoryAddModal() {
    this.isEditMode = false;
    this.currentCategoryId = null;
    this.categoryForm.reset({ name: '' });
    this.modalRef = this.modalService.open(this.categoryModal, { size: 'lg' });
  }

  openCategoryEditModal(data: any) {
    this.isEditMode = true;
    this.currentCategoryId = data.row.data.id;
    this.categoryForm.patchValue(data.row.data);
    this.modalRef = this.modalService.open(this.categoryModal, { size: 'lg' });
  }

  closeModal() {
    this.modalRef.close();
  }

  submitForm() {
    if (this.categoryForm.valid) {
      const values = {
        ...this.categoryForm.value,
        name: this.categoryForm.value.name.toUpperCase()
      };

      if (this.isEditMode && this.currentCategoryId !== null) {
        const updateModel: EmbezzlementCategoryUpdateModel = {
          id: this.currentCategoryId,
          ...values
        };
        this.embezzlementCategoryService.updateEmbezzlementCategory(updateModel).subscribe(
          (response) => {
            this.toastrService.success('Zimmet Kategorisi başarıyla güncellendi.', 'Başarılı');
            this.closeModal();
            setTimeout(() => window.location.reload(), 1000);
          },
          (error) => {
            this.toastrService.error('Zimmet Kategorisi güncellenirken bir hata oluştu.', 'Hata');
          }
        );
      } else {
        this.embezzlementCategoryService.createEmbezzlementCategory(values).subscribe(
          (response) => {
            this.toastrService.success('Zimmet Kategorisi başarıyla eklendi.', 'Başarılı');
            this.closeModal();
            setTimeout(() => window.location.reload(), 1000);
          },
          (error) => {
            this.toastrService.error('Zimmet Kategorisi eklenirken bir hata oluştu.', 'Hata');
          }
        );
      }
    } else {
      this.toastrService.warning('Lütfen formu kontrol edin.', 'Uyarı');
    }
  }

  deleteCategory(e) {
    swal({
      heightAuto: false,
      title: "Silmek İstediğinize Emin misiniz?",
      text: "'" + e.row.data.name + "' kategorisi silinecek!",
      type: 'question',
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: 'Evet, Sil',
      cancelButtonText: 'Hayır',
    }).then((willDelete) => {
      if (willDelete.value) {
        this.embezzlementCategoryService.deleteEmbezzlementCategory(e.row.data.id).subscribe(res => {
          this.toastrService.success("Zimmet Kategorisi Silindi.", "İşlem Başarılı");
          setTimeout(() => window.location.reload(), 1000);
        },
          err => {
            this.toastrService.error("Bir Hata Oluştu. Lütfen Daha Sonra Tekrar Deneyiniz.", "Hata");
          });
      }
    });
  }
}
