import { useState, useEffect } from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  ChefHat,
  ShoppingBag,
  Settings,
  Menu,
  ChevronLeft,
  LucideIcon,
  UtensilsCrossed,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { Button } from "../../components/ui/button";

type NavGroup = {
  label: string;
  items: NavItem[];
};

type NavItem = {
  icon: LucideIcon;
  label: string;
  href: string;
  shortcut?: string;
};

// Organize navigation items into groups
const navGroups: NavGroup[] = [
  {
    label: "Overview",
    items: [
      {
        icon: LayoutDashboard,
        label: "Dashboard",
        href: "/admin",
        shortcut: "Alt+1",
      },
    ],
  },
  {
    label: "Management",
    items: [
      { icon: Users, label: "Users", href: "/admin/users", shortcut: "Alt+2" },
      { icon: ChefHat, label: "Chefs", href: "/admin/chefs", shortcut: "Alt+3" },
      { 
        icon: UtensilsCrossed, 
        label: "Kitchen", 
        href: "/admin/kitchen", 
        shortcut: "Alt+4" 
      },
      { 
        icon: ShoppingBag, 
        label: "Orders", 
        href: "/admin/orders",
        shortcut: "Alt+5"
      },
    ],
  },
  {
    label: "System",
    items: [
      { 
        icon: Settings, 
        label: "Settings", 
        href: "/admin/settings",
        shortcut: "Alt+9"
      },
    ],
  },
];

interface SidebarProps {
  isCollapsed: boolean;
  onCollapsedChange: (collapsed: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, onCollapsedChange }) => {
  const location = useLocation();

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-screen bg-card text-foreground p-4 transition-all duration-300 ease-in-out border-r border-border",
        isCollapsed ? "w-20" : "w-64"
      )}
      aria-expanded={!isCollapsed}
    >
      <div className="flex items-center justify-between mb-8">
        <h2
          className={cn(
            "text-xl font-bold transition-opacity duration-300",
            isCollapsed ? "opacity-0 hidden" : "opacity-100"
          )}
        >
          Admin Panel
        </h2>
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-muted transition-colors duration-200"
          onClick={() => onCollapsedChange(!isCollapsed)}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <Menu className="h-5 w-5" />
          ) : (
            <ChevronLeft className="h-5 w-5" />
          )}
        </Button>
      </div>
      <nav className="space-y-6" role="navigation">
        {navGroups.map((group, index) => (
          <div key={index} className="space-y-2">
            {!isCollapsed && (
              <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {group.label}
              </h3>
            )}
            {group.items.map(({ icon: Icon, label, href, shortcut }) => (
              <Link
                key={href}
                to={href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 relative group focus:outline-none focus:ring-2 focus:ring-primary",
                  location.pathname === href
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                )}
                title={shortcut ? `${label} (${shortcut})` : label}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                <span
                  className={cn(
                    "transition-all duration-300 flex-1",
                    isCollapsed ? "opacity-0 w-0" : "opacity-100"
                  )}
                >
                  {label}
                </span>
                {!isCollapsed && shortcut && (
                  <kbd className="hidden group-hover:inline-block text-xs text-gray-500 transition-opacity duration-200">
                    {shortcut}
                  </kbd>
                )}
                {isCollapsed && (
                  <div className="fixed left-14 ml-2 px-2 py-1 bg-gray-800 rounded-md text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-[999]">
                    {label}
                  </div>
                )}
              </Link>
            ))}
          </div>
        ))}
      </nav>
    </aside>
  );
};

const AdminNav: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(
    () => localStorage.getItem("adminNavCollapsed") === "true"
  );

  useEffect(() => {
    localStorage.setItem("adminNavCollapsed", String(isCollapsed));
  }, [isCollapsed]);

  useEffect(() => {
    const handleKeyboard = (e: KeyboardEvent) => {
      if (e.altKey) {
        const shortcutItem = navGroups
          .flatMap(group => group.items)
          .find(item => item.shortcut?.endsWith(e.key));
        
        if (shortcutItem) {
          e.preventDefault();
          window.location.href = shortcutItem.href;
        }
      }
    };

    window.addEventListener("keydown", handleKeyboard);
    return () => window.removeEventListener("keydown", handleKeyboard);
  }, []);

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar isCollapsed={isCollapsed} onCollapsedChange={setIsCollapsed} />
      <main
        className={cn(
          "flex-1 overflow-auto transition-all duration-300 ease-in-out",
          isCollapsed ? "ml-20" : "ml-64"
        )}
      >
        <Outlet />
      </main>
    </div>
  );
};

export default AdminNav;
