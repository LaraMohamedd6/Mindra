
import Layout from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, MessageSquare, Heart, Shield } from "lucide-react";

const emergencyContacts = [
  {
    title: "National Suicide Prevention Lifeline",
    phone: "1-800-273-8255",
    description: "24/7 free and confidential support",
    icon: Phone,
  },
  {
    title: "Crisis Text Line",
    phone: "Text HOME to 741741",
    description: "24/7 crisis counseling via text",
    icon: MessageSquare,
  },
];

const resources = [
  {
    title: "Grounding Techniques",
    content: "Use the 5-4-3-2-1 method: Acknowledge 5 things you see, 4 things you can touch, 3 things you hear, 2 things you smell, and 1 thing you taste.",
    icon: Heart,
  },
  {
    title: "Safety Planning",
    content: "Create a personalized safety plan with your counselor or mental health professional for crisis situations.",
    icon: Shield,
  },
];

export default function Emergency() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto text-center mb-12"
        >
          <h1 className="text-4xl font-display font-semibold text-gray-900 mb-4">
            Emergency Resources
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            If you or someone you know is in immediate danger, please call emergency services (911) immediately.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {emergencyContacts.map((contact, index) => (
            <motion.div
              key={contact.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-zenPink/5 border-zenPink/20">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="rounded-full bg-zenPink p-3">
                      <contact.icon className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-xl">{contact.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{contact.description}</p>
                  <Button
                    className="w-full bg-zenPink hover:bg-zenPink/90"
                    size="lg"
                    onClick={() => window.location.href = `tel:${contact.phone.replace(/\D/g,'')}`}
                  >
                    {contact.phone}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {resources.map((resource, index) => (
            <motion.div
              key={resource.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.2 }}
            >
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="rounded-full bg-zenSeafoam p-3">
                      <resource.icon className="h-6 w-6 text-zenSage" />
                    </div>
                    <CardTitle className="text-xl">{resource.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{resource.content}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
