export enum PaymentAdditionalTypeEnum {
  FamilyAid = 1,

  GoldAid = 2,

  MilitaryServiceAid = 3,

  HolidayAid = 4,

  ChildAid = 5,

  OtherAdditionalPayments = 6,

  BirthAid = 7,

  DisabilityIllnessCompensationBenefits = 8,

  MaryAid = 9,

  FoodAid = 10,

  ClothesAid = 11,

  PeaceOfMind = 12,

  Treats = 13,

  CashCompensationAid = 14,

  HousingAid = 15,

  NurseryAid = 16,

  DyingAid = 17,

  PrivateInsurance = 18,

  Bonus = 19,

  UnionDues = 20,

  FlightPay = 21,

  FuelAid = 22,

  FoodHelpingAid = 23,

  RoadAid = 24,

  ForeignAllowance = 25,

  DomesticAllowance = 26
}

export const PaymentAdditionalTypeLabelMapping: Record<PaymentAdditionalTypeEnum, string> = {
  [PaymentAdditionalTypeEnum.FamilyAid]: "Aile Yardımı",
  [PaymentAdditionalTypeEnum.GoldAid]: "Altın Yardımı",
  [PaymentAdditionalTypeEnum.MilitaryServiceAid]: "Askerlik Yardımı",
  [PaymentAdditionalTypeEnum.HolidayAid]: "Bayram Yardımı",
  [PaymentAdditionalTypeEnum.ChildAid]: "Çocuk Yardımı",
  [PaymentAdditionalTypeEnum.OtherAdditionalPayments]: "Diğer Ek Ödemeler",
  [PaymentAdditionalTypeEnum.BirthAid]: "Doğum Yardımı",
  [PaymentAdditionalTypeEnum.DisabilityIllnessCompensationBenefits]: "Engellilik, Hastalık Tazminatı ve Yardımları",
  [PaymentAdditionalTypeEnum.MaryAid]: "Evlenme Yardımı",
  [PaymentAdditionalTypeEnum.FoodAid]: "Gıda / Erzak Yardımı",
  [PaymentAdditionalTypeEnum.ClothesAid]: "Giyecek / Elbise Yardımı",
  [PaymentAdditionalTypeEnum.PeaceOfMind]: "Huzur Hakkı",
  [PaymentAdditionalTypeEnum.Treats]: "İkramiye",
  [PaymentAdditionalTypeEnum.CashCompensationAid]: "Kasa Tazminatı / Yardımı",
  [PaymentAdditionalTypeEnum.HousingAid]: "Konut Yardımı",
  [PaymentAdditionalTypeEnum.NurseryAid]: "Kreş Yardımı",
  [PaymentAdditionalTypeEnum.DyingAid]: "Ölüm Yardımı",
  [PaymentAdditionalTypeEnum.PrivateInsurance]: "Özel Sigorta",
  [PaymentAdditionalTypeEnum.Bonus]: "Prim",
  [PaymentAdditionalTypeEnum.UnionDues]: "Sendika Aidatı",
  [PaymentAdditionalTypeEnum.FlightPay]: "Uçuş Tazminatı / Ödemesi",
  [PaymentAdditionalTypeEnum.FuelAid]: "Yakacak Yardımı",
  [PaymentAdditionalTypeEnum.FoodHelpingAid]: "Yemek Yardımı / Ödemesi",
  [PaymentAdditionalTypeEnum.RoadAid]: "Yol Yardımı / Ödemesi",
  [PaymentAdditionalTypeEnum.ForeignAllowance]: "Yurt Dışı Harcırah",
  [PaymentAdditionalTypeEnum.DomesticAllowance]: "Yurt İçi Harcırah"
}
