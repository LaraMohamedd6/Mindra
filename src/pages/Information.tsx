
import Layout from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Book, Brain, Coffee, HeartPulse, Moon, Sun, Calendar, HeadingIcon } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import SectionHeading from "@/components/common/SectionHeading";

const mentalHealthTopics = [
  {
    title: "Understanding Depression",
    icon: Brain,
    content: "Depression is more than just feeling sad. It's a persistent feeling of sadness or loss of interest that can affect how you think, feel, and handle daily activities. Learn about the signs, symptoms, and coping strategies that can help students manage depression.",
    image: "https://images.unsplash.com/photo-1536604673810-81370412626a?q=80&w=3270&auto=format&fit=crop"
  },
  {
    title: "Managing Anxiety",
    icon: HeartPulse,
    content: "Many students experience anxiety, especially during high-stress periods like exams. Discover practical techniques to manage academic anxiety, including breathing exercises, mindfulness practices, and cognitive behavioral strategies.",
    image: "https://images.unsplash.com/photo-1474418397713-7ede21d49118?q=80&w=2853&auto=format&fit=crop"
  },
  {
    title: "Sleep Hygiene",
    icon: Moon,
    content: "Quality sleep is essential for mental health and academic performance. Learn about establishing healthy sleep patterns, creating a sleep-conducive environment, and managing sleep disruptions during busy academic periods.",
    image: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?q=80&w=3342&auto=format&fit=crop"
  },
  {
    title: "Study-Life Balance",
    icon: Coffee,
    content: "Maintaining a healthy balance between academic demands and personal life is challenging but crucial. Explore strategies for effective time management, setting boundaries, and making time for self-care even during busy periods.",
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=3270&auto=format&fit=crop"
  },
  {
    title: "Self-Care Practices",
    icon: Sun,
    content: "Self-care isn't selfish—it's necessary. Discover simple yet effective self-care practices that can be incorporated into a busy student schedule, including quick mindfulness exercises, physical movement, and social connection.",
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=3431&auto=format&fit=crop"
  },
  {
    title: "Academic Stress",
    icon: Book,
    content: "Academic pressure can sometimes feel overwhelming. Learn about recognizing the signs of burnout, developing healthy study habits, and knowing when and how to seek help when academic stress becomes too much.",
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=3270&auto=format&fit=crop"
  },
];

const faqs = [
  {
    question: "How do I know if I need professional help?",
    answer: "If your feelings of distress persist for more than two weeks, interfere with daily activities, or include thoughts of harming yourself, it's important to seek professional help. Remember that reaching out is a sign of strength, not weakness."
  },
  {
    question: "What resources are available on campus?",
    answer: "Most universities offer free or subsidized counseling services, peer support groups, wellness workshops, and crisis intervention. Check with your university's student services or health center for specific resources available to you."
  },
  {
    question: "How can I help a friend who seems to be struggling?",
    answer: "Express your concern without judgment, listen actively, encourage them to seek professional help if needed, and continue to check in. Remember that you're not responsible for 'fixing' their problems, but your support can make a difference."
  },
  {
    question: "Can exercise really help with mental health?",
    answer: "Yes! Physical activity releases endorphins, reduces stress hormones, and can improve sleep quality. Even short bursts of movement, like a 10-minute walk, can have positive effects on your mood and cognition."
  },
  {
    question: "How can I manage stress during exam periods?",
    answer: "Create a realistic study schedule, take regular breaks, maintain healthy habits (sleep, nutrition, movement), use relaxation techniques, and focus on what you can control. Remember that perfect preparation isn't possible, and your worth isn't defined by your grades."
  }
];

const myths = [
  {
    myth: "Mental health problems are a sign of weakness",
    truth: "Mental health conditions are medical conditions, not character flaws. They result from complex interactions between biological, psychological, and social factors, much like physical health conditions."
  },
  {
    myth: "Stress is just part of being a student",
    truth: "While some stress is normal, excessive or chronic stress isn't healthy or necessary. Learning effective stress management is an important life skill that will benefit you well beyond your academic years."
  },
  {
    myth: "Asking for help means I can't handle college",
    truth: "Seeking help is a sign of strength and self-awareness. Successful students utilize available resources, and learning when and how to ask for support is actually a critical skill for academic and life success."
  },
  {
    myth: "Medication for mental health is just a crutch",
    truth: "For some conditions, medication is medically necessary and highly effective, especially when combined with therapy. Would you consider insulin a 'crutch' for someone with diabetes? Mental health treatments deserve the same respect."
  }
];

export default function Information() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto text-center mb-12"
        >
          <h1 className="text-4xl font-display font-semibold text-gray-900 mb-4">
            Mental Health Information Hub
          </h1>
          <p className="text-lg text-gray-600">
            Access reliable information about mental health topics relevant to students, curated by mental health professionals.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {mentalHealthTopics.map((topic, index) => (
            <motion.div
              key={topic.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow duration-300 overflow-hidden">
                {topic.image && (
                  <div className="h-48 overflow-hidden">
                    <img src={topic.image} alt={topic.title} className="w-full h-full object-cover" />
                  </div>
                )}
                <CardHeader className="flex flex-row items-center gap-4">
                  <div className="rounded-full bg-zenLightPink p-3">
                    <topic.icon className="h-6 w-6 text-zenPink" />
                  </div>
                  <CardTitle className="text-xl">{topic.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{topic.content}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <SectionHeading 
          title="Frequently Asked Questions" 
          subtitle="Answers to common questions about mental health for students"
          centered={true}
          className="mb-8"
        />

        <div className="max-w-3xl mx-auto mb-16">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left font-medium">{faq.question}</AccordionTrigger>
                <AccordionContent>
                  <p className="text-gray-600">{faq.answer}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <SectionHeading 
          title="Mental Health Myths vs Facts" 
          subtitle="Separating fact from fiction when it comes to mental health"
          centered={true}
          className="mb-8"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {myths.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gradient-to-br from-zenLightPink to-white p-6 rounded-xl"
            >
              <h3 className="text-xl font-semibold mb-2 text-zenPink">Myth: {item.myth}</h3>
              <p className="text-gray-700"><strong className="text-zenSage">Fact:</strong> {item.truth}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
