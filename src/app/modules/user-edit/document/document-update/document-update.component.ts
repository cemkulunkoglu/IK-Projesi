import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable, BehaviorSubject, Subscription, Subject } from 'rxjs';
import { DocumentTypeService } from 'src/app/core/services/settings/document-type.service';
import { UserDocumentService } from 'src/app/core/services/users/user-document.service';
import { UserService } from 'src/app/core/services/users/users.service';

@Component({
  selector: 'app-document-update',
  templateUrl: './document-update.component.html',
})
export class DocumentUpdateComponent implements OnInit {
  @Output() userDocumentEdit = new EventEmitter<string>();
  isLoading$: Observable<boolean>;
  isLoadingSubject: BehaviorSubject<boolean>;
  private unsubscribe: Subscription[] = [];
  documentUpdateForm: FormGroup;
  documentCategories: any[];

  @Input() documentId: number;
  _onDestroy = new Subject<void>();
  message: string;
  userId:number;
  constructor(
    private fb: FormBuilder,
    private userDocumentService:UserDocumentService,
    private documentTypeService:DocumentTypeService,
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
    private toastrService: ToastrService) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.isLoading$ = this.isLoadingSubject.asObservable();
    this.userId = this.activatedRoute.snapshot.params.id;
  }

  documentCategoryData() {
    this.documentTypeService.getDocumentTypes().subscribe(
      (data: any[]) => {
        this.documentCategories = data;
      },
      (error) => {
        console.error('Error fetching document categories:', error);
      }
    );
  }

  ngOnInit() {
    this.documentCategoryData();
    this.documentUpdateForm = this.fb.group({
      id: ["", Validators.required],
      userId: ["", Validators.required],
      documentTypeId: ["", Validators.required],
      name:[],
    });

    this.userDocumentService.getUserDocumentById(this.documentId).subscribe(res => {
      this.documentUpdateForm.controls["id"].setValue(res.data.id);
      this.documentUpdateForm.controls["userId"].setValue(res.data.userId);
      this.documentUpdateForm.controls["name"].setValue(res.data.name);
      this.documentUpdateForm.controls["documentTypeId"].setValue(res.data.documentTypeId);
    })
  }

  ngOnDestroy(): void {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  saveDocument() {
    debugger;
    this.isLoadingSubject.next(true);
    this.message = "";
    if (this.documentUpdateForm.valid) {
      this.userDocumentService.updateUserDocument(this.documentUpdateForm.value).subscribe(
        res => {
          if (res.data == 0) {
            this.toastrService.warning(res.messages[0].toString());
            this.isLoadingSubject.next(false);
            this.userDocumentEdit.emit("true");
          } else {
            this.toastrService.success("İşlem Başarılı");
            this.isLoadingSubject.next(false);
            this.userDocumentEdit.emit("true");
          }
        },
        err => {
          err.error.messages.forEach(element => {
            this.message += element + '. ';
          });
          this.toastrService.error(this.message, "Hata");
          this.isLoadingSubject.next(false);
          this.userDocumentEdit.emit("true");
        }
      );
    } else {
      this.toastrService.warning("Formu Kontrol Ediniz.", "Uyarı");
      this.isLoadingSubject.next(false);
    }
  }
}
