import { WorkingMethodEnum } from "src/app/core/enums/user/job-position/working-method-enum.model.enum";

export class UserJobPositionModel {
    id: number;
    userId: number;
    userName: string;
    companyId: number;
    branchOfficeId: number;
    departmentId: number;
    jobTitleId: number;
    jobTitle: string;
    approvalProcessUnitId: number;
    approvalProcessUnit: string;
    managerId: number;
    manager: string;
    workingMethod: WorkingMethodEnum;
    startDate: Date;
    endDate: Date;
}
