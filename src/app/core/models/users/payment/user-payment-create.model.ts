import { PaymentTypeEnum } from "src/app/core/enums/user/payment-type/payment-type-enum.model";
import { SalaryTypeEnum } from "src/app/core/enums/user/salary/salary-type-enum.model.enum";
import { DocumentBase64 } from "../document/document-base64-model";

export class UserPaymentCreateModel {
  userId: number;
  paymentType: PaymentTypeEnum;
  amount: number;
  paymentDate: Date;
  instalment: number;
  amountType: SalaryTypeEnum;
  isPaid: boolean;
  paidDate: Date;
  document: DocumentBase64;
  paymentCategory: number;
  taxType: number;
  amountMoneyType: number;
  sendInformationalEmailToEmployee: boolean;
  includeInPayroll: boolean;
}
