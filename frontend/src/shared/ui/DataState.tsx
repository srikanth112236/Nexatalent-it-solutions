interface StateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function InlineLoading({ message = 'Loading…' }: { message?: string }) {
  return (
    <div className="py-10 flex flex-col items-center gap-3 text-slate-500" role="status" aria-busy="true">
      <div className="w-6 h-6 rounded-full border-2 border-slate-300 border-t-blue-600 animate-spin" />
      <p className="text-xs font-semibold">{message}</p>
    </div>
  );
}

export function EmptyState({ title = 'No records yet', message = 'Create the first entry to get started.', onRetry }: StateProps) {
  return (
    <div className="py-10 px-6 text-center border border-dashed border-slate-300 rounded-2xl bg-slate-50/60">
      <p className="text-sm font-extrabold text-slate-800">{title}</p>
      <p className="text-xs text-slate-500 mt-1">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-700"
        >
          Refresh
        </button>
      )}
    </div>
  );
}

export function ErrorState({ message = 'Something went wrong loading this section.', onRetry }: StateProps) {
  return (
    <div className="py-8 px-6 text-center border border-red-200 rounded-2xl bg-red-50/60" role="alert">
      <p className="text-sm font-extrabold text-red-800">Couldn&apos;t load data</p>
      <p className="text-xs text-red-600 mt-1">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-500"
        >
          Try again
        </button>
      )}
    </div>
  );
}
