'use client'
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden relative">
      {/* Background subtle animation */}
      <div className="absolute inset-0 bg-linear-to-br from-gray-950 via-indigo-950 to-black pointer-events-none">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_50%_50%,rgba(34,197,94,0.1)_0%,transparent_50%)] animate-pulse-slow" />
      </div>

      {/* Hero/Intro Section with animation */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 py-12 px-4 sm:px-6 lg:px-8 text-center"
      >
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <Image
              src="/logo.png" 
              alt="SDK Bot Logo"
              width={120}
              height={120}
              className="mx-auto rounded-full overflow-hidden shadow-lg shadow-cyan-500/30 h-32 w-32"
              priority
            />
          </motion.div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            <span className="bg-linear-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Welcome to SDK Bot
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto mb-8">
            Powered by OpenAI Agents SDK. Chat about agents, workflows, tools, and more with a futuristic UI.
          </p>
           <Link href={'/chatbot'}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-linear-to-r from-cyan-500 to-purple-600 px-6 py-3 rounded-full font-semibold text-white shadow-lg hover:shadow-cyan-500/40 transition-shadow"
            onClick={() => document.getElementById("chatbot")?.scrollIntoView({ behavior: "smooth" })}
          >
           
            Start Chatting ↓
          
          </motion.button>
            </Link>
        </div>
      </motion.section>

      {/* Chatbot Section */}
      {/* <section id="chatbot" className="relative z-10">
        <Chatbot />
      </section> */}

      {/* Footer */}
      <footer className="relative z-10 py-6 text-center text-gray-500 text-sm border-t border-indigo-900/30 mt-auto">
        <p>© 2026 SDK Bot | Built with Next.js & Tailwind</p>
      </footer>
    </main>
  );
}
