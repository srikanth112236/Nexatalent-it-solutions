import { useState, useEffect, useRef } from 'react';
import { FileText, Download, ExternalLink, X, RefreshCw, AlertCircle } from 'lucide-react';
import { salesApi, applicationsApi } from '../enterprise/phaseApi';

export interface PdfResumeViewerModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  filename?: string;
  leadId?: string;
  applicationId?: string;
  initialBlob?: Blob | null;
  initialUrl?: string;
}

export function PdfResumeViewerModal({
  open,
  onClose,
  title = 'Candidate Resume',
  filename = 'Resume.pdf',
  leadId,
  applicationId,
  initialBlob,
  initialUrl,
}: PdfResumeViewerModalProps) {
  const [blobUrl, setBlobUrl] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [isPdf, setIsPdf] = useState<boolean>(true);
  const activeBlobRef = useRef<Blob | null>(null);

  useEffect(() => {
    if (!open) {
      if (blobUrl) {
        URL.revokeObjectURL(blobUrl);
        setBlobUrl('');
      }
      activeBlobRef.current = null;
      setError('');
      return;
    }

    let isCancelled = false;

    async function loadResume() {
      setLoading(true);
      setError('');

      try {
        let rawBlob: Blob | null = initialBlob || null;

        if (!rawBlob) {
          if (leadId) {
            rawBlob = await salesApi.leadResume(leadId);
          } else if (applicationId) {
            rawBlob = await (applicationsApi as any).resume(applicationId);
          } else if (initialUrl) {
            const resp = await fetch(initialUrl);
            if (!resp.ok) throw new Error(`Failed to load file (${resp.status})`);
            rawBlob = await resp.blob();
          }
        }

        if (isCancelled) return;

        if (!rawBlob) {
          throw new Error('No resume content could be retrieved.');
        }

        activeBlobRef.current = rawBlob;
        const lowerName = String(filename || '').toLowerCase();
        const typeIsPdf = rawBlob.type.includes('pdf') || lowerName.endsWith('.pdf') || lowerName.includes('resume');
        setIsPdf(typeIsPdf);

        const pdfBlob = typeIsPdf && !rawBlob.type.includes('pdf')
          ? new Blob([rawBlob], { type: 'application/pdf' })
          : rawBlob;

        const url = URL.createObjectURL(pdfBlob);
        setBlobUrl(url);
      } catch (err: any) {
        if (!isCancelled) {
          setError(err?.message || 'Could not load resume document.');
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    }

    loadResume();

    return () => {
      isCancelled = true;
    };
  }, [open, leadId, applicationId, initialBlob, initialUrl, filename]);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  const handleDownload = () => {
    if (!blobUrl && !activeBlobRef.current) return;
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = filename || 'resume.pdf';
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const handleOpenNewTab = () => {
    if (!blobUrl) return;
    window.open(blobUrl, '_blank', 'noopener,noreferrer');
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5"
      role="dialog"
      aria-modal="true"
      aria-label="Resume Document Viewer"
    >
      <div
        className="absolute inset-0 bg-slate-950/75 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        className="relative bg-white rounded-3xl shadow-2xl w-full max-w-5xl h-[90vh] flex flex-col border border-slate-200 overflow-hidden z-10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between gap-3 px-5 py-3.5 border-b border-slate-200/90 bg-slate-50/90 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-200/80 flex items-center justify-center text-[#0265FF] shrink-0">
              <FileText size={20} />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-extrabold text-slate-900 truncate">{title}</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-red-100 text-red-700 border border-red-200 shrink-0">
                  PDF Viewer
                </span>
              </div>
              <p className="text-[11px] font-semibold text-slate-500 truncate">{filename}</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {blobUrl && (
              <>
                <button
                  type="button"
                  onClick={handleOpenNewTab}
                  title="Open in new window"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-100 hover:text-slate-900 shadow-sm transition-colors"
                >
                  <ExternalLink size={13} />
                  <span className="hidden sm:inline">Open in Tab</span>
                </button>
                <button
                  type="button"
                  onClick={handleDownload}
                  title="Download resume file"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0265FF] text-white text-xs font-bold hover:bg-[#0055db] shadow-sm transition-colors"
                >
                  <Download size={13} />
                  <span>Download</span>
                </button>
              </>
            )}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close resume viewer"
              className="p-2 rounded-xl text-slate-500 hover:bg-slate-200 hover:text-slate-900 transition-colors ml-1"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Document Body */}
        <div className="flex-1 bg-slate-100 relative overflow-hidden flex items-center justify-center">
          {loading && (
            <div className="flex flex-col items-center justify-center gap-3 p-8 text-center">
              <RefreshCw size={28} className="animate-spin text-[#0265FF]" />
              <p className="text-sm font-bold text-slate-700">Loading resume PDF...</p>
              <p className="text-xs text-slate-400">Fetching document directly from cloud storage</p>
            </div>
          )}

          {!loading && error && (
            <div className="flex flex-col items-center justify-center gap-3 p-8 text-center max-w-md">
              <div className="w-12 h-12 rounded-full bg-red-50 border border-red-200 flex items-center justify-center text-red-600">
                <AlertCircle size={24} />
              </div>
              <h4 className="text-sm font-bold text-slate-900">Unable to preview document</h4>
              <p className="text-xs text-slate-500">{error}</p>
              {blobUrl && (
                <button
                  type="button"
                  onClick={handleDownload}
                  className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0265FF] text-white text-xs font-bold shadow hover:bg-[#0055db]"
                >
                  <Download size={14} /> Download File Directly
                </button>
              )}
            </div>
          )}

          {!loading && !error && blobUrl && isPdf && (
            <iframe
              src={`${blobUrl}#toolbar=1&navpanes=0&zoom=page-width`}
              title={title}
              className="w-full h-full border-0 bg-white"
            />
          )}

          {!loading && !error && blobUrl && !isPdf && (
            <div className="flex flex-col items-center justify-center gap-4 p-8 text-center max-w-md bg-white rounded-3xl border border-slate-200 shadow-sm">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
                <FileText size={28} />
              </div>
              <div>
                <h4 className="text-base font-extrabold text-slate-900">Non-PDF File Attached</h4>
                <p className="text-xs text-slate-500 mt-1">
                  This document ({filename}) is in Word or binary format. You can download it directly to view.
                </p>
              </div>
              <button
                type="button"
                onClick={handleDownload}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0265FF] text-white text-xs font-bold shadow hover:bg-[#0055db]"
              >
                <Download size={15} /> Download {filename}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
