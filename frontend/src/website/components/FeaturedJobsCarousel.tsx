import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
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
    setCurrentPage((prev) => (prev > 0 ? prev - 1 : totalPages - 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => (prev < totalPages - 1 ? prev + 1 : 0));
  };

  return (
    <section style={{ padding: '5rem 2rem', backgroundColor: 'rgba(15, 23, 42, 0.3)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Section Header */}
        <div
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
            <div
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
            </div>
            <h2 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 800, color: 'var(--color-text)' }}>
              {title}
            </h2>
            <p style={{ color: 'var(--color-text-secondary)', marginTop: '0.5rem', maxWidth: '600px' }}>
              {subtitle}
            </p>
          </div>

          {/* Carousel Arrows */}
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={handlePrev}
              aria-label="Previous jobs"
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
            </button>
            <button
              onClick={handleNext}
              aria-label="Next jobs"
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
            </button>
          </div>
        </div>

        {/* Category Pills */}
        <div
          style={{
            display: 'flex',
            gap: '0.5rem',
            overflowX: 'auto',
            paddingBottom: '1rem',
            marginBottom: '2rem',
          }}
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setCurrentPage(0);
              }}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '9999px',
                border: selectedCategory === cat ? '1px solid var(--color-primary)' : '1px solid var(--color-border)',
                backgroundColor: selectedCategory === cat ? 'rgba(59, 130, 246, 0.15)' : 'var(--color-surface)',
                color: selectedCategory === cat ? 'var(--color-primary-400)' : 'var(--color-text-secondary)',
                fontSize: '0.8125rem',
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease',
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Jobs Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '1.5rem',
            marginBottom: '2.5rem',
          }}
        >
          {visibleJobs.length > 0 ? (
            visibleJobs.map((job) => <JobCard key={job.id} {...job} />)
          ) : (
            <div
              style={{
                gridColumn: '1 / -1',
                padding: '3rem',
                textAlign: 'center',
                color: 'var(--color-text-tertiary)',
              }}
            >
              No roles currently listed in this category. Check back soon or view all jobs.
            </div>
          )}
        </div>

        {/* Bottom CTA Link */}
        <div style={{ textAlign: 'center' }}>
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
        </div>
      </div>
    </section>
  );
};
