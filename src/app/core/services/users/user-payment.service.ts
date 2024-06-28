import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { AuthService } from "../auth/auth.service";
import { Observable, map } from "rxjs";
import { UserPaymentModel } from "../../models/users/payment/user-payment.model";
import { BaseResponse } from "../../models/base-response";
import { UserPaymentCreateModel } from "../../models/users/payment/user-payment-create.model";
import { UserPaymentUpdateModel } from "../../models/users/payment/user-payment-update.model";
import { AwaitingPaymentRequestModel } from "../../models/dashboard/awaiting-payment-request.model";
const API_URL = `${environment.apiUrl}/UserPayment`;

@Injectable({
  providedIn: 'root',
})

export class UserPaymentService {
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

  getUserPayments(): Observable<Array<UserPaymentModel>> {
    return this.http.get(`${API_URL}/GetUserPayments`, {
      headers: this.httpHeaders,
    }).pipe(map((res: BaseResponse<Array<UserPaymentModel>>) => res.data));
  }

  getUserAdvancePayments(): Observable<Array<UserPaymentModel>> {
    return this.http.get(`${API_URL}/GetUserAdvancePayments`, {
      headers: this.httpHeaders,
    }).pipe(map((res: BaseResponse<Array<UserPaymentModel>>) => res.data));
  }

  getUserSpendingPayments(): Observable<Array<UserPaymentModel>> {
    return this.http.get(`${API_URL}/GetUserSpendingPayments`, {
      headers: this.httpHeaders,
    }).pipe(map((res: BaseResponse<Array<UserPaymentModel>>) => res.data));
  }

  getUserOvertimePayments(): Observable<Array<UserPaymentModel>> {
    return this.http.get(`${API_URL}/GetUserOvertimePayments`, {
      headers: this.httpHeaders,
    }).pipe(map((res: BaseResponse<Array<UserPaymentModel>>) => res.data));
  }

  getUserOvertimePaymentsInformation(): Observable<Array<UserPaymentModel>> {
    return this.http.get(`${API_URL}/GetUserOvertimePaymentsInformation`, {
      headers: this.httpHeaders,
    }).pipe(map((res: BaseResponse<Array<UserPaymentModel>>) => res.data));
  }

  createUserPayment(createModel: UserPaymentCreateModel) {
    return this.http.post(`${API_URL}/CreateUserPayment`, createModel, {
      headers: this.httpHeaders
    }).pipe(map((res: BaseResponse<number>) => res))
  }

  updateUserPayment(updateModel: UserPaymentUpdateModel) {
    return this.http.put(`${API_URL}/UpdateUserPayment`, updateModel, {
      headers: this.httpHeaders
    }).pipe(map((res: BaseResponse<number>) => res))
  }  

  deleteUserPayment(id: number) {
    return this.http.delete(`${API_URL}/DeleteUserPayment?id=${id}`, {
      headers: this.httpHeaders,
    }).pipe(map((res: BaseResponse<boolean>) => res))
  }

  getUserPaymentById(id: number) {
    return this.http.get(`${API_URL}/GetUserPaymentById?id=${id}`, {
      headers: this.httpHeaders,
    }).pipe(map((res: BaseResponse<UserPaymentModel>) => res))
  }

  getUserPaymentByUserId(id: number) {
    return this.http.get(`${API_URL}/GetUserPaymentByUserId?userId=${id}`, {
      headers: this.httpHeaders,
    }).pipe(map((res: BaseResponse<UserPaymentModel>) => res))
  }

  getUserSpendingPaymentWithDate(userId?: number, startDate?: Date, endDate?: Date) {
    let url = `${API_URL}/GetUserSpendingPaymentWithDate?`;

    if (userId !== undefined) {
      url += `userId=${userId}&`;
    }

    if (startDate !== undefined) {
      url += `startDate=${startDate.toISOString()}&`;
    }

    if (endDate !== undefined) {
      url += `endDate=${endDate.toISOString()}&`;
    }

    return this.http.get(url, { headers: this.httpHeaders }).pipe(map((res: BaseResponse<Array<UserPaymentModel>>) => res));
  }

  getSpendingInformation(status?: boolean, startDate?: Date, endDate?: Date) {
    let url = `${API_URL}/GetSpendingInformation?`;

    if (status !== undefined) {
      url += `status=${status}&`;
    }

    if (startDate !== undefined) {
      url += `startDate=${startDate.toISOString()}&`;
    }

    if (endDate !== undefined) {
      url += `endDate=${endDate.toISOString()}&`;
    }

    return this.http.get(url, { headers: this.httpHeaders }).pipe(map((res: BaseResponse<Array<UserPaymentModel>>) => res));
  }

  getWaitingAprrovingUserPayment(): Observable<Array<AwaitingPaymentRequestModel>> {
    return this.http.get(`${API_URL}/GetWaitingAprrovingUserPayment`, {
      headers: this.httpHeaders,
    }).pipe(map((res: BaseResponse<Array<AwaitingPaymentRequestModel>>) => res.data));
  }

  getCurrentUserPayment(): Observable<Array<UserPaymentModel>> {
    return this.http.get(`${API_URL}/GetCurentUserPayment`, {
      headers: this.httpHeaders,
    }).pipe(map((res: BaseResponse<Array<UserPaymentModel>>) => res.data));
  }
}
