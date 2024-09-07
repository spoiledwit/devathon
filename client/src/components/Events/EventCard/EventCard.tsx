import { toReadableDate } from "@/lib/utils";
import { Calendar, MapPin} from "lucide-react";

interface EventProps {
    coverImage: string;
    title: string;
    date: string;
    location: string;
    description: string;
}
const EventCard = ({ coverImage, title, date, location, description }: EventProps) => {
    return (
        <div className='flex flex-col gap-2 '>
            <img src={coverImage} className="rounded-md aspect-[16/9] object-cover" />
            <div className="flex flex-col text-lg">
                <p className="font-semibold">{title}</p>
                <p className="font-normal opacity-80 text-sm">{description.substring(0,70)}...</p>
            </div>
            <div className="flex flex-row font-medium text-gray-800 text-sm justify-between">
                <p className="flex flex-row items-center gap-1">
                    <MapPin size={16} />
                    {location.substring(0,50)}</p>
                <p className="flex flex-row  items-center gap-1">
                    <Calendar size={16} />
                    {toReadableDate(date)}
                </p>
            </div>

        </div>
    )
}

export default EventCard