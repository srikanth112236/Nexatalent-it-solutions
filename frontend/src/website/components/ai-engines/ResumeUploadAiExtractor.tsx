import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { UploadCloud, FileText, CheckCircle, Edit3, Save, Sparkles, RefreshCw } from 'lucide-react';

interface ExtractedProfile {
  name: string;
  email: string;
  phone: string;
  location: string;
  preferredLocations: string;
  currentRole: string;
  totalExperience: string;
  currentCompany: string;
  pastCompanies: string;
  technicalSkills: string;
  softSkills: string;
  education: string;
  certifications: string;
  keyProjects: string;
  currentCTC: string;
  expectedCTC: string;
  noticePeriod: string;
  employmentType: string;
}

const DEFAULT_EXTRACTED: ExtractedProfile = {
  name: 'Vikramaditya Sharma',
  email: 'vikram.sharma.dev@gmail.com',
  phone: '+91 98450 12890',
  location: 'Bangalore, Karnataka',
  preferredLocations: 'Bangalore, Hyderabad, Remote',
  currentRole: 'Senior Lead Java / Cloud Backend Engineer',
  totalExperience: '6.5 Years',
  currentCompany: 'Apex Fintech Solutions India Pvt Ltd',
  pastCompanies: 'Infosys Ltd (Finacle R&D), ThoughtWorks',
  technicalSkills: 'Java 17, Spring Boot, Spring Cloud, Kafka, Docker, Kubernetes, AWS EKS, PostgreSQL, Redis, Microservices',
  softSkills: 'Team Mentorship, Cross-Functional Agile Leadership, Architecture Documentation, Client Sprint Reviews',
  education: 'B.Tech in Computer Science & Engineering (VTU Bangalore, 2018 - 8.4 CGPA)',
  certifications: 'AWS Certified Solutions Architect – Associate (2023), Oracle Certified Professional Java SE 11',
  keyProjects: 'High-throughput payment gateway processing 14k transactions/sec with 99.995% SLA; Kafka-based audit ledger system.',
  currentCTC: '₹16,50,000 PA (₹16.5 LPA)',
  expectedCTC: '₹22,00,000 PA (₹22 LPA)',
  noticePeriod: '15 Days (Serving Notice Period / Immediate Joiner)',
  employmentType: 'Full-Time Permanent / Contract-to-Hire'
};

export function ResumeUploadAiExtractor({ maxSizeMB = 15 }: { maxSizeMB?: number }) {
  const [file, setFile] = useState<{ name: string; size: string } | null>({
    name: 'Vikram_Sharma_Senior_Java_Lead_2026.pdf',
    size: '1.4 MB'
  });
  const [isParsing, setIsParsing] = useState(false);
  const [isExtracted, setIsExtracted] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<ExtractedProfile>(DEFAULT_EXTRACTED);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (!uploadedFile) return;

    if (uploadedFile.size > maxSizeMB * 1024 * 1024) {
      alert(`File size exceeds maximum allowed size of ${maxSizeMB}MB`);
      return;
    }

    setFile({
      name: uploadedFile.name,
      size: `${(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB`
    });

    setIsParsing(true);
    setIsExtracted(false);

    setTimeout(() => {
      setIsParsing(false);
      setIsExtracted(true);
    }, 1200);
  };

  const handleSave = () => {
    setIsEditing(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <section className="w-full py-16 px-4 sm:px-6 lg:px-8 bg-white text-slate-900 border-b border-slate-200">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 mb-3 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>AI RESUME PARSER & PROFILE SYNCHRONIZATION</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-slate-950 mb-3">
            Instant CV Upload & 14-Entity Extraction
          </h2>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Upload your resume in PDF, DOC, or DOCX format. Nexa AI reads your skills, past employers, compensation, and notice timeline to assemble your complete verified candidate profile.
          </p>
        </motion.div>

        {/* Upload Dropzone */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-slate-50 border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-2xl p-6 sm:p-10 text-center transition-all shadow-sm mb-8"
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".pdf,.doc,.docx"
            className="hidden"
          />
          <div className="max-w-md mx-auto flex flex-col items-center">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-700 mb-4 shadow-sm">
              <UploadCloud className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              Drag & Drop your Resume or Click to Browse
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Supported Formats: PDF, DOC, DOCX • Configured Max Size: <strong>{maxSizeMB} MB</strong>
            </p>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm transition-all shadow-md active:scale-95"
            >
              <FileText className="w-4 h-4" />
              <span>Select Resume File</span>
            </button>

            {file && (
              <div className="mt-4 flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-700 shadow-sm">
                <FileText className="w-4 h-4 text-emerald-600" />
                <span className="font-bold text-slate-900 truncate max-w-[200px] sm:max-w-xs">{file.name}</span>
                <span className="text-slate-500">({file.size})</span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Loading Spinner */}
        {isParsing && (
          <div className="p-8 text-center bg-slate-50 border border-emerald-200 rounded-2xl shadow-sm">
            <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin mx-auto mb-3" />
            <h4 className="text-base font-bold text-slate-900 mb-1">Parsing Resume Entities...</h4>
            <p className="text-xs text-slate-600">
              Extracting technical skills, compensation history, projects, and notice constraints with NLP accuracy.
            </p>
          </div>
        )}

        {/* Extracted Profile Form */}
        {isExtracted && !isParsing && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xl shadow-slate-200/50 relative"
          >
            {/* Banner: "We've created your Nexa Talent Profile using your resume" */}
            <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-bold text-emerald-950">
                    We've created your NexaTalent IT Solutions Profile using your resume.
                  </h4>
                  <p className="text-xs text-emerald-800">
                    Everything extracted below is 100% editable. Review your details to ensure maximum AI match score.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {isEditing ? (
                  <button
                    type="button"
                    onClick={handleSave}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all shadow-sm"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Changes</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs border border-slate-300 transition-all"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Edit Profile</span>
                  </button>
                )}
              </div>
            </div>

            {savedSuccess && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-100 text-emerald-900 text-xs font-bold flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-700" />
                <span>Profile details successfully updated and re-indexed into Nexa Match Engine!</span>
              </div>
            )}

            {/* 14 Fields Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <label className="text-slate-500 block mb-1 font-semibold">1. Candidate Full Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900"
                  />
                ) : (
                  <span className="font-bold text-slate-950 text-sm">{profile.name}</span>
                )}
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <label className="text-slate-500 block mb-1 font-semibold">2. Email & Phone</label>
                {isEditing ? (
                  <div className="flex flex-col gap-1">
                    <input
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-slate-900 text-xs"
                    />
                    <input
                      type="text"
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-slate-900 text-xs"
                    />
                  </div>
                ) : (
                  <div>
                    <div className="font-bold text-slate-900">{profile.email}</div>
                    <div className="text-slate-500">{profile.phone}</div>
                  </div>
                )}
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <label className="text-slate-500 block mb-1 font-semibold">3. Primary Role / Title</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profile.currentRole}
                    onChange={(e) => setProfile({ ...profile, currentRole: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900"
                  />
                ) : (
                  <span className="font-bold text-emerald-700">{profile.currentRole}</span>
                )}
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <label className="text-slate-500 block mb-1 font-semibold">4. Total Experience</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profile.totalExperience}
                    onChange={(e) => setProfile({ ...profile, totalExperience: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900"
                  />
                ) : (
                  <span className="font-bold text-slate-900">{profile.totalExperience}</span>
                )}
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <label className="text-slate-500 block mb-1 font-semibold">5. Current Employer</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profile.currentCompany}
                    onChange={(e) => setProfile({ ...profile, currentCompany: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900"
                  />
                ) : (
                  <span className="text-slate-800 font-semibold">{profile.currentCompany}</span>
                )}
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <label className="text-slate-500 block mb-1 font-semibold">6. Past Companies</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profile.pastCompanies}
                    onChange={(e) => setProfile({ ...profile, pastCompanies: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900"
                  />
                ) : (
                  <span className="text-slate-700">{profile.pastCompanies}</span>
                )}
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <label className="text-slate-500 block mb-1 font-semibold">7. Current & Preferred Location</label>
                {isEditing ? (
                  <div className="flex flex-col gap-1">
                    <input
                      type="text"
                      value={profile.location}
                      onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                      className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-slate-900"
                    />
                    <input
                      type="text"
                      value={profile.preferredLocations}
                      onChange={(e) => setProfile({ ...profile, preferredLocations: e.target.value })}
                      className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-slate-900"
                    />
                  </div>
                ) : (
                  <div>
                    <div className="font-bold text-slate-900">{profile.location}</div>
                    <div className="text-slate-500">Prefers: {profile.preferredLocations}</div>
                  </div>
                )}
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <label className="text-slate-500 block mb-1 font-semibold">8. Current & Expected CTC</label>
                {isEditing ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={profile.currentCTC}
                      onChange={(e) => setProfile({ ...profile, currentCTC: e.target.value })}
                      className="w-1/2 bg-white border border-slate-300 rounded px-2 py-1 text-slate-900"
                    />
                    <input
                      type="text"
                      value={profile.expectedCTC}
                      onChange={(e) => setProfile({ ...profile, expectedCTC: e.target.value })}
                      className="w-1/2 bg-white border border-slate-300 rounded px-2 py-1 text-slate-900"
                    />
                  </div>
                ) : (
                  <div>
                    <span className="text-slate-500">Current: {profile.currentCTC}</span>
                    <span className="block font-black text-emerald-700 text-sm">Target: {profile.expectedCTC}</span>
                  </div>
                )}
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <label className="text-slate-500 block mb-1 font-semibold">9. Notice Period</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profile.noticePeriod}
                    onChange={(e) => setProfile({ ...profile, noticePeriod: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900"
                  />
                ) : (
                  <span className="font-bold text-amber-700">{profile.noticePeriod}</span>
                )}
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 sm:col-span-2">
                <label className="text-slate-500 block mb-1 font-semibold">10. Technical Skills</label>
                {isEditing ? (
                  <textarea
                    rows={2}
                    value={profile.technicalSkills}
                    onChange={(e) => setProfile({ ...profile, technicalSkills: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-900"
                  />
                ) : (
                  <div className="flex flex-wrap gap-1.5">
                    {profile.technicalSkills.split(',').map((sk, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200">
                        {sk.trim()}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <label className="text-slate-500 block mb-1 font-semibold">11. Soft Skills</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profile.softSkills}
                    onChange={(e) => setProfile({ ...profile, softSkills: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900"
                  />
                ) : (
                  <span className="text-slate-700">{profile.softSkills}</span>
                )}
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <label className="text-slate-500 block mb-1 font-semibold">12. Formal Education</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profile.education}
                    onChange={(e) => setProfile({ ...profile, education: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900"
                  />
                ) : (
                  <span className="text-slate-800 font-medium">{profile.education}</span>
                )}
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <label className="text-slate-500 block mb-1 font-semibold">13. Certifications</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profile.certifications}
                    onChange={(e) => setProfile({ ...profile, certifications: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900"
                  />
                ) : (
                  <span className="text-slate-700">{profile.certifications}</span>
                )}
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <label className="text-slate-500 block mb-1 font-semibold">14. Key Projects & Systems</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profile.keyProjects}
                    onChange={(e) => setProfile({ ...profile, keyProjects: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900"
                  />
                ) : (
                  <span className="text-slate-700">{profile.keyProjects}</span>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
