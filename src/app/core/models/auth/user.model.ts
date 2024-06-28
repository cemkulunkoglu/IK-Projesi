import { AccessTypeEnum } from "../../enums/user/access-type-enum.model";

export class UserModel {
  accessType: AccessTypeEnum
  id: number;
  name: string;
  email: string;
  profilPicture: string;
  permissions: string[];

  setUser(_user: unknown) {
    const user = _user as UserModel;
    this.accessType = user.accessType;
    this.id = user.id;
    this.name = user.name || '';
    this.email = user.email || '';
    this.profilPicture = user.profilPicture || '';
    this.permissions = user.permissions || [];
  }
}
