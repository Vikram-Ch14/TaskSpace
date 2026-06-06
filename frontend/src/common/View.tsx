import type { PropsWithChildren } from "react";

export const View = ({ children }: PropsWithChildren) => (
  <div className="flex flex-1 flex-col gap-4 h-full">{children}</div>
);
