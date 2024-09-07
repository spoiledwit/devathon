import { useEffect, useRef, useState } from "react";
import { useLoadScript } from "@react-google-maps/api";
import { GrLocation } from "react-icons/gr";
import { GoLocation } from "react-icons/go";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const libraries = ["places"];
const API_KEY = import.meta.env.VITE_GOOGLE_LOCATOR_API_KEY;

const Locator = ({
  selectRegion,
  initialValue = "",
  setLocation,
  Location,
  radius=0
}: {
  selectRegion: (region: string) => void;
  placeholder?: string;
  width?: string;
  initialValue?: string;
  setLocation?: any;
  region?: string;
  Location?: any;
  radius?: number;
}) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: API_KEY,
    //@ts-ignore
    libraries,
  });

  const circleRef = useRef(null);
  const radiusInMeters = radius * 1000;
  const [address, setAddress] = useState(initialValue || "");
  const [predictions, setPredictions] = useState([]);
  const [showPredictions, setShowPredictions] = useState(false);
  const autocompleteService = useRef(null);
  const placesService = useRef(null);


  useEffect(() => {
    if (Location && markerRef.current) {
      // Update marker position
      const newPosition = new window.google.maps.LatLng(
        Location.lat,
        Location.lng
      );
      //@ts-ignore
      markerRef.current.setPosition(newPosition);

      // Draw or update circle
      if (circleRef.current) {
        //@ts-ignore
        circleRef.current.setCenter(newPosition);
        //@ts-ignore
        circleRef.current.setRadius(radiusInMeters);
      } else {
        //@ts-ignore
        circleRef.current = new window.google.maps.Circle({
          strokeColor: "#FF0000",
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: "#FF0000",
          fillOpacity: 0.35,
          map: mapRef.current,
          center: newPosition,
          radius: radiusInMeters,
        });
      }
    }
  }, [Location, radiusInMeters]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      });
    }
  }, []);

  const onPlaceChanged = (placeId: any) => {
    const request = { placeId };
    //@ts-ignore
    placesService?.current?.getDetails(request, (place: any, status: any) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        setAddress(place.formatted_address);
      }
    });
  };

  const onPredictionSelect = (prediction: any) => {
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode(
      { address: prediction.description },
      function (results, status) {
        //@ts-ignore
        if (status === window.google.maps.GeocoderStatus.OK && results[0]) {
          //@ts-ignore
          const location = results[0].geometry.location;
          setLocation({ lat: location.lat(), lng: location.lng() });
        } else {
          console.log(
            "Geocode was not successful for the following reason: " + status
          );
        }
      }
    );

    // console.log(location)
    selectRegion(prediction.description);
    // console.log(prediction);
    setShowPredictions(false);
    if (prediction.isCustom) {
      setAddress(prediction.description);
    } else {
      onPlaceChanged(prediction.place_id);
    }
  };

  useEffect(() => {
    if (isLoaded) {
      //@ts-ignore
      const map = new window.google.maps.Map(
        //@ts-ignore
        document.getElementById("map-canvas"),
        {
          zoom: 5,
          center: new window.google.maps.LatLng(50, 50),
        }
      );
      //@ts-ignore
      autocompleteService.current =
        new window.google.maps.places.AutocompleteService();
      //@ts-ignore
      placesService.current = new window.google.maps.places.PlacesService(map);
    }
  }, [isLoaded]);

  useEffect(() => {
    if (isLoaded && address.length > 0) {
      //@ts-ignore
      autocompleteService.current.getPlacePredictions(
        {
          input: address,
          types: ["(regions)"],
        },
        //@ts-ignore
        (predictions, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK) {
            setPredictions(predictions);
          }
        }
      );
    } else {
      setPredictions([]);
    }
  }, [address, isLoaded]);

  // interactive map code
  const markerRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    if (isLoaded) {
      if (!mapRef.current) {
        // Initialize the map only if it hasn't been created yet
        //@ts-ignore
        mapRef.current = new window.google.maps.Map(
          //@ts-ignore
          document.getElementById("map"),
          {
            zoom: 20,
            center: new window.google.maps.LatLng(Location?.lat, Location?.lng),
          }
        );
        //@ts-ignore
        autocompleteService.current =
          new window.google.maps.places.AutocompleteService();
        //@ts-ignore
        placesService.current = new window.google.maps.places.PlacesService(
          //@ts-ignore
          mapRef.current
        );
        //@ts-ignore
        mapRef.current.addListener("click", (e) => {
          if (markerRef.current) {
            //@ts-ignore
            markerRef.current.setPosition(e.latLng);
          } else {
            //@ts-ignore
            markerRef.current = new window.google.maps.Marker({
              position: e.latLng,
              map: mapRef.current,
            });
          }
          setLocation({ lat: e.latLng.lat(), lng: e.latLng.lng() });
          getAddress(e.latLng.lat(), e.latLng.lng());
        });
      } else {
        // If the map already exists, just re-center it
        //@ts-ignore
        mapRef.current.setCenter(
          new window.google.maps.LatLng(Location?.lat, Location?.lng)
        );
      }
    }
  }, [isLoaded, Location]);

  const getAddress = (lat: any, lng: any) => {
    const geocoder = new window.google.maps.Geocoder();
    const latlng = { lat: lat, lng: lng };
    geocoder.geocode({ location: latlng }, function (results, status) {
      if (status === "OK") {
        //@ts-ignore
        if (results[0]) {
          //@ts-ignore
          const address = results[0].formatted_address;
          setAddress(address);
        } else {
          console.log("No results found");
        }
      } else {
        console.log("Geocoder failed due to: " + status);
      }
    });
  };

  // Update marker position when Location changes
  useEffect(() => {
    if (Location && markerRef.current) {
      // Update marker position
      const newPosition = new window.google.maps.LatLng(
        Location.lat,
        Location.lng
      );
      //@ts-ignore
      markerRef.current.setPosition(newPosition);
    }
  }, [Location]);

  // Cleanup the marker when the component unmounts
  useEffect(() => {
    return () => {
      if (markerRef.current) {
        //@ts-ignore
        markerRef.current.setMap(null);
      }
    };
  }, []);

  if (loadError) {
    return <div>Error loading maps</div>;
  }

  if (!isLoaded) {
    return <div></div>;
  }

  return (
    <div className={`flex relative`}>
      <div>
        <div id="map-canvas" />
      </div>
      <div className="transition-all duration-150">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">
              {address ? (
                <div className="flex items-center space-x-2">
                  <GoLocation size={20} className="mr-2 text-primary" />
                  <p className="text-sm sm:text-base whitespace-nowrap">
                    {address.length > 25
                      ? address.slice(0, 25) + "..."
                      : address}
                  </p>
                </div>
              ) : (
                "Locate Me"
              )}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Get your Location</DialogTitle>
              <DialogDescription>
                We use your location to show you the nearest stores
              </DialogDescription>
            </DialogHeader>
            <div className="flex items-center space-x-2">
              <div className="grid flex-1 gap-2">
                <Label htmlFor="link" className="sr-only">
                  Link
                </Label>

                <Input
                  id="autocomplete"
                  onFocus={() => setShowPredictions(true)}
                  defaultValue="Cairo, Egypt"
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter your location"
                  value={address}
                />
                {address.length > 0 && showPredictions && (
                  <div className="pac-container  w-full sm:w-64 md:w-96 overflow-hidden">
                    {predictions.map((prediction, index) => (
                      <div
                        key={index}
                        className="flex items-center p-3 border-b  hover:bg-red-50 cursor-pointer"
                        onClick={() => onPredictionSelect(prediction)}
                      >
                        <GrLocation
                          size={20}
                          className="mr-2 text-primary min-w-[20px]"
                        />
                        <p className="text-sm sm:text-base whitespace-nowrap">
                          {/* @ts-ignore */}
                          {prediction && prediction.description.length > 40
                            ? // @ts-ignore
                              prediction.description.slice(0, 40) + "..."
                            : // @ts-ignore
                              prediction.description}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <DialogFooter className="sm:justify-start">
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Close
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        {/* Displaying the interactive map here */}
        <p className="mt-3 mb-2 text-sm font-medium text-primary">
          Click on the map to place the marker, or search for a location above
        </p>
        <div className="flex justify-center">
          <div className="w-[600px] h-96 overflow-hidden rounded-md">
            <div id="map" className="w-full h-full border-4 border-primary"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Locator;