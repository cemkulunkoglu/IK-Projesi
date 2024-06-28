import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-system-settings',
    templateUrl: './system-settings.component.html',
    styleUrls: ['./system-settings.component.scss']
})
export class SystemSettingsComponent implements OnInit {
    activeTab: string = 'access';

    constructor() { }

    ngOnInit() { }

    setActiveTab(tab: string) {
        this.activeTab = tab;
    }
}
