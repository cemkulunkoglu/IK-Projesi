export enum AmountTypeEnum {
  TL = 1,
  USD = 2,
  EUR=3
}

export const AmountTypeEnumLabelMapping: Record<AmountTypeEnum, string> = {
    [AmountTypeEnum.TL]: "TL",
    [AmountTypeEnum.USD]: "USD",
    [AmountTypeEnum.EUR]: "EUR"
}
