import { LeaveTypeEnum } from "src/app/core/enums/user/leave/leave-type-enum.model";
import { StatusTypeEnum } from "src/app/core/enums/user/leave/status-type-enum.model";

export class UserLeaveCreateModel {
  userId: number;
  leaveTypeId: LeaveTypeEnum;
  startDate: Date;
  endDate: Date;
  description: string;
  overtime: Date;
  temporaryUserId: number;
  status = StatusTypeEnum;
  leavePeriod: number;
  createdDate: Date;
  returnDate: Date;
}
