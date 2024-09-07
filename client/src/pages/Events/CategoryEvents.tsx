import EventCard from '@/components/Events/EventCard/EventCard'
import { capitalizeFirstLetter } from '@/lib/utils';
import { Event } from '@/types'
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom'

const CategoryEvents = () => {
    // get category from params
    const { categoryName } = useParams();
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const fetchEvents = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${import.meta.env.VITE_BASE_URI}/event/category/${categoryName}`);
            console.log("these are the cates : ", res.data);
            setEvents(res.data.events);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchEvents();
    }, [categoryName])


    return (
        <div className='px-44'>
            <h1 className="font-medium text-3xl text-black mb-1">
                {capitalizeFirstLetter(categoryName?.replace(/-/g, ' '))}
            </h1>

            {loading ? (
                <div className="animate-pulse gap-5 grid grid-cols-4">
                    {
                        Array.from({ length: 5 }).map((_, i) => (
                            <div className="flex flex-col gap-2" key={i}>
                                <div className="h-44 rounded-md bg-gray-200" ></div>
                                <div className="h-5 rounded-md bg-gray-200" ></div>
                            </div>
                        ))
                    }
                </div>
            )
                :
                <div className="grid grid-cols-4 gap-y-12 mt-10 gap-7">
                    {
                        events.map((event, i) => (
                            <Link to={`/event/${event._id}`} key={i}>
                                <EventCard
                                    key={i}
                                    coverImage={event.images[0]}
                                    title={event.title}
                                    date={event.eventDate.toString()}
                                    location={event.region}
                                    description={event.description}
                                />
                            </Link>
                        ))
                    }
                </div>
            }
        </div>
    )
}

export default CategoryEvents