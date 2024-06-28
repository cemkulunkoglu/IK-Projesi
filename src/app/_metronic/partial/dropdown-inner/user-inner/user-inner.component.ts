import { Component, HostBinding, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { AuthService, UserType } from 'src/app/core/services/auth/auth.service';
import { TranslationService } from 'src/app/modules/i18n';

@Component({
  selector: 'app-user-inner',
  templateUrl: './user-inner.component.html',
})
export class UserInnerComponent implements OnInit, OnDestroy {
  userId: number;

  @HostBinding('class')
  class = `menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg menu-state-primary fw-bold py-4 fs-6 w-275px`;
  @HostBinding('attr.data-kt-menu') dataKtMenu = 'true';

  user$: Observable<UserType>;
  private unsubscribe: Subscription[] = [];

  constructor(
    private auth: AuthService,
    private translationService: TranslationService
  ) {}

  ngOnInit(): void {
    this.user$ = this.auth.currentUserSubject.asObservable();
    this.user$.subscribe(res => this.userId = res.id);
  }

  logout() {
    this.auth.logout();
    document.location.reload();
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
