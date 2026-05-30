import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import type { PropsWithChildren } from "react";

export const Header = ({ children }: PropsWithChildren) => (
  <header className="flex h-14 shrink-0 items-center gap-1 border-b border-[--sidebar-border]">
    <div className="flex items-center gap-1 px-2">
      <SidebarTrigger className="-ml-1" />
      <Separator
        orientation="vertical"
        className="mr-2 data-[orientation=vertical]:h-4"
      />
    </div>

    {children}
  </header>
);
