import { Component, EventEmitter, Input, OnInit, OnDestroy, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';
import { DocumentTypeEnum, DocumentTypeLabelMapping } from 'src/app/core/enums/request-document/document-type-enum.model';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { RequestDocumentService } from 'src/app/core/services/users/request-document.service';
import { VisaProcess, VisaProcessDocumentForView } from 'src/app/core/models/settings/visa-process/visa-process.model';
import { VisaProcessService } from 'src/app/core/services/settings/visa-process.service';
import { RequestDocumentCreateModel } from 'src/app/core/models/users/request-document/request-document-create.model';

@Component({
  selector: 'app-sidebar-document-request',
  templateUrl: './sidebar-document-request.component.html',
  styleUrls: ['./sidebar-document-request.component.scss']
})
export class SidebarDocumentRequestComponent implements OnInit, OnDestroy {
  currentUser: UserType;
  @Output() userDocumentRequestCreate = new EventEmitter<string>();
  isLoading$: Observable<boolean>;
  isLoadingSubject: BehaviorSubject<boolean>;
  private unsubscribe: Subscription[] = [];
  documentRequestCreateForm: FormGroup;

  //#region DocumentType
  documentTypeLabelMapping = DocumentTypeLabelMapping;
  documentTypeEnum = Object.values(DocumentTypeEnum).filter(value => typeof value === 'number');
  //#endregion

  visaProcesses: VisaProcess[] = [];
  selectedVisaDocuments: VisaProcessDocumentForView[] = [];
  selectedDocuments: number[] = [];

  @Input() userId: number;

  _onDestroy = new Subject<void>();
  message: string;

  constructor(
    private fb: FormBuilder,
    public requestDocumentService: RequestDocumentService,
    private toastrService: ToastrService,
    private authService: AuthService,
    private visaProcessService: VisaProcessService
  ) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.isLoading$ = this.isLoadingSubject.asObservable();
  }

  getCurrentUser() {
    this.currentUser = this.authService.currentUserValue;
  }

  ngOnInit() {
    this.getCurrentUser();
    this.loadVisaProcesses();
    this.documentRequestCreateForm = this.fb.group({
      userId: [this.currentUser.id],
      description: ["", Validators.required],
      travelStartDate: ["", Validators.required],
      travelEndDate: ["", Validators.required],
      lastDueDate: ["", Validators.required],
      destinationCountry: ["", Validators.required],
      visaProcessId: ["", Validators.required],
      documentType: [1],
    });

    this.documentRequestCreateForm.get('visaProcessId').valueChanges.subscribe(value => {
      this.updateVisaDocuments(value);
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  adjustForTimezone(date: Date): Date {
    const timeOffsetInMS: number = date.getTimezoneOffset() * 60000;
    date.setTime(date.getTime() - timeOffsetInMS);
    return date;
  }

  loadVisaProcesses() {
    this.visaProcessService.getVisaProcesses().subscribe(
      (processes: VisaProcess[]) => {
        this.visaProcesses = processes;
      },
      err => {
        this.toastrService.error("Vize işlemleri yüklenemedi.", "Hata");
      }
    );
  }

  updateVisaDocuments(visaProcessId: number) {
    const selectedVisaProcess = this.visaProcesses.find(visa => visa.id === visaProcessId);
    this.selectedVisaDocuments = selectedVisaProcess ? selectedVisaProcess.visaProcessDocuments : [];
    this.selectedDocuments = [];
  }

  toggleDocumentSelection(docId: number, event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    if (isChecked) {
      this.selectedDocuments.push(docId);
    } else {
      this.selectedDocuments = this.selectedDocuments.filter(id => id !== docId);
    }
  }

  saveDocumentRequest() {
    this.isLoadingSubject.next(true);
    this.message = "";
    if (this.documentRequestCreateForm.valid) {
      const formValue = this.documentRequestCreateForm.value;
      const requestDocument: RequestDocumentCreateModel = {
        userId: formValue.userId,
        documentType: formValue.documentType,
        visaProcessId: formValue.visaProcessId,
        travelStartDate: this.adjustForTimezone(new Date(formValue.travelStartDate)),
        travelEndDate: this.adjustForTimezone(new Date(formValue.travelEndDate)),
        lastDueDate: this.adjustForTimezone(new Date(formValue.lastDueDate)),
        destinationCountry: formValue.destinationCountry,
        description: formValue.description,
        visaProcessDocuments: this.selectedDocuments,
      };

      this.requestDocumentService.createUserDocument(requestDocument).subscribe(
        res => {
          if (res.data === 0) {
            this.toastrService.warning(res.messages[0].toString());
            this.isLoadingSubject.next(false);
            this.userDocumentRequestCreate.emit("true");
          } else {
            this.toastrService.success("İşlem Başarılı");
            this.isLoadingSubject.next(false);
            this.userDocumentRequestCreate.emit("true");
            setTimeout(() => {
              document.location.reload();
            }, 3000);
          }
        },
        err => {
          err.error.messages.forEach(element => {
            this.message += element + '. ';
          });
          this.toastrService.error(this.message, "Hata");
          this.isLoadingSubject.next(false);
          this.userDocumentRequestCreate.emit("true");
        }
      );
    } else {
      this.toastrService.warning("Formu Kontrol Ediniz.", "Uyarı");
      this.isLoadingSubject.next(false);
    }
  }

  hasPermission(permission: string): boolean {
    return this.authService.hasPermission(permission);
  }
}

interface UserType {
  id: number;
}
