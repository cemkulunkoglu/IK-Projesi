export enum AdditionalTypeEnum{
  Cash = 1,
  SelectedAid = 2,
}

export const AdditionalTypeEnumLabelMapping: Record<AdditionalTypeEnum, string> = {
    [AdditionalTypeEnum.Cash]: "Nakit",
    [AdditionalTypeEnum.SelectedAid]: "Seçilen Yardım"
}
