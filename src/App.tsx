import { Suspense, useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, Preload, PerspectiveCamera, Sparkles } from '@react-three/drei';
import BackgroundScene from './components/BackgroundScene';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Github, Linkedin, Mail, ArrowRight, ChevronDown, ExternalLink, Menu, X } from 'lucide-react';


// Data
const experiences = [
  {
    role: "Machine Learning Intern",
    company: "Future Interns",
    points: [
      "Data preprocessing, model training, evaluation",
      "Python ML algorithms",
      "Real-world datasets and pipelines",
      "Deployment concepts exposure"
    ],
    delay: 0.2
  },
  {
    role: "Freelance Web Developer",
    company: "Lusso Homes",
    points: [
      "Built and hosted premium real estate website",
      "Responsive UI and UX design",
      "Performance optimization and hosting"
    ],
    delay: 0.4
  },
  {
    role: "Python Programming Intern",
    company: "Codtech IT Solutions Pvt. Ltd.",
    points: [
      "Python program development",
      "Debugging and clean code",
      "Industry-style problem-solving"
    ],
    delay: 0.6
  }
];

const skills = [
  "Python", "Machine Learning", "NLP", "Flask", "Next.js", "React", "Node.js",
  "HTML", "CSS", "JavaScript", "Git", "UI/UX", "C++"
];

const projects = [
  {
    title: "HateSense AI",
    image: "/project-1 hatesense-ai-project.png",
    desc: "Advanced AI-driven platform for detecting and mitigating online hate speech.",
    tags: ["Machine Learning", "NLP", "Python"]
  },
  {
    title: "Insightify",
    image: "/project-2 insightify-Data analysis Tool.png",
    desc: "Comprehensive Data Analysis Tool providing visually stunning metrics.",
    tags: ["Data Analysis", "Python", "Visualization"]
  },
  {
    title: "AI Sales Dashboard",
    image: "/project-3 AI-sales-dashboard-ML-project.png",
    desc: "Machine Learning powered sales tracking and predictive dashboard.",
    tags: ["ML", "Dashboard", "Analytics"]
  },
  {
    title: "Weather Dashboard",
    image: "/project-4 weather-dashboard.png",
    desc: "Real-time interactive forecast and weather tracking system.",
    tags: ["Frontend", "API", "Web"]
  },
  {
    title: "Lusso Homes",
    image: "/project- 5 lussohomes-Live ecommerce website.png",
    desc: "Live E-Commerce residential and real estate platform.",
    tags: ["E-Commerce", "Full-Stack", "React"]
  },
  {
    title: "Churn Prediction",
    image: "/project-6 churn-prediction-ML-Project.png",
    desc: "End-to-end ML project anticipating customer retention rates.",
    tags: ["Machine Learning", "Data Science"]
  },
  {
    title: "Watch Store",
    image: "/project-7 watch-ecommerce-website.png",
    desc: "Premium e-commerce front-end for luxury watch brands.",
    tags: ["Frontend", "UI/UX", "Cart"]
  },
  {
    title: "Tech Marketplace",
    image: "/project-8 Electronics ecommerce website.png",
    desc: "Modern electronics marketplace built with immersive animations.",
    tags: ["Full-Stack", "Next.js", "Design"]
  }
];

function FloatingParticles() {
  return (
    <Sparkles count={150} scale={15} size={2} speed={0.4} opacity={0.5} noise={2} color="#cba6f7" />
  );
}




function AnimatedLetters({ text, delay = 0, className = "" }: { text: string, delay?: number, className?: string }) {
  const letters = Array.from(text);

  const container = {
    hidden: { opacity: 0 },
    visible: () => ({
      opacity: 1,
      transition: { staggerChildren: 0.05, delayChildren: delay * 0.3 }
    }),
  };

  const child = {
    visible: { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" },
    hidden: { opacity: 0, y: 50, scale: 0.8, filter: "blur(10px)" },
  };

  return (
    <motion.span
      style={{ display: "inline-block" }}
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      className={className}
    >
      {letters.map((letter, index) => (
        <motion.span
          variants={child}
          transition={{ type: "spring", damping: 12, stiffness: 100 }}
          key={index}
          style={{ display: "inline-block" }}
        >
          {letter === " " ? "\u00A0" : letter}
        </motion.span>
      ))}
    </motion.span>
  );
}

export default function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { scrollYProgress } = useScroll();

  // Parallax effects
  const heroY = useTransform(scrollYProgress, [0, 0.2], [0, -100]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  // Smooth mouse follower
  const cursorDot = useRef<HTMLDivElement>(null);
  const cursorOutline = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (cursorDot.current && cursorOutline.current) {
        cursorDot.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
        cursorOutline.current.animate({
          transform: `translate3d(${e.clientX}px, ${e.clientY}px, 0)`
        }, { duration: 500, fill: 'forwards', easing: 'ease' });
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="relative w-full h-screen">
      {/* Custom Cursor */}
      <div ref={cursorDot} className="fixed w-2 h-2 bg-white rounded-full pointer-events-none z-50 -ml-1 -mt-1 mix-blend-difference" style={{ transition: 'transform 0.05s linear' }} />
      <div ref={cursorOutline} className="fixed w-10 h-10 border border-[var(--glow-color)] rounded-full pointer-events-none z-50 -ml-5 -mt-5 flex items-center justify-center opacity-60 backdrop-blur-[1px]" />

      {/* 3D Canvas Background */}
      <div id="canvas-container" className="fixed top-0 left-0 w-full h-full z-0 pointer-events-auto">
        <Canvas>
          <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={75} />
          <Suspense fallback={null}>
            <Environment preset="night" />
            <BackgroundScene />
            <FloatingParticles />
            <Preload all />
          </Suspense>
        </Canvas>
      </div>

      {/* HTML Content Overlay */}
      <div className="content-wrapper absolute top-0 left-0 w-full z-10 text-white selection:bg-purple-500/30">

        {/* Navigation */}
        <nav className="fixed top-0 w-full px-6 md:px-8 py-5 flex justify-between items-center z-50 bg-black/10 backdrop-blur-sm border-b border-white/[0.02]">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1 }} className="text-2xl font-bold tracking-widest cursor-pointer z-50 drop-shadow-[0_0_15px_rgba(216,180,254,0.6)]" style={{ background: "linear-gradient(135deg, #ffffff 0%, #d8b4fe 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Aman.Dev
          </motion.div>
          {/* Desktop Links */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1, delay: 0.2 }} className="hidden md:flex gap-8 text-sm md:text-base font-medium">
            <a href="#experience" className="text-white/80 hover:text-[var(--primary)] hover:drop-shadow-[0_0_10px_rgba(168,85,247,0.8)] transition-all">Experience</a>
            <a href="#projects" className="text-white/80 hover:text-[var(--primary)] hover:drop-shadow-[0_0_10px_rgba(168,85,247,0.8)] transition-all">Projects</a>
            <a href="#about" className="text-white/80 hover:text-[var(--primary)] hover:drop-shadow-[0_0_10px_rgba(168,85,247,0.8)] transition-all">About</a>
            <a href="#contact" className="text-white/80 hover:text-[var(--primary)] hover:drop-shadow-[0_0_10px_rgba(168,85,247,0.8)] transition-all">Contact</a>
          </motion.div>
          {/* Mobile Menu Button */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1, delay: 0.2 }} className="md:hidden z-50">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-white hover:text-[var(--primary)] transition-colors p-2">
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </motion.div>
        </nav>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-40 bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center pt-20"
            >
              <div className="flex flex-col gap-8 text-2xl font-light text-center w-full px-6">
                {['Experience', 'Projects', 'About', 'Contact'].map((item, idx) => (
                  <motion.a
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="text-white/80 hover:text-[var(--primary)] hover:drop-shadow-[0_0_15px_rgba(168,85,247,0.8)] hover:scale-105 transition-all py-4 border-b border-white/5 w-full block"
                  >
                    {item}
                  </motion.a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* HERO SECTION */}
        <motion.section style={{ y: heroY, opacity: heroOpacity }} className="min-h-screen flex flex-col justify-center items-center text-center px-4 relative">
          <motion.div
            initial={{ scale: 0.8, opacity: 0, filter: 'blur(10px)' }}
            animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="mb-6 relative p-10 md:p-16 rounded-[2rem] bg-black/40 backdrop-blur-md border border-white/10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)]"
            style={{ perspective: 1000 }}
          >
            <motion.h1
              className="mb-4 text-center drop-shadow-[0_0_35px_rgba(216,180,254,1)]"
              style={{
                background: "linear-gradient(135deg, #ffffff 0%, #d8b4fe 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent"
              }}
              whileHover={{ scale: 1.02, rotateX: 5, rotateY: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              Aman Shaikh
            </motion.h1>
            <AnimatedLetters text="Machine Learning Developer | Full-Stack Web Developer" className="text-lg md:text-2xl font-light tracking-wide text-slate-300 drop-shadow-lg" delay={2} />
          </motion.div>

          <motion.a
            href="#about"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.5, duration: 1 }}
            className="absolute bottom-12 flex flex-col items-center gap-2 cursor-pointer opacity-70 hover:opacity-100 hover:text-[var(--primary)]"
          >
            <span className="text-sm tracking-widest uppercase">Discover</span>
            <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}>
              <ChevronDown size={24} />
            </motion.div>
          </motion.a>
        </motion.section>

        {/* ABOUT SECTION */}
        <section id="about" className="section relative">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-200px" }}
              transition={{ duration: 1 }}
              className="flex-1"
            >
              <h2 className="text-left mb-6 gradient-text text-5xl">Introduction</h2>
              <motion.div className="glass-panel text-lg font-light leading-relaxed">
                <p className="mb-4">I am a Computer Science student blending the structured logic of Machine Learning with the expansive creativity of Full-Stack Web Development.</p>
                <p>Driven by curiosity, I forge digital experiences that feel intuitive, slightly surreal, and deeply functional.</p>
              </motion.div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotateY: -30 }}
              whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
              viewport={{ once: true, margin: "-200px" }}
              transition={{ duration: 1.5, type: 'spring' }}
              className="flex-1 hidden md:flex justify-center"
              style={{ perspective: 1000 }}
            >
              <div className="w-64 h-80 rounded-3xl bg-gradient-to-tr from-[#a855f7] to-[#06b6d4] opacity-20 blur-2xl absolute animate-pulse"></div>
              <div className="w-64 h-80 rounded-3xl border border-white/20 backdrop-blur-xl relative overflow-hidden flex items-center justify-center hover:shadow-[0_0_40px_rgba(168,85,247,0.4)] transition-all duration-500">
                <img src="/profile.png" alt="Amaan Shaikh" className="w-full h-full object-cover relative z-10" />
              </div>
            </motion.div>
          </div>
        </section>

        {/* EXPERIENCE SECTION */}
        <section id="experience" className="section my-32">
          <h2 className="gradient-text mb-16 relative z-10 text-5xl">Experience</h2>
          <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-3 gap-8">
            {experiences.map((exp, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 50, rotateX: 20 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: exp.delay, type: 'spring' }}
                whileHover={{ y: -10, scale: 1.02, zIndex: 20 }}
                className="glass-panel group perspective-1000"
              >
                <div className="h-full flex flex-col transform transition-transform duration-500 group-hover:translate-z-10">
                  <h3 className="text-2xl font-semibold mb-2 text-white group-hover:text-[var(--primary)] transition-colors">{exp.role}</h3>
                  <h4 className="text-lg text-[var(--glow-color)] mb-6 font-light">{exp.company}</h4>
                  <ul className="space-y-3 flex-grow">
                    {exp.points.map((pt, i) => (
                      <li key={i} className="flex items-start text-white/70 text-sm">
                        <ArrowRight size={16} className="mr-2 mt-1 text-[var(--primary)] shrink-0" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* SKILLS SECTION */}
        <section className="section py-32 overflow-hidden relative">
          <div className="max-w-6xl mx-auto p-12 md:p-20 rounded-[3rem] bg-black/40 backdrop-blur-md border border-white/10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)] flex flex-col items-center relative z-10 w-full mx-4">
            <h2 className="gradient-text mb-16 text-5xl">Skill Set</h2>
            <div className="max-w-4xl mx-auto flex flex-wrap justify-center gap-6">
              {skills.map((skill, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ type: 'spring', delay: idx * 0.05, stiffness: 200 }}
                  whileHover={{
                    scale: 1.15,
                    rotate: Math.random() * 10 - 5,
                    boxShadow: "0 0 30px rgba(168,85,247,0.6)",
                    backgroundColor: "rgba(255,255,255,0.1)"
                  }}
                  className="px-6 py-3 rounded-full border border-white/20 backdrop-blur-md bg-white/5 cursor-pointer text-lg font-medium tracking-wide transition-all duration-300 text-slate-200"
                >
                  {skill}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Visual background element for Skills */}
          <div className="absolute top-1/2 left-1/2 -transform-x-1/2 -transform-y-1/2 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none mix-blend-screen" />
        </section>

        {/* PROJECTS SECTION */}
        <section id="projects" className="section py-32 overflow-hidden relative">
          <div className="max-w-7xl mx-auto w-full px-6 relative z-10">
            <h2 className="gradient-text mb-16 text-5xl text-center drop-shadow-[0_0_20px_rgba(216,180,254,0.6)]">Projects</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {projects.map((project, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 50, scale: 0.9 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.8, delay: idx * 0.1, ease: "easeOut" }}
                  whileHover={{ y: -10, scale: 1.02 }}
                  className="group relative rounded-2xl overflow-hidden bg-[#0a0b10] border border-white/5 hover:border-white/10 cursor-pointer h-[400px] flex flex-col transition-all duration-300 hover:shadow-2xl hover:shadow-[var(--primary)]/10"
                >
                  <div className="h-[50%] w-full overflow-hidden relative">
                    <motion.img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
                    />
                  </div>

                  <div className="p-7 h-[50%] flex flex-col justify-between relative z-10 bg-gradient-to-b from-transparent to-[#0a0b10]/50">
                    <div>
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-xl font-bold text-slate-100 group-hover:text-white transition-colors">{project.title}</h3>
                        <ExternalLink size={18} className="text-white/30 group-hover:text-[var(--primary)] transition-colors mt-1" />
                      </div>
                      <p className="text-[0.95rem] text-slate-400/90 tracking-wide leading-relaxed line-clamp-2 md:line-clamp-3">{project.desc}</p>
                    </div>

                    <div className="flex flex-wrap gap-3 mt-4">
                      {project.tags.map((tag, i) => (
                        <span key={i} className="px-4 py-1.5 rounded-full text-xs font-medium bg-white/[0.03] border border-white/[0.08] text-slate-400 group-hover:bg-white/[0.06] group-hover:text-slate-200 transition-colors">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CONTACT SECTION */}
        <section id="contact" className="section min-h-screen flex justify-center items-center relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="glass-panel text-center max-w-2xl w-full p-12 md:p-20 relative overflow-hidden"
          >
            {/* Embedded animated blob for contact bg */}
            <motion.div
              animate={{
                rotate: [0, 360],
                scale: [1, 1.2, 1]
              }}
              transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
              className="absolute -top-[50%] -left-[50%] w-[200%] h-[200%] bg-gradient-to-r from-transparent via-[var(--glow-color)] to-transparent opacity-20 blur-3xl rounded-full z-0 pointer-events-none"
            />

            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">Initiate Link</h2>
              <p className="text-xl text-white/80 mb-10 font-light">
                "Let's build something meaningful."
              </p>

              <div className="flex justify-center mb-10 gap-6">
                <motion.a whileHover={{ y: -5, scale: 1.1, textShadow: "0 0 10px #fff" }} href="#" aria-label="Github" className="text-white hover:text-[var(--primary)] transition-colors"><Github size={32} /></motion.a>
                <motion.a whileHover={{ y: -5, scale: 1.1, textShadow: "0 0 10px #fff" }} href="#" aria-label="LinkedIn" className="text-white hover:text-[var(--primary)] transition-colors"><Linkedin size={32} /></motion.a>
                <motion.a whileHover={{ y: -5, scale: 1.1, textShadow: "0 0 10px #fff" }} href="mailto:hello@amaanshaikh.com" aria-label="Email" className="text-white hover:text-[var(--primary)] transition-colors"><Mail size={32} /></motion.a>
              </div>

              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="#"
                className="btn-primary"
              >
                <span>Send Transmission</span>
              </motion.a>
            </div>
          </motion.div>

          <footer className="absolute bottom-8 text-white/40 text-sm font-light uppercase tracking-widest text-center w-full">
            © {new Date().getFullYear()} Amaan Shaikh. Crafted with intention.
          </footer>
        </section>

      </div>
    </div>
  );
}
