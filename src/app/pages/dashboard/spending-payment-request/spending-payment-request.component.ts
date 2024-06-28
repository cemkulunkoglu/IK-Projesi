import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserPaymentModel } from 'src/app/core/models/users/payment/user-payment.model';
import { UserPaymentService } from 'src/app/core/services/users/user-payment.service';

@Component({
  selector: 'app-spending-payment-request',
  templateUrl: './spending-payment-request.component.html',
  styleUrls: ['./spending-payment-request.component.scss']
})
export class SpendingPaymentRequestComponent implements OnInit {
  userData: Array<UserPaymentModel>;
  @Output() paymentRequest = new EventEmitter<number>();

  constructor(
    private userPaymentService: UserPaymentService,
    private modalService: NgbModal,
    private cdr: ChangeDetectorRef
  ) {}

  functionOfSpendingPaymentRequest(){
    this.userPaymentService.getUserSpendingPayments().subscribe(res => {
      this.userData = res;
      this.paymentRequest.emit(res.length);
      this.cdr.detectChanges();
    });
  }
  leaveReload() {
    this.showSpinner();

    this.functionOfSpendingPaymentRequest();

    setTimeout(() => {
      this.hideSpinner();
    }, 1000);
  }

  showSpinner() {
    document.getElementById("reloadPaymentRequestButton").innerHTML = `
      <div id="spinner" class="spinner">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
    `;
  }

  hideSpinner() {
    document.getElementById("reloadPaymentRequestButton").innerHTML = `
    <i class="fa-solid fa-arrows-rotate"></i>
    `;
  }
  ngOnInit() {
    this.functionOfSpendingPaymentRequest();

  }
}
