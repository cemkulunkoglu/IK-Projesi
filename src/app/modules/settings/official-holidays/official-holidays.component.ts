import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { OfficialHolidayService } from 'src/app/core/services/settings/official-holidays.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import CustomStore from 'devextreme/data/custom_store';
import swal from 'sweetalert2';
import { OfficialHolidayTypeEnum, OfficialHolidayTypeLabelMapping } from 'src/app/core/enums/official-holiday-type/official-holiday-type.enum';
import { AuthService } from 'src/app/core/services/auth/auth.service';

@Component({
    selector: 'app-official-holidays',
    templateUrl: './official-holidays.component.html',
    styleUrls: ['./official-holidays.component.scss']
})
export class OfficialHolidaysComponent implements OnInit {
    dataSource: any;
    holidayForm: FormGroup;
    modalRef: NgbModalRef;
    isEditMode = false;
    currentHolidayId: number | null = null;

    OfficialHolidayTypeEnum = OfficialHolidayTypeEnum;
    officialHolidayTypeSources = Object.values(OfficialHolidayTypeEnum).filter(value => typeof value === 'number');
    OfficialHolidayTypeLabelMapping = OfficialHolidayTypeLabelMapping;

    hasListPermission: boolean;
    hasCreatePermission: boolean;
    hasUpdatePermission: boolean;
    hasDeletePermission: boolean;

    @ViewChild('holidayModal', { static: true }) holidayModal: any;

    constructor(
        private officialHolidayService: OfficialHolidayService,
        private toastrService: ToastrService,
        private modalService: NgbModal,
        private fb: FormBuilder,
        private authService: AuthService
    ) { }

    ngOnInit(): void {
        this.setPermissions();

        this.holidayForm = this.fb.group({
            id: [''],
            name: ['', Validators.required],
            description: ['', Validators.required],
            officialHolidayType: ['', Validators.required],
            startDate: [new Date(), Validators.required],
            endDate: [new Date(), Validators.required],
            repeatAnnually: [false, Validators.required],
        });

        this.dataSource = new CustomStore({
            key: 'id',
            load: () => this.officialHolidayService.getOfficialHolidays().toPromise()
                .then(data => ({
                    data: data,
                    totalCount: data.length
                }))
                .catch(error => {
                    this.toastrService.error('Resmi Tatil yüklenirken bir hata oluştu.', 'Hata');
                    throw error;
                })
        });

        this.holidayForm.get('officialHolidayType').valueChanges.subscribe(value => {
            this.onHolidayTypeChange(value);
        });
    }

    setPermissions() {
        this.hasListPermission = this.authService.hasPermission('official-holiday-list');
        this.hasCreatePermission = this.authService.hasPermission('create-official-holiday');
        this.hasUpdatePermission = this.authService.hasPermission('update-official-holiday');
        this.hasDeletePermission = this.authService.hasPermission('delete-official-holiday');
    }

    openHolidayModal() {
        this.isEditMode = false;
        this.holidayForm.reset({
            id: '',
            name: '',
            description: '',
            officialHolidayType: '',
            startDate: new Date(),
            endDate: new Date(),
            repeatAnnually: false
        });
        this.modalRef = this.modalService.open(this.holidayModal, { size: 'lg' });
    }

    closeModal() {
        this.modalRef.close();
    }

    adjustForTimezone(date: string | Date): string {
        const localDate = new Date(date);
        if (isNaN(localDate.getTime())) {
            throw new Error('Invalid date');
        }
        const timeOffsetInMS: number = localDate.getTimezoneOffset() * 60000;
        localDate.setTime(localDate.getTime() - timeOffsetInMS);
        return localDate.toISOString().split('T')[0];
    }

    submitForm() {
        if (this.holidayForm.valid) {
            const startDate = this.holidayForm.get('startDate').value;
            const endDate = this.holidayForm.get('endDate').value;

            const adjustedValues = {
                ...this.holidayForm.value,
                startDate: this.adjustForTimezone(startDate),
                endDate: this.adjustForTimezone(endDate)
            };

            if (this.isEditMode) {
                this.officialHolidayService.updateOfficialHoliday({ ...adjustedValues, id: this.currentHolidayId }).subscribe(
                    () => {
                        this.toastrService.success('Tatil başarıyla güncellendi.', 'Başarılı');
                        this.closeModal();
                        setTimeout(() => window.location.reload(), 1000);
                    },
                    () => {
                        this.toastrService.error('Tatil güncellenirken bir hata oluştu.', 'Hata');
                    }
                );
            } else {
                this.officialHolidayService.createOfficialHoliday(adjustedValues).subscribe(
                    () => {
                        this.toastrService.success('Tatil başarıyla eklendi.', 'Başarılı');
                        this.closeModal();
                        setTimeout(() => window.location.reload(), 1000);
                    },
                    () => {
                        this.toastrService.error('Tatil eklenirken bir hata oluştu.', 'Hata');
                    }
                );
            }
        } else {
            this.toastrService.warning('Lütfen formu kontrol edin.', 'Uyarı');
        }
    }

    editHoliday(e) {
        this.isEditMode = true;
        this.currentHolidayId = e.row.data.id;
        this.holidayForm.patchValue(e.row.data);
        this.modalRef = this.modalService.open(this.holidayModal, { size: 'lg' });
    }

    onHolidayTypeChange(value: OfficialHolidayTypeEnum) {
        if (value === OfficialHolidayTypeEnum.HalfDay || value === OfficialHolidayTypeEnum.FullDay) {
            const startDate = this.holidayForm.get('startDate').value;
            this.holidayForm.get('endDate').setValue(startDate);
            this.holidayForm.get('endDate').disable();
        } else {
            this.holidayForm.get('endDate').enable();
        }
    }

    deleteHoliday(e) {
        swal({
            heightAuto: false,
            title: "Silmek İstediğinize Emin misiniz?",
            text: "'" + e.row.data.name + "' tatili silinecek!",
            type: 'question',
            showConfirmButton: true,
            showCancelButton: true,
            confirmButtonText: 'Evet, Sil',
            cancelButtonText: 'Hayır',
        }).then((willDelete) => {
            if (willDelete.value) {
                this.officialHolidayService.deleteOfficialHoliday(e.row.data.id).subscribe(res => {
                    this.toastrService.success("Resmi Tatil Silindi.", "İşlem Başarılı");
                    setTimeout(() => window.location.reload(), 1000);
                },
                    err => {
                        this.toastrService.error("Bir Hata Oluştu. Lütfen Daha Sonra Tekrar Deneyiniz.", "Hata");
                    });
            }
        });
    }
}
