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
  ZAxis
} from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect } from 'react';
import Papa from 'papaparse';

// Modern color palette
const COLORS = {
  primary: "#3B82F6",
  primaryGradient: "linear-gradient(135deg, #3B82F6 0%, #60A5FA 100%)",
  secondary: "#8B5CF6",
  secondaryGradient: "linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)",
  accent: "#EC4899",
  accentGradient: "linear-gradient(135deg, #EC4899 0%, #F472B6 100%)",
  success: "#10B981",
  warning: "#F59E0B",
  background: "#F8FAFC",
  card: "rgba(255, 255, 255, 0.95)",
  cardHover: "rgba(255, 255, 255, 1)",
  text: "#1F2937",
  textSecondary: "#6B7280",
  border: "rgba(0, 0, 0, 0.05)"
};

const CHART_COLORS = [
  COLORS.primary,
  COLORS.secondary,
  COLORS.accent,
  COLORS.success,
  COLORS.warning
];

// Type definitions (unchanged from original)
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

type SubstanceRow = {
  Year: string;
  Age_Group: string;
  Gender: string;
  Smoking_Prevalence: string;
  Drug_Experimentation: string;
  Socioeconomic_Status: string;
  Peer_Influence: string;
  School_Programs: string;
  Family_Background: string;
  Mental_Health: string;
  Access_to_Counseling: string;
  Parental_Supervision: string;
  Substance_Education: string;
  Community_Support: string;
  Media_Influence: string;
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

type SubstanceImpact = {
  ageGroup: string;
  smokingRate: number;
  drugRate: number;
  mentalHealthScore: number;
  peerInfluence: number;
  count: number;
};

type GenderSubstanceUse = {
  gender: string;
  smokingRate: number;
  drugRate: number;
  mentalHealthImpact: number;
};

export default function Analysis() {
  const [socialMediaData, setSocialMediaData] = useState<MentalHealthCorrelation[]>([]);
  const [genreImpact, setGenreImpact] = useState<GenreImpact[]>([]);
  const [musicEffects, setMusicEffects] = useState<MusicEffect[]>([]);
  const [substanceData, setSubstanceData] = useState<SubstanceImpact[]>([]);
  const [genderSubstanceData, setGenderSubstanceData] = useState<GenderSubstanceUse[]>([]);
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

        // Load substance data
        const substanceResponse = await fetch('src\\data\\youth_smoking_drug_data_10000_rows_expanded.csv');
        const substanceText = await substanceResponse.text();
        const substanceParsed = Papa.parse<SubstanceRow>(substanceText, { 
          header: true,
          skipEmptyLines: true
        });

        // Process substance data by age group
        const ageGroups: Record<string, { 
          smoking: number; 
          drugs: number; 
          mentalHealth: number; 
          peerInfluence: number;
          count: number 
        }> = {};

        const genderGroups: Record<string, {
          smoking: number;
          drugs: number;
          mentalHealth: number;
          count: number
        }> = {};

        substanceParsed.data.forEach(row => {
          const ageGroup = row.Age_Group;
          const smoking = parseFloat(row.Smoking_Prevalence) || 0;
          const drugs = parseFloat(row.Drug_Experimentation) || 0;
          const mentalHealth = parseFloat(row.Mental_Health) || 0;
          const peerInfluence = parseFloat(row.Peer_Influence) || 0;
          const gender = row.Gender;

          // Process by age group
          if (!ageGroups[ageGroup]) {
            ageGroups[ageGroup] = { smoking: 0, drugs: 0, mentalHealth: 0, peerInfluence: 0, count: 0 };
          }
          ageGroups[ageGroup].smoking += smoking;
          ageGroups[ageGroup].drugs += drugs;
          ageGroups[ageGroup].mentalHealth += mentalHealth;
          ageGroups[ageGroup].peerInfluence += peerInfluence;
          ageGroups[ageGroup].count++;

          // Process by gender
          if (gender === "Male" || gender === "Female") {
            if (!genderGroups[gender]) {
              genderGroups[gender] = { smoking: 0, drugs: 0, mentalHealth: 0, count: 0 };
            }
            genderGroups[gender].smoking += smoking;
            genderGroups[gender].drugs += drugs;
            genderGroups[gender].mentalHealth += mentalHealth;
            genderGroups[gender].count++;
          }
        });

        const processedSubstanceData = Object.entries(ageGroups).map(([ageGroup, stats]) => ({
          ageGroup,
          smokingRate: stats.count > 0 ? stats.smoking / stats.count : 0,
          drugRate: stats.count > 0 ? stats.drugs / stats.count : 0,
          mentalHealthScore: stats.count > 0 ? stats.mentalHealth / stats.count : 0,
          peerInfluence: stats.count > 0 ? stats.peerInfluence / stats.count : 0,
          count: stats.count
        }));

        const processedGenderSubstanceData = Object.entries(genderGroups).map(([gender, stats]) => ({
          gender,
          smokingRate: stats.count > 0 ? stats.smoking / stats.count : 0,
          drugRate: stats.count > 0 ? stats.drugs / stats.count : 0,
          mentalHealthImpact: stats.count > 0 ? stats.mentalHealth / stats.count : 0
        }));

        setSubstanceData(processedSubstanceData);
        setGenderSubstanceData(processedGenderSubstanceData);
        
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
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-violet-600 mb-4">
            Digital Wellness Insights
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Exploring the impact of social media, music, and substance use on mental health
          </p>
        </motion.div>

        <Tabs defaultValue="social" className="mb-12">
          <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-3 bg-white/80 backdrop-blur-sm rounded-full p-1 shadow-sm">
            {['social', 'music', 'substance'].map((tab) => (
              <TabsTrigger
                key={tab}
                value={tab}
                className="rounded-full py-2.5 text-sm font-medium capitalize transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-violet-500 data-[state=active]:text-white"
              >
                {tab === 'social' ? 'Social Media' : tab === 'music' ? 'Music Effects' : 'Substance Use'}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Social Media Tab */}
          <TabsContent value="social" className="mt-8">
            <div className="space-y-8">
              {/* Social Media Usage Chart */}
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
                          padding: '10px'
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

              {/* Key Findings */}
              <div className="bg-gradient-to-br from-blue-50 to-violet-50 p-8 rounded-2xl shadow-sm">
                <div className="flex items-center mb-6">
                  <div className="bg-white/50 p-3 rounded-full mr-4">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                        <p>Anxiety: <span className="font-bold text-blue-600">{item.anxiety.toFixed(1)}</span></p>
                        <p>Depression: <span className="font-bold text-violet-600">{item.depression.toFixed(1)}</span></p>
                        <p>Sleep Issues: <span className="font-bold text-pink-600">{item.sleep.toFixed(1)}</span></p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Research Insights */}
              <Card className="border-none bg-white/80 backdrop-blur-sm shadow-lg rounded-2xl">
                <CardHeader className="pb-4">
                  <CardTitle className="text-2xl font-semibold text-gray-800">Social Media Research</CardTitle>
                  <CardDescription className="text-gray-500">
                    Scientific insights on social media's mental health impact
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="bg-blue-50/50 p-6 rounded-xl">
                      <h4 className="font-semibold text-blue-700 mb-3">Social Media Effects</h4>
                      <p className="text-gray-600 text-sm mb-3">
                        Excessive social media use correlates with increased anxiety and sleep issues due to comparison effects and screen time.
                      </p>
                      <a 
                        href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7364393/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 text-sm font-medium hover:underline"
                      >
                        Read NIH Study
                      </a>
                    </div>
                    <div className="bg-green-50/50 p-6 rounded-xl">
                      <h4 className="font-semibold text-green-700 mb-3">Healthy Habits</h4>
                      <p className="text-gray-600 text-sm mb-3">
                        Mindful usage and regular digital detoxes can significantly improve mental wellbeing.
                      </p>
                      <a 
                        href="https://www.apa.org/topics/social-media-internet/health-effects" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-green-600 text-sm font-medium hover:underline"
                      >
                        APA Recommendations
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Music Tab */}
          <TabsContent value="music" className="mt-8">
            <div className="space-y-8">
              {/* Genre Impact Chart */}
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

              {/* Key Findings */}
              <div className="bg-gradient-to-br from-violet-50 to-pink-50 p-8 rounded-2xl shadow-sm">
                <div className="flex items-center mb-6">
                  <div className="bg-white/50 p-3 rounded-full mr-4">
                    <svg className="w-6 h-6 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-800">Music Genre Insights</h3>
                </div>
                <div className="space-y-6">
                  <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl">
                    <h4 className="font-semibold text-gray-800 mb-4">Mental Health Impact</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-pink-50/50 p-4 rounded-lg">
                        <h5 className="text-sm font-medium text-pink-700 mb-2">Anxiety</h5>
                        <p className="text-sm text-gray-600">
                          Lowest: <span className="font-bold">
                            {genreImpact.length > 0 ? genreImpact.reduce((lowest, current) => 
                              current.anxiety < lowest.anxiety ? current : lowest).genre : 'N/A'}
                          </span>
                        </p>
                      </div>
                      <div className="bg-violet-50/50 p-4 rounded-lg">
                        <h5 className="text-sm font-medium text-violet-700 mb-2">Depression</h5>
                        <p className="text-sm text-gray-600">
                          Lowest: <span className="font-bold">
                            {genreImpact.length > 0 ? genreImpact.reduce((lowest, current) => 
                              current.depression < lowest.depression ? current : lowest).genre : 'N/A'}
                          </span>
                        </p>
                      </div>
                      <div className="bg-blue-50/50 p-4 rounded-lg">
                        <h5 className="text-sm font-medium text-blue-700 mb-2">Insomnia</h5>
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
                      <h4 className="font-semibold text-green-700 mb-4">Positive Impact Genres</h4>
                      {genreImpact.length > 0 && [...genreImpact]
                        .sort((a, b) => (a.anxiety + a.depression + a.insomnia) - (b.anxiety + b.depression + b.insomnia))
                        .slice(0, 3)
                        .map((genre, index) => (
                          <div key={index} className="flex items-center mb-3">
                            <span className="inline-flex items-center justify-center bg-green-100 text-green-800 rounded-full w-6 h-6 mr-3 text-xs font-bold">
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
                      <h4 className="font-semibold text-red-700 mb-4">Negative Impact Genres</h4>
                      {genreImpact.length > 0 && [...genreImpact]
                        .sort((a, b) => (b.anxiety + b.depression + b.insomnia) - (a.anxiety + b.depression + b.insomnia))
                        .slice(0, 3)
                        .map((genre, index) => (
                          <div key={index} className="flex items-center mb-3">
                            <span className="inline-flex items-center justify-center bg-red-100 text-red-800 rounded-full w-6 h-6 mr-3 text-xs font-bold">
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

              {/* Music Effects Chart */}
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

              {/* Music Effects Insights */}
              <div className="bg-gradient-to-br from-pink-50 to-blue-50 p-8 rounded-2xl shadow-sm">
                <div className="flex items-center mb-6">
                  <div className="bg-white/50 p-3 rounded-full mr-4">
                    <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

              {/* Music Research */}
              <Card className="border-none bg-white/80 backdrop-blur-sm shadow-lg rounded-2xl">
                <CardHeader className="pb-4">
                  <CardTitle className="text-2xl font-semibold text-gray-800">Music & Wellbeing</CardTitle>
                  <CardDescription className="text-gray-500">
                    Research on music's psychological effects
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="bg-purple-50/50 p-6 rounded-xl">
                      <h4 className="font-semibold text-purple-700 mb-3">Therapeutic Benefits</h4>
                      <p className="text-gray-600 text-sm mb-3">
                        Music can reduce stress and improve mood, with calming genres showing the strongest effects.
                      </p>
                      <a 
                        href="https://www.frontiersin.org/articles/10.3389/fpsyg.2019.02660/full" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-purple-600 text-sm font-medium hover:underline"
                      >
                        Frontiers Study
                      </a>
                    </div>
                    <div className="bg-blue-50/50 p-6 rounded-xl">
                      <h4 className="font-semibold text-blue-700 mb-3">Emotional Regulation</h4>
                      <p className="text-gray-600 text-sm mb-3">
                        Music serves as a powerful tool for managing emotions and stress.
                      </p>
                      <a 
                        href="https://www.apa.org/monitor/2013/11/music" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 text-sm font-medium hover:underline"
                      >
                        APA Insights
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Substance Use Tab */}
          <TabsContent value="substance" className="mt-8">
            <div className="space-y-8">
              {/* Age Group Substance Use Chart */}
              <Card className="border-none bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-2xl">
                <CardHeader className="pb-4">
                  <CardTitle className="text-2xl font-semibold text-gray-800">Substance Use by Age</CardTitle>
                  <CardDescription className="text-gray-500">
                    Substance use patterns across age groups
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-[450px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={substanceData}
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
                        dataKey="smokingRate" 
                        fill={COLORS.primary} 
                        name="Smoking Rate (%)" 
                        radius={[4, 4, 0, 0]} 
                        animationDuration={1000}
                      />
                      <Bar 
                        dataKey="drugRate" 
                        fill={COLORS.secondary} 
                        name="Drug Use (%)" 
                        radius={[4, 4, 0, 0]} 
                        animationDuration={1000}
                      />
                      <Bar 
                        dataKey="mentalHealthScore" 
                        fill={COLORS.accent} 
                        name="Mental Health (1-10)" 
                        radius={[4, 4, 0, 0]} 
                        animationDuration={1000}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Gender Substance Use Chart */}
              <Card className="border-none bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-2xl">
                <CardHeader className="pb-4">
                  <CardTitle className="text-2xl font-semibold text-gray-800">Substance Use by Gender</CardTitle>
                  <CardDescription className="text-gray-500">
                    Gender-based substance use patterns
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-[450px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={genderSubstanceData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3} />
                      <XAxis 
                        dataKey="gender" 
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
                        dataKey="smokingRate" 
                        fill={COLORS.primary} 
                        name="Smoking Rate (%)" 
                        radius={[4, 4, 0, 0]} 
                        animationDuration={1000}
                      />
                      <Bar 
                        dataKey="drugRate" 
                        fill={COLORS.secondary} 
                        name="Drug Use (%)" 
                        radius={[4, 4, 0, 0]} 
                        animationDuration={1000}
                      />
                      <Bar 
                        dataKey="mentalHealthImpact" 
                        fill={COLORS.accent} 
                        name="Mental Health (1-10)" 
                        radius={[4, 4, 0, 0]} 
                        animationDuration={1000}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Peer Influence Scatter Plot */}
              <Card className="border-none bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-2xl">
                <CardHeader className="pb-4">
                  <CardTitle className="text-2xl font-semibold text-gray-800">Peer Influence Impact</CardTitle>
                  <CardDescription className="text-gray-500">
                    Correlation between peer influence and substance use
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-[450px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart
                      margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3} />
                      <XAxis 
                        type="number" 
                        dataKey="peerInfluence" 
                        name="Peer Influence (1-10)" 
                        stroke={COLORS.textSecondary}
                        tick={{ fill: COLORS.textSecondary, fontSize: 12 }}
                        label={{ value: 'Peer Influence (1-10)', position: 'insideBottom', offset: -10, fill: COLORS.textSecondary }}
                      />
                      <YAxis 
                        type="number" 
                        dataKey="drugRate" 
                        name="Drug Use (%)" 
                        stroke={COLORS.textSecondary}
                        tick={{ fill: COLORS.textSecondary, fontSize: 12 }}
                        label={{ value: 'Drug Use (%)', angle: -90, position: 'insideLeft', fill: COLORS.textSecondary }}
                      />
                      <ZAxis 
                        type="number" 
                        dataKey="mentalHealthScore" 
                        range={[60, 400]} 
                        name="Mental Health Impact"
                      />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'rgba(255, 255, 255, 0.95)',
                          border: 'none',
                          borderRadius: '0.75rem',
                          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                          padding: '10px'
                        }}
                        formatter={(value, name, props) => {
                          if (name === 'Mental Health Impact') {
                            return [value, 'Mental Health Score (1-10)'];
                          }
                          return [value, name];
                        }}
                      />
                      <Legend wrapperStyle={{ paddingTop: 20 }} />
                      <Scatter
                        name="Age Groups"
                        data={substanceData}
                        fill={COLORS.secondary}
                        shape="circle"
                        animationDuration={1000}
                      />
                    </ScatterChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Substance Use Insights */}
              <div className="bg-gradient-to-br from-orange-50 to-red-50 p-8 rounded-2xl shadow-sm">
                <div className="flex items-center mb-6">
                  <div className="bg-white/50 p-3 rounded-full mr-4">
                    <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-800">Substance Use Insights</h3>
                </div>
                <div className="space-y-6">
                  <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl">
                    <h4 className="font-semibold text-gray-800 mb-4">High-Risk Groups</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-red-50/50 p-4 rounded-lg">
                        <h5 className="text-sm font-medium text-red-700 mb-2">Smoking Rates</h5>
                        {substanceData.length > 0 && [...substanceData]
                          .sort((a, b) => b.smokingRate - a.smokingRate)
                          .slice(0, 2)
                          .map((item, index) => (
                            <p key={index} className="text-sm text-gray-600 mb-1">
                              <span className="font-bold">{item.ageGroup}</span>: {item.smokingRate.toFixed(1)}%
                            </p>
                          ))}
                      </div>
                      <div className="bg-orange-50/50 p-4 rounded-lg">
                        <h5 className="text-sm font-medium text-orange-700 mb-2">Drug Use</h5>
                        {substanceData.length > 0 && [...substanceData]
                          .sort((a, b) => b.drugRate - a.drugRate)
                          .slice(0, 2)
                          .map((item, index) => (
                            <p key={index} className="text-sm text-gray-600 mb-1">
                              <span className="font-bold">{item.ageGroup}</span>: {item.drugRate.toFixed(1)}%
                            </p>
                          ))}
                      </div>
                    </div>
                  </div>
                  <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl">
                    <h4 className="font-semibold text-gray-800 mb-4">Mental Health Impact</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-blue-50/50 p-4 rounded-lg">
                        <h5 className="text-sm font-medium text-blue-700 mb-2">Mental Health Scores</h5>
                        {substanceData.length > 0 && [...substanceData]
                          .sort((a, b) => b.mentalHealthScore - a.mentalHealthScore)
                          .slice(0, 2)
                          .map((item, index) => (
                            <p key={index} className="text-sm text-gray-600 mb-1">
                              <span className="font-bold">{item.ageGroup}</span>: {item.mentalHealthScore.toFixed(1)}/10
                            </p>
                          ))}
                      </div>
                      <div className="bg-green-50/50 p-4 rounded-lg">
                        <h5 className="text-sm font-medium text-green-700 mb-2">Gender Patterns</h5>
                        {genderSubstanceData.map((item, index) => (
                          <p key={index} className="text-sm text-gray-600 mb-1">
                            <span className="font-bold">{item.gender}</span>: 
                            {item.mentalHealthImpact.toFixed(1)}/10, {item.smokingRate.toFixed(1)}%
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl">
                    <h4 className="font-semibold text-gray-800 mb-4">Peer Influence</h4>
                    <p className="text-sm text-gray-600">
                      Strong correlation (r = 
                      {substanceData.length > 0 ? 
                        (() => {
                          const n = substanceData.length;
                          const sumX = substanceData.reduce((sum, item) => sum + item.peerInfluence, 0);
                          const sumY = substanceData.reduce((sum, item) => sum + item.drugRate, 0);
                          const sumXY = substanceData.reduce((sum, item) => sum + (item.peerInfluence * item.drugRate), 0);
                          const sumX2 = substanceData.reduce((sum, item) => sum + Math.pow(item.peerInfluence, 2), 0);
                          const sumY2 = substanceData.reduce((sum, item) => sum + Math.pow(item.drugRate, 2), 0);
                          const numerator = (n * sumXY) - (sumX * sumY);
                          const denominator = Math.sqrt((n * sumX2 - Math.pow(sumX, 2)) * (n * sumY2 - Math.pow(sumY, 2)));
                          return denominator !== 0 ? (numerator / denominator).toFixed(2) : 'N/A';
                        })() 
                        : 'N/A'}) between peer influence and drug use.
                    </p>
                  </div>
                </div>
              </div>

              {/* Substance Use Research */}
              <Card className="border-none bg-white/80 backdrop-blur-sm shadow-lg rounded-2xl">
                <CardHeader className="pb-4">
                  <CardTitle className="text-2xl font-semibold text-gray-800">Substance Use Research</CardTitle>
                  <CardDescription className="text-gray-500">
                    Scientific findings on substance use impacts
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="bg-red-50/50 p-6 rounded-xl">
                      <h4 className="font-semibold text-red-700 mb-3">Mental Health Risks</h4>
                      <p className="text-gray-600 text-sm mb-3">
                        Substance use increases risks of depression and anxiety, with bidirectional effects.
                      </p>
                      <a 
                        href="https://www.drugabuse.gov/publications/drugs-brains-behavior-science-addiction/addiction-health" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-red-600 text-sm font-medium hover:underline"
                      >
                        NIDA Research
                      </a>
                    </div>
                    <div className="bg-orange-50/50 p-6 rounded-xl">
                      <h4 className="font-semibold text-orange-700 mb-3">Peer Influence</h4>
                      <p className="text-gray-600 text-sm mb-3">
                        Peer groups strongly influence substance use initiation in youth.
                      </p>
                      <a 
                        href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4411331/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-orange-600 text-sm font-medium hover:underline"
                      >
                        NIH Study
                      </a>
                    </div>
                    <div className="bg-yellow-50/50 p-6 rounded-xl">
                      <h4 className="font-semibold text-yellow-700 mb-3">Prevention Strategies</h4>
                      <p className="text-gray-600 text-sm mb-3">
                        Education and early intervention are key to reducing substance use risks.
                      </p>
                      <a 
                        href="https://www.samhsa.gov/find-help/prevention" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-yellow-600 text-sm font-medium hover:underline"
                      >
                        SAMHSA Resources
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Conclusion Section */}
        <div className="bg-gradient-to-br from-blue-50 to-violet-50 rounded-3xl p-8 shadow-sm">
          <div className="flex items-center mb-6">
            <div className="bg-white/50 p-3 rounded-full mr-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-800">Wellness Recommendations</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Social Media",
                icon: "M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z",
                color: "blue",
                items: [
                  "Limit to <2 hours daily",
                  "Monitor sleep patterns",
                  "Engage intentionally"
                ]
              },
              {
                title: "Music Consumption",
                icon: "M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3",
                color: "violet",
                items: [
                  "Choose calming genres",
                  "Use for mood regulation",
                  "2-3 hours daily optimal"
                ]
              },
              {
                title: "Substance Use",
                icon: "M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z",
                color: "red",
                items: [
                  "Focus on early intervention",
                  "Address peer influences",
                  "Seek mental health support"
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
                  <svg className={`w-5 h-5 text-${section.color}-600 mr-2`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={section.icon} />
                  </svg>
                  {section.title}
                </h3>
                <ul className="space-y-3 text-gray-600">
                  {section.items.map((item, idx) => (
                    <li key={idx} className="flex items-center">
                      <span className={`inline-flex items-center justify-center bg-${section.color}-100 text-${section.color}-800 rounded-full w-6 h-6 mr-3 text-xs font-bold`}>
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
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Balanced Lifestyle Plan</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { value: "≤2 hrs", label: "Social Media", color: "blue" },
                { value: "2-3 hrs", label: "Music", color: "violet" },
                { value: "Calming", label: "Genres", color: "green" },
                { value: "None", label: "Substances", color: "red" }
              ].map((item, index) => (
                <div key={index} className={`bg-${item.color}-50/50 p-4 rounded-lg text-center`}>
                  <p className={`text-xl font-bold text-${item.color}-700`}>{item.value}</p>
                  <p className="text-sm text-gray-600">{item.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}