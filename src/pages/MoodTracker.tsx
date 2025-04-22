import { useState, useEffect, useRef } from "react";
import Layout from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card";
import {
  Smile,
  Meh,
  Frown,
  Angry,
  Calendar,
  PlusCircle,
  Clock,
  BarChart2,
  Check,
  Activity,
  Book,
  Users,
  Moon,
  Coffee,
  Music,
  Dumbbell,
  ChevronRight,
  PieChart
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { format, startOfWeek, addDays, isToday, isSameDay, parseISO } from "date-fns";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

// Replace with your actual mood banner image path
import moodBanner from "@/assets/images/mood-banner3.avif";

interface Mood {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  color: string;
  value: number;
  bgColor: string;
}

interface MoodEntry {
  date: string;
  mood: number;
  activities: string[];
}

interface ChartData {
  day: string;
  date: string;
  mood: number;
  factors: string;
}

interface PatternsInsight {
  bestDay: string | null;
  worstDay: string | null;
  avgMood: string;
  commonActivities: { activity: string; count: number }[];
}

const MOODS: Mood[] = [
  { 
    icon: Smile, 
    label: "Excellent", 
    color: "text-zenGreen", 
    value: 5,
    bgColor: "bg-zenGreen/10"
  },
  { 
    icon: Smile, 
    label: "Good", 
    color: "text-zenBlue", 
    value: 4,
    bgColor: "bg-zenBlue/10"
  },
  { 
    icon: Meh, 
    label: "Neutral", 
    color: "text-gray-500", 
    value: 3,
    bgColor: "bg-gray-100"
  },
  { 
    icon: Frown, 
    label: "Poor", 
    color: "text-zenYellow", 
    value: 2,
    bgColor: "bg-zenYellow/10"
  },
  { 
    icon: Angry, 
    label: "Terrible", 
    color: "text-zenRed", 
    value: 1,
    bgColor: "bg-zenRed/10"
  },
];

const DEFAULT_ACTIVITIES = [
  "Exercised",
  "Studied",
  "Socialized",
  "Good sleep",
  "Healthy meals",
  "Outdoor time",
  "Creative work",
  "Meditated",
  "Caffeine",
  "Music",
  "Gaming"
];

const ACTIVITY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  "Exercised": Dumbbell,
  "Studied": Book,
  "Socialized": Users,
  "Good sleep": Moon,
  "Healthy meals": Activity,
  "Outdoor time": Activity,
  "Creative work": Book,
  "Meditated": Activity,
  "Caffeine": Coffee,
  "Music": Music,
  "Gaming": Activity
};

export default function MoodTracker() {
  const trackerRef = useRef<HTMLDivElement>(null);
  const [activities, setActivities] = useState<string[]>(DEFAULT_ACTIVITIES);
  const [newActivity, setNewActivity] = useState("");
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [entries, setEntries] = useState<MoodEntry[]>([]);

  const today = new Date();
  const startOfCurrentWeek = startOfWeek(today);
  
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(startOfCurrentWeek, i);
    return {
      date,
      day: format(date, 'EEE'),
      dayNumber: format(date, 'd'),
      dateString: format(date, 'yyyy-MM-dd')
    };
  });

  // Load saved entries from localStorage on component mount
  useEffect(() => {
    const savedEntries = localStorage.getItem('moodEntries');
    if (savedEntries) {
      setEntries(JSON.parse(savedEntries));
    }
  }, []);

  // Save entries to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('moodEntries', JSON.stringify(entries));
  }, [entries]);

  const handleAddActivity = () => {
    if (newActivity.trim() !== "") {
      setActivities([...activities, newActivity]);
      setNewActivity("");
    }
  };

  const toggleActivity = (activity: string) => {
    setSelectedActivities(prev => 
      prev.includes(activity) 
        ? prev.filter(a => a !== activity) 
        : [...prev, activity]
    );
  };

  const handleSaveEntry = () => {
    if (!selectedMood) return;

    const newEntry: MoodEntry = {
      date: today.toISOString(),
      mood: selectedMood.value,
      activities: selectedActivities
    };

    // Update or add entry
    const existingEntryIndex = entries.findIndex(entry => 
      isSameDay(parseISO(entry.date), today)
    );

    if (existingEntryIndex >= 0) {
      const updatedEntries = [...entries];
      updatedEntries[existingEntryIndex] = newEntry;
      setEntries(updatedEntries);
    } else {
      setEntries([...entries, newEntry]);
    }

    // Reset form
    setSelectedActivities([]);
    setSelectedMood(null);
  };

  // Generate chart data from all entries
  const generateChartData = (): ChartData[] => {
    const sortedEntries = [...entries].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    return sortedEntries.map(entry => ({
      day: format(parseISO(entry.date), 'MMM d'),
      date: entry.date,
      mood: entry.mood,
      factors: entry.activities?.join(', ') || ''
    }));
  };

  const chartData = generateChartData();

  // Calculate insights from all historical data
  const calculateInsights = (): PatternsInsight => {
    if (entries.length === 0) {
      return {
        bestDay: null,
        worstDay: null,
        avgMood: "0",
        commonActivities: []
      };
    }

    // Calculate patterns
    const dayMoods: Record<string, { sum: number; count: number }> = {};
    entries.forEach(entry => {
      const day = format(parseISO(entry.date), 'EEE');
      if (!dayMoods[day]) {
        dayMoods[day] = { sum: 0, count: 0 };
      }
      dayMoods[day].sum += entry.mood;
      dayMoods[day].count += 1;
    });

    const dayAvgs = Object.keys(dayMoods).map(day => ({
      day,
      avg: dayMoods[day].sum / dayMoods[day].count
    }));

    const bestDay = dayAvgs.length > 0 
      ? dayAvgs.reduce((a, b) => a.avg > b.avg ? a : b).day 
      : null;
    const worstDay = dayAvgs.length > 0 
      ? dayAvgs.reduce((a, b) => a.avg < b.avg ? a : b).day 
      : null;

    // Calculate common activities
    const activityCounts: Record<string, number> = {};
    entries.forEach(entry => {
      entry.activities?.forEach(activity => {
        activityCounts[activity] = (activityCounts[activity] || 0) + 1;
      });
    });

    const activityAvgs = Object.keys(activityCounts).map(activity => ({
      activity,
      count: activityCounts[activity]
    }));

    return {
      bestDay,
      worstDay,
      avgMood: (entries.reduce((sum, e) => sum + e.mood, 0) / entries.length).toFixed(1),
      commonActivities: activityAvgs.sort((a, b) => b.count - a.count).slice(0, 3).map(a => ({
        activity: a.activity,
        count: a.count
      }))
    };
  };

  const insights = calculateInsights();

  // Get today's entry if it exists
  const todaysEntry = entries.find(entry => 
    isToday(parseISO(entry.date))
  );

  // Set selected mood and activities if editing today's entry
  useEffect(() => {
    if (todaysEntry) {
      setSelectedMood(MOODS.find(m => m.value === todaysEntry.mood) || null);
      setSelectedActivities(todaysEntry.activities || []);
    }
  }, [todaysEntry]);

  const scrollToTracker = () => {
    trackerRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <Layout>
      {/* Mood Tracker Banner */}
      <div className="relative h-[500px] md:h-[950px] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={moodBanner}
            alt="Mood Tracker Banner"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 to-black/30"></div>
        </div>
        <div className="relative z-10 h-full flex items-center">
          <div className="container mx-auto px-6 md:px-12 lg:px-24">
            <div className="max-w-2xl">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-white">
                Daily Mood Tracker
              </h1>
              <p className="text-lg md:text-xl text-white/90 mb-8 max-w-lg">
                Track your emotions, understand patterns, and improve your wellbeing
              </p>

            </div>
          </div>
        </div>
      </div>

      {/* Main Tracker Section */}
      <div ref={trackerRef} className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Your Mood Journey
          </h1>
          <p className="text-lg text-gray-600">
            Record your daily emotions and discover your patterns
          </p>
        </motion.div>

        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <Card className="mb-8 border-0 shadow-lg">
                <CardHeader className="bg-zenLightPink/10 p-6 rounded-t-lg">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 mr-2 text-zenPink" />
                      <span>Today's Check-in</span>
                    </div>
                    <span className="text-sm font-normal text-gray-500">
                      {format(today, 'EEEE, MMMM d')}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-8">
                    <div>
                      <Label className="mb-4 block text-lg font-medium">How are you feeling today?</Label>
                      <div className="grid grid-cols-5 gap-3">
                        {MOODS.map((mood) => (
                          <Button
                            key={mood.label}
                            variant="outline"
                            className={`flex flex-col items-center gap-3 h-auto py-6 rounded-xl transition-all ${
                              selectedMood?.value === mood.value 
                                ? `${mood.bgColor} border-2 border-white shadow-lg scale-105`
                                : 'bg-white hover:bg-gray-50'
                            }`}
                            onClick={() => setSelectedMood(mood)}
                          >
                            <mood.icon className={`h-8 w-8 ${mood.color}`} />
                            <span className="font-medium">{mood.label}</span>
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label className="mb-4 block text-lg font-medium">What influenced your mood?</Label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                        {activities.map((activity, index) => {
                          const ActivityIcon = ACTIVITY_ICONS[activity] || Check;
                          return (
                            <Button
                              key={index}
                              variant="outline"
                              size="sm"
                              className={`justify-start rounded-full px-4 ${
                                selectedActivities.includes(activity) 
                                  ? 'bg-zenSeafoam/20 border-zenSage text-zenSage'
                                  : 'bg-white'
                              }`}
                              onClick={() => toggleActivity(activity)}
                            >
                              <ActivityIcon className="mr-2 h-4 w-4" />
                              {activity}
                            </Button>
                          );
                        })}
                      </div>
                      <div className="flex gap-2">
                        <Input 
                          placeholder="Add new factor..." 
                          value={newActivity} 
                          onChange={(e) => setNewActivity(e.target.value)}
                          className="flex-1 rounded-full"
                          onKeyDown={(e) => e.key === 'Enter' && handleAddActivity()}
                        />
                        <Button 
                          onClick={handleAddActivity}
                          variant="outline"
                          size="icon"
                          className="rounded-full"
                        >
                          <PlusCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="bg-gray-50 p-6 rounded-b-lg">
                  <Button 
                    className="ml-auto bg-zenSage hover:bg-zenSage/90 text-white px-8 py-4 text-md rounded-full shadow-md"
                    onClick={handleSaveEntry}
                    disabled={!selectedMood}
                  >
                    {todaysEntry ? 'Update Entry' : 'Save Entry'}
                  </Button>
                </CardFooter>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader className="bg-white p-6 rounded-t-lg">
                  <div className="flex justify-between items-center">
                    <CardTitle>
                      <div className="flex items-center">
                        <BarChart2 className="h-5 w-5 mr-2 text-zenSage" />
                        <span>Mood Trends</span>
                      </div>
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={chartData}
                        margin={{
                          top: 5,
                          right: 20,
                          left: 0,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                        <XAxis 
                          dataKey="day" 
                          tickFormatter={(value, index) => {
                            return index % 3 === 0 || index === chartData.length - 1 ? value : '';
                          }}
                          stroke="#6B7280"
                        />
                        <YAxis 
                          domain={[1, 5]} 
                          ticks={[1, 2, 3, 4, 5]} 
                          tickFormatter={(value: number) => {
                            const labels = ["Terrible", "Poor", "Neutral", "Good", "Excellent"];
                            return labels[value - 1];
                          }}
                          stroke="#6B7280"
                        />
                        <Tooltip 
                          formatter={(value: number) => {
                            const mood = MOODS.find(m => m.value === Math.round(value as number));
                            return [`${mood?.label} (${value}/5)`, 'Mood'];
                          }}
                          labelFormatter={(label) => {
                            const entry = chartData.find(d => d.day === label);
                            return `${label}: ${entry?.factors || 'No factors recorded'}`;
                          }}
                          contentStyle={{
                            backgroundColor: 'white',
                            borderRadius: '0.5rem',
                            borderColor: '#E5E7EB',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                          }}
                        />
                        <Line 
                          type="monotone"
                          dataKey="mood" 
                          stroke="#7CAE9E"
                          strokeWidth={3}
                          dot={{ r: 5, fill: "#7CAE9E", strokeWidth: 2, stroke: "white" }}
                          activeDot={{ r: 8, fill: "#7CAE9E", strokeWidth: 2, stroke: "white" }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-8">
              <Card className="border-0 shadow-lg">
                <CardHeader className="bg-white p-6 rounded-t-lg">
                  <CardTitle className="flex items-center">
                    <Clock className="h-5 w-5 mr-2 text-zenPink" />
                    <span>Recent Entries</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 max-h-[320px] overflow-y-auto">
                  <div className="space-y-4">
                    {weekDays.map((day, index) => {
                      const entry = entries.find(e => 
                        isSameDay(parseISO(e.date), day.date)
                      );
                      
                      const mood = entry ? MOODS.find(m => m.value === entry.mood) : null;
                      
                      return (
                        <div 
                          key={index} 
                          className={`flex items-center p-4 rounded-xl transition-all ${
                            mood ? mood.bgColor : 'bg-gray-50'
                          }`}
                        >
                          <div className="text-center mr-4 w-12">
                            <div className="text-sm font-bold text-gray-700">{day.day}</div>
                            <div className="text-2xl font-medium text-gray-800">{day.dayNumber}</div>
                          </div>
                          {entry ? (
                            <div className="flex-1">
                              <div className="flex items-center">
                                {mood && (
                                  <mood.icon className={`h-5 w-5 mr-2 ${mood.color}`} />
                                )}
                                <span className="font-medium text-gray-800">
                                  {mood?.label || 'Unknown'}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 mt-1">
                                {entry.activities?.slice(0, 2).join(', ') || 'No factors'}
                                {entry.activities?.length > 2 && '...'}
                              </p>
                            </div>
                          ) : (
                            <div className="flex-1 text-gray-400 italic">No entry yet</div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
                <CardFooter className="bg-gray-50 p-4 rounded-b-lg border-t">
                  <Button variant="link" size="sm" className="mx-auto text-zenSage">
                    View All Entries
                  </Button>
                </CardFooter>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader className="bg-white p-6 rounded-t-lg">
                  <CardTitle className="flex items-center">
                    <PieChart className="h-5 w-5 mr-2 text-zenSage" />
                    <span>Mood Insights</span>
                  </CardTitle>
                  <CardDescription>
                    Based on your mood history
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div className="bg-zenLightPink/10 p-4 rounded-lg">
                      <h3 className="font-medium text-gray-800 mb-2">Weekly Patterns</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white p-3 rounded-lg shadow-sm">
                          <p className="text-sm text-gray-500">Best Day</p>
                          <p className="text-lg font-semibold text-zenSage">
                            {insights.bestDay || '--'}
                          </p>
                        </div>
                        <div className="bg-white p-3 rounded-lg shadow-sm">
                          <p className="text-sm text-gray-500">Worst Day</p>
                          <p className="text-lg font-semibold text-zenSage">
                            {insights.worstDay || '--'}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-zenLightPink/10 p-4 rounded-lg">
                      <h3 className="font-medium text-gray-800 mb-2">Overall Average</h3>
                      <div className="bg-white p-4 rounded-lg shadow-sm flex items-center justify-center">
                        <div className="text-center">
                          <p className="text-sm text-gray-500">Mood Average</p>
                          <p className="text-3xl font-bold text-zenSage">
                            {insights.avgMood}/5
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            {insights.avgMood && parseFloat(insights.avgMood) >= 3.5 ? 'Mostly positive' : 'Mixed feelings'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {insights.commonActivities.length > 0 && (
                      <div className="bg-zenLightPink/10 p-4 rounded-lg">
                        <h3 className="font-medium text-gray-800 mb-2">Common Factors</h3>
                        <div className="space-y-3">
                          {insights.commonActivities.map((activity, i) => {
                            const Icon = ACTIVITY_ICONS[activity.activity] || Check;
                            return (
                              <div key={i} className="bg-white p-3 rounded-lg shadow-sm flex items-center">
                                <Icon className="h-5 w-5 mr-3 text-zenSage" />
                                <div className="flex-1">
                                  <p className="font-medium text-gray-800">{activity.activity}</p>
                                  <p className="text-sm text-gray-500">{activity.count} occurrences</p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
