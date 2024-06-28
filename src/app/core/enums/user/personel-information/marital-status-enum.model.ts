export enum MaritalStatusEnum {
    Married = 1,
    Single = 2
}

export const MaritalStatusLabelMapping: Record<MaritalStatusEnum, string> = {
    [MaritalStatusEnum.Married]: "Evli",
    [MaritalStatusEnum.Single]: "Bekar"
}