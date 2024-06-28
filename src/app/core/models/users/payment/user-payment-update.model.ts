export class UserPaymentUpdateModel {
  id: number;
  isPaid: boolean;
  paidDate: Date;
  sendInformationalEmailToEmployee: boolean;
  includeInPayroll: boolean;
}
