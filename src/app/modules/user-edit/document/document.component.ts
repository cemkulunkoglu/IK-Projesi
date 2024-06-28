import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import CustomStore from 'devextreme/data/custom_store';
import { ToastrService } from 'ngx-toastr';
import { GridUtil } from 'src/app/_metronic/kt/_utils/GridUtil';
import { UserDocumentService } from 'src/app/core/services/users/user-document.service';
import { UserService } from 'src/app/core/services/users/users.service';
import swal from 'sweetalert2';
import { AuthService } from 'src/app/core/services/auth/auth.service';

@Component({
  selector: 'app-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.scss']
})
export class DocumentComponent implements OnInit {
  @Output() newActiveTab = new EventEmitter<string>();
  @Input() userId: number;
  dataSource: CustomStore;
  documentId: number;

  hasListPermission: boolean;
  hasCreatePermission: boolean;
  hasUpdatePermission: boolean;
  hasDeletePermission: boolean;

  constructor(
    private router: Router,
    private userDocumentService: UserDocumentService,
    private userService: UserService,
    private toastrService: ToastrService,
    private activatedRoute: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private modalService: NgbModal,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this._dataSource();
    this.setPermissions();
    this.cdr.detectChanges();
  }

  setPermissions() {
    this.hasListPermission = this.authService.hasPermission('user-document-list');
    this.hasCreatePermission = this.authService.hasPermission('user-document-create');
    this.hasUpdatePermission = this.authService.hasPermission('user-document-update');
    this.hasDeletePermission = this.authService.hasPermission('user-document-delete');
  }

  _dataSource() {
    this.dataSource = new CustomStore({
      key: 'id',
      load: () => GridUtil.handleGridResponse(this.userDocumentService.getUserDocumentsByUserId(this.userId)),
    });
  }

  editDocumentClick(e, userDocumentEdit) {
    this.documentId = e.data.id;
    this.modalService.open(userDocumentEdit, { size: 'lg' });
  }

  deleteDocumentClick(e) {
    swal({
      title: "Silmek İstediğinize Emin misiniz?",
      text: "Seçili dökümanı bilgisi silinecek!",
      type: 'question',
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: 'Evet, Sil',
      cancelButtonText: 'Hayır',
    }).then((willDelete) => {
      if (willDelete.value) {
        this.userDocumentService.deleteUserDocument(e.row.data.id).subscribe(
          res => {
            this.toastrService.success("Döküman Silindi", "İşlem Başarılı");
            this._dataSource();
          },
          err => {
            this.toastrService.error("Bir Hata Oluştu. Lütfen Tekrar Deneyiniz", "Hata");
          });
      }
    });
  }

  showDocumentModal(userDocumentCreate) {
    this.modalService.open(userDocumentCreate, { size: 'lg' });
  }

  reloadDataSource(e) {
    if (e == "true") {
      this.modalService.dismissAll();
      this._dataSource();
    }
  }

  openNewPage(item: any) {
    const url = item.data.path;
    window.open(url, '_blank');
  }
}
