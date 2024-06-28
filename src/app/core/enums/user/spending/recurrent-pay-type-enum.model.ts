export enum RecurrentPayTypeEnum{
        ForOnce = 1,
        Monthly = 2,
}
export const RecurrentPayTypeEnumLabelMapping: Record<RecurrentPayTypeEnum, string> = {
  [RecurrentPayTypeEnum.ForOnce]: "Tek Seferlik",
  [RecurrentPayTypeEnum.Monthly]: "Aylık",
}
