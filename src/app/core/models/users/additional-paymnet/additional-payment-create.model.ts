import { SalaryTypeEnum } from "src/app/core/enums/user/salary/salary-type-enum.model.enum";
import { AdditionalTypeEnum } from "src/app/core/enums/user/spending/additional-type-enum.model";
import { AmountTypeEnum } from "src/app/core/enums/user/spending/amount-type-enum.model";
import { PaymentAdditionalTypeEnum } from "src/app/core/enums/user/spending/payment-additional-type-enum.model";
import { RecurrentPayTypeEnum } from "src/app/core/enums/user/spending/recurrent-pay-type-enum.model";

export class AdditionalPaymentCreateModel {
  userId: number;
  paymentType: PaymentAdditionalTypeEnum;
  paymentMethod: SalaryTypeEnum;
  validityDate: Date;
  recurrentPay: RecurrentPayTypeEnum;
  amount: number;
  amountType: AmountTypeEnum;
  description: string;
  isPaid: boolean;
  includeInPayroll: boolean;
  paidDate: Date;
  additionalTypeEnum: AdditionalTypeEnum;
}
