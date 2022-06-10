
export interface WildlifeDetection {
  id:number;
  recordedAt: number;
  animalName: string;
  animalId: number;
  method: string;
  total: number;
  description: string;
  icon: string;
  female: number;
  male: number;
  offspring: number;
  locationLong: number;
  locationLat: number;
  media: string;
  audio: string;
  spectrogram: string;
  comment: string;
  mediaType:string;
  automatic: string;
}