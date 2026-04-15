export default function EnvNotice() {
  return (
    <div className="card space-y-3 text-sm text-slate-700">
      <h2 className="font-medium">Supabase setup required</h2>
      <p>
        Add your Supabase Project URL and anon key to
        <span className="font-mono"> .env.local</span>, then restart the dev
        server.
      </p>
      <div className="rounded-xl bg-sand p-3 text-xs text-slate-700">
        <div>NEXT_PUBLIC_SUPABASE_URL=</div>
        <div>NEXT_PUBLIC_SUPABASE_ANON_KEY=</div>
      </div>
    </div>
  );
}
