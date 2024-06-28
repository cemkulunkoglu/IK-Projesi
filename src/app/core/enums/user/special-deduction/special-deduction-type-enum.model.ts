export enum SpecialDeductionTypeEnum {
  AdvancePayment = 1,
  PrivatePensionInsurance = 2,
  OtherSpecialDeductions = 3,
  Enforcement = 4,
  BusinessAdvance = 5,
  PrivateInsuranceDeduction = 6
}

export const SpecialDeductionTypeLabelMapping: Record<SpecialDeductionTypeEnum, string> = {
  [SpecialDeductionTypeEnum.AdvancePayment]: "Avans",
  [SpecialDeductionTypeEnum.PrivatePensionInsurance]: "BES/OKS",
  [SpecialDeductionTypeEnum.OtherSpecialDeductions]: "Diğer Özel Kesintiler",
  [SpecialDeductionTypeEnum.Enforcement]: "İcra",
  [SpecialDeductionTypeEnum.BusinessAdvance]: "İş Avansı",
  [SpecialDeductionTypeEnum.PrivateInsuranceDeduction]: "Özel Sigorta Kesintisi",
}
