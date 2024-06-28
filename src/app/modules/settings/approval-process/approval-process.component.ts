import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild } from '@angular/core';
import { Subscription, BehaviorSubject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { ApprovalProcessService } from 'src/app/core/services/settings/approval-process.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, FormArray, Validators, FormControl } from '@angular/forms';
import swal from 'sweetalert2';
import { ApprovalProcess } from 'src/app/core/models/settings/approval-process/approval-process.model';
import { UserService } from 'src/app/core/services/users/users.service';
import { UpdateApprovalProcess } from 'src/app/core/models/settings/approval-process/update-approval-process.model';
import { CreateApprovalProcess } from 'src/app/core/models/settings/approval-process/create-approval-process.model';
import { AuthService } from 'src/app/core/services/auth/auth.service';

@Component({
    selector: 'app-approval-process',
    templateUrl: './approval-process.component.html',
    styleUrls: ['./approval-process.component.scss']
})
export class ApprovalProcessComponent implements OnInit, OnDestroy {
    approvalProcesses: ApprovalProcess[] = [];
    users: Array<{ id: number, name: string, surname: string }> = [];
    filteredUsers: BehaviorSubject<Array<{ id: number, name: string, surname: string }>> = new BehaviorSubject([]);
    managerSearch: FormControl = new FormControl();
    private subscriptions: Subscription[] = [];
    processForm: FormGroup;
    modalRef: NgbModalRef;
    isEditMode = false;
    currentProcessId: number | null = null;

    hasListPermission: boolean;
    hasCreatePermission: boolean;
    hasUpdatePermission: boolean;
    hasDeletePermission: boolean;

    @ViewChild('processModal', { static: true }) processModal: any;

    constructor(
        private approvalProcessService: ApprovalProcessService,
        private userService: UserService,
        private toastr: ToastrService,
        private modalService: NgbModal,
        private fb: FormBuilder,
        private cdr: ChangeDetectorRef,
        private authService: AuthService

    ) { }

    ngOnInit() {
        this.setPermissions();
        this.loadApprovalProcesses();
        this.loadUsers();
        this.processForm = this.fb.group({
            name: ['', Validators.required],
            isDefaultProcess: [false],
            showApprovalOrder: [false],
            approvalProcessUsers: this.fb.array([])
        });

        this.managerSearch.valueChanges.subscribe(() => {
            this.filterUserData();
        });
    }

    setPermissions() {
        this.hasListPermission = this.authService.hasPermission('approval-process-list');
        this.hasCreatePermission = this.authService.hasPermission('create-approval-process');
        this.hasUpdatePermission = this.authService.hasPermission('update-approval-process');
        this.hasDeletePermission = this.authService.hasPermission('delete-approval-process');
    }

    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }

    loadApprovalProcesses() {
        const sub = this.approvalProcessService.getApprovalProcesses().subscribe({
            next: (data: ApprovalProcess[]) => {
                this.approvalProcesses = data;
                this.cdr.detectChanges();
            },
            error: (error) => {
                this.toastr.error('Onay süreçleri yüklenirken bir hata oluştu.', 'Hata');
                console.error('Onay İşlemleri Yüklenirken Hata Oluştu:', error);
            }
        });
        this.subscriptions.push(sub);
    }

    loadUsers() {
        const sub = this.userService.getUsersWithParam(true).subscribe({
            next: (data: Array<{ id: number, name: string, surname: string }>) => {
                this.users = data;
                this.filteredUsers.next(data);
            }
        });
        this.subscriptions.push(sub);
    }

    filterUserData() {
        let search = this.managerSearch.value;
        if (!search) {
            this.filteredUsers.next(this.users.slice());
            return;
        } else {
            search = search.toLowerCase();
        }

        const searchWords = search.split(' ').filter(word => word);

        this.filteredUsers.next(
            this.users.filter(user => {
                const fullName = `${user.name} ${user.surname}`.toLowerCase();
                return searchWords.every(word => fullName.includes(word));
            })
        );
    }

    openProcessAddModal() {
        this.isEditMode = false;
        this.currentProcessId = null;
        this.processForm.reset({
            name: '',
            isDefaultProcess: false,
            showApprovalOrder: false,
            approvalProcessUsers: []
        });
        this.modalRef = this.modalService.open(this.processModal, { size: 'lg' });
    }

    openProcessEditModal(process: ApprovalProcess) {
        this.isEditMode = true;
        this.currentProcessId = process.id;
        this.processForm.patchValue(process);
        const approvalProcessUsersFormArray = this.processForm.get('approvalProcessUsers') as FormArray;
        approvalProcessUsersFormArray.clear();
        process.approvalProcessUsers.forEach(user => {
            approvalProcessUsersFormArray.push(this.fb.group(user));
        });
        this.modalRef = this.modalService.open(this.processModal, { size: 'lg' });
    }

    closeModal() {
        this.modalRef.close();
    }

    submitForm() {
        if (this.processForm.valid) {
            const updatedProcess = {
                ...this.processForm.value
            };

            if (this.isEditMode && this.currentProcessId !== null) {
                const updateModel: UpdateApprovalProcess = {
                    id: this.currentProcessId,
                    ...updatedProcess
                };
                this.approvalProcessService.updateApprovalProcess(updateModel).subscribe(
                    () => {
                        this.toastr.success('Onay süreci başarıyla güncellendi.', 'Başarılı');
                        this.closeModal();
                        setTimeout(() => window.location.reload(), 1000);
                    },
                    (error) => {
                        this.toastr.error('Onay süreci güncellenirken bir hata oluştu.', 'Hata');
                    }
                );
            } else {
                const createModel: CreateApprovalProcess = {
                    ...updatedProcess
                };
                this.approvalProcessService.createApprovalProcess(createModel).subscribe(
                    () => {
                        this.toastr.success('Onay süreci başarıyla eklendi.', 'Başarılı');
                        this.closeModal();
                        setTimeout(() => window.location.reload(), 1000);
                    },
                    (error) => {
                        this.toastr.error('Onay süreci eklenirken bir hata oluştu.', 'Hata');
                    }
                );
            }
        } else {
            this.toastr.warning('Lütfen formu kontrol edin.', 'Uyarı');
        }
    }

    deleteApprovalProcess(process: ApprovalProcess) {
        swal({
            heightAuto: false,
            title: "Silmek İstediğinize Emin misiniz?",
            text: `'${process.name}' onay süreci silinecek!`,
            type: 'question',
            showConfirmButton: true,
            showCancelButton: true,
            confirmButtonText: 'Evet, Sil',
            cancelButtonText: 'Hayır',
        }).then((willDelete) => {
            if (willDelete.value) {
                this.approvalProcessService.deleteApprovalProcess(process.id).subscribe(
                    () => {
                        this.toastr.success("Onay süreci silindi.", "İşlem Başarılı");
                        setTimeout(() => window.location.reload(), 1000);
                    },
                    (err) => {
                        this.toastr.error("Bir Hata Oluştu. Lütfen Daha Sonra Tekrar Deneyiniz.", "Hata");
                    }
                );
            }
        });
    }

    addUser() {
        const control = this.processForm.get('approvalProcessUsers') as FormArray;
        const order = control.length + 1;
        control.push(this.fb.group({
            userId: ['', Validators.required],
            order: [order, Validators.required]
        }));
    }

    removeUser(index: number) {
        const control = this.processForm.get('approvalProcessUsers') as FormArray;
        control.removeAt(index);
        this.reorderUsers(control);
    }

    reorderUsers(control: FormArray) {
        control.controls.forEach((group, index) => {
            group.get('order')?.setValue(index + 1);
        });
    }
}
