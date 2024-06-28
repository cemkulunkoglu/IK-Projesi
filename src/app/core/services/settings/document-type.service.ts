import { HttpHeaders, HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, map } from "rxjs";
import { environment } from "src/environments/environment";
import { BaseResponse } from "../../models/base-response";
import { DocumentTypeCreateModel } from "../../models/settings/document-type/document-type-create.model";
import { DocumentTypeUpdateModel } from "../../models/settings/document-type/document-type-update.model";
import { DocumentTypeModel } from "../../models/settings/document-type/document-type.model";
import { AuthService } from "../auth/auth.service";

const API_URL = `${environment.apiUrl}/UserDocument`;

@Injectable({
  providedIn: 'root',
})
export class DocumentTypeService {
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

  getDocumentTypes(): Observable<Array<DocumentTypeModel>> {
    return this.http.get(`${API_URL}/GetDocumentTypes`, {
      headers: this.httpHeaders,
    }).pipe(map((res: BaseResponse<Array<DocumentTypeModel>>) => res.data));
  }

  createDocumentType(createModel: DocumentTypeCreateModel) {
    return this.http.post(`${API_URL}/CreateDocumentType`, createModel, {
      headers: this.httpHeaders
    }).pipe(map((res: BaseResponse<number>) => res))
  }

  updateDocumentType(updateModel: DocumentTypeUpdateModel) {
    return this.http.put(`${API_URL}/UpdateDocumentType`, updateModel, {
      headers: this.httpHeaders
    }).pipe(map((res: BaseResponse<number>) => res))
  }

  deleteDocumentType(id: number) {
    return this.http.delete(`${API_URL}/DeleteDocumentType?id=${id}`, {
      headers: this.httpHeaders,
    }).pipe(map((res: BaseResponse<boolean>) => res))
  }

  getDocumentTypeById(id: number) {
    return this.http.get(`${API_URL}/GetDocumentTypeById?id=${id}`, {
      headers: this.httpHeaders,
    }).pipe(map((res: BaseResponse<DocumentTypeModel>) => res))
  }



}
