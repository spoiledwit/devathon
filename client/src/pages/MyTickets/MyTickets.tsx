import { Ticket } from "@/types";
import axios from "axios";
import { useEffect, useState } from "react";
import TicketCard from "./TicketCard";

const MyTickets = () => {

    const [tickets, setTickets] = useState<Ticket[]>([])
    const [loading, setLoading] = useState(false)

    const fetchTickets = async () => {
        try {
            setLoading(true)
            const res = await axios.get(`${import.meta.env.VITE_BASE_URI}/ticket/user`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            console.log(res.data);
            setTickets(res.data.tickets)
        }
        catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchTickets()
    }, [])


    return (
        <div>
            <div className="min-h-screen  flex flex-col items-center py-8">
                <h1 className="text-3xl font-medium mb-8">My Tickets</h1>

                <div className="grid grid-cols-1 gap-6  w-full px-44">
                    {loading ?
                        <div className="grid grid-cols-1 gap-3">
                            {
                                Array.from({ length: 3 }).map((_, i) => (
                                    <div key={i} className="bg-white shadow-md rounded-lg w-full overflow-hidden  mx-auto">
                                        <div className="animate-pulse bg-gray-200 h-48"></div>
                                        <div className="p-4">
                                            <div className="animate-pulse bg-gray-200 h-4 w-1/2 mb-2"></div>
                                            <div className="animate-pulse bg-gray-200 h-4 w-1/2 mb-2"></div>
                                            <div className="animate-pulse bg-gray-200 h-4 w-1/2 mb-2"></div>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                        :

                        tickets && tickets.length > 0 ? tickets.map((ticket) => (
                            <TicketCard key={ticket._id} ticket={ticket} />
                        ))
                            :
                            <h1 className="text-xl font-semibold text-gray-800">No tickets found</h1>
                    }
                </div>
            </div>
        </div>
    )
}

export default MyTickets