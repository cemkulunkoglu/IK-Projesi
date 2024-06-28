import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import CustomStore from 'devextreme/data/custom_store';
import { ToastrService } from 'ngx-toastr';
import { UserEducationService } from 'src/app/core/services/users/user-education.service';
import { UserService } from 'src/app/core/services/users/users.service';
import swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserEducationStatusLabelMapping, UserEducationStatusTypeEnum } from 'src/app/core/enums/user/education/user-education-status.enum.model';
import { AuthService, UserType } from 'src/app/core/services/auth/auth.service';
import { AccessTypeEnum } from 'src/app/core/enums/user/access-type-enum.model';

@Component({
  selector: 'app-education',
  templateUrl: './education.component.html'
})
export class EducationComponent implements OnInit {
  @Output() newActiveTab = new EventEmitter<string>();
  @Input() userId: number;
  dataSource: CustomStore;
  educationId: number;
  educationForm: FormGroup;
  modalRef: NgbModalRef;
  isEditMode = false;
  currentEducationId: number | null = null;

  @ViewChild('educationModal', { static: true }) educationModal: any;
  @ViewChild('userEducationCreate', { static: true }) userEducationCreate: any;
  @ViewChild('userEducationEdit', { static: true }) userEducationEdit: any;

  UserEducationStatusTypeEnum = UserEducationStatusTypeEnum;
  userEducationStatusTypeSources = Object.values(UserEducationStatusTypeEnum).filter(value => typeof value === 'number');
  UserEducationStatusLabelMapping = UserEducationStatusLabelMapping;

  hasCreatePermission: boolean;
  hasListPermission: boolean;
  hasUpdatePermission: boolean;
  hasDeletePermission: boolean;

  currentUser: UserType;

  constructor(
    private userService: UserService,
    private toastrService: ToastrService,
    private activatedRoute: ActivatedRoute,
    private userEducationService: UserEducationService,
    private cdr: ChangeDetectorRef,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.initializeForm();
    this.loadUserEducations();
    this.setPermissions();
    this.currentUser = this.authService.currentUserValue;
  }

  setPermissions() {
    this.hasCreatePermission = this.authService.hasPermission('create-user-education');
    this.hasListPermission = this.authService.hasPermission('user-education-list');
    this.hasUpdatePermission = this.authService.hasPermission('update-user-education');
    this.hasDeletePermission = this.authService.hasPermission('delete-user-education');
  }

  initializeForm() {
    this.educationForm = this.fb.group({
      educationName: ['', Validators.required],
      description: ['', Validators.required],
      completionDate: ['', Validators.required],
      rating: [0, [Validators.required, Validators.min(1), Validators.max(5)]]
    });
  }

  redirectToCreateEducation() {
    this.router.navigate(['/settings/educations']);
  }

  loadUserEducations() {
    this.dataSource = new CustomStore({
      key: 'id',
      load: () => {
        return this.userEducationService.getUserEducationByUserId(this.userId).toPromise()
          .then(response => {
            return {
              data: response.data,
              totalCount: response.data.length
            };
          })
          .catch(error => {
            this.toastrService.error('Eğitim verileri yüklenirken bir hata oluştu.', 'Hata');
            throw error;
          });
      }
    });
  }

  showEducationModal(templateRef: any) {
    this.isEditMode = false;
    this.currentEducationId = null;
    this.educationForm.reset();
    this.modalRef = this.modalService.open(templateRef, { size: 'lg' });
  }

  editEducationClick(data: any, templateRef: any) {
    this.isEditMode = true;
    this.currentEducationId = data.row.data.id;
    this.educationForm.patchValue(data.row.data);
    this.modalRef = this.modalService.open(templateRef, { size: 'lg' });
  }

  closeModal() {
    this.modalRef.close();
  }

  reloadDataSource(event: any) {
    this.dataSource.load();
    this.closeModal();
  }

  deleteEducationClick(data: any) {
    swal({
      heightAuto: false,
      title: "Silmek İstediğinize Emin misiniz?",
      text: "'" + data.row.data.educationName + "' eğitimi silinecek!",
      type: 'question',
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: 'Evet, Sil',
      cancelButtonText: 'Hayır',
    }).then((willDelete) => {
      if (willDelete.value) {
        this.userEducationService.deleteUserEducation(data.row.data.id).subscribe(res => {
          this.toastrService.success("Eğitim Silindi.", "İşlem Başarılı");
          setTimeout(() => window.location.reload(), 1000);
        },
          err => {
            this.toastrService.error("Bir Hata Oluştu. Lütfen Daha Sonra Tekrar Deneyiniz.", "Hata");
          });
      }
    });
  }

  hasPermission(permission: string): boolean {
    return this.authService.hasPermission(permission);
  }

  isEmployee(): boolean {
    return this.currentUser?.accessType === AccessTypeEnum.Employee;
  }
}
