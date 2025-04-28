"use client"

import type * as React from "react"
import { useState, createContext, useContext, useEffect } from "react"

type Theme = "light" | "dark"

interface ThemeContextProps {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextProps>({
  theme: "light",
  setTheme: () => {},
})

interface ThemeProviderProps {
  children: React.ReactNode
  attribute?: string
  defaultTheme?: Theme
  enableSystem?: boolean
  storageKey?: string
}

const defaultStorageKey = "vite-ui-theme"

export function ThemeProvider({
  children,
  attribute = "class",
  defaultTheme = "system",
  enableSystem = true,
  storageKey = defaultStorageKey,
}: ThemeProviderProps) {
  // Use a state initializer function to avoid hydration mismatch
  const [theme, setTheme] = useState<Theme>("light")

  // Move localStorage operations to useEffect to avoid hydration issues
  useEffect(() => {
    try {
      const storedTheme = localStorage.getItem(storageKey) as Theme | null
      if (storedTheme) {
        setTheme(storedTheme)
      } else if (enableSystem) {
        const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
        setTheme(systemTheme)
      } else {
        setTheme(defaultTheme === "system" ? "light" : defaultTheme)
      }
    } catch (e) {
      console.error("Error accessing localStorage:", e)
    }
  }, [defaultTheme, enableSystem, storageKey])

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, theme)
    } catch (e) {
      console.error("Error writing to localStorage:", e)
    }
    const root = window.document.documentElement
    root.setAttribute(attribute, theme)
  }, [theme, attribute, storageKey])

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  return useContext(ThemeContext)
}
