import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-bg-primary">
      <nav className="sticky top-0 z-50 border-b border-border bg-bg-primary/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <a href="/" className="text-text-primary font-bold text-lg">
            Mix<span className="text-accent-purple">Space</span>
          </a>
          <div className="flex items-center gap-4">
            <a href="/library" className="text-text-secondary hover:text-text-primary text-sm transition-colors">
              Library
            </a>
            <a href="/compare" className="text-text-secondary hover:text-text-primary text-sm transition-colors">
              Compare
            </a>
            <a href="/account" className="text-text-secondary hover:text-text-primary text-sm transition-colors">
              Account
            </a>
          </div>
        </div>
      </nav>
      <main>{children}</main>
    </div>
  );
}
