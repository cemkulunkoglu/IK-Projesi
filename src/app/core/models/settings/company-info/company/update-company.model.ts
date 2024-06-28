import { CreateCompanyModel } from "./create-company.model";

export interface UpdateCompanyModel extends CreateCompanyModel {
    id: number;
}
