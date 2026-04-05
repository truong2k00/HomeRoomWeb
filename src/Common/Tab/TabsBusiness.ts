import type { ActionsResCheck } from "../enum/Action";

export interface TabItem {
  title: string;
  icon: string;
  tab: string;
  status?: boolean;
  visible?: boolean | ((actions: ActionsResCheck) => boolean);
}

export const tabs: TabItem[] = [
  { title: "News", icon: "tabler-news", tab: "News", status: true },
  { title: "Descriptions", icon: "tabler-wallpaper", tab: "Descriptions" },
  { title: "Team", icon: "tabler-users", tab: "teams" },
  { title: "Projects", icon: "tabler-layout-grid", tab: "projects" },
  { title: "renal", icon: "tabler-building", tab: "renal" },
  {
    title: "Connections",
    icon: "tabler-link",
    tab: "connections",
    visible: (actions) => actions.manager,
  },
];

export const getVisibleTabs = (
  actions: ActionsResCheck,
  status: boolean,
): TabItem[] => {
  return tabs.filter((tab) => {
    const isVisible =
      typeof tab.visible === "function"
        ? tab.visible(actions)
        : tab.visible !== false;
    const hasStatus =
      typeof tab.status !== "undefined" ? tab.status === status : true;

    return isVisible && hasStatus;
  });
};

// export const getVisibleTabs = (actions: ActionsResCheck, status: boolean): TabItem[] => {
//   return tabs.filter(tab => {
//     if (typeof tab.visible === 'function') {
//       return tab.visible(actions)
//     }
//     return tab.visible !== false // nếu undefined hoặc true thì hiển thị
//   })
// }
