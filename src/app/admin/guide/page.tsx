import CopyButton from "@/components/admin/CopyButton";
import { decantTemplate } from "@/lib/decantTemplate";

export default function AdminGuidePage() {
  return (
    <div className="card space-y-4">
      <h1 className="font-display text-2xl">Admin Guide (Quick)</h1>
      <ol className="list-decimal space-y-2 pl-5 text-sm text-slate-700">
        <li>Log in at /admin/login with your Supabase email and password.</li>
        <li>Go to Products to add or edit items.</li>
        <li>Add name, price, category, and description.</li>
        <li>Upload 1-3 images for the product.</li>
        <li>If it is a decant, tick “Is decant” and paste JSON sizes.</li>
        <li>Save. The shop updates immediately.</li>
      </ol>

      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-medium">Decant JSON template</p>
          <CopyButton text={decantTemplate} label="Copy template" />
        </div>
        <pre className="rounded-xl bg-sand p-3 text-xs">
{decantTemplate.replace(/}, /g, "},\n  ").replace("[", "[\n  ").replace("]", "\n]")}
        </pre>
      </div>
    </div>
  );
}
