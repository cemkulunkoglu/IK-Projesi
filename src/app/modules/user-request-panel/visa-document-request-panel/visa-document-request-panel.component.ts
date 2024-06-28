import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import CustomStore from 'devextreme/data/custom_store';
import { ToastrService } from 'ngx-toastr';
import { GridUtil } from 'src/app/_metronic/kt/_utils/GridUtil';
import { DocumentTypeLabelMapping } from 'src/app/core/enums/request-document/document-type-enum.model';
import { RequestDocumentService } from 'src/app/core/services/users/request-document.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-visa-document-request-panel',
  templateUrl: './visa-document-request-panel.component.html',
  styleUrls: ['./visa-document-request-panel.component.scss']
})
export class VisaDocumentRequestPanelComponent implements OnInit {
  @Input() userId: number;
  dataSource: CustomStore;
  paymentId: number;

  constructor(
    private requestDocumentService: RequestDocumentService,
    private toastrService: ToastrService,
    private activatedRoute: ActivatedRoute,
    private modalService: NgbModal) {
  }

  ngOnInit() {
    this._dataSource();
  }

  DocumentTypeLabelMapping = DocumentTypeLabelMapping;

  _dataSource() {
    this.dataSource = new CustomStore({
      key: 'id',
      load: () => GridUtil.handleGridResponse(this.requestDocumentService.getDocuments()),
    });
  }

  editPaymentClick(e, userPaymentEdit) {
    this.paymentId = e.data.id;
    this.modalService.open(userPaymentEdit, { size: 'lg' });
  }

  deletePaymentClick(e) {
    swal({
      title: "Silmek İstediğinize Emin misiniz?",
      text: "Seçili eğitimi bilgisi silinecek!",
      type: 'question',
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: 'Evet, Sil',
      cancelButtonText: 'Hayır',
    }).then((willDelete) => {
      if (willDelete.value) {
        this.requestDocumentService.deleteDocument(e.row.data.id).subscribe(
          res => {
            this.toastrService.success("Eğitim Bilgisi Silindi", "İşlem Başarılı");
            this._dataSource();
          },
          err => {
            this.toastrService.error("Bir Hata Oluştu. Lütfen Tekrar Deneyiniz", "Hata");
          });
      }
    });
  }


  reloadDataSource(e) {
    if (e == "true") {
      this.modalService.dismissAll();
      this._dataSource();
    }
  };
}
