import React, { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import 'leaflet-polylinedecorator';
import { createMarkerLeaflet, createNumberLocationIconLeaflet } from '@app/utils/utils';

interface Location {
  address: string;
  latLng: [number, number];
  type: number;
}

interface RoutingControlProps {
  locations: Location[];
}

const RoutingControl: React.FC<RoutingControlProps> = ({ locations }) => {
  const map = useMap();

  useEffect(() => {
    if (!map || locations.length === 0) {
      console.log('Map or locations not available');
      return;
    }

    console.log('Initializing routing control with locations:', locations);

    // Remove any existing routing control
    const existingRoutingControl = (map as any)._routingControl;
    if (existingRoutingControl) {
      try {
        console.log('Removing existing routing control');
        map.removeControl(existingRoutingControl);
      } catch (error: any) {
        console.error('Error removing existing routing control:', error);
      }
    }

    let arrow: any = null;

    const addArrow = (route: any) => {
      if (!route || !route.coordinates) {
        console.error('Invalid route or route coordinates:', route);
        return;
      }

      console.log('Adding arrow to route:', route);
      const polyline = L.polyline(route.coordinates).addTo(map);

      // Define animation options
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const arrow = L.polylineDecorator(polyline, {
        patterns: [
          {
            offset: 25,
            repeat: 50,
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            symbol: L.Symbol.arrowHead({
              pixelSize: 10,
              polygon: true,
              pathOptions: { stroke: true, color: '#f00', weight: 2 },
            }),
          },
        ],
      }).addTo(map);

      return arrow;
    };

    const routingControl = L.Routing.control({
      waypoints: locations.map((location) => L.latLng(location.latLng)),
      lineOptions: {
        styles: [
          {
            color: '#006ccf',
            opacity: 0.5,
            weight: 7,
            stroke: true,
            fillColor: 'yellow',
          },
        ],
        extendToWaypoints: true,
        missingRouteTolerance: 1,
      },
      routeWhileDragging: true,
      addWaypoints: false,
      useZoomParameter: true,
      collapsible: true,
      fitSelectedRoutes: true,
      showAlternatives: true,
      show: false,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      createMarker: (i: number, wp: any) => {
        return createMarkerLeaflet({
          latLng: wp.latLng,
          draggable: false,
          icon: createNumberLocationIconLeaflet(i + 1),
          popupHtml: i === 0 ? '<b>Start Point</b>' : '<b>Destination Point</b>',
        });
      },
    }).addTo(map);

    routingControl.on('routesfound', (e: any) => {
      console.log('Routes found:', e);
      if (arrow) {
        try {
          console.log('Removing existing arrow');
          map.removeLayer(arrow);
        } catch (error: any) {
          console.error('Error removing existing arrow:', error);
        }
      }
      const route = e.routes[0];
      if (route) {
        arrow = addArrow(route);
      } else {
        console.error('No route found');
      }
    });

    // Save routing control to map object for later removal
    (map as any)._routingControl = routingControl;

    // Clean up function
    return () => {
      // try {
      //   if (routingControl) {
      //     console.log('Removing routing control');
      //     map.removeControl(routingControl);
      //   }
      // } catch (error: any) {
      //   console.error('Error removing routing control:', error);
      // }
      try {
        if (arrow) {
          console.log('Removing arrow');
          map.removeLayer(arrow);
        }
      } catch (error: any) {
        console.error('Error removing arrow:', error);
      }
    };
  }, [map, locations]);

  return null;
};

export default RoutingControl;
