import { LatLngExpression } from 'leaflet';
import { useMap } from 'react-leaflet';

export default function ChangeMapView({ coords }: { coords: LatLngExpression }) {
  const map = useMap();
  map.setView(coords, map.getZoom());

  return null;
}
