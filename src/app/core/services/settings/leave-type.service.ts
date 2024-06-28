import { HttpHeaders, HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, map } from "rxjs";
import { environment } from "src/environments/environment";
import { BaseResponse } from "../../models/base-response";
import { AuthService } from "../auth/auth.service";
import { LeaveTypeModel } from "../../models/settings/leave-type/leave-type.model";
import { LeaveTypeUpdateModel } from "../../models/settings/leave-type/leave-type-update.model";
import { LeaveTypeCreateModel } from "../../models/settings/leave-type/leave-type-create-model";

const API_URL = `${environment.apiUrl}/LeaveType`;

@Injectable({
  providedIn: 'root',
})
export class LeaveTypeService {
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

  getLeaveTypes(): Observable<Array<LeaveTypeModel>> {
    return this.http.get(`${API_URL}/GetLeaveTypes`, {
      headers: this.httpHeaders,
    }).pipe(map((res: BaseResponse<Array<LeaveTypeModel>>) => res.data));
  }

  getLeaveTypeById(id: number): Observable<LeaveTypeModel> {
    return this.http.get<BaseResponse<LeaveTypeModel>>(`${API_URL}/GetLeaveTypeById?id=${id}`, {
      headers: this.httpHeaders,
    }).pipe(map((res: BaseResponse<LeaveTypeModel>) => res.data));
  }

  createLeaveType(education: LeaveTypeCreateModel): Observable<BaseResponse<number>> {
    return this.http.post<BaseResponse<number>>(`${API_URL}/CreateLeaveType`, education, {
      headers: this.httpHeaders
    });
  }

  updateLeaveType(updateModel: LeaveTypeUpdateModel) {
    return this.http.put(`${API_URL}/UpdateLeaveType`, updateModel, {
      headers: this.httpHeaders
    }).pipe(map((res: BaseResponse<number>) => res))
  }

  deleteLeaveType(id: number) {
    return this.http.delete(`${API_URL}/DeleteLeaveType?id=${id}`, {
      headers: this.httpHeaders,
    }).pipe(map((res: BaseResponse<boolean>) => res))
  }
}
