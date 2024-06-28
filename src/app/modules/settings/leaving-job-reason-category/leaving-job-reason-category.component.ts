import { Component, OnInit, ViewChild } from '@angular/core';
import CustomStore from 'devextreme/data/custom_store';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { LeavingJobReasonCategoryCreateModel } from 'src/app/core/models/users/leaving-job-reason/leaving-job-reason-category-create.model';
import { LeavingJobReasonCategoryUpdateModel } from 'src/app/core/models/users/leaving-job-reason/leaving-job-reason-category-update.model';
import { LeavingJobReasonCategoryService } from 'src/app/core/services/users/leaving-job-reason-category.service';
import swal from 'sweetalert2';
import { GridUtil } from 'src/app/_metronic/kt/_utils/GridUtil';

@Component({
    selector: 'app-leaving-job-reason-category',
    templateUrl: './leaving-job-reason-category.component.html',
    styleUrls: ['./leaving-job-reason-category.component.scss']
})
export class LeavingJobReasonCategoryComponent implements OnInit {
    dataSource: CustomStore;
    leavingJobReasonCategoryForm: FormGroup;
    modalRef: NgbModalRef;
    isEditMode = false;
    currentCategoryId: number | null = null;

    @ViewChild('leavingJobReasonCategoryModal', { static: true }) leavingJobReasonCategoryModal: any;

    constructor(
        private leavingJobReasonCategoryService: LeavingJobReasonCategoryService,
        private toastrService: ToastrService,
        private fb: FormBuilder,
        private modalService: NgbModal
    ) { }

    ngOnInit(): void {
        this.leavingJobReasonCategoryForm = this.fb.group({
            name: ['', Validators.required]
        });

        this.dataSource = new CustomStore({
            key: 'id',
            load: () => GridUtil.handleGridResponse(this.leavingJobReasonCategoryService.getLeavingJobReasonCategories())
        });
    }

    openLeavingJobReasonCategoryAddModal() {
        this.isEditMode = false;
        this.currentCategoryId = null;
        this.leavingJobReasonCategoryForm.reset({ name: '' });
        this.modalRef = this.modalService.open(this.leavingJobReasonCategoryModal, { size: 'lg' });
    }

    openLeavingJobReasonCategoryEditModal(data: any) {
        this.isEditMode = true;
        this.currentCategoryId = data.row.data.id;
        this.leavingJobReasonCategoryForm.patchValue(data.row.data);
        this.modalRef = this.modalService.open(this.leavingJobReasonCategoryModal, { size: 'lg' });
    }

    closeModal() {
        this.modalRef.close();
    }

    submitForm() {
        if (this.leavingJobReasonCategoryForm.valid) {
            const values = {
                ...this.leavingJobReasonCategoryForm.value,
                name: this.leavingJobReasonCategoryForm.value.name.toUpperCase()
            };

            if (this.isEditMode && this.currentCategoryId !== null) {
                const updateModel: LeavingJobReasonCategoryUpdateModel = {
                    id: this.currentCategoryId,
                    ...values
                };
                this.leavingJobReasonCategoryService.updateLeavingJobReasonCategory(updateModel).subscribe(
                    (response) => {
                        this.toastrService.success('Ayrılma Nedeni Kategorisi başarıyla güncellendi.', 'Başarılı');
                        this.closeModal();
                        setTimeout(() => window.location.reload(), 1000);
                    },
                    (error) => {
                        this.toastrService.error('Ayrılma Nedeni Kategorisi güncellenirken bir hata oluştu.', 'Hata');
                    }
                );
            } else {
                this.leavingJobReasonCategoryService.createLeavingJobReasonCategory(values).subscribe(
                    (response) => {
                        this.toastrService.success('Ayrılma Nedeni Kategorisi başarıyla eklendi.', 'Başarılı');
                        this.closeModal();
                        setTimeout(() => window.location.reload(), 1000);
                    },
                    (error) => {
                        this.toastrService.error('Ayrılma Nedeni Kategorisi eklenirken bir hata oluştu.', 'Hata');
                    }
                );
            }
        } else {
            this.toastrService.warning('Lütfen formu kontrol edin.', 'Uyarı');
        }
    }

    deleteLeavingJobReasonCategory(e) {
        swal({
            heightAuto: false,
            title: "Silmek İstediğinize Emin misiniz?",
            text: "'" + e.row.data.name + "' ayrılma nedeni kategorisi silinecek!",
            type: 'question',
            showConfirmButton: true,
            showCancelButton: true,
            confirmButtonText: 'Evet, Sil',
            cancelButtonText: 'Hayır',
        }).then((willDelete) => {
            if (willDelete.value) {
                this.leavingJobReasonCategoryService.deleteLeavingJobReasonCategory(e.row.data.id).subscribe(res => {
                    this.toastrService.success("Ayrılma Nedeni Kategorisi Silindi.", "İşlem Başarılı");
                    setTimeout(() => window.location.reload(), 1000);
                },
                    err => {
                        this.toastrService.error("Bir Hata Oluştu. Lütfen Daha Sonra Tekrar Deneyiniz.", "Hata");
                    });
            }
        });
    }
}
