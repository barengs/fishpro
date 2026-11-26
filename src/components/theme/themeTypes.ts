import { createContext } from "react";

export type Theme = "light" | "dark";

export interface ThemeContextValue {
  theme: Theme;
  toggle: (event?: React.MouseEvent | MouseEvent) => void;
}

export const ThemeContext = createContext<ThemeContextValue>({
  theme: "light",
  toggle: () => {},
});
