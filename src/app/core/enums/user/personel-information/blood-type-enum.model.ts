export enum BloodTypeEnum {
    APozitif = 1,
    BPozitif = 2,
    ZeroPozitif = 3,
    ABPozitif = 4,
    ANegatif = 5,
    BNegatif = 6,
    ZeroNegatif = 7,
    ABNegatif = 8,
}

export const BloodTypeLabelMapping: Record<BloodTypeEnum, string> = {
    [BloodTypeEnum.APozitif]: "A Rh+",
    [BloodTypeEnum.BPozitif]: "B Rh+",
    [BloodTypeEnum.ZeroPozitif]: "0 Rh+",
    [BloodTypeEnum.ABPozitif]: "AB Rh+",
    [BloodTypeEnum.ANegatif]: "A Rh-",
    [BloodTypeEnum.BNegatif]: "B Rh-",
    [BloodTypeEnum.ZeroNegatif]: "0 Rh-",
    [BloodTypeEnum.ABNegatif]: "AB Rh-",
}