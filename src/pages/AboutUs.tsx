
import Layout from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Heart, Star, Book, Award, Users, CheckCircle, Globe, Clock, Lightbulb } from "lucide-react";
import SectionHeading from "@/components/common/SectionHeading";
import QuoteCard from "@/components/common/QuoteCard";
import partner1Logo from '../assets/images/harvard.png';
import partner2Logo from '../assets/images/world_health_organization.png';
import partner3Logo from '../assets/images/National_Institute_of_Mental_Health.jpeg';
import partner4Logo from '../assets/images/Mind_Mental_Health_Charity.jpeg';
import ourStoryImg from '../assets/images/our_story.avif';

const studentExperiences = [
  {
    text: "Mindra has completely changed how I handle stress during exam periods. The guided meditations and breathing exercises are exactly what I needed.",
    author: "Amr, Psychology Student"
  },
  {
    text: "As someone dealing with anxiety throughout my college years, having a platform that offers both emergency resources and daily wellness tools has been invaluable.",
    author: "Malak, Engineering Graduate"
  },
  {
    text: "The mood tracking feature helped me identify patterns in my mental health that I never noticed before. Now I can be proactive about my wellbeing.",
    author: "Mohamed, Business Student"
  }
];


const values = [
  {
    icon: <Heart className="h-6 w-6" />,
    title: "Compassion",
    description: "We approach every student's mental health journey with empathy and understanding."
  },
  {
    icon: <CheckCircle className="h-6 w-6" />,
    title: "Evidence-Based",
    description: "Our resources and techniques are grounded in scientific research and clinical expertise."
  },
  {
    icon: <Users className="h-6 w-6" />,
    title: "Inclusivity",
    description: "We design our platform to be accessible and relevant to students of all backgrounds."
  },
  {
    icon: <Lightbulb className="h-6 w-6" />,
    title: "Innovation",
    description: "We continuously evolve our approach to meet the changing needs of today's students."
  }
];

const timeline = [
  {
    year: "2023",
    title: "The Beginning",
    description: "Mindra was born out of a university project to address the rising mental health concerns among students in an accessible and non-judgmental way."
  },
  {
    year: "Early 2024",
    title: "From Idea to Platform",
    description: "Our team combined tech skills with mental health research to build a functional platform that includes tools like self-assessment, guided meditations, and wellness content."
  },
  {
    year: "2025",
    title: "Mindra Goes Public",
    description: "After testing and refinement, we launched Mindra to the public—offering free, easy-to-use mental wellness tools tailored for students."
  },
  {
    year: "Future",
    title: "Expanding Beyond Campus",
    description: "Our vision is to make Mindra a nationwide support platform for all youth—partnering with universities, NGOs, and health organizations."
  },
  {
    year: "Beyond",
    title: "Changing the Narrative",
    description: "Mindra aims to lead a global shift in how mental health is approached—by promoting early support, reducing stigma, and building a supportive online community for everyone."
  }
];



export default function AboutUs() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-5xl font-display font-semibold text-gray-900 mb-6">
              Our Mission: Student Mental Wellness
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8">
              Mindra was created with one goal: to make mental wellness accessible,
              approachable, and effective for every student, everywhere.
            </p>
            <div className="flex justify-center">
              <div className="flex space-x-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-6 w-6 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Our Story Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-20"
        >
          <SectionHeading
            title="Our Story"
            subtitle="How Mindra came to be"
            centered={true}
            className="mb-12"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="rounded-xl overflow-hidden shadow-lg">
              <img
                src={ourStoryImg}
                alt="Team working on Mindra project"
                className="w-full h-auto"
              />
            </div>

            <div className="space-y-6 text-xl text-gray-700">
              <p className="text-gray-700">
                Mindra began as a graduation project by a group of computer scienece students passionate about mental health awareness.
              </p>
              <p className="text-gray-700">
                During university, we noticed that many students silently struggled with stress, anxiety, and burnout — yet existing support systems were often inaccessible or intimidating.
              </p>
              <p className="text-gray-700">
                We combined our technical skills with mental health research to build an accessible web platform that offers mood tracking, guided meditations, wellness content, and anonymous support—all tailored for students.
              </p>
              <p className="text-gray-700">
                What started as a classroom idea turned into a mission: to help students prioritize their mental well-being in a way that's simple, supportive, and stigma-free.
              </p>
            </div>
          </div>
        </motion.div>


        {/* Timeline Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mb-20"
        >
          <SectionHeading
            title="Our Journey"
            subtitle="The journey of building Mindra"
            centered={true}
            className="mb-12"
          />

          <div className="relative border-l-2 border-zenSeafoam ml-4 md:ml-0 md:mx-auto md:max-w-3xl">
            {timeline.map((item, idx) => (
              <motion.div
                key={item.year}
                initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="mb-8 ml-6 md:ml-0 md:grid md:grid-cols-[1fr,auto,1fr] md:gap-4"
              >
                <div className={`${idx % 2 === 0 ? "md:text-right" : "md:col-start-3"}`}>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{item.title}</h3>
                  <p className="text-gray-700">{item.description}</p>
                </div>

                <div className="bg-zenSeafoam rounded-full h-10 w-10 flex items-center justify-center 
  absolute -left-8 top-0 
  md:static md:row-start-1 md:col-start-2 md:justify-self-center
  text-black font-semibold text-[11px] leading-tight text-center px-1 z-10">
                  {item.year}
                </div>



                {idx % 2 === 0 ? <div></div> : null}
              </motion.div>
            ))}
          </div>
        </motion.div>


        {/* Values Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mb-20"
        >
          <SectionHeading
            title="Our Values"
            subtitle="The principles that guide our work"
            centered={true}
            className="mb-12"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, idx) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className="h-full hover:shadow-md transition-shadow">
                  <CardContent className="pt-6 text-center">
                    <div className="mx-auto bg-zenMint w-14 h-14 flex items-center justify-center rounded-full mb-4">
                      <div className="text-zenSage">
                        {value.icon}
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                    <p className="text-gray-600">{value.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Student Experiences Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mb-20"
        >
          <SectionHeading
            title="Student Experiences"
            subtitle="Hear how Mindra is supporting students"
            centered={true}
            className="mb-12"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {studentExperiences.map((experience, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <QuoteCard
                  text={experience.text}
                  author={experience.author}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Partners Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mb-20"
        >
          <SectionHeading
            title="Our Partners"
            subtitle="Organizations we collaborate with"
            centered={true}
            className="mb-12"
          />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center">
            <div className="p-6 grayscale hover:grayscale-0 transition-all">
              <img src={partner1Logo} alt="Harvard Medical School" className="h-16 object-contain" />
            </div>
            <div className="p-6 grayscale hover:grayscale-0 transition-all">
              <img src={partner2Logo} alt="World Health Organization" className="h-16 object-contain" />
            </div>
            <div className="p-6 grayscale hover:grayscale-0 transition-all">
              <img src={partner3Logo} alt="National Institute of Mental Health" className="h-16 object-contain" />
            </div>
            <div className="p-6 grayscale hover:grayscale-0 transition-all">
              <img src={partner4Logo} alt="Mind Charity UK" className="h-16 object-contain" />
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}
