import { HttpHeaders, HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { BaseResponse } from "../../models/base-response";
import { UserEmbezzlementCreateModel } from "../../models/users/embezzlement/user-embezzlement-create.model";
import { UserEmbezzlementUpdateModel } from "../../models/users/embezzlement/user-embezzlement-update.model";
import { UserEmbezzlementModel } from "../../models/users/embezzlement/user-embezzlement.model";
import { AuthService } from "../auth/auth.service";
import { UserEmbezzlementDocument } from "../../models/users/embezzlement/user-embezzlemet-document.model";


const API_URL_UserEmbezzlement = `${environment.apiUrl}/UserEmbezzlement`;

@Injectable({
  providedIn: 'root',
})
export class UserEmbezzlementService {
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

  createUserEmbezzlement(createModel: UserEmbezzlementCreateModel) {
    return this.http.post(`${API_URL_UserEmbezzlement}/CreateUserEmbezzlement`, createModel, {
      headers: this.httpHeaders
    }).pipe(map((res: BaseResponse<number>) => res))
  }

  updateUserEmbezzlement(updateModel: UserEmbezzlementUpdateModel) {
    return this.http.put(`${API_URL_UserEmbezzlement}/UpdateUserEmbezzlement`, updateModel, {
      headers: this.httpHeaders
    }).pipe(map((res: BaseResponse<number>) => res))
  }

  deleteUserEmbezzlement(id: number) {
    return this.http.delete(`${API_URL_UserEmbezzlement}/DeleteUserEmbezzlement?id=${id}`, {
      headers: this.httpHeaders,
    }).pipe(map((res: BaseResponse<boolean>) => res))
  }

  getUserEmbezzlementById(id: number) {
    return this.http.get(`${API_URL_UserEmbezzlement}/GetUserEmbezzlementById?id=${id}`, {
      headers: this.httpHeaders,
    }).pipe(map((res: BaseResponse<UserEmbezzlementModel>) => res))
  }

  getUserEmbezzlements(): Observable<Array<UserEmbezzlementModel>> {
    return this.http.get(`${API_URL_UserEmbezzlement}/GetUserEmbezzlements`, {
      headers: this.httpHeaders,
    }).pipe(map((res: BaseResponse<Array<UserEmbezzlementModel>>) => res.data));
  }

  getUserEmbezzlementByUserId(id: number) {
    return this.http.get(`${API_URL_UserEmbezzlement}/GetUserEmbezzlementByUserId?id=${id}`, {
      headers: this.httpHeaders,
    }).pipe(map((res: BaseResponse<UserEmbezzlementModel>) => res))
  }

  getUserEmbezzlementDocument(id: number): Observable<UserEmbezzlementDocument> {
    return this.http.get(`${API_URL_UserEmbezzlement}/GetUserEmbezzlementDocument?id=${id}`, {
      headers: this.httpHeaders,
    }).pipe(map((res: BaseResponse<UserEmbezzlementDocument>) => res.data));
  }

}
