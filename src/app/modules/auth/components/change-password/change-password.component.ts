import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { first } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-change-password',
    templateUrl: './change-password.component.html',
    styleUrls: ['./change-password.component.scss'],
})
export class ChangePasswordComponent implements OnInit {
    changePasswordForm: FormGroup;
    isLoading$: Observable<boolean>;
    private authKey: string;
    showPassword: boolean = false;
    showPasswordRepeat: boolean = false;

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private route: ActivatedRoute,
        private toastrService: ToastrService,
        private router: Router
    ) {
        this.isLoading$ = this.authService.isLoading$;
    }

    ngOnInit(): void {
        this.route.params.subscribe(params => {
            this.authKey = params['uniqueId'];
        });
        this.initForm();
    }

    initForm() {
        this.changePasswordForm = this.fb.group({
            newPassword: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
            newPasswordRepeat: ['', Validators.compose([Validators.required, Validators.minLength(6)])]
        }, { validator: this.passwordMatchValidator });
    }

    passwordMatchValidator(form: FormGroup) {
        return form.get('newPassword')!.value === form.get('newPasswordRepeat')!.value
            ? null : { 'mismatch': true };
    }

    submit() {
        if (this.changePasswordForm.invalid) {
            return;
        }
        const { newPassword, newPasswordRepeat } = this.changePasswordForm.value;
        this.authService.forgotChangePassword(this.authKey, newPassword, newPasswordRepeat)
            .pipe(first())
            .subscribe(
                result => {
                    if (result) {
                        this.toastrService.success('Şifre değişikliği başarılı.');
                        this.router.navigate(['/auth/login']);
                    } else {
                        this.toastrService.error('Şifre değişikliği başarısız.');
                    }
                },
                error => {
                    this.toastrService.warning('Bir hata oluştu. Lütfen tekrar deneyin.');
                }
            );
    }

    togglePasswordVisibility() {
        this.showPassword = !this.showPassword;
    }

    togglePasswordRepeatVisibility() {
        this.showPasswordRepeat = !this.showPasswordRepeat;
    }
}
