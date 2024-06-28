import { UserPaymentCreateModel } from "./user-payment-create.model";

export class UserPaymentModel extends UserPaymentCreateModel{
  id:number;
  profilPicture:string;
  userNameSurname:string;
  identityNumber:string;
  createdDate:Date;

}
