export type Mountain = {
  name: string;
  coordinates: L.LatLngTuple;
  climbs?: Climb[];
  imgFolder: string;
};

export type Climb = {
  id: number;
  date: string;
  imgs?: string[];
  description: string;
  duration: number;
  distance: string;
  heartRate: string;
  elevationGain: number;
  track?: GeoJSON.GeoJsonObject;
};
