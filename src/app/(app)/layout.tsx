import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    // min-h-dvh, not min-h-screen: mobile browser chrome makes 100vh overshoot.
    <div className="flex min-h-dvh bg-muted/30">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-primary-foreground"
      >
        Skip to content
      </a>
      <Sidebar role={session.user.role} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar
          role={session.user.role}
          name={session.user.name}
          email={session.user.email}
          image={session.user.image}
        />
        <main id="main" className="mx-auto w-full max-w-[1400px] flex-1 p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
