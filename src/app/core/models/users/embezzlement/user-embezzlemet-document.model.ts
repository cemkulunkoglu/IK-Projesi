
export interface UserEmbezzlementDocument {
    date: string;
    userFullName: string;
    identityNumber: string;
    userJobPosition: string;
    companyName: string;
    items: EmbezzlementItem[];
}

export interface EmbezzlementItem {
    order: string;
    serialNumber: string;
    category: string;
    issueDate: string;
    returnDate: string;
    description: string;
}
