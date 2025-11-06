import { Palette, Image, BookOpen, Sparkles, User, LogOut } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

const items = [
  { title: "Text to Image", url: "/text-to-image", icon: Palette },
  { title: "Image to Image", url: "/image-to-image", icon: Image },
  { title: "Prompt to Book", url: "/prompt-to-book", icon: BookOpen },
  { title: "Flipbook Creator", url: "/flipbook", icon: Sparkles },
  { title: "Account", url: "/account", icon: User },
];

export function AppSidebar() {
  const location = useLocation();
  const { signOut } = useAuth();
  const currentPath = location.pathname;

  return (
    <Sidebar className="border-r border-border/50 bg-card/50 backdrop-blur-sm">
      <SidebarHeader className="border-b border-border/50 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Palette className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg">AI Coloring</span>
          </div>
          <SidebarTrigger />
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Tools</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className="flex items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-accent"
                      activeClassName="bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="mt-auto p-4 border-t border-border/50">
          <Button
            variant="outline"
            className="w-full"
            onClick={signOut}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
