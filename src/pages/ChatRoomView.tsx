import { useState, useEffect, useRef, useCallback } from "react";
import {
  ArrowLeft,
  Send,
  Users,
  Settings,
  Phone,
  Video,
  Info,
  UserMinus,
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import axios, { AxiosError } from "axios";
import * as signalR from "@microsoft/signalr";
import { jwtDecode } from "jwt-decode";
import Header from "../components/layout/Header";
import { SectionHeader } from "@/components/ui/section-header";
import { AlertCircle, X, Ban } from "lucide-react";
import { motion } from "framer-motion";

// Types
type JwtPayload = {
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name": string;
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress": string;
  Username: string;
  Age: string;
};

type ChatUser = {
  id: string;
  name: string;
  username: string;
  avatar: string;
  isAdmin?: boolean;
  isOnline?: boolean;
};

type Reaction = {
  type: string;
  count: number;
  users: string[];
};

type Message = {
  id: number;
  user: ChatUser;
  content: string;
  timestamp: string;
  reactions: Reaction[];
  roomId?: number;
  isSystemMessage?: boolean;
};

type ChatRoom = {
  id: number;
  name: string;
  topic: string;
  description: string;
  capacity: number;
  users: ChatUser[];
  icon: string;
  unread: number;
  messages: Message[];
  creator?: string;
};

type Topic = {
  value: string;
  label: string;
  icon: string;
  description: string;
};

type ApiMessage = {
  id: number;
  user: string;
  messageText: string;
  timestamp: string;
  roomId: number;
};

type ApiRoom = {
  id: number;
  roomName: string;
  topic: string;
  description: string;
  capacity: number;
  creator: string;
};

type ReactionResponse = {
  messageId: number;
  reactionType: string;
  user: string;
  reactedAt: string;
};

type KickResponse = {
  success: boolean;
  message?: string;
};

const mentalHealthTopics: Topic[] = [
  {
    value: "anxiety",
    label: "Anxiety Support",
    icon: "😰",
    description: "Discuss anxiety management techniques and coping strategies",
  },
  {
    value: "depression",
    label: "Depression Recovery",
    icon: "😔",
    description: "Share experiences and support for depression",
  },
  {
    value: "stress",
    label: "Stress Management",
    icon: "😤",
    description: "Tips and discussions about managing stress in daily life",
  },
  {
    value: "mindfulness",
    label: "Mindfulness Practice",
    icon: "🧘",
    description: "Explore mindfulness techniques and meditation practices",
  },
  {
    value: "sleep",
    label: "Sleep Improvement",
    icon: "😴",
    description: "Strategies for better sleep habits and routines",
  },
  {
    value: "relationships",
    label: "Healthy Relationships",
    icon: "💑",
    description: "Building and maintaining healthy relationships",
  },
  {
    value: "selfcare",
    label: "Self-Care Routines",
    icon: "🧖",
    description: "Share self-care tips and routines",
  },
  {
    value: "grief",
    label: "Grief & Loss",
    icon: "💔",
    description: "Support for those experiencing grief and loss",
  },
  {
    value: "addiction",
    label: "Addiction Recovery",
    icon: "🔄",
    description: "Support for addiction recovery journeys",
  },
  {
    value: "selfesteem",
    label: "Self-Esteem Building",
    icon: "✨",
    description: "Practices for building self-esteem and confidence",
  },
];

const KICK_REASONS = [
  "Inappropriate behavior",
  "Spamming messages",
  "Harassment",
  "Violating community guidelines",
  "Sharing harmful content",
  "Hate speech or discrimination",
  "Other"
];

// Utility function to get user from token
const getUserFromToken = (): ChatUser | null => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const decoded = jwtDecode<JwtPayload>(token);
    return {
      id: decoded.Username,
      name: decoded[
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"
      ],
      username: decoded.Username,
      avatar: `https://api.dicebear.com/7.x/personas/svg?seed=${decoded.Username}`,
      isAdmin: false,
    };
  } catch (error) {
    console.error("Failed to decode token:", error);
    return null;
  }
};

interface ChatMessageProps {
  message: Message;
  currentUser: ChatUser;
  onAddReaction: (messageId: number, reactionType: string) => void;
}

const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  currentUser,
  onAddReaction,
}) => {
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  const isCurrentUser = message.user.id === currentUser.id;
  const reactionEmojis = ["👍", "❤️", "😄", "😢", "👏", "🙏"];

  const hasUserReacted = useCallback(
    (reactionType: string): boolean => {
      const reaction = message.reactions.find((r) => r.type === reactionType);
      return reaction?.users.includes(currentUser.id) || false;
    },
    [message.reactions, currentUser.id]
  );

  if (message.isSystemMessage) {
    return (
      <div className="flex justify-center my-2">
        <div className="bg-gray-100 px-3 py-1 rounded-full text-xs text-gray-600">
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex gap-3 ${
        isCurrentUser ? "flex-row-reverse" : ""
      } animate-fade-in`}
    >
      <Avatar className="h-8 w-8 flex-shrink-0">
        <AvatarImage src={message.user.avatar} alt={message.user.name} />
        <AvatarFallback>{message.user.name[0]}</AvatarFallback>
      </Avatar>

      <div
        className={`max-w-[75%] ${isCurrentUser ? "items-end" : "items-start"}`}
      >
        <div
          className={`flex items-center gap-2 mb-1 ${
            isCurrentUser ? "flex-row-reverse" : ""
          }`}
        >
          <span className="font-medium text-sm">{message.user.name}</span>
          <span className="text-xs text-muted-foreground">
            {new Date(message.timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>

        <div
          className={`relative group rounded-lg p-3 ${
            isCurrentUser
              ? "bg-[#EBFFF5] text-[#7CAE9E] rounded-tr-none border-[#CFECE0] border"
              : "bg-[#F8E8E9] text-[#E69EA2] rounded-tl-none border-[#FEC0B3] border"
          }`}
        >
          <p className="text-sm whitespace-pre-wrap">{message.content}</p>

          {message.reactions.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {message.reactions.map((reaction, i) => (
                <button
                  key={i}
                  onClick={() => onAddReaction(message.id, reaction.type)}
                  className={`text-xs rounded-full px-2 py-0.5 transition-all ${
                    hasUserReacted(reaction.type)
                      ? isCurrentUser
                        ? "bg-[#CFECE0] text-[#7CAE9E]"
                        : "bg-[#FEC0B3] text-[#E69EA2]"
                      : "bg-white/80"
                  }`}
                >
                  <span>
                    {reaction.type} {reaction.count}
                  </span>
                </button>
              ))}
            </div>
          )}

          <button
            onClick={() => setShowReactionPicker(!showReactionPicker)}
            className={`absolute ${
              isCurrentUser ? "-left-3" : "-right-3"
            } -bottom-3 opacity-0 group-hover:opacity-100 hover:scale-110 transition-all rounded-full p-1 ${
              isCurrentUser
                ? "bg-[#EBFFF5] text-[#7CAE9E]"
                : "bg-[#F8E8E9] text-[#E69EA2]"
            }`}
          >
            <span className="text-sm">😊</span>
          </button>

          {showReactionPicker && (
            <div
              className={`absolute bottom-full ${
                isCurrentUser ? "right-0" : "left-0"
              } mb-2 p-1 bg-white shadow-lg rounded-lg flex gap-1 z-10 animate-scale-in`}
            >
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

interface UserListProps {
  users: ChatUser[];
  currentUser: ChatUser;
  onPromoteUser: (userId: string) => void;
  onKickUser: (userId: string) => void;
  isAdmin: boolean;
}

const UserList: React.FC<UserListProps> = ({
  users,
  currentUser,
  onPromoteUser,
  onKickUser,
  isAdmin,
}) => {
  return (
    <div className="space-y-3">
      {users.map((user) => {
        const isCurrentUserItem = user.id === currentUser.id;
        const canManageUser = isAdmin && !isCurrentUserItem;

        return (
          <div
            key={user.id}
            className={`flex items-center justify-between p-2 rounded-md transition-colors ${
              isCurrentUserItem ? "bg-[#EBFFF5]" : "hover:bg-[#EBFFF5]/50"
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
                  <Badge
                    variant="outline"
                    className="text-[#7CAE9E] border-[#CFECE0] text-[10px] py-0 h-4"
                  >
                    Admin
                  </Badge>
                )}
              </div>
            </div>

            {canManageUser && (
              <div className="flex gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs bg-[#EBFFF5] text-[#7CAE9E] hover:bg-[#EBFFF5]/80 hover:text-[#7CAE9E] border-[#CFECE0]"
                  onClick={() => onPromoteUser(user.id)}
                >
                  Make Admin
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs bg-[#F8E8E9] text-[#E69EA2] hover:bg-[#F8E8E9]/80 hover:text-[#E69EA2] border-[#FEC0B3]"
                  onClick={() => onKickUser(user.id)}
                >
                  Kick
                </Button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default function ChatRoomView() {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentUser, setCurrentUser] = useState<ChatUser | null>(null);
  const [room, setRoom] = useState<ChatRoom | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<ChatUser[]>([]);
  const [messageText, setMessageText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [connection, setConnection] = useState<signalR.HubConnection | null>(
    null
  );
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [kickPopup, setKickPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [showKickModal, setShowKickModal] = useState(false);
  const [selectedReason, setSelectedReason] = useState("");
  const [userToKick, setUserToKick] = useState("");

  // Initialize SignalR connection
  useEffect(() => {
    const user = getUserFromToken();
    if (!user) {
      navigate("/login");
      return;
    }
    setCurrentUser(user);

    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl("https://localhost:7223/chatHub", {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets,
        accessTokenFactory: () => localStorage.getItem("token") || "",
      })
      .withAutomaticReconnect()
      .build();

    setConnection(newConnection);

    return () => {
      if (newConnection.state === signalR.HubConnectionState.Connected) {
        newConnection
          .stop()
          .catch((err) => console.error("Error stopping connection:", err));
      }
    };
  }, [navigate]);

  // Fetch room data and messages
  useEffect(() => {
    if (!roomId || !currentUser) return;

    const fetchRoomData = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No authentication token found");

        // Fetch room info
        const roomResponse = await axios.get<ApiRoom>(
          `https://localhost:7223/api/ChatRoom/rooms/${roomId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        // Fetch messages
        const messagesResponse = await axios.get<ApiMessage[]>(
          `https://localhost:7223/api/ChatRoom/messages/${roomId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        // Simplified message transformation
        const transformedMessages = messagesResponse.data.map((msg) => ({
          id: msg.id,
          content: msg.messageText,
          timestamp: msg.timestamp,
          roomId: msg.roomId,
          user: {
            id: msg.user,
            name: msg.user, // Using username as display name
            username: msg.user,
            avatar: `https://api.dicebear.com/7.x/personas/svg?seed=${msg.user}`,
          },
          reactions: [], // Initialize empty reactions array
        }));

        setRoom({
          id: roomResponse.data.id,
          name: roomResponse.data.roomName,
          topic: roomResponse.data.topic,
          description: roomResponse.data.description,
          capacity: roomResponse.data.capacity,
          users: [],
          icon:
            mentalHealthTopics.find((t) => t.value === roomResponse.data.topic)
              ?.icon || "💬",
          unread: 0,
          messages: transformedMessages,
          creator: roomResponse.data.creator,
        });

        setMessages(transformedMessages);
        setIsLoading(false);
      } catch (error) {
        const axiosError = error as AxiosError;
        console.error("Failed to fetch room data:", axiosError);
        toast({
          title: "Error",
          description: axiosError.message || "Failed to load room data",
          variant: "destructive",
        });
        navigate("/chat-room");
      }
    };

    fetchRoomData();
  }, [roomId, currentUser, navigate, toast]);

  // Setup SignalR listeners and join room
  useEffect(() => {
    if (!connection || !roomId || !currentUser) return;

    const startConnection = async () => {
      try {
        await connection.start();
        console.log("SignalR Connected");

        // Setup listeners
        connection.on(
          "ReceiveMessage",
          (user: string, message: string, timestamp: string) => {
            setMessages((prev) => [
              ...prev,
              {
                id: Date.now(), // Temporary ID until we get the real one
                user: {
                  id: user,
                  name: user,
                  username: user,
                  avatar: `https://api.dicebear.com/7.x/personas/svg?seed=${user}`,
                },
                content: message,
                timestamp: new Date().toISOString(),
                reactions: [],
              },
            ]);
          }
        );

        connection.on(
          "UpdateUserList",
          (userList: string[], adminUsername: string) => {
            const updatedUsers = userList.map((username) => ({
              id: username,
              name: username,
              username: username,
              avatar: `https://api.dicebear.com/7.x/personas/svg?seed=${username}`,
              isAdmin: username === adminUsername,
            }));

            setUsers(updatedUsers);

            // Check if current user is admin
            const currentUserIsAdmin = updatedUsers.some(
              (user) => user.id === currentUser.username && user.isAdmin
            );
            setIsAdmin(currentUserIsAdmin);
          }
        );

        connection.on(
          "ReceiveReaction",
          (messageId: number, reactions: ReactionResponse[]) => {
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === messageId
                  ? {
                      ...msg,
                      reactions: reactions.reduce(
                        (acc: Reaction[], curr) => {
                          const existingReaction = acc.find(
                            (r) => r.type === curr.reactionType
                          );
                          if (existingReaction) {
                            existingReaction.count += 1;
                            existingReaction.users.push(curr.user);
                          } else {
                            acc.push({
                              type: curr.reactionType,
                              count: 1,
                              users: [curr.user],
                            });
                          }
                          return acc;
                        },
                        [...msg.reactions]
                      ),
                    }
                  : msg
              )
            );
          }
        );

        // Kick-related listeners
        connection.on("CannotKickCreator", () => {
          setPopupMessage(
            "You cannot remove room creators from their own chats."
          );
          setKickPopup(true);
        });

        connection.on("Kicked", (reason: string) => {
          setPopupMessage(
            `The room moderator has removed you from this chat ${reason === "Other" ? "" : `due to ${reason}`}`,
          );
          setKickPopup(true);
        });

        // Join the room
        await connection.invoke(
          "JoinRoom",
          parseInt(roomId),
          currentUser.username
        );
      } catch (err) {
        console.error("SignalR connection error:", err);
      }
    };

    startConnection();

    return () => {
      if (connection.state === signalR.HubConnectionState.Connected) {
        connection
          .invoke("LeaveRoom", parseInt(roomId))
          .catch((err) => console.error("Error leaving room:", err));
        connection.off("ReceiveMessage");
        connection.off("UpdateUserList");
        connection.off("ReceiveReaction");
        connection.off("CannotKickCreator");
        connection.off("Kicked");
      }
    };
  }, [connection, roomId, currentUser, navigate, toast]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!messageText.trim() || !connection || !roomId || !currentUser) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");

      await connection.invoke(
        "SendMessage",
        currentUser.username,
        messageText,
        parseInt(roomId)
      );
      setMessageText("");
    } catch (error) {
      console.error("Failed to send message:", error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    }
  };

  const handleAddReaction = async (messageId: number, reactionType: string) => {
    if (!connection || !roomId || !currentUser) return;

    try {
      await connection.invoke(
        "SendReaction",
        messageId,
        reactionType,
        currentUser.username,
        parseInt(roomId)
      );
    } catch (error) {
      console.error("Failed to send reaction:", error);
    }
  };

  const handlePromoteToAdmin = async (userId: string) => {
    if (!connection || !roomId || !isAdmin) return;

    try {
      await connection.invoke("MakeAdmin", parseInt(roomId), userId);

      toast({
        title: "Success",
        description: "User has been promoted to admin",
        variant: "default",
      });
    } catch (error) {
      console.error("Failed to promote user:", error);
      toast({
        title: "Error",
        description: "Failed to promote user to admin",
        variant: "destructive",
      });
    }
  };

  const handleKickUser = (userId: string) => {
    setUserToKick(userId);
    setShowKickModal(true);
  };

  const confirmKickUser = async () => {
    if (!connection || !roomId || !isAdmin || !selectedReason) return;

    try {
      await connection.invoke("KickUser", parseInt(roomId), userToKick, selectedReason);
      
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          user: {
            id: "system",
            name: "System",
            username: "system",
            avatar: "",
          },
          content: `To maintain a safe space, ${currentUser?.username} has removed ${userToKick}${selectedReason === "Other" ? "" : ` due to ${selectedReason}`}`,          
          timestamp: new Date().toISOString(),
          reactions: [],
          isSystemMessage: true,
        },
      ]);
      
      setShowKickModal(false);
      setSelectedReason("");
      setUserToKick("");
    } catch (error) {
      console.error("Failed to kick user:", error);
      toast({
        title: "Error",
        description: "Failed to kick user",
        variant: "destructive",
      });
    }
  };

  const handleClosePopup = () => {
    setKickPopup(false);
    if (popupMessage.includes("removed you")) {
      navigate("/chatroom");
    }
  };

  if (isLoading || !room || !currentUser) {
    return (
      <div className="container py-8 flex justify-center items-center">
        <p>Loading chat room...</p>
      </div>
    );
  }

  const adminUser = users.find((user) => user.isAdmin);

  return (
    <>
      <div>
        <Header />
      </div>
      <SectionHeader
        title="Peer Support Chat Rooms"
        description="Connect with others facing similar challenges in a safe, moderated environment"
        className="text-center pt-9 pb-1"
        titleClassName="text-3xl md:text-4xl text-[#E69EA2]"
      />
      <div className="container py-8">
        <div className="grid gap-6 grid-cols-1 md:grid-cols-4 relative min-h-[650px] animate-fade-in">
          {/* User list sidebar */}
          <Card className="border-[#CFECE0] md:col-span-1">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-[#7CAE9E] text-base">
                  Members
                </CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-[#7CAE9E]"
                  onClick={() => navigate("/chat-room")}
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
                isAdmin={isAdmin}
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
                    <CardTitle className="text-base text-[#7CAE9E]">
                      {room.name}
                    </CardTitle>
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3 text-muted-foreground" />
                      <CardDescription className="text-xs">
                        {users.length}{" "}
                        {users.length === 1 ? "member" : "members"} • Moderated
                      </CardDescription>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-[#7CAE9E]"
                  >
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-[#7CAE9E]"
                  >
                    <Video className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-[#7CAE9E]"
                  >
                    <Info className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            {/* Messages area */}
            <CardContent className="p-0">
              <div className="flex flex-col gap-4 p-4 h-[calc(650px-11rem)] overflow-y-auto">
                <div className="text-center my-2">
                  <span className="text-xs bg-[#F8E8E9] px-2 py-1 rounded-full text-[#E69EA2]">
                    Today
                  </span>
                </div>

                <div className="bg-[#EBFFF5] p-3 rounded-lg border border-[#CFECE0] mb-2 mx-auto max-w-md text-center">
                  <p className="text-sm font-medium text-[#7CAE9E]">
                    Welcome to the {room.name}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    This is a safe space to discuss mental health challenges and
                    support each other. Please be respectful of all members.
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
                <div ref={messagesEndRef} />
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

        {/* Kick Reason Modal */}
        {showKickModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{
                type: "spring",
                damping: 25,
                stiffness: 400,
                mass: 0.5,
              }}
              className="w-full max-w-md"
            >
              <Card className="bg-white shadow-2xl overflow-hidden border-0 relative">
                <CardHeader className="bg-gradient-to-r from-[#E69EA2] to-[#f8b3b8] p-4">
                  <CardTitle className="text-white">Select Kick Reason</CardTitle>
                </CardHeader>
                
                <CardContent className="p-6 space-y-4">
                  {KICK_REASONS.map((reason) => (
                    <div 
                      key={reason} 
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedReason === reason 
                          ? "bg-[#EBFFF5] border border-[#7CAE9E]" 
                          : "bg-gray-100 hover:bg-gray-200"
                      }`}
                      onClick={() => setSelectedReason(reason)}
                    >
                      <p className="text-sm">{reason}</p>
                    </div>
                  ))}
                </CardContent>
                
                <CardFooter className="bg-gray-50/70 px-6 py-4 flex justify-end gap-2 border-t">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setShowKickModal(false);
                      setSelectedReason("");
                    }}
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={confirmKickUser}
                    disabled={!selectedReason}
                    className="bg-[#E69EA2] hover:bg-[#E69EA2]/90 text-white"
                  >
                    Confirm Kick
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          </motion.div>
        )}

        {/* Kick Popup */}
        {kickPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{
                type: "spring",
                damping: 25,
                stiffness: 400,
                mass: 0.5,
              }}
              className="w-full max-w-md"
            >
              <Card className="bg-white shadow-2xl overflow-hidden border-0 relative">
                {/* Animated status bar */}
                <motion.div
                  className="absolute top-0 left-0 h-1 bg-[#E69EA2]"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 3, ease: "linear" }}
                />

                <CardHeader className="bg-gradient-to-r from-[#E69EA2] to-[#f8b3b8] p-4">
                  <motion.div
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="flex items-center justify-between"
                  >
                    <CardTitle className="text-white flex items-center gap-2">
                      <motion.div
                        animate={{
                          rotate: [0, 10, -10, 0],
                          scale: [1, 1.1, 1],
                        }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                      ></motion.div>
                      <span>ChatRoom Notification</span>
                    </CardTitle>
                  </motion.div>
                </CardHeader>

                <CardContent className="p-6">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex items-start gap-4"
                  >
                    <motion.div
                      animate={{
                        scale: [1, 1.05, 1],
                        transition: { delay: 0.4 },
                      }}
                      className="flex-shrink-0"
                    >
                      <Ban className="h-8 w-8 text-[#E69EA2]" />
                    </motion.div>
                    <div>
                      <motion.p
                        className="text-gray-700 leading-relaxed"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                      >
                        {popupMessage}
                      </motion.p>
                      <motion.p
                        className="text-sm text-muted-foreground mt-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                      >
                        Feel free to explore other rooms or create your own safe space where you'll feel most comfortable.
                      </motion.p>
                    </div>
                  </motion.div>
                </CardContent>

                <CardFooter className="bg-gray-50/70 px-6 py-4 flex justify-end border-t">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Button
                      onClick={handleClosePopup}
                      className="bg-[#E69EA2] hover:bg-[#E69EA2]/90 text-white shadow-sm px-6 py-2 rounded-full"
                    >
                      <span>Understand</span>
                    </Button>
                  </motion.div>
                </CardFooter>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </div>
    </>
  );
}