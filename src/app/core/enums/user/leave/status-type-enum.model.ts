export enum StatusTypeEnum {
  Approved = 1,
  WaitingApproved = 2,
  Cancelled = 3
}

export const StatusTypeEnumLabelMapping: Record<StatusTypeEnum, string> = {
  [StatusTypeEnum.Approved]: "Onaylandı",
  [StatusTypeEnum.WaitingApproved]: "Onay Bekleniyor",
  [StatusTypeEnum.Cancelled]: "Reddedildi"
}
