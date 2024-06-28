import { HttpHeaders, HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { BaseResponse } from "../../models/base-response";
import { AuthService } from "../auth/auth.service";
import { HolidayDayModel } from "../../models/holiday-day/holiday-day.model";

const API_URL = `${environment.apiUrl}/HolidayDay`;

@Injectable({
  providedIn: 'root',
})
export class HolidayDayService {
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

  getHolidayDaysFirstTen(): Observable<Array<HolidayDayModel>> {
    return this.http.get(`${API_URL}/GetHolidayDaysFirstTen`, {
      headers: this.httpHeaders,
    }).pipe(map((res: BaseResponse<Array<HolidayDayModel>>) => res.data));
  }

}
