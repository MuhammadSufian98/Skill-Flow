"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

export default function AuthTransition({ children }) {
  const pathname = usePathname();
  const isSignup = pathname.includes("signup");

  return (
    <main className="relative z-10 flex min-h-screen items-center justify-center px-4">
      <AnimatePresence mode="wait">
        <motion.div
          key={pathname}
          initial={{
            opacity: 0,
            x: isSignup ? 40 : -40,
            filter: "blur(8px)",
          }}
          animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
          exit={{
            opacity: 0,
            x: isSignup ? -40 : 40,
            filter: "blur(8px)",
          }}
          transition={{ duration: 0.45, ease: "easeInOut" }}
          className="w-full max-w-4xl"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </main>
  );
}
