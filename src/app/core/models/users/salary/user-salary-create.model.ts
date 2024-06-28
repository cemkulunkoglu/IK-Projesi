import { CurrencyTypeEnum } from "src/app/core/enums/user/salary/currency-type-enum.model.enum";
import { PeriodEnum } from "src/app/core/enums/user/salary/period-enum.model.enum";
import { SalaryTypeEnum } from "src/app/core/enums/user/salary/salary-type-enum.model.enum";

export class UserSalaryCreateModel {
    userId: number;
    salary: number;
    currencyType: CurrencyTypeEnum;
    startDate: Date;
    period: PeriodEnum;
    salaryType: SalaryTypeEnum;
}
