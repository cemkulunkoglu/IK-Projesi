export interface VisaProcessDocumentForCreate {
    name: string;
    description: string;
    order: number;
    document: {
        name: string;
        extension: string;
        content: string;
    };
}

export interface CreateVisaProcess {
    name: string;
    description: string;
    visaProcessDocuments: VisaProcessDocumentForCreate[];
}
