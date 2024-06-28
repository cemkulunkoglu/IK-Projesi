export class UserOvertimeCreateModel {
    userId: number;
    startDate: Date;
    timeHour: number;
    timeMinute: number;
    description: string;
    skipApprovalProcess: boolean;
    sendInformationalEmailToEmployee: boolean;
}
