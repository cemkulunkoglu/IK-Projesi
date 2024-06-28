import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { EducationsModel } from 'src/app/core/models/settings/educations/educations.model';
import { DatePipe } from '@angular/common';
import { EducationsService } from 'src/app/core/services/settings/educations.service';

@Component({
    selector: 'app-event-calendar',
    templateUrl: './event-calendar.component.html',
    styleUrls: ['./event-calendar.component.scss'],
    providers: [DatePipe]
})
export class EventCalendarComponent implements OnInit {
    educationData: Array<EducationsModel> = [];
    upcomingEvents: Array<EducationsModel> = [];
    hasUpcomingEvents: boolean = false;

    constructor(
        private educationsService: EducationsService,
        private cdr: ChangeDetectorRef,
        private datePipe: DatePipe
    ) { }

    filterUpcomingEvents() {
        const today = new Date();
        this.upcomingEvents = this.educationData.filter(event => new Date(event.startDate) >= today);
        this.hasUpcomingEvents = this.upcomingEvents.length > 0;
        this.cdr.detectChanges();
    }

    getDuration(event: EducationsModel): number {
        const startDate = new Date(event.startDate);
        const endDate = new Date(event.endDate);
        return Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24));
    }

    ngOnInit() {
        this.educationsService.getEducations().subscribe(res => {
            this.educationData = res;
            this.filterUpcomingEvents();
        });
    }

    formatDate(date: string | Date) {
        return this.datePipe.transform(date, 'dd/MM');
    }
}
