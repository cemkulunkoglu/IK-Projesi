import { OfficialHolidayTypeEnum } from "src/app/core/enums/official-holiday-type/official-holiday-type.enum";

export interface OfficialHolidaysModel {
    id: number;
    name: string;
    description: string;
    officialHolidayType: OfficialHolidayTypeEnum;
    startDate: Date;
    endDate: Date;
    repeatAnnually: boolean;
}
