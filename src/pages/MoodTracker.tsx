
import Layout from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Cloud,
  Cloudy,
  Sun,
  CloudRain,
  CloudLightning,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const moods = [
  { icon: Sun, label: "Great", color: "text-yellow-500" },
  { icon: Cloud, label: "Good", color: "text-blue-400" },
  { icon: Cloudy, label: "Okay", color: "text-gray-500" },
  { icon: CloudRain, label: "Low", color: "text-gray-600" },
  { icon: CloudLightning, label: "Struggling", color: "text-purple-500" },
];

export default function MoodTracker() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto text-center mb-12"
        >
          <h1 className="text-4xl font-display font-semibold text-gray-900 mb-4">
            Daily Mood Tracker
          </h1>
          <p className="text-lg text-gray-600">
            Track your emotional well-being and identify patterns in your mood.
          </p>
        </motion.div>

        <div className="max-w-2xl mx-auto">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>How are you feeling today?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {moods.map((mood) => (
                  <Button
                    key={mood.label}
                    variant="outline"
                    className="flex flex-col items-center gap-2 h-auto py-4"
                  >
                    <mood.icon className={`h-8 w-8 ${mood.color}`} />
                    <span>{mood.label}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Weekly Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Track your mood patterns over time.</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Journal Entry</CardTitle>
                </CardHeader>
                <CardContent>
                  <textarea
                    className="w-full h-32 p-2 border rounded-md"
                    placeholder="Write about your day..."
                  />
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
