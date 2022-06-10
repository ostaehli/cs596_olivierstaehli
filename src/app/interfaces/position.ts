export interface Position {
    id?: number;
    animalId: number;
    animalName: string;
    method: string;
    media: string;
    locationLong: number;
    locationLat: number;
    recordedAt: number;
    total: number;
    female: number;
    male: number;
    offspring: number;
    mediaType: "img"|"audio";
    icon: string;
}
