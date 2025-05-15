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
  Line
} from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect } from 'react';
import Papa from 'papaparse';

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

// Simplified color palette
const COLORS = {
  primary: "#4F6DF5",       // Primary blue
  secondary: "#8A63E7",     // Purple
  accent: "#FF6B8B",        // Pink
  positive: "#6BCB77",      // Green
  neutral: "#FFD166",       // Yellow
  textDark: "#2D3748",      // Dark gray
  textMedium: "#4A5568",    // Medium gray
  textLight: "#718096",     // Light gray
  background: "#F7FAFC",    // Light background
  cardBackground: "#FFFFFF" // White
};

const CHART_COLORS = [
  COLORS.primary,
  COLORS.secondary,
  COLORS.accent,
  COLORS.positive,
  COLORS.neutral
];



export default function Analysis() {
  const [socialMediaData, setSocialMediaData] = useState<MentalHealthCorrelation[]>([]);
  const [genreImpact, setGenreImpact] = useState<GenreImpact[]>([]);
  const [musicEffects, setMusicEffects] = useState<MusicEffect[]>([]);
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
          <p>Loading mental health data analysis...</p>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12 text-center text-red-500">
          <p>Error loading data: {error}</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto text-center mb-12"
        >
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Digital Lifestyle & Mental Health
          </h1>
          <p className="text-lg text-gray-600">
            How social media and music consumption patterns affect psychological wellbeing
          </p>
        </motion.div>

        <Tabs defaultValue="social" className="mb-8">
          <TabsList className="grid w-full grid-cols-2 bg-gray-100">
            <TabsTrigger 
              value="social" 
              className="data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm"
            >
              Social Media Effects
            </TabsTrigger>
            <TabsTrigger 
              value="music" 
              className="data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm"
            >
              Music Effects
            </TabsTrigger>
          </TabsList>
          
          {/* Social Media Tab */}
          <TabsContent value="social" className="mt-6">
            <div className="grid grid-cols-1 gap-6">
              {/* Social Media Usage Chart */}
              <Card className="border border-gray-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-gray-800">Social Media Usage & Mental Health</CardTitle>
                  <CardDescription className="text-gray-600">
                    Average mental health scores by daily social media usage time (1-5 scale)
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={socialMediaData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis 
                        dataKey="usage" 
                        stroke="#6B7280"
                        label={{ value: 'Daily Usage Time', position: 'insideBottom', offset: -15, fill: "#6B7280" }}
                      />
                      <YAxis 
                        stroke="#6B7280"
                        label={{ value: 'Average Score', angle: -90, position: 'insideLeft', fill: "#6B7280" }}
                        domain={[0, 5]}
                      />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'rgba(255, 255, 255, 0.96)',
                          borderColor: '#E5E7EB',
                          borderRadius: '0.5rem',
                          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                        }}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="anxiety"
                        stroke={COLORS.accent}
                        name="Anxiety"
                        strokeWidth={2}
                        activeDot={{ r: 8 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="depression"
                        stroke={COLORS.secondary}
                        name="Depression"
                        strokeWidth={2}
                      />
                      <Line
                        type="monotone"
                        dataKey="sleep"
                        stroke={COLORS.primary}
                        name="Sleep Issues"
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Key Findings for Social Media Chart */}
              <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                <div className="flex items-center mb-4">
                  <div className="bg-blue-100 p-2 rounded-lg mr-3">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-blue-800">Key Findings: Social Media Usage</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {socialMediaData.slice().sort((a, b) => b.anxiety - a.anxiety).slice(0, 4).map((item, index) => (
                    <div key={index} className="bg-white p-4 rounded-lg border border-gray-200">
                      <h4 className="font-medium text-gray-800 mb-2">{item.usage} Users</h4>
                      <p className="text-gray-700 text-sm">
                        Anxiety: <span className="font-bold">{item.anxiety.toFixed(1)}</span><br />
                        Depression: <span className="font-bold">{item.depression.toFixed(1)}</span><br />
                        Sleep Issues: <span className="font-bold">{item.sleep.toFixed(1)}</span>
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Music Tab */}
          <TabsContent value="music" className="mt-6">
            <div className="grid grid-cols-1 gap-6">
              {/* Genre Impact Chart */}
              <Card className="border border-gray-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-gray-800">Music Genre Impact on Mental Health</CardTitle>
                  <CardDescription className="text-gray-600">
                    Average mental health scores by favorite music genre (1-10 scale)
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={genreImpact}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis dataKey="genre" stroke="#6B7280" />
                      <YAxis domain={[0, 10]} stroke="#6B7280" />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'rgba(255, 255, 255, 0.96)',
                          borderColor: '#E5E7EB',
                          borderRadius: '0.5rem',
                          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                        }}
                      />
                      <Legend />
                      <Bar dataKey="anxiety" fill={COLORS.accent} name="Anxiety" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="depression" fill={COLORS.secondary} name="Depression" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="insomnia" fill={COLORS.primary} name="Insomnia" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Enhanced Key Findings for Genre Impact Chart */}
              <div className="bg-purple-50 p-6 rounded-xl border border-purple-100">
                <div className="flex items-center mb-4">
                  <div className="bg-purple-100 p-2 rounded-lg mr-3">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-purple-800">Key Findings: Genre Impact</h3>
                </div>
                
                <div className="space-y-6">
                  {/* Overall Impact Summary */}
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <h4 className="font-medium text-gray-800 mb-3">Overall Impact Across Genres</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Anxiety */}
                      <div className="bg-pink-50 p-3 rounded-lg border border-pink-100">
                        <h5 className="text-sm font-semibold text-pink-700 mb-2">Anxiety Levels</h5>
                        <div className="text-sm text-gray-700">
                          <p className="font-medium">Lowest: <span className="font-bold">
                            {genreImpact.length > 0 
                              ? genreImpact.reduce((lowest, current) => 
                                  current.anxiety < lowest.anxiety ? current : lowest
                                ).genre 
                              : 'N/A'}
                          </span></p>
                          <p className="font-medium">Highest: <span className="font-bold">
                            {genreImpact.length > 0 
                              ? genreImpact.reduce((highest, current) => 
                                  current.anxiety > highest.anxiety ? current : highest
                                ).genre 
                              : 'N/A'}
                          </span></p>
                        </div>
                      </div>
                      
                      {/* Depression */}
                      <div className="bg-purple-50 p-3 rounded-lg border border-purple-100">
                        <h5 className="text-sm font-semibold text-purple-700 mb-2">Depression Levels</h5>
                        <div className="text-sm text-gray-700">
                          <p className="font-medium">Lowest: <span className="font-bold">
                            {genreImpact.length > 0 
                              ? genreImpact.reduce((lowest, current) => 
                                  current.depression < lowest.depression ? current : lowest
                                ).genre 
                              : 'N/A'}
                          </span></p>
                          <p className="font-medium">Highest: <span className="font-bold">
                            {genreImpact.length > 0 
                              ? genreImpact.reduce((highest, current) => 
                                  current.depression > highest.depression ? current : highest
                                ).genre 
                              : 'N/A'}
                          </span></p>
                        </div>
                      </div>
                      
                      {/* Insomnia */}
                      <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                        <h5 className="text-sm font-semibold text-blue-700 mb-2">Insomnia Levels</h5>
                        <div className="text-sm text-gray-700">
                          <p className="font-medium">Lowest: <span className="font-bold">
                            {genreImpact.length > 0 
                              ? genreImpact.reduce((lowest, current) => 
                                  current.insomnia < lowest.insomnia ? current : lowest
                                ).genre 
                              : 'N/A'}
                          </span></p>
                          <p className="font-medium">Highest: <span className="font-bold">
                            {genreImpact.length > 0 
                              ? genreImpact.reduce((highest, current) => 
                                  current.insomnia > highest.insomnia ? current : highest
                                ).genre 
                              : 'N/A'}
                          </span></p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Top Genres by Impact */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Top 3 Genres with Lowest Scores */}
                    <div className="bg-white p-4 rounded-lg border border-green-100">
                      <h4 className="font-medium text-green-800 mb-3">Most Positive Impact Genres</h4>
                      <div className="space-y-3">
                        {genreImpact.length > 0 && [...genreImpact]
                          .sort((a, b) => (a.anxiety + a.depression + a.insomnia) - (b.anxiety + b.depression + b.insomnia))
                          .slice(0, 3)
                          .map((genre, index) => (
                            <div key={index} className="flex items-start">
                              <span className="inline-flex items-center justify-center bg-green-100 text-green-800 rounded-full w-6 h-6 mr-3 flex-shrink-0 text-xs font-bold">
                                {index + 1}
                              </span>
                              <div>
                                <p className="font-medium text-gray-800">{genre.genre}</p>
                                <p className="text-xs text-gray-600">
                                  Anxiety: {genre.anxiety.toFixed(1)} · 
                                  Depression: {genre.depression.toFixed(1)} · 
                                  Insomnia: {genre.insomnia.toFixed(1)}
                                </p>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                    
                    {/* Top 3 Genres with Highest Scores */}
                    <div className="bg-white p-4 rounded-lg border border-red-100">
                      <h4 className="font-medium text-red-800 mb-3">Most Negative Impact Genres</h4>
                      <div className="space-y-3">
                        {genreImpact.length > 0 && [...genreImpact]
                          .sort((a, b) => (b.anxiety + b.depression + b.insomnia) - (a.anxiety + a.depression + a.insomnia))
                          .slice(0, 3)
                          .map((genre, index) => (
                            <div key={index} className="flex items-start">
                              <span className="inline-flex items-center justify-center bg-red-100 text-red-800 rounded-full w-6 h-6 mr-3 flex-shrink-0 text-xs font-bold">
                                {index + 1}
                              </span>
                              <div>
                                <p className="font-medium text-gray-800">{genre.genre}</p>
                                <p className="text-xs text-gray-600">
                                  Anxiety: {genre.anxiety.toFixed(1)} · 
                                  Depression: {genre.depression.toFixed(1)} · 
                                  Insomnia: {genre.insomnia.toFixed(1)}
                                </p>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Music Effects Chart */}
              <Card className="border border-gray-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-gray-800">Reported Effects of Music</CardTitle>
                  <CardDescription className="text-gray-600">
                    How participants report music affects their mental health
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={musicEffects}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {musicEffects.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={CHART_COLORS[index % CHART_COLORS.length]} 
                            stroke="#fff"
                            strokeWidth={1}
                          />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value) => [`${value}%`, 'Percentage']}
                        contentStyle={{
                          backgroundColor: 'rgba(255, 255, 255, 0.96)',
                          borderColor: '#E5E7EB',
                          borderRadius: '0.5rem',
                          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                        }}
                      />
                      <Legend 
                        layout="vertical"
                        verticalAlign="middle"
                        align="right"
                        wrapperStyle={{
                          backgroundColor: 'rgba(255, 255, 255, 0.7)',
                          padding: '0.5rem',
                          borderRadius: '0.5rem'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Key Findings for Music Effects Chart */}
              <div className="bg-pink-50 p-6 rounded-xl border border-pink-100">
                <div className="flex items-center mb-4">
                  <div className="bg-pink-100 p-2 rounded-lg mr-3">
                    <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-pink-800">Key Findings: Music Effects</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {musicEffects.map((item, index) => (
                    <div key={index} className="bg-white p-4 rounded-lg border border-gray-200">
                      <div className="flex items-center mb-2">
                        <div 
                          className="w-4 h-4 rounded-full mr-2" 
                          style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }}
                        ></div>
                        <h4 className="font-medium text-gray-800">{item.name}</h4>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="h-2.5 rounded-full" 
                          style={{ 
                            width: `${item.value}%`,
                            backgroundColor: CHART_COLORS[index % CHART_COLORS.length]
                          }}
                        ></div>
                      </div>
                      <p className="text-gray-600 text-sm mt-2">
                        <span className="font-bold">{item.value}%</span> of participants
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Comprehensive Conclusion Section */}
        <div className="mt-8 bg-blue-50 rounded-2xl p-8 border border-blue-100">
          <div className="flex items-center mb-6">
            <div className="bg-blue-100 p-3 rounded-lg mr-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-blue-900">Research Conclusions & Recommendations</h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                Social Media Usage
              </h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="inline-flex items-center justify-center bg-blue-100 text-blue-800 rounded-full w-6 h-6 mr-3 flex-shrink-0 text-sm font-bold">1</span>
                  <span><span className="font-semibold">Limit usage</span> - Highest mental health scores observed with less than 2 hours daily use</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-flex items-center justify-center bg-blue-100 text-blue-800 rounded-full w-6 h-6 mr-3 flex-shrink-0 text-sm font-bold">2</span>
                  <span><span className="font-semibold">Monitor sleep</span> - Sleep issues increase significantly with more than 3 hours daily use</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-flex items-center justify-center bg-blue-100 text-blue-800 rounded-full w-6 h-6 mr-3 flex-shrink-0 text-sm font-bold">3</span>
                  <span><span className="font-semibold">Be intentional</span> - Purposeful use correlates with better outcomes than passive scrolling</span>
                </li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                <svg className="w-5 h-5 text-purple-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
                Music Consumption
              </h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="inline-flex items-center justify-center bg-purple-100 text-purple-800 rounded-full w-6 h-6 mr-3 flex-shrink-0 text-sm font-bold">1</span>
                  <span><span className="font-semibold">Choose genres wisely</span> - Classical and jazz show strongest positive associations</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-flex items-center justify-center bg-purple-100 text-purple-800 rounded-full w-6 h-6 mr-3 flex-shrink-0 text-sm font-bold">2</span>
                  <span><span className="font-semibold">Use intentionally</span> - Most participants report music improves their mental health</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-flex items-center justify-center bg-purple-100 text-purple-800 rounded-full w-6 h-6 mr-3 flex-shrink-0 text-sm font-bold">3</span>
                  <span><span className="font-semibold">Moderate duration</span> - 2-3 hours daily appears optimal for therapeutic benefits</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-6 bg-white p-6 rounded-xl border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Overall Wellbeing Strategy</h3>
            <p className="text-gray-700 mb-4">
              Based on our analysis of the dataset, we recommend a <span className="font-bold">balanced digital lifestyle</span> that includes:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-3 rounded-lg text-center border border-blue-100">
                <p className="text-2xl font-bold text-blue-700">≤2 hrs</p>
                <p className="text-sm text-gray-600">Social media daily limit</p>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg text-center border border-purple-100">
                <p className="text-2xl font-bold text-purple-700">2-3 hrs</p>
                <p className="text-sm text-gray-600">Music listening daily</p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg text-center border border-green-100">
                <p className="text-2xl font-bold text-green-700">Classical/Jazz</p>
                <p className="text-sm text-gray-600">Recommended genres</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}