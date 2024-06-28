export enum LeaveTypeEnum {
  MilitaryLeave = 1,
  ParentalLeave = 2,
  MaternityLeave = 3,
  PostpartumLeave = 4,
  MarriageLeave = 5,
  SickLeave = 6,
  jobseekersLeave = 7,
  ExcuseLeave = 8,
  BreastfeedingBabyLeave = 9,
  RemoteWorkingLeave = 10,
  UnpaidLeave = 11,
  BereavementLeave = 12,
  VacationLeave = 13,
  RoadLeave = 14
}

export const LeaveTypeEnumLabelMapping: Record<LeaveTypeEnum, string> = {
  [LeaveTypeEnum.MilitaryLeave]: "Askerlik",
  [LeaveTypeEnum.ParentalLeave]: "Babalık",
  [LeaveTypeEnum.MaternityLeave]: "Doğum",
  [LeaveTypeEnum.PostpartumLeave]: "Doğum Sonrası",
  [LeaveTypeEnum.MarriageLeave]: "Evlilik",
  [LeaveTypeEnum.SickLeave]: "Hastalık",
  [LeaveTypeEnum.jobseekersLeave]: "İş Arama",
  [LeaveTypeEnum.ExcuseLeave]: "Mazeret",
  [LeaveTypeEnum.BreastfeedingBabyLeave]: "Süt",
  [LeaveTypeEnum.RemoteWorkingLeave]: "Uzaktan Çalışma",
  [LeaveTypeEnum.UnpaidLeave]: "Ücretsiz",
  [LeaveTypeEnum.BereavementLeave]: "Vefat",
  [LeaveTypeEnum.VacationLeave]: "Yıllık",
  [LeaveTypeEnum.RoadLeave]: "Yol",
}
