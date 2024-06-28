import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable, ReplaySubject, Subject, Subscription, takeUntil } from 'rxjs';
import { AccessTypeEnum, AccessTypeLabelMapping } from 'src/app/core/enums/user/access-type-enum.model';
import { ContractTypeEnum, ContractTypeLabelMapping } from 'src/app/core/enums/user/contract-type-enum.model';
import { RoleModel } from 'src/app/core/models/users/role.model';
import { UserService } from 'src/app/core/services/users/users.service';
import { AuthService } from 'src/app/core/services/auth/auth.service';

@Component({
  selector: 'app-user-information',
  templateUrl: './user-information.component.html'
})
export class UserInformationComponent implements OnInit, OnDestroy {
  @Input() userId: number;

  isLoading$: Observable<boolean>;
  isLoadingSubject: BehaviorSubject<boolean>;
  private unsubscribe: Subscription[] = [];
  updateUserForm: FormGroup;

  roleList: Array<RoleModel>;
  roleSearch: FormControl = new FormControl();
  roleFilteredData: ReplaySubject<RoleModel[]> = new ReplaySubject<RoleModel[]>(1);

  accessTypeLabelMapping = AccessTypeLabelMapping;
  accessTypeSources = Object.values(AccessTypeEnum).filter(value => typeof value === 'number');
  contractTypeLabelMapping = ContractTypeLabelMapping;
  contractTypeSources = Object.values(ContractTypeEnum).filter(value => typeof value === 'number');

  _onDestroy = new Subject<void>();
  message: string;

  constructor(
    private fb: FormBuilder,
    public userService: UserService,
    private authService: AuthService,
    private toastrService: ToastrService
  ) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.isLoading$ = this.isLoadingSubject.asObservable();
  }

  ngOnDestroy(): void {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  ngOnInit() {
    this.updateUserForm = this.fb.group({
      id: ["", Validators.required],
      name: ["", Validators.required],
      surname: ["", Validators.required],
      emailBusiness: ["", Validators.required],
      emailPersonal: [""],
      phoneBusiness: ["", [Validators.required, Validators.maxLength(11), Validators.pattern(/^[0-9]*$/)]],
      phonePersonal: ["", [Validators.maxLength(11), Validators.pattern(/^[0-9]*$/)]],
      roles: [""],
      startDate: [""],
      accessType: [""],
      contractType: [""],
      contractEndDate: [""],
      description: [""]
    });

    this.userService.getUserDetail(this.userId).subscribe(res => {
      this.updateUserForm.patchValue({
        id: res.data.id,
        name: res.data.name,
        surname: res.data.surname,
        emailBusiness: res.data.emailBusiness,
        emailPersonal: res.data.emailPersonal,
        phoneBusiness: res.data.phoneBusiness.toString(),
        phonePersonal: res.data.phonePersonal.toString(),
        startDate: res.data.startDate,
        accessType: res.data.accessType,
        contractType: res.data.contractType,
        contractEndDate: res.data.contractEndDate,
        description: res.data.description
      });
    });

    this.roleSearch.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterRoleData();
      });

    this.updateUserForm.get('contractEndDate').valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(value => {
        if (!value) {
          this.updateUserForm.patchValue({ description: '' });
        }
      });
  }

  filterRoleData() {
    if (!this.roleList) {
      return;
    }
    let search = this.roleSearch.value;
    if (!search) {
      this.roleFilteredData.next(this.roleList.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.roleFilteredData.next(
      this.roleList.filter(
        (x: any) => x.name.toLowerCase().indexOf(search) > -1
      )
    );
  }

  adjustForTimezone(date: Date): Date {
    var timeOffsetInMS: number = date.getTimezoneOffset() * 60000;
    date.setTime(date.getTime() - timeOffsetInMS);
    return date;
  }

  clearExitReason() {
    this.updateUserForm.patchValue({
      description: '',
      contractEndDate: null
    });
  }

  onInputNumberOnly(event: Event) {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/[^0-9]/g, '');
  }

  saveUser() {
    this.isLoadingSubject.next(true);
    this.message = "";
    if (this.updateUserForm.valid) {
      if (this.updateUserForm.value.startDate != null) {
        this.updateUserForm.value.startDate = this.adjustForTimezone(new Date(this.updateUserForm.value.startDate));
      }
      if (this.updateUserForm.value.contractEndDate != null) {
        this.updateUserForm.value.contractEndDate = this.adjustForTimezone(new Date(this.updateUserForm.value.contractEndDate));
      }
      this.updateUserForm.value.phoneBusiness = this.updateUserForm.value.phoneBusiness.toString();
      this.updateUserForm.value.phonePersonal = this.updateUserForm.value.phonePersonal.toString();
      this.userService.updateUser(this.updateUserForm.value).subscribe(
        res => {
          this.toastrService.success("İşlem Başarılı");
          this.isLoadingSubject.next(false);
        },
        err => {
          console.log(err);
          err.error.messages.forEach(element => {
            this.message += element + '. ';
          });
          this.toastrService.error(this.message, "Hata");
          this.isLoadingSubject.next(false);
        }
      );
    } else {
      this.toastrService.warning("Formu Kontrol Ediniz.", "Uyarı");
      this.isLoadingSubject.next(false);
    }
  }

  shouldShowExitReason(): boolean {
    return !!this.updateUserForm.get('contractEndDate').value;
  }

  hasPermission(permission: string): boolean {
    const hasPerm = this.authService.hasPermission(permission);
    return hasPerm;
  }
}
