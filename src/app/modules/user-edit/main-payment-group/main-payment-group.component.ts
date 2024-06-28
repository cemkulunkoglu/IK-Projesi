import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-main-payment-group',
  templateUrl: './main-payment-group.component.html',
  styleUrls: ['./main-payment-group.component.scss']
})
export class MainPaymentGroupComponent {
  @Input() userId: number;

  activeTab: string = 'payment-group';

  showTab(tab: string) {
    this.activeTab = tab;
  }

  isJobPositionVisible: boolean = false;
  isSalaryVisible: boolean = false;
  isWorkSchedulesVisible: boolean = false;

  isPaymentButtonClicked = false;
  isSalaryButtonClicked = false;
  isWorkSchedulesButtonClicked = false;

  showJobPosition() {
    this.isJobPositionVisible = true;
    this.isSalaryVisible = false;
    this.isWorkSchedulesVisible = false;
  }

  showWorkSchedules() {
    this.isJobPositionVisible = false;
    this.isSalaryVisible = false;
    this.isWorkSchedulesVisible = true;
  }

  showSalary() {
    this.isJobPositionVisible = false;
    this.isSalaryVisible = true;
    this.isWorkSchedulesVisible = false;
  }

  getContent(tab: string): string {
    switch (tab) {
      case 'payment-group':
        return 'Harcamalarım';
      case 'overtime':
        return 'Fazla Mesailer';
      case 'additionalPayment':
        return 'Ek Ödemeler';
      case 'specialDeduction':
        return 'Özel Kesintiler';
      default:
        return '';
    }
  }
}
