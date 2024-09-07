import axios from "axios";
import { useEffect, useState } from "react";

const MyTickets = () => {
    const ticketsDumb = [
        {
            id: 1,
            title: 'Concert Ticket',
            description: 'Live concert with your favorite artist',
            boughtDate: '2024-08-30',
            imageUrl: 'https://via.placeholder.com/150',
        },
        {
            id: 2,
            title: 'Movie Premiere',
            description: 'Exclusive movie premiere event',
            boughtDate: '2024-07-15',
            imageUrl: 'https://via.placeholder.com/150',
        },
        {
            id: 3,
            title: 'Theater Play',
            description: 'Watch a classic theater play live',
            boughtDate: '2024-09-01',
            imageUrl: 'https://via.placeholder.com/150',
        },
    ];

    const [tickets, setTickets] = useState([])
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
            // setTickets(data)
            setLoading(false)
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
            <div className="min-h-screen bg-gray-100 flex flex-col items-center py-8">
                <h1 className="text-3xl font-bold mb-8">My Tickets</h1>

                <div className="grid grid-cols-1 gap-6 border border-red-500 w-full px-44">
                    {ticketsDumb.map((ticket) => (
                        <div
                            key={ticket.id}
                            className="bg-white shadow-md rounded-lg w-full overflow-hidden border border-red-500 mx-auto"
                        >
                            <img
                                className="w-full h-48 object-cover"
                                src={ticket.imageUrl}
                                alt={ticket.title}
                            />
                            <div className="p-4">
                                <h2 className="text-xl font-semibold text-gray-800">{ticket.title}</h2>
                                <p className="text-gray-600 my-2">{ticket.description}</p>
                                <p className="text-sm text-gray-500">Bought on: {ticket.boughtDate}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default MyTickets