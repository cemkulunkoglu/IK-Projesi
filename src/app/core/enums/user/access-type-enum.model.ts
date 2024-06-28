export enum AccessTypeEnum {
    Manager = 1,
    Employee = 2,
    SystemAdministrator = 3
}

export const AccessTypeLabelMapping: Record<AccessTypeEnum, string> = {
    [AccessTypeEnum.Manager]: "Yönetici",
    [AccessTypeEnum.Employee]: "Çalışan",
    [AccessTypeEnum.SystemAdministrator]: "Sistem Yöneticisi"
}
