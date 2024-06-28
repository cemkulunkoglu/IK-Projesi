import { DocumentBase64 } from "./document/document-base64-model";

export class UpdateUserActiveModel{
  userId: number;
  contractEndDate:Date;
  description:string;
  leavingWorkReason:number;
  documents:DocumentBase64[];
}
