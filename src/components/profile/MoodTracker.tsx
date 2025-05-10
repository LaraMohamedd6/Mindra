import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarIcon } from "lucide-react";
import { format, isSameDay } from "date-fns";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from "recharts";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

// Define types
interface MoodEntry {
  id: number;
  userId: string;
  date: string;
  moodValue: number;
  moodEmoji: string;
  notes?: string;
}

const MOOD_EMOJIS = ["😔", "😟", "😐", "🙂", "😊"];
const MOOD_LABELS = ["Very Sad", "Sad", "Neutral", "Good", "Excellent"];
const MOOD_COLORS = ["bg-red-200", "bg-orange-200", "bg-yellow-200", "bg-blue-200", "bg-green-200"];

export default function MoodTracker() {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notes, setNotes] = useState("");
  const [selectedEntry, setSelectedEntry] = useState<MoodEntry | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Helper function to get auth header
  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  // Fetch all mood entries
  const fetchMoodHistory = async () => {
    try {
      const response = await axios.get("https://localhost:7223/api/MoodEntries", getAuthHeader());
      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch mood history");
    }
  };

  // Get mood entries for a specific date
  const getMoodEntriesByDate = async (date: Date) => {
    try {
      const response = await axios.get(
        `https://localhost:7223/api/MoodEntries/date/${format(date, "yyyy-MM-dd")}/all`,
        getAuthHeader()
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return [];
      }
      throw error;
    }
  };

  // Create or update mood entry
  const saveMoodEntry = async (date: Date, moodValue: number, notes: string = "") => {
    try {
      const moodEmoji = MOOD_EMOJIS[moodValue - 1]; // Get the correct emoji
      const formattedDate = date.toISOString().split('T')[0];
      
      // Try to update first
      try {
        const response = await axios.put(
          `https://localhost:7223/api/MoodEntries/date/${formattedDate}`,
          {
            moodValue,
            moodEmoji, // Include emoji in update
            notes,
          },
          getAuthHeader()
        );
        return response.data;
      } catch (updateError) {
        // If not found, create new entry
        if (updateError.response?.status === 404) {
          const response = await axios.post(
            "https://localhost:7223/api/MoodEntries",
            {
              date: date.toISOString(),
              moodValue,
              moodEmoji, // Include emoji in creation
              notes,
            },
            getAuthHeader()
          );
          return response.data;
        }
        throw updateError;
      }
    } catch (error) {
      console.error("Failed to save mood entry:", error);
      throw new Error("Failed to save mood entry");
    }
  };

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const history = await fetchMoodHistory();
        setMoodHistory(history);
        
        if (selectedDate) {
          const entries = await getMoodEntriesByDate(selectedDate);
          if (entries.length > 0) {
            setSelectedMood(entries[0].moodValue);
            setNotes(entries[0].notes || "");
          }
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load mood data",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Handle date selection from date picker
  const handleDateSelect = async (date: Date | undefined) => {
    if (!date) return;
    
    setSelectedDate(date);
    try {
      const entries = await getMoodEntriesByDate(date);
      if (entries.length > 0) {
        setSelectedMood(entries[0].moodValue);
        setNotes(entries[0].notes || "");
      } else {
        setSelectedMood(null);
        setNotes("");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load mood data for selected date",
      });
    }
  };

  // Handle mood selection
  const handleMoodSelect = async (moodValue: number) => {
    if (!selectedDate) return;
    
    try {
      const savedEntry = await saveMoodEntry(selectedDate, moodValue, notes);
      
      // Update local state
      setMoodHistory(prev => {
        const existingIndex = prev.findIndex(e => e.id === savedEntry.id);
        if (existingIndex >= 0) {
          const updated = [...prev];
          updated[existingIndex] = savedEntry;
          return updated;
        }
        return [...prev, savedEntry];
      });

      setSelectedMood(moodValue);
      toast({
        title: "Mood saved!",
        description: `You're feeling ${MOOD_EMOJIS[moodValue - 1]} today.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save mood entry",
      });
    }
  };

  // Handle viewing entry details
  const handleViewEntry = (entry: MoodEntry) => {
    setSelectedEntry(entry);
    setIsDialogOpen(true);
  };

  // Get mood for a specific date
  const getMoodForDate = (date: Date) => {
    return moodHistory.find(entry => 
      isSameDay(new Date(entry.date), date)
    );
  };

  // Navigation for mood calendar
  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  // Generate days for the mood calendar
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    const days = [];
    
    // Previous month's days
    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }

    // Current month's days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      days.push(date);
    }

    return days;
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Loading mood data...</div>;
  }

  return (
    <div className="grid grid-cols-1 gap-6">
      {/* Mood Tracking Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Mood Input Card */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Track Your Mood</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            
            <div>
              <p className="mb-4 font-medium">How are you feeling today?</p>
              <div className="flex justify-between">
                {MOOD_EMOJIS.map((emoji, index) => {
                  const moodValue = index + 1;
                  const isSelected = selectedMood === moodValue;

                  return (
                    <Button
                      key={index}
                      variant={isSelected ? "default" : "outline"}
                      className={`rounded-full h-14 w-14 text-2xl ${
                        isSelected ? "bg-primary hover:bg-primary/90" : ""
                      }`}
                      onClick={() => handleMoodSelect(moodValue)}
                    >
                      {emoji}
                    </Button>
                  );
                })}
              </div>
              <div className="flex justify-between text-xs text-muted-foreground mt-2 px-1">
                {MOOD_LABELS.map((label, index) => (
                  <span key={index}>{label}</span>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-2 font-medium">Notes:</p>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any notes about your mood..."
                className="min-h-[100px]"
              />
            </div>

            {selectedDate && selectedMood && (
              <div className="mt-6 p-4 bg-muted rounded-lg">
                <p className="font-medium">
                  Your mood on {format(selectedDate, "PPP")}:
                </p>
                <div className="flex items-center mt-2">
                  <span className="text-4xl mr-2">
                    {MOOD_EMOJIS[selectedMood - 1]}
                  </span>
                  <span className="text-lg font-medium">
                    {selectedMood}/5
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Mood Calendar Card */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Mood Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-4">
              <Button variant="outline" onClick={handlePrevMonth}>
                Previous
              </Button>
              <h3 className="text-lg font-medium">
                {format(currentMonth, "MMMM yyyy")}
              </h3>
              <Button variant="outline" onClick={handleNextMonth}>
                Next
              </Button>
            </div>

            <div className="grid grid-cols-7 gap-1">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="text-center font-medium text-sm py-2">
                  {day}
                </div>
              ))}

              {generateCalendarDays().map((date, index) => {
                if (!date) {
                  return <div key={`empty-${index}`} className="h-10"></div>;
                }

                const entry = getMoodForDate(date);
                const isToday = isSameDay(date, new Date());
                const isSelected = selectedDate && isSameDay(date, selectedDate);

                return (
                  <div
                    key={date.toString()}
                    className={`h-10 flex flex-col items-center justify-center rounded-md cursor-pointer transition-colors
                      ${isToday ? "border border-primary" : ""}
                      ${isSelected ? "bg-accent" : ""}
                      ${entry ? MOOD_COLORS[entry.moodValue - 1] : "hover:bg-muted"}
                    `}
                    onClick={() => {
                      setSelectedDate(date);
                      if (entry) {
                        setSelectedMood(entry.moodValue);
                        setNotes(entry.notes || "");
                      } else {
                        setSelectedMood(null);
                        setNotes("");
                      }
                    }}
                  >
                    <div className="text-sm">{date.getDate()}</div>
                    {entry && (
                      <div 
                        className="text-xl"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewEntry(entry);
                        }}
                      >
                        {entry.moodEmoji}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Mood History Card */}
      <Card>
        <CardHeader>
          <CardTitle>Mood History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={moodHistory.map(entry => ({
                  date: format(new Date(entry.date), "MMM dd"),
                  value: entry.moodValue,
                  mood: entry.moodEmoji
                }))}
                margin={{
                  top: 10,
                  right: 10,
                  left: -20,
                  bottom: 0,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[0, 5]} ticks={[1, 2, 3, 4, 5]} />
                <RechartsTooltip
                  formatter={(value) => [
                    `${MOOD_EMOJIS[Number(value) - 1]} (${value}/5)`,
                    "Mood",
                  ]}
                  labelFormatter={(label) => label}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#7CAE9E"
                  fill="#CFECE0"
                  activeDot={{ r: 8 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-6 space-y-2">
            <h3 className="font-medium">Recent entries:</h3>
            <div className="max-h-40 overflow-y-auto space-y-2">
              {[...moodHistory]
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .slice(0, 5)
                .map((entry, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center p-3 bg-muted rounded-lg cursor-pointer hover:bg-muted/50"
                    onClick={() => handleViewEntry(entry)}
                  >
                    <span>{format(new Date(entry.date), "PPP")}</span>
                    <div className="flex items-center">
                      <span className="text-2xl mr-1">{entry.moodEmoji}</span>
                      <span>{entry.moodValue}/5</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Entry Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mood Entry Details</DialogTitle>
          </DialogHeader>
          {selectedEntry && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Date:</p>
                  <p>{format(new Date(selectedEntry.date), "PPP")}</p>
                </div>
                <div className="text-4xl">
                  {selectedEntry.moodEmoji}
                </div>
              </div>
              
              <div>
                <p className="font-medium">Mood Rating:</p>
                <p>{selectedEntry.moodValue}/5 ({MOOD_LABELS[selectedEntry.moodValue - 1]})</p>
              </div>
              
              <div>
                <p className="font-medium">Notes:</p>
                <p className="whitespace-pre-wrap">
                  {selectedEntry.notes || "No notes added"}
                </p>
              </div>
              
              <Button 
                variant="outline" 
                onClick={() => {
                  setSelectedDate(new Date(selectedEntry.date));
                  setIsDialogOpen(false);
                }}
              >
                Edit This Entry
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}