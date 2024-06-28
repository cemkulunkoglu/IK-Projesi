export enum PaymentTypeEnum{
  MilitaryServiceAid = 1,
  AdvancePayment = 2,
  HolidayPayment = 3,
  Spending = 4,
  Executed = 5,
  Overtime = 6,
  Bounty = 7,
}

export const PaymentTypeEnumLabelMapping:Record<PaymentTypeEnum,string>={
  [PaymentTypeEnum.MilitaryServiceAid]: "Askerlik Yardımı",
  [PaymentTypeEnum.AdvancePayment]: "Avans",
  [PaymentTypeEnum.HolidayPayment]: "Bayram Yardımı",
  [PaymentTypeEnum.Spending]: "Harcama",
  [PaymentTypeEnum.Executed]: "İcra",
  [PaymentTypeEnum.Overtime]: "Mesai",
  [PaymentTypeEnum.Bounty]: "Prim",
}
