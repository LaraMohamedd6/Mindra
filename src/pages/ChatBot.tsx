import { useState } from "react";
import { Bot, Send, ThumbsUp, ThumbsDown, InfoIcon, AlertTriangle, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

// Sample initial message
const initialMessages = [
  {
    id: 1,
    type: "bot",
    content: "Hi there! I'm Zenith, your mental wellness assistant. How can I help you today?",
    timestamp: new Date(Date.now() - 2000).toISOString()
  }
];

const suggestedQuestions = [
  "How can I manage exam anxiety?",
  "What are some quick stress relief techniques?",
  "How can I improve my sleep quality?",
  "What should I do if I'm feeling overwhelmed?",
  "How can I stay motivated with my studies?"
];

const ChatBot = () => {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");

  const handleSendMessage = () => {
    if (!input.trim()) return;
    
    const userMessage = {
      id: messages.length + 1,
      type: "user",
      content: input,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    
    setTimeout(() => {
      const botMessage = {
        id: messages.length + 2,
        type: "bot",
        content: getBotResponse(input),
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, botMessage]);
    }, 1000);
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  // Simple response logic - in a real app, this would connect to an AI service
  const getBotResponse = (userInput: string) => {
    const input = userInput.toLowerCase();
    
    if (input.includes("anxiety") || input.includes("anxious") || input.includes("exam")) {
      return "Exam anxiety is very common. Try these techniques:\n\n1. **Practice deep breathing**: Inhale for 4 counts, hold for 2, exhale for 6.\n\n2. **Prepare strategically**: Create a study schedule and stick to it.\n\n3. **Visualization**: Imagine yourself successfully completing the exam.\n\n4. **Self-care**: Ensure you're sleeping well, eating properly, and taking breaks.\n\nWould you like more specific strategies for any of these areas?";
    }
    
    if (input.includes("stress") || input.includes("overwhelmed")) {
      return "When you're feeling stressed or overwhelmed, try these quick relief techniques:\n\n1. **5-4-3-2-1 grounding**: Name 5 things you see, 4 things you can touch, 3 things you hear, 2 things you smell, and 1 thing you taste.\n\n2. **Progressive muscle relaxation**: Tense and then release each muscle group.\n\n3. **Step outside**: Even 5 minutes of fresh air can help reset your nervous system.\n\n4. **Limit inputs**: Turn off notifications and create a calm environment.\n\nDo any of these sound helpful for your situation?";
    }
    
    if (input.includes("sleep") || input.includes("insomnia") || input.includes("tired")) {
      return "Improving sleep quality is crucial for mental health. Here are some evidence-based strategies:\n\n1. **Consistent schedule**: Go to bed and wake up at the same time daily.\n\n2. **Screen curfew**: Avoid screens 1 hour before bedtime.\n\n3. **Bedtime routine**: Create a calming pre-sleep ritual.\n\n4. **Environment**: Keep your bedroom cool, dark, and quiet.\n\n5. **Limit caffeine**: Avoid caffeine after 2pm.\n\nIs there a specific sleep challenge you're facing?";
    }
    
    if (input.includes("motivation") || input.includes("procrastination") || input.includes("focus")) {
      return "Staying motivated with studies can be challenging. Here are some strategies:\n\n1. **Break tasks down**: Divide large assignments into smaller, manageable parts.\n\n2. **Pomodoro technique**: Work for 25 minutes, then take a 5-minute break.\n\n3. **Accountability partner**: Study with a friend or join a study group.\n\n4. **Reward system**: Create small rewards for completing tasks.\n\n5. **Connect to purpose**: Remind yourself why your education matters to you personally.\n\nWhich of these would you like to explore further?";
    }
    
    return "Thank you for sharing that. As a student wellness assistant, I'm here to support you with managing stress, anxiety, academic challenges, and building healthy habits. Could you tell me more about what you're experiencing, or which area you'd like guidance with?";
  };
  
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Main Chat Section */}
      <div className="lg:col-span-8 space-y-6">
        <Card className="border-[#CFECE0] shadow-lg overflow-hidden">
          <CardHeader className="bg-[#EBFFF5] border-b border-[#CFECE0]">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12 border-2 border-[#7CAE9E]/20">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback className="bg-[#7CAE9E] text-white">
                  <Bot className="h-6 w-6" />
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="flex items-center gap-2 text-[#7CAE9E]">
                  MindfulBot
                  <Badge className="bg-[#E69EA2] text-white hover:bg-[#E69EA2]/90">AI Assistant</Badge>
                </CardTitle>
                <CardDescription className="text-[#7CAE9E]/80">
                  Your mental wellness companion
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <div className="flex flex-col h-[500px]">
              {/* Messages Section */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map(message => (
                  <div 
                    key={message.id} 
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
                  >
                    <div className={`flex gap-3 max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse' : ''}`}>
                      {message.type === 'bot' && (
                        <Avatar className="h-8 w-8 mt-0.5">
                          <AvatarImage src="/placeholder.svg" />
                          <AvatarFallback className="bg-[#7CAE9E] text-white">
                            <Bot className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                      )}
                      
                      <div className={`
                        p-3 rounded-lg transition-all duration-300
                        ${message.type === 'bot' 
                          ? 'bg-[#EBFFF5] border border-[#CFECE0] rounded-tl-none' 
                          : 'bg-[#F8E8E9] border border-[#E69EA2] text-[#E69EA2] rounded-tr-none'}
                      `}>
                        <div 
                          className="text-sm whitespace-pre-line"
                          dangerouslySetInnerHTML={{ 
                            __html: message.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') 
                          }}
                        />
                        
                        {message.type === 'bot' && (
                          <div className="flex items-center justify-end gap-2 mt-2">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-6 w-6 rounded-full hover:bg-[#CFECE0]"
                            >
                              <ThumbsUp className="h-3 w-3" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-6 w-6 rounded-full hover:bg-[#E69EA2]/10"
                            >
                              <ThumbsDown className="h-3 w-3" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Input Section */}
              <div className="p-4 border-t border-[#CFECE0]">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-2">
                    <Input
                      id="chat-input"
                      placeholder="Type your message..."
                      className="flex-1 border-[#CFECE0] focus-visible:ring-[#7CAE9E]"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyPress}
                    />
                    <Button 
                      onClick={handleSendMessage}
                      className="bg-[#7CAE9E] hover:bg-[#7CAE9E]/90 transition-colors"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Send
                    </Button>
                  </div>
                  
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {suggestedQuestions.map((question, index) => (
                      <Button 
                        key={index}
                        variant="outline"
                        size="sm"
                        className="whitespace-nowrap border-[#CFECE0] hover:bg-[#EBFFF5] text-[#7CAE9E]"
                        onClick={() => setInput(question)}
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
        <Card className="border-[#CFECE0]">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2 text-[#7CAE9E]">
              <ShieldCheck className="h-5 w-5" />
              Privacy Notice
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <p className="mb-4">
              Your conversations are private and not used to train our models. For serious mental health concerns, please contact a mental health professional or emergency services.
            </p>
            <Button variant="link" className="text-[#E69EA2] p-0 h-auto font-medium">
              View Privacy Policy →
            </Button>
          </CardContent>
        </Card>

        {/* About MindfulBot */}
        <Card className="border-[#CFECE0]">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2 text-[#7CAE9E]">
              <InfoIcon className="h-5 w-5" />
              About MindfulBot
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <p>
              MindfulBot uses AI to provide supportive resources and techniques for managing stress, anxiety, and other common student concerns.
            </p>
          </CardContent>
        </Card>

        {/* Disclaimer */}
        <Card className="border-[#CFECE0] bg-[#F8E8E9]/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2 text-[#E69EA2]">
              <AlertTriangle className="h-5 w-5" />
              Not a Replacement
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <p className="mb-4">
              MindfulBot is not a substitute for professional mental health support. Please visit our Emergency page if you need immediate assistance.
            </p>
            <Button variant="outline" className="w-full border-[#E69EA2] text-[#E69EA2] hover:bg-[#F8E8E9]">
              Visit Emergency Page
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ChatBot;
