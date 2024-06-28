import { HttpHeaders, HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, map } from "rxjs";
import { environment } from "src/environments/environment";
import { BaseResponse } from "../../models/base-response";
import { EmbezzlementCategoryCreateModel } from "../../models/users/embezzlement-category/embezzlement-category-create.model";
import { EmbezzlementCategoryUpdateModel } from "../../models/users/embezzlement-category/embezzlement-category-update.model";
import { EmbezzlementCategoryModel } from "../../models/users/embezzlement-category/embezzlement-category.model";
import { AuthService } from "../auth/auth.service";

const API_URL = `${environment.apiUrl}/EmbezzlementCategory`;

@Injectable({
  providedIn: 'root',
})
export class EmbezzlementCategoryService {
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

  getEmbezzlementCategories(): Observable<Array<EmbezzlementCategoryModel>> {
    return this.http.get(`${API_URL}/GetEmbezzlementCategories`, {
      headers: this.httpHeaders,
    }).pipe(map((res: BaseResponse<Array<EmbezzlementCategoryModel>>) => res.data));
  }

  createEmbezzlementCategory(createModel: EmbezzlementCategoryCreateModel) {
    return this.http.post(`${API_URL}/CreateEmbezzlementCategory`, createModel, {
      headers: this.httpHeaders
    }).pipe(map((res: BaseResponse<number>) => res))
  }

  updateEmbezzlementCategory(updateModel: EmbezzlementCategoryUpdateModel) {
    return this.http.put(`${API_URL}/UpdateEmbezzlementCategory`, updateModel, {
      headers: this.httpHeaders
    }).pipe(map((res: BaseResponse<number>) => res))
  }

  deleteEmbezzlementCategory(id: number) {
    return this.http.delete(`${API_URL}/DeleteEmbezzlementCategory?id=${id}`, {
      headers: this.httpHeaders,
    }).pipe(map((res: BaseResponse<boolean>) => res))
  }

  getEmbezzlementCategoryById(id: number) {
    return this.http.get(`${API_URL}/GetEmbezzlementCategoryById?id=${id}`, {
      headers: this.httpHeaders,
    }).pipe(map((res: BaseResponse<EmbezzlementCategoryModel>) => res))
  }



}
