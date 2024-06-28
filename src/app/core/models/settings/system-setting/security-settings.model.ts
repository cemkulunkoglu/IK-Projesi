export interface SecuritySettingsModel {
    id: number;
    logoutWhenBrowserClosed: boolean;
    logoutAfterTenMinutes: boolean;
    minPasswordLength: number;
    lowerAndUpperCaseRequired: boolean;
    numberRequired: boolean;
    specialCharacterRequired: boolean;
}
