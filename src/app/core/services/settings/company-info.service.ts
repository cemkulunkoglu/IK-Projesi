import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BaseResponse } from 'src/app/core/models/base-response';
import { CompanyModel } from 'src/app/core/models/settings/company-info/company/company.model';
import { BranchOfficeModel } from 'src/app/core/models/settings/company-info/branch-office/branch-office.model';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth/auth.service';
import { CreateCompanyModel } from '../../models/settings/company-info/company/create-company.model';
import { UpdateCompanyModel } from '../../models/settings/company-info/company/update-company.model';
import { CreateBranchOfficeModel } from '../../models/settings/company-info/branch-office/create-branch-office.model';
import { UpdateBranchOfficeModel } from '../../models/settings/company-info/branch-office/update-branch-office.model';
import { DepartmentModel } from '../../models/settings/company-info/department/department.model';
import { CreateDepartmentModel } from '../../models/settings/company-info/department/create-department.model';
import { UpdateDepartmentModel } from '../../models/settings/company-info/department/update-department.model';
import { JobTitleModel } from '../../models/settings/company-info/job-title/job-title.model';
import { CreateJobTitleModel } from '../../models/settings/company-info/job-title/create-job-title.model';
import { UpdateJobTitleModel } from '../../models/settings/company-info/job-title/update-job-title.model';

const API_URL = `${environment.apiUrl}/Company`;

@Injectable({
  providedIn: 'root',
})
export class CompanyInfoService {
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

  //#region Company
  getCompanies(): Observable<Array<CompanyModel>> {
    return this.http.get(`${API_URL}/GetCompanies`, {
      headers: this.httpHeaders,
    }).pipe(map((res: BaseResponse<Array<CompanyModel>>) => res.data));
  }

  getCompanyById(id: number): Observable<CompanyModel> {
    return this.http.get(`${API_URL}/GetCompanyById?id=${id}`, {
      headers: this.httpHeaders,
    }).pipe(map((res: BaseResponse<CompanyModel>) => res.data));
  }

  createCompany(createModel: CreateCompanyModel) {
    return this.http.post(`${API_URL}/CreateCompany`, createModel, {
      headers: this.httpHeaders,
    }).pipe(map((res: BaseResponse<number>) => res));
  }

  updateCompany(updateModel: UpdateCompanyModel) {
    return this.http.put(`${API_URL}/UpdateCompany`, updateModel, {
      headers: this.httpHeaders,
    }).pipe(map((res: BaseResponse<number>) => res));
  }

  deleteCompany(id: number) {
    return this.http.delete(`${API_URL}/DeleteCompany?id=${id}`, {
      headers: this.httpHeaders,
    }).pipe(map((res: BaseResponse<boolean>) => res))
  }
  //#endregion

  //#region BranchOffice
  getBranchOffices(): Observable<Array<BranchOfficeModel>> {
    return this.http.get(`${API_URL}/GetBranchOffices`, {
      headers: this.httpHeaders,
    }).pipe(map((res: BaseResponse<Array<BranchOfficeModel>>) => res.data));
  }

  getBranchOfficeById(id: number): Observable<BranchOfficeModel> {
    return this.http.get(`${API_URL}/GetBranchOfficeById?id=${id}`, {
      headers: this.httpHeaders,
    }).pipe(map((res: BaseResponse<BranchOfficeModel>) => res.data));
  }

  createBranchOffice(createModel: CreateBranchOfficeModel) {
    return this.http.post(`${API_URL}/CreateBranchOffice`, createModel, {
      headers: this.httpHeaders,
    }).pipe(map((res: BaseResponse<number>) => res));
  }

  updateBranchOffice(updateModel: UpdateBranchOfficeModel) {
    return this.http.put(`${API_URL}/UpdateBranchOffice`, updateModel, {
      headers: this.httpHeaders,
    }).pipe(map((res: BaseResponse<number>) => res));
  }

  deleteBranchOffice(id: number) {
    return this.http.delete(`${API_URL}/DeleteBranchOffice?id=${id}`, {
      headers: this.httpHeaders,
    }).pipe(map((res: BaseResponse<boolean>) => res));
  }

  getBranchOfficesByCompanyId(companyId: number): Observable<Array<BranchOfficeModel>> {
    return this.http.get(`${API_URL}/GetBranchOfficeByCompanyId?companyId=${companyId}`, {
      headers: this.httpHeaders,
    }).pipe(map((res: BaseResponse<Array<BranchOfficeModel>>) => res.data));
  }
  //#endregion

  //#region Department
  getDepartments(): Observable<Array<DepartmentModel>> {
    return this.http.get(`${API_URL}/GetDepartments`, {
      headers: this.httpHeaders,
    }).pipe(map((res: BaseResponse<Array<DepartmentModel>>) => res.data));
  }

  getDepartmentById(id: number): Observable<DepartmentModel> {
    return this.http.get(`${API_URL}/GetDepartmentById?id=${id}`, {
      headers: this.httpHeaders,
    }).pipe(map((res: BaseResponse<DepartmentModel>) => res.data));
  }

  createDepartment(createModel: CreateDepartmentModel) {
    return this.http.post(`${API_URL}/CreateDepartment`, createModel, {
      headers: this.httpHeaders,
    }).pipe(map((res: BaseResponse<number>) => res));
  }

  updateDepartment(updateModel: UpdateDepartmentModel) {
    return this.http.put(`${API_URL}/UpdateDepartment`, updateModel, {
      headers: this.httpHeaders,
    }).pipe(map((res: BaseResponse<number>) => res));
  }

  deleteDepartment(id: number) {
    return this.http.delete(`${API_URL}/DeleteDepartment?id=${id}`, {
      headers: this.httpHeaders,
    }).pipe(map((res: BaseResponse<boolean>) => res));
  }

  getDepartmentByBranchOfficesId(branchOfficeId: number): Observable<Array<DepartmentModel>> {
    return this.http.get(`${API_URL}/GetDepartmentByBranchOfficesId?branchOfficeId=${branchOfficeId}`, {
      headers: this.httpHeaders,
    }).pipe(map((res: BaseResponse<Array<DepartmentModel>>) => res.data));
  }
  //#endregion

  //#region JobTitle
  getJobTitles(): Observable<Array<JobTitleModel>> {
    return this.http.get(`${API_URL}/GetJobTitles`, {
      headers: this.httpHeaders,
    }).pipe(map((res: BaseResponse<Array<JobTitleModel>>) => res.data));
  }

  getJobTitleById(id: number): Observable<JobTitleModel> {
    return this.http.get(`${API_URL}/GetJobTitleById?id=${id}`, {
      headers: this.httpHeaders,
    }).pipe(map((res: BaseResponse<JobTitleModel>) => res.data));
  }

  createJobTitle(createModel: CreateJobTitleModel) {
    return this.http.post(`${API_URL}/CreateJobTitle`, createModel, {
      headers: this.httpHeaders,
    }).pipe(map((res: BaseResponse<number>) => res));
  }

  updateJobTitle(updateModel: UpdateJobTitleModel) {
    return this.http.put(`${API_URL}/UpdateJobTitle`, updateModel, {
      headers: this.httpHeaders,
    }).pipe(map((res: BaseResponse<number>) => res));
  }

  deleteJobTitle(id: number) {
    return this.http.delete(`${API_URL}/DeleteJobTitle?id=${id}`, {
      headers: this.httpHeaders,
    }).pipe(map((res: BaseResponse<boolean>) => res));
  }

  getJobTitleByDepartmentId(departmentId: number): Observable<Array<JobTitleModel>> {
    return this.http.get(`${API_URL}/GetJobTitleByDepartmentId?departmentId=${departmentId}`, {
      headers: this.httpHeaders,
    }).pipe(map((res: BaseResponse<Array<JobTitleModel>>) => res.data));
  }
  //#endregion

}
