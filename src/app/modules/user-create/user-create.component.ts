import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable, ReplaySubject, Subject, Subscription, takeUntil } from 'rxjs';
import { AccessTypeEnum, AccessTypeLabelMapping } from 'src/app/core/enums/user/access-type-enum.model';
import { ContractTypeEnum, ContractTypeLabelMapping } from 'src/app/core/enums/user/contract-type-enum.model';
import { RoleModel } from 'src/app/core/models/users/role.model';
import { UserService } from 'src/app/core/services/users/users.service';

@Component({
  selector: 'app-user-create',
  templateUrl: './user-create.component.html'
})
export class UserCreateComponent implements OnInit {
  isLoading$: Observable<boolean>;
  isLoadingSubject: BehaviorSubject<boolean>;
  private unsubscribe: Subscription[] = [];
  createUserForm: FormGroup;

  roleList: Array<RoleModel>;
  roleSearch: FormControl = new FormControl();
  roleFilteredData: ReplaySubject<(RoleModel)[]> = new ReplaySubject<(RoleModel)[]>(1);

  accessTypeLabelMapping = AccessTypeLabelMapping;
  accessTypeSources = Object.values(AccessTypeEnum).filter(value => typeof value === 'number');
  contractTypeLabelMapping = ContractTypeLabelMapping;
  contractTypeSources = Object.values(ContractTypeEnum).filter(value => typeof value === 'number');

  _onDestroy = new Subject<void>();

  message: string;
  constructor(private fb: FormBuilder,
              public userService: UserService,
              private toastrService: ToastrService,
              private router: Router) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.isLoading$ = this.isLoadingSubject.asObservable();
  }

  onContractTypeChange() {
    const contractTypeControl = this.createUserForm.get('contractType');
    const contractEndDateControl = this.createUserForm.get('contractEndDate');

    if (contractTypeControl.value === ContractTypeEnum.Limited) {
      contractEndDateControl.enable();
    } else {
      contractEndDateControl.disable();
      contractEndDateControl.setValue(null);
    }
  }

  isContractEndDateDisabled(): boolean {
    return this.createUserForm.get('contractType').value === ContractTypeEnum.UnLimited;
  }

  ngOnDestroy(): void {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  ngOnInit(): void {
    this.createUserForm = this.fb.group({
      name: ["", Validators.required],
      surname: ["", Validators.required],
      emailBusiness: ["", Validators.required],
      emailPersonal: [""],
      phoneBusiness: ["", Validators.required],
      phonePersonal: [""],
      startDate: [""],
      accessType: [""],
      contractType: [""],
      contractEndDate: [],
    });

    this.roleSearch.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterRoleData();
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

  onInputNumberOnly(event: Event) {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/[^0-9]/g, '');
  }

  saveSettings() {
    this.isLoadingSubject.next(true);
    this.message = "";
    if (this.createUserForm.valid) {
      if (this.createUserForm.value.startDate != null) {
        this.createUserForm.value.startDate = this.adjustForTimezone(new Date(this.createUserForm.value.startDate));
      }
      this.userService.createUser(this.createUserForm.value).subscribe(
        res => {
          if (res.data > 0) {
            this.toastrService.success(res.messages[0]);
            this.router.navigate(['/user-edit/' + res.data]);
          } else {
            this.toastrService.error(res.messages[0]);
            this.isLoadingSubject.next(false);
          }
        },
        err => {
          err.error.messages.forEach(element => {
            this.message += element + '. ';
          });
          this.toastrService.error(this.message, "Hata");
          this.isLoadingSubject.next(false);
        }
      );
    } else {
      this.toastrService.warning("Formu Kontrol Ediniz", "Uyarı");
      this.isLoadingSubject.next(false);
    }
  }
}
