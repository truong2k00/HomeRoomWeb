import appAndPages from "./app-and-pages";
import charts from "./charts";
import dashboard from "./dashboard";
import forms from "./forms";
import manager from "./manager";
import amount from "./amount";
import others from "./others";
import setting from "./setting";
import uiElements from "./ui-elements";
import type { VerticalNavItems } from "@/@layouts/types";

export default [
  ...dashboard,
  ...manager,
  ...amount,
  ...appAndPages,
  ...uiElements,
  ...forms,
  ...charts,
  ...others,
  ...setting,
] as VerticalNavItems;
