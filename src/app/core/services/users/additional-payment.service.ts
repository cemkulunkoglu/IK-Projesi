import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { AuthService } from "../auth/auth.service";
import { Observable, map } from "rxjs";
import { BaseResponse } from "../../models/base-response";
import { AdditionalPaymentCreateModel } from "../../models/users/additional-paymnet/additional-payment-create.model";
import { AdditionalPaymentModel } from "../../models/users/additional-paymnet/additional-payment.model";
import { AdditionalPaymentUpdateModel } from "../../models/users/additional-paymnet/additional-payment-update.model";
const API_URL = `${environment.apiUrl}/AdditionalPayment`;

@Injectable({
  providedIn: 'root',
})

export class AdditionalPaymentService {
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

  getAdditionalPayments(): Observable<Array<AdditionalPaymentModel>> {
    return this.http.get(`${API_URL}/GetAdditionalPayments`, {
      headers: this.httpHeaders,
    }).pipe(map((res: BaseResponse<Array<AdditionalPaymentModel>>) => res.data));
  }

  createAdditionalPayment(createModel: AdditionalPaymentCreateModel) {
    return this.http.post(`${API_URL}/CreateAdditionalPayment`, createModel, {
      headers: this.httpHeaders
    }).pipe(map((res: BaseResponse<number>) => res))
  }

  updateAdditionalPayment(updateModel: AdditionalPaymentUpdateModel) {
    return this.http.put(`${API_URL}/UpdateAdditionalPayment`, updateModel, {
      headers: this.httpHeaders
    }).pipe(map((res: BaseResponse<number>) => res))
  }

  deleteAdditionalPayment(id: number) {
    return this.http.delete(`${API_URL}/DeleteAdditionalPayment?id=${id}`, {
      headers: this.httpHeaders,
    }).pipe(map((res: BaseResponse<boolean>) => res))
  }

  getAdditionalPaymentById(id: number) {
    return this.http.get(`${API_URL}/GetAdditionalPaymentById?id=${id}`, {
      headers: this.httpHeaders,
    }).pipe(map((res: BaseResponse<AdditionalPaymentModel>) => res))
  }

  getAdditionalPaymentsByUserId(id: number) {
    return this.http.get(`${API_URL}/GetAdditionalPaymentsByUserId?userId=${id}`, {
      headers: this.httpHeaders,
    }).pipe(map((res: BaseResponse<AdditionalPaymentModel>) => res))
  }

}
