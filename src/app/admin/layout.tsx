import AdminHeader from "@/components/admin/AdminHeader";

export default function AdminLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-cream">
      <AdminHeader />
      <div className="mx-auto w-full max-w-6xl px-4 py-8">{children}</div>
    </div>
  );
}
