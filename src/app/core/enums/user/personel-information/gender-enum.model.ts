export enum GenderEnum {
    Male = 1,
    Female = 2
}

export const GenderLabelMapping: Record<GenderEnum, string> = {
    [GenderEnum.Male]: "Erkek",
    [GenderEnum.Female]: "Kadın"
}