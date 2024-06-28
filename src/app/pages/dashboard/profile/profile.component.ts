import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CurrentUserJobPosition } from 'src/app/core/models/dashboard/current-user-job-position';
import { UserService } from 'src/app/core/services/users/users.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  userData: CurrentUserJobPosition;

  isLoading: boolean = true;

  constructor(
    private userService: UserService,
    private modalService: NgbModal,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.userService.getCurentUserProfile().subscribe(res => {
      this.userData = res;
      this.isLoading = false;
      this.cdr.detectChanges();
    });
  }
}
