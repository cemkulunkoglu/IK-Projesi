export enum SalaryTypeEnum {
    Gross = 1,
    Net = 2
}

export const SalaryTypeLabelMapping: Record<SalaryTypeEnum, string> = {
    [SalaryTypeEnum.Gross]: "Brüt",
    [SalaryTypeEnum.Net]: "Net"
}