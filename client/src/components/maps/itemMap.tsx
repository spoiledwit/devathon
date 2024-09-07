import { useEffect, useRef } from "react";
import { useLoadScript, GoogleMap, Marker } from "@react-google-maps/api";

const ItemMap = ({ lat, lng }: { lat: number; lng: number }) => {
  const API_KEY = import.meta.env.VITE_GOOGLE_LOCATOR_API_KEY;

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: API_KEY,
    libraries: ["places"],
  });

  const mapRef = useRef();
  const mapContainerStyle = {
    width: "100%",
    height: "100%",
    borderRadius: "20px",
  };

  // making center of pakistan
  const center = { lat: 30.3753, lng: 69.3451 };

  useEffect(() => {
    if (mapRef.current && isLoaded) {
      // @ts-ignore
      mapRef.current = new window.google.maps.Map(
        //@ts-ignore
        document.getElementById("map2"),
        {
          zoom: 5,
          center: center,
        }
      );
    }
  }, [isLoaded]);

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div className="w-full mt-6 h-[500px]">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={15}
        center={{ lat, lng }}
      >
        <Marker position={{ lat, lng }} />
      </GoogleMap>
    </div>
  );
};

export default ItemMap;
