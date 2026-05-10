import { createClient } from "@/lib/supabase/server";

export default async function AccountPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-text-primary mb-8">Account</h1>
      <div className="bg-bg-elevated border border-border rounded-xl p-6">
        <p className="text-text-secondary text-sm">Signed in as</p>
        <p className="text-text-primary font-medium mt-1">{user?.email}</p>
        <div className="mt-4 pt-4 border-t border-border">
          <p className="text-text-secondary text-sm">Plan</p>
          <p className="text-accent-purple font-medium mt-1">Free (3 analyses remaining)</p>
        </div>
      </div>
    </div>
  );
}
