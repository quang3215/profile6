import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import InteractiveFullSpaceGalaxy from "./InteractiveFullSpaceGalaxy";

function Typewriter({ words }: { words: string[] }) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const word = words[currentWordIndex];
    let typingSpeed = isDeleting ? 40 : 80;

    if (!isDeleting && currentText === word) {
      const pause = setTimeout(() => setIsDeleting(true), 1500);
      return () => clearTimeout(pause);
    }

    if (isDeleting && currentText === "") {
      setIsDeleting(false);
      setCurrentWordIndex((prev) => (prev + 1) % words.length);
      return;
    }

    const timeout = setTimeout(() => {
      setCurrentText((prev) =>
        isDeleting ? word.substring(0, prev.length - 1) : word.substring(0, prev.length + 1)
      );
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [currentText, isDeleting, currentWordIndex, words]);

  return (
    <span className="inline-block min-w-[200px]">
      {currentText}
      <span className="animate-[pulse_1s_ease-in-out_infinite] ml-1">|</span>
    </span>
  );
}

export default function App() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Custom Validation for common email typos
    const email = formData.email.toLowerCase();
    const invalidDomains = ["@gmmail.com", "@gmai.com", "@gamil.com", "@gmail.con", "@yaho.com", "@yahoo.con"];
    if (invalidDomains.some(domain => email.endsWith(domain))) {
      alert("Có vẻ bạn đã gõ nhầm đuôi email (ví dụ: @gmail.com thay vì @gmmail.com). Vui lòng kiểm tra lại!");
      return;
    }

    setStatus("submitting");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: "c24a62f9-9034-409b-a5d3-9137208a6dfb",
          ...formData,
        }),
      });
      const result = await response.json();
      if (result.success) {
        setStatus("success");
        setFormData({ name: "", email: "", message: "" });
        setTimeout(() => setStatus("idle"), 3000);
      } else {
        setStatus("error");
      }
    } catch (error) {
      console.error(error);
      setStatus("error");
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col font-sans overflow-x-hidden text-white">
      <InteractiveFullSpaceGalaxy />
      
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-black/50 backdrop-blur-md border-b border-white/10 px-4 md:px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <span className="text-lg md:text-xl font-bold tracking-widest text-white">MINHQUANG28</span>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="pt-28 md:pt-24 flex-grow max-w-7xl mx-auto px-4 md:px-6 w-full flex flex-col md:flex-row items-center justify-between gap-12 relative z-10 pb-16">
        
        {/* Left Side */}
        <motion.div 
          className="flex-1 space-y-6 text-center md:text-left"
          initial={{ opacity: 0, x: -80 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h1 className="text-4xl md:text-7xl font-extrabold text-white tracking-tight leading-tight">
            Hi, I'm Quang
          </h1>
          <h2 className="text-xl md:text-3xl font-semibold text-[var(--color-accent-cyan)] drop-shadow-[0_0_8px_rgba(0,229,255,0.5)]">
            Digital Architect & Performance Engineer
          </h2>
          <p className="text-base md:text-xl text-gray-300 leading-relaxed max-w-xl mx-auto md:mx-0">
            I build high-performance Web Apps, engineer advanced SEO architectures, and scale revenue through strategic Ads. I design e-commerce systems that seamlessly convert traffic into sustained growth.
          </p>
          
          {/* Buttons */}
          <div className="flex flex-col sm:flex-row flex-wrap gap-4 pt-4 justify-center md:justify-start">
            <button className="px-8 py-3 w-full sm:w-auto rounded-full font-bold text-black bg-[var(--color-accent-lime)] hover:bg-lime-400 transition-all shadow-[0_0_15px_rgba(57,255,20,0.4)] hover:shadow-[0_0_25px_rgba(57,255,20,0.6)] hover:-translate-y-0.5 active:translate-y-0">
              View Ecosystem
            </button>
            <button className="px-8 py-3 w-full sm:w-auto rounded-full font-bold text-[var(--color-accent-cyan)] border-2 border-[var(--color-accent-cyan)] hover:bg-[var(--color-accent-cyan)] hover:text-black transition-all shadow-[0_0_10px_rgba(0,229,255,0.2)] hover:shadow-[0_0_20px_rgba(0,229,255,0.6)] hover:-translate-y-0.5 active:translate-y-0">
              Contact
            </button>
          </div>

          {/* Typewriter */}
          <div className="pt-8 text-lg md:text-2xl font-mono text-[var(--color-accent-cyan)] drop-shadow-[0_0_5px_rgba(0,229,255,0.8)] h-8">
            &gt; <Typewriter words={['Web App Solutions.', 'SEO Optimization.', 'Ads Management.', 'E-commerce Support.']} />
          </div>
        </motion.div>

        {/* Right Side: 3D Wireframe Sphere */}
        <motion.div 
          className="flex-1 flex justify-center items-center w-full py-12 md:py-0"
          initial={{ opacity: 0, x: 80 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <svg viewBox="0 0 200 200" className="w-56 h-56 sm:w-64 sm:h-64 md:w-96 md:h-96 animate-float animate-pulse-lime drop-shadow-[0_0_15px_rgba(57,255,20,0.6)]">
            <g stroke="var(--color-accent-lime)" strokeWidth="1" fill="none">
              <circle cx="100" cy="100" r="90" className="opacity-80" />
              <ellipse cx="100" cy="100" rx="90" ry="30" className="opacity-80" />
              <ellipse cx="100" cy="100" rx="30" ry="90" className="opacity-80" />
              <ellipse cx="100" cy="100" rx="90" ry="30" transform="rotate(45 100 100)" className="opacity-80" />
              <ellipse cx="100" cy="100" rx="90" ry="30" transform="rotate(-45 100 100)" className="opacity-80" />
              <ellipse cx="100" cy="100" rx="90" ry="30" transform="rotate(90 100 100)" className="opacity-80" />
              
              {/* Intricate inner details */}
              <circle cx="100" cy="100" r="60" strokeDasharray="4 4" className="opacity-60" strokeWidth="1.5" />
              <circle cx="100" cy="100" r="30" className="opacity-50" strokeWidth="2" />
              <circle cx="100" cy="100" r="10" className="opacity-80" fill="var(--color-accent-lime)" />
            </g>
          </svg>
        </motion.div>

      </main>

      {/* Bento Box Section */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 w-full pb-24 relative z-10 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Web & SEO Solutions */}
          <motion.div 
            className="md:col-span-2 bg-[#111]/70 backdrop-blur-lg rounded-3xl border border-white/5 p-6 md:p-8 transition-all duration-300 hover:border-[var(--color-accent-cyan)] hover:shadow-[0_0_30px_rgba(0,229,255,0.15)] group flex flex-col justify-between"
            initial={{ opacity: 0, x: -80 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="mb-6 w-12 h-12 rounded-xl bg-[var(--color-accent-cyan)]/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <svg className="w-6 h-6 text-[var(--color-accent-cyan)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl md:text-2xl font-bold text-white mb-3">Web & SEO Solutions</h3>
              <p className="text-sm md:text-base text-gray-400 leading-relaxed">
                Developing modern web applications and assisting with technical SEO to help improve search visibility.
              </p>
            </div>
          </motion.div>

          {/* Card 2: Ads Management */}
          <motion.div 
            className="md:col-span-1 bg-[#111]/70 backdrop-blur-lg rounded-3xl border border-white/5 p-6 md:p-8 transition-all duration-300 hover:border-[var(--color-accent-lime)] hover:shadow-[0_0_30px_rgba(57,255,20,0.15)] group flex flex-col justify-between"
            initial={{ opacity: 0, x: 80 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="mb-6 w-12 h-12 rounded-xl bg-[var(--color-accent-lime)]/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <svg className="w-6 h-6 text-[var(--color-accent-lime)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl md:text-2xl font-bold text-white mb-3">Ads Management</h3>
              <p className="text-sm md:text-base text-gray-400 leading-relaxed">
                Scaling Targeted campaigns across Google & Meta. Focusing on budget efficiency and conversion tracking.
              </p>
            </div>
          </motion.div>

          {/* Card 4: Digital Infrastructure */}
          <motion.div 
            className="md:col-span-1 bg-[#111]/70 backdrop-blur-lg rounded-3xl border border-white/5 p-6 md:p-8 transition-all duration-300 hover:border-[var(--color-accent-lime)] hover:shadow-[0_0_30px_rgba(57,255,20,0.15)] group flex flex-col justify-between"
            initial={{ opacity: 0, x: -80 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="mb-6 w-12 h-12 rounded-xl bg-[var(--color-accent-lime)]/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <svg className="w-6 h-6 text-[var(--color-accent-lime)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl md:text-2xl font-bold text-white mb-3">Digital Infrastructure</h3>
              <p className="text-sm md:text-base text-gray-400 leading-relaxed">
                Supporting businesses with digital transitions and reliable domain management (Rạng Đông).
              </p>
            </div>
          </motion.div>

          {/* Card 3: E-commerce Support */}
          <motion.div 
            className="md:col-span-2 bg-[#111]/70 backdrop-blur-lg rounded-3xl border border-white/5 p-6 md:p-8 transition-all duration-300 hover:border-[var(--color-accent-cyan)] hover:shadow-[0_0_30px_rgba(0,229,255,0.15)] group flex flex-col justify-between"
            initial={{ opacity: 0, y: 80 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="mb-6 w-12 h-12 rounded-xl bg-[var(--color-accent-cyan)]/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <svg className="w-6 h-6 text-[var(--color-accent-cyan)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl md:text-2xl font-bold text-white mb-3">E-commerce Support</h3>
              <p className="text-sm md:text-base text-gray-400 leading-relaxed">
                Operational support for Shopee and TikTok Shop. Store setup, fee calculation, and listing optimization.
              </p>
            </div>
          </motion.div>

          {/* Card 5: Beyond Screen */}
          <motion.div 
            className="md:col-span-2 md:col-start-2 bg-[#111]/70 backdrop-blur-lg rounded-3xl border border-white/5 p-6 md:p-8 transition-all duration-300 hover:border-[var(--color-accent-lime)] hover:shadow-[0_0_30px_rgba(57,255,20,0.15)] group flex flex-col justify-between"
            initial={{ opacity: 0, x: 80 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="mb-6 w-12 h-12 rounded-xl bg-[var(--color-accent-lime)]/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <svg className="w-6 h-6 text-[var(--color-accent-lime)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl md:text-2xl font-bold text-white mb-3">Beyond Screen</h3>
              <p className="text-sm md:text-base text-gray-400 leading-relaxed">
                Adventure travel (Đi Phượt) & Street Photography with a Sony A6700 setup.
              </p>
            </div>
          </motion.div>

        </div>
      </section>

      {/* Contact Section */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 w-full pb-24 relative z-10 overflow-hidden">
        <motion.div 
          className="max-w-2xl mx-auto bg-[#111]/70 backdrop-blur-lg border border-white/10 rounded-3xl p-6 md:p-8"
          initial={{ opacity: 0, y: 80 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 text-center tracking-tight">Initiate Contact</h2>
          <form onSubmit={handleSubmit} className="flex flex-col space-y-6">
            <input 
              type="text" 
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              placeholder="Name" 
              className="bg-black/50 rounded-xl p-4 text-white outline-none border border-transparent transition-all duration-300 focus:border-[var(--color-accent-lime)] focus:shadow-[0_0_15px_rgba(57,255,20,0.3)] placeholder-gray-500 w-full" 
            />
            <input 
              type="email" 
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              placeholder="Email" 
              className="bg-black/50 rounded-xl p-4 text-white outline-none border border-transparent transition-all duration-300 focus:border-[var(--color-accent-lime)] focus:shadow-[0_0_15px_rgba(57,255,20,0.3)] placeholder-gray-500 w-full" 
            />
            <textarea 
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              required
              placeholder="Message" 
              rows={4} 
              className="bg-black/50 rounded-xl p-4 text-white outline-none border border-transparent transition-all duration-300 focus:border-[var(--color-accent-lime)] focus:shadow-[0_0_15px_rgba(57,255,20,0.3)] placeholder-gray-500 resize-none w-full" 
            />
            <button 
              type="submit" 
              disabled={status === 'submitting'}
              className={`w-full px-8 py-4 mt-2 rounded-xl font-bold text-black transition-all duration-300 text-lg ${
                status === 'success' 
                  ? 'bg-[var(--color-accent-lime)] shadow-[0_0_15px_rgba(57,255,20,0.4)]' 
                  : status === 'submitting'
                  ? 'bg-gray-500 animate-pulse'
                  : 'bg-[var(--color-accent-cyan)] hover:brightness-110 shadow-[0_0_15px_rgba(0,229,255,0.4)] hover:shadow-[0_0_25px_rgba(0,229,255,0.7)] hover:-translate-y-0.5 active:translate-y-0'
              }`}
            >
              {status === 'submitting' ? 'Sending...' : status === 'success' ? 'Signal Sent!' : 'Send Signal'}
            </button>
          </form>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="w-full border-t border-white/10 relative z-10 bg-black/20 backdrop-blur-md mt-auto">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8 flex flex-col items-center justify-center">
          <p className="font-mono text-xs md:text-sm text-gray-500 tracking-widest text-center">
            INITIATED BY MINHQUANG28 © 2026. HANOI, VN.
          </p>
        </div>
      </footer>

    </div>
  );
}
