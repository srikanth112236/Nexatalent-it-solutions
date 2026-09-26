// Motion Design Tokens conforming to NexaTalent 04-MOTION/01-MOTION-SYSTEM.md

export const motionTokens = {
  duration: {
    fast: 0.18,
    standard: 0.35,
    slow: 0.65,
    deliberate: 0.95,
  },
  ease: {
    // Custom cubic-bezier matching 21st.dev & Aceternity UI
    standard: [0.16, 1, 0.3, 1] as const,
    emphasis: [0.34, 1.56, 0.64, 1] as const,
    smooth: [0.25, 0.1, 0.25, 1] as const,
    outQuart: [0.25, 1, 0.5, 1] as const,
  },
  stagger: {
    small: 0.06,
    medium: 0.12,
    large: 0.2,
  },
  spring: {
    snappy: { type: 'spring' as const, stiffness: 400, damping: 30 },
    gentle: { type: 'spring' as const, stiffness: 200, damping: 24 },
    bouncy: { type: 'spring' as const, stiffness: 500, damping: 25 },
  },
};

// Reusable Framer Motion Variants
export const fadeInUpVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * motionTokens.stagger.medium,
      duration: motionTokens.duration.standard,
      ease: motionTokens.ease.standard,
    },
  }),
};

export const staggerContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: motionTokens.stagger.medium,
      delayChildren: 0.05,
    },
  },
};

export const scaleInVariants = {
  hidden: { opacity: 0, scale: 0.94 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: motionTokens.duration.standard,
      ease: motionTokens.ease.emphasis,
    },
  },
};
