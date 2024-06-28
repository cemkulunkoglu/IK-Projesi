import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { LeaveTypeEnumLabelMapping, LeaveTypeEnum } from 'src/app/core/enums/user/leave/leave-type-enum.model';
import { LeaveInformationDetailModel } from 'src/app/core/models/dashboard/leave-information-detail.model';
import { LeaveInformationModel } from 'src/app/core/models/dashboard/leave-information.model';
import { UserDemandService } from 'src/app/core/services/users/user-demand.service';
import { UserService } from 'src/app/core/services/users/users.service';

@Component({
  selector: 'app-leave-information',
  templateUrl: './leave-information.component.html',
  styleUrls: ['./leave-information.component.scss']
})
export class LeaveInformationComponent implements OnInit {
  leaveData: Array<LeaveInformationDetailModel>;
  userData: LeaveInformationModel;
  futureLeave: any;
  annualLeave: any;
  userId:number;
  balanceLeave:number;
  totalLeave:number;
  percentageOfBar:number;

  constructor(
    private userService: UserService,
    private modalService: NgbModal,
    private userDemandService:UserDemandService,
    private cdr: ChangeDetectorRef
  ) {}
leaveReload() {
  this.showSpinner();

  this.functionOfLeave();

  setTimeout(() => {
    this.hideSpinner();
  }, 1000);
}

showSpinner() {
  document.getElementById("reloadButton").innerHTML = `
    <div id="spinner" class="spinner">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
  `;
}

hideSpinner() {
  document.getElementById("reloadButton").innerHTML = `
  <i class="fa-solid fa-arrows-rotate"></i>
  `;
}

barFunction(){
  var totalLeave=this.annualLeave + this.balanceLeave;
  var leavePercentage = (this.balanceLeave / totalLeave) * 100;
}
  functionOfLeave(){
    this.userDemandService.getCurentUserLeaveBalance().subscribe(res => {
      this.userData = res;
      this.annualLeave=res.annualLeave;
      this.futureLeave=res.futureLeave;
      this.leaveData = res.leaveDetails;
      this.balanceLeave=res.balanceLeave;
      this.totalLeave=res.annualLeave + res.balanceLeave;
      this.percentageOfBar=(this.balanceLeave/this.totalLeave)*100
      this.userId=res.userId;
      this.cdr.detectChanges();
    });
  }
  leaveTypeEnumLabelMapping = LeaveTypeEnumLabelMapping;
  leaveTypeEnum = Object.values(LeaveTypeEnum).filter(value => typeof value === 'number');
  ngOnInit() {
    this.functionOfLeave();
  }
}
