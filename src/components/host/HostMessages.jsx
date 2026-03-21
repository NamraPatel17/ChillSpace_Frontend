import { useState } from "react";
import { Search, Send, Paperclip, MoreVertical } from "lucide-react";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";

export default function HostMessages() {
  const [selectedConversation, setSelectedConversation] = useState(1);
  const [messageText, setMessageText] = useState("");

  const conversations = [
    {
      id: 1,
      guest: "Sarah Johnson",
      property: "Luxury Beach Villa",
      lastMessage: "Thank you! Looking forward to our stay.",
      time: "2h ago",
      unread: 0,
      avatar: "SJ",
    },
    {
      id: 2,
      guest: "Michael Chen",
      property: "Mountain Cabin Retreat",
      lastMessage: "Is early check-in available?",
      time: "4h ago",
      unread: 2,
      avatar: "MC",
    },
    {
      id: 3,
      guest: "Emily Davis",
      property: "Downtown Loft",
      lastMessage: "Thanks for the quick response!",
      time: "1d ago",
      unread: 0,
      avatar: "ED",
    },
    {
      id: 4,
      guest: "David Wilson",
      property: "Luxury Beach Villa",
      lastMessage: "Can we bring our pet?",
      time: "2d ago",
      unread: 1,
      avatar: "DW",
    },
  ];

  const messages = [
    {
      id: 1,
      sender: "guest",
      text: "Hi! I'm interested in booking your beach villa for next week. Is it available?",
      time: "10:30 AM",
    },
    {
      id: 2,
      sender: "host",
      text: "Hello Sarah! Yes, the villa is available for those dates. Would you like to proceed with the booking?",
      time: "10:35 AM",
    },
    {
      id: 3,
      sender: "guest",
      text: "Great! Also, does the property have parking?",
      time: "10:40 AM",
    },
    {
      id: 4,
      sender: "host",
      text: "Yes, we have private parking for up to 2 vehicles. The villa also has a beautiful ocean view and is just steps from the beach.",
      time: "10:42 AM",
    },
    {
      id: 5,
      sender: "guest",
      text: "Perfect! I'll go ahead and book it now.",
      time: "10:45 AM",
    },
    {
      id: 6,
      sender: "host",
      text: "Wonderful! I've sent you the check-in details. Feel free to reach out if you have any questions before your arrival.",
      time: "10:50 AM",
    },
    {
      id: 7,
      sender: "guest",
      text: "Thank you! Looking forward to our stay.",
      time: "11:00 AM",
    },
  ];

  const handleSendMessage = () => {
    if (messageText.trim()) {
      console.log("Sending message:", messageText);
      setMessageText("");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Messages</h1>
        <p className="mt-1 text-sm text-gray-600">
          Communicate with your guests
        </p>
      </div>

      {/* Messages Container */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden h-[calc(100vh-200px)]">
        <div className="flex h-full">
          {/* Conversations List */}
          <div className="w-80 border-r border-gray-200 flex flex-col">
            {/* Search */}
            <div className="p-4 border-b border-gray-200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search conversations..."
                  className="pl-10"
                />
              </div>
            </div>

            {/* Conversations */}
            <div className="flex-1 overflow-y-auto">
              {conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  onClick={() => setSelectedConversation(conversation.id)}
                  className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 ${
                    selectedConversation === conversation.id
                      ? "bg-gray-50 border-l-4 border-l-gray-900"
                      : ""
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                        <span className="font-semibold text-gray-900">
                          {conversation.avatar}
                        </span>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-gray-900 truncate">
                          {conversation.guest}
                        </p>
                        {conversation.unread > 0 && (
                          <span className="ml-2 bg-gray-900 text-white text-xs font-medium px-2 py-1 rounded-full">
                            {conversation.unread}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 truncate mt-1">
                        {conversation.property}
                      </p>
                      <p className="text-sm text-gray-500 truncate mt-1">
                        {conversation.lastMessage}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {conversation.time}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Message Thread */}
          <div className="flex-1 flex flex-col">
            {/* Thread Header */}
            <div className="p-4 border-b border-gray-200 bg-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <span className="font-semibold text-gray-900">SJ</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      Sarah Johnson
                    </h3>
                    <p className="text-sm text-gray-600">Luxury Beach Villa</p>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-gray-600">
                  <MoreVertical className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender === "host" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-md px-4 py-2 rounded-lg ${
                      message.sender === "host"
                        ? "bg-gray-900 text-white"
                        : "bg-white text-gray-900 border border-gray-200"
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <p
                      className={`text-xs mt-1 ${
                        message.sender === "host"
                          ? "text-gray-100"
                          : "text-gray-500"
                      }`}
                    >
                      {message.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200 bg-white">
              <div className="flex items-end space-x-2">
                <button className="p-2 text-gray-400 hover:text-gray-600">
                  <Paperclip className="h-5 w-5" />
                </button>
                <div className="flex-1">
                  <Input
                    type="text"
                    placeholder="Type your message..."
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        handleSendMessage();
                      }
                    }}
                    className="resize-none"
                  />
                </div>
                <Button
                  onClick={handleSendMessage}
                  className="inline-flex items-center"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Send
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
