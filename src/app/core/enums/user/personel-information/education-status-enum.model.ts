export enum EducationStatusEnum {
    PrimaryEducation = 1,
    SecondaryEducation = 2,
    HighSchool = 3,
    AssociateDegree = 4,
    Licence = 5,
    Degree = 6,
    Doctorate = 7,
}

export const EducationStatusLabelMapping: Record<EducationStatusEnum, string> = {
    [EducationStatusEnum.PrimaryEducation]: "İlköğretim",
    [EducationStatusEnum.SecondaryEducation]: "Ortaöğretim",
    [EducationStatusEnum.HighSchool]: "Lise",
    [EducationStatusEnum.AssociateDegree]: "Ön Lisans",
    [EducationStatusEnum.Licence]: "Lisans",
    [EducationStatusEnum.Degree]: "Yüksek Lisans",
    [EducationStatusEnum.Doctorate]: "Doktora"
}