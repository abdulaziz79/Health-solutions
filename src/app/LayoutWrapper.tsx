"use client";

import { Header } from "@/components/Layouts/header";
import { Sidebar } from "@/components/Layouts/sidebar";
import { usePathname } from "next/navigation";
import { PropsWithChildren, use } from "react";

interface LayoutWrapperProps {
  showSidebarHeader?: boolean;
}

export function LayoutWrapper({
  children,
  showSidebarHeader = true,
}: PropsWithChildren<LayoutWrapperProps>) {
  const pathName = usePathname();
  const isLoginPage = pathName === "/auth/sign-in";

  return (
    <div className="flex min-h-screen">
      {!isLoginPage && <Sidebar />}

      <div className="w-full bg-gray-2 dark:bg-[#020d1a]">
        {!isLoginPage && <Header />}

        <main className="isolate mx-auto w-full max-w-screen-2xl overflow-hidden p-4 md:p-6 2xl:p-10">
          {children}
        </main>
      </div>
    </div>
  );
}
