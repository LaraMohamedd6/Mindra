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

interface ProgressProps {
  journalData: JournalEntry[];
}

export default function Progress({ journalData }: ProgressProps) {
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
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="p-4">
                <div className="text-sm font-semibold text-gray-500 mb-1">
                  Meditation Sessions
                </div>
                <div className="text-3xl font-bold text-zenSage">18</div>
                <div className="text-xs text-gray-500 mt-1">Last 30 days</div>
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
                  <span className="font-medium">70%</span>
                </div>
                <UiProgress value={70} className="h-3" />
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
                  <span className="font-medium">60%</span>
                </div>
                <UiProgress value={60} className="h-3" />
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
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={[
                    { date: "Week 1", value: 120 },
                    { date: "Week 2", value: 150 },
                    { date: "Week 3", value: 100 },
                    { date: "Week 4", value: 180 },
                    { date: "Week 5", value: 210 },
                    { date: "Week 6", value: 190 },
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
                You're meditating 15% more than last month! Consistent meditation
                has been shown to reduce stress and improve focus.
              </p>
            </div>
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