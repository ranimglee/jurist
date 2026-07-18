import { ReactNode, useState } from "react";
import { Sidebar } from "./Sidebar";
import { Navbar } from "./Navbar";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { useLanguage } from "@/i18n";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const isMobile = useIsMobile();
  const { lang } = useLanguage();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const sheetSide = lang === "ar" ? "right" : "left";

  return (
    <div className="flex h-screen w-full max-w-[100vw] overflow-x-hidden">
      {/* Sidebar */}
      {!isMobile && <Sidebar />}
      {isMobile && (
        <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
          <SheetContent
            side={sheetSide}
            className={cn(
              "w-[min(20rem,100vw)] max-w-[min(20rem,100vw)] p-0",
              "border-sidebar-border bg-sidebar-background"
            )}
          >
            <Sidebar onNavigate={() => setMobileNavOpen(false)} />
          </SheetContent>
        </Sheet>
      )}

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Navbar
          showMobileMenu={isMobile}
          onMobileMenuClick={() => setMobileNavOpen(true)}
        />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
