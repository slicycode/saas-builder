import BlurPage from "@/components/global/blur-page";
import InfoBar from "@/components/global/info-bar";
import Sidebar from "@/components/sidebar";
import Unauthorized from "@/components/unauthorized";
import {
  getNotificationAndUser,
  verifyAndAcceptInvitation,
} from "@/libs/queries";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import React from "react";

type LayoutProps = {
  children: React.ReactNode;
  params: { agencyId: string };
};

const Layout = async ({ children, params }: LayoutProps) => {
  const agencyId = await verifyAndAcceptInvitation();
  const user = await currentUser();

  if (!user) redirect("/");
  if (!agencyId) redirect("/agency");

  if (
    user.privateMetadata.role !== "AGENCY_OWNER" &&
    user.privateMetadata.role !== "AGENCY_ADMIN"
  )
    return <Unauthorized />;

  let allNotifications: any = [];
  const notifications = await getNotificationAndUser(agencyId);

  if (notifications) allNotifications = notifications;

  return (
    <div className="h-screen overflow-hidden">
      <Sidebar id={params.agencyId} type="agency" />
      <div className="md:pl-[300px]">
        <InfoBar
          notifications={allNotifications}
          role={allNotifications.User?.role}
        />
        <div className="relative">
          <BlurPage>{children}</BlurPage>
        </div>
      </div>
    </div>
  );
};

export default Layout;
