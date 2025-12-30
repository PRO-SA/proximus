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
    <div className="hidden lg:flex justify-center absolute inset-0 overflow-hidden pointer-events-none select-none">
      {/* Ambient glow background - positioned higher */}
      <div className="absolute top-16 left-1/2 -translate-x-1/2">
        <div className="w-[600px] h-[400px] bg-gradient-to-r from-frappe-blue/15 via-frappe-mauve/15 to-frappe-sapphire/15 blur-[120px] rounded-full animate-glow-pulse" />
      </div>

      {/* ASCII art positioned at top */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.3 }}
        className="absolute top-20 left-1/2 -translate-x-1/2"
      >
        <pre className="text-[12px] lg:text-[16px] xl:text-[20px] 2xl:text-[24px] font-mono whitespace-pre leading-tight opacity-[0.08]">
          {lines.map((line, index) => (
            <motion.span
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.3 + index * 0.04 }}
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
