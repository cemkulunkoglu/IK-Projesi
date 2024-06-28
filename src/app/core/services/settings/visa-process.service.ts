import { HttpHeaders, HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, map } from "rxjs";
import { environment } from "src/environments/environment";
import { BaseResponse } from "../../models/base-response";
import { AuthService } from "../auth/auth.service";
import { VisaProcess } from "../../models/settings/visa-process/visa-process.model";
import { CreateVisaProcess } from "../../models/settings/visa-process/create-visa-process.model";
import { UpdateVisaProcess } from "../../models/settings/visa-process/update-visa-process.model";

const API_URL = `${environment.apiUrl}/VisaProcess`;

@Injectable({
    providedIn: 'root',
})
export class VisaProcessService {
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

    getVisaProcesses(): Observable<Array<VisaProcess>> {
        return this.http.get(`${API_URL}/GetVisaProcesses`, {
            headers: this.httpHeaders,
        }).pipe(map((res: BaseResponse<Array<VisaProcess>>) => res.data));
    }

    getVisaProcessById(id: number): Observable<VisaProcess> {
        return this.http.get(`${API_URL}/GetVisaProcessById?id=${id}`, {
            headers: this.httpHeaders,
        }).pipe(map((res: BaseResponse<VisaProcess>) => res.data));
    }

    createVisaProcess(process: CreateVisaProcess): Observable<VisaProcess> {
        return this.http.post<BaseResponse<VisaProcess>>(`${API_URL}/CreateVisaProcess`, process, {
            headers: this.httpHeaders,
        }).pipe(map((res: BaseResponse<VisaProcess>) => res.data));
    }

    updateVisaProcess(process: UpdateVisaProcess): Observable<VisaProcess> {
        const sanitizedProcess = {
            ...process,
            visaProcessDocuments: process.visaProcessDocuments.map(doc => ({
                ...doc,
                document: doc.document.name || doc.document.extension || doc.document.content ? doc.document : null
            }))
        };

        return this.http.put<BaseResponse<VisaProcess>>(`${API_URL}/UpdateVisaProcess`, sanitizedProcess, {
            headers: this.httpHeaders,
        }).pipe(map((res: BaseResponse<VisaProcess>) => res.data));
    }

    deleteVisaProcess(id: number): Observable<void> {
        return this.http.delete<BaseResponse<void>>(`${API_URL}/DeleteVisaProcess?id=${id}`, {
            headers: this.httpHeaders,
        }).pipe(map((res: BaseResponse<void>) => res.data));
    }

    deleteVisaProcessDocument(id: number): Observable<void> {
        return this.http.delete<BaseResponse<void>>(`${API_URL}/DeleteVisaProcessDocument?id=${id}`, {
            headers: this.httpHeaders,
        }).pipe(map((res: BaseResponse<void>) => res.data));
    }
}
