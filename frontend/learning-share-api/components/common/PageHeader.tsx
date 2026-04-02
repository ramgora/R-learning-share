type Props = {
  title: string;
  description?: string;
  action?: React.ReactNode;
};

export function PageHeader({ title, description, action }: Props) {
  return (
    <div className="mb-8 flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50/70 px-5 py-4">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>

        {description && (
          <p className="mt-1 text-sm text-slate-500">{description}</p>
        )}
      </div>

      {action && <div className="flex items-center gap-2">{action}</div>}
    </div>
  );
}
