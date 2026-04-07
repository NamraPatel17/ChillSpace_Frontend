import { useState, useEffect, useRef } from "react";
import { Search, Send, ChevronLeft } from "lucide-react";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import axios from "axios";

export default function HostMessages() {
  const [conversations, setConversations] = useState([]);
  const [selectedId, setSelectedId] = useState(null);   // other user's id
  const [selectedConv, setSelectedConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [search, setSearch] = useState("");
  const [showThreadOnMobile, setShowThreadOnMobile] = useState(false);
  const [loadingConvs, setLoadingConvs] = useState(true);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const messagesEndRef = useRef(null);

  const myId = localStorage.getItem("userId") || sessionStorage.getItem("userId");
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  // ── Load conversation list ──────────────────────────────────────────────
  useEffect(() => {
    const fetch = async () => {
      try {
        // API returns: [{ id, host, property, lastMessage, timestamp, unread, avatar }]
        const res = await axios.get("/messages/conversations/all", { headers });
        setConversations(res.data || []);
        if (res.data?.length > 0) {
          setSelectedId(res.data[0].id);
          setSelectedConv(res.data[0]);
        }
      } catch (err) {

      } finally {
        setLoadingConvs(false);
      }
    };
    fetch();
  }, []);

  // ── Load messages when a conversation is selected ───────────────────────
  useEffect(() => {
    if (!selectedId) return;
    const fetch = async () => {
      setLoadingMsgs(true);
      try {
        // API returns Message documents with senderId populated
        const res = await axios.get(`/messages/${selectedId}`, { headers });
        setMessages(res.data || []);
      } catch (err) {

      } finally {
        setLoadingMsgs(false);
      }
    };
    fetch();
  }, [selectedId]);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSelect = (conv) => {
    setSelectedId(conv.id);
    setSelectedConv(conv);
    setShowThreadOnMobile(true);
  };

  const handleSend = async () => {
    const text = messageText.trim();
    if (!text || !selectedId) return;
    setMessageText("");
    try {
      // API expects: { receiverId, content }
      const res = await axios.post("/messages", { receiverId: selectedId, content: text }, { headers });
      // Append the saved message
      setMessages(prev => [...prev, res.data.data || res.data]);
    } catch (err) {

    }
  };

  const getInitials = (name) => {
    if (!name || name === "Guest") return "?";
    return name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();
  };

  const filtered = conversations.filter(c =>
    !search || c.host?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Messages</h1>
        <p className="mt-1 text-sm text-gray-600">Communicate with your guests</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden h-[calc(100vh-200px)]">
        <div className="flex h-full">

          {/* ── Sidebar ────────────────────────────────────────────────────── */}
          <div className={`${showThreadOnMobile ? 'hidden md:flex' : 'flex'} w-full md:w-80 border-r border-gray-200 flex flex-col h-full bg-white`}>
            <div className="p-4 border-b border-gray-200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Search conversations..."
                  className="pl-10"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {loadingConvs ? (
                <div className="p-4 text-sm text-gray-400">Loading...</div>
              ) : filtered.length === 0 ? (
                <div className="p-4 text-sm text-gray-400">No conversations yet.</div>
              ) : filtered.map(conv => (
                <div
                  key={conv.id}
                  onClick={() => handleSelect(conv)}
                  className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                    selectedId === conv.id ? "bg-indigo-50 border-l-4 border-l-indigo-600" : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-11 h-11 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                      {conv.profilePicture ? (
                        <img src={conv.profilePicture} alt={conv.host} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-sm font-semibold text-gray-700">{conv.avatar || getInitials(conv.host)}</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-gray-900 truncate">{conv.host || "Guest"}</p>
                        {conv.unread > 0 && (
                          <span className="ml-2 bg-indigo-600 text-white text-xs font-medium px-2 py-0.5 rounded-full">
                            {conv.unread}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 truncate mt-0.5">{conv.property}</p>
                      <p className="text-xs text-gray-400 truncate mt-0.5">{conv.lastMessage}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Thread ─────────────────────────────────────────────────────── */}
          <div className={`${showThreadOnMobile ? 'flex' : 'hidden md:flex'} flex-1 flex flex-col`}>
            {!selectedId ? (
              <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
                Select a conversation to start messaging
              </div>
            ) : (
              <>
                {/* Header */}
                <div className="p-4 border-b border-gray-200 bg-white">
                  <div className="flex items-center gap-3">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="md:hidden mr-1"
                      onClick={() => setShowThreadOnMobile(false)}
                    >
                      <ChevronLeft className="h-5 w-5 text-gray-400" />
                    </Button>
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                      {selectedConv?.profilePicture ? (
                        <img src={selectedConv.profilePicture} alt={selectedConv?.host} className="w-full h-full object-cover" />
                      ) : (
                        <span className="font-semibold text-gray-700 text-sm">
                          {selectedConv?.avatar || getInitials(selectedConv?.host)}
                        </span>
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{selectedConv?.host || "Guest"}</h3>
                      <p className="text-xs text-gray-500">{selectedConv?.property}</p>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
                  {loadingMsgs ? (
                    <div className="text-center text-gray-400 text-sm pt-10">Loading...</div>
                  ) : messages.length === 0 ? (
                    <div className="text-center text-gray-400 text-sm pt-10">No messages yet. Say hi! 👋</div>
                  ) : messages.map((msg, i) => {
                    // senderId may be a populated object or a raw id string
                    const senderId = typeof msg.senderId === "object" ? msg.senderId?._id : msg.senderId;
                    const isMe = String(senderId) === String(myId);
                    return (
                      <div key={msg._id || i} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-sm px-4 py-2 rounded-2xl text-sm ${
                          isMe
                            ? "bg-indigo-600 text-white rounded-br-sm"
                            : "bg-white text-gray-900 border border-gray-200 rounded-bl-sm"
                        }`}>
                          <p>{msg.content}</p>
                          <p className={`text-xs mt-1 ${isMe ? "text-indigo-200" : "text-gray-400"}`}>
                            {msg.createdAt
                              ? new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                              : ""}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 border-t border-gray-200 bg-white">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Type your message..."
                      value={messageText}
                      onChange={e => setMessageText(e.target.value)}
                      onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                      className="flex-1"
                    />
                    <Button onClick={handleSend} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
