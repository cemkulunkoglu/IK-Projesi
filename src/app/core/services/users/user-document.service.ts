import { HttpHeaders, HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, map } from "rxjs";
import { environment } from "src/environments/environment";
import { BaseResponse } from "../../models/base-response";
import { UserDocumentCreateModel } from "../../models/users/document/user-document-create.model";
import { UserDocumentUpdateModel } from "../../models/users/document/user-document-update.model";
import { UserDocumentModel } from "../../models/users/document/user-document.model";
import { AuthService } from "../auth/auth.service";

const API_URL = `${environment.apiUrl}/UserDocument`;

@Injectable({
  providedIn: 'root',
})
export class UserDocumentService {
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

  getUserDocuments(): Observable<Array<UserDocumentModel>> {
    return this.http.get(`${API_URL}/GetUserDocuments`, {
      headers: this.httpHeaders,
    }).pipe(map((res: BaseResponse<Array<UserDocumentModel>>) => res.data));
  }

  createUserDocument(createModel: UserDocumentCreateModel) {
    return this.http.post(`${API_URL}/CreateUserDocument`, createModel, {
      headers: this.httpHeaders
    }).pipe(map((res: BaseResponse<number>) => res))
  }

  updateUserDocument(updateModel: UserDocumentUpdateModel) {
    return this.http.put(`${API_URL}/UpdateUserDocument`, updateModel, {
      headers: this.httpHeaders
    }).pipe(map((res: BaseResponse<number>) => res))
  }

  deleteUserDocument(id: number) {
    return this.http.delete(`${API_URL}/DeleteUserDocument?id=${id}`, {
      headers: this.httpHeaders,
    }).pipe(map((res: BaseResponse<boolean>) => res))
  }

  getUserDocumentById(id: number) {
    return this.http.get(`${API_URL}/GetUserDocumentById?id=${id}`, {
      headers: this.httpHeaders,
    }).pipe(map((res: BaseResponse<UserDocumentModel>) => res))
  }

  getUserDocumentsByUserId(id: number) {
    return this.http.get(`${API_URL}/GetUserDocumentsByUserId?userId=${id}`, {
      headers: this.httpHeaders,
    }).pipe(map((res: BaseResponse<UserDocumentModel>) => res))
  }

  getCurentUserDocuments(): Observable<Array<UserDocumentModel>> {
    return this.http.get(`${API_URL}/GetCurentUserDocuments`, {
      headers: this.httpHeaders,
    }).pipe(map((res: BaseResponse<Array<UserDocumentModel>>) => res.data));
  }

}
