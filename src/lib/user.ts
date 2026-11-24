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

export const currentUser: CurrentUser = {
  name: "Dominik Řihák",
  organization: "Artstay",
  role: "Admin",
  avatarUrl:
    "https://images.unsplash.com/photo-1679953332630-62aaa6a51bb2?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=176&h=176",
  online: true,
};
