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
} from "recharts";
import { format } from "date-fns";

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

interface YogaTimeDto {
  dailyTotalHours: number;
  weeklyTotalHours: number;
  monthlyTotalHours: number;
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

interface ProgressProps {
  journalData: JournalEntry[];
}

const API_BASE_URL = "https://localhost:7223";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
});

const MOOD_EMOJIS = ["😔", "😟", "😐", "🙂", "😊"];

export default function Progress({ journalData }: ProgressProps) {
  const [timeData, setTimeData] = useState<UserTimeSummaryDto | null>(null);
  const [yogaData, setYogaData] = useState<YogaTimeDto | null>(null);
  const [journalStats, setJournalStats] = useState<JournalStatsDto | null>(null);
  const [moodData, setMoodData] = useState<MoodEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [yogaLoading, setYogaLoading] = useState(true);
  const [journalLoading, setJournalLoading] = useState(true);
  const [moodLoading, setMoodLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [yogaError, setYogaError] = useState<string | null>(null);
  const [journalError, setJournalError] = useState<string | null>(null);
  const [moodError, setMoodError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setYogaLoading(true);
        setJournalLoading(true);
        setMoodLoading(true);
        setError(null);
        setYogaError(null);
        setJournalError(null);
        setMoodError(null);

        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No authentication token found");
        }

        const authHeader = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        };

        // Fetch mood data
        const moodResponse = await api.get<MoodEntry[]>(
          "/api/MoodEntries",
          authHeader
        );
        if (!moodResponse.data) {
          throw new Error("No mood data received from server");
        }
        setMoodData(moodResponse.data);

        // Fetch meditation data
        const timeResponse = await api.get<UserTimeSummaryDto>(
          "/api/TimeTracking/user-time-summary",
          authHeader
        );
        if (!timeResponse.data) {
          throw new Error("No meditation data received from server");
        }
        setTimeData(timeResponse.data);

        // Fetch yoga data
        const yogaResponse = await api.get<YogaTimeDto>(
          "/api/YogaVideo/totals",
          authHeader
        );
        if (!yogaResponse.data) {
          throw new Error("No yoga data received from server");
        }
        setYogaData(yogaResponse.data);

        // Fetch journal stats
        const journalResponse = await api.get<JournalStatsDto>(
          "/api/journal/stats",
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
          } else if (err.response?.config.url?.includes("YogaVideo")) {
            setYogaError(errorMessage);
          } else if (err.response?.config.url?.includes("journal")) {
            setJournalError(errorMessage);
          } else if (err.response?.config.url?.includes("MoodEntries")) {
            setMoodError(errorMessage);
          }
        } else if (err instanceof Error) {
          setError(err.message);
          setYogaError(err.message);
          setJournalError(err.message);
          setMoodError(err.message);
        }
        console.error("API Error:", err);
      } finally {
        setLoading(false);
        setYogaLoading(false);
        setJournalLoading(false);
        setMoodLoading(false);
      }
    };

    fetchData();
  }, []);

  // Prepare meditation data for the chart (last 30 days)
  const meditationChartData = timeData?.dailyBreakdown
    ?.slice(0, 30)
    ?.map((item) => ({
      date: format(new Date(item.date), "MMM dd"),
      value: Number((item.totalHours).toFixed(2)),
    }))
    ?.reverse() || [];

  // Prepare mood data for the chart (last 7 days)
  const moodChartData = moodData
    .slice(-7)
    .map((entry) => ({
      date: entry.date,
      value: entry.moodValue,
      mood: entry.moodEmoji,
    }))
    .reverse();

  // Calculate weekly progress percentages
  const weeklyMeditationProgress = timeData
    ? Math.min(Math.round((timeData.weeklyTotalHours / 5) * 100), 100)
    : 0;

  const weeklyYogaProgress = yogaData
    ? Math.min(Math.round((yogaData.weeklyTotalHours / 3) * 100), 100)
    : 0;

  const weeklyJournalProgress = journalStats
    ? Math.min(Math.round((journalStats.lastWeekEntries / 5) * 100), 100)
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
            {yogaError && <ErrorDisplay message={yogaError} />}
            {journalError && <ErrorDisplay message={journalError} />}
            {moodError && <ErrorDisplay message={moodError} />}

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
                    <div className="text-xs text-gray-500 mt-1">
                      Last 30 days
                    </div>
                  </>
                )}
              </Card>

              <Card className="p-4 border-none bg-gray-50">
                <div className="text-sm font-semibold text-gray-500 mb-1">
                  Yoga Hours
                </div>
                {yogaLoading ? (
                  <LoadingSkeleton />
                ) : (
                  <>
                    <div className="text-3xl font-bold text-zenPink">
                      {yogaData?.monthlyTotalHours?.toFixed(1) || "0"}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Last 30 days
                    </div>
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
                      {moodData.length > 0
                        ? (
                            moodData.reduce(
                              (sum, entry) => sum + entry.moodValue,
                              0
                            ) / moodData.length
                          ).toFixed(1)
                        : "0"}
                      <span className="text-xl ml-2">
                        {moodData.length > 0
                          ? MOOD_EMOJIS[
                              Math.min(
                                Math.round(
                                  moodData.reduce(
                                    (sum, entry) => sum + entry.moodValue,
                                    0
                                  ) / moodData.length
                                ) - 1,
                                4
                              )
                            ]
                          : "😐"}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Last 30 days
                    </div>
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
                    Weekly Yoga Practice (3 hours)
                  </span>
                  <span className="font-medium">
                    {yogaLoading ? "..." : `${weeklyYogaProgress}%`}
                  </span>
                </div>
                <UiProgress
                  value={yogaLoading ? 0 : weeklyYogaProgress}
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
                      <XAxis
                        dataKey="date"
                        tick={{ fontSize: 12, fill: "#6B7280" }}
                      />
                      <YAxis tick={{ fontSize: 12, fill: "#6B7280" }} />
                      <RechartsTooltip
                        formatter={(value) => [`${value} hours`, "Meditation"]}
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
                        <linearGradient
                          id="meditationGradient"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#CFECE0"
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="95%"
                            stopColor="#CFECE0"
                            stopOpacity={0.2}
                          />
                        </linearGradient>
                      </defs>
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 p-4 bg-zenMint/10 rounded-lg">
                  <h3 className="font-medium text-zenSage">Insight</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {timeData?.monthlyTotalHours
                      ? `You've meditated ${timeData.monthlyTotalHours.toFixed(
                          1
                        )} hours this month. ${
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
            <CardTitle>Recent Mood Trends</CardTitle>
            <p className="text-sm text-gray-500">Last 7 days</p>
          </CardHeader>
          <CardContent>
            {moodError ? (
              <ErrorDisplay message={moodError} />
            ) : moodLoading ? (
              <div className="h-64 flex items-center justify-center">
                <div className="animate-pulse bg-gray-200 h-full w-full rounded"></div>
              </div>
            ) : moodChartData.length === 0 ? (
              <div className="h-64 flex items-center justify-center text-gray-500 text-sm">
                No mood data available. Track your mood daily to see trends.
              </div>
            ) : (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={moodChartData}
                    margin={{
                      top: 10,
                      right: 10,
                      left: -20,
                      bottom: 0,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="date"
                      tickFormatter={(date) =>
                        new Date(date).toLocaleDateString(undefined, {
                          weekday: "short",
                        })
                      }
                    />
                    <YAxis domain={[0, 5]} ticks={[1, 2, 3, 4, 5]} />
                    <RechartsTooltip
                      formatter={(value) => [
                        `${MOOD_EMOJIS[Number(value) - 1]} (${value}/5)`,
                        "Mood",
                      ]}
                      labelFormatter={(date) =>
                        new Date(date).toLocaleDateString()
                      }
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
    </div>
  );
}