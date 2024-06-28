import { Component, OnInit, ChangeDetectorRef, EventEmitter, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserPersonelInformationModel } from 'src/app/core/models/users/personel-information/user-personel-information.model';
import { UserService } from 'src/app/core/services/users/users.service';

@Component({
  selector: 'app-user-birthday',
  templateUrl: './user-birthday.component.html',
  styleUrls: ['./user-birthday.component.scss']
})
export class UserBirthdayComponent implements OnInit {
  userData: Array<UserPersonelInformationModel>;
  @Output() userBirthday = new EventEmitter<number>();

  constructor(
    private userService: UserService,
    private modalService: NgbModal,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.functionOfUserPersonalInformation();
  }

  functionOfUserPersonalInformation(){
    this.userService.getUserPersonelInformationLastWeek().subscribe(res => {
      this.userData = res;
      this.userBirthday.emit(res.length);
      this.cdr.detectChanges();
    });
  }
  leaveReload() {
    this.showSpinner();

    this.functionOfUserPersonalInformation();

    setTimeout(() => {
      this.hideSpinner();
    }, 1000);
  }

  showSpinner() {
    document.getElementById("reloadUserPersonalInformationButton").innerHTML = `
      <div id="spinner" class="spinner">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
    `;
  }

  hideSpinner() {
    document.getElementById("reloadUserPersonalInformationButton").innerHTML = `
    <i class="fa-solid fa-arrows-rotate"></i>
    `;
  }
  isToday(dateOfBirth: any): boolean {
    const today = new Date();
    const date = new Date(dateOfBirth);
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth()
    );
  }

  isTomorrow(dateOfBirth: any): boolean {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const date = new Date(dateOfBirth);
    return (
      date.getDate() === tomorrow.getDate() &&
      date.getMonth() === tomorrow.getMonth()
    );
  }
}
