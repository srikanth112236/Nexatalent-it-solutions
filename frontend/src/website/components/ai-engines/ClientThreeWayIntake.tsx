import { useState } from 'react';
import { motion } from 'framer-motion';
import { FormInput, UploadCloud, MessageSquare, Sparkles, CheckCircle2, ArrowRight, FileText, Send } from 'lucide-react';

export function ClientThreeWayIntake() {
  const [activeTab, setActiveTab] = useState<'form' | 'jd' | 'prompt'>('prompt');
  const [submitted, setSubmitted] = useState(false);

  // Form State (Option A)
  const [formData, setFormData] = useState({
    role: 'Senior Microservices Developer',
    openings: '3',
    experience: '5-7 Years',
    skills: 'Java, Spring Boot, Microservices, Kafka',
    location: 'Bangalore / Hybrid',
    budget: '₹18–22 LPA',
    notice: 'Under 15 Days'
  });

  // JD State (Option B)
  const [jdFile] = useState<string | null>('Senior_Java_Lead_JD_v2.docx');

  // Prompt State (Option C)
  const [aiPrompt, setAiPrompt] = useState(
    'I need 10 Python developers for Pune. 3–5 years experience. Immediate joiners preferred.'
  );
  const [promptParsing, setPromptParsing] = useState(false);
  const [aiParsedOutput, setAiParsedOutput] = useState<{
    role: string;
    openings: number;
    location: string;
    experience: string;
    notice: string;
  } | null>({
    role: 'Python Backend Developer / API Engineer',
    openings: 10,
    location: 'Pune, Maharashtra (On-site / Hybrid)',
    experience: '3–5 Years',
    notice: 'Immediate Joiner (0–15 Days preferred)'
  });

  const handlePromptAnalyze = () => {
    setPromptParsing(true);
    setTimeout(() => {
      setPromptParsing(false);
      setAiParsedOutput({
        role: aiPrompt.toLowerCase().includes('python') ? 'Python Backend Developer' : 'Software Engineer',
        openings: 10,
        location: 'Pune, Maharashtra',
        experience: '3–5 Years',
        notice: 'Immediate Joiner (0–15 Days preferred)'
      });
    }, 700);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <section id="post-requirement-section" className="w-full py-16 px-4 sm:px-6 lg:px-8 bg-slate-50 text-slate-900 border-b border-slate-200">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 mb-3 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>3-WAY CLIENT REQUISITION INTAKE</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-slate-950 mb-3">
            + Submit Hiring Requirement in Seconds
          </h2>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Choose your preferred hiring submission workflow. Nexa accepts structured forms, raw JD documents, or conversational voice-to-text natural language prompts.
          </p>
        </motion.div>

        {/* 3 Modality Tabs */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex p-1.5 rounded-2xl bg-white border border-slate-200 shadow-sm">
            <button
              type="button"
              onClick={() => setActiveTab('prompt')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'prompt'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Option C: Tell AI Naturally</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('jd')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'jd'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <UploadCloud className="w-4 h-4" />
              <span>Option B: Upload JD</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('form')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'form'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FormInput className="w-4 h-4" />
              <span>Option A: Fill a Form</span>
            </button>
          </div>
        </div>

        {/* Content Box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xl shadow-slate-200/50 relative"
        >
          {submitted && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-200 text-xs sm:text-sm font-bold flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <div>
                Hiring requirement dispatched! Nexa AI has indexed the requisition and initiated database matching.
              </div>
            </div>
          )}

          {/* OPTION C: Conversational AI Prompt */}
          {activeTab === 'prompt' && (
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 mb-2">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>CONVERSATIONAL HIRING INTAKE</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">
                Simply Tell Nexa AI What You Need
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                Type or paste your casual hiring need. For example: “I need 10 Python developers for Pune. 3–5 years experience. Immediate joiners preferred.”
              </p>

              <div className="relative mb-4">
                <textarea
                  rows={3}
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 transition-all resize-none font-medium"
                  placeholder="Describe your headcount need here..."
                />
                <button
                  type="button"
                  onClick={handlePromptAnalyze}
                  disabled={promptParsing}
                  className="absolute bottom-3 right-3 px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{promptParsing ? 'Parsing...' : 'Analyze & Convert'}</span>
                </button>
              </div>

              {aiParsedOutput && (
                <div className="p-4 rounded-xl bg-slate-50 border border-emerald-200 mb-6">
                  <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider block mb-2">
                    ✓ AI Generated Structured Requisition:
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div>
                      <span className="text-slate-500 block">Role</span>
                      <strong className="text-slate-900">{aiParsedOutput.role}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Openings</span>
                      <strong className="text-emerald-700">{aiParsedOutput.openings} positions</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Location</span>
                      <strong className="text-slate-900">{aiParsedOutput.location}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Experience / Notice</span>
                      <strong className="text-amber-700">{aiParsedOutput.experience} • {aiParsedOutput.notice}</strong>
                    </div>
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={handleSubmit}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-xl shadow-emerald-600/20 active:scale-95 transition-all"
              >
                <span>Confirm & Activate 10 Openings</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* OPTION B: Upload JD */}
          {activeTab === 'jd' && (
            <div className="text-center py-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 mx-auto mb-3">
                <UploadCloud className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">
                Upload Existing Job Description Document
              </h3>
              <p className="text-xs text-slate-500 mb-4 max-w-md mx-auto">
                Upload your company's JD in PDF or DOCX format. Nexa AI parses the responsibilities, tech stacks, and team levels automatically.
              </p>

              {jdFile && (
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 mb-6">
                  <FileText className="w-4 h-4 text-emerald-600" />
                  <span className="font-bold text-slate-900">{jdFile}</span>
                  <span className="text-emerald-700 font-bold">✓ Parsed (Java, Spring, Microservices, 5 Openings)</span>
                </div>
              )}

              <div>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-xl active:scale-95"
                >
                  <span>Dispatch Parsed Requisition to Matching Engine</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* OPTION A: Traditional Form */}
          {activeTab === 'form' && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-slate-600 mb-1 font-semibold">Job Title / Designation</label>
                  <input
                    type="text"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1 font-semibold">Number of Openings</label>
                  <input
                    type="number"
                    value={formData.openings}
                    onChange={(e) => setFormData({ ...formData, openings: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1 font-semibold">Experience Required</label>
                  <input
                    type="text"
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1 font-semibold">Hiring Location / Work Mode</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1 font-semibold">Mandatory Core Skills</label>
                  <input
                    type="text"
                    value={formData.skills}
                    onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1 font-semibold">Budget / Target CTC</label>
                  <input
                    type="text"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-xl active:scale-95"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Requirement to Talent Pool</span>
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}
