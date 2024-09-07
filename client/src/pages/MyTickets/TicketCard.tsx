import TicketPdf from "@/components/TicketPdf/TicketPdf";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { parseLatLng, toReadableDate } from "@/lib/utils"
import { Ticket } from "@/types"
import {
    PDFDownloadLink,
} from "@react-pdf/renderer";
import { EllipsisVertical } from "lucide-react"
import { useState } from "react";
import ShowMap from "./ShowMap";

const TicketCard = ({ ticket }: { ticket: Ticket }) => {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);
    const location = parseLatLng(ticket.eventId.location);
    const lat = location.lat.toString();
    const lng = location.lng.toString();

    return (
        <div
            className="bg-white shadow-md rounded-lg w-full overflow-hidden mx-auto"
        >
            <img
                className="w-full h-48 object-cover"
                src={ticket.eventId.images[0]}
                alt={ticket.eventId.title}
            />
            <div className="flex flex-row justify-between">
                <div className="p-4">
                    <h2 className="text-xl font-semibold text-gray-800">{ticket.eventId.title}</h2>
                    <p className="text-gray-600 my-2">{ticket.eventId.description.substring(0, 100)}</p>
                    <p className="text-sm text-gray-700 font-semibold">Event date: {toReadableDate(ticket.eventId.eventDate)}</p>
                </div>
                <div className="p-5 flex items-center justify-center">
                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <EllipsisVertical size={24} />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem
                            >
                                <PDFDownloadLink document={<TicketPdf ticket={ticket} />} fileName="ticket.pdf">
                                    {({ blob, url, loading, error }) => (loading ? 'Loading document...' : 'Download PDF')}
                                </PDFDownloadLink>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={handleOpenModal}>See Location</DropdownMenuItem>
                            <DropdownMenuItem>Copy Coordinates</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
            <ShowMap lat={lat} lng={lng} isOpen={isModalOpen} onClose={handleCloseModal} />

        </div>
    )
}

export default TicketCard