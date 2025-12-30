'use client';

import { motion } from 'framer-motion';

const lines = [
  "     ██╗ █████╗ ███╗   ██╗██╗   ██╗███████╗",
  "     ██║██╔══██╗████╗  ██║██║   ██║██╔════╝",
  "     ██║███████║██╔██╗ ██║██║   ██║███████╗",
  "██   ██║██╔══██║██║╚██╗██║██║   ██║╚════██║",
  "╚█████╔╝██║  ██║██║ ╚████║╚██████╔╝███████║",
  " ╚════╝ ╚═╝  ╚═╝╚═╝  ╚═══╝ ╚═════╝ ╚══════╝",
  "              █████╗ ██╗                   ",
  "             ██╔══██╗██║                   ",
  "             ███████║██║                   ",
  "             ██╔══██║██║                   ",
  "             ██║  ██║██║                   ",
  "             ╚═╝  ╚═╝╚═╝                   ",
];

export function AsciiBackground() {
  return (
    <div className="hidden lg:flex items-center justify-center absolute inset-0 overflow-hidden pointer-events-none select-none">
      {/* Ambient glow background */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-[500px] h-[500px] bg-gradient-to-r from-frappe-blue/20 via-frappe-mauve/20 to-frappe-sapphire/20 blur-[100px] rounded-full animate-glow-pulse" />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="relative -mt-32"
      >
        <pre className="text-[10px] lg:text-[14px] xl:text-[18px] 2xl:text-[22px] font-mono whitespace-pre leading-tight opacity-10">
          {lines.map((line, index) => (
            <motion.span
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.5 + index * 0.05 }}
              className="block bg-gradient-to-r from-frappe-blue via-frappe-mauve to-frappe-lavender bg-clip-text text-transparent"
            >
              {line}
            </motion.span>
          ))}
        </pre>
      </motion.div>
    </div>
  );
}
