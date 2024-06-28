import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Observable, BehaviorSubject, Subscription, Subject } from 'rxjs';
import { DocumentBase64 } from 'src/app/core/models/users/document/document-base64-model';
import { UserDocumentCreateModel } from 'src/app/core/models/users/document/user-document-create.model';
import { CompanyInfoService } from 'src/app/core/services/settings/company-info.service';
import { DocumentTypeService } from 'src/app/core/services/settings/document-type.service';
import { UserDocumentService } from 'src/app/core/services/users/user-document.service';
import { UserService } from 'src/app/core/services/users/users.service';


@Component({
  selector: 'app-document-create',
  templateUrl: './document-create.component.html',
})
export class DocumentCreateComponent implements OnInit {
  @Output() userDocumentCreate = new EventEmitter<string>();
  isLoading$: Observable<boolean>;
  isLoadingSubject: BehaviorSubject<boolean>;
  private unsubscribe: Subscription[] = [];
  documentCreateForm: FormGroup;
  documentCategories: any[];
  uploadedFile: File | null = null;

  @Input() userId: number;

  _onDestroy = new Subject<void>();
  message: string;

  constructor(
    private fb: FormBuilder,
    private companyInfoService: CompanyInfoService,
    private documentTypeService: DocumentTypeService,
    public userService: UserService,
    private userDocumentService: UserDocumentService,
    private toastrService: ToastrService
  ) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.isLoading$ = this.isLoadingSubject.asObservable();
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
    this.documentCreateForm = this.fb.group({
      userId: [this.userId, Validators.required],
      name: ["", Validators.required],
      documentTypeId: ["", Validators.required],
      extension: ["", Validators.required],
      content: [null],
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (this.documentCreateForm) {
      const extension = this.extractFileExtension(file);
      if (extension.toLowerCase() !== 'pdf') {
        this.toastrService.error('Sadece PDF dosya formatına izin verilmektedir.', 'Hata');
        return;
      }

      this.uploadedFile = file;
      this.documentCreateForm.patchValue({
        extension: extension
      });

      this.convertFileToBase64(file);
    }
  }

  convertFileToBase64(file: File): void {
    const reader = new FileReader();

    reader.onloadend = () => {
      const base64Content = reader.result as string;
      const startIndex = base64Content.indexOf(',') + 1;
      const cleanedBase64 = base64Content.substring(startIndex);

      this.documentCreateForm.patchValue({
        content: cleanedBase64
      });
    };

    reader.readAsDataURL(file);
  }

  extractFileExtension(file: File): string {
    const fileName = file.name;
    const lastDotIndex = fileName.lastIndexOf('.');
    return fileName.substring(lastDotIndex + 1);
  }

  saveDocument() {
    this.isLoadingSubject.next(true);
    this.message = "";
    if (this.documentCreateForm.valid) {
      const userDocumentCreateModel: UserDocumentCreateModel = {
        userId: this.documentCreateForm.get('userId').value,
        documentTypeId: this.documentCreateForm.get('documentTypeId').value,
        document: {
          name: this.documentCreateForm.get('name').value,
          extension: this.documentCreateForm.get('extension').value,
          content: this.documentCreateForm.get('content').value
        }
      };
      this.userDocumentService.createUserDocument(userDocumentCreateModel).subscribe(
        res => {
          if (res.data == 0) {
            this.toastrService.warning(res.messages[0].toString());
            this.isLoadingSubject.next(false);
            this.userDocumentCreate.emit("true");
          } else {
            this.toastrService.success("İşlem Başarılı");
            this.isLoadingSubject.next(false);
            this.userDocumentCreate.emit("true");
          }
        },
        err => {
          err.error.messages.forEach(element => {
            this.message += element + '. ';
          });
          this.toastrService.error(this.message, "Hata");
          this.isLoadingSubject.next(false);
          this.userDocumentCreate.emit("true");
        }
      );
    } else {
      this.toastrService.warning("Formu Kontrol Ediniz.", "Uyarı");
      this.isLoadingSubject.next(false);
    }
  }
}
