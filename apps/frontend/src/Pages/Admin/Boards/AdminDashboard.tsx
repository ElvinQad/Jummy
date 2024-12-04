import React, { useState } from "react";
import { Toaster } from "../../../components/ui/toaster";
import ChefApplicationManagement from "../Tabs/ChefApplicationManagement";
import { cn } from "../../../lib/utils";

type Tab = {
  id: string;
  label: string;
  component: React.ReactNode;
};

const tabs: Tab[] = [
  {
    id: "overview",
    label: "Overview",
    component: (
      <div className="p-4">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Dashboard Overview</h2>
        {/* Add overview content here */}
      </div>
    ),
  },
  {
    id: "applications",
    label: "Chef Applications",
    component: <ChefApplicationManagement />,
  },
  // Add more tabs as needed
];

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState(tabs[0].id);

  return (
    <div className="p-8">
      <div className="mb-6">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors",
                  activeTab === tab.id
                    ? "border-foodred-500 text-foodred-500"
                    : "border-transparent text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-300"
                )}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className="mt-4">
        {tabs.find(tab => tab.id === activeTab)?.component}
      </div>
      
      <Toaster />
    </div>
  );
};

export default AdminDashboard;
