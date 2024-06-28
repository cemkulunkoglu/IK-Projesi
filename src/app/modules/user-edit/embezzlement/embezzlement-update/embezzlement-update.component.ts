import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable, BehaviorSubject, Subscription, Subject } from 'rxjs';
import { CompanyInfoService } from 'src/app/core/services/settings/company-info.service';
import { EmbezzlementCategoryService } from 'src/app/core/services/settings/embezzlement-category.service';
import { UserEmbezzlementService } from 'src/app/core/services/users/user-embezzlement.service';
import { UserService } from 'src/app/core/services/users/users.service';

@Component({
  selector: 'app-embezzlement-update',
  templateUrl: './embezzlement-update.component.html',
})
export class EmbezzlementUpdateComponent implements OnInit {
  @Output() userEmbezzlementEdit = new EventEmitter<string>();
  isLoading$: Observable<boolean>;
  isLoadingSubject: BehaviorSubject<boolean>;
  private unsubscribe: Subscription[] = [];
  embezzlementUpdateForm: FormGroup;
  embezzlementCategories: any[];

  @Input() embezzlementId: number;
  _onDestroy = new Subject<void>();
  message: string;
  userId:number;
  constructor(private fb: FormBuilder,
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
    private userEmbezzlementService:UserEmbezzlementService,
    private embezzlementCategoryService:EmbezzlementCategoryService,
    private toastrService: ToastrService) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.isLoading$ = this.isLoadingSubject.asObservable();
    this.userId = this.activatedRoute.snapshot.params.id;
  }

  embezzlementCategoryData() {
    this.embezzlementCategoryService.getEmbezzlementCategories().subscribe(
      (data: any[]) => {
        this.embezzlementCategories = data;
      },
      (error) => {
        console.error('Error fetching embezzlement categories:', error);
      }
    );
  }

  ngOnInit() {
    this.embezzlementCategoryData();
    this.embezzlementUpdateForm = this.fb.group({
      id: ["", Validators.required],
      userId: ["", Validators.required],
      serialNumber: ["", Validators.required],
      issueDate: ["", Validators.required],
      embezzlementCategoryId: ["", Validators.required],
      description:[],
      returnDate:[],
    });

    this.userEmbezzlementService.getUserEmbezzlementById(this.embezzlementId).subscribe(res => {
      console.log(res);
      this.embezzlementUpdateForm.controls["id"].setValue(res.data.id);
      this.embezzlementUpdateForm.controls["userId"].setValue(res.data.userId);
      this.embezzlementUpdateForm.controls["serialNumber"].setValue(res.data.serialNumber);
      this.embezzlementUpdateForm.controls["issueDate"].setValue(res.data.issueDate);
      this.embezzlementUpdateForm.controls["embezzlementCategoryId"].setValue(res.data.embezzlementCategoryId);
      this.embezzlementUpdateForm.controls["description"].setValue(res.data.description);
      this.embezzlementUpdateForm.controls["returnDate"].setValue(res.data.returnDate);
    })
  }

  ngOnDestroy(): void {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
    this._onDestroy.next();
    this._onDestroy.complete();
  }
  adjustForTimezone(date: Date): Date {
    var timeOffsetInMS: number = date.getTimezoneOffset() * 60000;
    date.setTime(date.getTime() - timeOffsetInMS);
    return date;
};
  saveEmbezzlement() {
    debugger;
    this.isLoadingSubject.next(true);
    this.message = "";
    if (this.embezzlementUpdateForm.valid) {
      this.embezzlementUpdateForm.value.issueDate = this.adjustForTimezone(new Date(this.embezzlementUpdateForm.value.issueDate));
      this.embezzlementUpdateForm.value.returnDate = this.adjustForTimezone(new Date(this.embezzlementUpdateForm.value.returnDate));
      this.userEmbezzlementService.updateUserEmbezzlement(this.embezzlementUpdateForm.value).subscribe(
        res => {
          if (res.data == 0) {
            this.toastrService.warning(res.messages[0].toString());
            this.isLoadingSubject.next(false);
            this.userEmbezzlementEdit.emit("true");
          } else {
            this.toastrService.success("İşlem Başarılı");
            this.isLoadingSubject.next(false);
            this.userEmbezzlementEdit.emit("true");
          }
        },
        err => {
          err.error.messages.forEach(element => {
            this.message += element + '. ';
          });
          this.toastrService.error(this.message, "Hata");
          this.isLoadingSubject.next(false);
          this.userEmbezzlementEdit.emit("true");
        }
      );
    } else {
      this.toastrService.warning("Formu Kontrol Ediniz.", "Uyarı");
      this.isLoadingSubject.next(false);
    }
  }
}
