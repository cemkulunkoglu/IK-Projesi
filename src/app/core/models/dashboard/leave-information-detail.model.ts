import { LeaveTypeEnum } from "../../enums/user/leave/leave-type-enum.model";

export class LeaveInformationDetailModel
{
  startDate:Date;
  leaveTypeId:LeaveTypeEnum;
  leavePeriod:number;
}
