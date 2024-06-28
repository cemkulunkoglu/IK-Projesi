import { DocumentTypeEnum } from "src/app/core/enums/request-document/document-type-enum.model";

export class RequestDocumentCreateModel {
  userId: number;
  documentType: DocumentTypeEnum;
  visaProcessId: number;
  travelStartDate: Date;
  travelEndDate: Date;
  lastDueDate: Date;
  destinationCountry: string;
  description: string;
  visaProcessDocuments: number[];
}
