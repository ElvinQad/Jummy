import { ThemeToggle } from "../../../components/ThemeToggle";

const Settings = () => {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-foreground mb-8">Settings</h1>
      
      <div className="max-w-2xl">
        <div className="bg-card rounded-lg p-6 border border-border shadow-sm">
          <h2 className="text-xl font-semibold text-foreground mb-4">Appearance</h2>
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-foreground">Theme</h3>
              <p className="text-muted-foreground text-sm">Toggle between light and dark mode</p>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
