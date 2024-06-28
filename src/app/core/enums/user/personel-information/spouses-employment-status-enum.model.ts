export enum SpousesEmploymentStatusEnum {
    Working = 1,
    NotWorking = 2,
    Retired = 3
}

export const SpousesEmploymentStatusLabelMapping: Record<SpousesEmploymentStatusEnum, string> = {
    [SpousesEmploymentStatusEnum.Working]: "Çalışıyor",
    [SpousesEmploymentStatusEnum.NotWorking]: "Çalışmıyor",
    [SpousesEmploymentStatusEnum.Retired]: "Emekli"
}
