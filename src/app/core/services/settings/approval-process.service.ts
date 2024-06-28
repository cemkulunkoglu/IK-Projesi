import { HttpHeaders, HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, map } from "rxjs";
import { environment } from "src/environments/environment";
import { BaseResponse } from "../../models/base-response";
import { AuthService } from "../auth/auth.service";
import { ApprovalProcess } from "../../models/settings/approval-process/approval-process.model";
import { UpdateApprovalProcess } from "../../models/settings/approval-process/update-approval-process.model";
import { CreateApprovalProcess } from "../../models/settings/approval-process/create-approval-process.model";

const API_URL = `${environment.apiUrl}/ApprovalProcess`;

@Injectable({
    providedIn: 'root',
})
export class ApprovalProcessService {
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

    getApprovalProcesses(): Observable<Array<ApprovalProcess>> {
        return this.http.get(`${API_URL}/GetApprovalProcesses`, {
            headers: this.httpHeaders,
        }).pipe(map((res: BaseResponse<Array<ApprovalProcess>>) => res.data));
    }

    getApprovalProcessById(id: number): Observable<ApprovalProcess> {
        return this.http.get(`${API_URL}/GetApprovalProcessById?id=${id}`, {
            headers: this.httpHeaders,
        }).pipe(map((res: BaseResponse<ApprovalProcess>) => res.data));
    }

    createApprovalProcess(process: CreateApprovalProcess): Observable<ApprovalProcess> {
        return this.http.post<BaseResponse<ApprovalProcess>>(`${API_URL}/CreateApprovalProcess`, process, {
            headers: this.httpHeaders,
        }).pipe(map((res: BaseResponse<ApprovalProcess>) => res.data));
    }

    updateApprovalProcess(process: UpdateApprovalProcess): Observable<ApprovalProcess> {
        return this.http.put<BaseResponse<ApprovalProcess>>(`${API_URL}/UpdateApprovalProcess`, process, {
            headers: this.httpHeaders,
        }).pipe(map((res: BaseResponse<ApprovalProcess>) => res.data));
    }

    deleteApprovalProcess(id: number): Observable<void> {
        return this.http.delete<BaseResponse<void>>(`${API_URL}/DeleteApprovalProcess?id=${id}`, {
            headers: this.httpHeaders,
        }).pipe(map((res: BaseResponse<void>) => res.data));
    }
}
