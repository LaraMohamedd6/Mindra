import { useState } from "react";
import { Bot, Send, ThumbsUp, ThumbsDown, InfoIcon, AlertTriangle, Users, Settings, Phone, Video, Info, UserMinus, Search, ArrowLeft } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

// Define types
export type ChatUser = {
  id: string;
  name: string;
  avatar: string;
  isAdmin?: boolean;
  isOnline?: boolean;
};

export type Reaction = {
  type: "👍" | "❤️" | "😄" | "😢" | "👏" | "🙏";
  count: number;
  users: string[]; // userIds who reacted
};

export type Message = {
  id: string;
  user: ChatUser;
  content: string;
  time: string;
  reactions: Reaction[];
};

export type ChatRoom = {
  id: string;
  name: string;
  topic: string;
  description: string;
  capacity: number;
  users: ChatUser[];
  icon: string;
  unread: number;
  messages: Message[];
};

// Define Topic type
type Topic = {
  value: string;
  label: string;
  icon: string;
  description: string;
};

// Sample mental health topics
export const mentalHealthTopics: Topic[] = [
  { value: "anxiety", label: "Anxiety Support", icon: "😰", description: "Discuss anxiety management techniques and coping strategies" },
  { value: "depression", label: "Depression Recovery", icon: "😔", description: "Share experiences and support for depression" },
  { value: "stress", label: "Stress Management", icon: "😤", description: "Tips and discussions about managing stress in daily life" },
  { value: "mindfulness", label: "Mindfulness Practice", icon: "🧘", description: "Explore mindfulness techniques and meditation practices" },
  { value: "sleep", label: "Sleep Improvement", icon: "😴", description: "Strategies for better sleep habits and routines" },
  { value: "relationships", label: "Healthy Relationships", icon: "💑", description: "Building and maintaining healthy relationships" },
  { value: "selfcare", label: "Self-Care Routines", icon: "🧖", description: "Share self-care tips and routines" },
  { value: "grief", label: "Grief & Loss", icon: "💔", description: "Support for those experiencing grief and loss" },
  { value: "addiction", label: "Addiction Recovery", icon: "🔄", description: "Support for addiction recovery journeys" },
  { value: "selfesteem", label: "Self-Esteem Building", icon: "✨", description: "Practices for building self-esteem and confidence" }
];

// Sample chat rooms
const sampleChatRooms: ChatRoom[] = [
  {
    id: "1",
    name: "Anxiety Support",
    topic: "anxiety",
    description: "Safe space to discuss anxiety management techniques",
    capacity: 30,
    users: [
      { id: "u1", name: "Emma Thompson", avatar: "https://api.dicebear.com/7.x/personas/svg?seed=Emma" },
      { id: "u2", name: "Michael Chen", avatar: "https://api.dicebear.com/7.x/personas/svg?seed=Michael" },
      { id: "u3", name: "Sarah Johnson", avatar: "https://api.dicebear.com/7.x/personas/svg?seed=Sarah" },
      { id: "u4", name: "Alex Rivera", avatar: "https://api.dicebear.com/7.x/personas/svg?seed=Alex" },
    ],
    icon: "😰",
    unread: 3,
    messages: []
  },
  {
    id: "2",
    name: "Student Stress Relief",
    topic: "stress",
    description: "Tips and mutual support for academic pressure",
    capacity: 50,
    users: [
      { id: "u5", name: "Jordan Lee", avatar: "https://api.dicebear.com/7.x/personas/svg?seed=Jordan" },
      { id: "u6", name: "Taylor Smith", avatar: "https://api.dicebear.com/7.x/personas/svg?seed=Taylor" },
    ],
    icon: "📚",
    unread: 0,
    messages: []
  },
  {
    id: "3",
    name: "Mindfulness Practice",
    topic: "mindfulness",
    description: "Group discussions on mindfulness and meditation",
    capacity: 20,
    users: [
      { id: "u7", name: "Riley Morgan", avatar: "https://api.dicebear.com/7.x/personas/svg?seed=Riley" },
      { id: "u8", name: "Jamie Wilson", avatar: "https://api.dicebear.com/7.x/personas/svg?seed=Jamie" },
    ],
    icon: "🧘",
    unread: 1,
    messages: []
  },
  {
    id: "4",
    name: "Sleep Improvement",
    topic: "sleep",
    description: "Strategies for better sleep habits and routines",
    capacity: 40,
    users: [
      { id: "u9", name: "Casey Brown", avatar: "https://api.dicebear.com/7.x/personas/svg?seed=Casey" },
      { id: "u10", name: "Morgan Davis", avatar: "https://api.dicebear.com/7.x/personas/svg?seed=Morgan" },
    ],
    icon: "😴",
    unread: 0,
    messages: []
  }
];

// Sample messages for the active room
const sampleMessages: Message[] = [
  {
    id: "1",
    user: { id: "u1", name: "Emma Thompson", avatar: "https://api.dicebear.com/7.x/personas/svg?seed=Emma" },
    content: "Has anyone tried the 5-4-3-2-1 grounding technique for anxiety? I found it super helpful during exam week.",
    time: "11:24 AM",
    reactions: [
      { type: "👍", count: 3, users: ["u2", "u3", "u4"] },
      { type: "❤️", count: 2, users: ["u2", "u4"] }
    ]
  },
  {
    id: "2",
    user: { id: "u2", name: "Michael Chen", avatar: "https://api.dicebear.com/7.x/personas/svg?seed=Michael" },
    content: "Yes! It really helps break that spiral of anxious thoughts. I also like the 4-7-8 breathing technique when I'm feeling overwhelmed.",
    time: "11:32 AM",
    reactions: [
      { type: "👍", count: 1, users: ["u1"] }
    ]
  },
  {
    id: "3",
    user: { id: "u3", name: "Sarah Johnson", avatar: "https://api.dicebear.com/7.x/personas/svg?seed=Sarah" },
    content: "Could someone explain the 5-4-3-2-1 technique? I'm dealing with pre-presentation anxiety and would love to try it.",
    time: "11:45 AM",
    reactions: []
  },
  {
    id: "4",
    user: { id: "u1", name: "Emma Thompson", avatar: "https://api.dicebear.com/7.x/personas/svg?seed=Emma" },
    content: "Sure! You identify 5 things you can see, 4 things you can touch, 3 things you can hear, 2 things you can smell, and 1 thing you can taste. It helps bring you back to the present moment instead of worrying about the future.",
    time: "11:48 AM",
    reactions: [
      { type: "👍", count: 2, users: ["u3", "u4"] },
      { type: "🙏", count: 1, users: ["u3"] },
      { type: "❤️", count: 1, users: ["u3"] }
    ]
  },
  {
    id: "5",
    user: { id: "u4", name: "Alex Rivera", avatar: "https://api.dicebear.com/7.x/personas/svg?seed=Alex" },
    content: "I've found that combining that with a quick walk outside before a stressful event makes a huge difference. Something about fresh air really helps reset my nervous system.",
    time: "11:52 AM",
    reactions: [
      { type: "👍", count: 1, users: ["u1"] }
    ]
  }
];

// Inline ChatMessage Component
const ChatMessage = ({ message, currentUser, onAddReaction }: {
  message: Message;
  currentUser: ChatUser;
  onAddReaction: (messageId: string, reactionType: Reaction["type"]) => void;
}) => {
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  const isCurrentUser = message.user.id === currentUser.id;
  const reactionEmojis: Reaction["type"][] = ["👍", "❤️", "😄", "😢", "👏", "🙏"];
  
  const hasUserReacted = (reactionType: Reaction["type"]) => {
    const reaction = message.reactions.find(r => r.type === reactionType);
    return reaction?.users.includes(currentUser.id) || false;
  };

  return (
    <div className={`flex gap-3 ${isCurrentUser ? 'flex-row-reverse' : ''} animate-fade-in`}>
      <Avatar className="h-8 w-8 flex-shrink-0">
        <AvatarImage src={message.user.avatar} alt={message.user.name} />
        <AvatarFallback>{message.user.name[0]}</AvatarFallback>
      </Avatar>
      
      <div className={`max-w-[75%] ${isCurrentUser ? 'items-end' : 'items-start'}`}>
        <div className={`flex items-center gap-2 mb-1 ${isCurrentUser ? 'flex-row-reverse' : ''}`}>
          <span className="font-medium text-sm">{message.user.name}</span>
          <span className="text-xs text-muted-foreground">{message.time}</span>
        </div>
        
        <div 
          className={`relative group rounded-lg p-3 ${
            isCurrentUser 
              ? 'bg-[#EBFFF5] text-[#7CAE9E] rounded-tr-none border-[#CFECE0] border' 
              : 'bg-[#F8E8E9] text-[#E69EA2] rounded-tl-none border-[#FEC0B3] border'
          }`}
        >
          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
          
          {/* Reactions */}
          {message.reactions.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {message.reactions.map((reaction, i) => (
                <button
                  key={i}
                  onClick={() => onAddReaction(message.id, reaction.type)}
                  className={`text-xs rounded-full px-2 py-0.5 transition-all ${
                    hasUserReacted(reaction.type)
                      ? isCurrentUser 
                        ? 'bg-[#CFECE0] text-[#7CAE9E]' 
                        : 'bg-[#FEC0B3] text-[#E69EA2]'
                      : 'bg-white/80'
                  }`}
                >
                  <span>{reaction.type} {reaction.count}</span>
                </button>
              ))}
            </div>
          )}
          
          {/* Reaction button */}
          <button 
            onClick={() => setShowReactionPicker(!showReactionPicker)}
            className={`absolute ${isCurrentUser ? '-left-3' : '-right-3'} -bottom-3 opacity-0 group-hover:opacity-100 hover:scale-110 transition-all rounded-full p-1 ${
              isCurrentUser ? 'bg-[#EBFFF5] text-[#7CAE9E]' : 'bg-[#F8E8E9] text-[#E69EA2]'
            }`}
          >
            <span className="text-sm">😊</span>
          </button>
          
          {/* Reaction picker */}
          {showReactionPicker && (
            <div className={`absolute bottom-full ${isCurrentUser ? 'right-0' : 'left-0'} mb-2 p-1 bg-white shadow-lg rounded-lg flex gap-1 z-10 animate-scale-in`}>
              {reactionEmojis.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => {
                    onAddReaction(message.id, emoji);
                    setShowReactionPicker(false);
                  }}
                  className="hover:scale-125 transition-transform p-1"
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Inline UserList Component
const UserList = ({ users, currentUser, onPromoteUser, onKickUser }: {
  users: ChatUser[];
  currentUser: ChatUser;
  onPromoteUser: (userId: string) => void;
  onKickUser: (userId: string) => void;
}) => {
  const isCurrentUserAdmin = currentUser.isAdmin;
  
  return (
    <div className="space-y-3">
      {users.map((user) => {
        const isCurrentUserItem = user.id === currentUser.id;
        const canManageUser = isCurrentUserAdmin && !isCurrentUserItem && !user.isAdmin;
        
        return (
          <div 
            key={user.id} 
            className={`flex items-center justify-between p-2 rounded-md transition-colors ${
              isCurrentUserItem ? 'bg-[#EBFFF5]' : 'hover:bg-[#EBFFF5]/50'
            }`}
          >
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback>{user.name[0]}</AvatarFallback>
              </Avatar>
              
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-medium text-sm">{user.name}</span>
                  {isCurrentUserItem && (
                    <span className="text-xs text-[#7CAE9E]">(You)</span>
                  )}
                </div>
                
                {user.isAdmin && (
                  <Badge variant="outline" className="text-[#7CAE9E] border-[#CFECE0] text-[10px] py-0 h-4">
                    Admin
                  </Badge>
                )}
              </div>
            </div>
            
            {canManageUser && (
              <div className="flex">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-[#7CAE9E] hover:bg-[#EBFFF5] hover:text-[#7CAE9E]"
                  onClick={() => onPromoteUser(user.id)}
                  title="Make Admin"
                >
                  <Settings className="h-3.5 w-3.5" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-[#E69EA2] hover:bg-[#F8E8E9] hover:text-[#E69EA2]"
                  onClick={() => onKickUser(user.id)}
                  title="Remove User"
                >
                  <UserMinus className="h-3.5 w-3.5" />
                </Button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

// Inline ChatRoomList Component
const ChatRoomList = ({ rooms, onJoinRoom }: {
  rooms: ChatRoom[];
  onJoinRoom: (room: ChatRoom) => void;
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredRooms = rooms.filter(room => 
    room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    room.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <Card className="border-[#CFECE0]">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-[#7CAE9E]">Available Rooms</CardTitle>
        </div>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-[#7CAE9E]" />
          <Input
            type="search"
            placeholder="Search rooms..."
            className="pl-8 border-[#CFECE0] focus-visible:ring-[#7CAE9E]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent>
        {filteredRooms.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No rooms match your search criteria</p>
          </div>
        ) : (
          <div className="space-y-4 mt-4">
            {filteredRooms.map((room) => (
              <div 
                key={room.id} 
                className="border border-[#CFECE0] rounded-lg p-4 transition-all duration-300 hover:shadow-md animate-fade-in"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-start gap-3">
                    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-[#EBFFF5] text-2xl flex-shrink-0">
                      {room.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#7CAE9E]">{room.name}</h3>
                      <p className="text-sm text-muted-foreground">{room.description}</p>
                      
                      <div className="flex items-center gap-3 mt-2">
                        <div className="flex items-center gap-1 text-sm text-[#7CAE9E]">
                          <Users className="h-3.5 w-3.5" />
                          <span>{room.users.length} / {room.capacity}</span>
                        </div>
                        
                        {room.unread > 0 && (
                          <Badge className="bg-[#E69EA2] hover:bg-[#E69EA2]/90">
                            {room.unread} new {room.unread === 1 ? 'message' : 'messages'}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={() => onJoinRoom(room)}
                    className={`bg-[#7CAE9E] hover:bg-[#7CAE9E]/90 ${room.users.length >= room.capacity ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={room.users.length >= room.capacity}
                  >
                    Join Room
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Inline ActiveChatRoom Component
const ActiveChatRoom = ({ room, currentUser, onLeaveRoom }: {
  room: ChatRoom;
  currentUser: ChatUser;
  onLeaveRoom: () => void;
}) => {
  const [messageText, setMessageText] = useState("");
  const [messages, setMessages] = useState<Message[]>(room.messages);
  const [users, setUsers] = useState<ChatUser[]>(room.users);
  const { toast } = useToast();

  const handleSendMessage = () => {
    if (!messageText.trim()) return;

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      user: currentUser,
      content: messageText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      reactions: []
    };

    setMessages([...messages, newMessage]);
    setMessageText("");
  };

  const handleAddReaction = (messageId: string, reactionType: Reaction["type"]) => {
    setMessages(prevMessages => 
      prevMessages.map(message => {
        if (message.id === messageId) {
          // Check if this reaction type already exists
          const existingReactionIndex = message.reactions.findIndex(r => r.type === reactionType);
          
          if (existingReactionIndex >= 0) {
            // Check if the current user has already reacted
            const reaction = message.reactions[existingReactionIndex];
            const userHasReacted = reaction.users.includes(currentUser.id);
            
            if (userHasReacted) {
              // Remove the user's reaction
              const updatedUsers = reaction.users.filter(id => id !== currentUser.id);
              
              if (updatedUsers.length === 0) {
                // If no users left, remove the reaction type entirely
                return {
                  ...message,
                  reactions: message.reactions.filter((_, i) => i !== existingReactionIndex)
                };
              }
              
              // Update the reaction with the user removed
              const updatedReactions = [...message.reactions];
              updatedReactions[existingReactionIndex] = {
                ...reaction,
                users: updatedUsers,
                count: updatedUsers.length
              };
              
              return { ...message, reactions: updatedReactions };
            } else {
              // Add the user to the existing reaction
              const updatedReactions = [...message.reactions];
              updatedReactions[existingReactionIndex] = {
                ...reaction,
                users: [...reaction.users, currentUser.id],
                count: reaction.users.length + 1
              };
              
              return { ...message, reactions: updatedReactions };
            }
          } else {
            // Add a new reaction type
            return {
              ...message,
              reactions: [
                ...message.reactions,
                { type: reactionType, count: 1, users: [currentUser.id] }
              ]
            };
          }
        }
        return message;
      })
    );
  };

  const handlePromoteToAdmin = (userId: string) => {
    if (!currentUser.isAdmin) return;
    
    setUsers(prevUsers => 
      prevUsers.map(user => 
        user.id === userId 
          ? { ...user, isAdmin: true } 
          : user
      )
    );
    
    toast({
      title: "User Promoted",
      description: "User has been promoted to admin",
    });
  };

  const handleKickUser = (userId: string) => {
    if (!currentUser.isAdmin) return;
    
    const userToKick = users.find(user => user.id === userId);
    if (!userToKick) return;
    
    setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
    
    toast({
      title: "User Removed",
      description: `${userToKick.name} has been removed from the room`,
    });
  };

  // Find admin user
  const adminUser = users.find(user => user.isAdmin);

  return (
    <div className="grid gap-6 grid-cols-1 md:grid-cols-4 relative min-h-[650px] animate-fade-in">
      {/* User list sidebar */}
      <Card className="border-[#CFECE0] md:col-span-1">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-[#7CAE9E] text-base">Members</CardTitle>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-[#7CAE9E]"
              onClick={onLeaveRoom}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </div>
          {adminUser && (
            <div className="flex items-center gap-2 mt-2 p-2 bg-[#EBFFF5] rounded-md">
              <Users className="h-4 w-4 text-[#7CAE9E]" />
              <span className="text-sm text-[#7CAE9E]">
                Room Admin: {adminUser.name}
              </span>
            </div>
          )}
        </CardHeader>
        <CardContent className="p-3">
          <UserList 
            users={users} 
            currentUser={currentUser}
            onPromoteUser={handlePromoteToAdmin}
            onKickUser={handleKickUser}
          />
        </CardContent>
      </Card>
      
      {/* Chat area */}
      <Card className="border-[#CFECE0] md:col-span-3">
        <CardHeader className="pb-2 border-b border-[#CFECE0]">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center h-9 w-9 rounded-full bg-[#EBFFF5] text-lg flex-shrink-0">
                {room.icon}
              </div>
              <div>
                <CardTitle className="text-base text-[#7CAE9E]">{room.name}</CardTitle>
                <div className="flex items-center gap-1">
                  <Users className="h-3 w-3 text-muted-foreground" />
                  <CardDescription className="text-xs">
                    {room.users.length} {room.users.length === 1 ? 'member' : 'members'} • Moderated
                  </CardDescription>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8 text-[#7CAE9E]">
                <Phone className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-[#7CAE9E]">
                <Video className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-[#7CAE9E]">
                <Info className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        {/* Messages area */}
        <CardContent className="p-0">
          <div className="flex flex-col gap-4 p-4 h-[calc(650px-11rem)] overflow-y-auto">
            <div className="text-center my-2">
              <span className="text-xs bg-[#F8E8E9] px-2 py-1 rounded-full text-[#E69EA2]">Today</span>
            </div>
            
            <div className="bg-[#EBFFF5] p-3 rounded-lg border border-[#CFECE0] mb-2 mx-auto max-w-md text-center animate-fade-in">
              <p className="text-sm font-medium text-[#7CAE9E]">Welcome to the {room.name}</p>
              <p className="text-xs text-muted-foreground mt-1">
                This is a safe space to discuss mental health challenges and support each other. 
                Please be respectful of all members.
              </p>
            </div>
            
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message}
                currentUser={currentUser}
                onAddReaction={handleAddReaction}
              />
            ))}
          </div>
        </CardContent>
        
        {/* Message input */}
        <CardFooter className="border-t border-[#CFECE0] p-4">
          <div className="flex items-center gap-2 w-full">
            <Input
              placeholder="Type your message..."
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              className="border-[#CFECE0] focus-visible:ring-[#7CAE9E]"
            />
            <Button 
              onClick={handleSendMessage}
              className="bg-[#7CAE9E] hover:bg-[#7CAE9E]/90"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

// Inline CreateRoomForm Component
const CreateRoomForm = ({ topics, onCreateRoom }: {
  topics: Topic[];
  onCreateRoom: (room: Omit<ChatRoom, "id" | "users" | "unread" | "messages">) => void;
}) => {
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  
  const formSchema = z.object({
    name: z.string().min(3, { message: "Room name must be at least 3 characters" }).max(50),
    topic: z.string().min(1, { message: "Please select a topic" }),
    capacity: z.number().min(2, { message: "Room must allow at least 2 users" }).max(100),
    description: z.string().min(10, { message: "Description must be at least 10 characters" }).max(200),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      topic: "",
      capacity: 20,
      description: "",
    },
  });

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    if (!selectedTopic) return;
    
    const newRoom: Omit<ChatRoom, "id" | "users" | "unread" | "messages"> = {
      name: values.name,
      topic: values.topic,
      capacity: values.capacity,
      description: values.description,
      icon: selectedTopic.icon,
    };
    
    onCreateRoom(newRoom);
  };

  // Handle topic selection
  const handleTopicChange = (value: string) => {
    const topic = topics.find(t => t.value === value);
    if (topic) {
      setSelectedTopic(topic);
      
      // Pre-fill name and description based on topic
      form.setValue("name", topic.label);
      form.setValue("description", topic.description);
    }
  };

  return (
    <Card className="border-[#CFECE0] max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-[#7CAE9E]">Create a New Support Room</CardTitle>
        <CardDescription>
          Start a conversation about mental health topics that matter to you
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="topic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Topic</FormLabel>
                  <Select 
                    onValueChange={(value) => {
                      field.onChange(value);
                      handleTopicChange(value);
                    }}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="border-[#CFECE0] focus:ring-[#7CAE9E]">
                        <SelectValue placeholder="Select a mental health topic" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {topics.map((topic) => (
                        <SelectItem key={topic.value} value={topic.value} className="focus:bg-[#EBFFF5]">
                          <div className="flex items-center gap-2">
                            <span>{topic.icon}</span>
                            <span>{topic.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Choose a topic for your support room
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Room Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter room name"
                        {...field}
                        className="border-[#CFECE0] focus-visible:ring-[#7CAE9E]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="capacity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Capacity</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Maximum number of users"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        className="border-[#CFECE0] focus-visible:ring-[#7CAE9E]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Describe what this room is about"
                      {...field}
                      className="border-[#CFECE0] focus-visible:ring-[#7CAE9E]"
                    />
                  </FormControl>
                  <FormDescription>
                    Briefly describe the purpose and guidelines for this room
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button 
              type="submit" 
              className="w-full bg-[#7CAE9E] hover:bg-[#7CAE9E]/90"
            >
              Create Room
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

// Main ChatRoom Component
export default function ChatRoom() {
  const [view, setView] = useState<'list' | 'create' | 'active'>('list');
  const [currentRoom, setCurrentRoom] = useState<ChatRoom | null>(null);
  
  // Create a mock current user
  const currentUser: ChatUser = { 
    id: "current-user",
    name: "You",
    avatar: "https://api.dicebear.com/7.x/personas/svg?seed=You",
    isAdmin: true
  };
  
  // Sample rooms with existing messages for demo
  const [rooms, setRooms] = useState<ChatRoom[]>(
    sampleChatRooms.map(room => {
      if (room.id === "1") {
        return { ...room, messages: sampleMessages };
      }
      return room;
    })
  );
  
  const handleJoinRoom = (room: ChatRoom) => {
    setCurrentRoom({
      ...room,
      users: [...room.users, currentUser],
    });
    setView('active');
  };
  
  const handleLeaveRoom = () => {
    setCurrentRoom(null);
    setView('list');
  };
  
  const handleCreateRoom = (roomData: Omit<ChatRoom, "id" | "users" | "unread" | "messages">) => {
    const newRoom: ChatRoom = {
      ...roomData,
      id: `room-${Date.now()}`,
      users: [{ ...currentUser, isAdmin: true }], // Current user is admin of the new room
      unread: 0,
      messages: [],
    };
    
    setRooms([...rooms, newRoom]);
    setCurrentRoom(newRoom);
    setView('active');
  };
  
  return (
    <div className="container py-8 animate-fade-in">

      
      {/* Show different views based on state */}
      {view === 'list' && (
        <div className="grid gap-8">
          <div className="flex justify-end">
            <Button 
              onClick={() => setView('create')}
              className="bg-[#7CAE9E] hover:bg-[#7CAE9E]/90"
            >
              Create New Room
            </Button>
          </div>
          
          <ChatRoomList 
            rooms={rooms} 
            onJoinRoom={handleJoinRoom} 
          />
        </div>
      )}
      
      {view === 'create' && (
        <div className="animate-fade-in">
          <Button 
            onClick={() => setView('list')}
            variant="outline"
            className="mb-6 border-[#CFECE0] text-[#7CAE9E] hover:bg-[#EBFFF5] hover:text-[#7CAE9E]"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Rooms
          </Button>
          
          <CreateRoomForm 
            topics={mentalHealthTopics}
            onCreateRoom={handleCreateRoom}
          />
        </div>
      )}
      
      {view === 'active' && currentRoom && (
        <ActiveChatRoom
          room={currentRoom}
          currentUser={currentUser}
          onLeaveRoom={handleLeaveRoom}
        />
      )}
    </div>
  );
}
