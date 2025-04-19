
import { useState, useRef, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Send, Bot, Link, ExternalLink, RefreshCw } from "lucide-react";
import SectionHeading from "@/components/common/SectionHeading";

interface Message {
  id: number;
  type: "user" | "bot";
  text: string;
  links?: { text: string; url: string }[];
}

// Predefined bot responses
const botResponses = [
  {
    keywords: ["hello", "hi", "hey", "greetings"],
    response: "Hello there! I'm ZenBot, your mental wellness assistant. How can I help you today?",
  },
  {
    keywords: ["how are you", "how's it going"],
    response: "I'm just a bot, but I'm here and ready to help you! How are you feeling today?",
  },
  {
    keywords: ["stressed", "stress", "anxious", "anxiety", "worried", "overwhelmed"],
    response: "I'm sorry to hear you're feeling this way. Remember that stress is a normal response, but there are ways to manage it. Have you tried any breathing exercises or mindfulness techniques? Our meditation page has some great resources.",
    links: [
      { text: "Visit our Meditation page", url: "/meditation" },
      { text: "Read about anxiety management", url: "/information" }
    ]
  },
  {
    keywords: ["sad", "depressed", "depression", "unhappy", "down"],
    response: "I hear that you're feeling down. These emotions are valid, but remember you don't have to face them alone. Would you like to explore some resources that might help? Remember, if these feelings persist, please consider speaking with a mental health professional.",
    links: [
      { text: "Emergency resources", url: "/emergency" },
      { text: "Learn about depression", url: "/information" }
    ]
  },
  {
    keywords: ["sleep", "insomnia", "can't sleep", "tired", "exhausted"],
    response: "Sleep troubles can significantly impact your mental health. Establishing a consistent sleep routine, limiting screen time before bed, and creating a comfortable sleep environment can help. Our lifestyle page has more tips on improving sleep hygiene.",
    links: [
      { text: "Sleep improvement tips", url: "/lifestyle" }
    ]
  },
  {
    keywords: ["meditation", "meditate", "mindfulness", "calm", "relax", "breathing"],
    response: "Meditation and mindfulness practices are excellent tools for mental wellness! Even just a few minutes daily can make a difference. Would you like to try one of our guided meditations?",
    links: [
      { text: "Try guided meditation", url: "/meditation" }
    ]
  },
  {
    keywords: ["exercise", "workout", "physical activity", "fitness"],
    response: "Physical activity is a great way to boost your mood and reduce stress. Even small amounts of movement can help! Check out our fitness page for student-friendly workout routines.",
    links: [
      { text: "Student fitness routines", url: "/fitness" }
    ]
  },
  {
    keywords: ["study", "exams", "academic", "grades", "homework", "assignments"],
    response: "Academic pressure can be challenging. Breaking tasks into smaller steps, taking regular breaks, and using techniques like the Pomodoro method can help. Our Study Helper has tools designed specifically for students.",
    links: [
      { text: "Visit Study Helper", url: "/study-helper" }
    ]
  },
  {
    keywords: ["help", "resources", "support", "assistance"],
    response: "I'm here to help! ZenZone Connect offers various resources for mental wellness. What specific area would you like assistance with?",
    links: [
      { text: "Mental health information", url: "/information" },
      { text: "Emergency resources", url: "/emergency" },
      { text: "Mood tracking tools", url: "/mood-tracker" }
    ]
  },
  {
    keywords: ["emergency", "crisis", "suicidal", "harm", "hurt"],
    response: "If you're experiencing a mental health emergency or having thoughts of harming yourself, please reach out to emergency services immediately. Our emergency page has hotline numbers and resources for crisis situations.",
    links: [
      { text: "Emergency contacts", url: "/emergency" }
    ]
  }
];

const initialMessages: Message[] = [
  {
    id: 1,
    type: "bot",
    text: "👋 Hi there! I'm ZenBot, your mental wellness assistant. I'm here to help you navigate resources, provide support, or just chat. How are you feeling today?",
    links: [
      { text: "I'm feeling stressed", url: "#stressed" },
      { text: "I need help sleeping", url: "#sleep" },
      { text: "I want to try meditation", url: "#meditation" }
    ]
  }
];

export default function ChatBot() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = () => {
    if (newMessage.trim() === "") return;
    
    const userMessage: Message = {
      id: messages.length + 1,
      type: "user",
      text: newMessage
    };
    
    setMessages(prev => [...prev, userMessage]);
    setNewMessage("");
    setIsTyping(true);
    
    setTimeout(() => {
      const botMessage = generateBotResponse(newMessage);
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000); // Random delay to simulate typing
  };
  
  const handleQuickReply = (text: string) => {
    const userMessage: Message = {
      id: messages.length + 1,
      type: "user",
      text: text
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);
    
    setTimeout(() => {
      const botMessage = generateBotResponse(text);
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const generateBotResponse = (userInput: string): Message => {
    const input = userInput.toLowerCase();
    
    // Find matching predefined response
    for (const item of botResponses) {
      if (item.keywords.some(keyword => input.includes(keyword))) {
        return {
          id: messages.length + 2,
          type: "bot",
          text: item.response,
          links: item.links
        };
      }
    }
    
    // Default response if no matches
    return {
      id: messages.length + 2,
      type: "bot",
      text: "I'm not sure how to help with that specific topic yet. Would you like to explore some of our wellness resources instead?",
      links: [
        { text: "Meditation resources", url: "/meditation" },
        { text: "Mental health information", url: "/information" },
        { text: "Emergency support", url: "/emergency" }
      ]
    };
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const resetChat = () => {
    setMessages(initialMessages);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <SectionHeading 
          title="ZenBot Assistant" 
          subtitle="Your personal mental wellness companion"
          centered={true}
        />

        <div className="max-w-3xl mx-auto mt-8">
          <Card className="border-zenSeafoam">
            <CardHeader className="bg-gradient-to-r from-zenSeafoam/30 to-zenMint/30 flex flex-row items-center space-y-0 gap-3 pb-4">
              <div className="bg-zenSage rounded-full p-2">
                <Bot className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle>ZenBot</CardTitle>
                <p className="text-sm text-gray-500">Mental wellness assistant</p>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="ml-auto" 
                onClick={resetChat}
                title="Reset conversation"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="h-[500px] flex flex-col">
                {/* Messages Area */}
                <div className="flex-grow p-4 overflow-y-auto bg-gray-50">
                  <AnimatePresence>
                    {messages.map((msg) => (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                        className={`flex mb-4 ${
                          msg.type === "user" ? "justify-end" : "justify-start"
                        }`}
                      >
                        {msg.type === "bot" && (
                          <Avatar className="h-8 w-8 mr-2">
                            <AvatarImage src="/placeholder.svg" />
                            <AvatarFallback>
                              <Bot className="h-4 w-4" />
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <div className="max-w-xs sm:max-w-md">
                          <div
                            className={`px-4 py-2 rounded-lg ${
                              msg.type === "user"
                                ? "bg-zenSage text-white"
                                : "bg-white border border-gray-200"
                            }`}
                          >
                            <p className="whitespace-pre-wrap">{msg.text}</p>
                          </div>
                          {msg.links && (
                            <div className="mt-2 flex flex-wrap gap-2">
                              {msg.links.map((link, i) => (
                                <Button
                                  key={i}
                                  variant="outline"
                                  size="sm"
                                  className="text-xs bg-white"
                                  onClick={() => link.url.startsWith('#') 
                                    ? handleQuickReply(link.text) 
                                    : window.location.href = link.url
                                  }
                                >
                                  {link.url.startsWith('#') ? (
                                    <>{link.text}</>
                                  ) : (
                                    <>
                                      <ExternalLink className="h-3 w-3 mr-1" />
                                      {link.text}
                                    </>
                                  )}
                                </Button>
                              ))}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                    {isTyping && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex mb-4 justify-start"
                      >
                        <Avatar className="h-8 w-8 mr-2">
                          <AvatarFallback>
                            <Bot className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="bg-white border border-gray-200 px-4 py-2 rounded-lg">
                          <div className="flex space-x-1">
                            <div className="h-2 w-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                            <div className="h-2 w-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '200ms' }}></div>
                            <div className="h-2 w-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '400ms' }}></div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                    <div ref={messagesEndRef} />
                  </AnimatePresence>
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-gray-200 bg-white">
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
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
