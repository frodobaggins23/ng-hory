export type Mountain = {
  name: string;
  coordinates: L.LatLngExpression;
};

export const mountains: Mountain[] = [
  {
    name: 'Ještěd',
    coordinates: [50.7326181, 14.9850481],
  },
  {
    name: 'Sněžka',
    coordinates: [50.73602, 15.7396017],
  },
  {
    name: 'Lovoš',
    coordinates: [50.5276125, 14.01802],
  },
  {
    name: 'Milešovka',
    coordinates: [50.554905, 13.9310911],
  },
  {
    name: 'Říp',
    coordinates: [50.3865333, 14.2896225],
  },
  {
    name: 'Ralsko',
    coordinates: [50.6741994, 14.7659739],
  },
  {
    name: 'Blaník',
    coordinates: [49.6418089, 14.8736789],
  },
];
