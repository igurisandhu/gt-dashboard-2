import { useEffect, useRef } from 'react';
import { Marker, Popup } from 'react-leaflet';
import L, { LatLngExpression } from 'leaflet';

interface ZoomAbleMarkerProps {
  latLng: LatLngExpression;
  iconUrl: string;
  popupData: any;
  isPopupOpen?: boolean; // Marked as optional with a default value
}

export const ZoomAbleMarker = ({ latLng, iconUrl, popupData, isPopupOpen = false }: ZoomAbleMarkerProps) => {
  // Specify the type of markerRef as L.Marker
  const markerRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    if (markerRef.current && isPopupOpen) {
      markerRef.current.openPopup();
    }
  }, [isPopupOpen]);

  const carIcon = L.icon({
    iconUrl,
    iconSize: [15, 15],
    iconAnchor: [15 / 2, 15 / 2],
  });

  return (
    <Marker position={latLng} icon={carIcon} ref={markerRef}>
      <Popup>{popupData}</Popup>
    </Marker>
  );
};
