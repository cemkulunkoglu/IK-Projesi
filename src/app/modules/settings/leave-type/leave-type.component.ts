import { Component, OnInit, ViewChild } from '@angular/core';
import CustomStore from 'devextreme/data/custom_store';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { LeaveTypeCreateModel } from 'src/app/core/models/settings/leave-type/leave-type-create-model';
import { LeaveTypeUpdateModel } from 'src/app/core/models/settings/leave-type/leave-type-update.model';
import { LeaveTypeService } from 'src/app/core/services/settings/leave-type.service';
import swal from 'sweetalert2';
import { GridUtil } from 'src/app/_metronic/kt/_utils/GridUtil';
import { AuthService } from 'src/app/core/services/auth/auth.service';

@Component({
  selector: 'app-leave-type',
  templateUrl: './leave-type.component.html',
  styleUrls: ['./leave-type.component.scss']
})
export class LeaveTypeComponent implements OnInit {
  dataSource: CustomStore;
  leaveTypeForm: FormGroup;
  modalRef: NgbModalRef;
  isEditMode = false;
  currentLeaveTypeId: number | null = null;

  hasListPermission: boolean;
  hasCreatePermission: boolean;
  hasUpdatePermission: boolean;
  hasDeletePermission: boolean;

  @ViewChild('leaveTypeModal', { static: true }) leaveTypeModal: any;

  constructor(
    private leaveTypeService: LeaveTypeService,
    private toastrService: ToastrService,
    private fb: FormBuilder,
    private modalService: NgbModal,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.setPermissions();

    this.leaveTypeForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      isFree: [false, Validators.required],
      day: [0, [Validators.required, Validators.min(1)]]
    });

    this.dataSource = new CustomStore({
      key: 'id',
      load: () => GridUtil.handleGridResponse(this.leaveTypeService.getLeaveTypes())
    });
  }

  setPermissions() {
    this.hasListPermission = this.authService.hasPermission('user-leave-list');
    this.hasCreatePermission = this.authService.hasPermission('create-user-leave');
    this.hasUpdatePermission = this.authService.hasPermission('update-user-leave');
    this.hasDeletePermission = this.authService.hasPermission('delete-user-leave');
  }

  openLeaveTypeAddModal() {
    this.isEditMode = false;
    this.currentLeaveTypeId = null;
    this.leaveTypeForm.reset({ name: '', description: '', isFree: false, day: 0 });
    this.modalRef = this.modalService.open(this.leaveTypeModal, { size: 'lg' });
  }

  openLeaveTypeEditModal(data: any) {
    this.isEditMode = true;
    this.currentLeaveTypeId = data.row.data.id;
    this.leaveTypeForm.patchValue(data.row.data);
    this.modalRef = this.modalService.open(this.leaveTypeModal, { size: 'lg' });
  }

  closeModal() {
    this.modalRef.close();
  }

  submitForm() {
    if (this.leaveTypeForm.valid) {
      const values = this.leaveTypeForm.value;

      if (this.isEditMode && this.currentLeaveTypeId !== null) {
        const updateModel: LeaveTypeUpdateModel = {
          id: this.currentLeaveTypeId,
          ...values
        };
        this.leaveTypeService.updateLeaveType(updateModel).subscribe(
          (response) => {
            this.toastrService.success('İzin Kategorisi başarıyla güncellendi.', 'Başarılı');
            this.closeModal();
            setTimeout(() => window.location.reload(), 1000);
          },
          (error) => {
            this.toastrService.error('İzin Kategorisi güncellenirken bir hata oluştu.', 'Hata');
          }
        );
      } else {
        const createModel: LeaveTypeCreateModel = {
          ...values
        };
        this.leaveTypeService.createLeaveType(createModel).subscribe(
          (response) => {
            this.toastrService.success('İzin Kategorisi başarıyla eklendi.', 'Başarılı');
            this.closeModal();
            setTimeout(() => window.location.reload(), 1000);
          },
          (error) => {
            this.toastrService.error('İzin Kategorisi eklenirken bir hata oluştu.', 'Hata');
          }
        );
      }
    } else {
      this.toastrService.warning('Lütfen formu kontrol edin.', 'Uyarı');
    }
  }

  deleteLeaveType(e) {
    swal({
      heightAuto: false,
      title: "Silmek İstediğinize Emin misiniz?",
      text: "'" + e.row.data.name + "' izin kategorisi silinecek!",
      type: 'question',
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: 'Evet, Sil',
      cancelButtonText: 'Hayır',
    }).then((willDelete) => {
      if (willDelete.value) {
        this.leaveTypeService.deleteLeaveType(e.row.data.id).subscribe(res => {
          this.toastrService.success("İzin Kategorisi Silindi.", "İşlem Başarılı");
          setTimeout(() => window.location.reload(), 1000);
        },
          err => {
            this.toastrService.error("Bir Hata Oluştu. Lütfen Daha Sonra Tekrar Deneyiniz.", "Hata");
          });
      }
    });
  }
}
