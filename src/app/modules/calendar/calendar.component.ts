import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { UserDemandService } from 'src/app/core/services/users/user-demand.service';
import { UserLeaveModel } from 'src/app/core/models/users/leave/user-leave-model';
import { LeaveColorService, Resource } from 'src/app/core/services/holiday-day/resource';
import { DxSchedulerComponent } from 'devextreme-angular';
import { LeaveTypeEnum, LeaveTypeEnumLabelMapping } from 'src/app/core/enums/user/leave/leave-type-enum.model';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {
  @ViewChild(DxSchedulerComponent, { static: false }) scheduler: DxSchedulerComponent;
  dataSource: any[] = [ ];
  currentDate: Date = new Date();
  resourcesData: Resource[];

  selectedLeaveType: number;

  constructor(private userDemandService: UserDemandService,
    private cdr: ChangeDetectorRef,
    private leaveColorService:LeaveColorService) {   }

  ngOnInit() {
    //this.resourcesData = this.leaveColorService.getResources();
    this.loadLeaveData();
    this.resourcesData = this.leaveColorService.getResources();
  }

  onLeaveTypeChange(event: MatSelectChange) {
    this.loadLeaveData();
  }
    leaveTypesEnumValues = Object.keys(LeaveTypeEnum)
    .filter(key => !isNaN(Number(LeaveTypeEnum[key])))
    .map(key => ({ label: LeaveTypeEnumLabelMapping[Number(LeaveTypeEnum[key])], value: Number(LeaveTypeEnum[key]) }));


  // loadLeaveData() {
  //   this.dataSource=[];
  //   this.userDemandService.getAllApprovedLeaveForCalendar(this.selectedLeaveType).subscribe((leaveData: UserLeaveModel[]) => {
  //     leaveData.forEach(leave => {
  //       let newStartDate = new Date(leave.startDate);
  //       let newEndDate = new Date(leave.endDate);

  //       let year = newStartDate.getFullYear();
  //       let month = newStartDate.getMonth();
  //       let day = newStartDate.getDay();
  //       let hour = newStartDate.getHours();
  //       let minute = newStartDate.getMinutes();

  //       let yearEndDate = newEndDate.getFullYear();
  //       let monthEndDate = newEndDate.getMonth();
  //       let dayEndDate = newEndDate.getDay();
  //       let hourEndDate = newEndDate.getHours();
  //       let minuteEndDate = newEndDate.getMinutes();

  //       this.dataSource.push({
  //         startDate: new Date(year, month, day, hour, minute),
  //         endDate: new Date(yearEndDate, monthEndDate, dayEndDate, hourEndDate, minuteEndDate),
  //         text: leave.userName,
  //         description:leave.description,
  //         roomId: newEndDate < this.currentDate ? 15 : leave.leaveTypeId
  //       });
  //       this.cdr.detectChanges();
  //     });
  //   });
  // }
  loadLeaveData() {
    this.dataSource = [];
    this.userDemandService.getAllApprovedLeaveForCalendar(this.selectedLeaveType).subscribe((leaveData: UserLeaveModel[]) => {
      leaveData.forEach(leave => {
        let newStartDate = new Date(leave.startDate);
        let newEndDate = new Date(leave.endDate);

        this.dataSource.push({
          startDate: newStartDate,
          endDate: newEndDate,
          text: leave.userName,
          description: leave.description,
          roomId: newEndDate < this.currentDate ? 15 : leave.leaveTypeId
        });
      });
      this.cdr.detectChanges();
    });
  }

}
