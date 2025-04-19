
import { useState } from "react";
import Layout from "@/components/layout/Layout";
import K10Question from "@/components/k10test/K10Question";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, ClipboardCheck, AlertTriangle } from "lucide-react";
import { Card } from "@/components/ui/card";

// Define the K10 questions
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

const K10Test = () => {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [testCompleted, setTestCompleted] = useState(false);
  
  const handleAnswerChange = (value: number) => {
    setAnswers(prev => ({ ...prev, [currentQuestionIndex]: value }));
  };
  
  const goToNextQuestion = () => {
    if (currentQuestionIndex < k10Questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setTestCompleted(true);
    }
  };
  
  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };
  
  const calculateScore = () => {
    return Object.values(answers).reduce((total, val) => total + val, 0);
  };
  
  const getResultInterpretation = (score: number) => {
    if (score >= 10 && score <= 19) {
      return {
        level: "Likely to be well",
        description: "Your responses suggest you may not be experiencing significant psychological distress.",
        recommendations: [
          "Continue maintaining your mental wellbeing through regular self-care",
          "Engage in stress-management practices like exercise and mindfulness",
          "Maintain social connections and support networks"
        ]
      };
    } else if (score >= 20 && score <= 24) {
      return {
        level: "Likely to have a mild mental disorder",
        description: "Your responses suggest you may be experiencing mild levels of psychological distress.",
        recommendations: [
          "Consider speaking with a counselor or mental health professional",
          "Practice regular stress-reduction techniques",
          "Ensure you're getting adequate sleep, nutrition, and exercise",
          "Explore our meditation and mindfulness resources"
        ]
      };
    } else if (score >= 25 && score <= 29) {
      return {
        level: "Likely to have a moderate mental disorder",
        description: "Your responses suggest you may be experiencing moderate levels of psychological distress.",
        recommendations: [
          "We recommend consulting with a mental health professional",
          "Consider university counseling services or a therapist",
          "Implement regular self-care strategies",
          "Inform trusted friends or family about what you're experiencing"
        ]
      };
    } else {
      return {
        level: "Likely to have a severe mental disorder",
        description: "Your responses suggest you may be experiencing significant psychological distress.",
        recommendations: [
          "We strongly encourage you to seek professional help as soon as possible",
          "Contact your university counseling center or mental health professional",
          "If you're having thoughts of harming yourself, please call a crisis helpline immediately",
          "Don't face this alone - reach out to trusted support people"
        ]
      };
    }
  };
  
  const restartTest = () => {
    setAnswers({});
    setCurrentQuestionIndex(0);
    setTestCompleted(false);
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
                    <Button
                      onClick={goToNextQuestion}
                      disabled={!answers[currentQuestionIndex]}
                      className="bg-zenSage hover:bg-zenSage/90 text-white"
                    >
                      {currentQuestionIndex < k10Questions.length - 1 ? (
                        <>
                          Next <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      ) : (
                        <>
                          Complete Test <ClipboardCheck className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="results"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {(() => {
                    const score = calculateScore();
                    const result = getResultInterpretation(score);
                    return (
                      <div className="bg-white rounded-xl shadow-md p-8">
                        <div className="text-center mb-8">
                          <h2 className="text-2xl font-semibold mb-2">Your K10 Assessment Results</h2>
                          <div className="inline-block bg-zenLightPink text-zenPink px-4 py-1 rounded-full font-medium">
                            Score: {score} / 50
                          </div>
                        </div>

                        <div className="mb-8">
                          <h3 className="text-xl font-medium mb-2">{result.level}</h3>
                          <p className="text-gray-700 mb-4">{result.description}</p>
                          
                          <div className="h-4 w-full bg-gray-200 rounded-full mb-4">
                            <div
                              className={`h-4 rounded-full ${
                                score <= 19 ? "bg-green-500" :
                                score <= 24 ? "bg-yellow-500" :
                                score <= 29 ? "bg-orange-500" : "bg-red-500"
                              }`}
                              style={{ width: `${(score / 50) * 100}%` }}
                            ></div>
                          </div>
                          
                          <div className="flex justify-between text-xs text-gray-600">
                            <span>10</span>
                            <span>20</span>
                            <span>30</span>
                            <span>40</span>
                            <span>50</span>
                          </div>
                        </div>

                        <div className="mb-8">
                          <h3 className="text-lg font-medium mb-3">Recommendations:</h3>
                          <ul className="space-y-2">
                            {result.recommendations.map((rec, index) => (
                              <li key={index} className="flex items-start">
                                <span className="bg-zenSeafoam text-zenSage p-1 rounded-full mr-2 mt-0.5">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                </span>
                                <span>{rec}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {score >= 25 && (
                          <Card className="bg-red-50 border-red-200 p-4 mb-8">
                            <div className="flex">
                              <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                              <div>
                                <h4 className="font-medium text-red-800">Important Note</h4>
                                <p className="text-red-700 text-sm mt-1">
                                  Your score indicates significant distress. This is not a diagnosis, but we strongly recommend you speak with a mental health professional soon. Visit our <a href="/emergency" className="underline font-medium">Emergency Resources</a> if you need immediate support.
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
                    );
                  })()}
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
