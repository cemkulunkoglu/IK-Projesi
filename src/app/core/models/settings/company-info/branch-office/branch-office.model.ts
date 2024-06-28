import { BaseCompanyModel } from "../../base-company.model";

export interface BranchOfficeModel extends BaseCompanyModel{
    companyId: number;
    companyName: string;
}
