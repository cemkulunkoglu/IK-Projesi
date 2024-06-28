export enum ContractTypeEnum {
    Other = 1,
    Limited,
    UnLimited
}

export const ContractTypeLabelMapping: Record<ContractTypeEnum, string> = {
    [ContractTypeEnum.Other]: "Diğer",
    [ContractTypeEnum.Limited]: "Süreli",
    [ContractTypeEnum.UnLimited]: "Süresiz"
}
