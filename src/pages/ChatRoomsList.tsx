import { useState, useEffect } from "react";
import { Search, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { jwtDecode } from "jwt-decode";
import Header from "../components/layout/Header";
import { SectionHeader } from "@/components/ui/section-header";

// Types
type JwtPayload = {
  name: string;
  Username: string;
  Age: string;
};

export type ChatUser = {
  id: string;
  name: string;
  username: string;
  avatar: string;
  isAdmin?: boolean;
};

export type ChatRoom = {
  id: string | number;
  name: string;
  topic: string;
  description: string;
  capacity: number;
  users: ChatUser[];
  userCount: number;
  icon: string;
  unread: number;
  messages: Message[];
  creator?: string;
};

export type Message = {
  id: string | number;
  content: string;
  sender: ChatUser;
  timestamp: Date;
};

export type ApiChatRoom = {
  id: number;
  roomName: string;
  topic: string;
  description: string;
  capacity: number;
  creator: string;
};

export type CreateRoomDto = {
  roomName: string;
  topic: string;
  description: string;
  capacity: number;
};

export const mentalHealthTopics = [
  {
    value: "anxiety",
    label: "Anxiety Support",
    description: "Share experiences and coping strategies for anxiety",
    icon: "😰"
  },
  {
    value: "depression",
    label: "Depression Support",
    description: "Safe space for discussing depression and recovery",
    icon: "😔"
  },
  {
    value: "stress",
    label: "Stress Management",
    description: "Techniques and support for managing daily stress",
    icon: "😫"
  },
  {
    value: "mindfulness",
    label: "Mindfulness",
    description: "Practice mindfulness and meditation together",
    icon: "🧘"
  },
  {
    value: "sleep",
    label: "Sleep Issues",
    description: "Discuss sleep problems and healthy sleep habits",
    icon: "😴"
  },
  {
    value: "relationships",
    label: "Relationship Issues",
    description: "Support for relationship challenges",
    icon: "💑"
  },
  {
    value: "self-esteem",
    label: "Self-Esteem",
    description: "Building confidence and self-worth",
    icon: "💪"
  },
  {
    value: "grief",
    label: "Grief Support",
    description: "Coping with loss and bereavement",
    icon: "💔"
  },
  {
    value: "addiction",
    label: "Addiction Recovery",
    description: "Support for substance and behavioral addictions",
    icon: "🚭"
  },
  {
    value: "trauma",
    label: "Trauma Support",
    description: "Healing from traumatic experiences",
    icon: "🛡️"
  }
] as const;

type MentalHealthTopic = typeof mentalHealthTopics[number];

const getUserFromToken = (): ChatUser | null => {
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    const decoded = jwtDecode<JwtPayload>(token);
    return {
      id: decoded.Username,
      name: decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"],
      username: decoded.Username,
      avatar: `https://api.dicebear.com/7.x/personas/svg?seed=${decoded.Username}`,
      isAdmin: false
    };
  } catch (error) {
    console.error('Failed to decode token:', error);
    return null;
  }
};

interface ChatRoomListProps {
  rooms: ChatRoom[];
  onJoinRoom: (room: ChatRoom) => void;
  isLoading: boolean;
}

const ChatRoomList: React.FC<ChatRoomListProps> = ({ rooms, onJoinRoom, isLoading }) => {
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
            onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>Loading rooms...</p>
          </div>
        ) : filteredRooms.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No rooms found</p>
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
                      {room.icon || "💬"}
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#7CAE9E]">{room.name}</h3>
                      <p className="text-sm text-muted-foreground">{room.description}</p>
                      {room.creator && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Created by: {room.creator}
                        </p>
                      )}

                      <div className="flex items-center gap-3 mt-2">
                        <div className="flex items-center gap-1 text-sm text-[#7CAE9E]">
                          <Users className="h-3.5 w-3.5" />
                          <span>{room.userCount} / {room.capacity}</span>
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
                    className={`bg-[#7CAE9E] hover:bg-[#7CAE9E]/90 ${room.userCount >= room.capacity ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={room.userCount >= room.capacity}
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

interface CreateRoomFormProps {
  topics: typeof mentalHealthTopics;
  onCreateRoom: (room: Omit<ChatRoom, "id" | "users" | "unread" | "messages">) => Promise<void>;
  isLoading: boolean;
}

const CreateRoomForm: React.FC<CreateRoomFormProps> = ({ topics, onCreateRoom, isLoading }) => {
  const [selectedTopic, setSelectedTopic] = useState<MentalHealthTopic | null>(null);
  
  const formSchema = z.object({
    name: z.string().min(3, { message: "Room name must be at least 3 characters" }).max(50),
    topic: z.string().min(1, { message: "Please select a topic" }),
    capacity: z.number().min(2, { message: "Room must allow at least 2 users" }).max(100),
    description: z.string().min(10, { message: "Description must be at least 10 characters" }).max(200),
  });

  type FormValues = z.infer<typeof formSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      topic: "",
      capacity: 0,
      description: "",
    },
  });

  const handleSubmit = async (values: FormValues) => {
    if (!selectedTopic) {
      toast.error("Please select a topic");
      return;
    }
    
    const newRoom: Omit<ChatRoom, "id" | "users" | "unread" | "messages"> = {
      name: values.name,
      topic: values.topic,
      capacity: values.capacity,
      description: values.description,
      icon: selectedTopic.icon,
      userCount: values.capacity
    };
    
    await onCreateRoom(newRoom);
  };

  const handleTopicChange = (value: string) => {
    const topic = topics.find(t => t.value === value);
    if (topic) {
      setSelectedTopic(topic);
      form.setValue("name", topic.label);
      form.setValue("description", topic.description);
      form.setValue("topic", topic.value);
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
              disabled={isLoading}
            >
              {isLoading ? "Creating..." : "Create Room"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

const ChatRoomsList: React.FC = () => {
  const [view, setView] = useState<'list' | 'create'>('list');
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<ChatUser | null>(null);

  useEffect(() => {
    const user = getUserFromToken();
    setCurrentUser(user);
  }, []);

  const fetchRooms = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      // First fetch all rooms
      const roomsResponse = await axios.get<ApiChatRoom[]>('https://localhost:7223/api/ChatRoom/rooms', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Then fetch user counts for each room
      const roomsWithUserCounts = await Promise.all(
        roomsResponse.data.map(async (room) => {
          try {
            const userCountResponse = await axios.get<number>(
              `https://localhost:7223/api/ChatRoom/roomUserCount/${room.id}`,
              { headers: { Authorization: `Bearer ${token}` } }
            );
            
            return {
              id: room.id,
              name: room.roomName,
              topic: room.topic,
              description: room.description,
              capacity: room.capacity,
              users: [],
              userCount: userCountResponse.data,
              icon: mentalHealthTopics.find(t => t.value === room.topic)?.icon || "💬",
              unread: 0,
              messages: [],
              creator: room.creator
            };
          } catch (error) {
            console.error(`Failed to fetch user count for room ${room.id}:`, error);
            return {
              id: room.id,
              name: room.roomName,
              topic: room.topic,
              description: room.description,
              capacity: room.capacity,
              users: [],
              userCount: 0,
              icon: mentalHealthTopics.find(t => t.value === room.topic)?.icon || "💬",
              unread: 0,
              messages: [],
              creator: room.creator
            };
          }
        })
      );

      setRooms(roomsWithUserCounts);
    } catch (error) {
      const axiosError = error as AxiosError;
      toast.error(`Failed to fetch rooms: ${axiosError.message}`);
      console.error('Failed to fetch rooms:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleJoinRoom = (room: ChatRoom) => {
    navigate(`/chat-room/${room.id}`);
  };
  
  const handleCreateRoom = async (roomData: Omit<ChatRoom, "id" | "users" | "unread" | "messages">) => {
    if (!currentUser) {
      toast.error("You must be logged in to create a room");
      return;
    }

    setIsCreating(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const createRoomDto: CreateRoomDto = {
        roomName: roomData.name,
        topic: roomData.topic,
        description: roomData.description,
        capacity: roomData.capacity
      };

      const response = await axios.post<ApiChatRoom>('https://localhost:7223/api/ChatRoom/create', createRoomDto, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const newRoom: ChatRoom = {
        ...roomData,
        id: response.data.id,
        users: [{
          id: currentUser.username,
          name: currentUser.name,
          username: currentUser.username,
          avatar: currentUser.avatar,
          isAdmin: true
        }],
        userCount: 1,
        unread: 0,
        messages: [],
        creator: currentUser.username
      };

      setRooms(prev => [...prev, newRoom]);
      navigate(`/chat-room/${newRoom.id}`);
      toast.success("Room created successfully!");
    } catch (error) {
      const axiosError = error as AxiosError;
      toast.error(`Failed to create room: ${axiosError.message}`);
      console.error('Failed to create room:', error);
    } finally {
      setIsCreating(false);
    }
  };
  
  return (
    <><div><Header /></div>

    <div className="container py-8 animate-fade-in">

    <SectionHeader
        title="Peer Support Chat Rooms"
        description="Connect with others facing similar challenges in a safe, moderated environment"
        className="text-center"
        titleClassName="text-3xl md:text-4xl text-[#E69EA2]"
      />
      {view === 'list' && (
        <div className="grid gap-8">
          <div className="flex justify-end">
            <Button
              onClick={() => setView('create')}
              className="bg-[#7CAE9E] hover:bg-[#7CAE9E]/90"
              disabled={isLoading || !currentUser}
            >
              Create New Room
            </Button>
          </div>

          <ChatRoomList
            rooms={rooms}
            onJoinRoom={handleJoinRoom}
            isLoading={isLoading} />
        </div>
      )}

      {view === 'create' && (
        <div className="animate-fade-in">
          <Button
            onClick={() => setView('list')}
            variant="outline"
            className="mb-6 border-[#CFECE0] text-[#7CAE9E] hover:bg-[#EBFFF5] hover:text-[#7CAE9E]"
          >
            Back to Rooms
          </Button>

          <CreateRoomForm
            topics={mentalHealthTopics}
            onCreateRoom={handleCreateRoom}
            isLoading={isCreating} />
        </div>
      )}
    </div></>
  );
};

export default ChatRoomsList;