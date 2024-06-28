export enum ObstacleDegreeEnum {
    First = 1,
    Second = 2
}

export const ObstacleDegreeLabelMapping: Record<ObstacleDegreeEnum, string> = {
    [ObstacleDegreeEnum.First]: "1.Derece",
    [ObstacleDegreeEnum.Second]: "2.Derece"
}