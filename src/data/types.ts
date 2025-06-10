export type Mountain = {
  name: string;
  coordinates: L.LatLngTuple;
  climbs?: Climb[];
  driveFolderId?: string; // Google Drive folder ID for mountain images
};

export type Climb = {
  id: number;
  date: string;
  imgs?: string[];
  description: string;
  duration: string;
  distance: string;
  heartRate: string;
  elevationGain: number;
  track?: GeoJSON.GeoJsonObject;
};
