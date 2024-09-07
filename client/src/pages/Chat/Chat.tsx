import { useEffect, useState } from 'react';

const users = [
    {
        id: 1,
        name: 'John Doe',
        messages: [
            { from: 'John Doe', text: 'Hey! How are you?' },
            { from: 'You', text: 'I am good, thanks!' }
        ]
    },
    {
        id: 2,
        name: 'Jane Smith',
        messages: [
            { from: 'Jane Smith', text: 'Can we meet tomorrow?' },
            { from: 'You', text: 'Sure! What time?' }
        ]
    }
];

const Chat = () => {
    const [selectedUser, setSelectedUser] = useState(users[0]);
    const [newMessage, setNewMessage] = useState('');

    const handleUserSelect = (user: any) => {
        setSelectedUser(user);
    };

    const handleSendMessage = () => {
        if (newMessage.trim()) {
            setSelectedUser((prevUser) => ({
                ...prevUser,
                messages: [...prevUser.messages, { from: 'You', text: newMessage }]
            }));
            setNewMessage('');
        }
    };

    const handleKeyPress = (e: any) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    };
    return (
        <div className="flex">
            {/* Sidebar */}
            <div className="w-1/5 bg-white text-black border-r p-4">
                <h2 className="text-xl font-bold mb-4">Your chats</h2>
                <ul className='gap-1 flex flex-col'>
                    {users.map((user) => (
                        <li
                            key={user.id}
                            onClick={() => handleUserSelect(user)}
                            className={`p-2 cursor-pointer ${selectedUser.id === user.id ? 'bg-gray-200 rounded-md' : 'hover:bg-gray-100 rounded-md'}`}
                        >
                            {user.name}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Chat section */}
            <div className="flex-1 bg-gray-100 flex h-[78vh] overflow-hidden flex-col">
                {/* Chat Header */}
                <div className="bg-gray-100 p-4">
                    <h2 className="text-xl font-medium">{selectedUser.name}</h2>
                </div>

                {/* Messages */}
                <div className="flex-grow p-4 bg-white overflow-y-auto">
                    {selectedUser.messages.map((message, index) => (
                        <div key={index} className={`mb-4 flex flex-col gap-1 ${message.from === 'You' ? 'text-right' : 'text-left'}`}>
                            <span className="block font-medium">{message.from}:</span>
                            <span className={`bg-gray-200 px-3 py-1 rounded-full w-fit ${message.from === 'You' ? 'self-end' : ''}`}>{message.text}</span>
                        </div>
                    ))}
                </div>

                {/* Message Input */}
                <div className="p-4 bg-white border-t border-gray-300 flex">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type a message"
                        className="flex-grow px-4 py-2 border border-gray-300 rounded-lg mr-2"
                    />
                    <button
                        onClick={handleSendMessage}
                        className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all"
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Chat;
