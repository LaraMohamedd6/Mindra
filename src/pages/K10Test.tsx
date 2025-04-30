import { useState } from "react";
import Layout from "@/components/layout/Layout";
import K10Question from "@/components/k10test/K10Question";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, ClipboardCheck, AlertTriangle, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";

const k10Questions = [
  "During the last 30 days, about how often did you feel tired out for no good reason?",
  "During the last 30 days, about how often did you feel nervous?",
  "During the last 30 days, about how often did you feel so nervous that nothing could calm you down?",
  "During the last 30 days, about how often did you feel hopeless?",
  "During the last 30 days, about how often did you feel restless or fidgety?",
  "During the last 30 days, about how often did you feel so restless you could not sit still?",
  "During the last 30 days, about how often did you feel depressed?",
  "During the last 30 days, about how often did you feel that everything was an effort?",
  "During the last 30 days, about how often did you feel so sad that nothing could cheer you up?",
  "During the last 30 days, about how often did you feel worthless?"
];

type PredictionResponse = {
  prediction: number;
  depressionLevel: string;
};

// Map K10 answers to PHQ-9 scale (none=0, some=1, most=2, all=3)
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
    case "no Depression": return "bg-emerald-100 text-emerald-800 border-emerald-200";
    case "Minimal Depression": return "bg-blue-100 text-blue-800 border-blue-200";
    case "Mild Depression": return "bg-amber-100 text-amber-800 border-amber-200";
    case "Moderate Depression": return "bg-orange-100 text-orange-800 border-orange-200";
    case "Moderately Severe Depression": return "bg-red-100 text-red-800 border-red-200";
    case "Severe Depression": return "bg-red-100 text-red-800 border-red-200";
    default: return "bg-gray-100 text-gray-800 border-gray-200";
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
          recommendations: [
            "Continue maintaining good mental health habits",
            "Practice regular self-care and stress management",
            "Stay connected with friends and family",
            "Engage in activities you enjoy"
          ],
          advice: "Your results suggest you're not experiencing significant depression. Keep up the good work with your mental health maintenance."
        };
      case "Minimal Depression":
        return {
          recommendations: [
            "Monitor your mood for any changes",
            "Practice stress-reduction techniques like mindfulness",
            "Maintain a regular sleep schedule",
            "Consider journaling to track your feelings"
          ],
          advice: "You may be experiencing minimal symptoms of depression. These are common and may not require treatment, but monitoring is recommended."
        };
      case "Mild Depression":
        return {
          recommendations: [
            "Consider speaking with a counselor or therapist",
            "Increase physical activity and social engagement",
            "Practice cognitive behavioral techniques",
            "Limit alcohol and maintain a healthy diet"
          ],
          advice: "Your results suggest mild depressive symptoms. Professional help may be beneficial if these symptoms persist or worsen."
        };
      case "Moderate Depression":
        return {
          recommendations: [
            "Consult with a mental health professional",
            "Consider therapy options like CBT or interpersonal therapy",
            "Establish a daily routine with achievable goals",
            "Reach out to trusted friends or family for support"
          ],
          advice: "You appear to have moderate depressive symptoms. Professional treatment is typically recommended at this level."
        };
      case "Moderately Severe Depression":
        return {
          recommendations: [
            "Seek professional help as soon as possible",
            "Contact a therapist or psychiatrist for evaluation",
            "Consider medication options with a healthcare provider",
            "Inform someone you trust about how you're feeling"
          ],
          advice: "Your results indicate moderately severe depression. Professional treatment is strongly recommended."
        };
      case "Severe Depression":
        return {
          recommendations: [
            "Seek immediate professional help",
            "Contact a mental health crisis line if needed",
            "Reach out to a psychiatrist for evaluation",
            "Do not hesitate to ask for help from loved ones"
          ],
          advice: "Your results suggest severe depressive symptoms. Immediate professional intervention is strongly advised for your safety and well-being."
        };
      default:
        return {
          recommendations: [
            "Consult with a mental health professional",
            "Practice self-care and stress management",
            "Maintain social connections",
            "Monitor your symptoms"
          ],
          advice: "Please consult with a professional to discuss your results."
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
                Kessler Psychological Distress Scale (K10)
              </h1>
              <p className="text-lg text-gray-700">
                This questionnaire helps assess your current level of psychological distress. Your answers are confidential and for personal use only.
              </p>
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
                >
                  <div className="bg-white rounded-xl shadow-md p-8">
                    <div className="text-center mb-8">
                      <h2 className="text-2xl font-semibold mb-2">Your Assessment Results</h2>
                      {prediction !== null && depressionLevel !== null && (
                        <div className="space-y-6">
                          <div className={`p-6 rounded-lg border ${getDepressionColor(depressionLevel)}`}>
                            <h3 className="text-xl font-medium mb-2">Depression Screening</h3>
                            <div className="flex flex-col items-center">
                              <div className="text-4xl font-bold mb-2">
                                {prediction}/27
                              </div>
                              <div className={`px-4 py-2 rounded-full font-medium ${getDepressionColor(depressionLevel).replace('bg-', 'bg-').replace('text-', 'text-')}`}>
                                {depressionLevel}
                              </div>
                            </div>
                          </div>

                          <div className={`p-6 rounded-lg border ${getDepressionColor(depressionLevel)}`}>
                            <h3 className="text-lg font-medium mb-3">
                              {getDepressionRecommendations(depressionLevel).advice}
                            </h3>
                            
                            <h4 className="font-medium mb-3">Recommendations:</h4>
                            <ul className="space-y-3">
                              {getDepressionRecommendations(depressionLevel).recommendations.map((rec, index) => (
                                <li key={index} className="flex items-start">
                                  <span className={`p-1 rounded-full mr-3 mt-0.5 ${getDepressionColor(depressionLevel).replace('bg-', 'bg-').replace('text-', 'text-')}`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                  </span>
                                  <span>{rec}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}
                    </div>

                    {(depressionLevel && ["Moderate Depression", "Moderately Severe Depression", "Severe Depression"].includes(depressionLevel)) && (
                      <Card className="bg-red-50 border-red-200 p-4 mb-8">
                        <div className="flex">
                          <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                          <div>
                            <h4 className="font-medium text-red-800">Important Note</h4>
                            <p className="text-red-700 text-sm mt-1">
                              Your results indicate significant distress. This is not a diagnosis, but we strongly recommend you speak with a mental health professional soon. Visit our <a href="/emergency" className="underline font-medium">Emergency Resources</a> if you need immediate support.
                            </p>
                          </div>
                        </div>
                      </Card>
                    )}

                    <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
                      <Button onClick={restartTest} variant="outline" className="border-gray-300">
                        Take Test Again
                      </Button>
                      <Button asChild className="bg-zenSage hover:bg-zenSage/90 text-white">
                        <a href="/resources">View Support Resources</a>
                      </Button>
                    </div>
                    
                    <div className="mt-6 text-center text-sm text-gray-600">
                      <p>Remember, this tool provides guidance only and is not a clinical diagnosis.</p>
                      <p>If you're concerned about your mental health, please consult a professional.</p>
                    </div>
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