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
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
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
const MOOD_COLORS = [
  "bg-red-300",
  "bg-orange-300",
  "bg-yellow-300",
  "bg-blue-300",
  "bg-green-300",
];

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

  // Helper function to check if date is in the future
  const isFutureDate = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date > today;
  };

  // Helper function to get auth header
  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
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
      const formattedDate = format(date, "yyyy-MM-dd");
      const response = await axios.get(
        `https://localhost:7223/api/MoodEntries/date/${formattedDate}/all`,
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
      const moodEmoji = MOOD_EMOJIS[moodValue - 1];
      const urlDate = format(date, "yyyy-MM-dd");
      const isoDate = format(date, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");

      const userId = localStorage.getItem("userId") || "123";
      if (!userId) throw new Error("User ID is required");

      const entry = {
        id: 0,
        userId,
        date: isoDate,
        moodValue,
        moodEmoji,
        notes,
      };

      try {
        const response = await axios.put(
          `https://localhost:7223/api/MoodEntries/date/${urlDate}`,
          entry,
          getAuthHeader()
        );
        return response.data;
      } catch (updateError) {
        if (axios.isAxiosError(updateError) && updateError.response?.status === 404) {
          const response = await axios.post(
            "https://localhost:7223/api/MoodEntries",
            entry,
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
          } else {
            setSelectedMood(null);
            setNotes("");
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
  }, [selectedDate]);

  // Handle date selection from calendar
  const handleDateSelect = async (date: Date | undefined) => {
    if (!date) return;
    
    if (isFutureDate(date)) {
      toast({
        variant: "destructive",
        title: "Invalid Date",
        description: "You can't select future dates",
      });
      return;
    }

    const normalizedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    setSelectedDate(normalizedDate);
    try {
      const entries = await getMoodEntriesByDate(normalizedDate);
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
    
    if (isFutureDate(selectedDate)) {
      toast({
        variant: "destructive",
        title: "Invalid Date",
        description: "You can't log moods for future dates",
      });
      return;
    }

    try {
      const savedEntry = await saveMoodEntry(selectedDate, moodValue, notes);
      
      const updatedHistory = await fetchMoodHistory();
      setMoodHistory(updatedHistory);

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

    const days: (Date | null)[] = [];
    
    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      days.push(date);
    }

    return days;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <CalendarIcon className="h-8 w-8 text-primary" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-8 p-4 md:p-6">
      {/* Mood Tracking Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Mood Input Card */}
        <Card className="shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-semibold">Track Your Mood</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div>
              <p className="mb-4 font-medium text-base">How are you feeling today?</p>
              <div className="flex justify-between gap-2">
                {MOOD_EMOJIS.map((emoji, index) => {
                  const moodValue = index + 1;
                  const isSelected = selectedMood === moodValue;
                  const isFuture = selectedDate ? isFutureDate(selectedDate) : false;

                  return (
                    <motion.button
                      key={index}
                      whileHover={{ scale: isFuture ? 1 : 1.1 }}
                      whileTap={{ scale: isFuture ? 1 : 0.95 }}
                      className={`rounded-full h-16 w-16 text-3xl flex items-center justify-center transition-colors ${
                        isSelected
                          ? `${MOOD_COLORS[index]} border-2 border-primary`
                          : "border border-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      } ${isFuture ? "opacity-50 cursor-not-allowed" : ""}`}
                      onClick={() => handleMoodSelect(moodValue)}
                      disabled={isFuture}
                      aria-label={`Select ${MOOD_LABELS[index]} mood`}
                    >
                      {emoji}
                    </motion.button>
                  );
                })}
              </div>
              <div className="flex justify-between text-xs text-muted-foreground mt-3 px-2">
                {MOOD_LABELS.map((label, index) => (
                  <span key={index} className="text-center flex-1">{label}</span>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-2 font-medium text-base">Notes:</p>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any notes about your mood..."
                className="min-h-[120px] rounded-lg border-gray-300 dark:border-gray-600"
              />
            </div>

            {selectedDate && selectedMood && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
              >
                <p className="font-medium text-base">
                  Your mood on {format(selectedDate, "PPP")}:
                </p>
                <div className="flex items-center mt-2">
                  <span className="text-4xl mr-3">{MOOD_EMOJIS[selectedMood - 1]}</span>
                  <span className="text-lg font-medium">
                    {MOOD_LABELS[selectedMood - 1]} ({selectedMood}/5)
                  </span>
                </div>
              </motion.div>
            )}
          </CardContent>
        </Card>

        {/* Mood Calendar Card */}
        <Card className="shadow-lg lg:col-span-2">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-semibold">Mood Calendar</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-6">
              <Button
                variant="outline"
                size="icon"
                onClick={handlePrevMonth}
                aria-label="Previous month"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <h3 className="text-lg font-semibold">
                {format(currentMonth, "MMMM yyyy")}
              </h3>
              <Button
                variant="outline"
                size="icon"
                onClick={handleNextMonth}
                aria-label="Next month"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>

            <div className="grid grid-cols-7 gap-2">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div
                  key={day}
                  className="text-center font-semibold text-sm py-2 text-gray-600 dark:text-gray-300"
                >
                  {day}
                </div>
              ))}

              {generateCalendarDays().map((date, index) => {
                if (!date) {
                  return <div key={`empty-${index}`} className="h-12"></div>;
                }

                const isFuture = isFutureDate(date);
                const entry = getMoodForDate(date);
                const isToday = isSameDay(date, new Date());
                const isSelected = selectedDate && isSameDay(date, selectedDate);

                return (
                  <motion.div
                    key={date.toString()}
                    whileHover={{ scale: isFuture ? 1 : 1.05 }}
                    className={`h-12 w-12 flex flex-col items-center justify-center rounded-full transition-colors relative
                      ${isToday ? "ring-2 ring-primary" : ""}
                      ${isSelected ? "bg-primary text-white" : ""}
                      ${isFuture ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                      ${entry ? MOOD_COLORS[entry.moodValue - 1] : "bg-gray-100 dark:bg-gray-700"}
                    `}
                    onClick={() => !isFuture && handleDateSelect(date)}
                    role="button"
                    tabIndex={isFuture ? -1 : 0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !isFuture) handleDateSelect(date);
                    }}
                    aria-label={`Select ${format(date, "MMMM d, yyyy")}${entry ? `, mood: ${MOOD_LABELS[entry.moodValue - 1]}` : ""}`}
                  >
                    <span className={`text-sm font-medium ${isSelected ? "text-white" : "text-gray-800 dark:text-gray-200"}`}>
                      {date.getDate()}
                    </span>
                    {entry && (
                      <div
                        className="text-lg absolute -bottom-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!isFuture) handleViewEntry(entry);
                        }}
                      >
                        {entry.moodEmoji}
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Mood History Card */}
      <Card className="shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-semibold">Mood History</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={moodHistory.map(entry => ({
                  date: format(new Date(entry.date), "MMM dd"),
                  value: entry.moodValue,
                  mood: entry.moodEmoji,
                }))}
                margin={{ top: 20, right: 20, left: 0, bottom: 5 }}
              >
                <defs>
                  <linearGradient id="colorMood" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7CAE9E" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#CFECE0" stopOpacity={0.2} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis domain={[0, 5]} ticks={[1, 2, 3, 4, 5]} tick={{ fontSize: 12 }} />
                <RechartsTooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    padding: "8px",
                  }}
                  formatter={(value) => [
                    `${MOOD_EMOJIS[Number(value) - 1]} ${MOOD_LABELS[Number(value) - 1]} (${value}/5)`,
                    "Mood",
                  ]}
                  labelFormatter={(label) => `Date: ${label}`}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#7CAE9E"
                  fill="url(#colorMood)"
                  activeDot={{ r: 8, fill: "#7CAE9E" }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-8 space-y-3">
            <h3 className="font-semibold text-base">Recent Entries</h3>
            <div className="max-h-48 overflow-y-auto space-y-3">
              {[...moodHistory]
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .slice(0, 5)
                .map((entry, idx) => (
                  <motion.div
                    key={idx}
                    whileHover={{ y: -2 }}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg cursor-pointer hover:shadow-sm transition-shadow"
                    onClick={() => handleViewEntry(entry)}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{entry.moodEmoji}</span>
                      <span className="text-sm font-medium">{format(new Date(entry.date), "PPP")}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">{MOOD_LABELS[entry.moodValue - 1]}</span>
                      <span className="text-sm text-muted-foreground">({entry.moodValue}/5)</span>
                    </div>
                  </motion.div>
                ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Entry Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="bg-gradient-to-r from-blue-100 to-green-100 dark:from-gray-700 dark:to-gray-800 p-4 rounded-t-lg">
            <DialogTitle className="text-lg font-semibold">Mood Entry Details</DialogTitle>
          </DialogHeader>
          {selectedEntry && (
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">Date</p>
                  <p className="text-base">{format(new Date(selectedEntry.date), "PPP")}</p>
                </div>
                <span className="text-4xl">{selectedEntry.moodEmoji}</span>
              </div>
              <div>
                <p className="font-medium text-sm">Mood Rating</p>
                <p className="text-base">
                  {selectedEntry.moodValue}/5 ({MOOD_LABELS[selectedEntry.moodValue - 1]})
                </p>
              </div>
              <div>
                <p className="font-medium text-sm">Notes</p>
                <p className="text-base whitespace-pre-wrap">
                  {selectedEntry.notes || "No notes added"}
                </p>
              </div>
              <div className="flex justify-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedDate(new Date(selectedEntry.date));
                    setIsDialogOpen(false);
                  }}
                  className="px-4 py-2"
                >
                  Edit This Entry
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}