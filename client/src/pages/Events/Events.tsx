import EventCard from '@/components/Events/EventCard/EventCard'

const Events = () => {
    return (
        <div>
            <h1 className="font-medium text-3xl text-black mb-1">
                Events
            </h1>
            <div className="grid grid-cols-4 gap-y-12 mt-10 gap-7">
                {
                    Array.from({ length: 10 }).map((_, i) => (
                        <EventCard
                            key={i}
                            coverImage="https://images.unsplash.com/photo-1592853625511-ad0edcc69c07?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                            title="Event Title"
                            date="2021-10-10T10:00:00Z"
                            location="Event Location"
                            description="Event Description"
                        />
                    ))
                }
            </div>
        </div>
    )
}

export default Events