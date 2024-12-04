import { Moon, Sun } from "lucide-react"
import { Button } from "./ui/button"
import { useTheme } from "../lib/hooks/useTheme"

export function ThemeToggle() {
  const { toggleTheme } = useTheme()

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="hover:bg-light-hover dark:hover:bg-dark-hover"
    >
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-light-text dark:text-dark-text" />
      <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-light-text dark:text-dark-text" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
