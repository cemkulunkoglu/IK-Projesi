export enum UserEducationStatusTypeEnum {
    Assigned = 1,
    Pending = 2,
    Continues = 3,
    Cancelled = 4,
    Declined = 5,
    Exempt = 6,
    Completed = 7
}

export const UserEducationStatusLabelMapping: Record<UserEducationStatusTypeEnum, string> = {
    [UserEducationStatusTypeEnum.Assigned]: "Atandı",
    [UserEducationStatusTypeEnum.Pending]: "Beklemede",
    [UserEducationStatusTypeEnum.Continues]: "Devam Ediyor",
    [UserEducationStatusTypeEnum.Cancelled]: "İptal Edildi",
    [UserEducationStatusTypeEnum.Declined]: "Katılmadı",
    [UserEducationStatusTypeEnum.Exempt]: "Muaf",
    [UserEducationStatusTypeEnum.Completed]: "Tamamlandı"
};
