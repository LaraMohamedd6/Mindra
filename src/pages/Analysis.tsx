import React from 'react';
import Layout from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  ScatterChart,
  Scatter,
  ZAxis,
} from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect } from 'react';
import Papa from 'papaparse';

// Updated color palette
const COLORS = {
  primary: "#E69EA2",
  primaryGradient: "linear-gradient(135deg, #E69EA2 0%, #F4C2C4 100%)",
  secondary: "#FEC0B3",
  secondaryGradient: "linear-gradient(135deg, #FEC0B3 0%, #FFD4C9 100%)",
  accent: "#7CAE9E",
  accentGradient: "linear-gradient(135deg, #7CAE9E 0%, #A3C7BA 100%)",
  success: "#CFECE0",
  warning: "#EBFFF5",
  background: "#F8FAFC",
  card: "rgba(255, 255, 255, 0.95)",
  cardHover: "rgba(255, 255, 255, 1)",
  text: "#1F2937",
  textSecondary: "#6B7280",
  border: "rgba(0, 0, 0, 0.05)"
};

const CHART_COLORS = [
  COLORS.primary, // #E69EA2
  COLORS.secondary, // #FEC0B3
  COLORS.accent, // #7CAE9E
  COLORS.success, // #CFECE0
  COLORS.warning // #EBFFF5
];

// Type definitions
type SocialMediaRow = {
  '1. What is your age?': string;
  '8. What is the average time you spend on social media every day?': string;
  '12. On a scale of 1 to 5, how easily distracted are you?': string;
  '18. How often do you feel depressed or down?': string;
  '20. On a scale of 1 to 5, how often do you face issues regarding sleep?': string;
};

type MusicRow = {
  Age: string;
  'Hours per day': string;
  'Fav genre': string;
  Anxiety: string;
  Depression: string;
  Insomnia: string;
  'Music effects': string;
};

type StudentMentalHealthRow = {
  Age: string;
  'Academic Pressure': string;
  'Sleep Duration': string;
  'Financial Stress': string;
  Depression: string;
  'Exercise Frequency': string;
  'Diet Quality': string;
};

type MentalHealthCorrelation = {
  usage: string;
  anxiety: number;
  depression: number;
  sleep: number;
  count: number;
};

type GenreImpact = {
  genre: string;
  anxiety: number;
  depression: number;
  insomnia: number;
  count: number;
};

type MusicEffect = {
  name: string;
  value: number;
};

type StudentMentalHealthImpact = {
  ageGroup: string;
  depressionRate: number;
  academicPressure: number;
  count: number;
};

type FinancialStressCorrelation = {
  financialStress: number;
  depression: number;
  count: number;
};

type LifestyleImpact = {
  category: string;
  value: string;
  depressionRate: number;
  count: number;
};

export default function Analysis() {
  const [socialMediaData, setSocialMediaData] = useState<MentalHealthCorrelation[]>([]);
  const [genreImpact, setGenreImpact] = useState<GenreImpact[]>([]);
  const [musicEffects, setMusicEffects] = useState<MusicEffect[]>([]);
  const [studentMentalHealthData, setStudentMentalHealthData] = useState<StudentMentalHealthImpact[]>([]);
  const [financialStressData, setFinancialStressData] = useState<FinancialStressCorrelation[]>([]);
  const [exerciseData, setExerciseData] = useState<LifestyleImpact[]>([]);
  const [dietData, setDietData] = useState<LifestyleImpact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load social media data
        const socialMediaResponse = await fetch('src\\data\\smmh.csv');
        const socialMediaText = await socialMediaResponse.text();
        const socialMediaParsed = Papa.parse<SocialMediaRow>(socialMediaText, {
          header: true,
          skipEmptyLines: true
        });

        // Process social media data
        const usageGroups: Record<string, { anxiety: number; depression: number; sleep: number; count: number }> = {};

        socialMediaParsed.data.forEach(row => {
          const usage = row['8. What is the average time you spend on social media every day?'];
          const anxiety = parseFloat(row['12. On a scale of 1 to 5, how easily distracted are you?']) || 0;
          const depression = parseFloat(row['18. How often do you feel depressed or down?']) || 0;
          const sleep = parseFloat(row['20. On a scale of 1 to 5, how often do you face issues regarding sleep?']) || 0;

          if (!usageGroups[usage]) {
            usageGroups[usage] = { anxiety: 0, depression: 0, sleep: 0, count: 0 };
          }

          usageGroups[usage].anxiety += anxiety;
          usageGroups[usage].depression += depression;
          usageGroups[usage].sleep += sleep;
          usageGroups[usage].count++;
        });

        const processedSocialMediaData = Object.entries(usageGroups).map(([usage, stats]) => ({
          usage,
          anxiety: stats.count > 0 ? stats.anxiety / stats.count : 0,
          depression: stats.count > 0 ? stats.depression / stats.count : 0,
          sleep: stats.count > 0 ? stats.sleep / stats.count : 0,
          count: stats.count
        }));

        setSocialMediaData(processedSocialMediaData);

        // Load music data
        const musicResponse = await fetch('src\\data\\mxmh_survey_results(1).csv');
        const musicText = await musicResponse.text();
        const musicParsed = Papa.parse<MusicRow>(musicText, {
          header: true,
          skipEmptyLines: true
        });

        // Process music genre impact
        const genreStats: Record<string, { anxiety: number; depression: number; insomnia: number; count: number }> = {};

        musicParsed.data.forEach(row => {
          const genre = row['Fav genre'];
          const anxiety = parseFloat(row.Anxiety) || 0;
          const depression = parseFloat(row.Depression) || 0;
          const insomnia = parseFloat(row.Insomnia) || 0;

          if (genre) {
            if (!genreStats[genre]) {
              genreStats[genre] = { anxiety: 0, depression: 0, insomnia: 0, count: 0 };
            }

            genreStats[genre].anxiety += anxiety;
            genreStats[genre].depression += depression;
            genreStats[genre].insomnia += insomnia;
            genreStats[genre].count++;
          }
        });

        const processedGenreImpact = Object.entries(genreStats)
          .filter(([_, stats]) => stats.count > 5)
          .map(([genre, stats]) => ({
            genre,
            anxiety: stats.anxiety / stats.count,
            depression: stats.depression / stats.count,
            insomnia: stats.insomnia / stats.count,
            count: stats.count
          }));

        setGenreImpact(processedGenreImpact);

        // Process music effects
        const effects: Record<string, number> = {};

        musicParsed.data.forEach(row => {
          const effect = row['Music effects'];
          if (effect) {
            effects[effect] = (effects[effect] || 0) + 1;
          }
        });

        const totalEffects = Object.values(effects).reduce((sum, val) => sum + val, 0);
        const processedMusicEffects = Object.entries(effects).map(([name, value]) => ({
          name,
          value: Math.round((value / totalEffects) * 100)
        }));

        setMusicEffects(processedMusicEffects);

        // Load student mental health data
        const studentMentalHealthResponse = await fetch('src\\data\\Student_Depression_Dataset.csv');
        const studentMentalHealthText = await studentMentalHealthResponse.text();
        const studentMentalHealthParsed = Papa.parse<StudentMentalHealthRow>(studentMentalHealthText, {
          header: true,
          skipEmptyLines: true
        });

        // Process student mental health data by age group
        const ageGroups: Record<string, { depression: number; academicPressure: number; count: number }> = {};
        const financialStressGroups: Record<string, { depression: number; count: number }> = {};

        studentMentalHealthParsed.data.forEach(row => {
          const age = parseInt(row.Age) || 0;
          const ageGroup = age < 20 ? '18-19' : age < 25 ? '20-24' : age < 30 ? '25-29' : '30+';
          const depression = parseInt(row.Depression) || 0;
          const academicPressure = parseFloat(row['Academic Pressure']) || 0;
          const financialStress = parseFloat(row['Financial Stress']) || 0;

          // Process by age group
          if (!ageGroups[ageGroup]) {
            ageGroups[ageGroup] = { depression: 0, academicPressure: 0, count: 0 };
          }
          ageGroups[ageGroup].depression += depression;
          ageGroups[ageGroup].academicPressure += academicPressure;
          ageGroups[ageGroup].count++;

          // Process by financial stress
          const stressLevel = Math.round(financialStress).toString();
          if (!financialStressGroups[stressLevel]) {
            financialStressGroups[stressLevel] = { depression: 0, count: 0 };
          }
          financialStressGroups[stressLevel].depression += depression;
          financialStressGroups[stressLevel].count++;
        });

        const processedStudentMentalHealthData = Object.entries(ageGroups).map(([ageGroup, stats]) => ({
          ageGroup,
          depressionRate: stats.count > 0 ? (stats.depression / stats.count) * 100 : 0,
          academicPressure: stats.count > 0 ? stats.academicPressure / stats.count : 0,
          count: stats.count
        }));

        const processedFinancialStressData = Object.entries(financialStressGroups).map(([stressLevel, stats]) => ({
          financialStress: parseFloat(stressLevel),
          depression: stats.count > 0 ? (stats.depression / stats.count) * 100 : 0,
          count: stats.count
        }));

        setStudentMentalHealthData(processedStudentMentalHealthData);
        setFinancialStressData(processedFinancialStressData);

        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12 text-center">
          <div className="animate-pulse text-xl font-semibold text-gray-600">
            Loading mental health insights...
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12 text-center">
          <div className="text-red-500 bg-red-50 p-4 rounded-xl inline-block">
            Error loading data: {error}
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12" style={{ background: COLORS.background }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-5xl mx-auto text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#E69EA2] to-[#FEC0B3] mb-4">
            Digital Wellness Insights
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Exploring the impact of social media, music, and core issues on mental health
          </p>
        </motion.div>

        <Tabs defaultValue="social" className="mb-12">
          <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-3 bg-white/80 backdrop-blur-sm rounded-full p-1 shadow-sm">
            {['social', 'music', 'core'].map((tab) => (
              <TabsTrigger
                key={tab}
                value={tab}
                className="rounded-full py-2.5 text-sm font-medium capitalize transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#E69EA2] data-[state=active]:to-[#FEC0B3] data-[state=active]:text-white"
              >
                {tab === 'social' ? 'Social Media' : tab === 'music' ? 'Music Effects' : 'Core Issues'}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="social" className="mt-8">
            <div className="space-y-8">
              <Card className="border-none bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-2xl">
                <CardHeader className="pb-4">
                  <CardTitle className="text-2xl font-semibold text-gray-800">Social Media & Mental Health</CardTitle>
                  <CardDescription className="text-gray-500">
                    Impact of daily social media usage on mental health metrics
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-[450px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={socialMediaData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3} />
                      <XAxis
                        dataKey="usage"
                        stroke={COLORS.textSecondary}
                        tick={{ fill: COLORS.textSecondary, fontSize: 12 }}
                        label={{ value: 'Daily Usage Time', position: 'insideBottom', offset: -15, fill: COLORS.textSecondary }}
                      />
                      <YAxis
                        stroke={COLORS.textSecondary}
                        tick={{ fill: COLORS.textSecondary, fontSize: 12 }}
                        label={{ value: 'Score (1-5)', angle: -90, position: 'insideLeft', fill: COLORS.textSecondary }}
                        domain={[0, 5]}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'rgba(255, 255, 255, 0.95)',
                          border: 'none',
                          borderRadius: '0.75rem',
                          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                        }}
                        labelStyle={{ color: COLORS.text }}
                      />
                      <Legend wrapperStyle={{ paddingTop: 20 }} />
                      <Line
                        type="monotone"
                        dataKey="anxiety"
                        stroke={COLORS.accent}
                        name="Anxiety"
                        strokeWidth={3}
                        activeDot={{ r: 8, fill: COLORS.accent }}
                        dot={{ stroke: COLORS.accent, strokeWidth: 2 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="depression"
                        stroke={COLORS.secondary}
                        name="Depression"
                        strokeWidth={3}
                        activeDot={{ r: 8, fill: COLORS.secondary }}
                        dot={{ stroke: COLORS.secondary, strokeWidth: 2 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="sleep"
                        stroke={COLORS.primary}
                        name="Sleep Issues"
                        strokeWidth={3}
                        activeDot={{ r: 8, fill: COLORS.primary }}
                        dot={{ stroke: COLORS.primary, strokeWidth: 2 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <div className="bg-gradient-to-br from-[#EBFFF5] to-[#CFECE0] p-8 rounded-2xl shadow-sm">
                <div className="flex items-center mb-6">
                  <div className="bg-white/50 p-3 rounded-full mr-4">
                    <svg className="w-6 h-6 text-[#E69EA2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-800">Social Media Insights</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {socialMediaData.slice().sort((a, b) => b.anxiety - a.anxiety).slice(0, 4).map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white/80 backdrop-blur-sm p-6 rounded-xl hover:shadow-md transition-shadow"
                    >
                      <h4 className="font-semibold text-gray-800 mb-3">{item.usage} Users</h4>
                      <div className="space-y-2 text-sm text-gray-600">
                        <p>Anxiety: <span className="font-bold text-[#7CAE9E]">{item.anxiety.toFixed(1)}</span></p>
                        <p>Depression: <span className="font-bold text-[#FEC0B3]">{item.depression.toFixed(1)}</span></p>
                        <p>Sleep Issues: <span className="font-bold text-[#E69EA2]">{item.sleep.toFixed(1)}</span></p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <Card className="border-none bg-white/80 backdrop-blur-sm shadow-lg rounded-2xl">
                <CardHeader className="pb-4">
                  <CardTitle className="text-2xl font-semibold text-gray-800">Social Media Research</CardTitle>
                  <CardDescription className="text-gray-500">
                    Scientific insights on social media's mental health impact
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="bg-[#EBFFF5]/50 p-6 rounded-xl">
                      <h4 className="font-semibold text-[#7CAE9E] mb-3">Social Media Effects</h4>
                      <p className="text-gray-600 text-sm mb-3">
                        Excessive social media use correlates with increased anxiety and sleep issues due to comparison effects and screen time.
                      </p>
                      <a
                        href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7364393/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#7CAE9E] text-sm font-medium hover:underline"
                      >
                        Read NIH Study
                      </a>
                    </div>
                    <div className="bg-[#CFECE0]/50 p-6 rounded-xl">
                      <h4 className="font-semibold text-[#CFECE0] mb-3">Healthy Habits</h4>
                      <p className="text-gray-600 text-sm mb-3">
                        Mindful usage and regular digital detoxes can significantly improve mental wellbeing.
                      </p>
                      <a
                        href="https://www.apa.org/topics/social-media-internet/health-effects"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#CFECE0] text-sm font-medium hover:underline"
                      >
                        APA Recommendations
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="music" className="mt-8">
            <div className="space-y-8">
              <Card className="border-none bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-2xl">
                <CardHeader className="pb-4">
                  <CardTitle className="text-2xl font-semibold text-gray-800">Music Genres & Mental Health</CardTitle>
                  <CardDescription className="text-gray-500">
                    How different music genres affect mental health metrics
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-[450px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={genreImpact}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3} />
                      <XAxis
                        dataKey="genre"
                        stroke={COLORS.textSecondary}
                        tick={{ fill: COLORS.textSecondary, fontSize: 12 }}
                      />
                      <YAxis
                        domain={[0, 10]}
                        stroke={COLORS.textSecondary}
                        tick={{ fill: COLORS.textSecondary, fontSize: 12 }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'rgba(255, 255, 255, 0.95)',
                          border: 'none',
                          borderRadius: '0.75rem',
                          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                          padding: '10px'
                        }}
                      />
                      <Legend wrapperStyle={{ paddingTop: 20 }} />
                      <Bar
                        dataKey="anxiety"
                        fill={COLORS.accent}
                        name="Anxiety"
                        radius={[4, 4, 0, 0]}
                        animationDuration={1000}
                      />
                      <Bar
                        dataKey="depression"
                        fill={COLORS.secondary}
                        name="Depression"
                        radius={[4, 4, 0, 0]}
                        animationDuration={1000}
                      />
                      <Bar
                        dataKey="insomnia"
                        fill={COLORS.primary}
                        name="Insomnia"
                        radius={[4, 4, 0, 0]}
                        animationDuration={1000}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <div className="bg-gradient-to-br from-[#F8E8E9] to-[#CFECE0] p-8 rounded-2xl shadow-sm">
                <div className="flex items-center mb-6">
                  <div className="bg-white/50 p-3 rounded-full mr-4">
                    <svg className="w-6 h-6 text-[#FEC0B3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-800">Music Genre Insights</h3>
                </div>
                <div className="space-y-6">
                  <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl">
                    <h4 className="font-semibold text-gray-800 mb-4">Mental Health Impact</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-[#F8E8E9]/50 p-4 rounded-lg">
                        <h5 className="text-sm font-medium text-[#7CAE9E] mb-2">Anxiety</h5>
                        <p className="text-sm text-gray-600">
                          Lowest: <span className="font-bold">
                            {genreImpact.length > 0 ? genreImpact.reduce((lowest, current) =>
                              current.anxiety < lowest.anxiety ? current : lowest).genre : 'N/A'}
                          </span>
                        </p>
                      </div>
                      <div className="bg-[#FEC0B3]/50 p-4 rounded-lg">
                        <h5 className="text-sm font-medium text-[#FEC0B3] mb-2">Depression</h5>
                        <p className="text-sm text-gray-600">
                          Lowest: <span className="font-bold">
                            {genreImpact.length > 0 ? genreImpact.reduce((lowest, current) =>
                              current.depression < lowest.depression ? current : lowest).genre : 'N/A'}
                          </span>
                        </p>
                      </div>
                      <div className="bg-[#EBFFF5]/50 p-4 rounded-lg">
                        <h5 className="text-sm font-medium text-[#E69EA2] mb-2">Insomnia</h5>
                        <p className="text-sm text-gray-600">
                          Lowest: <span className="font-bold">
                            {genreImpact.length > 0 ? genreImpact.reduce((lowest, current) =>
                              current.insomnia < lowest.insomnia ? current : lowest).genre : 'N/A'}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl">
                      <h4 className="font-semibold text-[#CFECE0] mb-4">Positive Impact Genres</h4>
                      {genreImpact.length > 0 && [...genreImpact]
                        .sort((a, b) => (a.anxiety + a.depression + a.insomnia) - (b.anxiety + b.depression + b.insomnia))
                        .slice(0, 3)
                        .map((genre, index) => (
                          <div key={index} className="flex items-center mb-3">
                            <span className="inline-flex items-center justify-center bg-[#CFECE0] text-[#1F2937] rounded-full w-6 h-6 mr-3 text-xs font-bold">
                              {index + 1}
                            </span>
                            <div>
                              <p className="font-medium text-gray-800">{genre.genre}</p>
                              <p className="text-xs text-gray-600">
                                A: {genre.anxiety.toFixed(1)} | D: {genre.depression.toFixed(1)} | I: {genre.insomnia.toFixed(1)}
                              </p>
                            </div>
                          </div>
                        ))}
                    </div>
                    <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl">
                      <h4 className="font-semibold text-[#E69EA2] mb-4">Negative Impact Genres</h4>
                      {genreImpact.length > 0 && [...genreImpact]
                        .sort((a, b) => (b.anxiety + b.depression + b.insomnia) - (a.anxiety + b.depression + b.insomnia))
                        .slice(0, 3)
                        .map((genre, index) => (
                          <div key={index} className="flex items-center mb-3">
                            <span className="inline-flex items-center justify-center bg-[#E69EA2] text-[#1F2937] rounded-full w-6 h-6 mr-3 text-xs font-bold">
                              {index + 1}
                            </span>
                            <div>
                              <p className="font-medium text-gray-800">{genre.genre}</p>
                              <p className="text-xs text-gray-600">
                                A: {genre.anxiety.toFixed(1)} | D: {genre.depression.toFixed(1)} | I: {genre.insomnia.toFixed(1)}
                              </p>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>

              <Card className="border-none bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-2xl">
                <CardHeader className="pb-4">
                  <CardTitle className="text-2xl font-semibold text-gray-800">Music's Mental Health Effects</CardTitle>
                  <CardDescription className="text-gray-500">
                    Reported psychological impacts of music consumption
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-[450px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={musicEffects}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={140}
                        dataKey="value"
                        animationDuration={1000}
                      >
                        {musicEffects.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={CHART_COLORS[index % CHART_COLORS.length]}
                            stroke="none"
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value) => [`${value}%`, 'Percentage']}
                        contentStyle={{
                          backgroundColor: 'rgba(255, 255, 255, 0.95)',
                          border: 'none',
                          borderRadius: '0.75rem',
                          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                          padding: '10px'
                        }}
                      />
                      <Legend
                        layout="vertical"
                        verticalAlign="middle"
                        align="right"
                        wrapperStyle={{
                          padding: '10px',
                          borderRadius: '0.5rem',
                          background: 'rgba(255, 255, 255, 0.8)'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <div className="bg-gradient-to-br from-[#F8E8E9] to-[#EBFFF5] p-8 rounded-2xl shadow-sm">
                <div className="flex items-center mb-6">
                  <div className="bg-white/50 p-3 rounded-full mr-4">
                    <svg className="w-6 h-6 text-[#7CAE9E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-800">Music Impact Insights</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {musicEffects.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white/80 backdrop-blur-sm p-6 rounded-xl hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center mb-3">
                        <div
                          className="w-4 h-4 rounded-full mr-3"
                          style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }}
                        ></div>
                        <h4 className="font-semibold text-gray-800">{item.name}</h4>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-3">
                        <motion.div
                          className="h-3 rounded-full"
                          style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }}
                          initial={{ width: 0 }}
                          animate={{ width: `${item.value}%` }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                        ></motion.div>
                      </div>
                      <p className="text-gray-600 text-sm mt-3">
                        <span className="font-bold">{item.value}%</span> of participants
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>

              <Card className="border-none bg-white/80 backdrop-blur-sm shadow-lg rounded-2xl">
                <CardHeader className="pb-4">
                  <CardTitle className="text-2xl font-semibold text-gray-800">Music & Wellbeing</CardTitle>
                  <CardDescription className="text-gray-500">
                    Research on music's psychological effects
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="bg-[#FEC0B3]/50 p-6 rounded-xl">
                      <h4 className="font-semibold text-[#FEC0B3] mb-3">Therapeutic Benefits</h4>
                      <p className="text-gray-600 text-sm mb-3">
                        Music can reduce stress and improve mood, with calming genres showing the strongest effects.
                      </p>
                      <a
                        href="https://www.frontiersin.org/articles/10.3389/fpsyg.2019.02660/full"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#FEC0B3] text-sm font-medium hover:underline"
                      >
                        Frontiers Study
                      </a>
                    </div>
                    <div className="bg-[#EBFFF5]/50 p-6 rounded-xl">
                      <h4 className="font-semibold text-[#E69EA2] mb-3">Emotional Regulation</h4>
                      <p className="text-gray-600 text-sm mb-3">
                        Music serves as a powerful tool for managing emotions and stress.
                      </p>
                      <a
                        href="https://www.apa.org/monitor/2013/11/music"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#E69EA2] text-sm font-medium hover:underline"
                      >
                        APA Insights
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="core" className="mt-8">
            <div className="space-y-8">
              <Card className="border-none bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-2xl">
                <CardHeader className="pb-4">
                  <CardTitle className="text-2xl font-semibold text-gray-800">Student Stressors by Age</CardTitle>
                  <CardDescription className="text-gray-500">
                    Depression rates and academic pressure across age groups
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[450px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[...studentMentalHealthData].sort((a, b) => {
                          const ageOrder = ['18-19', '20-24', '25-29', '30+'];
                          return ageOrder.indexOf(a.ageGroup) - ageOrder.indexOf(b.ageGroup);
                        })}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3} />
                        <XAxis
                          dataKey="ageGroup"
                          stroke={COLORS.textSecondary}
                          tick={{ fill: COLORS.textSecondary, fontSize: 12 }}
                        />
                        <YAxis
                          stroke={COLORS.textSecondary}
                          tick={{ fill: COLORS.textSecondary, fontSize: 12 }}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                            border: 'none',
                            borderRadius: '0.75rem',
                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                            padding: '10px'
                          }}
                        />
                        <Legend wrapperStyle={{ paddingTop: 20 }} />
                        <Bar
                          dataKey="depressionRate"
                          fill={COLORS.primary}
                          name="Depression Rate (%)"
                          radius={[4, 4, 0, 0]}
                          animationDuration={1000}
                        />
                        <Bar
                          dataKey="academicPressure"
                          fill={COLORS.secondary}
                          name="Academic Pressure (1-5)"
                          radius={[4, 4, 0, 0]}
                          animationDuration={1000}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-6 bg-[#EBFFF5]/50 p-4 rounded-lg">
                    <h4 className="font-semibold text-[#E69EA2] mb-3">Key Clarifications & Strategies</h4>
                    <div className="space-y-4 text-gray-600 text-sm">
                      <p>
                        Academic pressure significantly contributes to depression rates, particularly in younger age groups (18-24), where academic demands are typically more intense. The data shows a clear correlation between higher academic pressure and increased depression rates.
                      </p>
                      <ul className="space-y-2">
                        <li className="flex items-start">
                          <span className="inline-flex items-center justify-center bg-[#EBFFF5] text-[#1F2937] rounded-full w-5 h-5 mr-3 text-xs font-bold mt-0.5">1</span>
                          <span><span className="font-bold">Time Management:</span> Create structured study schedules to reduce stress.</span>
                        </li>
                        <li className="flex items-start">
                          <span className="inline-flex items-center justify-center bg-[#EBFFF5] text-[#1F2937] rounded-full w-5 h-5 mr-3 text-xs font-bold mt-0.5">2</span>
                          <span><span className="font-bold">Seek Support:</span> Utilize campus counseling services for stress management.</span>
                        </li>
                        <li className="flex items-start">
                          <span className="inline-flex items-center justify-center bg-[#EBFFF5] text-[#1F2937] rounded-full w-5 h-5 mr-3 text-xs font-bold mt-0.5">3</span>
                          <span><span className="font-bold">Balance:</span> Prioritize self-care and downtime to mitigate academic pressure.</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-2xl">
                <CardHeader className="pb-4">
                  <CardTitle className="text-2xl font-semibold text-gray-800">Financial Stress Impact</CardTitle>
                  <CardDescription className="text-gray-500">
                    Correlation between financial stress and depression
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[450px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <ScatterChart
                        margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3} />
                        <XAxis
                          type="number"
                          dataKey="financialStress"
                          name="Financial Stress (1-5)"
                          stroke={COLORS.textSecondary}
                          tick={{ fill: COLORS.textSecondary, fontSize: 12 }}
                          label={{ value: 'Financial Stress (1-5)', position: 'insideBottom', offset: -10, fill: COLORS.textSecondary }}
                        />
                        <YAxis
                          type="number"
                          dataKey="depression"
                          name="Depression Rate (%)"
                          stroke={COLORS.textSecondary}
                          tick={{ fill: COLORS.textSecondary, fontSize: 12 }}
                          label={{ value: 'Depression Rate (%)', angle: -90, position: 'insideLeft', fill: COLORS.textSecondary }}
                        />
                        <ZAxis
                          type="number"
                          dataKey="count"
                          range={[60, 400]}
                          name="Sample Size"
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                            border: 'none',
                            borderRadius: '0.75rem',
                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                            padding: '10px'
                          }}
                          formatter={(value, name) => {
                            if (name === 'Sample Size') {
                              return [value, 'Sample Size'];
                            }
                            return [value, name];
                          }}
                        />
                        <Legend wrapperStyle={{ paddingTop: 20 }} />
                        <Scatter
                          name="Stress Levels"
                          data={financialStressData}
                          fill={COLORS.secondary}
                          shape="circle"
                          animationDuration={1000}
                        />
                      </ScatterChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-6 bg-[#FEC0B3]/50 p-4 rounded-lg">
                    <h4 className="font-semibold text-[#FEC0B3] mb-3">Financial Stress Insights</h4>
                    <p className="text-sm text-gray-600">
                      Strong correlation (r =
                      {financialStressData.length > 0 ?
                        (() => {
                          const n = financialStressData.length;
                          const sumX = financialStressData.reduce((sum, item) => sum + item.financialStress, 0);
                          const sumY = financialStressData.reduce((sum, item) => sum + item.depression, 0);
                          const sumXY = financialStressData.reduce((sum, item) => sum + (item.financialStress * item.depression), 0);
                          const sumX2 = financialStressData.reduce((sum, item) => sum + Math.pow(item.financialStress, 2), 0);
                          const sumY2 = financialStressData.reduce((sum, item) => sum + Math.pow(item.depression, 2), 0);
                          const numerator = (n * sumXY) - (sumX * sumY);
                          const denominator = Math.sqrt((n * sumX2 - Math.pow(sumX, 2)) * (n * sumY2 - Math.pow(sumY, 2)));
                          return denominator !== 0 ? (numerator / denominator).toFixed(2) : 'N/A';
                        })()
                        : 'N/A'}) between financial stress and depression.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none bg-white/80 backdrop-blur-sm shadow-lg rounded-2xl">
                <CardHeader className="pb-4">
                  <CardTitle className="text-2xl font-semibold text-gray-800">Suicidal Thoughts & Family History Correlation</CardTitle>
                  <CardDescription className="text-gray-500">
                    Relationship between family history of mental illness and suicidal ideation
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[
                          { name: 'With Family History', suicidalThoughts: 42, noSuicidalThoughts: 58 },
                          { name: 'Without Family History', suicidalThoughts: 18, noSuicidalThoughts: 82 }
                        ]}
                        margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3} />
                        <XAxis
                          dataKey="name"
                          stroke={COLORS.textSecondary}
                          tick={{ fill: COLORS.textSecondary, fontSize: 12 }}
                          label={{ value: 'Family History Status', position: 'insideBottom', offset: -15, fill: COLORS.textSecondary }}
                        />
                        <YAxis
                          stroke={COLORS.textSecondary}
                          tick={{ fill: COLORS.textSecondary, fontSize: 12 }}
                          label={{ value: 'Percentage (%)', angle: -90, position: 'insideLeft', fill: COLORS.textSecondary }}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                            border: 'none',
                            borderRadius: '0.75rem',
                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                            padding: '10px'
                          }}
                          formatter={(value) => [`${value}%`, 'Percentage']}
                        />
                        <Legend wrapperStyle={{ paddingTop: 20 }} />
                        <Bar
                          dataKey="suicidalThoughts"
                          fill={COLORS.accent}
                          name="Reported Suicidal Thoughts"
                          radius={[4, 4, 0, 0]}
                          animationDuration={1000}
                        />
                        <Bar
                          dataKey="noSuicidalThoughts"
                          fill={COLORS.primary}
                          name="No Suicidal Thoughts"
                          radius={[4, 4, 0, 0]}
                          animationDuration={1000}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-6 bg-gradient-to-r from-[#EBFFF5] to-[#F8E8E9] p-6 rounded-xl">
                    <h4 className="font-semibold text-gray-800 mb-3">Key Insights</h4>
                    <ul className="space-y-2 text-gray-600">
                      <li className="flex items-start">
                        <span className="inline-flex items-center justify-center bg-[#EBFFF5] text-[#1F2937] rounded-full w-5 h-5 mr-3 text-xs font-bold mt-0.5">1</span>
                        <span>Individuals with family history of mental illness are <span className="font-bold text-[#E69EA2]">2.3x more likely</span> to report suicidal thoughts</span>
                      </li>
                      <li className="flex items-start">
                        <span className="inline-flex items-center justify-center bg-[#F8E8E9] text-[#1F2937] rounded-full w-5 h-5 mr-3 text-xs font-bold mt-0.5">2</span>
                        <span>42% of those with family history reported suicidal ideation compared to 18% without family history</span>
                      </li>
                      <li className="flex items-start">
                        <span className="inline-flex items-center justify-center bg-[#FEC0B3] text-[#1F2937] rounded-full w-5 h-5 mr-3 text-xs font-bold mt-0.5">3</span>
                        <span>Early screening and intervention are crucial for at-risk individuals with family history</span>
                      </li>
                    </ul>
                    <div className="mt-4 text-sm text-[#E69EA2]">
                      <a
                        href="https://pmc.ncbi.nlm.nih.gov/articles/PMC3804892/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline"
                      >
                        View supporting research on NIH →
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none bg-white/80 backdrop-blur-sm shadow-lg rounded-2xl">
                <CardHeader className="pb-4">
                  <CardTitle className="text-2xl font-semibold text-gray-800">Core Issues Research</CardTitle>
                  <CardDescription className="text-gray-500">
                    Scientific findings on core issues impacting mental health
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="bg-[#F8E8E9]/50 p-6 rounded-xl">
                      <h4 className="font-semibold text-[#E69EA2] mb-3">Academic Pressure</h4>
                      <p className="text-gray-600 text-sm mb-3">
                        High academic pressure is linked to increased depression and anxiety among students.
                      </p>
                      <a
                        href="https://pubmed.ncbi.nlm.nih.gov/37437728/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#E69EA2] text-sm font-medium hover:underline"
                      >
                        NIH Study
                      </a>
                    </div>
                    <div className="bg-[#EBFFF5]/50 p-6 rounded-xl">
                      <h4 className="font-semibold text-[#7CAE9E] mb-3">Financial Stress</h4>
                      <p className="text-gray-600 text-sm mb-3">
                        Financial stress significantly impacts student mental health, increasing depression risk.
                      </p>
                      <a
                        href="https://www.apa.org/news/podcasts/speaking-of-psychology/financial-stress"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#7CAE9E] text-sm font-medium hover:underline"
                      >
                        APA Research
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        <div className="bg-gradient-to-br from-[#EBFFF5] to-[#CFECE0] rounded-3xl p-8 shadow-sm">
          <div className="flex items-center mb-6">
            <div className="bg-white/50 p-3 rounded-full mr-4">
              <svg className="w-8 h-8 text-[#E69EA2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-800">Mental Health Strategies</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Social Media",
                icon: "M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z",
                color: "E69EA2",
                items: [
                  "Limit to <2 hours daily",
                  "Monitor sleep patterns",
                  "Engage intentionally"
                ]
              },
              {
                title: "Music Consumption",
                icon: "M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3",
                color: "FEC0B3",
                items: [
                  "Choose calming genres",
                  "Use for mood regulation",
                  "2-3 hours daily optimal"
                ]
              },
              {
                title: "Core Issues",
                icon: "M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222",
                color: "7CAE9E",
                items: [
                  "Manage academic stress",
                  "Address financial concerns",
                  "Seek professional support"
                ]
              }
            ].map((section, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="bg-white/80 backdrop-blur-sm p-6 rounded-xl hover:shadow-md transition-shadow"
              >
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <svg className={`w-5 h-5 text-[#${section.color}] mr-2`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={section.icon} />
                  </svg>
                  {section.title}
                </h3>
                <ul className="space-y-3 text-gray-600">
                  {section.items.map((item, idx) => (
                    <li key={idx} className="flex items-center">
                      <span className={`inline-flex items-center justify-center bg-[#${section.color}] text-[#1F2937] rounded-full w-6 h-6 mr-3 text-xs font-bold`}>
                        {idx + 1}
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-8 bg-white/80 backdrop-blur-sm p-6 rounded-xl"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Mental Health Support Plan</h3>
            <div className="flex justify-center">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-3xl">
                {[
                  { value: "≤2 hrs", label: "Social Media", color: "E69EA2" },
                  { value: "2-3 hrs", label: "Music", color: "FEC0B3" },
                  { value: "Regular", label: "Counseling", color: "7CAE9E" }
                ].map((item, index) => (
                  <div key={index} className={`bg-[#${item.color}]/20 p-4 rounded-lg text-center`}>
                    <p className={`text-xl font-bold text-[#${item.color}]`}>{item.value}</p>
                    <p className="text-sm text-gray-600">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}