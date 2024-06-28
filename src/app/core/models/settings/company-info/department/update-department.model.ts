import { CreateDepartmentModel } from "./create-department.model";

export interface UpdateDepartmentModel extends CreateDepartmentModel {
    id: number;
}
