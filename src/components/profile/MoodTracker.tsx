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
import { format } from "date-fns";
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

interface MoodData {
  date: string;
  value: number;
  mood: string;
}

interface MoodTrackerProps {
  moodHistory: MoodData[];
  setMoodHistory: React.Dispatch<React.SetStateAction<MoodData[]>>;
  selectedDate: Date | undefined;
  setSelectedDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
  selectedMood: number | null;
  setSelectedMood: React.Dispatch<React.SetStateAction<number | null>>;
}

const MOOD_EMOJIS = ["😔", "😟", "😐", "🙂", "😊"];

export default function MoodTracker({
  moodHistory,
  setMoodHistory,
  selectedDate,
  setSelectedDate,
  selectedMood,
  setSelectedMood,
}: MoodTrackerProps) {
  const { toast } = useToast();

  const handleMoodSelect = (mood: number) => {
    setSelectedMood(mood);

    if (selectedDate) {
      const formattedDate = format(selectedDate, "yyyy-MM-dd");
      const existingEntryIndex = moodHistory.findIndex(
        (entry) => entry.date === formattedDate
      );

      if (existingEntryIndex >= 0) {
        const updatedHistory = [...moodHistory];
        updatedHistory[existingEntryIndex] = {
          ...updatedHistory[existingEntryIndex],
          value: mood,
          mood: MOOD_EMOJIS[mood - 1],
        };
        setMoodHistory(updatedHistory);
      } else {
        setMoodHistory([
          ...moodHistory,
          { date: formattedDate, value: mood, mood: MOOD_EMOJIS[mood - 1] },
        ]);
      }

      toast({
        title: "Mood tracked!",
        description: `You're feeling ${MOOD_EMOJIS[mood - 1]} today.`,
      });
    }
  };

  const getMoodForDate = (date: Date | undefined): number | null => {
    if (!date) return null;
    const formattedDate = format(date, "yyyy-MM-dd");
    const entry = moodHistory.find((item) => item.date === formattedDate);
    return entry ? entry.value : null;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Track Your Mood</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="mb-2 font-medium">Select a date:</p>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? (
                      format(selectedDate, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <p className="mb-4 font-medium">How are you feeling today?</p>
              <div className="flex justify-between">
                {MOOD_EMOJIS.map((emoji, index) => {
                  const moodValue = index + 1;
                  const isSelected =
                    selectedMood === moodValue ||
                    (selectedMood === null &&
                      getMoodForDate(selectedDate) === moodValue);

                  return (
                    <Button
                      key={index}
                      variant={isSelected ? "default" : "outline"}
                      className={`rounded-full h-14 w-14 text-2xl ${
                        isSelected ? "bg-zenSage hover:bg-zenSage/90" : ""
                      }`}
                      onClick={() => handleMoodSelect(moodValue)}
                    >
                      {emoji}
                    </Button>
                  );
                })}
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-2 px-1">
                <span>Very Sad</span>
                <span>Sad</span>
                <span>Neutral</span>
                <span>Good</span>
                <span>Excellent</span>
              </div>
            </div>

            {getMoodForDate(selectedDate) && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <p className="font-medium">
                  Your mood on {selectedDate ? format(selectedDate, "PPP") : ""}:
                </p>
                <div className="flex items-center mt-2">
                  <span className="text-4xl mr-2">
                    {MOOD_EMOJIS[(getMoodForDate(selectedDate) as number) - 1]}
                  </span>
                  <span className="text-lg font-medium">
                    {getMoodForDate(selectedDate)}/5
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Mood History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={moodHistory}
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
                    labelFormatter={(date) => new Date(date).toLocaleDateString()}
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
                {moodHistory
                  .slice()
                  .reverse()
                  .slice(0, 5)
                  .map((entry, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                    >
                      <span>{new Date(entry.date).toLocaleDateString()}</span>
                      <div className="flex items-center">
                        <span className="text-2xl mr-1">{entry.mood}</span>
                        <span>{entry.value}/5</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}