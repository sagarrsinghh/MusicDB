'use client';

import { motion } from 'framer-motion';

export default function CinematicOverlay() {
    return (
        <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
            {/* Dynamic Film Grain Layer */}
            <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay animate-grain bg-grain" />

            {/* Classic Vignette */}
            <div className="absolute inset-0 shadow-[inset_0_0_150px_rgba(0,0,0,0.8)] pointer-events-none" />

            {/* Retro Scanlines (Subtle) */}
            <div className="absolute inset-0 bg-scanlines opacity-[0.02] pointer-events-none" />

            {/* Random Light Leaks (Animated) */}
            <motion.div
                animate={{
                    x: [-100, 100, -50],
                    y: [-100, 50, -100],
                    scale: [1, 1.2, 1],
                    opacity: [0, 0.1, 0]
                }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute -top-1/4 -left-1/4 w-[150%] h-[150%] bg-[radial-gradient(circle_at_center,_rgba(255,150,150,0.1),_transparent_60%)] blur-3xl pointer-events-none"
            />

            <style jsx global>{`
        .bg-grain {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
        }

        .bg-scanlines {
          background: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0, 0, 0, 0.5) 2px,
            rgba(0, 0, 0, 0.5) 4px
          );
        }

        @keyframes grain {
          0%, 100% { transform: translate(0, 0); }
          10% { transform: translate(-5%, -5%); }
          20% { transform: translate(-10%, 5%); }
          30% { transform: translate(5%, -10%); }
          40% { transform: translate(-5%, 15%); }
          50% { transform: translate(-10%, 5%); }
          60% { transform: translate(15%, 0); }
          70% { transform: translate(0, 10%); }
          80% { transform: translate(-15%, 0); }
          90% { transform: translate(10%, 5%); }
        }

        .animate-grain {
          animation: grain 8s steps(10) infinite;
        }
      `}</style>
        </div>
    );
}
