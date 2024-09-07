import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import { Calendar } from '@/components/ui/calendar'
import PlaceGallery from "@/components/Item/PlaceGallery";
import loadinganimation from "@/assets/loading.gif";
import Booking from "@/components/Item/Booking";
import Content from "@/components/Item/Content";
import { useParams } from "react-router-dom";
import ItemMap from "@/components/maps/itemMap";
import { parseLatLng } from "@/lib/utils";

interface Location {
    lat: number;
    lng: number;
}

const EventDetails = () => {
    const [item, setItem] = useState<any>();
    const [loading, setLoading] = useState<boolean>(true);
    const [location, setLocation] = useState<Location>({
        lat: 0,
        lng: 0,
    });

    const { id } = useParams();

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchItem();
    }, [id]);

    const fetchItem = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_BASE_URI}/event/${id}`);
            setLocation(parseLatLng(res.data.event.location))
            setItem(res.data.event);
            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen px-8 pt-5 md:px-44  mb-24">
            {loading ? (
                <div className="flex justify-center items-center mt-32">
                    <img src={loadinganimation} alt="loading" />
                </div>
            ) : item ? (
                <div className="min-h-[60px]">
                    <div>
                        <div className="flex flex-col w-full">
                            <div>
                                <h1 className="text-2xl md:text-3xl text-black mb-5 font-medium w-fit">
                                    {item.title}
                                </h1>
                                <div className="">
                                    <PlaceGallery itemId={item._id} photos={item.images} />
                                </div>
                            </div>
                            <div className="mt-10 gap-10 relative flex md:flex-row flex-col">
                                <div className="md:w-2/3 w-full">
                                    <Content content={item.description} item={item} />
                                    <div className="flex md:flex-row mt-10 flex-col gap-5 justify-around items-center ">
                                        <Calendar
                                            mode="single"
                                            selected={item.eventDate}
                                            disabled
                                            className="rounded-md border text-black"
                                        />
                                    </div>
                                </div>
                                <div className="h-fit sticky top-44 md:w-1/3 w-full">
                                    <Booking item={item} />
                                </div>
                            </div>

                        </div>
                        <div className="w-full mt-10">
                            <p className="text-2xl font-semibold">Where you'll be</p>
                            <ItemMap
                                lat={location.lat}
                                lng={location.lng}
                            />
                        </div>

                    </div>
                </div>
            ) : (
                <>
                    <p>Item not found</p>
                </>
            )}
        </div>
    );
};

export default EventDetails;