import { useState, useEffect } from "react";
import { format, subDays, isWithinInterval } from "date-fns";
import axios from "axios";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { BarChart } from "lucide-react";

interface MoodData {
  date: string;
  value: number;
  mood: string;
}

interface ActivityData {
  name: string;
  value: number;
}

interface JournalEntry {
  id: number;
  date: string;
  title: string;
  content: string;
  tags: string[];
}

interface JournalStatsDto {
  userId: string;
  totalEntries: number;
  lastWeekEntries: number;
}

interface MoodEntry {
  id: number;
  userId: string;
  date: string;
  moodValue: number;
  moodEmoji: string;
  notes?: string;
}

interface YogaTimeDto {
  dailyTotalHours: number;
  weeklyTotalHours: number;
  monthlyTotalHours: number;
}

interface OverviewProps {
  activityData: ActivityData[];
  journalData: JournalEntry[];
}

const COLORS = ["#7CAE9E", "#E69EA2", "#FEC0B3", "#CFECE0"];
const MOOD_EMOJIS = ["😔", "😟", "😐", "🙂", "😊"];

export default function Overview({ activityData, journalData }: OverviewProps) {
  const [weeklyMeditation, setWeeklyMeditation] = useState<number | null>(null);
  const [weeklyYoga, setWeeklyYoga] = useState<number | null>(null);
  const [journalStats, setJournalStats] = useState<JournalStatsDto | null>(null);
  const [moodHistory, setMoodHistory] = useState<MoodData[]>([]);
  const [loading, setLoading] = useState(true);
  const [journalLoading, setJournalLoading] = useState(true);
  const [moodLoading, setMoodLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [journalError, setJournalError] = useState<string | null>(null);
  const [moodError, setMoodError] = useState<string | null>(null);
  const [yogaError, setYogaError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setJournalLoading(true);
        setMoodLoading(true);
        setError(null);
        setJournalError(null);
        setMoodError(null);
        setYogaError(null);

        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No authentication token found");
        }

        const authHeader = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        // Fetch mood history
        const moodResponse = await axios.get<MoodEntry[]>(
          "https://localhost:7223/api/MoodEntries",
          authHeader
        );
        const moodData = moodResponse.data.map((entry) => ({
          date: entry.date,
          value: entry.moodValue,
          mood: entry.moodEmoji,
        }));
        setMoodHistory(moodData);

        // Fetch meditation data
        const meditationResponse = await axios.get(
          "https://localhost:7223/api/TimeTracking/user-time-summary",
          authHeader
        );
        setWeeklyMeditation(meditationResponse.data.weeklyTotalHours);

        // Fetch yoga data
        const yogaResponse = await axios.get<YogaTimeDto>(
          "https://localhost:7223/api/YogaVideo/totals",
          authHeader
        );
        setWeeklyYoga(yogaResponse.data.weeklyTotalHours);

        // Fetch journal stats
        const journalResponse = await axios.get<JournalStatsDto>(
          "https://localhost:7223/api/journal/stats",
          authHeader
        );
        setJournalStats(journalResponse.data);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          const errorMessage = err.response?.data?.message || err.message;
          if (err.response?.config.url?.includes("TimeTracking")) {
            setError(errorMessage);
          } else if (err.response?.config.url?.includes("journal")) {
            setJournalError(errorMessage);
          } else if (err.response?.config.url?.includes("MoodEntries")) {
            setMoodError(errorMessage);
          } else if (err.response?.config.url?.includes("YogaVideo")) {
            setYogaError(errorMessage);
          }
        } else if (err instanceof Error) {
          setError(err.message);
          setJournalError(err.message);
          setMoodError(err.message);
          setYogaError(err.message);
        }
      } finally {
        setLoading(false);
        setJournalLoading(false);
        setMoodLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate mood improvement for the last 30 days up to current date
  const currentDate = new Date();
  const last30Days = subDays(currentDate, 30);
  const midPoint = subDays(currentDate, 15);
  const earlyMoods = moodHistory.filter((entry) =>
    isWithinInterval(new Date(entry.date), { start: last30Days, end: midPoint })
  );
  const laterMoods = moodHistory.filter((entry) =>
    isWithinInterval(new Date(entry.date), { start: midPoint, end: currentDate })
  );
  const earlyAverage =
    earlyMoods.length > 0
      ? earlyMoods.reduce((sum, entry) => sum + entry.value, 0) / earlyMoods.length
      : 0;
  const laterAverage =
    laterMoods.length > 0
      ? laterMoods.reduce((sum, entry) => sum + entry.value, 0) / laterMoods.length
      : 0;
  let moodImprovement =
    earlyAverage > 0 && laterAverage > earlyAverage
      ? Math.min(
          Math.round(((laterAverage - earlyAverage) / earlyAverage) * 100),
          100
        )
      : 0;

  // Fallback: If no improvement, use average mood relative to max mood (5)
  const overallAverage =
    moodHistory.length > 0
      ? moodHistory.reduce((sum, entry) => sum + entry.value, 0) / moodHistory.length
      : 0;
  if (moodImprovement === 0 && overallAverage > 0) {
    moodImprovement = Math.round(((overallAverage - 1) / (5 - 1)) * 100);
  }

  // Debugging logs
  console.log("moodHistory:", moodHistory);
  console.log("earlyMoods:", earlyMoods);
  console.log("laterMoods:", laterMoods);
  console.log("earlyAverage:", earlyAverage);
  console.log("laterAverage:", laterAverage);
  console.log("moodImprovement:", moodImprovement);
  console.log("overallAverage:", overallAverage);
  console.log("weeklyMeditation:", weeklyMeditation);
  console.log("journalStats:", journalStats);
  console.log("weeklyYoga:", weeklyYoga);

  // Calculate weekly journal progress
  const weeklyJournalProgress = journalStats
    ? Math.min(Math.round((journalStats.lastWeekEntries / 5) * 100), 100)
    : 0;

  // Calculate weekly yoga progress (3 hours goal)
  const weeklyYogaProgress = weeklyYoga
    ? Math.min(Math.round((weeklyYoga / 3) * 100), 100)
    : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart className="h-5 w-5 mr-2" />
              Mood History
            </CardTitle>
          </CardHeader>
          <CardContent>
            {moodLoading ? (
              <div className="flex justify-center items-center h-64">
                Loading mood data...
              </div>
            ) : moodError ? (
              <div className="flex justify-center items-center h-64 text-red-500">
                Error loading mood data: {moodError}
              </div>
            ) : (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={moodHistory.map((entry) => ({
                      date: format(new Date(entry.date), "MMM dd"),
                      value: entry.value,
                      mood: entry.mood,
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
            )}
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Activity Distribution</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={activityData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {activityData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4 w-full">
              <Card className="p-4">
                <h3 className="text-sm font-semibold text-gray-500">
                  Weekly Meditation
                </h3>
                {loading ? (
                  <div className="text-3xl font-bold text-zenSage mt-1">...</div>
                ) : error ? (
                  <div className="text-red-500 text-sm mt-1">
                    Error loading data
                  </div>
                ) : (
                  <div className="text-3xl font-bold text-zenSage mt-1">
                    {weeklyMeditation?.toFixed(1) || 0} hrs
                  </div>
                )}
              </Card>
              <Card className="p-4">
                <h3 className="text-sm font-semibold text-gray-500">
                  Journal Entries
                </h3>
                {journalLoading ? (
                  <div className="text-3xl font-bold text-zenPink mt-1">...</div>
                ) : journalError ? (
                  <div className="text-red-500 text-sm mt-1">
                    Error loading data
                  </div>
                ) : (
                  <div className="text-3xl font-bold text-zenPink mt-1">
                    {journalStats?.totalEntries || 0}
                  </div>
                )}
              </Card>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="md:col-span-2"
      >
        <Card>
          <CardHeader>
            <CardTitle>Your Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">
                  Meditation Goal (5 hours/week)
                </span>
                <span className="font-medium">
                  {weeklyMeditation
                    ? `${Math.min(
                        Math.round((weeklyMeditation / 5) * 100),
                        100
                      )}%`
                    : "0%"}
                </span>
              </div>
              <Progress
                value={
                  weeklyMeditation
                    ? Math.min(Math.round((weeklyMeditation / 5) * 100), 100)
                    : 0
                }
                className="h-2"
              />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">
                  Yoga Practice (3 hours/week)
                </span>
                <span className="font-medium">
                  {loading || yogaError ? "..." : `${weeklyYogaProgress}%`}
                </span>
              </div>
              <Progress
                value={loading || yogaError ? 0 : weeklyYogaProgress}
                className="h-2"
              />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Mood Improvement</span>
                <span className="font-medium">
                  {moodLoading ? "..." : `${moodImprovement}%`}
                </span>
              </div>
              <Progress
                value={moodLoading ? 0 : moodImprovement}
                className="h-2"
              />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">
                  Journaling (5 entries/week)
                </span>
                <span className="font-medium">
                  {journalLoading ? "..." : `${weeklyJournalProgress}%`}
                </span>
              </div>
              <Progress
                value={journalLoading ? 0 : weeklyJournalProgress}
                className="h-2"
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}