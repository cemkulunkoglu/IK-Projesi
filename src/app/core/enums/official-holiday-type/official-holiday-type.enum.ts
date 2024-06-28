export enum OfficialHolidayTypeEnum {
    HalfDay = 1,
    FullDay = 2,
    MultipleDays = 3
}

export const OfficialHolidayTypeLabelMapping: Record<OfficialHolidayTypeEnum, string> = {
    [OfficialHolidayTypeEnum.HalfDay]: "Yarım Gün",
    [OfficialHolidayTypeEnum.FullDay]: "Tam Gün",
    [OfficialHolidayTypeEnum.MultipleDays]: "Birden Fazla Gün",
};
