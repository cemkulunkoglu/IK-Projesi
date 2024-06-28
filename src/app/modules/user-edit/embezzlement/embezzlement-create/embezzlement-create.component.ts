import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Observable, BehaviorSubject, Subscription, Subject } from 'rxjs';
import { CompanyInfoService } from 'src/app/core/services/settings/company-info.service';
import { EmbezzlementCategoryService } from 'src/app/core/services/settings/embezzlement-category.service';
import { UserEmbezzlementService } from 'src/app/core/services/users/user-embezzlement.service';
import { UserService } from 'src/app/core/services/users/users.service';

@Component({
  selector: 'app-embezzlement-create',
  templateUrl: './embezzlement-create.component.html',
})
export class EmbezzlementCreateComponent implements OnInit{
  @Output() userEmbezzlementCreate = new EventEmitter<string>();
  isLoading$: Observable<boolean>;
  isLoadingSubject: BehaviorSubject<boolean>;
  private unsubscribe: Subscription[] = [];
  embezzlementCreateForm: FormGroup;
  embezzlementCategories: any[];

  @Input() userId: number;

  _onDestroy = new Subject<void>();
  message: string;

  constructor(private fb: FormBuilder,
    private companyInfoService: CompanyInfoService,
    public userService: UserService,
    public embezzlementCategoryService:EmbezzlementCategoryService,
    private userEmbezzlementService:UserEmbezzlementService,
    private toastrService: ToastrService) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.isLoading$ = this.isLoadingSubject.asObservable();
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
    this.embezzlementCreateForm = this.fb.group({
      userId: [this.userId, Validators.required],
      serialNumber: ["", Validators.required],
      issueDate: ["", Validators.required],
      embezzlementCategoryId: ["", Validators.required],
      description:[],
      returnDate:[],
    });
    this.embezzlementCategoryData();
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
    this.isLoadingSubject.next(true);
    this.message = "";
    if (this.embezzlementCreateForm.valid) {
      this.embezzlementCreateForm.value.issueDate = this.adjustForTimezone(new Date(this.embezzlementCreateForm.value.issueDate));
      this.embezzlementCreateForm.value.returnDate = this.adjustForTimezone(new Date(this.embezzlementCreateForm.value.returnDate));
      this.userEmbezzlementService.createUserEmbezzlement(this.embezzlementCreateForm.value).subscribe(
        res => {
          if (res.data == 0){
            this.toastrService.warning(res.messages[0].toString());
            this.isLoadingSubject.next(false);
            this.userEmbezzlementCreate.emit("true");
          }else{
            this.toastrService.success("İşlem Başarılı");
            this.isLoadingSubject.next(false);
            this.userEmbezzlementCreate.emit("true");
          }
        },
        err => {
          err.error.messages.forEach(element => {
            this.message += element + '. ';
          });
          this.toastrService.error(this.message, "Hata");
          this.isLoadingSubject.next(false);
          this.userEmbezzlementCreate.emit("true");
        }
      );
    } else {
      this.toastrService.warning("Formu Kontrol Ediniz.","Uyarı");
      this.isLoadingSubject.next(false);
    }
  }
}
