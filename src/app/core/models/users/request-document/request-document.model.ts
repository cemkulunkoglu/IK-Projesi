import { RequestDocumentCreateModel } from "./request-document-create.model";


export class RequestDocumentModel extends RequestDocumentCreateModel{
  id:number;
  fullName:string;
  profilPicture:string;
}
