import { useState, useCallback, useEffect, useRef } from "react";
import { Send, Users, Phone, Ban, Reply } from "lucide-react";
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import * as signalR from "@microsoft/signalr";


// Debounce utility to limit frequent function calls
const debounce = <T extends (...args: P) => void, P extends unknown[]>(func: T, wait: number) => {
  let timeout: NodeJS.Timeout | null = null;
  return (...args: P) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
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
  replyTo?: Message | null; // Added for reply feature
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

interface ChatMessageProps {
  message: Message;
  currentUser: ChatUser;
  onAddReaction: (messageId: number, reactionType: string) => void;
  onReply: (message: Message) => void;
}

const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  currentUser,
  onAddReaction,
  onReply,
}) => {
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  const isCurrentUser = message.user.id === currentUser.id;
  const reactionEmojis = ["👍", "❤️", "😄", "😢", "👏", "🙏"];
  const messageRef = useRef<HTMLDivElement>(null);

  const groupedReactions = message.reactions.reduce((acc, reaction) => {
    const existing = acc.find(r => r.reactionType === reaction.reactionType);
    if (existing) {
      existing.count++;
      if (reaction.user === currentUser.id) {
        existing.hasUserReacted = true;
      }
    } else {
      acc.push({
        reactionType: reaction.reactionType,
        count: 1,
        hasUserReacted: reaction.user === currentUser.id
      });
    }
    return acc;
  }, [] as { reactionType: string; count: number; hasUserReacted: boolean }[]);

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
    <div ref={messageRef} className={`flex gap-3 ${isCurrentUser ? "flex-row-reverse" : ""} animate-fade-in`} id={`message-${message.id}`}>
      <Avatar className="h-8 w-8 flex-shrink-0">
        <AvatarFallback 
          className={`font-medium ${
            isCurrentUser 
              ? "bg-[#CFECE0] text-[#7CAE9E]" 
              : "bg-[#F8E8E9] text-[#E69EA2]"
          }`}
        >
          {message.user.username[0].toUpperCase()}
        </AvatarFallback>
      </Avatar>

      <div className={`max-w-[75%] ${isCurrentUser ? "items-end" : "items-start"}`}>
        <div className={`flex items-center gap-2 mb-1 ${isCurrentUser ? "flex-row-reverse" : ""}`}>
          <span className="font-medium text-sm">{message.user.name}</span>
          <span className="text-xs text-muted-foreground">
            {new Date(message.timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>

        <div className={`relative group rounded-lg p-3 ${
          isCurrentUser
            ? "bg-[#EBFFF5] text-[#7CAE9E] rounded-tr-none border-[#CFECE0] border"
            : "bg-[#F8E8E9] text-[#E69EA2] rounded-tl-none border-[#FEC0B3] border"
        }`}>
          {message.replyTo && (
            <div
              className={`mb-2 p-2 rounded bg-white/50 cursor-pointer hover:bg-white/70 transition-colors`}
              onClick={() => {
                document.getElementById(`message-${message.replyTo?.id}`)?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              <p className="text-xs font-medium text-gray-600">
                Replying to {message.replyTo.user.name}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {message.replyTo.content}
              </p>
            </div>
          )}

          <p className="text-sm whitespace-pre-wrap">{message.content}</p>

          {groupedReactions.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {groupedReactions.map((reaction, i) => (
                <button
                  key={i}
                  onClick={() => onAddReaction(message.id, reaction.reactionType)}
                  className={`text-xs rounded-full px-2 py-0.5 transition-all ${
                    reaction.hasUserReacted
                      ? isCurrentUser
                        ? "bg-[#CFECE0] text-[#7CAE9E]"
                        : "bg-[#FEC0B3] text-[#E69EA2]"
                      : "bg-white/80"
                  }`}
                >
                  <span>
                    {reaction.reactionType} {reaction.count}
                  </span>
                </button>
              ))}
            </div>
          )}

          <div className="absolute flex gap-1 -bottom-4 opacity-0 group-hover:opacity-100 transition-all">
            <button
              onClick={() => setShowReactionPicker(!showReactionPicker)}
              className={`rounded-full p-1 hover:scale-110 ${
                isCurrentUser
                  ? "bg-[#EBFFF5] text-[#7CAE9E]"
                  : "bg-[#F8E8E9] text-[#E69EA2]"
              } ${isCurrentUser ? "-left-3" : "-right-3"}`}
            >
              <span className="text-sm">😊</span>
            </button>
            <button
              onClick={() => onReply(message)}
              className={`rounded-full p-1 hover:scale-110 ${
                isCurrentUser
                  ? "bg-[#EBFFF5] text-[#7CAE9E]"
                  : "bg-[#F8E8E9] text-[#E69EA2]"
              } ${isCurrentUser ? "-left-8" : "-right-8"}`}
            >
              <Reply className="h-4 w-4" />
            </button>
          </div>

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

interface ChatBoxProps {
  room: ChatRoom;
  messages: Message[];
  currentUser: ChatUser;
  messageText: string;
  onSendMessage: (message: string) => void; // Updated to accept formatted message
  onMessageTextChange: (text: string) => void;
  onAddReaction: (messageId: number, reactionType: string) => void;
  users: ChatUser[];
  connection?: signalR.HubConnection | null;
}

export const ChatBox: React.FC<ChatBoxProps> = ({
  room,
  messages,
  currentUser,
  messageText,
  onSendMessage,
  onMessageTextChange,
  onAddReaction,
  users,
  connection,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const typingTimeoutRef = useRef<{ [username: string]: NodeJS.Timeout }>({});
  const [selectedReplyMessage, setSelectedReplyMessage] = useState<Message | null>(null);

  // Debounced typing notification for server
  const sendTypingNotification = useCallback(
    debounce((roomId: number, username: string) => {
      if (!connection) return;
      connection.invoke("SendTypingNotification", roomId, username).catch(err => {
        console.error("Error sending typing notification:", err);
      });
    }, 0),
    [connection]
  );

  const handleTyping = useCallback(() => {
    if (!connection || !room.id || !currentUser || !messageText.trim()) {
      if (typingTimeoutRef.current[currentUser.username]) {
        clearTimeout(typingTimeoutRef.current[currentUser.username]);
        delete typingTimeoutRef.current[currentUser.username];
      }
      return;
    }

    sendTypingNotification(room.id, currentUser.username);
  }, [connection, room.id, currentUser, sendTypingNotification, messageText]);

  useEffect(() => {
    if (!connection) return;

    connection.on("ReceiveTypingNotification", (username: string) => {
      if (username !== currentUser.username) {
        setTypingUsers(prev => {
          if (!prev.includes(username)) {
            return [...prev, username];
          }
          return prev;
        });

        if (typingTimeoutRef.current[username]) {
          clearTimeout(typingTimeoutRef.current[username]);
        }
        typingTimeoutRef.current[username] = setTimeout(() => {
          setTypingUsers(prev => prev.filter(user => user !== username));
          delete typingTimeoutRef.current[username];
        }, 1000);
      }
    });

    return () => {
      connection.off("ReceiveTypingNotification");
      Object.values(typingTimeoutRef.current).forEach(clearTimeout);
      typingTimeoutRef.current = {};
    };
  }, [connection, currentUser.username]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typingUsers]);

  const handleSend = () => {
    if (!messageText.trim()) return;
    let formattedMessage = messageText;
    if (selectedReplyMessage) {
      // Prepend reply context
      formattedMessage = `> Replying to ${selectedReplyMessage.user.name}: ${selectedReplyMessage.content}\n\n${messageText}`;
    }
    onSendMessage(formattedMessage);
    setSelectedReplyMessage(null);
  };

  const handleReply = (message: Message) => {
    setSelectedReplyMessage(message);
  };

  return (
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
                  {users.length} {users.length === 1 ? "member" : "members"} • Moderated
                </CardDescription>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-[#7CAE9E]">
              <Phone className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

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
              onAddReaction={onAddReaction}
              onReply={handleReply}
            />
          ))}
          {typingUsers.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="flex justify-start items-center gap-2 my-2"
            >
              <div className="bg-[#F8E8E9] px-3 py-1 rounded-full text-xs text-[#E69EA2] animate-pulse">
                {typingUsers.length === 1
                  ? `${typingUsers[0]} is typing...`
                  : `${typingUsers.length} users are typing...`}
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </CardContent>

      <CardFooter className="border-t border-[#CFECE0] p-4 flex flex-col gap-2">
        {selectedReplyMessage && (
          <div className="flex items-center gap-2 w-full bg-[#EBFFF5] p-2 rounded border border-[#CFECE0]">
            <div className="flex-1">
              <p className="text-xs font-medium text-[#7CAE9E]">
                Replying to {selectedReplyMessage.user.name}
              </p>
              <p className="text-xs text-[#7CAE9E] truncate">
                {selectedReplyMessage.content}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSelectedReplyMessage(null)}
              className="text-[#7CAE9E]"
            >
              <span className="text-sm">✖</span>
            </Button>
          </div>
        )}
        <div className="flex items-center gap-2 w-full">
          <Input
            placeholder="Type your message..."
            value={messageText}
            onChange={(e) => {
              onMessageTextChange(e.target.value);
              handleTyping();
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            className="border-[#CFECE0] focus-visible:ring-[#7CAE9E]"
          />
          <Button
            onClick={handleSend}
            className="bg-[#7CAE9E] hover:bg-[#7CAE9E]/90"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

interface KickModalProps {
  show: boolean;
  onClose: () => void;
  onConfirm: () => void;
  selectedReason: string;
  onReasonSelect: (reason: string) => void;
}

const KICK_REASONS = [
  "Inappropriate behavior",
  "Spamming messages",
  "Harassment",
  "Violating community guidelines",
  "Sharing harmful content",
  "Hate speech or discrimination",
  "Other",
];

export const KickModal: React.FC<KickModalProps> = ({
  show,
  onClose,
  onConfirm,
  selectedReason,
  onReasonSelect,
}) => {
  if (!show) return null;

  return (
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
                onClick={() => onReasonSelect(reason)}
              >
                <p className="text-sm">{reason}</p>
              </div>
            ))}
          </CardContent>

          <CardFooter className="bg-gray-50/70 px-6 py-4 flex justify-end gap-2 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={onConfirm}
              disabled={!selectedReason}
              className="bg-[#E69EA2] hover:bg-[#E69EA2]/90 text-white"
            >
              Confirm Kick
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </motion.div>
  );
};

interface KickPopupProps {
  show: boolean;
  message: string;
  onClose: () => void;
}

export const KickPopup: React.FC<KickPopupProps> = ({
  show,
  message,
  onClose,
}) => {
  if (!show) return null;

  return (
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
                  {message}
                </motion.p>
                <motion.p
                  className="text-sm text-muted-foreground mt-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  Feel free to explore other rooms or create your own safe space
                  where you'll feel most comfortable.
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
                onClick={onClose}
                className="bg-[#E69EA2] hover:bg-[#E69EA2]/90 text-white shadow-sm px-6 py-2 rounded-full"
              >
                <span>Understand</span>
              </Button>
            </motion.div>
          </CardFooter>
        </Card>
      </motion.div>
    </motion.div>
  );
};