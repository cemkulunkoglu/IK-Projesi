import { UserLeaveCreateModel } from "./user-leave-create.model";

export class UserLeaveModel extends UserLeaveCreateModel{
  id: number;
  profilPicture :string;
  userName:string;
}
