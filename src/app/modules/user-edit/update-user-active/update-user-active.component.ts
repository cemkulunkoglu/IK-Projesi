import { Component, EventEmitter, Inject, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Observable, BehaviorSubject, Subscription, Subject } from 'rxjs';
import { UpdateUserActiveModel } from 'src/app/core/models/users/update-user-activity.model';
import { AuthService, UserType } from 'src/app/core/services/auth/auth.service';
import { LeavingJobReasonCategoryService } from 'src/app/core/services/users/leaving-job-reason-category.service';
import { UserService } from 'src/app/core/services/users/users.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-update-user-active',
  templateUrl: './update-user-active.component.html',
  styleUrls: ['./update-user-active.component.scss'],
  providers: [DatePipe]
})
export class UpdateUserActiveComponent implements OnInit {
  @Output() userActiveUpdate = new EventEmitter<string>();
  isLoading$: Observable<boolean>;
  isLoadingSubject: BehaviorSubject<boolean>;
  private unsubscribe: Subscription[] = [];
  leavingWorkReasonCategories: any[];

  changeUpdateUserForm: FormGroup;
  uploadedFile: File | null = null;

  _onDestroy = new Subject<void>();
  message: string;
  userId: number;
  currentUser: UserType;
  leavingWorkReason: string;
  minDate: Date = new Date();

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    public userService: UserService,
    private leavingJobReasonCategoryService: LeavingJobReasonCategoryService,
    private toastrService: ToastrService,
    private datePipe: DatePipe,
    public dialogRef: MatDialogRef<UpdateUserActiveComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.isLoading$ = this.isLoadingSubject.asObservable();
    this.userId = data;
  }

  ngOnInit() {
    this.changeUpdateUserForm = this.fb.group({
      userId: [this.userId, Validators.required],
      leavingWorkReason: ["", Validators.required],
      contractEndDate: ["", Validators.required],
      description: ["", Validators.required],
      extension: ["", Validators.required],
      content: [null, Validators.required],
    });
    this.leavingWorkReasonCategoryData();
  }

  leavingWorkReasonCategoryData() {
    this.leavingJobReasonCategoryService.getLeavingJobReasonCategories().subscribe(
      (data: any[]) => {
        this.leavingWorkReasonCategories = data;
      },
      (error) => {
        console.error('Hata:', error);
      }
    );
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (this.changeUpdateUserForm && this.isAcceptedFileType(file)) {
      this.uploadedFile = file;
      const extension = this.extractFileExtension(file);
      this.changeUpdateUserForm.patchValue({
        extension: extension
      });
      this.convertFileToBase64(file);
    } else {
      this.toastrService.warning("Geçersiz bir dosya seçtiniz. Lütfen yalnızca PDF, JPEG, PNG veya JPG formatındaki dosyaları seçin.");
    }
  }

  isAcceptedFileType(file: File): boolean {
    const acceptedTypes = ["application/pdf", "image/jpeg", "image/png", "image/jpg"];
    return acceptedTypes.includes(file.type);
  }

  convertFileToBase64(file: File): void {
    const reader = new FileReader();

    reader.onloadend = () => {
      const base64Content = reader.result as string;
      const startIndex = base64Content.indexOf(',') + 1;
      const cleanedBase64 = base64Content.substring(startIndex);

      this.changeUpdateUserForm.patchValue({
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

  adjustForTimezone(date: Date): Date {
    const timeOffsetInMS: number = date.getTimezoneOffset() * 60000;
    date.setTime(date.getTime() - timeOffsetInMS);
    return date;
  }

  saveUserActive() {
    this.isLoadingSubject.next(true);
    this.message = "";
    if (this.changeUpdateUserForm.valid) {
      let contractEndDate: Date = new Date(this.changeUpdateUserForm.get('contractEndDate').value);
      contractEndDate = this.adjustForTimezone(contractEndDate);

      const updateUserActiveModel: UpdateUserActiveModel = {
        userId: this.changeUpdateUserForm.get('userId').value,
        leavingWorkReason: this.changeUpdateUserForm.get('leavingWorkReason').value,
        description: this.changeUpdateUserForm.get('description').value,
        contractEndDate: contractEndDate,
        documents: [{
          name: 'İşten Çıkış Evrağı',
          extension: this.changeUpdateUserForm.get('extension').value,
          content: this.changeUpdateUserForm.get('content').value
        }]
      };

      this.userService.updateUserActivity(updateUserActiveModel).subscribe(
        res => {
          if (res.data == 0) {
            this.toastrService.warning(res.messages[0].toString());
            this.isLoadingSubject.next(false);
            this.userActiveUpdate.emit("true");
          } else {
            this.toastrService.success("İşlem Başarılı");
            this.isLoadingSubject.next(false);
            this.userActiveUpdate.emit("true");
            setTimeout(() => {
              document.location.reload();
            }, 2000);
          }
        },
        err => {
          err.error.messages.forEach(element => {
            this.message += element + '. ';
          });
          this.toastrService.error(this.message, "Hata");
          this.isLoadingSubject.next(false);
          this.userActiveUpdate.emit("true");
        }
      );
    } else {
      this.toastrService.warning("Formu Kontrol Ediniz.", "Uyarı");
      this.isLoadingSubject.next(false);
    }
  }

  closeModal() {
    this.dialogRef.close();
  }
}
