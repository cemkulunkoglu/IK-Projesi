import { LeaveInformationDetailModel } from "./leave-information-detail.model";

export class LeaveInformationModel{
  userId:number;
  annualLeave:number;
  futureLeave:number;
  leavePeriod:number;
  balanceLeave:number;
  leaveDetails:Array<LeaveInformationDetailModel>;
  }
