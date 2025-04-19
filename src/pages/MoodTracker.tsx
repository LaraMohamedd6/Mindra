
import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card";
import {
  Cloud,
  Cloudy,
  Sun,
  CloudRain,
  CloudLightning,
  Calendar,
  PlusCircle,
  Clock,
  BarChart3,
  PieChart,
  Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format, startOfWeek, addDays } from "date-fns";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function MoodTracker() {
  const [note, setNote] = useState("");
  const [activities, setActivities] = useState([
    "Studied",
    "Exercised",
    "Social time",
    "Slept well"
  ]);
  const [newActivity, setNewActivity] = useState("");

  const today = new Date();
  const startOfCurrentWeek = startOfWeek(today);
  
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(startOfCurrentWeek, i);
    return {
      date,
      day: format(date, 'EEE'),
      dayNumber: format(date, 'd'),
    };
  });

  const moodData = [
    {
      day: 'Mon',
      mood: 4,
      factors: 'Completed assignment, spent time outside'
    },
    {
      day: 'Tue',
      mood: 3,
      factors: 'Got enough sleep, but stressful exam'
    },
    {
      day: 'Wed',
      mood: 2,
      factors: 'Bad sleep, multiple deadlines'
    },
    {
      day: 'Thu',
      mood: 3,
      factors: 'Met friends, but behind on coursework'
    },
    {
      day: 'Fri',
      mood: 5,
      factors: 'Finished major assignment, relaxed evening'
    },
    {
      day: 'Sat',
      mood: 4,
      factors: 'Social activities, some studying'
    },
    {
      day: 'Sun',
      mood: 3,
      factors: 'Relaxed day, but anxiety about upcoming week'
    }
  ];

  const moods = [
    { icon: Sun, label: "Great", color: "text-yellow-500", value: 5 },
    { icon: Cloud, label: "Good", color: "text-blue-400", value: 4 },
    { icon: Cloudy, label: "Okay", color: "text-gray-500", value: 3 },
    { icon: CloudRain, label: "Low", color: "text-gray-600", value: 2 },
    { icon: CloudLightning, label: "Struggling", color: "text-purple-500", value: 1 },
  ];

  const handleAddActivity = () => {
    if (newActivity.trim() !== "") {
      setActivities([...activities, newActivity]);
      setNewActivity("");
    }
  };

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

        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-zenPink" />
                    Today's Check-in
                    <span className="ml-auto text-sm font-normal text-gray-500">
                      {format(today, 'EEEE, MMMM d')}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <Label className="mb-2 block">How are you feeling today?</Label>
                      <div className="grid grid-cols-5 gap-2">
                        {moods.map((mood) => (
                          <Button
                            key={mood.label}
                            variant="outline"
                            className="flex flex-col items-center gap-2 h-auto py-4 hover:bg-zenLightPink/10 hover:border-zenPink data-[state=selected]:bg-zenLightPink/20 data-[state=selected]:border-zenPink"
                            data-state={mood.label === "Good" ? "selected" : undefined}
                          >
                            <mood.icon className={`h-8 w-8 ${mood.color}`} />
                            <span>{mood.label}</span>
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label className="mb-2 block">What contributed to your mood today?</Label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
                        {activities.map((activity, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            className="justify-start data-[state=selected]:bg-zenSeafoam/20 data-[state=selected]:border-zenSage"
                            data-state={index < 2 ? "selected" : undefined}
                          >
                            <Check className="mr-2 h-4 w-4" />
                            {activity}
                          </Button>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Input 
                          placeholder="Add new factor..." 
                          value={newActivity} 
                          onChange={(e) => setNewActivity(e.target.value)}
                          className="flex-1"
                        />
                        <Button 
                          onClick={handleAddActivity}
                          variant="outline"
                          size="icon"
                        >
                          <PlusCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="note" className="mb-2 block">Journal Entry (Optional)</Label>
                      <Textarea
                        id="note"
                        placeholder="Write about your day..."
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        className="h-32"
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="ml-auto bg-zenSage hover:bg-zenSage/90">
                    Save Entry
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>
                      <div className="flex items-center">
                        <BarChart3 className="h-5 w-5 mr-2 text-zenSage" />
                        Weekly Mood Trends
                      </div>
                    </CardTitle>
                    <Button variant="outline" size="sm" className="text-sm">
                      <Calendar className="h-4 w-4 mr-2" /> April 2025
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={moodData}
                        margin={{
                          top: 5,
                          right: 20,
                          left: 0,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="day" />
                        <YAxis 
                          domain={[1, 5]} 
                          ticks={[1, 2, 3, 4, 5]} 
                          tickFormatter={(value) => {
                            const labels = ["Struggling", "Low", "Okay", "Good", "Great"];
                            return labels[value - 1];
                          }}
                        />
                        <Tooltip 
                          formatter={(value, name, props) => {
                            const mood = moods.find(m => m.value === value);
                            return [`${mood?.label} (${value}/5)`, 'Mood'];
                          }}
                          labelFormatter={(label) => `${label}: ${moodData.find(d => d.day === label)?.factors}`}
                        />
                        <Bar 
                          dataKey="mood" 
                          fill="#7CAE9E"
                          radius={[4, 4, 0, 0]} 
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="h-5 w-5 mr-2 text-zenPink" />
                    Recent Entries
                  </CardTitle>
                </CardHeader>
                <CardContent className="max-h-[320px] overflow-y-auto">
                  <div className="space-y-4">
                    {weekDays.map((day, index) => (
                      <div key={index} className="flex items-center p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
                        <div className="text-center mr-4 w-12">
                          <div className="text-sm font-bold">{day.day}</div>
                          <div className="text-2xl text-gray-600">{day.dayNumber}</div>
                        </div>
                        {index < 5 ? (
                          <div className="flex-1">
                            <div className="flex items-center">
                              {(() => {
                                const Mood = moods[4 - index].icon;
                                return <Mood className={`h-5 w-5 ${moods[4 - index].color}`} />;
                              })()}
                              <span className="ml-2 font-medium">{moods[4 - index].label}</span>
                            </div>
                            <p className="text-sm text-gray-500 mt-1">
                              {moodData[index].factors}
                            </p>
                          </div>
                        ) : (
                          <div className="flex-1 text-gray-400 italic">No entry yet</div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="bg-gray-50 border-t">
                  <Button variant="link" size="sm" className="mx-auto text-zenSage">
                    View All Entries
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <PieChart className="h-5 w-5 mr-2 text-zenSage" />
                    Mood Insights
                  </CardTitle>
                  <CardDescription>
                    Based on your recent entries
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="factors">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="factors">Top Factors</TabsTrigger>
                      <TabsTrigger value="patterns">Patterns</TabsTrigger>
                    </TabsList>
                    <TabsContent value="factors" className="pt-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-2 h-6 bg-green-500 rounded-full mr-3"></div>
                          <span>Exercise</span>
                        </div>
                        <span className="text-sm font-medium text-gray-600">+27%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-2 h-6 bg-blue-500 rounded-full mr-3"></div>
                          <span>Good Sleep</span>
                        </div>
                        <span className="text-sm font-medium text-gray-600">+23%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-2 h-6 bg-red-500 rounded-full mr-3"></div>
                          <span>Deadlines</span>
                        </div>
                        <span className="text-sm font-medium text-gray-600">-18%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-2 h-6 bg-purple-500 rounded-full mr-3"></div>
                          <span>Social Time</span>
                        </div>
                        <span className="text-sm font-medium text-gray-600">+15%</span>
                      </div>
                    </TabsContent>
                    <TabsContent value="patterns" className="pt-4">
                      <div className="space-y-3 text-sm">
                        <p>
                          <span className="font-medium">Best day:</span> Friday
                        </p>
                        <p>
                          <span className="font-medium">Most challenging:</span> Wednesday
                        </p>
                        <p>
                          <span className="font-medium">Key insight:</span> Your mood is typically better on days when you exercise and spend time outdoors.
                        </p>
                        <p>
                          <span className="font-medium">Suggestion:</span> Consider scheduling physical activities mid-week to help with Wednesday slumps.
                        </p>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
