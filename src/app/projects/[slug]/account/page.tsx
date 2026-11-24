import type { Metadata } from "next";
import { AccountPage } from "@/components/account/AccountPage";
import { getProjects } from "@/lib/projects";
import { getAccount } from "@/lib/user";

export const metadata: Metadata = { title: "Můj účet" };

/** The signed-in user's account. Opened from the user card in the sidebar. */
export default async function AccountRoute() {
  const [account, projects] = await Promise.all([getAccount(), getProjects()]);

  return (
    <AccountPage
      account={account}
      projects={projects.map(({ slug, name }) => ({ slug, name }))}
    />
  );
}
