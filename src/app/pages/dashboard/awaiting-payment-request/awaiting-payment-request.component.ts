import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AwaitingPaymentRequestModel } from 'src/app/core/models/dashboard/awaiting-payment-request.model';
import { UserPaymentModel } from 'src/app/core/models/users/payment/user-payment.model';
import { UserPaymentService } from 'src/app/core/services/users/user-payment.service';

@Component({
  selector: 'app-awaiting-payment-request',
  templateUrl: './awaiting-payment-request.component.html',
  styleUrls: ['./awaiting-payment-request.component.scss']
})
export class AwaitingPaymentRequestComponent implements OnInit {
  userData: Array<UserPaymentModel>;
  @Output() paymentRequest = new EventEmitter<number>();

  constructor(
    private userPaymentService: UserPaymentService,
    private modalService: NgbModal,
    private cdr: ChangeDetectorRef
  ) {}

  awaitingPaymentRequest(){
    this.userPaymentService.getUserAdvancePayments().subscribe(res => {
      this.userData = res;
      this.paymentRequest.emit(res.length);
      this.cdr.detectChanges();
    });
  }

  dksljfldkjflkdfjgldkj() {
    this.showSpinner();

    this.awaitingPaymentRequest();

    setTimeout(() => {
      this.hideSpinner();
    }, 2000);
  }

  showSpinner() {
    document.getElementById("reloadAwaitingPayementButton").innerHTML = `
      <div id="spinner" class="spinner">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
    `;
  }

  hideSpinner() {
    document.getElementById("reloadAwaitingPayementButton").innerHTML = `
    <i class="fa-solid fa-arrows-rotate"></i>
    `;
  }
  ngOnInit() {
    this.awaitingPaymentRequest();
  }
}
