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

/** What each kind of notification is called in the settings. */
export const notificationKinds: {
  id: NotificationKind;
  label: string;
  description: string;
}[] = [
  {
    id: "warning",
    label: "Problémy se synchronizací",
    description: "Když se nepovede spojení s Realpadem",
  },
  {
    id: "inquiry",
    label: "Nové poptávky",
    description: "Zájemce vyplnil formulář na webu",
  },
  {
    id: "deadline",
    label: "Končící rezervace",
    description: "Tři dny před vypršením předrezervace",
  },
  {
    id: "done",
    label: "Dokončené úlohy",
    description: "Importy, migrace a hromadné úpravy",
  },
  {
    id: "user",
    label: "Uživatelé",
    description: "Přijaté pozvánky a změny rolí",
  },
];

export type NotificationSettings = {
  /** Kinds shown in the panel. */
  kinds: Record<NotificationKind, boolean>;
  /** Also send a daily summary by e-mail. */
  email: boolean;
};

export const defaultNotificationSettings: NotificationSettings = {
  kinds: {
    warning: true,
    inquiry: true,
    deadline: true,
    done: true,
    user: false,
  },
  email: true,
};

/** Mock save: waits and resolves. */
export async function saveNotificationSettings(
  settings: NotificationSettings,
): Promise<void> {
  void settings;
  await new Promise((resolve) => setTimeout(resolve, 300));
}
