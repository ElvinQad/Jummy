import { LucideIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description: string;
  loading?: boolean;
}

export const StatsCard = ({ title, value, icon: Icon, description, loading }: StatsCardProps) => (
  <Card className="bg-gray-900 border-gray-800 relative overflow-hidden">
    {loading && (
      <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm animate-pulse" />
    )}
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-gray-100">{title}</CardTitle>
      <Icon className="h-4 w-4 text-gray-400" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold text-gray-100">{value}</div>
      <p className="text-xs text-gray-400">{description}</p>
    </CardContent>
  </Card>
);
