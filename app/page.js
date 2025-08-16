"use client";

import { useState } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import Lottie from "lottie-react";
import avatar from "@/public/avatar.json"; // Ensure this path is correct
import { Sun, Moon, ArrowRight, Bot, BarChart, ShieldCheck, Zap, UserCheck, Star, ChevronRight } from "lucide-react";

// --- Main Page Component ---
export default function Page() {
  const [darkMode, setDarkMode] = useState(true);

  // --- Helper Components ---
  const Section = ({ id, children, className = "" }) => (
    <section id={id} className={`w-full py-16 md:py-24 px-4 lg:px-8 flex justify-center ${className}`}>
      <div className="max-w-7xl w-full">
        {children}
      </div>
    </section>
  );

  const SectionTitle = ({ children }) => (
    <motion.h2
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      viewport={{ once: true, amount: 0.3 }}
      className={`text-4xl md:text-5xl font-bold text-center mb-12 ${darkMode ? "text-slate-100" : "text-slate-800"}`}
    >
      {children}
    </motion.h2>
  );

  // --- Render ---
  return (
    <div className={`min-h-screen w-full transition-colors duration-300 ${darkMode ? "bg-slate-900" : "bg-white"}`}>
      {/* Background Gradient */}
      <div
        className={`absolute top-0 left-0 w-full h-full z-0 transition-opacity duration-500 ${
          darkMode ? "opacity-30" : "opacity-10"
        }`}
        style={{
          backgroundImage:
            "radial-gradient(ellipse at 50% 0%, rgba(59, 130, 246, 0.4), transparent 70%), radial-gradient(ellipse at 100% 100%, rgba(167, 139, 250, 0.4), transparent 80%)",
        }}
      />

      <Header darkMode={darkMode} setDarkMode={setDarkMode} />

      <main className="relative z-10">
        <Hero darkMode={darkMode} />
        <About darkMode={darkMode} Section={Section} Title={SectionTitle} />
        <Features darkMode={darkMode} Section={Section} Title={SectionTitle} />
        <HowItWorks darkMode={darkMode} Section={Section} Title={SectionTitle} />
        <Pricing darkMode={darkMode} Section={Section} Title={SectionTitle} />
        <Testimonials darkMode={darkMode} Section={Section} Title={SectionTitle} />
        <Contact darkMode={darkMode} Section={Section} Title={SectionTitle} />
      </main>
      
      <Footer darkMode={darkMode} />
    </div>
  );
}

// --- Header Component ---
const Header = ({ darkMode, setDarkMode }) => {
    const { isSignedIn } = useUser();
    const navItems = ["Home", "About", "Features", "How It Works", "Pricing", "Testimonials", "Contact"];
    const scrollTo = (id) => document.getElementById(id.toLowerCase().replace(' ', '-'))?.scrollIntoView({ behavior: "smooth", block: "start" });
  
    return (
      <header className={`w-full p-4 fixed top-0 z-50 flex justify-between items-center backdrop-blur-lg border-b ${darkMode ? 'border-slate-700/50 bg-slate-900/50' : 'border-slate-200/80 bg-white/80'}`}>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-blue-400 text-transparent bg-clip-text cursor-pointer"
          onClick={() => scrollTo('home')}
        >
          AuraAI
        </motion.div>
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium">
          {navItems.map(item => (
            <button key={item} onClick={() => scrollTo(item)} className={`transition-colors ${darkMode ? 'text-slate-400 hover:text-blue-400' : 'text-slate-600 hover:text-blue-600'}`}>
              {item}
            </button>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          <motion.button
            onClick={() => setDarkMode(prev => !prev)}
            className={`p-2 rounded-full flex items-center justify-center transition-all duration-300 ${darkMode ? 'bg-slate-800/80 hover:bg-slate-700/80 border-slate-700' : 'bg-white hover:bg-slate-100 border-slate-200'} border`}
            whileTap={{ scale: 0.9 }}
          >
            {darkMode ? <Sun className="text-yellow-400" /> : <Moon className="text-blue-500" />}
          </motion.button>
          <div>
            {isSignedIn ? (
              <UserButton afterSignOutUrl="/" />
            ) : (
              <SignInButton mode="modal">
                <button className={`px-4 py-2 rounded-full font-semibold transition-all duration-300 ${darkMode ? 'bg-slate-700/60 hover:bg-slate-600/80 text-slate-100 border-slate-600' : 'bg-white hover:bg-slate-100 text-slate-800 border-slate-200'}`}>
                  Sign In
                </button>
              </SignInButton>
            )}
          </div>
        </div>
      </header>
    );
  };
  
// --- Hero Section ---
const Hero = ({ darkMode }) => {
    const { isSignedIn } = useUser();
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
  
    const rotateX = useTransform(mouseY, [-500, 500], [15, -15]);
    const rotateY = useTransform(mouseX, [-500, 500], [-15, 15]);
  
    const handleMouseMove = (event) => {
      const { clientX, clientY, currentTarget } = event;
      const { left, top, width, height } = currentTarget.getBoundingClientRect();
      const x = clientX - left - width / 2;
      const y = clientY - top - height / 2;
      mouseX.set(x);
      mouseY.set(y);
    };
  
    const handleMouseLeave = () => {
      mouseX.set(0);
      mouseY.set(0);
    };

    return (
      <section id="home" className="min-h-screen w-full grid lg:grid-cols-2 items-center justify-center p-4 pt-20 overflow-hidden" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
        <div className="text-center lg:text-left p-6 z-10">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
            className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-500 via-blue-400 to-indigo-400 text-transparent bg-clip-text pb-3"
          >
            AI-Powered Interviews
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeInOut" }}
            className={`mt-4 text-lg md:text-xl max-w-xl mx-auto lg:mx-0 ${darkMode ? "text-slate-300" : "text-slate-600"}`}
          >
            Experience the future of recruitment. Our AI conducts insightful, unbiased interviews to help you find the perfect candidate, faster.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4, ease: "easeInOut" }}
          >
            {isSignedIn ? (
              <motion.button
                onClick={() => window.location.href = '/dashboard'}
                whileHover={{ scale: 1.05, boxShadow: '0 10px 20px -5px rgb(59 130 246 / 0.4)'}}
                whileTap={{ scale: 0.95 }}
                className="mt-8 group bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 text-lg rounded-full shadow-lg shadow-blue-500/20 transition-all duration-300 flex items-center gap-2 mx-auto lg:mx-0"
              >
                Go to Dashboard
                <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
              </motion.button>
            ) : (
              <SignInButton mode="modal">
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: '0 10px 20px -5px rgb(59 130 246 / 0.4)'}}
                  whileTap={{ scale: 0.95 }}
                  className="mt-8 group bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 text-lg rounded-full shadow-lg shadow-blue-500/20 transition-all duration-300 flex items-center gap-2 mx-auto lg:mx-0"
                >
                  Get Started for Free
                  <ChevronRight className="transition-transform duration-300 group-hover:translate-x-1" />
                </motion.button>
              </SignInButton>
            )}
          </motion.div>
        </div>
  
        <motion.div 
            className="w-full h-full flex items-center justify-center row-start-1 lg:col-start-2"
            style={{ perspective: 1000 }}
        >
          <motion.div
            className={`relative w-72 h-72 md:w-96 md:h-96 rounded-full border-2 p-4 flex items-center justify-center ${darkMode ? 'border-blue-500/30 bg-slate-800/20' : 'border-blue-500/30 bg-white/30'}`}
            style={{ rotateX, rotateY }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <motion.div
              animate={{ y: [-10, 10, -10] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            >
              <Lottie animationData={avatar} loop={true} />
            </motion.div>
            <div className={`absolute inset-0 rounded-full shadow-2xl ${darkMode ? 'shadow-blue-500/50' : 'shadow-blue-500/30'}`}></div>
          </motion.div>
        </motion.div>
      </section>
    );
  };
  
// --- All Other Sections (Unchanged) ---
const About = ({ darkMode, Section, Title }) => (
    <Section id="about" className={darkMode ? 'bg-slate-900/50' : 'bg-slate-50'}>
      <Title>Redefining the Hiring Process</Title>
      <div className="grid md:grid-cols-2 gap-8 lg:gap-16 items-center">
        <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }} viewport={{ once: true, amount: 0.5 }}>
          <img src="https://images.unsplash.com/photo-1556740738-b6a63e27c4df?q=80&w=2070&auto=format&fit=crop" alt="Collaborative discussion" className="rounded-xl shadow-lg w-full h-auto" />
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }} viewport={{ once: true, amount: 0.5 }}>
          <p className={`text-lg mb-4 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
            AuraAI was built on the principle that hiring should be efficient, fair, and insightful. We replace traditional screening with dynamic, AI-led conversations that evaluate candidates on what truly matters.
          </p>
          <p className={`${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Our platform streamlines the entire process, providing you with rich data and analytics to make confident hiring decisions. Say goodbye to scheduling conflicts and screening bias, and hello to a smarter way to build your team.
          </p>
        </motion.div>
      </div>
    </Section>
  );
  
const Features = ({ darkMode, Section, Title }) => {
    const featureList = [
      { icon: <Bot />, title: "Conversational AI", desc: "Our AI engages candidates in natural, role-specific dialogues." },
      { icon: <BarChart />, title: "In-Depth Analytics", desc: "Receive detailed reports on performance and key competencies." },
      { icon: <ShieldCheck />, title: "Bias-Free Evaluation", desc: "Focus on skills with standardized, objective assessments." },
      { icon: <Zap />, title: "Rapid Screening", desc: "Interview hundreds of candidates in a fraction of the time." },
      { icon: <UserCheck />, title: "Enhanced Experience", desc: "A modern, engaging, and flexible process for candidates." },
    ];
    return (
      <Section id="features">
        <Title>Why Choose AuraAI?</Title>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {featureList.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true, amount: 0.5 }}
              className={`p-6 rounded-xl border flex flex-col items-center text-center transition-all duration-300 ${darkMode ? 'bg-slate-800/50 border-slate-700 hover:border-blue-500/50' : 'bg-white border-slate-200 hover:shadow-xl hover:-translate-y-1'}`}
            >
              <div className={`p-3 mb-4 rounded-full ${darkMode ? 'bg-slate-700' : 'bg-blue-50'} text-blue-500`}>{feature.icon}</div>
              <h3 className={`text-xl font-semibold mb-2 ${darkMode ? 'text-slate-100' : 'text-slate-800'}`}>{feature.title}</h3>
              <p className={`${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </Section>
    );
  };
  
const HowItWorks = ({ darkMode, Section, Title }) => {
      const steps = [
          { num: 1, title: "Create a Role", desc: "Define the job requirements and the key skills you're looking for." },
          { num: 2, title: "Invite Candidates", desc: "Send a unique interview link to applicants via email or your ATS." },
          { num: 3, title: "AI Conducts Interview", desc: "Candidates complete the automated, conversational interview on their own time." },
          { num: 4, title: "Review & Hire", desc: "Analyze the results on your dashboard and shortlist the best talent." },
        ];
        return (
          <Section id="how-it-works" className={darkMode ? 'bg-slate-900/50' : 'bg-slate-50'}>
            <Title>Simple Steps to Smarter Hiring</Title>
            <div className="relative max-w-4xl mx-auto">
              {/* Timeline for desktop */}
              <div className={`hidden md:block absolute left-1/2 top-10 bottom-10 w-0.5 ${darkMode ? 'bg-slate-700' : 'bg-slate-200'}`}></div>
              {/* Timeline for mobile */}
              <div className={`md:hidden absolute left-8 top-0 bottom-0 w-0.5 ${darkMode ? 'bg-slate-700' : 'bg-slate-200'}`}></div>
              
              {steps.map((step, i) => (
                <motion.div
                  key={step.num}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: i * 0.2 }}
                  viewport={{ once: true, amount: 0.5 }}
                  className={`flex items-start md:items-center my-8 md:my-0 md:space-x-8`}
                >
                  {/* Desktop layout */}
                  <div className={`hidden md:flex w-5/12 ${i % 2 === 0 ? 'text-right' : 'text-left flex-row-reverse'}`}>
                    <div>
                      <h3 className={`text-2xl font-bold mb-2 text-blue-500`}>{step.title}</h3>
                      <p className={`${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>{step.desc}</p>
                    </div>
                  </div>
                  <div className={`hidden md:flex w-2/12 justify-center`}>
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold border-4 border-blue-500 ${darkMode ? 'bg-slate-800 text-slate-100' : 'bg-white text-slate-800'} z-10 shadow-lg`}>
                      {step.num}
                    </div>
                  </div>
                  <div className={`hidden md:flex w-5/12 ${i % 2 !== 0 ? 'text-left' : 'text-right'}`}>
                    {i % 2 !== 0 && <div>
                      <h3 className={`text-2xl font-bold mb-2 text-blue-500`}>{step.title}</h3>
                      <p className={`${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>{step.desc}</p>
                    </div>}
                  </div>
      
                  {/* Mobile layout */}
                  <div className="md:hidden flex items-start space-x-4">
                    <div className={`w-16 h-16 flex-shrink-0 rounded-full flex items-center justify-center text-2xl font-bold border-4 border-blue-500 ${darkMode ? 'bg-slate-800 text-slate-100' : 'bg-white text-slate-800'} z-10 shadow-lg`}>
                      {step.num}
                    </div>
                    <div className="pt-2">
                      <h3 className={`text-xl font-bold mb-1 text-blue-500`}>{step.title}</h3>
                      <p className={`${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>{step.desc}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </Section>
        );
  };
  
const Pricing = ({ darkMode, Section, Title }) => {
    const plans = [
      { name: "Starter", price: "49", features: ["10 AI Interviews/mo", "Basic Analytics", "Email Support"], recommended: false },
      { name: "Pro", price: "99", features: ["50 AI Interviews/mo", "Advanced Analytics", "ATS Integration", "Priority Support"], recommended: true },
      { name: "Enterprise", price: "Contact Us", features: ["Unlimited Interviews", "Custom Branding", "API Access", "Dedicated Manager"], recommended: false },
    ];
    return (
      <Section id="pricing">
        <Title>Flexible Plans for Teams of All Sizes</Title>
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map(plan => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true, amount: 0.5 }}
              className={`p-8 rounded-2xl border transition-all duration-300 ${darkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'} ${plan.recommended ? 'border-blue-500/80 scale-105 shadow-2xl shadow-blue-500/10' : 'hover:shadow-xl hover:-translate-y-1'}`}
            >
              {plan.recommended && <div className="text-center mb-4 font-semibold text-blue-500">Most Popular</div>}
              <h3 className={`text-2xl font-semibold text-center ${darkMode ? 'text-slate-100' : 'text-slate-800'}`}>{plan.name}</h3>
              <p className={`text-5xl font-bold text-center my-4 ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>
                {plan.price.startsWith('C') ? plan.price : `$${plan.price}`}
                {!plan.price.startsWith('C') && <span className={`text-lg font-normal ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>/mo</span>}
              </p>
              <ul className="space-y-3 my-8">
                {plan.features.map(feat => (
                  <li key={feat} className={`flex items-center gap-3 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                    <UserCheck className="w-5 h-5 text-green-500 flex-shrink-0" /> {feat}
                  </li>
                ))}
              </ul>
              <button className={`w-full py-3 rounded-lg font-semibold transition-colors ${plan.recommended ? 'bg-blue-600 text-white hover:bg-blue-500' : (darkMode ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-100 hover:bg-slate-200 text-slate-700')}`}>
                {plan.name === 'Enterprise' ? 'Contact Sales' : 'Choose Plan'}
              </button>
            </motion.div>
          ))}
        </div>
      </Section>
    );
  };
  
const Testimonials = ({ darkMode, Section, Title }) => {
    const reviews = [
      { name: "Sarah L.", company: "TechCorp", text: "AuraAI cut our screening time by 70%. The quality of candidates we're seeing in final rounds has skyrocketed.", avatar: "https://randomuser.me/api/portraits/women/44.jpg" },
      { name: "Mike D.", company: "Innovate Inc.", text: "The candidate feedback has been overwhelmingly positive. They love the modern approach and flexibility.", avatar: "https://randomuser.me/api/portraits/men/44.jpg" },
      { name: "Jessica P.", company: "Solutions Co.", text: "The analytics are a game-changer. We make much more data-driven decisions now, completely free of unconscious bias.", avatar: "https://randomuser.me/api/portraits/women/45.jpg" },
    ];
    return (
      <Section id="testimonials" className={darkMode ? 'bg-slate-900/50' : 'bg-slate-50'}>
        <Title>Trusted by Leading Companies</Title>
        <div className="grid md:grid-cols-3 gap-8">
          {reviews.map(review => (
            <motion.div
              key={review.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true, amount: 0.5 }}
              className={`p-6 rounded-xl border ${darkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200 shadow-md'}`}
            >
              <div className="flex items-center mb-4">
                <img src={review.avatar} alt={review.name} className="w-12 h-12 rounded-full mr-4" />
                <div>
                  <p className={`font-semibold ${darkMode ? 'text-slate-100' : 'text-slate-800'}`}>{review.name}</p>
                  <p className={`${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>{review.company}</p>
                </div>
              </div>
              <p className={`${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>"{review.text}"</p>
              <div className="flex mt-4 text-yellow-400">
                {[...Array(5)].map((_, i) => <Star key={i} fill="currentColor" className="w-5 h-5" />)}
              </div>
            </motion.div>
          ))}
        </div>
      </Section>
    );
  };
  
// --- Contact Section with Your Formspree Link ---
const Contact = ({ darkMode, Section, Title }) => (
    <Section id="contact">
      <Title>Get in Touch</Title>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true, amount: 0.3 }}
        className={`max-w-2xl mx-auto p-8 rounded-2xl border ${darkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200 shadow-xl'}`}
      >
        <form 
          action="https://formspree.io/f/mrbljnlo" 
          method="POST" 
          className="space-y-6"
        >
          <input type="text" name="name" placeholder="Your Name" required className={`w-full p-3 rounded-lg border focus:ring-2 focus:ring-blue-500 transition-all outline-none ${darkMode ? 'bg-slate-700 border-slate-600 text-slate-100 placeholder:text-slate-400' : 'bg-slate-100 border-slate-300 text-slate-800 placeholder:text-slate-500'}`} />
          <input type="email" name="email" placeholder="Your Email" required className={`w-full p-3 rounded-lg border focus:ring-2 focus:ring-blue-500 transition-all outline-none ${darkMode ? 'bg-slate-700 border-slate-600 text-slate-100 placeholder:text-slate-400' : 'bg-slate-100 border-slate-300 text-slate-800 placeholder:text-slate-500'}`} />
          <textarea name="message" placeholder="Your Message" rows="5" required className={`w-full p-3 rounded-lg border focus:ring-2 focus:ring-blue-500 transition-all outline-none ${darkMode ? 'bg-slate-700 border-slate-600 text-slate-100 placeholder:text-slate-400' : 'bg-slate-100 border-slate-300 text-slate-800 placeholder:text-slate-500'}`}></textarea>
          <button type="submit" className="w-full py-3 rounded-lg font-semibold bg-blue-600 text-white hover:bg-blue-500 transition-colors">
            Send Message
          </button>
        </form>
      </motion.div>
    </Section>
  );
  
const Footer = ({ darkMode }) => (
    <footer className={`w-full p-8 z-10 text-center border-t ${darkMode ? 'border-slate-700/50 text-slate-400' : 'border-slate-200/50 text-slate-500 bg-slate-50'}`}>
      <p>&copy; {new Date().getFullYear()} AuraAI. All Rights Reserved.</p>
    </footer>
  );