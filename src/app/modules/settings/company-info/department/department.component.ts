import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import CustomStore from 'devextreme/data/custom_store';
import { ToastrService } from 'ngx-toastr';
import { CompanyInfoService } from 'src/app/core/services/settings/company-info.service';
import { UserService } from 'src/app/core/services/users/users.service';
import swal from 'sweetalert2';
import { CreateDepartmentModel } from 'src/app/core/models/settings/company-info/department/create-department.model';
import { UpdateDepartmentModel } from 'src/app/core/models/settings/company-info/department/update-department.model';
import { BehaviorSubject } from 'rxjs';
import { ApprovalProcessService } from 'src/app/core/services/settings/approval-process.service';
import { ApprovalProcess } from 'src/app/core/models/settings/approval-process/approval-process.model';
import { AuthService } from 'src/app/core/services/auth/auth.service';

@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
})
export class DepartmentComponent implements OnInit {
  dataSource: CustomStore;
  departmentForm: FormGroup;
  modalRef: NgbModalRef;
  isEditMode = false;
  currentDepartmentId: number | null = null;
  branchOfficeDataList: any[];
  userDataList: any[];
  selectedManagerIds: number[] = [];
  userSearch: FormControl = new FormControl();
  filteredUsers: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  approvalProcesses: ApprovalProcess[] = [];

  hasListPermission: boolean;
  hasCreatePermission: boolean;
  hasUpdatePermission: boolean;
  hasDeletePermission: boolean;

  @ViewChild('departmentModal', { static: true }) departmentModal: any;

  constructor(
    private companyInfoService: CompanyInfoService,
    private userService: UserService,
    private approvalProcessService: ApprovalProcessService,
    private toastrService: ToastrService,
    private fb: FormBuilder,
    private modalService: NgbModal,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.setPermissions();

    this.departmentForm = this.fb.group({
      id: [null],
      name: [null, Validators.required],
      branchOfficeId: [null, Validators.required],
      managers: [[], Validators.required],
      leaveApprovalProcessId: [null],
      advanceApprovalProcessId: [null],
      paymentApprovalProcessId: [null],
      overTimeApprovalProcessId: [null],
    });

    this.dataSource = new CustomStore({
      key: 'id',
      load: () => this.companyInfoService.getDepartments().toPromise()
        .then(data => ({
          data: data,
          totalCount: data.length
        }))
        .catch(error => {
          throw error;
        })
    });

    this.SetBranchOfficeDataList();
    this.GetUserDataList();
    this.GetApprovalProcesses();

    this.userSearch.valueChanges.subscribe(value => {
      this.filterUsers(value);
    });
  }

  setPermissions() {
    this.hasListPermission = this.authService.hasPermission('department-list');
    this.hasCreatePermission = this.authService.hasPermission('department-create');
    this.hasUpdatePermission = this.authService.hasPermission('department-update');
    this.hasDeletePermission = this.authService.hasPermission('department-delete');
  }

  SetBranchOfficeDataList() {
    this.companyInfoService.getBranchOffices().subscribe(res => {
      this.branchOfficeDataList = res;
    });
  }

  GetUserDataList() {
    this.userService.getUsers().subscribe(res => {
      this.userDataList = res;
      this.filteredUsers.next(this.userDataList);
    });
  }

  GetApprovalProcesses() {
    this.approvalProcessService.getApprovalProcesses().subscribe(res => {
      this.approvalProcesses = res;
    });
  }

  filterUsers(search: string) {
    if (!search) {
      this.filteredUsers.next(this.userDataList);
      return;
    }
    search = search.toLowerCase();
    this.filteredUsers.next(
      this.userDataList.filter(user =>
        user.name.toLowerCase().includes(search) || user.surname.toLowerCase().includes(search))
    );
  }

  openDepartmentAddModal() {
    this.isEditMode = false;
    this.currentDepartmentId = null;
    this.departmentForm.reset({
      id: null,
      name: null,
      branchOfficeId: null,
      managers: [],
      leaveApprovalProcessId: null,
      advanceApprovalProcessId: null,
      paymentApprovalProcessId: null,
      overTimeApprovalProcessId: null,
    });
    this.modalRef = this.modalService.open(this.departmentModal, { size: 'lg' });
  }

  openDepartmentEditModal(data: any) {
    this.isEditMode = true;
    this.currentDepartmentId = data.row.data.id;
    this.departmentForm.patchValue({
      id: data.row.data.id,
      name: data.row.data.name,
      branchOfficeId: data.row.data.branchOfficeId,
      managers: data.row.data.managers.map((manager: any) => manager.id),
      leaveApprovalProcessId: data.row.data.leaveApprovalProcessId,
      advanceApprovalProcessId: data.row.data.advanceApprovalProcessId,
      paymentApprovalProcessId: data.row.data.paymentApprovalProcessId,
      overTimeApprovalProcessId: data.row.data.overTimeApprovalProcessId
    });
    this.modalRef = this.modalService.open(this.departmentModal, { size: 'lg' });
  }

  closeModal() {
    this.modalRef.close();
  }

  submitForm() {
    if (this.departmentForm.valid) {
      const formValues = this.departmentForm.value;
      if (this.isEditMode && this.currentDepartmentId !== null) {
        const updateModel: UpdateDepartmentModel = {
          id: this.currentDepartmentId,
          ...formValues
        };
        this.companyInfoService.updateDepartment(updateModel).subscribe(
          (response) => {
            this.toastrService.success('Departman başarıyla güncellendi.', 'Başarılı');
            this.closeModal();
            setTimeout(() => window.location.reload(), 1000);
          },
          (error) => {
            this.toastrService.error('Departman güncellenirken bir hata oluştu.', 'Hata');
          }
        );
      } else {
        const createModel: CreateDepartmentModel = {
          ...formValues
        };
        this.companyInfoService.createDepartment(createModel).subscribe(
          (response) => {
            this.toastrService.success('Departman başarıyla eklendi.', 'Başarılı');
            this.closeModal();
            setTimeout(() => window.location.reload(), 1000);
          },
          (error) => {
            this.toastrService.error('Departman eklenirken bir hata oluştu.', 'Hata');
          }
        );
      }
    } else {
      this.toastrService.warning('Lütfen formu kontrol edin.', 'Uyarı');
    }
  }

  deleteDepartment(e: any) {
    swal({
      heightAuto: false,
      title: "Silmek İstediğinize Emin misiniz?",
      text: "'" + e.row.data.name + "' departmanı silinecek!",
      type: 'question',
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: 'Evet, Sil',
      cancelButtonText: 'Hayır',
    }).then((willDelete) => {
      if (willDelete.value) {
        this.companyInfoService.deleteDepartment(e.row.data.id).subscribe(res => {
          this.toastrService.success("Departman Silindi.", "İşlem Başarılı");
          setTimeout(() => window.location.reload(), 1000);
        },
          err => {
            this.toastrService.error("Bir Hata Oluştu. Lütfen Daha Sonra Tekrar Deneyiniz.", "Hata");
          });
      }
    });
  }

  onManagerValueChanged(event: any, cellInfo: any) {
    this.selectedManagerIds = event.value;
    cellInfo.setValue(this.selectedManagerIds);
  }

  calculateFilterExpression(filterValue: any, selectedFilterOperation: any, target: any) {
    if (target === 'search' && typeof (filterValue) === 'string') {
      return [(this as any).dataField, 'contains', filterValue];
    }
    return function (rowData: any) {
      return (rowData.AssignedEmployee || []).indexOf(filterValue) !== -1;
    };
  }

  cellTemplate(container: any, options: any) {
    const noBreakSpace = '\u00A0';
    const assignees = (options.data.managers || []).map((manager: any) => {
      return manager.name;
    });
    const text = assignees.join(', ');
    container.textContent = text || noBreakSpace;
    container.title = text;
  }
}
