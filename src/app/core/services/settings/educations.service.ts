import { HttpHeaders, HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { BaseResponse } from "../../models/base-response";
import { AuthService } from "../auth/auth.service";
import { EducationsModel } from "../../models/settings/educations/educations.model";
import { CreateEducationModel } from "../../models/settings/educations/create-educations.model";
import { UpdateEducationModel } from "../../models/settings/educations/update-educations.model";

const API_URL = `${environment.apiUrl}/Education`;

@Injectable({
  providedIn: 'root',
})
export class EducationsService {
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

  getEducations(): Observable<Array<EducationsModel>> {
    return this.http.get(`${API_URL}/GetEducations`, {
      headers: this.httpHeaders,
    }).pipe(map((res: BaseResponse<Array<EducationsModel>>) => res.data));
  }

  createEducation(education: CreateEducationModel): Observable<BaseResponse<number>> {
    return this.http.post<BaseResponse<number>>(`${API_URL}/CreateEducation`, education, {
      headers: this.httpHeaders
    });
  }

  updateEducation(updateModel: UpdateEducationModel) {
    return this.http.put(`${API_URL}/UpdateEducation`, updateModel, {
      headers: this.httpHeaders
    }).pipe(map((res: BaseResponse<number>) => res))
  }

  deleteEducation(id: number) {
    return this.http.delete(`${API_URL}/DeleteEducation?id=${id}`, {
      headers: this.httpHeaders,
    }).pipe(map((res: BaseResponse<boolean>) => res))
  }

}
