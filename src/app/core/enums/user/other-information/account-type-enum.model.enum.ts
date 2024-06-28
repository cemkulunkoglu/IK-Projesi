export enum AccountTypeEnum {
    Other = 1,
    Deposit = 2,
    NotDeposit = 3
}

export const AccountTypeLabelMapping: Record<AccountTypeEnum, string> = {
    [AccountTypeEnum.Other]: "Diğer",
    [AccountTypeEnum.Deposit]: "Vadeli",
    [AccountTypeEnum.NotDeposit]: "Vadesiz",
}
