import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserModel } from '../../../models/auth/user.model';
import { environment } from '../../../../../environments/environment';
import { AuthModel } from '../../../models/auth/auth.model';
import { ForgotPasswordModel } from 'src/app/core/models/auth/forgotpassword.model';
import { BaseResponse } from 'src/app/core/models/base-response';
import { CompanyInfoModule } from 'src/app/modules/settings/company-info/company-info.module';
import { CompanyModel } from 'src/app/core/models/settings/company-info/company/company.model';

const API_URL = `${environment.apiUrl}/Auth`;

@Injectable({
  providedIn: 'root',
})
export class AuthHTTPService {
  constructor(private http: HttpClient) { }

  // public methods
  login(Email: string, Password: string): Observable<AuthModel> {
    return this.http.post(`${API_URL}/Login`, {
      Email,
      Password,
    }).pipe(map((res: BaseResponse<AuthModel>) => res.data));
  }

  // Your server should check email => If email exists send link to the user and return true | If email doesn't exist return false
  forgotPassword(Email: string): Observable<any> {
    return this.http.post<BaseResponse<ForgotPasswordModel>>(`${API_URL}/ForgotPassword`, {
      Email,
    });
  }

  forgotChangePassword(authKey: string, newPassword: string, newPasswordRepeat: string): Observable<boolean> {
    return this.http.post<boolean>(`${API_URL}/ForgotChangePassword`, { authKey, newPassword, newPasswordRepeat });
  }

  getUserByToken(token: string): Observable<UserModel> {
    const httpHeaders = new HttpHeaders({
      Authorization: `${token}`,
    });
    return this.http.get(`${API_URL}/CurrentUser`, {
      headers: httpHeaders,
    }).pipe(map((res: BaseResponse<UserModel>) => res.data));
  }
}
