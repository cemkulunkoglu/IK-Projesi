export enum PermissionCategoryEnum {
    General = 1,
    Personal = 2,
    Contact = 3,
    Address = 4,
    Emergency = 5,
    Bank = 6,
    Connections = 7,
    Demands = 8
}

export const PermissionCategoryLabelMapping: Record<PermissionCategoryEnum, string> = {
    [PermissionCategoryEnum.General]: "Genel",
    [PermissionCategoryEnum.Personal]: "Kişisel",
    [PermissionCategoryEnum.Contact]: "İletişim",
    [PermissionCategoryEnum.Address]: "Adres",
    [PermissionCategoryEnum.Emergency]: "Acil Durum",
    [PermissionCategoryEnum.Bank]: "Banka",
    [PermissionCategoryEnum.Connections]: "Bağlantılar",
    [PermissionCategoryEnum.Demands]: "Talep Ayarları",

}
