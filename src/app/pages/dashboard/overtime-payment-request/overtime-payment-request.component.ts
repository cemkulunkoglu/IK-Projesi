import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserPaymentModel } from 'src/app/core/models/users/payment/user-payment.model';
import { UserPaymentService } from 'src/app/core/services/users/user-payment.service';

@Component({
  selector: 'app-overtime-payment-request',
  templateUrl: './overtime-payment-request.component.html',
  styleUrls: ['./overtime-payment-request.component.scss']
})
export class OvertimePaymentRequestComponent implements OnInit {
  userData: Array<UserPaymentModel>;
  @Output() paymentRequest = new EventEmitter<number>();

  constructor(
    private userPaymentService: UserPaymentService,
    private modalService: NgbModal,
    private cdr: ChangeDetectorRef
  ) {}

  functionOfOvertimePayments(){
    this.userPaymentService.getUserOvertimePayments().subscribe(res => {
      this.userData = res;
      this.paymentRequest.emit(res.length);
      this.cdr.detectChanges();
    });
  }
  leaveReload() {
    this.showSpinner();

    this.functionOfOvertimePayments();

    setTimeout(() => {
      this.hideSpinner();
    }, 1000);
  }

  showSpinner() {
    document.getElementById("reloadOvertimePaymentsButton").innerHTML = `
      <div id="spinner" class="spinner">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
    `;
  }

  hideSpinner() {
    document.getElementById("reloadOvertimePaymentsButton").innerHTML = `
    <i class="fa-solid fa-arrows-rotate"></i>
    `;
  }
  ngOnInit() {
    this.functionOfOvertimePayments();
  }
}
