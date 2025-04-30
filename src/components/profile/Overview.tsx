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

interface OverviewProps {
  moodHistory: MoodData[];
  activityData: ActivityData[];
  journalData: JournalEntry[];
}

const COLORS = ["#7CAE9E", "#E69EA2", "#FEC0B3", "#CFECE0"];
const MOOD_EMOJIS = ["😔", "😟", "😐", "🙂", "😊"];

export default function Overview({
  moodHistory,
  activityData,
  journalData,
}: OverviewProps) {
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
              Recent Mood Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={moodHistory.slice(-7)}
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
                <div className="text-3xl font-bold text-zenSage mt-1">
                  3.5 hrs
                </div>
              </Card>
              <Card className="p-4">
                <h3 className="text-sm font-semibold text-gray-500">
                  Journal Entries
                </h3>
                <div className="text-3xl font-bold text-zenPink mt-1">
                  {journalData.length}
                </div>
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
                <span className="font-medium">70%</span>
              </div>
              <Progress value={70} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">
                  Yoga Practice (3 sessions/week)
                </span>
                <span className="font-medium">45%</span>
              </div>
              <Progress value={45} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Mood Improvement</span>
                <span className="font-medium">60%</span>
              </div>
              <Progress value={60} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">
                  Journaling (5 entries/week)
                </span>
                <span className="font-medium">80%</span>
              </div>
              <Progress value={80} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}