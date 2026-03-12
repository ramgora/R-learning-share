export default function NotFound() {
  return (
    <>
      <main className="min-h-screen bg-white px-4 py-10 text-slate-900">
        <div className="mx-auto max-w-2xl rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h1 className="mb-3 text-2xl font-bold tracking-tight">
            学習ログが見つかりませんでした
          </h1>
          <p className="text-sm text-slate-600">
            share token が無効か、公開されていない可能性があります。
          </p>
        </div>
      </main>
    </>
  );
}
