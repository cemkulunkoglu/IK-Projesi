import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import CustomStore from 'devextreme/data/custom_store';
import { ToastrService } from 'ngx-toastr';
import { UserEmbezzlementService } from 'src/app/core/services/users/user-embezzlement.service';
import swal from 'sweetalert2';
import Docxtemplater from 'docxtemplater';
import PizZip from 'pizzip';
import PizZipUtils from 'pizzip/utils/index.js';
import { saveAs } from 'file-saver';
import { GridUtil } from 'src/app/_metronic/kt/_utils/GridUtil';
import { AuthService } from 'src/app/core/services/auth/auth.service';

@Component({
  selector: 'app-embezzlement',
  templateUrl: './embezzlement.component.html',
  styleUrls: ['./embezzlement.component.scss']
})
export class EmbezzlementComponent implements OnInit {
  @Output() newActiveTab = new EventEmitter<string>();
  @Input() userId: number;
  dataSource: CustomStore;
  embezzlementId: number;
  hasCreatePermission: boolean;
  hasListPermission: boolean;
  hasUpdatePermission: boolean;
  hasDeletePermission: boolean;

  constructor(
    private toastrService: ToastrService,
    private userEmbezzlementService: UserEmbezzlementService,
    private modalService: NgbModal,
    private cdr: ChangeDetectorRef,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this._dataSource();
    this.hasListPermission = this.authService.hasPermission('user-embezzlement-list');
    this.hasCreatePermission = this.authService.hasPermission('create-user-embezzlement-leave');
    this.hasUpdatePermission = this.authService.hasPermission('update-user-embezzlement-leave');
    this.hasDeletePermission = this.authService.hasPermission('delete-user-embezzlement-leave');
  }

  _dataSource() {
    this.dataSource = new CustomStore({
      key: 'id',
      load: () => GridUtil.handleGridResponse(this.userEmbezzlementService.getUserEmbezzlementByUserId(this.userId)),
    });
    this.cdr.detectChanges();
  }

  editEmbezzlementClick(e, userEmbezzlementEdit) {
    this.embezzlementId = e.data.id;
    this.modalService.open(userEmbezzlementEdit, { size: 'lg' });
  }

  deleteEmbezzlementClick(e) {
    swal({
      title: "Silmek İstediğinize Emin misiniz?",
      text: "Seçili zimmet bilgisi silinecek!",
      type: 'question',
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: 'Evet, Sil',
      cancelButtonText: 'Hayır',
    }).then((willDelete) => {
      if (willDelete.value) {
        this.userEmbezzlementService.deleteUserEmbezzlement(e.row.data.id).subscribe(
          res => {
            this.toastrService.success("Zimmet Bilgisi Silindi", "İşlem Başarılı");
            this._dataSource();
          },
          err => {
            this.toastrService.error("Bir Hata Oluştu. Lütfen Tekrar Deneyiniz", "Hata");
          });
      }
    });
  }

  showEmbezzlementModal(userEmbezzlementCreate) {
    this.modalService.open(userEmbezzlementCreate, { size: 'lg' });
  }

  reloadDataSource(e) {
    if (e === "true") {
      this.modalService.dismissAll();
      this._dataSource();
    }
  }

  loadFile(url, callback) {
    PizZipUtils.getBinaryContent(url, callback);
  }

  generateDocument() {
    this.userEmbezzlementService.getUserEmbezzlementDocument(this.userId).subscribe(
      (data) => {
        this.loadFile('assets/zimmetfisi.docx', (error, content) => {
          if (error) {
            throw error;
          }
          const zip = new PizZip(content);
          const doc = new Docxtemplater(zip, {
            paragraphLoop: true,
            linebreaks: true,
          });

          doc.setData(data);

          try {
            doc.render();
          } catch (error) {
            console.log(JSON.stringify({ error: error }, this.replaceErrors));

            if (error.properties && error.properties.errors instanceof Array) {
              const errorMessages = error.properties.errors
                .map(function (error) {
                  return error.properties.explanation;
                })
                .join('\n');
              console.log('errorMessages', errorMessages);
            }
            throw error;
          }

          const out = doc.getZip().generate({
            type: 'blob',
            mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          });
          saveAs(out, 'zimmet_fisi.docx');
        });
      },
      (err) => {
        this.toastrService.error("Belge verisi alınırken bir hata oluştu", "Hata");
      }
    );
  }

  replaceErrors(key, value) {
    if (value instanceof Error) {
      return Object.getOwnPropertyNames(value).reduce(function (error, key) {
        error[key] = value[key];
        return error;
      }, {});
    }
    return value;
  }

  hasPermission(permission: string): boolean {
    return this.authService.hasPermission(permission);
  }
}
