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
  /** Duration in seconds */
  duration: number;
  /** Distance in meters */
  distance: number;
  /** Heart rate in beats per minute */
  heartRate: number;
  /** Elevation in meters */
  elevationGain: number;
  track?: GeoJSON.GeoJsonObject;
};
