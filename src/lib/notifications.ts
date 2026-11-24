/**
 * Notifications of the signed-in user.
 *
 * MOCK DATA — replace with real API calls.
 */

export type NotificationKind =
  "warning" | "inquiry" | "deadline" | "done" | "user";

export type AppNotification = {
  id: string;
  kind: NotificationKind;
  title: string;
  description: string;
  /** Already formatted relative time ("před 12 min", "včera"). */
  time: string;
  unread: boolean;
  /** Optional inline action, e.g. "Zkusit znovu". */
  actionLabel?: string;
};

const notifications: AppNotification[] = [
  {
    id: "realpad-sync",
    kind: "warning",
    title: "Synchronizace s Realpadem se nepovedla",
    description: "Ceny a stavy jsou z 8:00. Zkusíme to znovu za 15 min.",
    time: "před 12 min",
    unread: true,
    actionLabel: "Zkusit znovu",
  },
  {
    id: "inquiry-a421",
    kind: "inquiry",
    title: "Nová poptávka na byt A.421",
    description: "Jana Nováková · přes formulář na webu",
    time: "před 40 min",
    unread: true,
  },
  {
    id: "prereservation-a118",
    kind: "deadline",
    title: "Předrezervace A.118 vyprší za 3 dny",
    description: "Momentum · budova AB",
    time: "dnes 9:15",
    unread: true,
  },
  {
    id: "import-done",
    kind: "done",
    title: "Import z Excelu dokončen",
    description: "22 bytů nahráno, 2 přeskočeny",
    time: "včera",
    unread: false,
  },
  {
    id: "invite-accepted",
    kind: "user",
    title: "Nicole přijala pozvánku",
    description: "Role Editor · Momentum, Brique",
    time: "7. 10.",
    unread: false,
  },
];

/** Synchronous for now so the sidebar badge renders with the page. */
export function getNotifications(): AppNotification[] {
  return notifications;
}
