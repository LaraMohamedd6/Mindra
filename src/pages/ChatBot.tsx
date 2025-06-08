import { useState, useEffect, useRef } from "react";
import {
  Bot,
  Send,
  ThumbsUp,
  ThumbsDown,
  Loader2,
  AlertTriangle,
  InfoIcon,
  ShieldCheck,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Header from "../components/layout/Header";
import { toast } from "sonner";

// Types for chat messages and history
interface ChatMessage {
  id: number;
  type: "user" | "bot";
  content: string;
  timestamp: string;
  liked?: boolean;
  disliked?: boolean;
}

interface ChatHistoryItem {
  id: number;
  userMessage: string;
  botReply: string;
  timestamp: string;
}

const suggestedQuestions = [
  "How do i know if i have Depression?",
  "I am feeling anxious lately",
  "What are the types of depression?",
  "I am feeling stressed lately",
  "What's the difference between anxiety and stress?",
];

const initialBotMessage = {
  id: 1,
  type: "bot" as const,
  content: "Hi there! Welcome to Zenith. I'm your mental wellness assistant. How can I help you today?",
  timestamp: new Date().toISOString(),
  liked: false,
  disliked: false,
};

const ChatBot = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([initialBotMessage]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const token = localStorage.getItem("token");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Fetch chat history when component mounts
  useEffect(() => {
    const fetchChatHistory = async () => {
      if (!token) {
        setMessages([initialBotMessage]);
        return;
      }

      try {
        const response = await fetch(
          `https://localhost:7223/api/Prediction/chat-history`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch chat history");
        }

        const history: ChatHistoryItem[] = await response.json();

        if (history.length === 0) {
          // No history found, keep the initial welcome message
          return;
        }

        // Transform history data to match our message format
        const formattedHistory: ChatMessage[] = [];

        history.forEach((item) => {
          // Add user message
          if (item.userMessage) {
            formattedHistory.push({
              id: formattedHistory.length + 1,
              type: "user",
              content: item.userMessage,
              timestamp: item.timestamp,
              liked: false,
              disliked: false,
            });
          }
          
          // Add bot reply
          if (item.botReply) {
            formattedHistory.push({
              id: formattedHistory.length + 1,
              type: "bot",
              content: item.botReply,
              timestamp: item.timestamp,
              liked: false,
              disliked: false,
            });
          }
        });

        setMessages(formattedHistory);
      } catch (error) {
        console.error("Error fetching chat history:", error);
        // On error, still show the initial welcome message
        setMessages([initialBotMessage]);
      }
    };

    fetchChatHistory();
  }, [token]);

  const handleLike = (messageId: number) => {
    setMessages((prev) =>
      prev.map((message) =>
        message.id === messageId
          ? { ...message, liked: !message.liked, disliked: false }
          : message
      )
    );
  };

  const handleDislike = (messageId: number) => {
    setMessages((prev) =>
      prev.map((message) =>
        message.id === messageId
          ? { ...message, disliked: !message.disliked, liked: false }
          : message
      )
    );
  };

  

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      id: messages.length + 1,
      type: "user",
      content: input,
      timestamp: new Date().toISOString(),
      liked: false,
      disliked: false,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch(
        `https://localhost:7223/api/Prediction/chatbot`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            Message: input,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to get response from chatbot");
      }

      const botResponse = await response.text();

      const botMessage: ChatMessage = {
        id: messages.length + 2,
        type: "bot",
        content: botResponse,
        timestamp: new Date().toISOString(),
        liked: false,
        disliked: false,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error calling chatbot API:", error);
      toast.error("Failed to get response from chatbot");

      const errorMessage: ChatMessage = {
        id: messages.length + 2,
        type: "bot",
        content:
          "I'm having trouble connecting right now. Please try again later.",
        timestamp: new Date().toISOString(),
        liked: false,
        disliked: false,
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <>
      <div>
        <Header />
      </div>
      <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Chat Section */}
        <div className="lg:col-span-8 space-y-6">
          <Card className="border-[#CFECE0] shadow-lg overflow-hidden">
            <CardHeader className="bg-[#EBFFF5] border-b border-[#CFECE0] py-3 px-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12 border-2 border-[#7CAE9E]/20">
                  <AvatarImage
                    src="/src/assets/images/bott.png"
                    className="bg-[#EBFFF5]"
                  />
                  <AvatarFallback className="bg-[#7CAE9E] text-white">
                    <Bot className="h-6 w-6" />
                  </AvatarFallback>
                </Avatar>

                <div>
                  <CardTitle className="flex items-center gap-2 text-[#7CAE9E]">
                    MindfulBot
                    <Badge className="bg-[#E69EA2] text-white hover:bg-[#E69EA2]/90">
                      AI Assistant
                    </Badge>
                  </CardTitle>
                  <CardDescription className="text-[#7CAE9E]/80">
                    Your mental wellness companion
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              <div className="flex flex-col h-[572px]">
                {/* Messages Section */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.type === "user"
                          ? "justify-end"
                          : "justify-start"
                      } animate-fade-in`}
                    >
                      <div
                        className={`flex gap-3 max-w-[80%] ${
                          message.type === "user" ? "flex-row-reverse" : ""
                        }`}
                      >
                        {message.type === "bot" && (
                          <Avatar className="h-8 w-8 mt-0.5">
                            <AvatarImage src="/src/assets/images/bott.png" />
                            <AvatarFallback className="bg-[#7CAE9E] text-white">
                              <Bot className="h-4 w-4" />
                            </AvatarFallback>
                          </Avatar>
                        )}

                        <div
                          className={`
                          p-3 rounded-lg transition-all duration-300
                          ${
                            message.type === "bot"
                              ? "bg-[#EBFFF5] border border-[#CFECE0] rounded-tl-none text-[#525051] font-normal font-sans text-[12px] tracking-wide leading-relaxed"
                              : "bg-[#F8E8E9] border border-[#E69EA2] text-[#E69EA2] rounded-tr-none"
                          }
                        `}
                        >
                          <div
                            className="text-sm whitespace-pre-line"
                            dangerouslySetInnerHTML={{
                              __html: message.content.replace(
                                /\*\*(.*?)\*\*/g,
                                "<strong>$1</strong>"
                              ),
                            }}
                          />

                          {message.type === "bot" && (
                            <div className="flex items-center justify-end gap-2 mt-2">
                              <button
                                onClick={() => handleLike(message.id)}
                                className={`h-6 w-6 rounded-full hover:bg-[#CFECE0] flex items-center justify-center ${
                                  message.liked
                                    ? "text-white bg-[#7CAE9E]"
                                    : "text-[#7CAE9E]"
                                }`}
                              >
                                <ThumbsUp
                                  className={`h-4 w-4 ${
                                    message.liked ? "font-bold" : ""
                                  }`}
                                />
                              </button>
                              <button
                                onClick={() => handleDislike(message.id)}
                                className={`h-6 w-6 rounded-full hover:bg-[#E69EA2]/10 flex items-center justify-center ${
                                  message.disliked
                                    ? "text-white bg-[#E69EA2]"
                                    : "text-[#E69EA2]"
                                }`}
                              >
                                <ThumbsDown
                                  className={`h-4 w-4 ${
                                    message.disliked ? "font-bold" : ""
                                  }`}
                                />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="flex gap-3 max-w-[80%]">
                        <Avatar className="h-8 w-8 mt-0.5">
                          <AvatarImage src="/placeholder.svg" />
                          <AvatarFallback className="bg-[#7CAE9E] text-white">
                            <Bot className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="bg-[#EBFFF5] border border-[#CFECE0] rounded-tl-none p-3 rounded-lg">
                          <Loader2 className="h-4 w-4 animate-spin text-[#7CAE9E]" />
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Section */}
                <div className="p-4 border-t border-[#CFECE0]">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-2">
                      <Input
                        id="chat-input"
                        placeholder="Type your message..."
                        className="flex-1 border-[#CFECE0] focus-visible:ring-[#7CAE9E] text-[#525051] font-normal font-sans text-[12px] tracking-wide leading-relaxed"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyPress}
                        disabled={isLoading}
                      />
                      <Button
                        onClick={handleSendMessage}
                        className="bg-[#7CAE9E] hover:bg-[#7CAE9E]/90 transition-colors"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <>
                            <Send className="h-4 w-4 mr-2" />
                            Send
                          </>
                        )}
                      </Button>
                    </div>

                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {suggestedQuestions.map((question, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          className="whitespace-nowrap border-[#CFECE0] hover:bg-[#EBFFF5] text-[#7CAE9E] hover:text-[#E69EA2] transition-colors"
                          onClick={() => setInput(question)}
                          disabled={isLoading}
                        >
                          {question}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Information Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          {/* Privacy Notice */}
          <Card className="border-[#CFECE0] shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2 text-[#7CAE9E]">
                <ShieldCheck className="h-5 w-5" />
                Privacy Notice
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <p className="mb-4 text-[#7E676B]">
                Your conversations are private and not used to train our models.
                For serious mental health concerns, please contact a mental
                health professional or emergency services.
              </p>
              <Button
                variant="link"
                className="text-[#E69EA2] p-0 h-auto font-medium"
              >
                View Privacy Policy →
              </Button>
            </CardContent>
          </Card>

          {/* About MindfulBot */}
          <Card className="border-[#CFECE0] shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2 text-[#7CAE9E]">
                <InfoIcon className="h-5 w-5" />
                About MindfulBot
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <p className="text-[#7E676B]">
                MindfulBot uses AI to provide supportive resources and
                techniques for managing stress, anxiety, and other common
                student concerns.
              </p>
            </CardContent>
          </Card>

          {/* Disclaimer */}
          <Card className="border-[#CFECE0] bg-[#FAD5D5]/20 shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2 text-[#E69EA2]">
                <AlertTriangle className="h-5 w-5" />
                Not a Replacement
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <p className="mb-4 text-[#7E676B]">
                MindfulBot is not a substitute for professional mental health
                support. Please visit our Emergency page if you need immediate
                assistance.
              </p>
              <Button
                variant="outline"
                className="w-full border-[#E69EA2] text-[#E69EA2] hover:bg-[#F8E8E9]"
              >
                Visit Emergency Page
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default ChatBot;
