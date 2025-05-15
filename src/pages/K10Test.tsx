import { useState } from "react";
import Layout from "@/components/layout/Layout";
import K10Question from "@/components/k10test/K10Question";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, ClipboardCheck, AlertTriangle, Loader2, HeartPulse, Brain, ShieldAlert, Smile, Frown } from "lucide-react";
import { Card } from "@/components/ui/card";

const k10Questions = [
  "How often have you had little interest or pleasure in doing things?",
  "How often have you been feeling down, depressed or hopeless?",
  "How often have you had trouble falling or staying asleep, or sleeping too much?",
  "How often have you been feeling tired or having little energy?",
  "How often have you had poor appetite or overeating?",
  "How often have you been feeling bad about yourself - or that you are a failure or have let yourself or your family down?",
  "How often have you been having trouble concentrating on things, such as reading the books or watching television?",
  "How often have you moved or spoke too slowly for other people to notice? Or you've been moving a lot more than usual because you've been restless?",
  "How often have you had thoughts that you would be better off dead, or of hurting yourself?",
];

type PredictionResponse = {
  prediction: number;
  depressionLevel: string;
};

const mapAnswerToValue = (value: number): number => {
  switch(value) {
    case 1: return 0; // None of the time
    case 2: return 1; // A little of the time
    case 3: return 1; // Some of the time
    case 4: return 2; // Most of the time
    case 5: return 3; // All of the time
    default: return 0;
  }
};

const getDepressionColor = (level: string) => {
  switch(level) {
    case "no Depression": return {
      bg: "bg-emerald-50",
      text: "text-emerald-800",
      border: "border-emerald-200",
      icon: <Smile className="h-8 w-8 text-emerald-500" />,
      gradient: "from-emerald-100 to-emerald-50"
    };
    case "Minimal Depression": return {
      bg: "bg-blue-50",
      text: "text-blue-800",
      border: "border-blue-200",
      icon: <Smile className="h-8 w-8 text-blue-500" />,
      gradient: "from-blue-100 to-blue-50"
    };
    case "Mild Depression": return {
      bg: "bg-amber-50",
      text: "text-amber-800",
      border: "border-amber-200",
      icon: <Frown className="h-8 w-8 text-amber-500" />,
      gradient: "from-amber-100 to-amber-50"
    };
    case "Moderate Depression": return {
      bg: "bg-orange-50",
      text: "text-orange-800",
      border: "border-orange-200",
      icon: <Frown className="h-8 w-8 text-orange-500" />,
      gradient: "from-orange-100 to-orange-50"
    };
    case "Moderately Severe Depression": return {
      bg: "bg-red-50",
      text: "text-red-800",
      border: "border-red-200",
      icon: <ShieldAlert className="h-8 w-8 text-red-500" />,
      gradient: "from-red-100 to-red-50"
    };
    case "Severe Depression": return {
      bg: "bg-red-100",
      text: "text-red-900",
      border: "border-red-300",
      icon: <ShieldAlert className="h-8 w-8 text-red-600" />,
      gradient: "from-red-200 to-red-100"
    };
    default: return {
      bg: "bg-gray-50",
      text: "text-gray-800",
      border: "border-gray-200",
      icon: <Brain className="h-8 w-8 text-gray-500" />,
      gradient: "from-gray-100 to-gray-50"
    };
  }
};

const K10Test = () => {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [testCompleted, setTestCompleted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<number | null>(null);
  const [depressionLevel, setDepressionLevel] = useState<string | null>(null);

  const handleAnswerChange = (value: number) => {
    setAnswers(prev => ({ ...prev, [currentQuestionIndex]: value }));
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex < k10Questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const submitTestResults = async () => {
    if (Object.keys(answers).length !== k10Questions.length) {
      setApiError("Please answer all questions before submitting");
      return;
    }

    setIsSubmitting(true);
    setApiError(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found. Please log in again.');
      }

      const requestData = {
        Q1: [mapAnswerToValue(answers[0])],
        Q2: [mapAnswerToValue(answers[1])],
        Q3: [mapAnswerToValue(answers[2])],
        Q4: [mapAnswerToValue(answers[3])],
        Q5: [mapAnswerToValue(answers[4])],
        Q6: [mapAnswerToValue(answers[5])],
        Q7: [mapAnswerToValue(answers[6])],
        Q8: [mapAnswerToValue(answers[7])],
        Q9: [mapAnswerToValue(answers[8])],
      };

      const response = await fetch('https://localhost:7223/api/Prediction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to get prediction');
      }

      const data: PredictionResponse = await response.json();
      setPrediction(data.prediction);
      setDepressionLevel(data.depressionLevel);
      setTestCompleted(true);
    } catch (error) {
      console.error('Error submitting K10 results:', error);
      setApiError(error instanceof Error ? error.message : "Failed to submit results. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getDepressionRecommendations = (level: string) => {
    switch(level) {
      case "no Depression":
        return {
          title: "You're Doing Well",
          description: "Your results suggest you're not experiencing significant depression. Keep up the good work with your mental health maintenance.",
          recommendations: [
            "Continue maintaining good mental health habits",
            "Practice regular self-care and stress management",
            "Stay connected with friends and family",
            "Engage in activities you enjoy"
          ],
          resources: [
            { name: "Mental Wellness Tips", url: "/resources/wellness" },
            { name: "Mindfulness Exercises", url: "/resources/mindfulness" }
          ]
        };
      case "Minimal Depression":
        return {
          title: "Mild Fluctuations",
          description: "You may be experiencing minimal symptoms of depression. These are common and may not require treatment, but monitoring is recommended.",
          recommendations: [
            "Monitor your mood for any changes",
            "Practice stress-reduction techniques like mindfulness",
            "Maintain a regular sleep schedule",
            "Consider journaling to track your feelings"
          ],
          resources: [
            { name: "Stress Management Guide", url: "/resources/stress" },
            { name: "Sleep Hygiene Tips", url: "/resources/sleep" }
          ]
        };
      case "Mild Depression":
        return {
          title: "Mild Symptoms Detected",
          description: "Your results suggest mild depressive symptoms. Professional help may be beneficial if these symptoms persist or worsen.",
          recommendations: [
            "Consider speaking with a counselor or therapist",
            "Increase physical activity and social engagement",
            "Practice cognitive behavioral techniques",
            "Limit alcohol and maintain a healthy diet"
          ],
          resources: [
            { name: "Find a Therapist", url: "/information/#egyptian-professionals" },
            { name: "Self-Help Strategies", url: "/resources/self-help" }
          ]
        };
      case "Moderate Depression":
        return {
          title: "Moderate Symptoms Present",
          description: "You appear to have moderate depressive symptoms. Professional treatment is typically recommended at this level.",
          recommendations: [
            "Consult with a mental health professional",
            "Consider therapy options like CBT or interpersonal therapy",
            "Establish a daily routine with achievable goals",
            "Reach out to trusted friends or family for support"
          ],
          resources: [
            { name: "Urgent Care Options", url: "/resources/urgent-care" },
            { name: "Therapy Options Explained", url: "/resources/therapy-types" }
          ]
        };
      case "Moderately Severe Depression":
        return {
          title: "Significant Symptoms",
          description: "Your results indicate moderately severe depression. Professional treatment is strongly recommended.",
          recommendations: [
            "Seek professional help as soon as possible",
            "Contact a therapist or psychiatrist for evaluation",
            "Consider medication options with a healthcare provider",
            "Inform someone you trust about how you're feeling"
          ],
          resources: [
            { name: "Crisis Support", url: "/resources/crisis" },
            { name: "Immediate Help Options", url: "/resources/immediate-help" }
          ]
        };
      case "Severe Depression":
        return {
          title: "Severe Symptoms Detected",
          description: "Your results suggest severe depressive symptoms. Immediate professional intervention is strongly advised for your safety and well-being.",
          recommendations: [
            "Seek immediate professional help",
            "Contact a mental health crisis line if needed",
            "Reach out to a psychiatrist for evaluation",
            "Do not hesitate to ask for help from loved ones"
          ],
          resources: [
            { name: "24/7 Crisis Hotline", url: "/resources/crisis-hotline" },
            { name: "Emergency Resources", url: "/resources/emergency" }
          ]
        };
      default:
        return {
          title: "Your Assessment Results",
          description: "Please consult with a professional to discuss your results.",
          recommendations: [
            "Consult with a mental health professional",
            "Practice self-care and stress management",
            "Maintain social connections",
            "Monitor your symptoms"
          ],
          resources: [
            { name: "Find Help", url: "/resources" },
            { name: "Mental Health Information", url: "/resources/info" }
          ]
        };
    }
  };

  const restartTest = () => {
    setAnswers({});
    setCurrentQuestionIndex(0);
    setTestCompleted(false);
    setPrediction(null);
    setDepressionLevel(null);
    setApiError(null);
  };

  const progressPercentage = ((currentQuestionIndex + 1) / k10Questions.length) * 100;

  return (
    <Layout>
      <section className="bg-gradient-to-br from-zenLightPink to-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">
                Depression Severity Test (DST-9)
              </h1>
              <p className="text-lg text-gray-700">
This test helps you understand your recent emotions and predict depression severity. Your answers are private, but remember: this isn’t a diagnosis—just a starting point.              </p>
            </motion.div>

            {apiError && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mb-6 p-4 bg-red-100 border border-red-200 text-red-700 rounded-lg"
              >
                <div className="flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  <span>{apiError}</span>
                </div>
              </motion.div>
            )}

            <AnimatePresence mode="wait">
              {!testCompleted ? (
                <motion.div
                  key="test"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="mb-8">
                    <div className="h-2 w-full bg-gray-200 rounded-full">
                      <div
                        className="h-2 bg-zenPink rounded-full"
                        style={{ width: `${progressPercentage}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between mt-2 text-sm text-gray-600">
                      <span>Question {currentQuestionIndex + 1} of {k10Questions.length}</span>
                      <span>{Math.round(progressPercentage)}% Complete</span>
                    </div>
                  </div>

                  <K10Question
                    question={k10Questions[currentQuestionIndex]}
                    questionNumber={currentQuestionIndex + 1}
                    value={answers[currentQuestionIndex] || 0}
                    onChange={handleAnswerChange}
                  />

                  <div className="flex justify-between mt-6">
                    <Button
                      onClick={goToPreviousQuestion}
                      disabled={currentQuestionIndex === 0}
                      variant="outline"
                      className="border-gray-300"
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" /> Previous
                    </Button>
                    
                    {currentQuestionIndex < k10Questions.length - 1 ? (
                      <Button
                        onClick={goToNextQuestion}
                        disabled={!answers[currentQuestionIndex]}
                        className="bg-zenSage hover:bg-zenSage/90 text-white"
                      >
                        Next <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    ) : (
                      <Button
                        onClick={submitTestResults}
                        disabled={!answers[currentQuestionIndex] || isSubmitting}
                        className="bg-zenSage hover:bg-zenSage/90 text-white"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          <>
                            Complete Test <ClipboardCheck className="ml-2 h-4 w-4" />
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="results"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-8"
                >
                  {/* Results Header Card */}
                  <Card className={`overflow-hidden border-0 bg-gradient-to-r ${getDepressionColor(depressionLevel).gradient}`}>
                    <div className="p-8 text-center">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-md mb-4">
                        {getDepressionColor(depressionLevel).icon}
                      </div>
                      <h2 className="text-3xl font-bold mb-2">{getDepressionRecommendations(depressionLevel).title}</h2>
                      <p className="text-lg max-w-2xl mx-auto">{getDepressionRecommendations(depressionLevel).description}</p>
                    </div>
                  </Card>

                  {/* Results Details */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <Card>
                      <div className="p-6">
                        <h3 className="text-xl font-semibold mb-4 flex items-center">
                          <HeartPulse className="h-5 w-5 mr-2 text-zenPink" />
                          Your Assessment Results
                        </h3>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center py-2 border-b">
                            <span className="font-medium">Total Score:</span>
                            <span className="text-2xl font-bold">{prediction}/27</span>
                          </div>
                          <div className="flex justify-between items-center py-2 border-b">
                            <span className="font-medium">Severity Level:</span>
                            <span className={`px-3 py-1 rounded-full font-medium ${getDepressionColor(depressionLevel).text} ${getDepressionColor(depressionLevel).bg}`}>
                              {depressionLevel}
                            </span>
                          </div>
                          <div className="pt-4">
                            <div className="mb-2 text-sm font-medium flex justify-between">
                              <span>Minimal</span>
                              <span>Severe</span>
                            </div>
                            <div className="h-4 w-full bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-emerald-400 via-amber-400 to-red-500" 
                                style={{ width: `${(prediction / 27) * 100}%` }}
                              ></div>
                            </div>
                            <div className="mt-4 text-sm text-gray-600">
                              <p>Scores range from 0-27 with higher scores indicating more severe symptoms.</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>

                    <Card>
                      <div className="p-6">
                        <h3 className="text-xl font-semibold mb-4 flex items-center">
                          <Brain className="h-5 w-5 mr-2 text-zenPink" />
                          Recommended Actions
                        </h3>
                        <ul className="space-y-3 mb-6">
                          {getDepressionRecommendations(depressionLevel).recommendations.map((rec, index) => (
                            <li key={index} className="flex items-start">
                              <span className={`p-1 rounded-full mr-3 mt-0.5 ${getDepressionColor(depressionLevel).bg} ${getDepressionColor(depressionLevel).text}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                              </span>
                              <span>{rec}</span>
                            </li>
                          ))}
                        </ul>
                        
                        {/* Retake Test Button - Better integrated placement */}
                        <div className="pt-4 border-t">
                          <Button 
                            onClick={restartTest} 
                            variant="outline" 
                            className="w-full border-gray-300"
                          >
                            Retake Test
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </div>

                  {/* Urgent Notice for Moderate+ Depression */}
                  {(depressionLevel && ["Moderate Depression", "Moderately Severe Depression", "Severe Depression"].includes(depressionLevel)) && (
                    <Card className="border-red-200 bg-red-50">
                      <div className="p-6">
                        <div className="flex items-start">
                          <ShieldAlert className="h-6 w-6 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                          <div>
                            <h3 className="text-lg font-semibold text-red-800">Important Notice</h3>
                            <p className="text-red-700 mt-2">
                              Your results indicate significant distress that may benefit from professional support. 
                              This is not a diagnosis, but we strongly recommend you speak with a mental health professional.
                            </p>
                            <div className="mt-4 flex flex-col sm:flex-row gap-2">
                              <Button asChild variant="destructive" className="w-full sm:w-auto">
                                <a href="/emergency">Emergency Resources</a>
                              </Button>
                              <Button asChild variant="outline" className="w-full sm:w-auto bg-white">
                                <a href="/information/#egyptian-professionals">Find a Therapist</a>
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  )}

                  {/* Disclaimer */}
                  <div className="text-center text-sm text-gray-600 bg-white p-4 rounded-lg border">
                    <p className="font-medium">Remember</p>
                    <p>This tool provides guidance only and is not a clinical diagnosis.</p>
                    <p>If you're concerned about your mental health, please consult a professional.</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default K10Test;