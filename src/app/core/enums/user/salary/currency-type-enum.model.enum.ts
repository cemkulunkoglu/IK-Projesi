export enum CurrencyTypeEnum {
    TL = 1,
    EUR = 2,
    USD = 3
}

export const CurrencyTypeLabelMapping: Record<CurrencyTypeEnum, string> = {
    [CurrencyTypeEnum.TL]: "TL",
    [CurrencyTypeEnum.EUR]: "EURO",
    [CurrencyTypeEnum.USD]: "DOLAR"
}