import Layout from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Book, Brain, Coffee, HeartPulse, Moon, Sun, Calendar, HeadingIcon, ArrowRight, Phone, MapPin } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import SectionHeading from "@/components/common/SectionHeading";
import { Link } from 'react-router-dom';
import selfCareImage from "@/assets/images/selfcare.jpg"; 
import depImage from "@/assets/images/dep.jpg";  
import academicStress from "@/assets/images/acstress.jpg"; 
import sleepHygiene from "@/assets/images/sleep.jpg"; 
import phsy1 from "@/assets/images/phsy1.png"; 
import phsy2 from "@/assets/images/phsy2.png"; 
import phsy3 from "@/assets/images/phsy3.png"; 
import phsy4 from "@/assets/images/phsy4.png"; 


const mentalHealthTopics = [
  {
    title: "Understanding Depression",
    icon: Brain,
    content: "Depression is more than just feeling sad. It's a persistent feeling of sadness or loss of interest that can affect how you think, feel, and handle daily activities.",
    image: depImage,
    url: "https://www.nimh.nih.gov/health/topics/depression"
  },
    {
    title: "Self-Care Practices",
    icon: Sun,
    content: "Self-care isn't selfish—it's necessary. Discover simple yet effective self-care practices for busy students.",
    image: selfCareImage, // Changed from URL to imported image
    url: "https://www.nimh.nih.gov/health/topics/caring-for-your-mental-health"
  },
  {
    title: "Sleep Hygiene",
    icon: Moon,
    content: "Quality sleep is essential for mental health and academic performance. Learn about establishing healthy sleep patterns.",
    image: sleepHygiene,
    url: "https://www.sleepfoundation.org/sleep-hygiene"
  },
  {
    title: "Study-Life Balance",
    icon: Coffee,
    content: "Maintaining a healthy balance between academic demands and personal life is challenging but crucial.",
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=3270&auto=format&fit=crop",
    url: "https://www.healthdirect.gov.au/work-life-balance"
  },
  {
    title: "Managing Anxiety",
    icon: HeartPulse,
    content: "Many students experience anxiety, especially during high-stress periods like exams. Discover practical techniques to manage academic anxiety.",
    image: "https://images.unsplash.com/photo-1474418397713-7ede21d49118?q=80&w=2853&auto=format&fit=crop",
    url: "https://adaa.org/understanding-anxiety"
  },
  {
    title: "Academic Stress",
    icon: Book,
    content: "Academic pressure can sometimes feel overwhelming. Learn about recognizing the signs of burnout.",
    image: academicStress,
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC9243415/"
  },
];

const faqCategories = [
  {
    category: "Getting Help",
    questions: [
      {
        question: "How do I know if I need professional help?",
        answer: "If your feelings of distress persist for more than two weeks, interfere with daily activities, or include thoughts of harming yourself, it's important to seek professional help."
      },
      {
        question: "What resources are available on campus?",
        answer: "Most universities offer free counseling services, peer support groups, wellness workshops, and crisis intervention. Check your university's student services for specific resources."
      },
      {
        question: "How can I help a friend who seems to be struggling?",
        answer: "Express concern without judgment, listen actively, encourage professional help if needed, and continue to check in. Remember you're not responsible for 'fixing' their problems."
      }
    ]
  },
  {
    category: "Daily Wellness",
    questions: [
      {
        question: "Can exercise really help with mental health?",
        answer: "Yes! Physical activity releases endorphins, reduces stress hormones, and improves sleep quality. Even short 10-minute walks can boost mood and cognition."
      },
      {
        question: "How much sleep do I really need as a student?",
        answer: "Most adults need 7-9 hours of quality sleep. Chronic sleep deprivation impairs memory, concentration, and emotional regulation—all crucial for academic success."
      },
      {
        question: "Is social media bad for mental health?",
        answer: "It depends on usage. Passive scrolling can increase isolation, while active engagement with supportive communities can be beneficial. Be mindful of how platforms make you feel."
      }
    ]
  },
  {
    category: "Academic Challenges",
    questions: [
      {
        question: "How can I manage stress during exam periods?",
        answer: "Create a realistic study schedule, take regular breaks, maintain healthy habits, use relaxation techniques, and focus on what you can control."
      },
      {
        question: "What's the difference between normal stress and an anxiety disorder?",
        answer: "While stress is normal, anxiety disorders involve excessive fear that persists for months and interferes with daily functioning. If anxiety controls your life, consider professional advice."
      }
    ]
  }
];

const myths = [
  {
    myth: "Mental health problems are a sign of weakness",
    truth: "Mental health conditions are medical conditions, not character flaws. They result from complex biological, psychological, and social factors."
  },
  {
    myth: "Stress is just part of being a student",
    truth: "While some stress is normal, excessive or chronic stress isn't healthy. Learning effective stress management benefits you beyond academics."
  },
  {
    myth: "Asking for help means I can't handle college",
    truth: "Seeking help shows strength and self-awareness. Utilizing resources is a critical skill for academic and life success."
  },
  {
    myth: "Medication for mental health is just a crutch",
    truth: "For some conditions, medication is medically necessary and effective, like insulin for diabetes. Mental health treatments deserve equal respect."
  }
];

const egyptianProfessionals = [
  {
    name: "DR. John Gamal",
    specialty: "Specialist Psychiatrist",
    photo: phsy1,
    bio: "Dr. John Gamal mostly utilizes different techniques in therapy varying from Humanistic approach, Four-Step Integrative Model of Psychotherapy and Psychodynamic approaches, depending on the client’s needs to overcome their mental and difficulties.",
    phone: "+20 109 094 9477",
    location: "Maadi, Cairo",
    languages: ["Arabic", "English"]
  },
  {
    name: "DR Ashraf Adel",
    specialty: "Consultant Psychiatrist ",
    photo: phsy2,
    bio: "Ashraf practices Gestalt therapy, which focuses upon the individual's experience in the present moment, and Eclectic therapy which incorporates a variety of therapeutic principles in order to create the ideal treatment program.",
    phone: "+20 100 141 0140",
    location: "Maadi, Cairo",
    languages: ["Arabic", "English"]
  },
  {
    name: "DR. Mohamed Hossam",
    specialty: "Consultant of addiction treatment",
    photo: phsy3,
    bio: "Psychiatrist specialized in stress, adult psychiatry, adolescent psychiatry, family counseling, toxicology, and pediatric psychiatry. With extensive experience in dual diagnosis cases, I provide comprehensive treatment plans that address mental health.",
    phone: "+20 225983999",
    location: "New Cairo, Cairo",
    languages: ["Arabic", "English"]
  },
  {
    name: "DR. Nourhan Hamdy",
    specialty: "Psychotherapist Specialist",
    photo: phsy4,
    bio: "Psychiatrist specializing in the treatment of depression, adult mental health, and adolescent psychiatric conditions. My expertise spans from early intervention for teens to complex dual diagnosis cases in adults struggling with depression.",
    phone: "16676 - through vezeeta",
    location: "Heliopolis ,Cairo",
    languages: ["Arabic", "English"]
  }
];

export default function Information() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-4 leading-tight">
            Student Mental Health <span className="text-zenPink">Resources</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8">
            Evidence-based information and practical strategies to support your mental wellbeing throughout your academic journey.
          </p>
          <div className="w-full max-w-md mx-auto bg-gradient-to-r from-zenLightPink to-zenLightSage p-0.5 rounded-lg">
            <div className="bg-white rounded-lg py-2 px-4">
              <p className="text-sm font-medium text-gray-700">Scroll to explore resources</p>
            </div>
          </div>
        </motion.div>

        {/* Topics Grid */}
        <section className="mb-20">
          <SectionHeading 
            title="Explore Mental Health Resources" 
            subtitle="Click to visit trusted .org websites for each topic"
            centered={true}
            className="mb-12"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mentalHealthTopics.map((topic, index) => (
              <motion.div
                key={topic.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ y: -5 }}
              >
                <a href={topic.url} target="_blank" rel="noopener noreferrer" className="block h-full">
                  <Card className="h-full hover:shadow-lg transition-all duration-300 overflow-hidden group border border-gray-100">
                    <div className="h-48 overflow-hidden relative">
                      <img 
                        src={topic.image} 
                        alt={topic.title} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-80" />
                      <div className="absolute bottom-4 left-4">
                        <h3 className="text-xl font-semibold text-white">{topic.title}</h3>
                      </div>
                    </div>
                    <CardHeader className="flex flex-row items-center gap-4 pb-3">
                      <div className="rounded-full bg-zenLightPink p-3 group-hover:bg-zenPink transition-colors duration-300">
                        <topic.icon className="h-6 w-6 text-zenPink group-hover:text-white transition-colors duration-300" />
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-gray-600 mb-4">{topic.content}</p>
                      <div className="flex items-center text-zenPink font-medium group-hover:text-zenDarkPink transition-colors duration-300">
                        <span>Visit Resource</span>
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </div>
                    </CardContent>
                  </Card>
                </a>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Organized FAQ Sections */}
        <section className="mb-20">
          <SectionHeading 
            title="Frequently Asked Questions" 
            subtitle="Organized by topic for easy navigation"
            centered={true}
            className="mb-12"
          />

          {faqCategories.map((category, catIndex) => (
            <div key={catIndex} className="mb-12">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">{category.category}</h2>
              <div className="max-w-4xl mx-auto">
                <Accordion type="single" collapsible className="w-full space-y-4">
                  {category.questions.map((faq, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <AccordionItem 
                        value={`item-${catIndex}-${index}`} 
                        className="border border-gray-200 rounded-lg overflow-hidden hover:border-zenPink transition-colors duration-300"
                      >
                        <AccordionTrigger className="px-6 py-4 hover:no-underline text-left font-medium text-gray-800 hover:text-zenPink transition-colors duration-300">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="px-6 pb-4 text-gray-600">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    </motion.div>
                  ))}
                </Accordion>
              </div>
            </div>
          ))}
        </section>

        {/* Myths vs Facts Section */}
        <section className="mb-20">
          <SectionHeading 
            title="Mental Health Myths vs Facts" 
            subtitle="Separating fact from fiction when it comes to student mental health"
            centered={true}
            className="mb-12"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {myths.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-br from-zenLightPink to-white p-6 rounded-xl border border-gray-100"
              >
                <h3 className="text-xl font-semibold mb-2 text-zenPink">Myth: {item.myth}</h3>
                <p className="text-gray-700">
                  <span className="font-bold text-zenSage">Fact:</span> {item.truth}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Egyptian Professionals Section */}
        <section id="egyptian-professionals" className="mb-20 scroll-mt-20">
          <SectionHeading 
            title="Mental Health Professionals in Egypt" 
            subtitle="Trusted doctors who can help with student mental health"
            centered={true}
            className="mb-12"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {egyptianProfessionals.map((doctor, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100">
                  <div className="h-48 overflow-hidden relative">
                    <img 
                      src={doctor.photo} 
                      alt={doctor.name} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                      <h3 className="text-xl font-semibold text-white">{doctor.name}</h3>
                      <p className="text-zenLightPink">{doctor.specialty}</p>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <p className="text-gray-600 mb-4">{doctor.bio}</p>
                    
                    <div className="space-y-3">
                      <div className="flex items-start gap-2">
                        <Phone className="h-5 w-5 text-zenPink mt-0.5" />
                        <a href={`tel:${doctor.phone}`} className="text-gray-700 hover:text-zenPink transition-colors">
                          {doctor.phone}
                        </a>
                      </div>
                      
                      <div className="flex items-start gap-2">
                        <MapPin className="h-5 w-5 text-zenPink mt-0.5" />
                        <p className="text-gray-700">{doctor.location}</p>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mt-2">
                        {doctor.languages.map((lang, i) => (
                          <span key={i} className="bg-zenLightPink/20 text-zenPink px-2 py-1 rounded-full text-xs">
                            {lang}
                          </span>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-r from-zenPink/10 to-zenSage/10 rounded-2xl p-8 md:p-12 text-center mb-12 border border-gray-100"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Need Immediate Help?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-6">
            If you're in crisis or experiencing thoughts of self-harm, please reach out to these resources:
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a 
              href="https://suicidepreventionlifeline.org" 
              className="px-6 py-3 bg-zenPink text-white rounded-lg font-medium hover:bg-zenDarkPink transition-colors duration-300"
              target="_blank"
              rel="noopener noreferrer"
            >
              National Suicide Prevention Lifeline
            </a>
            <a 
              href="https://crisistextline.org" 
              className="px-6 py-3 bg-zenSage text-white rounded-lg font-medium hover:bg-zenDarkSage transition-colors duration-300"
              target="_blank"
              rel="noopener noreferrer"
            >
              Crisis Text Line
            </a>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}