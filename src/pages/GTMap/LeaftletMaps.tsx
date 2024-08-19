import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';

import 'leaflet/dist/leaflet.css';
import { IAgent } from '@app/interfaces/agents';
import { ZoomAbleMarker } from './ZoomAbleMarker';
import { AgentCard } from '@app/components/agent/AgentCard/AgentCard';
import RoutingControl from './RouteControl'; // Ensure correct import

const LeafletMaps: React.FC<{ locations?: any[]; agents?: IAgent[]; style?: Record<string, any> }> = ({
  agents = [],
  locations = [],
  style = {},
}) => {
  const [mapCenter, setMapCenter] = useState<number[]>([29, 70]);

  useEffect(() => {
    if (agents.length > 0) {
      setMapCenter(agents[0].location.coordinates);
    }
    if (locations.length > 0 && locations[locations.length - 1].latLng.length > 0) {
      setMapCenter(locations[locations.length - 1].latLng);
    }
  }, [agents, locations]);

  return (
    <MapContainer
      center={mapCenter as keyof LatLngExpression}
      key={mapCenter ? mapCenter[0] : 1}
      zoom={15}
      zoomControl={true}
      minZoom={2}
      maxZoom={20}
      style={{ ...style }}
      zoomAnimation={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <RoutingControl locations={locations} />
      {agents.length > 0 &&
        agents.map((listAgent) => (
          <ZoomAbleMarker
            popupData={<AgentCard agent={listAgent} />}
            key={listAgent._id}
            iconUrl={'/car.png'}
            latLng={listAgent.location.coordinates as LatLngExpression}
            isPopupOpen={agents.length === 1}
          />
        ))}
    </MapContainer>
  );
};

export default LeafletMaps;
