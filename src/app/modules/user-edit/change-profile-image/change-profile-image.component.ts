import { Component, Inject, EventEmitter, Input, OnInit, OnDestroy, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Observable, BehaviorSubject, Subscription } from 'rxjs';
import { BaseResponse } from 'src/app/core/models/base-response';
import { UserModel } from 'src/app/core/models/users/user.model';
import { UserService } from 'src/app/core/services/users/users.service';

@Component({
  selector: 'app-change-profile-image',
  templateUrl: './change-profile-image.component.html',
  styleUrls: ['./change-profile-image.component.scss']
})
export class ChangeProfileImageComponent implements OnInit, OnDestroy {
  @Output() userPictureCreate = new EventEmitter<string>();
  isLoading$: Observable<boolean>;
  isLoadingSubject: BehaviorSubject<boolean>;
  private unsubscribe: Subscription[] = [];
  pictureCreateForm: FormGroup;
  uploadedFile: File | null = null;

  constructor(
    public dialogRef: MatDialogRef<ChangeProfileImageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { userId: number },
    private fb: FormBuilder,
    private toastrService: ToastrService,
    private userService: UserService
  ) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.isLoading$ = this.isLoadingSubject.asObservable();
  }

  onClose(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
    this.isLoadingSubject.next(true);
    this.userService.getUserDetail(this.data.userId).subscribe(
      (res: BaseResponse<UserModel>) => {
        this.initializeForm(res.data.id);
        this.isLoadingSubject.next(false);
      },
      error => {
        this.toastrService.error("Kullanıcı bilgileri alınırken bir hata oluştu.", "Hata");
        this.isLoadingSubject.next(false);
      }
    );
  }

  initializeForm(userId: number) {
    this.pictureCreateForm = this.fb.group({
      id: [userId],
      extension: [""],
      profilPicture: [null, Validators.required]
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (this.pictureCreateForm && this.isImageFile(file)) {
      this.uploadedFile = file;
      const extension = this.extractFileExtension(file);
      this.pictureCreateForm.patchValue({
        extension: extension
      });
      this.convertFileToBase64(file);
    } else {
      this.toastrService.warning("Geçersiz bir dosya seçtiniz. Lütfen yalnızca png, jpeg veya jpg formatındaki dosyaları seçin.");
    }
  }

  isImageFile(file: File): boolean {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    return allowedTypes.includes(file.type);
  }

  convertFileToBase64(file: File): void {
    const reader = new FileReader();

    reader.onloadend = () => {
      const base64Content = reader.result as string;
      const startIndex = base64Content.indexOf(',') + 1;
      const cleanedBase64 = base64Content.substring(startIndex);

      this.pictureCreateForm.patchValue({
        profilPicture: cleanedBase64
      });
    };

    reader.readAsDataURL(file);
  }

  extractFileExtension(file: File): string {
    const fileName = file.name;
    const lastDotIndex = fileName.lastIndexOf('.');
    return fileName.substring(lastDotIndex + 1);
  }

  savePicture() {
    if (!this.uploadedFile) {
      this.toastrService.warning("Lütfen bir dosya seçin.");
      return;
    }

    this.isLoadingSubject.next(true);
    const updateModel = {
      id: this.pictureCreateForm.get('id')?.value,
      extension: this.pictureCreateForm.get('extension')?.value,
      profilPicture: this.pictureCreateForm.get('profilPicture')?.value
    };

    this.userService.updateUserPicture(updateModel).subscribe(
      res => {
        if (res.data == 0) {
          this.toastrService.warning(res.messages[0].toString());
          this.isLoadingSubject.next(false);
          this.userPictureCreate.emit("true");
        } else {
          this.toastrService.success("İşlem Başarılı");
          this.isLoadingSubject.next(false);
          this.userPictureCreate.emit("true");
          this.dialogRef.close();
        }
      },
      err => {
        this.toastrService.error("Dosya yükleme sırasında bir hata oluştu. Lütfen tekrar deneyin.", "Hata");
        this.isLoadingSubject.next(false);
        this.userPictureCreate.emit("true");
      }
    );
  }

  closeModal() {
    this.dialogRef.close();
  }
}
