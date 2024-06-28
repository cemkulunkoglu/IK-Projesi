import { CreateJobTitleModel } from "./create-job-title.model";

export interface UpdateJobTitleModel extends CreateJobTitleModel {
    id: number;
}
