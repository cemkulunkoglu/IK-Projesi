export enum PeriodEnum {
    Monthly = 1,
    Weekly = 2,
    Daily = 3,
}

export const PeriodLabelMapping: Record<PeriodEnum, string> = {
    [PeriodEnum.Monthly]: "Aylık",
    [PeriodEnum.Weekly]: "Haftalık",
    [PeriodEnum.Daily]: "Günlük"
}