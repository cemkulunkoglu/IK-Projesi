import { Component, EventEmitter, Input, OnInit, OnDestroy, Output, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/core/services/users/users.service';
import swal from 'sweetalert2';
import { ChangeProfileImageComponent } from './change-profile-image/change-profile-image.component';
import { MatDialog } from '@angular/material/dialog';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { UpdateUserActiveComponent } from './update-user-active/update-user-active.component';
import { AuthService, UserType } from 'src/app/core/services/auth/auth.service';
import { UserInformationComponent } from './user-information/user-information.component';
import { AccessTypeEnum } from 'src/app/core/enums/user/access-type-enum.model';

type Tabs = 'user-information' | 'job-position' | 'personel-information' | 'other-information' | 'leave' | 'payment' | 'overtime' | 'embezzlement' | 'education' | 'document';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html'
})
export class UserEditComponent implements OnInit, OnDestroy {
  currentUser: UserType;
  currentUserId: number;
  activeTab: Tabs = 'user-information';
  @Output() userId: number;
  @ViewChild(UserInformationComponent) userInformationComponent: UserInformationComponent;
  profilPicture: string = './assets/media/avatars/blank.png';
  userName: string;
  userEmail: string;
  userPhone: string;
  startDate: string = new Date().toDateString();
  isActive: boolean;
  jobTitle: string;
  isSendMail: boolean;
  lastLoginDate = new Date().toDateString();

  isActiveMessage: string;
  message: string;

  hasUserEducationListPermission: boolean;
  hasUserLeaveListPermission: boolean;
  hasUserEmbezzlementListPermission: boolean;
  hasUserDocumentListPermission: boolean;
  hasPersonalInfoListPermission: boolean;
  hasOtherInfoListPermission: boolean;
  hasJobPositionListPermission: boolean;

  constructor(private fb: FormBuilder,
    public userService: UserService,
    private authService: AuthService,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private activatedRoute: ActivatedRoute,
    private toastrService: ToastrService) {
    this.userId = Number(this.activatedRoute.snapshot.params.id);
    this.userService.getUserJobTitleByUserId(this.userId).subscribe(res => {
      this.jobTitle = res.data.jobTitle;
    });

    this.userService.getUserDetail(this.userId).subscribe(res => {
      this.userName = res.data.name + " " + res.data.surname;
      this.userEmail = res.data.emailBusiness;
      this.userPhone = res.data.phoneBusiness;
      this.startDate = res.data.startDate?.toString();
      this.lastLoginDate = res.data.lastLoginDate?.toString();
      this.isActive = res.data.isActive;
      if (res.data.profilPicture != null) {
        this.profilPicture = res.data.profilPicture;
      }
    });
  }

  getCurrentUser() {
    this.currentUser = this.authService.currentUserValue;
    this.currentUserId = this.currentUser.id;
    if (this.currentUserId == this.userId) {
      this.isSendMail = true;
    }
    else {
      this.isSendMail = false;
    }
  }

  sendResetPasswordEmail() {
    this.authService.forgotPassword(this.userEmail).subscribe(res => {
      this.toastrService.info("Şifre Güncelleme Maili Gönderildi", null, { timeOut: 2000 })
    });
  }

  openChangeProfileImageDialog() {
    const dialogRef = this.dialog.open(ChangeProfileImageComponent, {
      width: 'lg',
      maxWidth: '800px',
      height: 'auto',
      data: { userId: this.userId }
    });
    dialogRef.afterClosed().subscribe(result => { });
  }

  openSetUserActiveDialog(userId: number) {
    const dialogRef = this.dialog.open(UpdateUserActiveComponent, {
      data: userId,
      width: 'lg',
      maxWidth: '800px',
      height: 'auto'
    });

    dialogRef.componentInstance.userActiveUpdate.subscribe((data) => { });
    dialogRef.afterClosed().subscribe(result => { });
  }

  openChangePasswordDialog() {
    const changePass = this.dialog.open(ChangePasswordComponent, {
      width: '900px',
      data: { userId: this.userId }
    });

    changePass.afterClosed().subscribe(result => { });
  }

  ngOnDestroy(): void {
  }

  ngOnInit(): void {
    this.setPermissions();
    this.getCurrentUser();
    this.route.fragment.subscribe(fragment => {
      if (fragment === 'leaves') {
        this.activeTab = 'leave';
      }
    });
  }

  setPermissions() {
    this.hasUserEducationListPermission = this.authService.hasPermission('user-embezzlement-list');
    this.hasUserLeaveListPermission = this.authService.hasPermission('user-leave-list');
    this.hasUserEmbezzlementListPermission = this.authService.hasPermission('user-embezzlement-list');
    this.hasUserDocumentListPermission = this.authService.hasPermission('user-document-list');
    this.hasPersonalInfoListPermission = this.authService.hasPermission('user-personel-information-list');
    this.hasOtherInfoListPermission = this.authService.hasPermission('user-other-information-list');
    this.hasJobPositionListPermission = this.authService.hasPermission('user-job-position-list');
  }

  setActiveTab(tab: Tabs) {
    this.activeTab = tab;
  }

  hireUser(e) {
    this.userService.setUserActive(e).subscribe(res => {
      this.toastrService.success("İşlem Başarılı");
      this.userService.getUserDetail(this.userId).subscribe(res => {
        this.userInformationComponent.clearExitReason();
        this.userInformationComponent.updateUserForm.patchValue({
          description: '',
          contractEndDate: null
        });
        window.location.reload();
      });
    },
      err => {
        err.error.messages.forEach(element => {
          this.message += element + '. ';
        });
        this.toastrService.error(this.message, "Hata");
      });
  }

  setUserActive() {
    this.isActiveMessage = this.isActive ? "Pasif" : "Aktif";
    swal({
      title: this.isActiveMessage + " Yapmak İstediğinize Emin misiniz?",
      text: "'" + this.userName + "' isimli kullanıcı " + this.isActiveMessage + " yapılacaktır!",
      type: 'question',
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: 'Evet, ' + this.isActiveMessage + " Yap",
      cancelButtonText: 'Hayır',
    }).then((willDelete) => {
      if (willDelete.value) {
        this.message = '';
        this.userService.setUserActive(this.userId).subscribe(res => {
          this.toastrService.success("İşlem Başarılı");
          window.location.reload();
        },
          err => {
            err.error.messages.forEach(element => {
              this.message += element + '. ';
            });
            this.toastrService.error(this.message, "Hata");
          });
      }
    });
  }

  isEmployee(): boolean {
    return this.currentUser?.accessType === AccessTypeEnum.Employee;
  }

  isManager(): boolean {
    return this.currentUser?.accessType === AccessTypeEnum.Manager;
  }
}
