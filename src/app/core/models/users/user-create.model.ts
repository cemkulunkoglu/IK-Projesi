import { AccessTypeEnum } from "../../enums/user/access-type-enum.model";
import { ContractTypeEnum } from "../../enums/user/contract-type-enum.model";

export class UserCreateModel {
    name: string;
    surname: string;
    emailBusiness: string;
    emailPersonal: string;
    phoneBusiness: string;
    phonePersonal: string;
    startDate: Date;
    accessType: AccessTypeEnum;
    contractType: ContractTypeEnum;
    contractEndDate: Date;
    profilPicture: string;
    roles: number[];
}
