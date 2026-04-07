import { useState, useEffect } from "react";
import { Send, Search, ChevronLeft } from "lucide-react";
import { Avatar, AvatarFallback } from "../../components/ui/avatar";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { ScrollArea } from "../../components/ui/scroll-area";
import { useLocation } from "react-router-dom";
import axios from "axios";

export default function GuestMessages() {
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messageText, setMessageText] = useState("");
  const [showThreadOnMobile, setShowThreadOnMobile] = useState(false);
  
  const loggedInUserId = localStorage.getItem("userId") || sessionStorage.getItem("userId");
  const location = useLocation();

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      const res = await axios.get("/messages/conversations/all", {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      let convs = res.data;
      
      // Auto-open specific host injected via router state
      const stateHostId = location.state?.hostId;
      if (stateHostId) {
        const existing = convs.find(c => c.id === stateHostId);
        if (existing) {
           setConversations(convs);
           handleSelectConversation(existing);
        } else {
           // Emulate a new unmessaged blank thread
           const tempConv = {
              id: stateHostId,
              host: location.state?.hostName || "Host",
              property: "New Inquiry",
              lastMessage: "Start a conversation",
              timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
              unread: 0,
              avatar: (location.state?.hostName || "H").substring(0, 2).toUpperCase()
           };
           convs = [tempConv, ...convs];
           setConversations(convs);
           handleSelectConversation(tempConv);
        }
      } else {
        setConversations(convs);
        if (convs.length > 0 && !selectedConversation) {
          handleSelectConversation(convs[0]);
        }
      }
    } catch(err) {

    }
  }

  const fetchThread = async (userId) => {
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      const res = await axios.get(`/messages/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const mapped = res.data.map(m => ({
        id: m._id,
        sender: m.senderId._id?.toString() === loggedInUserId ? "guest" : "host",
        text: m.content,
        timestamp: new Date(m.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
      }));
      setMessages(mapped);
    } catch(err) {

    }
  }
  
  const handleSelectConversation = (conv) => {
      setSelectedConversation(conv);
      setShowThreadOnMobile(true);
      fetchThread(conv.id);
  }

  const handleSendMessage = async () => {
    if (!messageText.trim() || !selectedConversation) return;
    try {
       const token = localStorage.getItem("token") || sessionStorage.getItem("token");
       await axios.post("/messages", {
          receiverId: selectedConversation.id,
          content: messageText
       }, {
         headers: { Authorization: `Bearer ${token}` }
       });
       setMessageText("");
       fetchThread(selectedConversation.id);
       fetchConversations();
    } catch(err) {

    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 h-[calc(100vh-80px)]">
      <div className="mb-4">
        <h1 className="text-3xl font-semibold text-gray-900">Messages</h1>
        <p className="mt-1 text-gray-600">
          Chat with hosts about your bookings
        </p>
      </div>

      <Card className="h-[calc(100%-80px)] shadow-lg overflow-hidden border border-gray-200">
        <CardContent className="p-0 h-full">
          <div className="flex h-full">
            {/* Conversations List */}
            <div className={`${showThreadOnMobile ? 'hidden md:flex' : 'flex'} w-full md:w-96 border-r border-gray-200 flex flex-col h-full bg-white`}>
              <div className="p-4 border-b border-gray-100">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search conversations..."
                    className="pl-10"
                  />
                </div>
              </div>
              <ScrollArea className="flex-1 overflow-y-auto">
                {conversations.length === 0 ? (
                    <div className="p-8 text-center text-gray-400 text-sm">No active conversations found. <br/> Your inbox is empty.</div>
                ) : conversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    onClick={() => handleSelectConversation(conversation)}
                    className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                      selectedConversation?.id === conversation.id
                        ? "bg-gray-100"
                        : ""
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-11 h-11 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                        {conversation.profilePicture ? (
                          <img src={conversation.profilePicture} alt={conversation.host} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-sm font-semibold text-gray-700">{conversation.avatar}</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-1">
                          <h3 className="font-medium text-gray-900 truncate">
                            {conversation.host}
                          </h3>
                          <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                            {conversation.timestamp.split(',')[0]}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-1 truncate">
                          {conversation.property}
                        </p>
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-gray-500 truncate flex-1">
                            {conversation.lastMessage}
                          </p>
                          {conversation.unread > 0 && (
                            <span className="ml-2 bg-gray-900 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center flex-shrink-0">
                              {conversation.unread}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </ScrollArea>
            </div>

            {/* Message Thread */}
            {selectedConversation ? (
                <div className={`${showThreadOnMobile ? 'flex' : 'hidden md:flex'} flex-col flex-1 h-full bg-gray-50`}>
                  {/* Header */}
                  <div className="p-4 border-b border-gray-100 bg-white flex items-center justify-between shadow-sm z-10">
                    <div className="flex items-center gap-3">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="md:hidden mr-1"
                        onClick={() => setShowThreadOnMobile(false)}
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </Button>
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                        {selectedConversation.profilePicture ? (
                          <img src={selectedConversation.profilePicture} alt={selectedConversation.host} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-sm font-semibold text-gray-700">{selectedConversation.avatar}</span>
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {selectedConversation.host}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {selectedConversation.property}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Messages Content Layer */}
                  <ScrollArea className="flex-1 p-4 overflow-y-auto">
                    <div className="space-y-4">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${
                            message.sender === "guest"
                              ? "justify-end"
                              : "justify-start"
                          }`}
                        >
                          <div
                            className={`max-w-[70%] ${
                              message.sender === "guest"
                                ? "bg-gray-900 text-white shadow-md rounded-tl-xl rounded-tr-xl rounded-bl-xl"
                                : "bg-white text-gray-900 border border-gray-200 shadow-sm rounded-tr-xl rounded-br-xl rounded-bl-xl"
                            } px-4 py-2.5`}
                          >
                            <p className="text-[15px]">{message.text}</p>
                            <span
                              className={`text-xs mt-1 block pr-1 ${
                                message.sender === "guest"
                                  ? "text-right text-gray-300"
                                  : "text-left text-gray-500"
                              }`}
                            >
                              {message.timestamp}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>

                  {/* Input Floor */}
                  <div className="p-4 border-t border-gray-200 bg-white">
                    <div className="flex items-center gap-2">
                      <Input
                        placeholder="Type a message..."
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            handleSendMessage();
                          }
                        }}
                        className="flex-1 rounded-full px-4 border-gray-300 focus-visible:ring-gray-900 bg-gray-50 h-11"
                      />
                      <Button onClick={handleSendMessage} className="rounded-full bg-gray-900 hover:bg-black w-11 h-11 p-0 flex items-center justify-center shrink-0 shadow-md">
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
            ) : (
                <div className="hidden md:flex flex-col flex-1 items-center justify-center h-full bg-gray-50/50 text-gray-400">
                    <h2 className="text-xl font-semibold text-gray-400">Your Inbox</h2>
                    <p className="mt-2 text-sm text-gray-400">Select a conversation to reveal the thread</p>
                </div>
            )}
            
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
