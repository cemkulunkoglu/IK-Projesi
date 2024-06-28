export enum PaymentCategoryTypeEnum {
  BusinessExpenses = 1,
  InvoicesExpenses = 2,
  TrainingCourses = 3,
  FoodBeverage = 4,
  TravelTransportation = 5,
  Other = 6
}

export const PaymentCategoryTypeEnumLabelMapping: Record<PaymentCategoryTypeEnum, string> = {
  [PaymentCategoryTypeEnum.BusinessExpenses]: "İş Giderleri",
  [PaymentCategoryTypeEnum.InvoicesExpenses]: "Fatura ve Giderler",
  [PaymentCategoryTypeEnum.TrainingCourses]: "Eğitim ve Kurslar",
  [PaymentCategoryTypeEnum.FoodBeverage]: "Yiyecek ve İçecek",
  [PaymentCategoryTypeEnum.TravelTransportation]: "Yolculuk ve Ulaşım",
  [PaymentCategoryTypeEnum.Other]: "Diğer",
}
