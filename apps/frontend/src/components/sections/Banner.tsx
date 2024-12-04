import { useState, FC, FormEvent } from 'react';
import { Search } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

interface Stat {
  value: string;
  label: string;
}
interface BannerProps {
  title?: string;
  onSearch?: (type: string, query: string) => void;
}
const STATS: Stat[] = [
  { value: '700+', label: 'Restaurant' },
  { value: '6900+', label: 'People Served' },
  { value: '6900+', label: 'Registered Users' }
];

const Banner: FC<BannerProps> = ({ 
  title = "Unique Food Network...",
  onSearch = (type, query) => console.log('Search:', type, query) 
}) => {
  const [searchType, setSearchType] = useState<string>('1');
  const [searchText, setSearchText] = useState<string>('');

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSearch(searchType, searchText);
  };

  return (
    <div className="relative w-full min-h-screen overflow-hidden flex items-center justify-center   transition-colors">
      <div className="absolute left-0 top-0 w-[300px] md:w-[400px] h-auto pointer-events-none -z-10">
        <img 
          src="assets/images/banner/shape/02.png" 
          alt="decorative shape" 
          className="w-full h-full object-contain opacity-100 dark:opacity-90  transition-all" 
        />
      </div>
      <div className="absolute right-0 bottom-0 w-[300px] md:w-[400px] h-auto pointer-events-none -z-10">
        <img 
          src="assets/images/banner/shape/01.png" 
          alt="decorative shape" 
          className="w-full h-full object-contain opacity-100 dark:opacity-90  transition-all" 
        />
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <div className="space-y-12">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 dark:text-white transition-colors">
              {title}
            </h2>

            <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 justify-center">
              <Select value={searchType} onValueChange={setSearchType}>
                <SelectTrigger className="w-full md:w-[180px] focus:ring-foodred-500 dark:bg-dark-primary dark:border-dark-border">
                  <SelectValue placeholder="Search type" />
                </SelectTrigger>
                <SelectContent className="dark:bg-dark-primary dark:border-dark-border">
                  <SelectItem value="1">Find A Food</SelectItem>
                  <SelectItem value="2">Find A Chef</SelectItem>
                </SelectContent>
              </Select>

              <div className="relative flex-1 max-w-xl">
                <Input
                  type="text"
                  placeholder="Enter your food name"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className="pr-12 focus:ring-foodred-500 dark:bg-dark-primary dark:border-dark-border"
                />
                <Button 
                  type="submit"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-foodred-500 hover:bg-foodred-600 text-white"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </form>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {STATS.map((stat, index) => (
                <div key={index} className="flex flex-col items-center space-y-2">
                  <span className="text-3xl font-bold tracking-tight text-foodred-500">
                    {stat.value}
                  </span>
                  <span className="text-sm text-muted-foreground dark:text-gray-400">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;