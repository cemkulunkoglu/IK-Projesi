import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BaseResponse } from 'src/app/core/models/base-response';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth/auth.service';
import { UserModel } from '../../models/users/user.model';
import { UserUpdateModel } from '../../models/users/user-update.model';
import { UserCreateModel } from '../../models/users/user-create.model';
import { UserPersonelInformationModel } from '../../models/users/personel-information/user-personel-information.model';
import { UserPersonelInformationSaveModel } from '../../models/users/personel-information/user-personel-information-save.model';
import { UserOtherInformationModel } from '../../models/users/other-information/user-other-information.model';
import { UserOtherInformationSaveModel } from '../../models/users/other-information/user-other-information-save.model';
import { UserJobPositionCreateModel } from '../../models/users/job-position/user-job-position-create.model';
import { UserJobPositionUpdateModel } from '../../models/users/job-position/user-job-position-update.model';
import { UserJobPositionModel } from '../../models/users/job-position/user-job-position.model';
import { UserSalaryCreateModel } from '../../models/users/salary/user-salary-create.model';
import { UserSalaryUpdateModel } from '../../models/users/salary/user-salary-update.model';
import { UserSalaryModel } from '../../models/users/salary/user-salary.model';
import { CurrentUserJobPosition } from '../../models/dashboard/current-user-job-position';
import { UserPictureUpdateModel } from '../../models/users/user-picture-update.model';
import { ChangeUserPasswordModel } from '../../models/users/change-user-password.model';
import { UserDistributionByDepartmentModel } from '../../models/users/job-position/user-distribution-by-department.model';
import { UpdateUserActiveModel } from '../../models/users/update-user-activity.model';
import { AccessTypeEnum } from '../../enums/user/access-type-enum.model';

const API_URL = `${environment.apiUrl}/User`;

@Injectable({
  providedIn: 'root',
})
export class UserService {
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

  //#region Users
  getUsers(): Observable<Array<UserModel>> {
    return this.http.get(`${API_URL}/GetUsers`, {
      headers: this.httpHeaders,
    }).pipe(map((res: BaseResponse<Array<UserModel>>) => res.data));
  }

  getUsersWithParam(request: boolean): Observable<Array<UserModel>> {
    return this.http.get(`${API_URL}/GetUsersWithParam?request=${request}`, {
      headers: this.httpHeaders,
    }).pipe(map((res: BaseResponse<Array<UserModel>>) => res.data));
  }

  getUserDetail(id: number) {
    return this.http.get(`${API_URL}/GetUserById?id=${id}`, {
      headers: this.httpHeaders,
    }).pipe(map((res: BaseResponse<UserModel>) => res))
  }

  setUserActive(id: number) {
    return this.http.get(`${API_URL}/SetUserActive?id=${id}`, {
      headers: this.httpHeaders,
    }).pipe(map((res: BaseResponse<boolean>) => res))
  }

  updateUser(updateModel: UserUpdateModel) {
    return this.http.put(`${API_URL}/UpdateUser`, updateModel, {
      headers: this.httpHeaders
    })
  }

  updateUserPicture(updateModel: UserPictureUpdateModel) {
    return this.http.put(`${API_URL}/UpdateUserPicture`, updateModel, {
      headers: this.httpHeaders
    }).pipe(map((res: BaseResponse<number>) => res))
  }

  updateUserActivity(updateModel: UpdateUserActiveModel) {
    return this.http.put(`${API_URL}/UpdateUserActivity`, updateModel, {
      headers: this.httpHeaders
    }).pipe(map((res: BaseResponse<number>) => res))
  }

  changePassword(updateModel: ChangeUserPasswordModel) {
    return this.http.put(`${API_URL}/ChangePassword`, updateModel, {
      headers: this.httpHeaders
    }).pipe(map((res: BaseResponse<number>) => res))
  }

  createUser(createModel: UserCreateModel) {
    return this.http.post(`${API_URL}/CreateUser`, createModel, {
      headers: this.httpHeaders
    }).pipe(map((res: BaseResponse<number>) => res))
  }
  //#endregion

  //#region UserPersonelInformation
  getUserPersonelInformationByUserId(id: number) {
    return this.http.get(`${API_URL}/GetUserPersonelInformationByUserId?userId=${id}`, {
      headers: this.httpHeaders,
    }).pipe(map((res: BaseResponse<UserPersonelInformationModel>) => res))
  }

  saveUserPersonelInformation(saveModel: UserPersonelInformationSaveModel) {
    return this.http.post(`${API_URL}/SaveUserPersonelInformation`, saveModel, {
      headers: this.httpHeaders
    })
  }

  getUserPersonelInformationLastWeek(): Observable<Array<UserPersonelInformationModel>> {
    return this.http.get(`${API_URL}/GetUserPersonelInformationLastWeek`, {
      headers: this.httpHeaders,
    }).pipe(map((res: BaseResponse<Array<UserPersonelInformationModel>>) => res.data));
  }

  getCurentUserPersonelInformation(): Observable<UserPersonelInformationModel> {
    return this.http.get(`${API_URL}/GetCurentUserPersonelInformation`, {
      headers: this.httpHeaders,
    }).pipe(map((res: BaseResponse<UserPersonelInformationModel>) => res.data));
  }
  //#endregion

  //#region UserOtherInformation
  getUserOtherInformationByUserId(id: number) {
    return this.http.get(`${API_URL}/GetUserOtherInformationByUserId?userId=${id}`, {
      headers: this.httpHeaders,
    }).pipe(map((res: BaseResponse<UserOtherInformationModel>) => res))
  }

  saveUserOtherInformation(saveModel: UserOtherInformationSaveModel) {
    return this.http.post(`${API_URL}/SaveUserOtherInformation`, saveModel, {
      headers: this.httpHeaders
    })
  }
  //#endregion

  //#region UserJobPosition

  getUserJobTitleByUserId(id: number) {
    return this.http.get(`${API_URL}/GetUserJobTitleByUserId?userId=${id}`, {
      headers: this.httpHeaders,
    }).pipe(map((res: BaseResponse<UserModel>) => res))
  }

  getCurentUserProfile(): Observable<CurrentUserJobPosition> {
    return this.http.get(`${API_URL}/GetCurentUserProfile`, {
      headers: this.httpHeaders,
    }).pipe(map((res: BaseResponse<CurrentUserJobPosition>) => res.data));
  }

  getUserDistributionByDepartment(): Observable<Array<UserDistributionByDepartmentModel>> {
    return this.http.get(`${API_URL}/GetUserDistributionByDepartment`, {
      headers: this.httpHeaders,
    }).pipe(map((res: BaseResponse<Array<UserDistributionByDepartmentModel>>) => res.data));
  }

  createUserJobPosition(createModel: UserJobPositionCreateModel) {
    return this.http.post(`${API_URL}/CreateUserJobPosition`, createModel, {
      headers: this.httpHeaders
    }).pipe(map((res: BaseResponse<number>) => res))
  }

  updateUserJobPosition(updateModel: UserJobPositionUpdateModel) {
    return this.http.put(`${API_URL}/UpdateUserJobPosition`, updateModel, {
      headers: this.httpHeaders
    }).pipe(map((res: BaseResponse<number>) => res))
  }

  deleteUserJobPosition(id: number) {
    return this.http.delete(`${API_URL}/DeleteUserJobPosition?id=${id}`, {
      headers: this.httpHeaders,
    }).pipe(map((res: BaseResponse<boolean>) => res))
  }

  getUserJobPositionById(id: number) {
    return this.http.get(`${API_URL}/GetUserJobPositionById?id=${id}`, {
      headers: this.httpHeaders,
    }).pipe(map((res: BaseResponse<UserJobPositionModel>) => res))
  }

  getUserJobPositionByUserId(userId: number) {
    return this.http.get(`${API_URL}/GetUserJobPositionByUserId?userId=${userId}`, {
      headers: this.httpHeaders,
    }).pipe(map((res: BaseResponse<Array<UserJobPositionModel>>) => res))
  }
  //#endregion

  //#region UserSalary
  createUserSalary(createModel: UserSalaryCreateModel) {
    return this.http.post(`${API_URL}/CreateUserSalary`, createModel, {
      headers: this.httpHeaders
    }).pipe(map((res: BaseResponse<number>) => res))
  }

  updateUserSalary(updateModel: UserSalaryUpdateModel) {
    return this.http.put(`${API_URL}/UpdateUserSalary`, updateModel, {
      headers: this.httpHeaders
    }).pipe(map((res: BaseResponse<number>) => res))
  }

  deleteUserSalary(id: number) {
    return this.http.delete(`${API_URL}/DeleteUserSalary?id=${id}`, {
      headers: this.httpHeaders,
    }).pipe(map((res: BaseResponse<boolean>) => res))
  }

  getUserSalaryById(id: number) {
    return this.http.get(`${API_URL}/GetUserSalaryById?id=${id}`, {
      headers: this.httpHeaders,
    }).pipe(map((res: BaseResponse<UserSalaryModel>) => res))
  }

  getUserSalaryByUserId(id: number) {
    return this.http.get(`${API_URL}/GetUserSalaryByUserId?userId=${id}`, {
      headers: this.httpHeaders,
    }).pipe(map((res: BaseResponse<Array<UserSalaryModel>>) => res))
  }
  //#endregion


  getDepartmentUsersByUserId(userId: number): Observable<Array<{ id: number, name: string }>> {
    return this.http.get(`${API_URL}/GetDepartmentUsersByUserId?userId=${userId}`, {
      headers: this.httpHeaders,
    }).pipe(map((res: BaseResponse<Array<{ id: number, name: string }>>) => res.data));
  }

  getUsersByAccessType(accessType: AccessTypeEnum): Observable<BaseResponse<any>> {
    return this.http.get<BaseResponse<any>>(`${API_URL}/GetUsersByAccessType`, {
      headers: this.httpHeaders,
      params: { accessType: accessType.toString() }
    });
  }

}
