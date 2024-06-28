export interface NotificationSettingsModel {
    id: number;
    newsletterSubscribeEmail: string;
    firstTrialProcessEnding: number;
    secondTrialProcessEnding: number;
    endOfContract: number;
    sendLeaveNotification: boolean;
    sendExtaLeaveNotification: boolean;
    addLeaveFormToEmail: boolean;
    sendAdvancePaymentNotification: boolean;
    sendSalaryBonusPaymentNotification: boolean;
    sendExpenseNotification: boolean;
    sendBonusPaymentNotification: boolean;
    celebrateBirthday: boolean;
    endOfEducationWeek: number;
    notificationSettingManagers: number[];
}
