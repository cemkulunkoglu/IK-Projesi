export interface VisaProcessDocumentForUpdate {
    id: number;
    name: string;
    description: string;
    order: number;
    document: {
        name: string;
        extension: string;
        content: string;
    };
}

export interface UpdateVisaProcess {
    id: number;
    name: string;
    description: string;
    visaProcessDocuments: VisaProcessDocumentForUpdate[];
}
