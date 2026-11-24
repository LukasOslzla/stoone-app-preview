/**
 * Signed-in user.
 *
 * MOCK DATA — replace with the real session once auth is wired up.
 */

export type CurrentUser = {
  name: string;
  organization: string;
  role: string;
  avatarUrl?: string;
  online: boolean;
};

/** Details shown on "Můj účet". */
export type Account = {
  firstName: string;
  email: string;
  role: "admin" | "editor";
  /** ISO date the account was created. */
  createdAt: string;
  passwordChanged: string;
  otherSessions: number;
  language: string;
  theme: Theme;
};

export type Theme = "auto" | "light" | "dark";

export const languageOptions = [
  { value: "cs", label: "Čeština" },
  { value: "en", label: "English" },
];

export const currentUser: CurrentUser = {
  name: "Dominik Řihák",
  organization: "Artstay",
  role: "Admin",
  avatarUrl:
    "https://images.unsplash.com/photo-1679953332630-62aaa6a51bb2?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=176&h=176",
  online: true,
};

export async function getAccount(): Promise<Account> {
  return {
    firstName: "Dominik",
    email: "dominik@artstay.co",
    role: "admin",
    createdAt: "2026-06-29",
    passwordChanged: "před 4 měsíci",
    otherSessions: 1,
    language: "cs",
    theme: "dark",
  };
}

export type AccountValues = Pick<
  Account,
  "firstName" | "email" | "language" | "theme"
>;

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** Mock save: waits and resolves. */
export async function saveAccount(values: AccountValues): Promise<void> {
  void values;
  await wait(700);
}

/** Mock sign-out of the other devices. */
export async function signOutOtherSessions(): Promise<void> {
  await wait(600);
}
