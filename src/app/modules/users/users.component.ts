import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserModel } from 'src/app/core/models/users/user.model';
import { UserService } from 'src/app/core/services/users/users.service';
import swal from 'sweetalert2';
import { UpdateUserActiveComponent } from '../user-edit/update-user-active/update-user-active.component';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/core/services/auth/auth.service';

@Component({
  selector: 'app-user',
  templateUrl: './users.component.html'
})
export class UsersComponent implements OnInit {

  data: Array<UserModel> = [];
  filteredUsers: Array<UserModel> = [];
  filterOption: boolean = true;
  selectedValue: string = "true";
  dataLength: number = 0;
  searchTerm: string = '';

  message: string = '';
  isActiveMessage: string = '';

  hasListPermission: boolean;
  hasCreatePermission: boolean;
  hasUpdatePermission: boolean;
  hasDeletePermission: boolean;

  constructor(private userService: UserService,
    private toastrService: ToastrService,
    public dialog: MatDialog,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private authService: AuthService) { }

  ngOnInit() {
    this.setPermissions();
    this.loadUsers(this.filterOption);
  }

  setPermissions() {
    this.hasListPermission = this.authService.hasPermission('user-list');
    this.hasCreatePermission = this.authService.hasPermission('user-create');
    this.hasUpdatePermission = this.authService.hasPermission('user-update');
    this.hasDeletePermission = this.authService.hasPermission('user-delete');
  }

  loadUsers(option: boolean | null) {
    this.filterOption = option;
    this.userService.getUsersWithParam(this.filterOption).subscribe(res => {
      this.data = res;
      this.filteredUsers = this.data;
      this.dataLength = this.filteredUsers.length;
      this.cdr.detectChanges();
    });
  }

  applyFilters() {
    this.filteredUsers = this.data.filter(user =>
      (!this.filterOption || user.isActive === this.filterOption) &&
      (this.searchTerm === '' || user.name.toLowerCase().includes(this.searchTerm.toLowerCase()))
    );
    this.dataLength = this.filteredUsers.length;
    this.cdr.detectChanges();
  }

  searchUsers() {
    this.applyFilters();
  }

  hireUser(e) {
    this.userService.setUserActive(e).subscribe(res => {
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

  openSetUserActiveDialog(userId: number) {
    const dialogRef = this.dialog.open(UpdateUserActiveComponent, {
      data: userId,
      width: '350px'
    });

    dialogRef.componentInstance.userActiveUpdate.subscribe((data) => {
      console.log(data);
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  setUserActive(e) {
    console.log(e);
    this.isActiveMessage = e.isActive ? "Pasif" : "Aktif";
    swal({
      title: this.isActiveMessage + " Yapmak İstediğinize Emin misiniz?",
      text: "'" + e.name + "' isimli kullanıcı " + this.isActiveMessage + " yapılacaktır!",
      type: 'question',
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: 'Evet, ' + this.isActiveMessage + " Yap",
      cancelButtonText: 'Hayır',
    }).then((willDelete) => {
      if (willDelete.value) {
        this.message = '';
        this.userService.setUserActive(e.id).subscribe(res => {
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

  routeToCreateUser() {
    this.router.navigate(['/user-create']);
  }

  editUserClick(e) {
    this.router.navigate(['/user-edit/' + e.id]);
  }
}
