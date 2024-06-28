import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { HolidayDayModel } from 'src/app/core/models/holiday-day/holiday-day.model';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { HolidayDayService } from 'src/app/core/services/holiday-day/holiday-day.service';

@Component({
  selector: 'app-holiday-day',
  templateUrl: './holiday-day.component.html',
  styleUrls: ['./holiday-day.component.scss']
})
export class HolidayDayComponent implements OnInit {
  holidayDayData: Array<HolidayDayModel>;
  hasListPermission: boolean;

  constructor(
    private holidayDayService: HolidayDayService,
    private cdr: ChangeDetectorRef,
    private authService: AuthService
  ) { }

  functionOfOvertimePayments() {
    this.holidayDayService.getHolidayDaysFirstTen().subscribe(res => {
      this.holidayDayData = res;
      this.cdr.detectChanges();
    });
  }

  ngOnInit() {
    this.setPermissions();
    this.functionOfOvertimePayments();
  }


  setPermissions() {
    this.hasListPermission = this.authService.hasPermission('official-holiday-list');
  }
}
