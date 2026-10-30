import {
  Edit3,
  Mail,
  Phone,
  MapPin,
  Globe,
  Linkedin,
  Github,
  ExternalLink,
  Briefcase,
  GraduationCap,
  Code2,
  Award,
  FolderGit2,
  SlidersHorizontal,
  FileText,
  Download,
  CheckCircle2,
  ShieldCheck,
  Eye,
  Sparkles,
} from 'lucide-react';

export interface CandidateProfilePreviewProps {
  profile: any;
  matchScore: number;
  onEdit: () => void;
  navigate: (path: string) => void;
  fmtDate: (val: any) => string;
}

export function CandidateProfilePreview({
  profile,
  matchScore,
  onEdit,
  navigate,
  fmtDate,
}: CandidateProfilePreviewProps) {
  const asArray = (val: any): any[] => (Array.isArray(val) ? val : []);

  const candidateName = profile?.name || profile?.email?.split('@')[0] || 'Candidate';
  const headline = profile?.headline || profile?.roleTitle || 'Tech Professional';
  const location = [profile?.location, profile?.country].filter(Boolean).join(', ') || 'Remote';

  const experiences = asArray(profile?.experiences);
  const educations = asArray(profile?.educations);
  const skills = asArray(profile?.skillLevels);
  const certifications = asArray(profile?.certList);
  const projects = asArray(profile?.projectList);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((n) => n[0].toUpperCase())
      .join('');
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-150 text-slate-800">
      {/* Top Profile Card / Executive Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm relative overflow-hidden">
        {/* Subtle decorative background bar */}
        <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900" />

        <div className="relative pt-12 flex flex-col sm:flex-row sm:items-end justify-between gap-5">
          {/* Avatar & Main Info */}
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 sm:gap-5">
            <div className="relative shrink-0">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-tr from-[#0B5FD9] to-indigo-600 text-white font-black text-2xl sm:text-3xl flex items-center justify-center shadow-lg border-4 border-white">
                {getInitials(candidateName) || 'NX'}
              </div>
              <div
                className="absolute bottom-1 right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-white"
                title="Verified Candidate"
              >
                <CheckCircle2 size={14} />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                  {candidateName}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-extrabold text-[11px] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>Open to Offers</span>
                </span>
                {profile?.resumeRef && (
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-[#0B5FD9] border border-blue-200 font-extrabold text-[11px] flex items-center gap-1">
                    <ShieldCheck size={12} />
                    <span>CV Verified</span>
                  </span>
                )}
              </div>

              <p className="text-sm font-semibold text-slate-700 max-w-2xl">{headline}</p>

              <div className="flex items-center gap-3 pt-1 flex-wrap text-xs text-slate-500 font-medium">
                {location && (
                  <span className="flex items-center gap-1">
                    <MapPin size={13} className="text-slate-400" />
                    <span>{location}</span>
                  </span>
                )}
                {profile?.email && (
                  <span className="flex items-center gap-1">
                    <Mail size={13} className="text-slate-400" />
                    <span>{profile.email}</span>
                  </span>
                )}
                {profile?.phone && (
                  <span className="flex items-center gap-1">
                    <Phone size={13} className="text-slate-400" />
                    <span>{profile.phone}</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Action: Edit Profile & Strength */}
          <div className="flex items-center gap-2.5 self-start sm:self-auto shrink-0 flex-wrap">
            <span className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 font-extrabold text-xs border border-slate-200 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>{matchScore}% Profile Strength</span>
            </span>
            <button
              type="button"
              onClick={onEdit}
              className="px-5 py-2.5 rounded-xl bg-[#0B5FD9] hover:bg-blue-600 text-white font-extrabold text-xs shadow-md shadow-blue-500/20 transition flex items-center gap-2 cursor-pointer"
            >
              <Edit3 size={15} />
              <span>Edit Profile</span>
            </button>
          </div>
        </div>

        {/* Social / Portfolio Links Row */}
        {(profile?.linkedin || profile?.github || profile?.portfolio || profile?.codeSamples) && (
          <div className="mt-5 pt-4 border-t border-slate-100 flex items-center gap-3 flex-wrap">
            {profile?.linkedin && (
              <a
                href={profile.linkedin.startsWith('http') ? profile.linkedin : `https://${profile.linkedin}`}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-600 border border-slate-200 font-bold text-xs flex items-center gap-1.5 transition"
              >
                <Linkedin size={13} className="text-[#0a66c2]" />
                <span>LinkedIn Profile</span>
                <ExternalLink size={11} className="opacity-60" />
              </a>
            )}
            {profile?.github && (
              <a
                href={profile.github.startsWith('http') ? profile.github : `https://${profile.github}`}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-200 font-bold text-xs flex items-center gap-1.5 transition"
              >
                <Github size={13} />
                <span>GitHub Repos</span>
                <ExternalLink size={11} className="opacity-60" />
              </a>
            )}
            {profile?.portfolio && (
              <a
                href={profile.portfolio.startsWith('http') ? profile.portfolio : `https://${profile.portfolio}`}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 border border-slate-200 font-bold text-xs flex items-center gap-1.5 transition"
              >
                <Globe size={13} className="text-emerald-600" />
                <span>Portfolio Website</span>
                <ExternalLink size={11} className="opacity-60" />
              </a>
            )}
            {profile?.codeSamples && (
              <a
                href={profile.codeSamples.startsWith('http') ? profile.codeSamples : `https://${profile.codeSamples}`}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-purple-50 text-slate-700 hover:text-purple-700 border border-slate-200 font-bold text-xs flex items-center gap-1.5 transition"
              >
                <ExternalLink size={13} className="text-purple-600" />
                <span>Work / Code Samples</span>
              </a>
            )}
          </div>
        )}
      </div>

      {/* Main Grid: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left Column (2 Cols): Bio, Experience, Education, Projects */}
        <div className="lg:col-span-2 space-y-5">
          {/* Professional Summary & Bio */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <Sparkles size={16} className="text-[#0B5FD9]" />
                <span>Professional Summary & Objectives</span>
              </h3>
              <button
                type="button"
                onClick={onEdit}
                className="text-slate-400 hover:text-[#0B5FD9] transition p-1"
                title="Edit Summary"
              >
                <Edit3 size={14} />
              </button>
            </div>

            {profile?.summary ? (
              <p className="text-xs text-slate-700 leading-relaxed font-normal whitespace-pre-line">
                {profile.summary}
              </p>
            ) : (
              <p className="text-xs text-slate-400 italic font-medium">
                No professional summary provided. Click edit to add your career pitch.
              </p>
            )}

            {profile?.objectives && (
              <div className="mt-3 pt-3 border-t border-slate-100">
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Career Objectives
                </div>
                <p className="text-xs text-slate-700 leading-relaxed font-normal whitespace-pre-line">
                  {profile.objectives}
                </p>
              </div>
            )}
          </div>

          {/* Work Experience */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <Briefcase size={16} className="text-indigo-600" />
                <span>Work Experience</span>
              </h3>
              <button
                type="button"
                onClick={onEdit}
                className="text-xs font-bold text-[#0B5FD9] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Edit3 size={13} />
                <span>Edit Roles</span>
              </button>
            </div>

            {experiences.length === 0 ? (
              <div className="text-center py-6 text-xs text-slate-400 font-medium">
                No work history added yet. Click edit to list your previous employment.
              </div>
            ) : (
              <div className="space-y-4 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-100">
                {experiences.map((exp: any, i: number) => (
                  <div key={i} className="relative flex items-start gap-4">
                    <div className="w-7 h-7 rounded-full bg-indigo-50 border-2 border-white text-indigo-600 flex items-center justify-center shrink-0 z-10 shadow-xs">
                      <Briefcase size={13} />
                    </div>

                    <div className="flex-1 bg-slate-50/80 p-4 rounded-2xl border border-slate-200/80 space-y-2">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <div>
                          <h4 className="font-extrabold text-sm text-slate-900">
                            {exp.designation || 'Designation'}
                          </h4>
                          <div className="text-xs font-bold text-indigo-700">
                            {exp.employer || 'Company'}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {exp.employmentType && (
                            <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[10px] font-bold text-slate-600">
                              {exp.employmentType}
                            </span>
                          )}
                          <span className="text-xs font-bold text-slate-500">
                            {exp.startDate || '—'} – {exp.current ? 'Present' : exp.endDate || '—'}
                          </span>
                        </div>
                      </div>

                      {exp.responsibilities && (
                        <p className="text-xs text-slate-600 whitespace-pre-line leading-relaxed">
                          {exp.responsibilities}
                        </p>
                      )}

                      {exp.achievements && (
                        <div className="text-xs text-slate-700 bg-white p-2.5 rounded-xl border border-slate-200/80 font-medium">
                          <strong className="text-emerald-700 font-bold block mb-0.5">
                            Key Achievements:
                          </strong>
                          {exp.achievements}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Education & Qualifications */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <GraduationCap size={16} className="text-emerald-600" />
                <span>Education & Qualifications</span>
              </h3>
              <button
                type="button"
                onClick={onEdit}
                className="text-xs font-bold text-[#0B5FD9] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Edit3 size={13} />
                <span>Edit Education</span>
              </button>
            </div>

            {educations.length === 0 ? (
              <div className="text-center py-6 text-xs text-slate-400 font-medium">
                No education history added yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {educations.map((edu: any, i: number) => (
                  <div
                    key={i}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5"
                  >
                    <div className="font-extrabold text-xs text-slate-900">
                      {edu.qualification || 'Degree'}
                    </div>
                    <div className="text-xs font-bold text-emerald-700">
                      {edu.institution || 'University'}
                    </div>
                    {edu.specialization && (
                      <div className="text-[11px] text-slate-500 font-medium">
                        Major: {edu.specialization}
                      </div>
                    )}
                    {(edu.startDate || edu.endDate || edu.gradYear) && (
                      <div className="text-[10px] text-slate-400 font-bold">
                        {edu.gradYear ? `Graduated ${edu.gradYear}` : `${edu.startDate || ''} – ${edu.endDate || ''}`}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Projects & Portfolio */}
          {projects.length > 0 && (
            <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                  <FolderGit2 size={16} className="text-purple-600" />
                  <span>Featured Projects & Portfolio</span>
                </h3>
                <button
                  type="button"
                  onClick={onEdit}
                  className="text-xs font-bold text-[#0B5FD9] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Edit3 size={13} />
                  <span>Edit Projects</span>
                </button>
              </div>

              <div className="space-y-3">
                {projects.map((proj: any, i: number) => (
                  <div key={i} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="font-extrabold text-xs text-slate-900">{proj.name}</div>
                      {proj.role && (
                        <span className="text-[11px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-lg border border-purple-200">
                          {proj.role}
                        </span>
                      )}
                    </div>
                    {proj.description && (
                      <p className="text-xs text-slate-600 leading-relaxed font-normal">
                        {proj.description}
                      </p>
                    )}
                    {proj.stack && (
                      <div className="flex items-center gap-1 flex-wrap pt-1">
                        {String(proj.stack)
                          .split(',')
                          .map((s) => (
                            <span
                              key={s}
                              className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[10px] font-bold text-slate-600"
                            >
                              {s.trim()}
                            </span>
                          ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column (1 Col): Preferences, Skills, Resume & Visibility */}
        <div className="space-y-5">
          {/* Resume Card */}
          <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <h4 className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
                <FileText size={15} className="text-emerald-600" />
                <span>Candidate Resume</span>
              </h4>
              <button
                type="button"
                onClick={() => navigate('/candidate/docs')}
                className="text-[11px] font-bold text-blue-600 hover:underline cursor-pointer"
              >
                Documents
              </button>
            </div>

            {profile?.resumeRef ? (
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 truncate">
                    <CheckCircle2 size={15} className="text-emerald-500 shrink-0" />
                    <span className="font-bold text-xs text-slate-800 truncate">
                      Resume v{profile.resumeVersion || 1}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Active
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 font-medium">
                  Updated {fmtDate(profile.resumeUploadedAt || new Date().toISOString())}
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <a
                    href={`/api/v1/documents/${profile.resumeRef}/download`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 py-1.5 px-3 rounded-xl bg-white border border-slate-200 hover:border-slate-300 text-slate-700 font-bold text-xs flex items-center justify-center gap-1 transition shadow-2xs"
                  >
                    <Download size={13} />
                    <span>Download</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => navigate('/candidate/docs')}
                    className="flex-1 py-1.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition cursor-pointer"
                  >
                    <span>Replace</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-center space-y-2">
                <p className="text-xs font-bold text-amber-900">No resume attached</p>
                <button
                  type="button"
                  onClick={() => navigate('/candidate/docs')}
                  className="px-4 py-2 rounded-xl bg-amber-600 text-white font-bold text-xs cursor-pointer"
                >
                  Upload Resume
                </button>
              </div>
            )}
          </div>

          {/* Job & Compensation Preferences */}
          <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <h4 className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
                <SlidersHorizontal size={15} className="text-blue-600" />
                <span>Job Preferences</span>
              </h4>
              <button
                type="button"
                onClick={onEdit}
                className="text-[11px] font-bold text-blue-600 hover:underline cursor-pointer"
              >
                Edit
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              <div>
                <span className="text-[11px] font-bold text-slate-400 block mb-0.5">
                  Target Roles:
                </span>
                <span className="font-bold text-slate-800">
                  {profile?.jobPreferences?.roles || profile?.roleTitle || 'Any Tech Role'}
                </span>
              </div>

              <div>
                <span className="text-[11px] font-bold text-slate-400 block mb-0.5">
                  Work Arrangement:
                </span>
                <span className="inline-block px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-700 font-bold capitalize text-[11px]">
                  {profile?.workArrangement || profile?.jobPreferences?.workArrangement || 'Remote / Hybrid'}
                </span>
              </div>

              <div>
                <span className="text-[11px] font-bold text-slate-400 block mb-0.5">
                  Preferred Locations:
                </span>
                <span className="font-semibold text-slate-700">
                  {profile?.jobPreferences?.locations || 'Worldwide / India'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 block">Current CTC</span>
                  <span className="font-bold text-slate-700">
                    {profile?.currentCtc || 'Not specified'}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 block">Expected CTC</span>
                  <span className="font-extrabold text-emerald-700">
                    {profile?.expectedCtc || 'Negotiable'}
                  </span>
                </div>
              </div>

              <div className="pt-1 border-t border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 block">Notice Period</span>
                <span className="font-bold text-slate-800">
                  {profile?.noticePeriod || profile?.jobPreferences?.availability || 'Immediate / 30 Days'}
                </span>
              </div>
            </div>
          </div>

          {/* Technical Skills */}
          <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <h4 className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
                <Code2 size={15} className="text-indigo-600" />
                <span>Technical Skills ({skills.length})</span>
              </h4>
              <button
                type="button"
                onClick={onEdit}
                className="text-[11px] font-bold text-blue-600 hover:underline cursor-pointer"
              >
                Edit
              </button>
            </div>

            {skills.length === 0 ? (
              <p className="text-xs text-slate-400 font-medium">No skills added yet.</p>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {skills.map((s: any, i: number) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 flex items-center gap-1.5"
                  >
                    <span>{s.skill}</span>
                    {s.level && (
                      <span className="text-[10px] font-extrabold text-[#0B5FD9] bg-blue-50 px-1 rounded">
                        {s.level[0]}
                      </span>
                    )}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Certifications */}
          {certifications.length > 0 && (
            <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <h4 className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
                  <Award size={15} className="text-amber-600" />
                  <span>Certifications</span>
                </h4>
                <button
                  type="button"
                  onClick={onEdit}
                  className="text-[11px] font-bold text-blue-600 hover:underline cursor-pointer"
                >
                  Edit
                </button>
              </div>

              <div className="space-y-2">
                {certifications.map((c: any, i: number) => (
                  <div key={i} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                    <div className="font-extrabold text-slate-800">{c.name}</div>
                    <div className="text-[11px] text-amber-700 font-bold">{c.issuer}</div>
                    {c.issueDate && (
                      <div className="text-[10px] text-slate-400">Issued {c.issueDate}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Profile Visibility Badge */}
          <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Eye size={14} className="text-slate-500" />
                <span>Search Visibility</span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-extrabold text-[10px] capitalize">
                {profile?.visibility || 'Standard'}
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              {profile?.visibility === 'open'
                ? 'Your profile is actively promoted to verified recruiters.'
                : 'Profile appears in candidate searches matching your skills.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
