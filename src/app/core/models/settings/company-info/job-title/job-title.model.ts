import { BaseCompanyModel } from "../../base-company.model";

export interface JobTitleModel extends BaseCompanyModel{
    departmentId: number;
    departmentName: string;
}
