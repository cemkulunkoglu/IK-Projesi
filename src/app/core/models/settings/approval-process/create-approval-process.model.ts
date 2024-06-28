export interface CreateApprovalProcess {
    name: string;
    isDefaultProcess: boolean;
    showApprovalOrder: boolean;
    approvalProcessUsers: ApprovalProcessUser[];
}

export interface ApprovalProcessUser {
    userId: number;
    order: number;
}
