"use client"

import { Button } from "@/components/ui/button"
import { Book, ChevronDown, GanttChartIcon as ChartGantt } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"

async function login() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
      credentials: "include",
    })
    const data = await response.json()
    window.location.href = data.url
  } catch (error) {
    console.error(error)
  }
}

const AnimatedSection = ({ children, direction }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: direction === "left" ? -50 : 50 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="flex flex-col md:flex-row items-center justify-between py-16 px-4 md:px-8"
    >
      {children}
    </motion.div>
  )
}

const ScrollIndicator = () => (
  <motion.div
    className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
    animate={{ y: [0, 10, 0] }}
    transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
  >
    <ChevronDown className="h-8 w-8 text-gray-400" />
  </motion.div>
)

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100">
      <main className="w-full max-w-6xl mx-auto">
        <section className="relative flex flex-col items-center justify-center min-h-screen text-center px-4">
          <Image src="/logo.png" alt="Lapisla Logo" width={120} height={120} className="mb-8" />

          <h1 className="text-4xl md:text-6xl font-bold mb-4">Lapisla.net</h1>

          <p className="text-xl md:text-2xl mb-8 text-gray-600 dark:text-gray-300">
            The User-Friendly Theorem Proof Platform
          </p>

          <div className="flex justify-center space-x-4 mb-12">
            <Link
              href="https://github.com/lapisla-prover/lapisla-prover"
              className="transition-transform hover:scale-110"
            >
              <Image src="/mark-github.svg" alt="GitHub" width={32} height={32} />
              <span className="sr-only">GitHub</span>
            </Link>
            <Link href="https://docs.lapisla.net" className="transition-transform hover:scale-110">
              <Book className="h-8 w-8" />
              <span className="sr-only">Documentation</span>
            </Link>
            <Link href="/timeline" className="transition-transform hover:scale-110">
              <ChartGantt className="h-8 w-8" />
              <span className="sr-only">Timeline</span>
            </Link>
          </div>

          <Button
            onClick={login}
            size="lg"
            className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            Login with GitHub
            <Image src="/mark-github.svg" alt="GitHub" width={20} height={20} className="ml-2" />
          </Button>

          <ScrollIndicator />
        </section>

        {/* Content Sections */}
        <AnimatedSection direction="left">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h2 className="text-3xl font-bold mb-4"> lapisla.net  is more than just a theorem proving assistant—it's a theorem proving platform! </h2>
            <p className="text-lg">
              You can create, edit, and share your proofs with others very easily. 
              Just one click is all you need.
            </p>
          </div>
          <div className="md:w-1/2">
            <Image
              src="/timeline.png"
              alt="Timeline"
              width={500}
              height={300}
            />
          </div>
        </AnimatedSection>

        <AnimatedSection direction="right">
          <div className="md:w-1/2 md:order-2 mb-8 md:mb-0">
            <h2 className="text-3xl font-bold mb-4"> No environment setup required </h2>
            <p className="text-lg">
              lapisla completely runs on the web, so you don't need to install anything on your computer,
              including package managers.
            </p>
          </div>
          <div className="md:w-1/2 md:order-1">
            <Image
              src="/editor.png"
              alt="Editor"
              width={500}
              height={300}
            />
          </div>
        </AnimatedSection>

        <AnimatedSection direction="left">
          <div className="md:w-1/2 mb-8 md:mb-0">
           <h2 className="text-3xl font-bold mb-4"> lapisla.net  is open source </h2>
            <p className="text-lg">
              lapisla is open source, so you can contribute to the project and make it better for everyone.
            </p>
          </div>
          

          <div className="flex flex-col md:flex-row items-center justify-center space-x-4">
            <Link href="https://docs.lapisla.net">
              <Button variant="outline" className="hover:bg-gray-200 dark:hover:bg-gray-700">
                <Book className="h-5 w-5" />
                 Read Documentation
                 
              </Button>
            </Link>

            <Link href="https://gihub.com/lapisla-prover/lapisla-prover">
              <Button variant="outline" className="hover:bg-gray-200 dark:hover:bg-gray-700">
                <Image src="/mark-github.svg" alt="GitHub" width={20} height={20} />
                Go to Repository
              </Button>
            </Link>
          </div>
        </AnimatedSection>
      </main>

      <footer className="text-center py-8 text-sm text-gray-500 dark:text-gray-400">
        © 2024 Lapisla.net. All rights reserved.
      </footer>
    </div>
  )
}

