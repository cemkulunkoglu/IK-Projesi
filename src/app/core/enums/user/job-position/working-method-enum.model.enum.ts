export enum WorkingMethodEnum {
    FullTime = 1,
    PartTime = 2,
    Remote = 3,
    Hybrid = 4,
    Freelance = 5
}

export const WorkingMethodLabelMapping: Record<WorkingMethodEnum, string> = {
    [WorkingMethodEnum.FullTime]: "Tam Zamanlı",
    [WorkingMethodEnum.PartTime]: "Yarı Zamanlı",
    [WorkingMethodEnum.Remote]: "Uzaktan Çalışma",
    [WorkingMethodEnum.Hybrid]: "Hibrit Çalışma",
    [WorkingMethodEnum.Freelance]: "Serbest Zamanlı"
}
