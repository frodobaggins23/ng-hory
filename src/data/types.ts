export type Mountain = {
  name: string;
  coordinates: L.LatLngTuple;
  climbs?: Climb[];
};

export type Climb = {
  date: string;
  img?: string;
  description: string;
  duration: string;
  distance: string;
  heartRate: string;
};
