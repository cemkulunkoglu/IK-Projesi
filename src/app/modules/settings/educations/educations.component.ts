import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import CustomStore from 'devextreme/data/custom_store';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EducationsService } from 'src/app/core/services/settings/educations.service';
import swal from 'sweetalert2';
import { UpdateEducationModel } from 'src/app/core/models/settings/educations/update-educations.model';
import { DatePipe } from '@angular/common';
import { AuthService } from 'src/app/core/services/auth/auth.service';

@Component({
    selector: 'app-educations',
    templateUrl: './educations.component.html',
    styleUrls: ['./educations.component.scss'],
    providers: [DatePipe]
})
export class EducationsComponent implements OnInit {
    dataSource: any;
    educationForm: FormGroup;
    modalRef: NgbModalRef;
    isEditMode = false;
    currentEducationId: number | null = null;

    minDate: Date = new Date();
    defaultStartTime: any;
    defaultEndTime: any;
    defaultValidityTime: any;

    hasListPermission: boolean;
    hasCreatePermission: boolean;
    hasUpdatePermission: boolean;
    hasDeletePermission: boolean;

    @ViewChild('educationModal', { static: true }) educationModal: any;

    constructor(
        private educationsService: EducationsService,
        private toastrService: ToastrService,
        private modalService: NgbModal,
        private fb: FormBuilder,
        private datePipe: DatePipe,
        private authService: AuthService
    ) { }

    ngOnInit(): void {
        this.setPermissions();

        this.educationForm = this.fb.group({
            name: ['', Validators.required],
            educator: ['', Validators.required],
            description: ['', Validators.required],
            startDate: [null, Validators.required],
            endDate: [null, Validators.required],
            validity: [null, Validators.required],
            educationProvider: ['', Validators.required],
            location: ['', Validators.required]
        });

        this.dataSource = new CustomStore({
            key: 'id',
            load: () => this.educationsService.getEducations().toPromise()
                .then(data => ({
                    data: data,
                    totalCount: data.length
                }))
                .catch(error => {
                    this.toastrService.error('Eğitim verileri yüklenirken bir hata oluştu.', 'Hata');
                    throw error;
                })
        });
    }

    setPermissions() {
        this.hasListPermission = this.authService.hasPermission('education-list');
        this.hasCreatePermission = this.authService.hasPermission('create-education');
        this.hasUpdatePermission = this.authService.hasPermission('update-education');
        this.hasDeletePermission = this.authService.hasPermission('delete-education');
    }

    openEducationAddModal() {
        this.isEditMode = false;
        this.currentEducationId = null;
        this.educationForm.reset({
            name: '',
            educator: '',
            description: '',
            startDate: null,
            endDate: null,
            validity: null,
            educationProvider: '',
            location: ''
        });
        this.modalRef = this.modalService.open(this.educationModal, { size: 'lg' });
    }

    openEducationEditModal(data: any) {
        this.isEditMode = true;
        this.currentEducationId = data.row.data.id;
        data.row.data.startDate = new Date(data.row.data.startDate);
        data.row.data.endDate = new Date(data.row.data.endDate);
        data.row.data.validity = new Date(data.row.data.validity);
        this.educationForm.patchValue(data.row.data);
        this.modalRef = this.modalService.open(this.educationModal, { size: 'lg' });
    }

    closeModal() {
        this.modalRef.close();
    }

    adjustForTimezone(date: string): string {
        let localDate = new Date(date);
        return this.datePipe.transform(localDate, 'yyyy-MM-ddTHH:mm:ss')!;
    }

    formatDateForInput(date: Date): string {
        return this.datePipe.transform(date, 'yyyy-MM-ddTHH:mm:ss')!;
    }

    submitForm() {
        if (this.educationForm.valid) {
            const adjustedValues = {
                ...this.educationForm.value,
                startDate: this.adjustForTimezone(this.educationForm.value.startDate),
                endDate: this.adjustForTimezone(this.educationForm.value.endDate),
                validity: this.adjustForTimezone(this.educationForm.value.validity)
            };

            if (this.isEditMode && this.currentEducationId !== null) {
                const updateModel: UpdateEducationModel = {
                    id: this.currentEducationId,
                    ...adjustedValues
                };
                this.educationsService.updateEducation(updateModel).subscribe(
                    (response) => {
                        this.toastrService.success('Eğitim başarıyla güncellendi.', 'Başarılı');
                        this.closeModal();
                        setTimeout(() => window.location.reload(), 1000);
                    },
                    (error) => {
                        this.toastrService.error('Eğitim güncellenirken bir hata oluştu.', 'Hata');
                    }
                );
            } else {
                this.educationsService.createEducation(adjustedValues).subscribe(
                    (response) => {
                        this.toastrService.success('Eğitim başarıyla eklendi.', 'Başarılı');
                        this.closeModal();
                        setTimeout(() => window.location.reload(), 1000);
                    },
                    (error) => {
                        this.toastrService.error('Eğitim eklenirken bir hata oluştu.', 'Hata');
                    }
                );
            }
        } else {
            this.toastrService.warning('Lütfen formu kontrol edin.', 'Uyarı');
        }
    }

    deleteEducation(e: any) {
        swal({
            heightAuto: false,
            title: "Silmek İstediğinize Emin misiniz?",
            text: "'" + e.row.data.name + "' eğitimi silinecek!",
            type: 'question',
            showConfirmButton: true,
            showCancelButton: true,
            confirmButtonText: 'Evet, Sil',
            cancelButtonText: 'Hayır',
        }).then((willDelete) => {
            if (willDelete.value) {
                this.educationsService.deleteEducation(e.row.data.id).subscribe(res => {
                    this.toastrService.success("Eğitim Silindi.", "İşlem Başarılı");
                    setTimeout(() => window.location.reload(), 1000);
                },
                    err => {
                        this.toastrService.error("Bir Hata Oluştu. Lütfen Daha Sonra Tekrar Deneyiniz.", "Hata");
                    });
            }
        });
    }
}
