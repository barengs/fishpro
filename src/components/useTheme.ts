import { useContext } from 'react'
import { ThemeContext, type ThemeContextValue } from './themeTypes'

export function useTheme(): ThemeContextValue {
  return useContext(ThemeContext)
}
