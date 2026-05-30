"use client";

import * as React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  IconChartBar,
  IconDashboard,
  IconFolder,
  IconListDetails,
  IconLogout,
  IconUser,
  IconUsers,
} from "@tabler/icons-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { routes } from "@/routes/routes";
import { Command } from "lucide-react";
import { RouteName } from "@/routes/types";
import { getRoute } from "@/routes/utils";

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/",
      icon: IconDashboard,
      routeName: RouteName.Dashboard,
    },
    {
      title: "Tasks",
      url: "tasks",
      icon: IconListDetails,
      routeName: RouteName.Tasks,
    },
    {
      title: "Board",
      url: "board",
      icon: IconChartBar,
      routeName: RouteName.Board,
    },
    {
      title: "Activity",
      url: "activity",
      icon: IconFolder,
      routeName: RouteName.Activity,
    },
    {
      title: "Members",
      url: "members",
      icon: IconUsers,
      routeName: RouteName.Members,
    },
  ],
  navClouds: [
    {
      title: "Profile",
      url: "profile",
      icon: IconUser,
      routeName: RouteName.Profile,
    },
    {
      title: "Logout",
      url: "logout",
      icon: IconLogout,
      routeName: RouteName.Logout,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const location = useLocation();
  const navigateTo = useNavigate();
  const route = getRoute(location.pathname, routes);

  const onClick = (url: string) => {
    navigateTo(url);
  };

  return (
    <Sidebar
      collapsible="offcanvas"
      {...props}
      className="border-[--sidebar-border]"
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild onClick={() => onClick("/")} className="cursor-pointer">
              <div>
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">TaskSpace</span>
                  <span className="truncate text-xs">Enterprise</span>
                </div>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Platform</SidebarGroupLabel>
          <SidebarGroupContent className="flex flex-col gap-2">
            <SidebarMenu>
              {data.navMain.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    tooltip={item.title}
                    isActive={item.routeName === route?.name}
                    onClick={() => onClick(item.url)}
                  >
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Account</SidebarGroupLabel>
          <SidebarGroupContent className="flex flex-col gap-2">
            <SidebarMenu>
              {data.navClouds.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton tooltip={item.title}>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter></SidebarFooter>
    </Sidebar>
  );
}
