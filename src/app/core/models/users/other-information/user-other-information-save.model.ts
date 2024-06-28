import { AccountTypeEnum } from "src/app/core/enums/user/other-information/account-type-enum.model.enum";

export class UserOtherInformationSaveModel {
    userId: number;
    district: string;
    city: string;
    address: string;
    postCode: string;
    homePhone: string;
    bankName: string;
    accountType: AccountTypeEnum;
    accountNumber: string;
    iban: string;
    emergencyContactPerson: string;
    emergencyContactDegree: string;
    emergencyContactPhone: string;
    connectionName: string;
    connectionAddress: string;
    countryId: number;
}
