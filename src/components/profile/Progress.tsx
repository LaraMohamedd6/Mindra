import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress as UiProgress } from "@/components/ui/progress";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  ReferenceLine,
  Legend,
} from "recharts";
import {
  format,
  subDays,
  startOfWeek,
  endOfWeek,
  isWithinInterval,
} from "date-fns";

interface JournalEntry {
  id: number;
  date: string;
  title: string;
  content: string;
  tags: string[];
}

interface DailyTimeDto {
  date: string;
  totalHours: number;
}

interface UserTimeSummaryDto {
  dailyTotalHours: number;
  weeklyTotalHours: number;
  monthlyTotalHours: number;
  dailyBreakdown: DailyTimeDto[];
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

interface WeeklyMood {
  date: string;
  value: number;
}

interface ProgressProps {
  journalData: JournalEntry[];
}

const API_BASE_URL = "https://localhost:7223";

const MOOD_EMOJIS = ["😔", "😟", "😐", "🙂", "😊"];

export default function Progress({ journalData }: ProgressProps) {
  const [timeData, setTimeData] = useState<UserTimeSummaryDto | null>(null);
  const [journalStats, setJournalStats] = useState<JournalStatsDto | null>(null);
  const [moodData, setMoodData] = useState<MoodEntry[]>([]);
  const [yogaData, setYogaData] = useState<YogaTimeDto | null>(null);
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

        // Fetch mood data
        const moodResponse = await axios.get<MoodEntry[]>(
          `${API_BASE_URL}/api/MoodEntries`,
          authHeader
        );
        if (!moodResponse.data) {
          throw new Error("No mood data received from server");
        }
        setMoodData(moodResponse.data);

        // Fetch meditation data
        const timeResponse = await axios.get<UserTimeSummaryDto>(
          `${API_BASE_URL}/api/TimeTracking/user-time-summary`,
          authHeader
        );
        if (!timeResponse.data) {
          throw new Error("No meditation data received from server");
        }
        setTimeData(timeResponse.data);

        // Fetch yoga data
        const yogaResponse = await axios.get<YogaTimeDto>(
          `${API_BASE_URL}/api/YogaVideo/totals`,
          { ...authHeader, cache: "no-store" } // Prevent caching
        );
        if (!yogaResponse.data) {
          throw new Error("No yoga data received from server");
        }
        console.log("Yoga API Response:", yogaResponse.data); // Debug
        setYogaData(yogaResponse.data);

        // Fetch journal stats
        const journalResponse = await axios.get<JournalStatsDto>(
          `${API_BASE_URL}/api/journal/stats`,
          authHeader
        );
        if (!journalResponse.data) {
          throw new Error("No journal stats received from server");
        }
        setJournalStats(journalResponse.data);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          const errorMessage =
            err.code === "ECONNABORTED"
              ? "Request timeout - server took too long to respond"
              : err.response?.status === 401
              ? "Unauthorized - please login again"
              : err.response?.data?.message || err.message || "Network error occurred";

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
        console.error("API Error:", err);
      } finally {
        setLoading(false);
        setJournalLoading(false);
        setMoodLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate average mood for the last 30 days
  const last30Days = subDays(new Date(), 30);
  const recentMoods = moodData.filter((entry) =>
    isWithinInterval(new Date(entry.date), { start: last30Days, end: new Date() })
  );
  const averageMood =
    recentMoods.length > 0
      ? Number(
          (
            recentMoods.reduce((sum, entry) => sum + entry.moodValue, 0) /
            recentMoods.length
          ).toFixed(1)
        )
      : 0;
  const averageMoodEmoji =
    averageMood > 0 ? MOOD_EMOJIS[Math.min(Math.round(averageMood) - 1, 4)] : "😐";

  // Calculate weekly mood averages for the last 30 days (approx. 4-5 weeks)
  const weeklyMoodData: WeeklyMood[] = [];
  for (let i = 4; i >= 0; i--) {
    const weekStart = startOfWeek(subDays(new Date(), 7 * i), { weekStartsOn: 1 });
    const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });
    if (weekStart < last30Days) continue;
    const weekMoods = moodData.filter((entry) =>
      isWithinInterval(new Date(entry.date), { start: weekStart, end: weekEnd })
    );
    const weekAverage =
      weekMoods.length > 0
        ? Number(
            (
              weekMoods.reduce((sum, entry) => sum + entry.moodValue, 0) /
              weekMoods.length
            ).toFixed(1)
          )
        : 0;
    weeklyMoodData.push({
      date: format(weekStart, "MMM d"),
      value: weekAverage,
    });
  }

  // Calculate overall trend and insights
  const hasMoodData = weeklyMoodData.some((week) => week.value > 0);
  const trend =
    hasMoodData && weeklyMoodData.length > 1
      ? weeklyMoodData[weeklyMoodData.length - 1].value >
        weeklyMoodData[0].value
        ? "upward"
        : weeklyMoodData[weeklyMoodData.length - 1].value <
          weeklyMoodData[0].value
        ? "downward"
        : "stable"
      : "none";
  const overallAverageMood = averageMood;
  const actionableTip =
    timeData && journalStats && hasMoodData
      ? trend !== "upward" && timeData.weeklyTotalHours < 2
        ? "Try adding 1-2 meditation sessions this week to boost your mood."
        : trend !== "upward" && journalStats.lastWeekEntries < 3
        ? "Write a journal entry 3 times this week to reflect and improve your mood."
        : "Keep up your wellness routine to maintain your positive mood!"
      : "Start tracking your mood daily to gain insights.";

  // Prepare meditation data for the chart (last 30 days)
  const meditationChartData = timeData?.dailyBreakdown
    ?.slice(0, 30)
    ?.map((item) => ({
      date: format(new Date(item.date), "MMM dd"),
      value: Math.round(item.totalHours * 60),
    }))
    ?.reverse() || [];

  // Calculate weekly progress percentages
  const weeklyMeditationProgress = timeData
    ? Math.min(Math.round((timeData.weeklyTotalHours / 5) * 100), 100)
    : 0;

  const weeklyJournalProgress = journalStats
    ? Math.min(Math.round((journalStats.lastWeekEntries / 5) * 100), 100)
    : 0;

  const weeklyYogaProgress = yogaData
    ? Math.min(Math.round((yogaData.weeklyTotalHours / 3) * 100), 100)
    : 0;

  const ErrorDisplay = ({ message }: { message: string }) => (
    <div className="p-4 bg-red-50 rounded-lg border border-red-200">
      <p className="text-red-600 font-medium">Error:</p>
      <p className="text-red-500 text-sm mt-1">{message}</p>
      <p className="text-xs text-red-400 mt-2">
        If this persists, please try refreshing or contact support.
      </p>
    </div>
  );

  const LoadingSkeleton = () => (
    <div className="animate-pulse bg-gray-200 rounded h-8 w-3/4"></div>
  );

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-2 rounded-lg shadow-md border border-gray-100 text-sm">
          <p className="font-medium text-gray-700">Week of {label}</p>
          <p className="text-zenPink">
            Mood: {data.value}/5 {MOOD_EMOJIS[Math.min(Math.round(data.value) - 1, 4)]}
          </p>
        </div>
      );
    }
    return null;
  };

  console.log("Yoga Data in Render:", yogaData);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="md:col-span-2"
      >
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Your Wellness Journey</CardTitle>
          </CardHeader>
          <CardContent>
            {error && <ErrorDisplay message={error} />}
            {journalError && <ErrorDisplay message={journalError} />}
            {moodError && <ErrorDisplay message={moodError} />}
            {yogaError && <ErrorDisplay message={yogaError} />}

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              <Card className="p-4 border-none bg-gray-50">
                <div className="text-sm font-semibold text-gray-500 mb-1">
                  Meditation Hours
                </div>
                {loading ? (
                  <LoadingSkeleton />
                ) : (
                  <>
                    <div className="text-3xl font-bold text-zenSage">
                      {timeData?.monthlyTotalHours?.toFixed(1) || "0"}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">Last 30 days</div>
                  </>
                )}
              </Card>

              <Card className="p-4 border-none bg-gray-50">
                <div className="text-sm font-semibold text-gray-500 mb-1">
                  Yoga Hours
                </div>
                {loading || yogaError ? (
                  yogaError ? (
                    <div className="text-red-500 text-sm">Error: {yogaError}</div>
                  ) : (
                    <LoadingSkeleton />
                  )
                ) : yogaData?.monthlyTotalHours === 0 ? (
                  <>
                    <div className="text-3xl font-bold text-zenPink">0</div>
                    <div className="text-xs text-gray-500 mt-1">No yoga data tracked</div>
                  </>
                ) : (
                  <>
                    <div className="text-3xl font-bold text-zenPink">
                      {yogaData?.monthlyTotalHours?.toFixed(1) || "0"}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">Last 30 days</div>
                  </>
                )}
              </Card>

              <Card className="p-4 border-none bg-gray-50">
                <div className="text-sm font-semibold text-gray-500 mb-1">
                  Journal Entries
                </div>
                {journalLoading ? (
                  <LoadingSkeleton />
                ) : (
                  <>
                    <div className="text-3xl font-bold text-zenPeach">
                      {journalStats?.totalEntries || 0}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">Total</div>
                  </>
                )}
              </Card>

              <Card className="p-4 border-none bg-gray-50">
                <div className="text-sm font-semibold text-gray-500 mb-1">
                  Average Mood
                </div>
                {moodLoading ? (
                  <LoadingSkeleton />
                ) : (
                  <>
                    <div className="text-3xl font-bold text-zenSage flex items-center">
                      {averageMood || "0"}
                      <span className="text-xl ml-2">{averageMoodEmoji}</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">Last 30 days</div>
                  </>
                )}
              </Card>
            </div>

            <div className="mt-8 space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">
                    Weekly Meditation Goal (5 hours)
                  </span>
                  <span className="font-medium">
                    {loading ? "..." : `${weeklyMeditationProgress}%`}
                  </span>
                </div>
                <UiProgress
                  value={loading ? 0 : weeklyMeditationProgress}
                  className="h-3"
                />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">
                    Weekly Yoga Hours (3 hours)
                  </span>
                  <span className="font-medium">
                    {loading || yogaError ? "..." : `${weeklyYogaProgress}%`}
                  </span>
                </div>
                <UiProgress
                  value={loading || yogaError ? 0 : weeklyYogaProgress}
                  className="h-3"
                />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">
                    Weekly Journal Entries (5 entries)
                  </span>
                  <span className="font-medium">
                    {journalLoading ? "..." : `${weeklyJournalProgress}%`}
                  </span>
                </div>
                <UiProgress
                  value={journalLoading ? 0 : weeklyJournalProgress}
                  className="h-3"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="h-full shadow-sm">
          <CardHeader>
            <CardTitle>Meditation Progress</CardTitle>
          </CardHeader>
          <CardContent>
            {error ? (
              <ErrorDisplay message={error} />
            ) : loading ? (
              <div className="h-64 flex items-center justify-center">
                <div className="animate-pulse bg-gray-200 h-full w-full rounded"></div>
              </div>
            ) : (
              <>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={meditationChartData}
                      margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3} />
                      <XAxis dataKey="date" tick={{ fontSize: 12, fill: "#6B7280" }} />
                      <YAxis tick={{ fontSize: 12, fill: "#6B7280" }} />
                      <RechartsTooltip
                        formatter={(value) => [`${value} minutes`, "Meditation"]}
                        contentStyle={{
                          backgroundColor: "#fff",
                          border: "1px solid #e5e7eb",
                          borderRadius: "8px",
                          padding: "8px",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke="#7CAE9E"
                        fill="url(#meditationGradient)"
                        fillOpacity={0.8}
                      />
                      <defs>
                        <linearGradient id="meditationGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#CFECE0" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#CFECE0" stopOpacity={0.2} />
                        </linearGradient>
                      </defs>
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 p-4 bg-zenMint/10 rounded-lg">
                  <h3 className="font-medium text-zenSage">Insight</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {timeData?.monthlyTotalHours
                      ? `You've meditated ${timeData.monthlyTotalHours.toFixed(1)} hours this month. ${
                          timeData.monthlyTotalHours > 15
                            ? "Excellent consistency!"
                            : "Keep building your practice!"
                        }`
                      : "Your meditation data will appear here."}
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="h-full shadow-sm">
          <CardHeader>
            <CardTitle>Weekly Mood Trends</CardTitle>
            <p className="text-sm text-gray-500">Last 30 days</p>
          </CardHeader>
          <CardContent>
            {moodError ? (
              <ErrorDisplay message={moodError} />
            ) : moodLoading ? (
              <div className="h-64 flex items-center justify-center">
                <div className="animate-pulse bg-gray-200 h-full w-full rounded"></div>
              </div>
            ) : !hasMoodData ? (
              <div className="h-64 flex items-center justify-center text-gray-500 text-sm">
                No mood data available. Track your mood daily to see trends.
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={weeklyMoodData}
                      margin={{
                        top: 20,
                        right: 20,
                        left: 0,
                        bottom: 10,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3} />
                      <XAxis
                        dataKey="date"
                        tick={{ fontSize: 12, fill: "#6B7280" }}
                        tickMargin={10}
                      />
                      <YAxis
                        domain={[1, 5]}
                        ticks={[1, 2, 3, 4, 5]}
                        tick={{ fontSize: 12, fill: "#6B7280" }}
                        tickMargin={5}
                      />
                      <RechartsTooltip content={<CustomTooltip />} />
                      <Legend
                        verticalAlign="top"
                        height={30}
                        content={() => (
                          <div className="text-sm text-gray-600 font-medium">
                            Weekly Average Mood
                          </div>
                        )}
                      />
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke="#E69EA2"
                        fill="url(#moodGradient)"
                        fillOpacity={0.8}
                        activeDot={{ r: 6, fill: "#E69EA2", stroke: "#fff", strokeWidth: 2 }}
                      />
                      {overallAverageMood > 0 && (
                        <ReferenceLine
                          y={overallAverageMood}
                          stroke="#9CA3AF"
                          strokeDasharray="3 3"
                          label={{
                            value: `Avg: ${overallAverageMood}`,
                            position: "insideTopRight",
                            fill: "#6B7280",
                            fontSize: 12,
                          }}
                        />
                      )}
                      <defs>
                        <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#F8E8E9" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#FFE6E8" stopOpacity={0.2} />
                        </linearGradient>
                      </defs>
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 p-4 bg-zenLightPink/10 rounded-lg">
                  <h3 className="font-medium text-zenPink">Insight</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Your mood is trending {trend} with an average of {overallAverageMood}/5. {actionableTip}
                  </p>
                </div>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}