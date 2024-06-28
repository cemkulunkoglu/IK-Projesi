import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-working-schedule',
  templateUrl: './working-schedule.component.html',
  styleUrls: ['./working-schedule.component.scss']
})
export class WorkingScheduleComponent implements OnInit {
  currentDate: BehaviorSubject<Date> = new BehaviorSubject(new Date());
  daysInMonth: Date[] = [];

  constructor() { }

  ngOnInit(): void {
    this.generateCalendar();
  }

  generateCalendar(): void {
    const firstDayOfMonth = new Date(this.currentDate.value.getFullYear(), this.currentDate.value.getMonth(), 1);
    const lastDayOfMonth = new Date(this.currentDate.value.getFullYear(), this.currentDate.value.getMonth() + 1, 0);

    this.daysInMonth = [];

    for (let i = firstDayOfMonth.getDate(); i <= lastDayOfMonth.getDate(); i++) {
      const day = new Date(this.currentDate.value.getFullYear(), this.currentDate.value.getMonth(), i);
      this.daysInMonth.push(day);
    }
  }

  previousMonth(): void {
    const newDate = new Date(this.currentDate.value);
    newDate.setMonth(newDate.getMonth() - 1);
    this.currentDate.next(newDate);
    this.generateCalendar();
  }

  nextMonth(): void {
    const newDate = new Date(this.currentDate.value);
    newDate.setMonth(newDate.getMonth() + 1);
    this.currentDate.next(newDate);
    this.generateCalendar();
  }
}
