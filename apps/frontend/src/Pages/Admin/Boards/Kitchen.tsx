import { useState } from "react";
import CategoryManagement from "../Tabs/CategoryManagement";
import FoodTypes from "../Tabs/FoodTypesManagment";
import { cn } from "../../../lib/utils";

type Tab = {
  id: string;
  label: string;
  component: React.ReactNode;
};

const tabs: Tab[] = [
  {
    id: "categories",
    label: "Categories",
    component: <CategoryManagement />,
  },
  {
    id: "foodTypes",
    label: "Food Types",
    component: <FoodTypes />,
  },
];

export default function Kitchen() {
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
    </div>
  );
}
