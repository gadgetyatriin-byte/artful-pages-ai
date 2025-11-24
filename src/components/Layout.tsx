import { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Palette } from "lucide-react";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-gradient-to-br from-[hsl(25_100%_97%)] to-[hsl(270_80%_95%)]">
        <AppSidebar />
        <div className="flex-1 flex flex-col w-full">
          {/* Mobile header with menu toggle */}
          <header className="lg:hidden sticky top-0 z-10 flex items-center justify-between p-4 border-b border-border/50 bg-card/80 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <Palette className="h-6 w-6 text-primary" />
              <span className="font-bold text-lg">AI Coloring</span>
            </div>
            <SidebarTrigger />
          </header>
          
          <main className="flex-1 p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
