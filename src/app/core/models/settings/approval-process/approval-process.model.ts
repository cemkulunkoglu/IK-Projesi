export interface ApprovalProcess {
    id: number;
    name: string;
    isDefaultProcess: boolean;
    showApprovalOrder: boolean;
    approvalProcessUsers: ApprovalProcessUser[];
}

export interface ApprovalProcessUser {
    id: number;
    userId: number;
    userFullName: string;
    order: number;
}
