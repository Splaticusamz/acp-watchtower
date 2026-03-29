import type { Metadata } from "next";
import DashboardClient from "./DashboardClient";

export const metadata: Metadata = {
  title: "ACP Watchtower Operator Dashboard",
  description:
    "Private operator dashboard for the ACP Watchtower nightly hustle build.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function DashboardPage() {
  return <DashboardClient />;
}
