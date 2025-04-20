import { useState, useRef, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { ChatHeader } from "@/components/chat/ChatHeader";
import { CreateRoomForm } from "@/components/chat/CreateRoomForm";
import { ChatRoomList } from "@/components/chat/ChatRoomList";
import { MessageReaction } from "@/components/chat/MessageReaction";
import { TypingIndicator } from "@/components/chat/TypingIndicator";
import { MediaAttachment } from "@/components/chat/MediaAttachment";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Send, Bell, BellOff, Hash, Users } from "lucide-react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Smile, PlusCircle } from "lucide-react";

// Mock data for demo purposes
const mockUsers = [
  { id: 1, name: "Alex Chen", avatar: "https://i.pravatar.cc/150?img=1", online: true },
  { id: 2, name: "Sam Taylor", avatar: "https://i.pravatar.cc/150?img=2", online: true },
  { id: 3, name: "Jordan Lee", avatar: "https://i.pravatar.cc/150?img=3", online: false },
  { id: 4, name: "Casey Morgan", avatar: "https://i.pravatar.cc/150?img=4", online: true },
  { id: 5, name: "Riley Johnson", avatar: "https://i.pravatar.cc/150?img=5", online: false },
];

const mockRooms = [
  { id: 1, name: "General", description: "General discussion for everyone", members: 42 },
  { id: 2, name: "Stress Management", description: "Tips and support for managing stress", members: 28 },
  { id: 3, name: "Study Buddies", description: "Find study partners and share resources", members: 35 },
  { id: 4, name: "Mindfulness", description: "Discuss mindfulness and meditation practices", members: 19 },
];

const mockMessages = [
  { id: 1, userId: 2, name: "Sam Taylor", avatar: "https://i.pravatar.cc/150?img=2", text: "Hey everyone! How's your day going so far?", timestamp: "10:32 AM" },
  { id: 2, userId: 4, name: "Casey Morgan", avatar: "https://i.pravatar.cc/150?img=4", text: "Pretty good, just finished my last exam for the semester! 🎉", timestamp: "10:35 AM" },
  { id: 3, userId: 5, name: "Riley Johnson", avatar: "https://i.pravatar.cc/150?img=5", text: "Congrats Casey! I still have two more to go 😩", timestamp: "10:37 AM" },
  { id: 4, userId: 2, name: "Sam Taylor", avatar: "https://i.pravatar.cc/150?img=2", text: "You'll get through it Riley! Anyone have tips for managing exam stress?", timestamp: "10:38 AM" },
  { id: 5, userId: 1, name: "Alex Chen", avatar: "https://i.pravatar.cc/150?img=1", text: "I find taking short walks between study sessions helps a lot. Also, the breathing exercises from the meditation page are great! 💯", timestamp: "10:40 AM" },
];

const emojis = ["😊", "😂", "❤️", "👍", "🎉", "🙌", "🤔", "😩", "💯", "✨"];

interface Message {
  id: number;
  userId: number;
  name: string;
  avatar: string;
  text: string;
  timestamp: string;
}

export default function ChatRoom() {
  const [selectedRoom, setSelectedRoom] = useState<number | null>(null);
  const [activeRoom, setActiveRoom] = useState(1);
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [newMessage, setNewMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [mediaPreview, setMediaPreview] = useState<string>();
  const [isTyping, setIsTyping] = useState(false);
  const messageSound = useRef(new Audio("/sounds/message.mp3"));

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = () => {
    if (newMessage.trim() === "") return;
    
    const newMsg: Message = {
      id: messages.length + 1,
      userId: 1, // Current user (Alex)
      name: "Alex Chen",
      avatar: "https://i.pravatar.cc/150?img=1",
      text: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages([...messages, newMsg]);
    setNewMessage("");
    setShowEmojiPicker(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const addEmoji = (emoji: string) => {
    setNewMessage(newMessage + emoji);
  };

  const handleCreateRoom = (data: { topic: number; capacity: number }) => {
    toast({
      title: "Room Created",
      description: "Your chat room has been created successfully.",
    });
    // In a real app, this would interact with a backend
  };

  const handleJoinRoom = (roomId: number) => {
    setActiveRoom(roomId);
    setSelectedRoom(roomId);
    toast({
      title: "Joined Room",
      description: `You've joined ${mockRooms.find(r => r.id === roomId)?.name}`,
    });
  };

  const handleReaction = (messageId: number, reaction: string) => {
    // In a real app, this would be connected to a backend
    toast({
      title: "Reaction added",
      description: "Message reaction has been saved.",
    });
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <ChatHeader
            roomName={selectedRoom ? mockRooms.find(r => r.id === selectedRoom)?.name || "" : "Chat Rooms"}
            memberCount={mockUsers.length}
            announcement="Welcome to our supportive community! Remember to be kind and respectful. 💚"
          />

          {!selectedRoom ? (
            <div className="space-y-8">
              <CreateRoomForm onCreateRoom={handleCreateRoom} />
              <ChatRoomList rooms={mockRooms} onJoinRoom={handleJoinRoom} />
            </div>
          ) : (
            <Card className="border-zenSeafoam">
              <CardContent className="p-0">
                <div className="grid grid-cols-1 md:grid-cols-4 h-[70vh]">
                  {/* Sidebar */}
                  <div className="border-r border-gray-200 md:col-span-1 bg-gray-50">
                    <Tabs defaultValue="rooms" className="w-full">
                      <div className="px-4 py-3 border-b border-gray-200">
                        <TabsList className="w-full">
                          <TabsTrigger value="rooms" className="w-full">
                            <Hash className="h-4 w-4 mr-2" /> Rooms
                          </TabsTrigger>
                          <TabsTrigger value="users" className="w-full">
                            <Users className="h-4 w-4 mr-2" /> Users
                          </TabsTrigger>
                        </TabsList>
                      </div>

                      <TabsContent value="rooms" className="m-0">
                        <div className="p-4">
                          <Button className="w-full mb-4" size="sm">
                            <PlusCircle className="h-4 w-4 mr-2" /> Create Room
                          </Button>
                        </div>
                        <div className="overflow-y-auto h-[calc(70vh-120px)]">
                          {mockRooms.map((room) => (
                            <div
                              key={room.id}
                              className={`p-3 cursor-pointer hover:bg-gray-100 transition-colors ${
                                activeRoom === room.id ? "bg-zenLightPink/30" : ""
                              }`}
                              onClick={() => handleJoinRoom(room.id)}
                            >
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="font-medium text-gray-900 flex items-center">
                                    <Hash className="h-4 w-4 mr-1 text-gray-500" /> 
                                    {room.name}
                                  </h3>
                                  <p className="text-sm text-gray-500 mt-0.5">{room.description}</p>
                                </div>
                                <Badge variant="outline" className="text-xs">
                                  {room.members}
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      </TabsContent>

                      <TabsContent value="users" className="m-0">
                        <div className="overflow-y-auto h-[calc(70vh-64px)]">
                          {mockUsers.map((user) => (
                            <div
                              key={user.id}
                              className="p-3 cursor-pointer hover:bg-gray-100 flex items-center"
                            >
                              <div className="relative">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage src={user.avatar} />
                                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                {user.online && (
                                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></span>
                                )}
                              </div>
                              <div className="ml-3">
                                <p className="text-sm font-medium">{user.name}</p>
                                <p className="text-xs text-gray-500">
                                  {user.online ? "Online" : "Offline"}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>

                  <div className="md:col-span-3 flex flex-col h-full">
                    <div className="border-b border-gray-200 p-4 bg-white">
                      <div className="flex items-center">
                        <Hash className="h-5 w-5 text-gray-500 mr-2" />
                        <h2 className="text-lg font-semibold">
                          {mockRooms.find(r => r.id === activeRoom)?.name}
                        </h2>
                        <Badge variant="outline" className="ml-2">
                          {mockRooms.find(r => r.id === activeRoom)?.members} members
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        {mockRooms.find(r => r.id === activeRoom)?.description}
                      </p>
                    </div>

                    {/* Messages */}
                    <div className="flex-grow p-4 overflow-y-auto bg-white">
                      {messages.map((msg, idx) => (
                        <motion.div
                          key={msg.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.05, duration: 0.2 }}
                          className={`flex items-start mb-4 ${
                            msg.userId === 1 ? "justify-end" : ""
                          }`}
                        >
                          {msg.userId !== 1 && (
                            <Avatar className="h-8 w-8 mr-3 mt-1">
                              <AvatarImage src={msg.avatar} />
                              <AvatarFallback>{msg.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                          )}
                          <div
                            className={`max-w-md px-4 py-2 rounded-lg ${
                              msg.userId === 1
                                ? "bg-zenSage text-white"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {msg.userId !== 1 && (
                              <div className="flex justify-between items-center mb-1">
                                <span className="font-medium text-sm">{msg.name}</span>
                              </div>
                            )}
                            <p>{msg.text}</p>
                            <div
                              className={`text-xs mt-1 ${
                                msg.userId === 1 ? "text-white/80" : "text-gray-500"
                              }`}
                            >
                              {msg.timestamp}
                            </div>
                          </div>
                          {msg.userId === 1 && (
                            <Avatar className="h-8 w-8 ml-3 mt-1">
                              <AvatarImage src={msg.avatar} />
                              <AvatarFallback>{msg.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                          )}
                        </motion.div>
                      ))}
                      <div ref={messagesEndRef} />
                    </div>
                    
                    {isTyping && <TypingIndicator />}

                    <div className="p-4 border-t border-gray-200 bg-white">
                      <div className="flex items-center justify-between mb-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSoundEnabled(!soundEnabled)}
                          className="text-gray-500"
                        >
                          {soundEnabled ? (
                            <Bell className="h-4 w-4" />
                          ) : (
                            <BellOff className="h-4 w-4" />
                          )}
                        </Button>
                      </div>

                      {mediaPreview && (
                        <MediaAttachment
                          preview={mediaPreview}
                          onAttach={() => {}}
                          onRemove={() => setMediaPreview(undefined)}
                        />
                      )}

                      <div className="flex space-x-2">
                        <Input
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyPress={handleKeyPress}
                          placeholder="Type your message..."
                          className="flex-grow"
                        />
                        <Button onClick={handleSendMessage} className="bg-zenSage hover:bg-zenSage/90">
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
}
