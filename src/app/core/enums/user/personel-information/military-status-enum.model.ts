export enum MilitaryStatusEnum {
    Exempt = 1,
    Done = 2,
    Delayed = 3,
    NotDone = 4
}

export const MilitaryStatusLabelMapping: Record<MilitaryStatusEnum, string> = {
    [MilitaryStatusEnum.Exempt]: "Muaf",
    [MilitaryStatusEnum.Done]: "Yapıldı",
    [MilitaryStatusEnum.Delayed]: "Tecilli",
    [MilitaryStatusEnum.NotDone]: "Yapılmadı"
}