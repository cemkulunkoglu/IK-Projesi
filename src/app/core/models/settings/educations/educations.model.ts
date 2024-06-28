export interface EducationsModel {
    id: number;
    name: string;
    educator: string
    description: string;
    startDate: Date;
    endDate: Date;
    validity: Date;
    educationProvider: string;
    location: string;
}
