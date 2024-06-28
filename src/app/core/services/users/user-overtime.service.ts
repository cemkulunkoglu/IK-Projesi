import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { AuthService } from "../auth/auth.service";
import { Observable, map } from "rxjs";
import { UserOvertimeModel } from "../../models/users/overtime/user-overtime.model";
import { BaseResponse } from "../../models/base-response";
import { UserOvertimeCreateModel } from "../../models/users/overtime/user-overtime-create.model";
import { UserOvertimeUpdateModel } from "../../models/users/overtime/user-overtime-update.model";

const API_URL = `${environment.apiUrl}/UserOvertime`;

@Injectable({
  providedIn: 'root',
})
export class UserOvertimeService {
  httpHeaders: HttpHeaders;

  constructor(private http: HttpClient, private authService: AuthService) {
    const auth = this.authService.getAuthFromLocalStorage();
    if (!auth || !auth.access_token) {
      return undefined;
    }

    this.httpHeaders = new HttpHeaders({
      Authorization: `${auth.access_token}`,
    });
  }

  getUserOvertimes(): Observable<Array<UserOvertimeModel>> {
    return this.http.get(`${API_URL}/GetUserOvertimes`, {
      headers: this.httpHeaders,
    }).pipe(map((res: BaseResponse<Array<UserOvertimeModel>>) => res.data));
  }

  createUserOvertime(createModel: UserOvertimeCreateModel): Observable<BaseResponse<number>> {
    return this.http.post<BaseResponse<number>>(`${API_URL}/CreateUserOvertime`, createModel, {
      headers: this.httpHeaders
    });
  }

  updateUserOvertime(updateModel: UserOvertimeUpdateModel): Observable<BaseResponse<number>> {
    return this.http.put<BaseResponse<number>>(`${API_URL}/UpdateUserOvertime`, updateModel, {
      headers: this.httpHeaders
    });
  }

  deleteUserOvertime(id: number): Observable<BaseResponse<boolean>> {
    return this.http.delete<BaseResponse<boolean>>(`${API_URL}/DeleteUserOvertime?id=${id}`, {
      headers: this.httpHeaders,
    });
  }

  getUserOvertimeById(id: number): Observable<BaseResponse<UserOvertimeModel>> {
    return this.http.get<BaseResponse<UserOvertimeModel>>(`${API_URL}/GetUserOvertimeById?id=${id}`, {
      headers: this.httpHeaders,
    });
  }

  getUserOvertimeByUserId(id: number): Observable<BaseResponse<UserOvertimeModel>> {
    return this.http.get<BaseResponse<UserOvertimeModel>>(`${API_URL}/GetUserOvertimeByUserId?userId=${id}`, {
      headers: this.httpHeaders,
    });
  }

  getCurrentUserOvertime(): Observable<Array<UserOvertimeModel>> {
    return this.http.get(`${API_URL}/GetCurentUserOvertime`, {
      headers: this.httpHeaders,
    }).pipe(map((res: BaseResponse<Array<UserOvertimeModel>>) => res.data));
  }
}
