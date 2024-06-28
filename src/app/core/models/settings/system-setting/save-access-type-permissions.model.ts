import { AccessTypeEnum } from "src/app/core/enums/user/access-type-enum.model";
import { PermissionCategoryEnum } from "src/app/core/enums/user/permission-category-enum.model";

export interface SaveAccessTypePermissionsModel {
    accessType: AccessTypeEnum;
    permissionDetails: PermissionDetail[];
}

export interface PermissionDetail {
    category: PermissionCategoryEnum;
    permissions: number[];
}
