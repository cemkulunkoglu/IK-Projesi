import { Component, OnInit, ViewChild } from '@angular/core';
import CustomStore from 'devextreme/data/custom_store';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DocumentTypeCreateModel } from 'src/app/core/models/settings/document-type/document-type-create.model';
import { DocumentTypeUpdateModel } from 'src/app/core/models/settings/document-type/document-type-update.model';
import { DocumentTypeService } from 'src/app/core/services/settings/document-type.service';
import swal from 'sweetalert2';
import { GridUtil } from 'src/app/_metronic/kt/_utils/GridUtil';
import { AuthService } from 'src/app/core/services/auth/auth.service';

@Component({
  selector: 'app-document-type',
  templateUrl: './document-type.component.html',
  styleUrls: ['./document-type.component.scss']
})
export class DocumentTypeComponent implements OnInit {
  dataSource: CustomStore;
  documentTypeForm: FormGroup;
  modalRef: NgbModalRef;
  isEditMode = false;
  currentDocumentTypeId: number | null = null;

  hasListPermission: boolean;
  hasCreatePermission: boolean;
  hasUpdatePermission: boolean;
  hasDeletePermission: boolean;

  @ViewChild('documentTypeModal', { static: true }) documentTypeModal: any;

  constructor(
    private documentTypeService: DocumentTypeService,
    private toastrService: ToastrService,
    private fb: FormBuilder,
    private modalService: NgbModal,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.setPermissions();

    this.documentTypeForm = this.fb.group({
      name: ['', Validators.required]
    });

    this.dataSource = new CustomStore({
      key: 'id',
      load: () => GridUtil.handleGridResponse(this.documentTypeService.getDocumentTypes())
    });
  }

  setPermissions() {
    this.hasListPermission = this.authService.hasPermission('document-type-list');
    this.hasCreatePermission = this.authService.hasPermission('document-type-create');
    this.hasUpdatePermission = this.authService.hasPermission('document-type-update');
    this.hasDeletePermission = this.authService.hasPermission('document-type-delete');
  }

  openDocumentTypeAddModal() {
    this.isEditMode = false;
    this.currentDocumentTypeId = null;
    this.documentTypeForm.reset({ name: '' });
    this.modalRef = this.modalService.open(this.documentTypeModal, { size: 'lg' });
  }

  openDocumentTypeEditModal(data: any) {
    this.isEditMode = true;
    this.currentDocumentTypeId = data.row.data.id;
    this.documentTypeForm.patchValue(data.row.data);
    this.modalRef = this.modalService.open(this.documentTypeModal, { size: 'lg' });
  }

  closeModal() {
    this.modalRef.close();
  }

  submitForm() {
    if (this.documentTypeForm.valid) {
      const values = {
        ...this.documentTypeForm.value,
        name: this.documentTypeForm.value.name.toUpperCase()
      };

      if (this.isEditMode && this.currentDocumentTypeId !== null) {
        const updateModel: DocumentTypeUpdateModel = {
          id: this.currentDocumentTypeId,
          ...values
        };
        this.documentTypeService.updateDocumentType(updateModel).subscribe(
          (response) => {
            this.toastrService.success('Döküman Tipi başarıyla güncellendi.', 'Başarılı');
            this.closeModal();
            setTimeout(() => window.location.reload(), 1000);
          },
          (error) => {
            this.toastrService.error('Döküman Tipi güncellenirken bir hata oluştu.', 'Hata');
          }
        );
      } else {
        this.documentTypeService.createDocumentType(values).subscribe(
          (response) => {
            this.toastrService.success('Döküman Tipi başarıyla eklendi.', 'Başarılı');
            this.closeModal();
            setTimeout(() => window.location.reload(), 1000);
          },
          (error) => {
            this.toastrService.error('Döküman Tipi eklenirken bir hata oluştu.', 'Hata');
          }
        );
      }
    } else {
      this.toastrService.warning('Lütfen formu kontrol edin.', 'Uyarı');
    }
  }

  deleteDocumentType(e) {
    swal({
      heightAuto: false,
      title: "Silmek İstediğinize Emin misiniz?",
      text: "'" + e.row.data.name + "' Döküman tipi silinecek!",
      type: 'question',
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: 'Evet, Sil',
      cancelButtonText: 'Hayır',
    }).then((willDelete) => {
      if (willDelete.value) {
        this.documentTypeService.deleteDocumentType(e.row.data.id).subscribe(res => {
          this.toastrService.success("Döküman Tipi Silindi.", "İşlem Başarılı");
          setTimeout(() => window.location.reload(), 1000);
        },
          err => {
            this.toastrService.error("Bir Hata Oluştu. Lütfen Daha Sonra Tekrar Deneyiniz.", "Hata");
          });
      }
    });
  }
}
