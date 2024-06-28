import { BloodTypeEnum } from "src/app/core/enums/user/personel-information/blood-type-enum.model";
import { EducationStatusEnum } from "src/app/core/enums/user/personel-information/education-status-enum.model";
import { GenderEnum } from "src/app/core/enums/user/personel-information/gender-enum.model";
import { MaritalStatusEnum } from "src/app/core/enums/user/personel-information/marital-status-enum.model";
import { MilitaryStatusEnum } from "src/app/core/enums/user/personel-information/military-status-enum.model";
import { ObstacleDegreeEnum } from "src/app/core/enums/user/personel-information/obstacle-degree-enum.model";
import { SpousesEmploymentStatusEnum } from "src/app/core/enums/user/personel-information/spouses-employment-status-enum.model";

export class UserPersonelInformationModel {
    userId: number;
    dateOfBirth: Date;
    identityNumber: string;
    maritalStatus: MaritalStatusEnum;
    userName:string;
    profilPicture:string;
    spousesEmploymentStatus: SpousesEmploymentStatusEnum;
    gender: GenderEnum;
    obstacleDegree: ObstacleDegreeEnum;
    nationalityId: number;
    numberOfChildren: number;
    bloodType: BloodTypeEnum;
    militaryStatus: MilitaryStatusEnum;
    militaryPostponementDate: Date;
    educationStatus: EducationStatusEnum;
    highestLevelOfEducationCompleted: EducationStatusEnum;
    lastCompletedEducationalInstitution: string;
}
