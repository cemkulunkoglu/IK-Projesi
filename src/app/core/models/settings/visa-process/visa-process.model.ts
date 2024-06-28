export interface VisaProcessDocumentForView {
    id: number;
    name: string;
    path: string;
    description: string;
    order: number;
}

export interface VisaProcess {
    id: number;
    name: string;
    description: string;
    visaProcessDocuments: VisaProcessDocumentForView[];
}
