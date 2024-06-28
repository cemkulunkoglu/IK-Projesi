import { HttpHeaders, HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { BaseResponse } from "../../models/base-response";
import { UserEducationCreateModel } from "../../models/users/education/user-education-create.model";
import { UserEducationUpdateModel } from "../../models/users/education/user-education-update.model";
import { AuthService } from "../auth/auth.service";
import { UserEducationByUserModel } from "../../models/users/education/user-education-by-user.model";
import { UserEducationModel } from "../../models/users/education/user-education.model";

const API_URL_UserEducation = `${environment.apiUrl}/UserEducation`;

@Injectable({
  providedIn: 'root',
})
export class UserEducationService {
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

  createUserEducation(createModel: UserEducationCreateModel) {
    return this.http.post(`${API_URL_UserEducation}/CreateUserEducation`, createModel, {
      headers: this.httpHeaders
    }).pipe(map((res: BaseResponse<number>) => res))
  }

  updateUserEducation(updateModel: UserEducationUpdateModel) {
    return this.http.put(`${API_URL_UserEducation}/UpdateUserEducation`, updateModel, {
      headers: this.httpHeaders
    }).pipe(map((res: BaseResponse<number>) => res))
  }

  deleteUserEducation(id: number) {
    return this.http.delete(`${API_URL_UserEducation}/DeleteUserEducation?id=${id}`, {
      headers: this.httpHeaders,
    }).pipe(map((res: BaseResponse<boolean>) => res))
  }

  getUserEducationById(id: number) {
    return this.http.get(`${API_URL_UserEducation}/GetUserEducationById?id=${id}`, {
      headers: this.httpHeaders,
    }).pipe(map((res: BaseResponse<UserEducationModel>) => res))
  }

  getUserEducations(): Observable<Array<UserEducationModel>> {
    return this.http.get(`${API_URL_UserEducation}/GetUserEducations`, {
      headers: this.httpHeaders,
    }).pipe(map((res: BaseResponse<Array<UserEducationModel>>) => res.data));
  }

  getUserEducationByUserId(id: number): Observable<BaseResponse<Array<UserEducationByUserModel>>> {
    return this.http.get(`${API_URL_UserEducation}/GetUserEducationByUserId?id=${id}`, {
      headers: this.httpHeaders,
    }).pipe(map((res: BaseResponse<Array<UserEducationByUserModel>>) => res));
  }

}
