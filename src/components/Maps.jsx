// eslint-disable-next-line

import { useEffect, useState } from "react";
import {
  GoogleMap,
  InfoWindow,
  Marker,
  Polyline,
} from "@react-google-maps/api";
import { Accordion, AccordionItem } from "@nextui-org/react";

const containerStyle = {
  width: "100%",
  height: "400px",
};

// Coordernadas del restaurante
const center = {
  lat: 10.9888999,
  lng: -74.7880153,
};

const Maps = ({ destinationCoords, distance, shippingCost, cart }) => {
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);

  const toggleInfoWindow = (marker) => {
    setSelectedMarker(marker);
  };

  // useEffect para manejar la apertura del Accordion
  useEffect(() => {
    // Verificar si la dirección y la ciudad están vacías
    if (!cart.info.address || !cart.info.city) {
      return;
    }

    // Abrir el Accordion
    setIsAccordionOpen(true);
  }, [cart.info.address, cart.info.city]);

  return (
    <Accordion
      variant="splitted"
      disabledKeys={!isAccordionOpen && ["1"]}
      style={{ padding: 0 }}
    >
      <AccordionItem
        key="1"
        aria-label="Maps"
        title="Mapa"
        className="text-xl font-semibold w-full mb-5 mt-5 lg:mt-0"
        subtitle={
          !isAccordionOpen && (
            <span>Ingresa la dirección y la ciudad para continuar</span>
          )
        }
      >
        <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={12}>
          <Marker position={center} onClick={() => toggleInfoWindow(center)} />
          {destinationCoords && (
            <Marker
              position={destinationCoords}
              onClick={() => toggleInfoWindow(destinationCoords)}
            />
          )}
          {selectedMarker && (
            <InfoWindow
              position={selectedMarker}
              onCloseClick={() => setSelectedMarker(null)}
            >
              <div>
                {selectedMarker === center ? (
                  <div>Restaurante</div>
                ) : (
                  <div>
                    Dirección: {cart.info.address} <br />
                    Distancia: {distance} km <br />
                    Costo de envío: {shippingCost}
                  </div>
                )}
              </div>
            </InfoWindow>
          )}
          <Polyline
            path={[center, destinationCoords]}
            options={{
              strokeColor: "#FF0000",
              strokeOpacity: 1.0,
              strokeWeight: 2,
            }}
          />
        </GoogleMap>
      </AccordionItem>
    </Accordion>
  );
};

export default Maps;
