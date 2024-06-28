import { HttpHeaders, HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { BaseResponse } from "../../models/base-response";
import { AuthService } from "../auth/auth.service";
import { OfficialHolidaysModel } from "../../models/settings/official-holidays/official-holidays.model";
import { CreateOfficialHolidaysModel } from "../../models/settings/official-holidays/create-official-holidays.model";
import { UpdateOfficialHolidaysModel } from "../../models/settings/official-holidays/update-official-holidays.model";

const API_URL = `${environment.apiUrl}/OfficialHoliday`;

@Injectable({
    providedIn: 'root',
})
export class OfficialHolidayService {
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

    getOfficialHolidays(): Observable<Array<OfficialHolidaysModel>> {
        return this.http.get(`${API_URL}/GetOfficialHolidays`, {
            headers: this.httpHeaders,
        }).pipe(map((res: BaseResponse<Array<OfficialHolidaysModel>>) => res.data));
    }

    createOfficialHoliday(holiday: CreateOfficialHolidaysModel): Observable<BaseResponse<number>> {
        return this.http.post<BaseResponse<number>>(`${API_URL}/CreateOfficialHoliday`, holiday, {
            headers: this.httpHeaders
        });
    }

    updateOfficialHoliday(holiday: UpdateOfficialHolidaysModel): Observable<BaseResponse<number>> {
        return this.http.put<BaseResponse<number>>(`${API_URL}/UpdateOfficialHoliday`, holiday, {
            headers: this.httpHeaders
        });
    }

    deleteOfficialHoliday(id: number): Observable<BaseResponse<boolean>> {
        return this.http.delete<BaseResponse<boolean>>(`${API_URL}/DeleteOfficialHoliday?id=${id}`, {
            headers: this.httpHeaders,
        });
    }
}
