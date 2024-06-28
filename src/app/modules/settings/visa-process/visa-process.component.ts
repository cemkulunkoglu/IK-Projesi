import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { VisaProcessService } from 'src/app/core/services/settings/visa-process.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { VisaProcess } from 'src/app/core/models/settings/visa-process/visa-process.model';
import { CreateVisaProcess } from 'src/app/core/models/settings/visa-process/create-visa-process.model';
import { UpdateVisaProcess } from 'src/app/core/models/settings/visa-process/update-visa-process.model';
import swal from 'sweetalert2';
import { AuthService } from 'src/app/core/services/auth/auth.service';

@Component({
    selector: 'app-visa-process',
    templateUrl: './visa-process.component.html',
    styleUrls: ['./visa-process.component.scss']
})
export class VisaProcessComponent implements OnInit, OnDestroy {
    visaProcesses: VisaProcess[] = [];
    uploadedFiles: { [key: number]: File } = {};
    private subscriptions: Subscription[] = [];
    processForm: FormGroup;
    modalRef: NgbModalRef;
    isEditMode = false;
    currentProcessId: number | null = null;

    hasListPermission: boolean;
    hasCreatePermission: boolean;
    hasUpdatePermission: boolean;
    hasDeletePermission: boolean;
    hasDeleteDocumentPermission: boolean;

    @ViewChild('processModal', { static: true }) processModal: any;

    constructor(
        private visaProcessService: VisaProcessService,
        private toastrService: ToastrService,
        private modalService: NgbModal,
        private fb: FormBuilder,
        private cdr: ChangeDetectorRef,
        private authService: AuthService
    ) { }

    ngOnInit() {
        this.setPermissions();
        this.loadVisaProcesses();
        this.processForm = this.fb.group({
            name: ['', Validators.required],
            description: ['', Validators.required],
            visaProcessDocuments: this.fb.array([])
        });
    }

    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }

    setPermissions() {
        this.hasListPermission = this.authService.hasPermission('visa-process-list');
        this.hasCreatePermission = this.authService.hasPermission('create-visa-process');
        this.hasUpdatePermission = this.authService.hasPermission('update-visa-process');
        this.hasDeletePermission = this.authService.hasPermission('delete-visa-process');
        this.hasDeleteDocumentPermission = this.authService.hasPermission('delete-visa-process-document');
    }

    loadVisaProcesses() {
        const sub = this.visaProcessService.getVisaProcesses().subscribe({
            next: (data: VisaProcess[]) => {
                this.visaProcesses = data;
                this.cdr.detectChanges();
            },
            error: (error) => {
                this.toastrService.error('Vize süreçleri yüklenirken bir hata oluştu.', 'Hata');
                console.error('Vize süreçleri yüklenirken hata oluştu:', error);
            }
        });
        this.subscriptions.push(sub);
    }

    loadVisaProcessById(id: number) {
        const sub = this.visaProcessService.getVisaProcessById(id).subscribe({
            next: (data: VisaProcess) => {
                this.currentProcessId = data.id;
                this.processForm.patchValue(data);
                const visaProcessDocumentsFormArray = this.processForm.get('visaProcessDocuments') as FormArray;
                visaProcessDocumentsFormArray.clear();
                data.visaProcessDocuments.forEach((document, index) => {
                    visaProcessDocumentsFormArray.push(this.fb.group({
                        id: document.id,
                        name: document.name,
                        description: document.description,
                        order: document.order,
                        path: document.path,
                        document: this.fb.group({
                            name: '',
                            extension: '',
                            content: ''
                        })
                    }));
                });
                this.modalRef = this.modalService.open(this.processModal, { size: 'lg' });
            },
            error: (error) => {
                this.toastrService.error('Vize süreci yüklenirken bir hata oluştu.', 'Hata');
                console.error('Vize süreci yüklenirken hata oluştu:', error);
            }
        });
        this.subscriptions.push(sub);
    }

    openProcessAddModal() {
        this.isEditMode = false;
        this.currentProcessId = null;
        this.processForm.reset({
            name: '',
            description: '',
            visaProcessDocuments: []
        });
        this.addDocument();
        this.modalRef = this.modalService.open(this.processModal, { size: 'lg' });
    }

    openProcessEditModal(process: VisaProcess) {
        this.isEditMode = true;
        this.loadVisaProcessById(process.id);
    }

    closeModal() {
        this.modalRef.close();
    }

    submitForm() {
        if (this.processForm.valid) {
            const updatedProcess = {
                ...this.processForm.value,
                visaProcessDocuments: this.processForm.value.visaProcessDocuments.map((doc: any) => ({
                    id: doc.id,
                    name: doc.name,
                    description: doc.description,
                    order: doc.order,
                    path: doc.path,
                    document: doc.document.name && doc.document.extension && doc.document.content ? doc.document : undefined
                }))
            };

            if (this.isEditMode && this.currentProcessId !== null) {
                const updateModel: UpdateVisaProcess = {
                    id: this.currentProcessId,
                    ...updatedProcess,
                    visaProcessDocuments: updatedProcess.visaProcessDocuments.filter((doc: any) => doc.document)
                };

                this.visaProcessService.updateVisaProcess(updateModel).subscribe(
                    () => {
                        this.toastrService.success('Vize süreci başarıyla güncellendi.', 'Başarılı');
                        this.closeModal();
                        setTimeout(() => window.location.reload(), 1000);
                    },
                    (error) => {
                        this.toastrService.error('Vize süreci güncellenirken bir hata oluştu.', 'Hata');
                    }
                );
            } else {
                const createModel: CreateVisaProcess = {
                    ...updatedProcess
                };
                this.visaProcessService.createVisaProcess(createModel).subscribe(
                    () => {
                        this.toastrService.success('Vize süreci başarıyla eklendi.', 'Başarılı');
                        this.closeModal();
                        setTimeout(() => window.location.reload(), 1000);
                    },
                    (error) => {
                        this.toastrService.error('Vize süreci eklenirken bir hata oluştu.', 'Hata');
                    }
                );
            }
        } else {
            this.toastrService.warning('Lütfen formu kontrol edin.', 'Uyarı');
        }
    }

    deleteVisaProcess(process: VisaProcess) {
        swal({
            heightAuto: false,
            title: "Silmek İstediğinize Emin misiniz?",
            text: `'${process.name}' vize süreci silinecek!`,
            type: 'question',
            showConfirmButton: true,
            showCancelButton: true,
            confirmButtonText: 'Evet, Sil',
            cancelButtonText: 'Hayır',
        }).then((willDelete) => {
            if (willDelete.value) {
                this.visaProcessService.deleteVisaProcess(process.id).subscribe(
                    () => {
                        this.toastrService.success("Vize süreci silindi.", "İşlem Başarılı");
                        setTimeout(() => window.location.reload(), 1000);
                    },
                    (err) => {
                        this.toastrService.error("Bir Hata Oluştu. Lütfen Daha Sonra Tekrar Deneyiniz.", "Hata");
                    }
                );
            }
        });
    }

    addDocument() {
        const control = this.processForm.get('visaProcessDocuments') as FormArray;
        control.push(this.fb.group({
            name: ['', Validators.required],
            description: ['', Validators.required],
            order: [control.length + 1, Validators.required],
            document: this.fb.group({
                name: ['', Validators.required],
                extension: ['', Validators.required],
                content: ['', Validators.required]
            })
        }));
    }

    removeDocument(index: number) {
        const control = this.processForm.get('visaProcessDocuments') as FormArray;
        const documentId = control.at(index).get('id')?.value;
        if (documentId) {
            this.deleteVisaProcessDocument(documentId, index);
        } else {
            control.removeAt(index);
            delete this.uploadedFiles[index];
            this.reorderDocuments(control);
        }
    }

    deleteVisaProcessDocument(documentId: number, index: number) {
        swal({
            heightAuto: false,
            title: "Belgeyi Silmek İstediğinize Emin misiniz?",
            text: 'Belge silinecek!',
            type: 'question',
            showConfirmButton: true,
            showCancelButton: true,
            confirmButtonText: 'Evet, Sil',
            cancelButtonText: 'Hayır',
        }).then((willDelete) => {
            if (willDelete.value) {
                this.visaProcessService.deleteVisaProcessDocument(documentId).subscribe(
                    () => {
                        const control = this.processForm.get('visaProcessDocuments') as FormArray;
                        control.removeAt(index);
                        delete this.uploadedFiles[index];
                        this.reorderDocuments(control);
                        this.toastrService.success("Belge silindi.", "İşlem Başarılı");
                    },
                    (err) => {
                        this.toastrService.error("Bir Hata Oluştu. Lütfen Daha Sonra Tekrar Deneyiniz.", "Hata");
                    }
                );
            }
        });
    }

    reorderDocuments(control: FormArray) {
        control.controls.forEach((group, index) => {
            group.get('order')?.setValue(index + 1);
        });
    }

    onFileSelected(event: any, index: number): void {
        const file = event.target.files[0];
        if (this.processForm && this.isSupportedFile(file)) {
            const extension = this.extractFileExtension(file);
            const control = this.processForm.get('visaProcessDocuments') as FormArray;
            const documentGroup = control.at(index).get('document') as FormGroup;
            documentGroup.patchValue({
                name: file.name,
                extension: extension
            });
            this.uploadedFiles[index] = file;
            this.convertFileToBase64(file, documentGroup);
        } else {
            this.toastrService.warning("Geçersiz bir dosya seçtiniz. Lütfen yalnızca pdf, jpeg, jpg veya png formatındaki dosyaları seçin.");
        }
    }

    isSupportedFile(file: File): boolean {
        const allowedTypes = ["application/pdf", "image/jpeg", "image/png", "image/jpg"];
        return allowedTypes.includes(file.type);
    }

    convertFileToBase64(file: File, documentGroup: FormGroup): void {
        const reader = new FileReader();

        reader.onloadend = () => {
            const base64Content = reader.result as string;
            const startIndex = base64Content.indexOf(',') + 1;
            const cleanedBase64 = base64Content.substring(startIndex);

            documentGroup.patchValue({
                content: cleanedBase64
            });
        };

        reader.readAsDataURL(file);
    }

    extractFileExtension(file: File): string {
        const fileName = file.name;
        const lastDotIndex = fileName.lastIndexOf('.');
        return fileName.substring(lastDotIndex + 1);
    }

    removeUploadedFile(index: number) {
        delete this.uploadedFiles[index];
        const control = this.processForm.get('visaProcessDocuments') as FormArray;
        const documentGroup = control.at(index).get('document') as FormGroup;
        documentGroup.patchValue({
            name: '',
            extension: '',
            content: ''
        });
    }
}
