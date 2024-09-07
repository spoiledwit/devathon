import { useEffect, useRef, useState } from "react";
import { useLoadScript, GoogleMap, Marker } from "@react-google-maps/api";
import axios from "axios";

const ItemsMap = () => {
  const [items, setItems] = useState<any>([]);
  const API_KEY = import.meta.env.VITE_GOOGLE_LOCATOR_API_KEY;

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: API_KEY,
    libraries: ["places"],
  });

  const mapRef = useRef();
  const mapContainerStyle = {
    width: "80%",
    height: "80%",
    borderRadius: "20px",
  };

  // making center of pakistan
  const center = { lat: 30.3753, lng: 69.3451 };

  useEffect(() => {
    if (items && !mapRef.current && isLoaded) {
      // @ts-ignore
      mapRef.current = new window.google.maps.Map(
        //@ts-ignore
        document.getElementById("map"),
        {
          zoom: 5,
          center: center,
        }
      );
    }
  }, [isLoaded]);

  useEffect(() => {
    handleGetItems();
  }, []);

  const handleGetItems = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BASE_URI}/item`);
      setItems(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading...</div>;

  console.log(items)

  return (
    <div
      className="h-[100vh] w-[100vw] fixed left-0 top-0 flex flex-col items-center justify-center"
      style={{
        zIndex: 1000,
      }}
    >
        <div
        className="w-full h-full bg-white bg-opacity-80 absolute top-0 left-0"
        />
      <GoogleMap
        id="map"
        mapContainerStyle={mapContainerStyle}
        zoom={5}
        center={center}
      >
        {items.map((item: any) => (
          <Marker
            key="test-marker"
            position={{ lat: item.location.lat, lng: item.location.lng }}
            title="Test Marker"
          />
        ))}
      </GoogleMap>
    </div>
  );
};

export default ItemsMap;
