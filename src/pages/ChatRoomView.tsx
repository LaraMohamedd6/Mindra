import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import axios, { AxiosError } from "axios";
import * as signalR from "@microsoft/signalr";
import { jwtDecode } from "jwt-decode";
import Header from "../components/layout/Header";
import { SectionHeader } from "@/components/ui/section-header";
import { MembersList } from "../components/chatroom/MembersList";
import { ChatBox, KickModal, KickPopup } from "../components/chatroom/ChatBox";

type JwtPayload = {
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name": string;
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress": string;
  Username: string;
  Age: string;
  Avatar: string;  // Add this

};

type ChatUser = {
  id: string;
  name: string;
  username: string;
  avatar: string;
  isAdmin?: boolean;
  isOnline?: boolean;
};

type MessageReaction = {
  id?: number;
  messageId: number;
  user: string;
  reactionType: string;
  reactedAt: string;
};

type Message = {
  id: number;
  user: ChatUser;
  content: string;
  timestamp: string;
  reactions: MessageReaction[];
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

const mentalHealthTopics = [
  {
    value: "anxiety",
    label: "Anxiety Support",
    icon: "😰",
    description: "Discuss anxiety management techniques and coping strategies",
  },
  {
    value: "depression",
    label: "Depression Support",
    description: "Safe space for discussing depression and recovery",
    icon: "😔",
  },
  {
    value: "stress",
    label: "Stress Management",
    description: "Techniques and support for managing daily stress",
    icon: "😫",
  },
  {
    value: "mindfulness",
    label: "Mindfulness",
    description: "Practice mindfulness and meditation together",
    icon: "🧘",
  },
  {
    value: "sleep",
    label: "Sleep Issues",
    description: "Discuss sleep problems and healthy sleep habits",
    icon: "😴",
  },
  {
    value: "relationships",
    label: "Relationship Issues",
    description: "Support for relationship challenges",
    icon: "💑",
  },
  {
    value: "self-esteem",
    label: "Self-Esteem",
    description: "Building confidence and self-worth",
    icon: "💪",
  },
  {
    value: "grief",
    label: "Grief Support",
    description: "Coping with loss and bereavement",
    icon: "💔",
  },
  {
    value: "addiction",
    label: "Addiction Recovery",
    description: "Support for substance and behavioral addictions",
    icon: "🚭",
  },
  {
    value: "trauma",
    label: "Trauma Support",
    description: "Healing from traumatic experiences",
    icon: "🛡️",
  },
];

const getUserFromToken = (): ChatUser | null => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const decoded = jwtDecode<JwtPayload>(token);
    return {
      id: decoded.Username,
      name: decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"],
      username: decoded.Username,
            avatar: decoded.Avatar,  // Use the avatar from token
      isAdmin: false,
    };
  } catch (error) {
    console.error("Failed to decode token:", error);
    return null;
  }
};


const getUserAvatar = (username: string, users: ChatUser[] = []): string => {
  // First try to find the user in the provided list
  const existingUser = users.find(u => u.username === username);
  if (existingUser?.avatar) return existingUser.avatar;

  // If current user, get from token
  const token = localStorage.getItem("token");
  if (token) {
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      if (decoded.Username === username && decoded.Avatar) {
        return decoded.Avatar;
      }
    } catch (error) {
      console.error("Error decoding token for avatar:", error);
    }
  }

  // Fallback to empty string (you can set a default avatar here if needed)
  return "";
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
  const [connection, setConnection] = useState<signalR.HubConnection | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [kickPopup, setKickPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [showKickModal, setShowKickModal] = useState(false);
  const [selectedReason, setSelectedReason] = useState("");
  const [userToKick, setUserToKick] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
      .configureLogging(signalR.LogLevel.Information)
      .build();

    setConnection(newConnection);

    return () => {
      if (newConnection.state === signalR.HubConnectionState.Connected) {
        newConnection.stop().catch(err => console.error("Error stopping connection:", err));
      }
    };
  }, [navigate]);

  useEffect(() => {
    if (!roomId || !currentUser) return;

    const fetchRoomData = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No authentication token found");

        const [roomResponse, messagesResponse, reactionsResponse] = await Promise.all([
          axios.get<ApiRoom>(`https://localhost:7223/api/ChatRoom/rooms/${roomId}`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get<ApiMessage[]>(`https://localhost:7223/api/ChatRoom/messages/${roomId}`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get<MessageReaction[]>(`https://localhost:7223/api/ChatRoom/message-reactions/${roomId}`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

const transformedMessages = messagesResponse.data.map((msg) => {
  // Try to find the user in the room to get their avatar
  const userInRoom = users.find(u => u.username === msg.user);
  
  return {
    id: msg.id,
    content: msg.messageText,
    timestamp: msg.timestamp,
    roomId: msg.roomId,
    user: {
      id: msg.user,
      name: msg.user,
      username: msg.user,
      avatar: userInRoom?.avatar ,
    },
    reactions: reactionsResponse.data.filter(r => r.messageId === msg.id),
  };
});

        setRoom({
          id: roomResponse.data.id,
          name: roomResponse.data.roomName,
          topic: roomResponse.data.topic,
          description: roomResponse.data.description,
          capacity: roomResponse.data.capacity,
          users: [],
          icon: mentalHealthTopics.find((t) => t.value === roomResponse.data.topic)?.icon || "💬",
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

  useEffect(() => {
    if (!connection || !roomId || !currentUser) return;

    const startConnection = async () => {
      try {
        await connection.start();
        console.log("SignalR Connected");

connection.on("ReceiveMessage", (user: string, message: string, messageId: number) => {
  // Try to find the user in the room to get their avatar
  const userInRoom = users.find(u => u.username === user);
  
  setMessages(prev => [
    ...prev,
    {
      id: messageId,
      user: {
        id: user,
        name: user,
        username: user,
        avatar: userInRoom?.avatar ,
      },
      content: message,
      timestamp: new Date().toISOString(),
      reactions: [],
    },
  ]);
});

connection.on("UpdateUserList", (userList: string[], adminUsername: string) => {
  const updatedUsers = userList.map((username) => {
    // Check if we already have this user with their avatar
    const existingUser = users.find(u => u.username === username);
    
    return {
      id: username,
      name: username,
      username: username,
      avatar: existingUser?.avatar ,
      isAdmin: username === adminUsername,
    };
  });

  setUsers(updatedUsers);
  setIsAdmin(updatedUsers.some(
    (user) => user.id === currentUser?.username && user.isAdmin
  ));
});

        connection.on("MessageReactionUpdated", (messageId: number, reactions: Record<string, number>) => {
          setMessages(prev => prev.map(msg => {
            if (msg.id === messageId) {
              return {
                ...msg,
                reactions: Object.entries(reactions).map(([reactionType, count]) => ({
                  messageId,
                  reactionType,
                  user: "",
                  reactedAt: new Date().toISOString(),
                })),
              };
            }
            return msg;
          }));
        });

        connection.on("ReceiveReaction", (messageId: number, reactions: MessageReaction[]) => {
          setMessages(prev => prev.map(msg => 
            msg.id === messageId ? { ...msg, reactions } : msg
          ));
        });

        connection.on("CannotKickCreator", () => {
          setPopupMessage("You cannot remove room creators from their own chats.");
          setKickPopup(true);
        });

        connection.on("Kicked", (reason: string) => {
          setPopupMessage(
            `The room moderator has removed you from this chat ${
              reason === "Other" ? "" : `due to ${reason}`
            }`
          );
          setKickPopup(true);
        });

        await connection.invoke("JoinRoom", parseInt(roomId), currentUser.username);
      } catch (err) {
        console.error("SignalR connection error:", err);
      }
    };

    startConnection();

    return () => {
      if (connection.state === signalR.HubConnectionState.Connected) {
        connection.invoke("LeaveRoom", parseInt(roomId))
          .catch(err => console.error("Error leaving room:", err));
        connection.off("ReceiveMessage");
        connection.off("UpdateUserList");
        connection.off("MessageReactionUpdated");
        connection.off("ReceiveReaction");
        connection.off("CannotKickCreator");
        connection.off("Kicked");
      }
    };
  }, [connection, roomId, currentUser, navigate, toast]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!messageText.trim() || !connection || !roomId || !currentUser) return;
  
    try {
      // Remove temporary ID generation
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
    if (!connection || !roomId || !currentUser) {
      console.error("Missing requirements:", {
        connection: !!connection,
        roomId: !!roomId,
        currentUser: !!currentUser
      });
      return;
    }
  
    try {
      console.log("Attempting to react:", { 
        messageId, 
        reactionType,
        connectionState: connection.state
      });
      
      // Use the correct method name and parameters
      await connection.invoke("ReactToMessage", messageId, reactionType);
      
      console.log("Reaction sent successfully");
    } catch (error) {
      console.error("Detailed reaction error:", {
        error: error instanceof Error ? error.message : error,
        connectionState: connection.state,
        method: "ReactToMessage",
        params: [messageId, reactionType],
        currentUser: currentUser.username
      });
      
      toast({
        title: "Reaction Failed",
        description: "Couldn't send your reaction. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handlePromoteToAdmin = async (userId: string) => {
    if (!connection || !roomId || !isAdmin) return;

    try {
      await connection.invoke("MakeAdmin", parseInt(roomId), userId);
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
    if (room?.creator === userId) {
      setPopupMessage("You cannot remove room creators from their own chats.");
      setKickPopup(true);
      return;
    }

    setUserToKick(userId);
    setShowKickModal(true);
  };

  const confirmKickUser = async () => {
    if (!connection || !roomId || !isAdmin || !selectedReason) return;

    try {
      await connection.invoke(
        "KickUser",
        parseInt(roomId),
        userToKick,
        selectedReason
      );

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
          content: `To maintain a safe space, ${
            currentUser?.username
          } has removed ${userToKick}${
            selectedReason === "Other" ? "" : ` due to ${selectedReason}`
          }`,
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
          <MembersList
            users={users}
            currentUser={currentUser}
            onPromoteUser={handlePromoteToAdmin}
            onKickUser={handleKickUser}
            isAdmin={isAdmin}
            adminUser={adminUser}
          />

          <ChatBox
            room={room}
            messages={messages}
            currentUser={currentUser}
            messageText={messageText}
            onSendMessage={handleSendMessage}
            onMessageTextChange={setMessageText}
            onAddReaction={handleAddReaction}
            users={users}
          />
        </div>

        <KickModal
          show={showKickModal}
          onClose={() => {
            setShowKickModal(false);
            setSelectedReason("");
          }}
          onConfirm={confirmKickUser}
          selectedReason={selectedReason}
          onReasonSelect={setSelectedReason}
        />

        <KickPopup
          show={kickPopup}
          message={popupMessage}
          onClose={handleClosePopup}
        />
      </div>
    </>
  );
}