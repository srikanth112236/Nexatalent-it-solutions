import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Target, Sparkles, MapPin, IndianRupee, Clock, Building, ChevronRight } from 'lucide-react';

interface MatchedJob {
  id: string;
  title: string;
  companyCategory: string;
  location: string;
  salary: string;
  experience: string;
  workMode: string;
  matchPercentage: number;
  skills: string[];
  openings: number;
  postedDaysAgo: number;
}

const JOBS_FOR_ME: MatchedJob[] = [
  {
    id: 'JOB-901',
    title: 'Senior Java Developer / Spring Boot Microservices',
    companyCategory: 'Tier-1 Global Investment Bank & GCC',
    location: 'Bangalore, Karnataka',
    salary: '₹16–20 LPA',
    experience: '5–8 Years',
    workMode: 'Hybrid (3 days office)',
    matchPercentage: 94,
    skills: ['Java 17', 'Spring Boot', 'Microservices', 'Kafka', 'PostgreSQL'],
    openings: 5,
    postedDaysAgo: 1
  },
  {
    id: 'JOB-902',
    title: 'Lead Microservices & Cloud Architect',
    companyCategory: 'High-Growth Fintech Payments Unicorn',
    location: 'Hyderabad, Telangana',
    salary: '₹24–30 LPA',
    experience: '7–10 Years',
    workMode: 'Hybrid / Flexible',
    matchPercentage: 92,
    skills: ['Java', 'Spring Cloud', 'Kubernetes', 'AWS EKS', 'Redis'],
    openings: 2,
    postedDaysAgo: 2
  },
  {
    id: 'JOB-903',
    title: 'Backend Developer (Java & Distributed Systems)',
    companyCategory: 'Enterprise SaaS & Cloud Infrastructure',
    location: 'Mumbai, Maharashtra',
    salary: '₹14–18 LPA',
    experience: '3–6 Years',
    workMode: 'Hybrid / Remote Friendly',
    matchPercentage: 88,
    skills: ['Core Java', 'REST APIs', 'Docker', 'MySQL', 'MongoDB'],
    openings: 4,
    postedDaysAgo: 3
  },
  {
    id: 'JOB-904',
    title: 'Fullstack Java & React Systems Engineer',
    companyCategory: 'Healthcare AI & Digital Therapeutics',
    location: 'Pune, Maharashtra',
    salary: '₹15–20 LPA',
    experience: '4–7 Years',
    workMode: 'Hybrid',
    matchPercentage: 86,
    skills: ['Java 17', 'React', 'TypeScript', 'Spring Boot', 'GCP'],
    openings: 3,
    postedDaysAgo: 4
  }
];

export function JobsForMeAiStream() {
  return (
    <section className="w-full py-16 px-4 sm:px-6 lg:px-8 bg-white text-slate-900 border-b border-slate-200">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 mb-2 shadow-sm">
              <Target className="w-3.5 h-3.5 text-emerald-600" />
              <span>AI CONTINUOUS PROFILE-TO-REQUISITION MATCHING</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-slate-950">
              🎯 “Jobs For Me” — AI Curated Mandates
            </h2>
            <p className="text-sm text-slate-600 mt-1 max-w-xl leading-relaxed">
              You never have to scroll hundreds of irrelevant job postings. Nexa AI indexes verified enterprise requisitions and ranks them by salary parity, skills overlap, and notice compatibility.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-600 font-semibold bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
            <span>4 Direct Matches Found for Vikram S.</span>
          </div>
        </div>

        {/* Jobs Feed Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {JOBS_FOR_ME.map((job, idx) => {
            return (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
                className="bg-slate-50/70 border border-slate-200 hover:border-emerald-500 rounded-2xl p-6 transition-all hover:shadow-xl shadow-sm flex flex-col justify-between"
              >
                <div>
                  {/* Top Bar: Match pill + Posted */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-200">
                      <Sparkles className="w-3 h-3 text-emerald-600" />
                      AI Match {job.matchPercentage}%
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium">
                      {job.postedDaysAgo === 1 ? 'Posted yesterday' : `Posted ${job.postedDaysAgo}d ago`} • {job.openings} Openings
                    </span>
                  </div>

                  {/* Title & Category */}
                  <h3 className="text-lg font-bold text-slate-900 mb-1">{job.title}</h3>
                  <div className="text-xs text-slate-600 flex items-center gap-1.5 mb-4 font-medium">
                    <Building className="w-3.5 h-3.5 text-slate-400" />
                    <span>{job.companyCategory}</span>
                  </div>

                  {/* Key Metadata Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mb-4 text-xs">
                    <div className="p-2.5 rounded-xl bg-white border border-slate-200 flex items-center gap-2 shadow-xs">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span className="truncate font-semibold text-slate-800">{job.location.split(',')[0]}</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white border border-slate-200 flex items-center gap-2 shadow-xs">
                      <IndianRupee className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="font-bold text-emerald-700">{job.salary}</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white border border-slate-200 flex items-center gap-2 col-span-2 sm:col-span-1 shadow-xs">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-semibold text-slate-700">{job.experience}</span>
                    </div>
                  </div>

                  {/* Skills tags */}
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {job.skills.map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className="text-[11px] px-2.5 py-0.5 rounded-lg bg-white text-slate-700 border border-slate-200 font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Action */}
                <div className="pt-4 border-t border-slate-200/80 flex items-center justify-between gap-3">
                  <div className="text-[11px] text-slate-600 font-medium">
                    Work Mode: <strong className="text-slate-900">{job.workMode}</strong>
                  </div>
                  <Link
                    to={`/jobs/${job.id}`}
                    className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 bg-[#0265FF] hover:bg-[#004FBF] text-white shadow-blue-600/20 text-decoration-none"
                  >
                    <span>View Mandate & Apply</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
