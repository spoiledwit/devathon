import EventCard from '@/components/Events/EventCard/EventCard'
import { Event } from '@/types'
import { Link } from 'react-router-dom'

const Events = ({ events }: { events: Event[] }) => {
    return (
        <div>
            <h1 className="font-medium text-3xl text-black mb-1">
                Events
            </h1>
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
        </div>
    )
}

export default Events