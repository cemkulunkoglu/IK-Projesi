import { BaseCompanyModel } from "../../base-company.model";

export interface DepartmentModel extends BaseCompanyModel {
    branchOfficeId: number;
    branchOfficeName: string;
    managers: BaseCompanyModel[];
    leaveApprovalProcessId: number;
    advanceApprovalProcessId: number;
    paymentApprovalProcessId: number;
    overTimeApprovalProcessId: number;
}
