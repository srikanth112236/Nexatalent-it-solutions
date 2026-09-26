import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { motionTokens } from '../../shared/motion/motionTokens';
import { JobCard, JobCardProps } from './JobCard';

export interface FeaturedJobsCarouselProps {
  title?: string;
  badge?: string;
  subtitle?: string;
  categories?: string[];
  jobs?: JobCardProps[];
}

export const FeaturedJobsCarousel: React.FC<FeaturedJobsCarouselProps> = ({
  badge = 'Handpicked Mandates',
  title = 'High-Impact Engineering Roles',
  subtitle = 'Discover elite positions with hyper-growth global teams, backed by transparent comp bands and dedicated recruiter advocacy.',
  categories = ['All Categories', 'Distributed Systems', 'AI & Machine Learning', 'Cloud Native & SRE', 'Engineering Leadership'],
  jobs = [
    {
      id: 'job-1',
      title: 'Principal Distributed Systems Engineer',
      company: 'OmniCloud Networks',
      location: 'Bangalore, India · Hybrid',
      type: 'Full-Time',
      salary: '₹65L - ₹90L + ESOPs',
      experience: '9+ Years',
      tags: ['Rust', 'Raft Consensus', 'High Throughput', 'Distributed DB'],
      postedAt: 'Just now',
      featured: true,
      urgent: true,
    },
    {
      id: 'job-2',
      title: 'Lead GenAI / LLM Infrastructure Architect',
      company: 'CognitiveScale Dynamics',
      location: 'Remote · Global',
      type: 'Full-Time · Remote',
      salary: '$165,000 - $210,000',
      experience: '7+ Years',
      tags: ['vLLM', 'PyTorch', 'TensorRT', 'CUDA Optimization'],
      postedAt: '1 day ago',
      featured: true,
      urgent: false,
    },
    {
      id: 'job-3',
      title: 'VP of Platform Engineering (GCC Hub)',
      company: 'AstraFin Financial Core',
      location: 'Hyderabad, India',
      type: 'Full-Time · Onsite',
      salary: '₹1.1Cr - ₹1.4Cr',
      experience: '14+ Years',
      tags: ['GCC Scaling', 'Core Banking', 'Zero Downtime', 'Leadership'],
      postedAt: '3 days ago',
      featured: true,
      urgent: true,
    },
    {
      id: 'job-4',
      title: 'Staff Kubernetes / SRE Specialist',
      company: 'DataStream Technologies',
      location: 'Bangalore, India · Remote',
      type: 'Full-Time · Remote',
      salary: '₹55L - ₹75L',
      experience: '8+ Years',
      tags: ['Kubernetes Operators', 'Golang', 'eBPF', 'Terraform'],
      postedAt: '4 days ago',
      featured: false,
      urgent: false,
    },
  ],
}) => {
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [currentPage, setCurrentPage] = useState(0);
  const [direction, setDirection] = useState(1);

  const pageSize = 3;
  const filteredJobs =
    selectedCategory === 'All Categories'
      ? jobs
      : jobs.filter((j) =>
          j.tags.some((t) => t.toLowerCase().includes(selectedCategory.toLowerCase())) ||
          j.title.toLowerCase().includes(selectedCategory.toLowerCase())
        );

  const totalPages = Math.ceil(filteredJobs.length / pageSize) || 1;
  const visibleJobs = filteredJobs.slice(currentPage * pageSize, (currentPage + 1) * pageSize);

  const handlePrev = () => {
    setDirection(-1);
    setCurrentPage((prev) => (prev > 0 ? prev - 1 : totalPages - 1));
  };

  const handleNext = () => {
    setDirection(1);
    setCurrentPage((prev) => (prev < totalPages - 1 ? prev + 1 : 0));
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: motionTokens.stagger.medium,
      }
    }
  };

  const fadeUpVariant = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: motionTokens.duration.standard,
        ease: motionTokens.ease.standard
      }
    }
  };

  const gridVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 30 : -30,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: {
        duration: motionTokens.duration.standard,
        ease: motionTokens.ease.standard,
        staggerChildren: motionTokens.stagger.small,
      }
    },
    exit: (dir: number) => ({
      x: dir < 0 ? 30 : -30,
      opacity: 0,
      transition: {
        duration: motionTokens.duration.fast,
        ease: motionTokens.ease.standard
      }
    }),
  };

  return (
    <section style={{ padding: '5rem 2rem', backgroundColor: 'rgba(15, 23, 42, 0.3)', overflow: 'hidden' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Section Header */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-50px' }}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            flexWrap: 'wrap',
            gap: '1.5rem',
            marginBottom: '2.5rem',
          }}
        >
          <div>
            <motion.div
              variants={fadeUpVariant}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.8125rem',
                fontWeight: 600,
                color: 'var(--color-primary-400)',
                marginBottom: '0.75rem',
              }}
            >
              <Sparkles size={14} />
              {badge}
            </motion.div>
            <motion.h2 
              variants={fadeUpVariant}
              style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 800, color: 'var(--color-text)' }}
            >
              {title}
            </motion.h2>
            <motion.p 
              variants={fadeUpVariant}
              style={{ color: 'var(--color-text-secondary)', marginTop: '0.5rem', maxWidth: '600px' }}
            >
              {subtitle}
            </motion.p>
          </div>

          {/* Carousel Arrows */}
          <motion.div variants={fadeUpVariant} style={{ display: 'flex', gap: '0.5rem' }}>
            <motion.button
              onClick={handlePrev}
              aria-label="Previous jobs"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9, rotate: -5 }}
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                color: 'var(--color-text)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <ChevronLeft size={20} />
            </motion.button>
            <motion.button
              onClick={handleNext}
              aria-label="Next jobs"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9, rotate: 5 }}
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                color: 'var(--color-text)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <ChevronRight size={20} />
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Category Pills */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          style={{
            display: 'flex',
            gap: '0.5rem',
            overflowX: 'auto',
            paddingBottom: '1rem',
            marginBottom: '2rem',
          }}
        >
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <motion.button
                key={cat}
                variants={fadeUpVariant}
                onClick={() => {
                  setSelectedCategory(cat);
                  setCurrentPage(0);
                  setDirection(1);
                }}
                style={{
                  position: 'relative',
                  padding: '0.5rem 1rem',
                  borderRadius: '9999px',
                  border: isSelected ? '1px solid var(--color-primary)' : '1px solid var(--color-border)',
                  backgroundColor: 'transparent',
                  color: isSelected ? 'var(--color-primary-400)' : 'var(--color-text-secondary)',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'color 0.2s ease',
                  zIndex: 1
                }}
              >
                {isSelected && (
                  <motion.div
                    layoutId="activeCategory"
                    style={{
                      position: 'absolute',
                      inset: 0,
                      borderRadius: '9999px',
                      backgroundColor: 'rgba(59, 130, 246, 0.15)',
                      zIndex: -1
                    }}
                    transition={motionTokens.spring.snappy}
                  />
                )}
                {cat}
              </motion.button>
            );
          })}
        </motion.div>

        {/* Jobs Grid */}
        <div style={{ position: 'relative', minHeight: '300px', marginBottom: '2.5rem' }}>
          <AnimatePresence mode="wait" custom={direction}>
            {visibleJobs.length > 0 ? (
              <motion.div
                key={`${selectedCategory}-${currentPage}`}
                custom={direction}
                variants={gridVariants}
                initial="enter"
                animate="center"
                exit="exit"
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                  gap: '1.5rem',
                }}
              >
                {visibleJobs.map((job) => (
                  <motion.div key={job.id} variants={fadeUpVariant}>
                    <JobCard {...job} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: motionTokens.duration.slow }}
                style={{
                  padding: '3rem',
                  textAlign: 'center',
                  color: 'var(--color-text-tertiary)',
                }}
              >
                No roles currently listed in this category. Check back soon or view all jobs.
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom CTA Link */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: motionTokens.duration.standard }}
          style={{ textAlign: 'center' }}
        >
          <Link
            to="/jobs"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: 'var(--color-primary-400)',
              fontWeight: 600,
              fontSize: '0.9375rem',
              textDecoration: 'none',
            }}
          >
            <span>Explore All 240+ Open Mandates</span>
            <ArrowRight size={16} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};
