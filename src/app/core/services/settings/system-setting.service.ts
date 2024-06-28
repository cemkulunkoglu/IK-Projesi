import { HttpHeaders, HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { BaseResponse } from "../../models/base-response";
import { AuthService } from "../auth/auth.service";
import { AccessTypeEnum } from "../../enums/user/access-type-enum.model";
import { AccessTypeWithPermissionTreeModel } from "../../models/settings/system-setting/access-type-with-permission-tree.model";
import { PermissionCategoryEnum } from "../../enums/user/permission-category-enum.model";
import { SaveAccessTypePermissionsModel } from "../../models/settings/system-setting/save-access-type-permissions.model";
import { NotificationSettingsModel } from "../../models/settings/system-setting/notification-settings.model";
import { SecuritySettingsModel } from "../../models/settings/system-setting/security-settings.model";

const API_URL = `${environment.apiUrl}/SystemSetting`;

@Injectable({
    providedIn: 'root',
})
export class SystemSettingService {
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

    getAccessTypeWithPermissionTree(accessType: AccessTypeEnum, category: PermissionCategoryEnum): Observable<BaseResponse<AccessTypeWithPermissionTreeModel[]>> {
        const url = `${API_URL}/GetAccessTypeWithPermissionTree`;
        return this.http.get<BaseResponse<AccessTypeWithPermissionTreeModel[]>>(`${url}?accessType=${accessType}&category=${category}`,
            { headers: this.httpHeaders });
    }

    saveAccessTypePermissions(data: SaveAccessTypePermissionsModel): Observable<BaseResponse<void>> {
        const url = `${API_URL}/SaveAccessTypePermissions`;
        return this.http.put<BaseResponse<void>>(url, data,
            { headers: this.httpHeaders });
    }

    getNotificationSettings(): Observable<BaseResponse<NotificationSettingsModel>> {
        const url = `${API_URL}/GetNotificationSettings`;
        return this.http.get<BaseResponse<NotificationSettingsModel>>(url, { headers: this.httpHeaders });
    }

    updateNotificationSetting(data: NotificationSettingsModel): Observable<BaseResponse<void>> {
        const url = `${API_URL}/UpdateNotificationSetting`;
        return this.http.put<BaseResponse<void>>(url, data, { headers: this.httpHeaders });
    }

    getSecuritySettings(): Observable<BaseResponse<SecuritySettingsModel>> {
        const url = `${API_URL}/GetSecuritySettings`;
        return this.http.get<BaseResponse<SecuritySettingsModel>>(url, { headers: this.httpHeaders });
    }

    updateSecuritySetting(data: SecuritySettingsModel): Observable<BaseResponse<void>> {
        const url = `${API_URL}/UpdateSecuritySetting`;
        return this.http.put<BaseResponse<void>>(url, data, { headers: this.httpHeaders });
    }

}
