import { HttpHeaders, HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, map } from "rxjs";
import { environment } from "src/environments/environment";
import { BaseResponse } from "../../models/base-response";
import { SpecialDeductionCreateModel } from "../../models/users/special-deduction/special-deduction-create.model";
import { SpecialDeductionUpdateModel } from "../../models/users/special-deduction/special-deduction-update.model";
import { SpecialDeductionModel } from "../../models/users/special-deduction/special-deduction.model";
import { AuthService } from "../auth/auth.service";

const API_URL = `${environment.apiUrl}/SpecialDeduction`;

@Injectable({
  providedIn: 'root',
})

export class SpecialDeductionService {
  httpHeaders: HttpHeaders;

  constructor(
    private http: HttpClient,
    private authService: AuthService) {
    const auth = this.authService.getAuthFromLocalStorage();
    if (!auth || !auth.access_token) {
      return undefined;
    }

    this.httpHeaders = new HttpHeaders({
      Authorization: `${auth.access_token}`,
    });
  }
  
  getSpecialDeductions(): Observable<Array<SpecialDeductionModel>> {
    return this.http.get(`${API_URL}/GetSpecialDeductions`, {
      headers: this.httpHeaders,
    }).pipe(map((res: BaseResponse<Array<SpecialDeductionModel>>) => res.data));
  }

  createSpecialDeduction(createModel: SpecialDeductionCreateModel) {
    return this.http.post(`${API_URL}/CreateSpecialDeduction`, createModel, {
      headers: this.httpHeaders
    }).pipe(map((res: BaseResponse<number>) => res))
  }

  updateSpecialDeduction(updateModel: SpecialDeductionUpdateModel) {
    return this.http.put(`${API_URL}/UpdateSpecialDeduction`, updateModel, {
      headers: this.httpHeaders
    }).pipe(map((res: BaseResponse<number>) => res))
  }
  
  deleteSpecialDeduction(id: number) {
    return this.http.delete(`${API_URL}/DeleteSpecialDeduction?id=${id}`, {
      headers: this.httpHeaders,
    }).pipe(map((res: BaseResponse<boolean>) => res))
  }

  getSpecialDeductionById(id: number) {
    return this.http.get(`${API_URL}/GetSpecialDeductionById?id=${id}`, {
      headers: this.httpHeaders,
    }).pipe(map((res: BaseResponse<SpecialDeductionModel>) => res))
  }

  getSpecialDeductionsByUserId(id: number) {
    return this.http.get(`${API_URL}/GetSpecialDeductionsByUserId?userId=${id}`, {
      headers: this.httpHeaders,
    }).pipe(map((res: BaseResponse<SpecialDeductionModel>) => res))
  }

}
