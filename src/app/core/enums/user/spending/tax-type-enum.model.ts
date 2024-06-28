export enum TaxTypeEnum {
  PercentageZero = 1,
  PercentageOne = 2,
  PercentageEight = 3,
  PercentageTen = 4,
  PercentageEighteen = 5,
  PercentageTwenty = 6,
  PercentageTwentyFour = 7,
}

export const TaxTypeEnumLabelMapping: Record<TaxTypeEnum, string> = {
  [TaxTypeEnum.PercentageZero]: "%0",
  [TaxTypeEnum.PercentageOne]: "%1",
  [TaxTypeEnum.PercentageEight]: "%8",
  [TaxTypeEnum.PercentageTen]: "%10",
  [TaxTypeEnum.PercentageEighteen]: "%18",
  [TaxTypeEnum.PercentageTwenty]: "%20",
  [TaxTypeEnum.PercentageTwentyFour]: "%24",
}
