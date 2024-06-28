import { StatusTypeEnum } from "src/app/core/enums/user/leave/status-type-enum.model";
import { SpecialDeductionTypeEnum } from "src/app/core/enums/user/special-deduction/special-deduction-type-enum.model";
import { AmountTypeEnum } from "src/app/core/enums/user/spending/amount-type-enum.model";

export class SpecialDeductionCreateModel {
  userId: number;
  paymentType: SpecialDeductionTypeEnum;
  amount: number;
  amountType: AmountTypeEnum;
  description: string;
  installment: number;
  startDate: Date;
  endDate: Date;
  status: StatusTypeEnum;
  isPaid: boolean;
  paidDate: Date;
  includeInBardroy: boolean;
  skipApprovalProcess: boolean;
  sendEmployeeNotification: boolean;
}
