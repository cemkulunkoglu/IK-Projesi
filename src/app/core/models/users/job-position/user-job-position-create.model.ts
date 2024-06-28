import { WorkingMethodEnum } from "src/app/core/enums/user/job-position/working-method-enum.model.enum";

export class UserJobPositionCreateModel {
    userId: number;
    jobTitleId: number;
    approvalProcessUnitId: number;
    managerId: number;
    workingMethod: WorkingMethodEnum;
    startDate: Date;
    endDate: Date;
}
