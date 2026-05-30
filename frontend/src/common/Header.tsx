import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import type { PropsWithChildren } from "react";

export const Header = ({ children }: PropsWithChildren) => (
  <header className="flex h-12 shrink-0 items-center gap-2 border-b border-[--sidebar-border]">
    <div className="flex items-center gap-2 px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator
        orientation="vertical"
        className="mr-2 data-[orientation=vertical]:h-4"
      />
    </div>
  </header>
);
