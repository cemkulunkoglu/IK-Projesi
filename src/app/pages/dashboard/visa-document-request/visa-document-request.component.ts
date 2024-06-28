import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RequestDocumentModel } from 'src/app/core/models/users/request-document/request-document.model';
import { RequestDocumentService } from 'src/app/core/services/users/request-document.service';
import { UserPaymentService } from 'src/app/core/services/users/user-payment.service';

@Component({
  selector: 'app-visa-document-request',
  templateUrl: './visa-document-request.component.html',
  styleUrls: ['./visa-document-request.component.scss']
})
export class VisaDocumentRequestComponent implements OnInit {
  userData: Array<RequestDocumentModel>;
  @Output() requestDocument = new EventEmitter<number>();

  constructor(
    private requestDocumentService: RequestDocumentService,
    private modalService: NgbModal,
    private cdr: ChangeDetectorRef
  ) {}
  leaveReload() {
    this.showSpinner();

    this.functionOfGetDocuments();

    setTimeout(() => {
      this.hideSpinner();
    }, 1000);
  }

  showSpinner() {
    document.getElementById("reloadDocumentButton").innerHTML = `
      <div id="spinner" class="spinner">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
    `;
  }

  hideSpinner() {
    document.getElementById("reloadDocumentButton").innerHTML = `
    <i class="fa-solid fa-arrows-rotate"></i>
    `;
  }
  functionOfGetDocuments(){
    this.requestDocumentService.getDocuments().subscribe(res => {
      this.userData = res;
      this.requestDocument.emit(res.length);
      this.cdr.detectChanges();
    });
  }
  ngOnInit() {
    this.functionOfGetDocuments();
  }
}
