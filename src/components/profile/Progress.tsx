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

interface ProgressProps {
  journalData: JournalEntry[];
}

const API_BASE_URL = "https://localhost:7223";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: true,
});

export default function Progress({ journalData }: ProgressProps) {
  const [timeData, setTimeData] = useState<UserTimeSummaryDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTimeData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await api.get<UserTimeSummaryDto>(
          '/api/TimeTracking/user-time-summary',
          {
            headers: {
              Authorization: `Bearer ${token}`
            },
            withCredentials: true
          }
        );
        
        if (!response.data) {
          throw new Error('No data received from server');
        }
        
        setTimeData(response.data);
      } catch (err) {
        let errorMessage = 'Failed to fetch meditation data';
        if (axios.isAxiosError(err)) {
          if (err.code === 'ECONNABORTED') {
            errorMessage = 'Request timeout - server took too long to respond';
          } else if (err.response?.status === 401) {
            errorMessage = 'Unauthorized - please login again';
          } else {
            errorMessage = err.response?.data?.message || 
                         err.message || 
                         'Network error occurred';
          }
        } else if (err instanceof Error) {
          errorMessage = err.message;
        }
        setError(errorMessage);
        console.error("API Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTimeData();
  }, []);

  // Prepare meditation data for the chart (last 30 days)
  const meditationChartData = timeData?.dailyBreakdown
    ?.slice(0, 30) // Take last 30 days
    ?.map(item => ({
      date: new Date(item.date).toLocaleDateString(undefined, { 
        month: 'short', 
        day: 'numeric' 
      }),
      value: Math.round(item.totalHours * 60) // Convert hours to minutes
    }))
    ?.reverse() || [];

  // Calculate weekly progress percentages
  const weeklyMeditationProgress = timeData ? 
    Math.min(Math.round((timeData.weeklyTotalHours / 5) * 100), 100) : 0;
  
  const weeklyJournalProgress = Math.min(
    Math.round(
      (journalData.filter(entry => 
        new Date(entry.date) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      ).length / 5) * 100
    ), 
    100
  );

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
        <Card>
          <CardHeader>
            <CardTitle>Your Wellness Journey</CardTitle>
          </CardHeader>
          <CardContent>
            {error && <ErrorDisplay message={error} />}
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              <Card className="p-4">
                <div className="text-sm font-semibold text-gray-500 mb-1">
                  Meditation Hours
                </div>
                {loading ? (
                  <LoadingSkeleton />
                ) : (
                  <>
                    <div className="text-3xl font-bold text-zenSage">
                      {timeData?.monthlyTotalHours?.toFixed(1) || '0'}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">Last 30 days</div>
                  </>
                )}
              </Card>

              <Card className="p-4">
                <div className="text-sm font-semibold text-gray-500 mb-1">
                  Yoga Practice
                </div>
                <div className="text-3xl font-bold text-zenPink">8</div>
                <div className="text-xs text-gray-500 mt-1">Last 30 days</div>
              </Card>

              <Card className="p-4">
                <div className="text-sm font-semibold text-gray-500 mb-1">
                  Journal Entries
                </div>
                <div className="text-3xl font-bold text-zenPeach">
                  {journalData.length}
                </div>
                <div className="text-xs text-gray-500 mt-1">Total</div>
              </Card>

              <Card className="p-4">
                <div className="text-sm font-semibold text-gray-500 mb-1">
                  Average Mood
                </div>
                <div className="text-3xl font-bold text-zenSage flex items-center">
                  3.8
                  <span className="text-xl ml-2">🙂</span>
                </div>
                <div className="text-xs text-gray-500 mt-1">Last 30 days</div>
              </Card>
            </div>

            <div className="mt-8 space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">
                    Weekly Meditation Goal (5 hours)
                  </span>
                  <span className="font-medium">
                    {loading ? '...' : `${weeklyMeditationProgress}%`}
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
                    Weekly Yoga Sessions (3 sessions)
                  </span>
                  <span className="font-medium">67%</span>
                </div>
                <UiProgress value={67} className="h-3" />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">
                    Weekly Journal Entries (5 entries)
                  </span>
                  <span className="font-medium">{weeklyJournalProgress}%</span>
                </div>
                <UiProgress value={weeklyJournalProgress} className="h-3" />
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
        <Card className="h-full">
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
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <RechartsTooltip
                        formatter={(value) => [`${value} minutes`, "Meditation"]}
                      />
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke="#7CAE9E"
                        fill="#CFECE0"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 p-4 bg-zenMint rounded-lg">
                  <h3 className="font-medium text-zenSage">Insight</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {timeData?.monthlyTotalHours ? 
                      `You've meditated ${timeData.monthlyTotalHours.toFixed(1)} hours this month. ` + 
                      (timeData.monthlyTotalHours > 15 ? "Excellent consistency!" : "Keep building your practice!") : 
                      "Your meditation data will appear here."}
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
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Mood Improvement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={[
                    { date: "Week 1", value: 2.5 },
                    { date: "Week 2", value: 2.8 },
                    { date: "Week 3", value: 3.2 },
                    { date: "Week 4", value: 3.0 },
                    { date: "Week 5", value: 3.5 },
                    { date: "Week 6", value: 3.8 },
                  ]}
                  margin={{
                    top: 10,
                    right: 10,
                    left: 0,
                    bottom: 0,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[1, 5]} ticks={[1, 2, 3, 4, 5]} />
                  <RechartsTooltip
                    formatter={(value) => [`${value}/5`, "Average Mood"]}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#E69EA2"
                    fill="#F8E8E9"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-4 p-4 bg-zenLightPink rounded-lg">
              <h3 className="font-medium text-zenPink">Insight</h3>
              <p className="text-sm text-gray-600 mt-1">
                Your mood has been trending upward over the past 6 weeks! Regular
                journaling and meditation seem to be helping.
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}