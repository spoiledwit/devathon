import React, { useEffect, useState, useRef } from "react";
import { Send, Image as ImageIcon, X, User, Phone, Video } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import useSocketStore from "@/store/socketStore";
import moment from "moment";
import useAuthStore from "@/store/authStore";
import PhotosUploader from "@/components/ImageUploader";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  _id: string;
  sender: string;
  content: {
    contentType: "text" | "image";
    text?: string;
    image?: string;
  };
  createdAt: string;
}

interface Conversation {
  _id: string;
  members: Array<{
    _id: string;
    name: string;
    email: string;
  }>;
}

const Chat: React.FC = () => {
  const { user } = useAuthStore();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isOnline, setIsOnline] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [showImageUploader, setShowImageUploader] = useState(false);
  const chatRef = useRef<any>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { socket } = useSocketStore();

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation._id);
    }
  }, [selectedConversation]);

  useEffect(() => {
    if (chatRef?.current) {
      chatRef.current.scrollTo({
        top: chatRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URI}/conversation/my`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setConversations(response.data);
      setLoading(false);
    } catch (error) {
      toast.error("Failed to fetch conversations");
      setLoading(false);
    }
  };

  const fetchMessages = async (conversationId: string) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${
          import.meta.env.VITE_BASE_URI
        }/conversation/${conversationId}/messages`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setMessages(response.data);
      setLoading(false);
    } catch (error) {
      toast.error("Failed to fetch messages");
      setLoading(false);
    }
  };

  const handleConversationSelect = (conversation: Conversation) => {
    setSelectedConversation(conversation);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() && images.length === 0) {
      return toast.error("Please enter a message or select images");
    }
    setSending(true);
    try {
      for (const image of images) {
        await sendSingleMessage(image, "image");
      }
      if (newMessage.trim()) {
        await sendSingleMessage(newMessage, "text");
      }
      setNewMessage("");
      setImages([]);
    } catch (error) {
      toast.error("Failed to send message");
    } finally {
      setSending(false);
    }
  };

  const sendSingleMessage = async (content: string, type: "text" | "image") => {
    if (!selectedConversation) return;
    const messageData = {
      conversationId: selectedConversation._id,
      to: selectedConversation.members.find(
        (member) => member._id !== user?._id
      )?._id,
      text: type === "text" ? content : "",
      sender: user?._id,
      contentType: type,
      image: type === "image" ? content : null,
    };

    socket.emit("send_message", messageData);

    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URI}/conversation/${
        selectedConversation._id
      }`,
      messageData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    setMessages((prev) => [...prev, response.data]);
  };

  const handleTyping = (value: string) => {
    setNewMessage(value);
    if (selectedConversation) {
      socket.emit("user_typing", {
        userId: user?._id,
        conversationId: selectedConversation._id,
        isTyping: true,
        to: selectedConversation.members.find(
          (member) => member._id !== user?._id
        )?._id,
      });
    }
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(() => {
      if (selectedConversation) {
        socket.emit("user_typing", {
          userId: user?._id,
          conversationId: selectedConversation._id,
          isTyping: false,
          to: selectedConversation.members.find(
            (member) => member._id !== user?._id
          )?._id,
        });
      }
    }, 1000);
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  useEffect(() => {
    if (selectedConversation) {
      const otherUserId = selectedConversation.members.find(
        (member) => member._id !== user?._id
      )?._id;
      if (otherUserId) {
        socket.emit("subscribe_to_user", otherUserId);

        const handleReceiveMessage = (newMessage: Message) => {
          if (selectedConversation._id === newMessage.conversationId) {
            setMessages((prev) => [...prev, newMessage]);
          }
        };

        const handleUserTyping = (data: {
          isTyping: boolean;
          conversationId: string;
        }) => {
          if (data.conversationId === selectedConversation._id) {
            setIsTyping(data.isTyping);
          }
        };

        const handleUserStatus = (data: {
          userId: string;
          isOnline: boolean;
        }) => {
          if (data.userId === otherUserId) {
            setIsOnline(data.isOnline);
          }
        };

        socket.on("receive_message", handleReceiveMessage);
        socket.on("user_typing", handleUserTyping);
        socket.on("user_status", handleUserStatus);

        return () => {
          socket.off("receive_message", handleReceiveMessage);
          socket.off("user_typing", handleUserTyping);
          socket.off("user_status", handleUserStatus);
        };
      }
    }
  }, [selectedConversation, user]);

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );

  return (
    <div className="flex overflow-hidden max-h-[95vh] bg-gray-50">
      {/* Sidebar */}
      <div className="w-1/4 bg-white shadow-md overflow-y-auto">
        <div className="p-4 border-b">
          <h2 className="text-2xl font-semibold text-gray-800">
            Conversations
          </h2>
        </div>
        <ul className="divide-y divide-gray-200">
          {conversations.map((conversation) => (
            <li
              key={conversation._id}
              onClick={() => handleConversationSelect(conversation)}
              className={`p-4 cursor-pointer transition-colors duration-150 ${
                selectedConversation?._id === conversation._id
                  ? "bg-blue-50"
                  : "hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <User className="h-10 w-10 text-gray-400 bg-gray-200 rounded-full p-2" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {
                      conversation.members.find(
                        (member) => member._id !== user?._id
                      )?.name
                    }
                  </p>
                  <p className="text-sm text-gray-500 truncate">
                    {
                      conversation.members.find(
                        (member) => member._id !== user?._id
                      )?.email
                    }
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-white">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="bg-white p-4 border-b flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <User className="h-10 w-10 text-gray-400 bg-gray-200 rounded-full p-2" />
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">
                    {
                      selectedConversation.members.find(
                        (member) => member._id !== user?._id
                      )?.name
                    }
                  </h2>
                  <div className="flex items-center space-x-2">
                    {isOnline && (
                      <span className="flex items-center text-green-500 text-sm">
                        <span className="h-2 w-2 bg-green-500 rounded-full mr-1"></span>
                        Online
                      </span>
                    )}
                    {isTyping && (
                      <span className="text-gray-500 text-sm">Typing...</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                <button className="p-2 text-gray-500 hover:text-gray-700 transition-colors duration-150">
                  <Phone className="h-5 w-5" />
                </button>
                <button className="p-2 text-gray-500 hover:text-gray-700 transition-colors duration-150">
                  <Video className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div
              className="px-16 max-h-[60vh] pb-20 overflow-auto"
              ref={chatRef}
            >
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${
                    message.sender === user?._id
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-lg shadow ${
                      message.sender === user?._id
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {message.content.image && (
                      <img
                        src={message.content.image}
                        alt="Sent image"
                        className="mb-2 rounded-lg"
                      />
                    )}
                    <p>{message.content.text}</p>
                    <p className="text-xs mt-1 opacity-70">
                      {moment(message.createdAt).format("hh:mm A")}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Message Input */}
            <div className="bg-white p-4 border-t absolute bottom-0 w-[70vw]">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => handleTyping(e.target.value)}
                  placeholder="Type a message"
                  className="flex-1 p-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={() => setShowImageUploader(true)}
                  className="p-2 text-gray-500 hover:text-gray-700 transition-colors duration-150"
                >
                  <ImageIcon className="h-6 w-6" />
                </button>
                <button
                  onClick={handleSendMessage}
                  disabled={sending}
                  className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-150"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
              <AnimatePresence>
                {images.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="flex mt-2 space-x-2 overflow-x-auto py-2"
                  >
                    {images.map((img, index) => (
                      <div key={index} className="relative flex-shrink-0">
                        <img
                          src={img}
                          alt={`preview ${index}`}
                          className="h-20 w-20 object-cover rounded-lg"
                        />
                        <button
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Image Uploader Modal */}
            {showImageUploader && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-lg w-96">
                  <h3 className="text-lg font-semibold mb-4">Upload Images</h3>
                  <PhotosUploader
                    addedPhotos={images}
                    onChange={setImages}
                    maxPhotos={5}
                  />
                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={() => setShowImageUploader(false)}
                      className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md mr-2 hover:bg-gray-300 transition-colors duration-150"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => setShowImageUploader(false)}
                      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-150"
                    >
                      Done
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <p className="text-gray-500 text-lg">
              Select a conversation to start chatting
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
