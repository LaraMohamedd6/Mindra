
import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, MessageSquare, Heart, Shield, CheckCircle, Headphones, Flag } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const emergencyContacts = [
  {
    title: "National Suicide Prevention Lifeline",
    phone: "1-800-273-8255",
    description: "24/7 free and confidential support for people in distress",
    icon: Phone,
  },
  {
    title: "Crisis Text Line",
    phone: "Text HOME to 741741",
    description: "24/7 crisis counseling via text message",
    icon: MessageSquare,
  },
  {
    title: "Student Mental Health Helpline",
    phone: "1-855-487-1234",
    description: "Support specifically for college students in crisis",
    icon: Headphones,
  },
];

const resources = [
  {
    title: "5-4-3-2-1 Grounding Technique",
    content: "When feeling overwhelmed, identify 5 things you can see, 4 things you can touch, 3 things you can hear, 2 things you can smell, and 1 thing you can taste. This helps bring you back to the present moment.",
    icon: Heart,
    steps: [
      "Acknowledge 5 things you can see around you",
      "Acknowledge 4 things you can touch around you",
      "Acknowledge 3 things you can hear",
      "Acknowledge 2 things you can smell",
      "Acknowledge 1 thing you can taste"
    ]
  },
  {
    title: "Box Breathing",
    content: "Breathe in for 4 counts, hold for 4 counts, breathe out for 4 counts, hold for 4 counts. Repeat until you feel calmer.",
    icon: Shield,
    steps: [
      "Breathe in slowly to the count of 4",
      "Hold your breath for a count of 4",
      "Exhale slowly to the count of 4",
      "Hold your breath for a count of 4",
      "Repeat the cycle several times"
    ]
  },
  {
    title: "Progressive Muscle Relaxation",
    content: "Tense and then release each muscle group, starting from your toes and moving up to your head.",
    icon: CheckCircle,
    steps: [
      "Find a quiet, comfortable place to sit or lie down",
      "Close your eyes and take a few deep breaths",
      "Tense the muscles in your feet for 5 seconds, then release completely",
      "Work your way up through each muscle group (calves, thighs, etc.)",
      "Focus on the feeling of relaxation after releasing each tension"
    ]
  },
];

const countries = [
  { name: "United States", number: "911" },
  { name: "United Kingdom", number: "999" },
  { name: "Australia", number: "000" },
  { name: "Canada", number: "911" },
  { name: "New Zealand", number: "111" },
  { name: "India", number: "112" },
  { name: "Germany", number: "112" },
  { name: "France", number: "112" },
  { name: "Japan", number: "119" },
  { name: "China", number: "120" },
];

export default function Emergency() {
  const [showFloatingButton, setShowFloatingButton] = useState(true);
  const [pulseAnimation, setPulseAnimation] = useState(false);
  const { toast } = useToast();

  // Effect to create pulsing animation every 10 seconds
  useEffect(() => {
    const intervalId = setInterval(() => {
      setPulseAnimation(true);
      setTimeout(() => setPulseAnimation(false), 1000);
    }, 10000);

    return () => clearInterval(intervalId);
  }, []);

  const handleEmergencyCall = (number: string) => {
    window.location.href = `tel:${number.replace(/\D/g, '')}`;
    toast({
      title: "Calling Emergency Services",
      description: "Connecting you to help...",
    });
  };

  return (
    <Layout>
      <div 
        className="relative bg-gradient-to-b from-red-50 to-white"
        style={{ 
          backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23ff0000\" fill-opacity=\"0.05\"%3E%3Cpath d=\"M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')"
        }}
      >
        <div className="container mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto text-center mb-8"
          >
            <h1 className="text-4xl font-display font-semibold text-red-600 mb-4">
              Emergency Resources
            </h1>
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-8 rounded shadow-md">
              <p className="text-lg font-semibold">
                If you or someone you know is in immediate danger, please call emergency services (911) immediately.
              </p>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {emergencyContacts.map((contact, index) => (
              <motion.div
                key={contact.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <div className="absolute inset-0 bg-red-500 rounded-lg opacity-10 animate-pulse"></div>
                <Card className="bg-white border-red-200 relative z-10">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className="rounded-full bg-red-500 p-3">
                        <contact.icon className="h-6 w-6 text-white" />
                      </div>
                      <CardTitle className="text-xl">{contact.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">{contact.description}</p>
                    <Button
                      className="w-full bg-red-500 hover:bg-red-600"
                      size="lg"
                      onClick={() => handleEmergencyCall(contact.phone)}
                    >
                      <Phone className="mr-2 h-4 w-4" /> {contact.phone}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto text-center mb-8"
          >
            <h2 className="text-3xl font-display font-semibold text-gray-800 mb-4">
              Grounding Techniques
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              When you're feeling overwhelmed or anxious, try these techniques to help ground yourself in the present moment.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {resources.map((resource, index) => (
              <motion.div
                key={resource.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.2 }}
              >
                <Card className="h-full">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className="rounded-full bg-zenSeafoam p-3">
                        <resource.icon className="h-6 w-6 text-zenSage" />
                      </div>
                      <CardTitle className="text-xl">{resource.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">{resource.content}</p>
                    <ol className="list-decimal pl-5 space-y-2 text-gray-600">
                      {resource.steps.map((step, stepIndex) => (
                        <li key={stepIndex}>{step}</li>
                      ))}
                    </ol>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto text-center mb-8"
          >
            <h2 className="text-3xl font-display font-semibold text-gray-800 mb-4">
              Emergency Numbers by Country
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Find emergency service numbers for different countries.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-12">
            {countries.map((country, index) => (
              <motion.div
                key={country.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 text-center"
              >
                <div className="flex items-center justify-center mb-2">
                  <Flag className="h-5 w-5 text-red-500 mr-2" />
                  <p className="font-medium">{country.name}</p>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full border-red-200 hover:bg-red-50"
                  onClick={() => handleEmergencyCall(country.number)}
                >
                  {country.number}
                </Button>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Floating Call Button */}
        <AnimatePresence>
          {showFloatingButton && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ 
                opacity: 1, 
                scale: pulseAnimation ? 1.1 : 1, 
                y: 0 
              }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              transition={{ duration: 0.3 }}
              className="fixed bottom-10 right-10 z-50"
            >
              <Button
                size="lg"
                className="bg-red-600 hover:bg-red-700 shadow-lg flex items-center gap-2 rounded-full px-6"
                onClick={() => handleEmergencyCall("911")}
              >
                <Phone className="h-5 w-5 animate-pulse" />
                <span>Call for Help</span>
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Layout>
  );
}
