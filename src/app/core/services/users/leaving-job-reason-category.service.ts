import { HttpHeaders, HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, map } from "rxjs";
import { environment } from "src/environments/environment";
import { BaseResponse } from "../../models/base-response";
import { LeavingJobReasonCategoryCreateModel } from "../../models/users/leaving-job-reason/leaving-job-reason-category-create.model";
import { LeavingJobReasonCategoryUpdateModel } from "../../models/users/leaving-job-reason/leaving-job-reason-category-update.model";
import { LeavingJobReasonCategoryModel } from "../../models/users/leaving-job-reason/leaving-job-reason-category.model";
import { AuthService } from "../auth/auth.service";


const API_URL = `${environment.apiUrl}/LeavingJobReasonCategory`;

@Injectable({
  providedIn: 'root',
})
export class LeavingJobReasonCategoryService {
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

  getLeavingJobReasonCategories(): Observable<Array<LeavingJobReasonCategoryModel>> {
    return this.http.get(`${API_URL}/GetLeavingJobReasonCategories`, {
      headers: this.httpHeaders,
    }).pipe(map((res: BaseResponse<Array<LeavingJobReasonCategoryModel>>) => res.data));
  }

  createLeavingJobReasonCategory(createModel: LeavingJobReasonCategoryCreateModel) {
    return this.http.post(`${API_URL}/CreateLeavingJobReasonCategory`, createModel, {
      headers: this.httpHeaders
    }).pipe(map((res: BaseResponse<number>) => res))
  }

  updateLeavingJobReasonCategory(updateModel: LeavingJobReasonCategoryUpdateModel) {
    return this.http.put(`${API_URL}/UpdateLeavingJobReasonCategory`, updateModel, {
      headers: this.httpHeaders
    }).pipe(map((res: BaseResponse<number>) => res))
  }

  deleteLeavingJobReasonCategory(id: number) {
    return this.http.delete(`${API_URL}/DeleteLeavingJobReasonCategory?id=${id}`, {
      headers: this.httpHeaders,
    }).pipe(map((res: BaseResponse<boolean>) => res))
  }

  getLeavingJobReasonCategoryById(id: number) {
    return this.http.get(`${API_URL}/GetLeavingJobReasonCategoryById?id=${id}`, {
      headers: this.httpHeaders,
    }).pipe(map((res: BaseResponse<LeavingJobReasonCategoryModel>) => res))
  }

}
