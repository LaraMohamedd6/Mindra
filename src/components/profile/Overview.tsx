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
  RadialBarChart,
  RadialBar,
  Legend,
} from "recharts";
import { BarChart as BarChartIcon } from "lucide-react";

interface MoodData {
  date: string;
  value: number;
  mood: string;
}

interface ActivityData {
  name: string;
  value: number;
  goal: number;
  unit: string;
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
  journalData: JournalEntry[];
}

const MOOD_EMOJIS = ["😔", "😟", "😐", "🙂", "😊"];

export default function Overview({ journalData }: OverviewProps) {
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

  // Construct activity data for radial bar chart
  const activityData: ActivityData[] = [
    {
      name: "Meditation",
      value: weeklyMeditation ? Math.min((weeklyMeditation / 5) * 100, 100) : 0,
      goal: 5,
      unit: "hours",
    },
    {
      name: "Yoga",
      value: weeklyYoga ? Math.min((weeklyYoga / 3) * 100, 100) : 0,
      goal: 3,
      unit: "hours",
    },
    {
      name: "Journaling",
      value: journalStats ? Math.min((journalStats.lastWeekEntries / 5) * 100, 100) : 0,
      goal: 5,
      unit: "entries",
    },
  ];

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

  // Calculate weekly journal progress
  const weeklyJournalProgress = journalStats
    ? Math.min(Math.round((journalStats.lastWeekEntries / 5) * 100), 100)
    : 0;

  // Calculate weekly yoga progress (3 hours goal)
  const weeklyYogaProgress = weeklyYoga
    ? Math.min(Math.round((weeklyYoga / 3) * 100), 100)
    : 0;

  // Sort moodHistory for chart (oldest to newest)
  const sortedMoodHistory = [...moodHistory].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="h-full shadow-lg border-0 bg-gradient-to-br from-zenSage/10 to-zenPink/10">
          <CardHeader>
            <CardTitle className="flex items-center text-xl font-semibold text-gray-800 dark:text-white">
              <BarChartIcon className="h-5 w-5 mr-2 text-zenSage" />
              Mood History
            </CardTitle>
          </CardHeader>
          <CardContent>
            {moodLoading ? (
              <div className="flex justify-center items-center h-64">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <div className="h-8 w-8 border-2 border-zenSage border-t-transparent rounded-full" />
                </motion.div>
              </div>
            ) : moodError ? (
              <div className="flex justify-center items-center h-64 text-red-500">
                Error loading mood data: {moodError}
              </div>
            ) : (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={sortedMoodHistory.map((entry) => ({
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
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="date" tick={{ fill: "#6b7280" }} />
                    <YAxis domain={[0, 5]} ticks={[1, 2, 3, 4, 5]} tick={{ fill: "#6b7280" }} />
                    <RechartsTooltip
                      formatter={(value) => [
                        `${MOOD_EMOJIS[Number(value) - 1]} (${value}/5)`,
                        "Mood",
                      ]}
                      labelFormatter={(label) => label}
                      contentStyle={{
                        backgroundColor: "#fff",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#7CAE9E"
                      fill="#CFECE0"
                      activeDot={{ r: 8, fill: "#7CAE9E" }}
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
        transition={{ duration: 0.5 }}
      >
        <Card className="h-full shadow-lg border-0 bg-gradient-to-br from-zenSage/10 to-zenPink/10">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-800 dark:text-white">
              Weekly Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {loading || journalLoading || yogaError ? (
              <div className="flex justify-center items-center h-64 col-span-2">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <div className="h-8 w-8 border-2 border-zenSage border-t-transparent rounded-full" />
                </motion.div>
              </div>
            ) : (
              <>
                <Card className="p-6 bg-white/80 dark:bg-gray-800/80 shadow-sm rounded-lg">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 rounded-full bg-zenSage/10">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-6 w-6 text-zenSage"
                      >
                        <path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5"></path>
                        <path d="M8.5 8.5v.01"></path>
                        <path d="M16 15.5v.01"></path>
                        <path d="M12 12v.01"></path>
                        <path d="M11 17v.01"></path>
                        <path d="M7 14v.01"></path>
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-1">
                        Meditation
                      </h3>
                      {loading ? (
                        <div className="text-3xl font-bold text-zenSage">...</div>
                      ) : error ? (
                        <div className="text-red-500 text-sm">Error loading data</div>
                      ) : (
                        <div className="text-3xl font-bold text-zenSage">
                          {weeklyMeditation?.toFixed(1) || 0}<span className="text-lg font-normal ml-1">hours</span>
                        </div>
                      )}
                      <div className="mt-3">
                        <Progress
                          value={weeklyMeditation ? Math.min((weeklyMeditation / 5) * 100, 100) : 0}
                          className="h-2 bg-gray-200 dark:bg-gray-700"
                          indicatorClassName="bg-zenSage"
                        />
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Weekly goal: 5 hours
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 bg-white/80 dark:bg-gray-800/80 shadow-sm rounded-lg">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 rounded-full bg-zenPink/10">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-6 w-6 text-zenPink"
                      >
                        <path d="M12 20h9"></path>
                        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-1">
                        Journal Entries
                      </h3>
                      {journalLoading ? (
                        <div className="text-3xl font-bold text-zenPink">...</div>
                      ) : journalError ? (
                        <div className="text-red-500 text-sm">Error loading data</div>
                      ) : (
                        <div className="text-3xl font-bold text-zenPink">
                          {journalStats?.totalEntries || 0}
                        </div>
                      )}
                      <div className="mt-3">
                        <Progress
                          value={journalStats ? Math.min((journalStats.lastWeekEntries / 5) * 100, 100) : 0}
                          className="h-2 bg-gray-200 dark:bg-gray-700"
                          indicatorClassName="bg-zenPink"
                        />
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Weekly goal: 5 entries
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </>
            )}
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="md:col-span-2"
      >
        <Card className="shadow-lg border-0 bg-gradient-to-br from-zenSage/10 to-zenPink/10">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-800 dark:text-white">
              Your Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600 dark:text-gray-400">
                  Meditation Goal (5 hours/week)
                </span>
                <span className="font-medium text-gray-800 dark:text-white">
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
                <span className="text-gray-600 dark:text-gray-400">
                  Yoga Practice (3 hours/week)
                </span>
                <span className="font-medium text-gray-800 dark:text-white">
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
                <span className="text-gray-600 dark:text-gray-400">
                  Mood Improvement
                </span>
                <span className="font-medium text-gray-800 dark:text-white">
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
                <span className="text-gray-600 dark:text-gray-400">
                  Journaling (5 entries/week)
                </span>
                <span className="font-medium text-gray-800 dark:text-white">
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