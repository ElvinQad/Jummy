import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { Trash2, ChevronDown, ChevronUp, Search, ChefHat, Edit, Clock, MapPin, DollarSign, Import } from "lucide-react";
import { useToast } from "../../../components/ui/use-toast";
import { api } from "../../../lib/axios";
import { Skeleton } from "../../../components/ui/skeleton";
import { UserProfileDialog } from "../Modals/UserProfileDialog";
import { Input } from "../../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { Card, CardContent } from "../../../components/ui/card";
import { User } from "./UsersManagement";
import React from 'react'


export default function ChefManagement() {
  const [chefs, setChefs] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const [selectedChef, setSelectedChef] = useState<User | null>(null);
  const [expandedChefId, setExpandedChefId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);

  useEffect(() => {
    fetchChefs();
  }, []);

  const fetchChefs = async () => {
    try {
      const { data } = await api.get('/admin/chefs');
      setChefs(data);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response?.data?.message || "Failed to load chefs"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteChef = async (chefId: number) => {
    if (!confirm('Are you sure you want to delete this chef?')) return;
    
    try {
      await api.delete(`/admin/users/${chefId}`);
      setChefs(chefs.filter(chef => chef.id !== chefId));
      toast({
        title: "Success",
        description: "Chef deleted successfully"
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response?.data?.message || "Failed to delete chef"
      });
    }
  };

  const handleChefUpdate = (updatedChef: User) => {
    setChefs(chefs.map(chef => chef.id === updatedChef.id ? updatedChef : chef));
  };

  if (loading) {
    return (
      <div className="p-8 space-y-6 bg-black/40">
        <Skeleton className="h-8 w-64 bg-gray-900" />
        <div className="rounded-md border border-gray-900">
          <div className="space-y-4 p-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-12 w-full bg-gray-900" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background/40 p-8 space-y-8">
      <div className="flex flex-col gap-8">

        <div className="flex flex-col gap-6">
          <div className="flex gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search chefs..."
                className="pl-10 bg-background/50 border-border"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-[180px] bg-background/50 border-border">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Chefs</SelectItem>
                <SelectItem value="online">Online</SelectItem>
                <SelectItem value="offline">Offline</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Chef Table */}
          {/* ... Similar to UsersManagement table but with chef-specific columns ... */}
          <div className="rounded-xl border border-border bg-card/50 backdrop-blur-sm shadow-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-muted/50 transition-colors">
                  <TableHead className="text-foreground font-semibold text-base py-4">Business Name</TableHead>
                  <TableHead className="text-foreground font-semibold text-base py-4">Chef</TableHead>
                  <TableHead className="text-foreground font-semibold text-base py-4">Status</TableHead>
                  <TableHead className="text-foreground font-semibold text-base py-4">Location</TableHead>
                  <TableHead className="text-right text-foreground font-semibold text-base py-4">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {chefs
                  .filter(chef => {
                    const matchesSearch = 
                      chef.email.toLowerCase().includes(search.toLowerCase()) ||
                      chef.profile?.firstName?.toLowerCase().includes(search.toLowerCase()) ||
                      chef.profile?.lastName?.toLowerCase().includes(search.toLowerCase()) ||
                      chef.cookProfile?.businessName?.toLowerCase().includes(search.toLowerCase());
                    const matchesFilter = filter === 'all' ? true :
                      filter === 'online' ? chef.onlineStatus === 'ONLINE' :
                      filter === 'offline' ? chef.onlineStatus === 'OFFLINE' : true;
                    return matchesSearch && matchesFilter;
                  })
                  .map((chef) => (
                    <React.Fragment key={chef.id}>
                      <TableRow 
                        className="border-border/50 hover:bg-muted/30 transition-all duration-200"
                      >
                        <TableCell className="font-medium text-foreground py-4">
                          <div className="flex flex-col">
                            <span>{chef.cookProfile?.businessName || 'N/A'}</span>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-sm text-foreground/70">
                                {chef.cookProfile?.cuisineTypes?.join(', ')}
                              </span>
                              {chef.cookProfile?.rating && (
                                <Badge variant="secondary" className="bg-yellow-600/20 text-yellow-400">
                                  ★ {chef.cookProfile.rating}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center">
                              <span className="text-gray-400 text-sm">
                                {chef.profile?.firstName?.[0]}
                                {chef.profile?.lastName?.[0]}
                              </span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-foreground">{chef.profile?.firstName} {chef.profile?.lastName}</span>
                              <span className="text-sm text-foreground/70">{chef.email}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            <Badge 
                              className={`${
                                chef.onlineStatus === 'ONLINE' 
                                  ? 'bg-green-100/10 text-green-500 dark:bg-green-500/10 dark:text-green-400' 
                                  : 'bg-gray-100/10 text-gray-500 dark:bg-gray-500/10 dark:text-gray-400'
                              }`}
                            >
                              {chef.onlineStatus}
                            </Badge>
                            <Badge 
                              className={`${
                                chef.cookProfile?.verificationStatus === 'VERIFIED'
                                  ? 'bg-blue-100/10 text-blue-500 dark:bg-blue-500/10 dark:text-blue-400'
                                  : chef.cookProfile?.verificationStatus === 'PENDING'
                                  ? 'bg-yellow-100/10 text-yellow-500 dark:bg-yellow-500/10 dark:text-yellow-400'
                                  : 'bg-red-100/10 text-red-500 dark:bg-red-500/10 dark:text-red-400'
                              }`}
                            >
                              {chef.cookProfile?.verificationStatus}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell className="text-foreground">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-gray-400" />
                            <span className="text-foreground">{chef.cookProfile?.location?.address || 'N/A'}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => {
                                setSelectedChef(chef);
                                setIsProfileDialogOpen(true);
                              }}
                              className="hover:bg-blue-500/10 text-muted-foreground hover:text-blue-400 transition-colors"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteChef(chef.id)}
                              className="hover:bg-red-500/10 text-muted-foreground hover:text-red-400 transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setExpandedChefId(expandedChefId === chef.id ? null : chef.id)}
                              className="hover:bg-blue-950/30 text-gray-400 hover:text-blue-400"
                            >
                              {expandedChefId === chef.id ? (
                                <ChevronUp className="h-4 w-4" />
                              ) : (
                                <ChevronDown className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                      {expandedChefId === chef.id && (
                        <TableRow>
                          <TableCell colSpan={5} className="bg-muted/5 dark:bg-muted/10">
                            <div className="p-4 space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <h3 className="text-foreground font-medium">Business Details</h3>
                                  <p className="text-foreground/70">{chef.cookProfile?.description}</p>
                                  <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-2">
                                      <DollarSign className="h-4 w-4 text-gray-400" />
                                      <span className="text-foreground">
                                        Min Order: ${chef.cookProfile?.minOrderAmount}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <ChefHat className="h-4 w-4 text-gray-400" />
                                      <span className="text-foreground">
                                        Max Orders per Slot: {chef.cookProfile?.maxOrdersPerSlot}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <h3 className="text-foreground font-medium">Operating Hours</h3>
                                  <div className="grid grid-cols-2 gap-2">
                                    {Object.entries(chef.cookProfile?.operatingHours || {}).map(([day, hours]) => (
                                      <div key={day} className="flex items-center gap-2">
                                        <Clock className="h-4 w-4 text-gray-400" />
                                        <span className="text-foreground capitalize">
                                          {day}: {hours.open} - {hours.close}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {isProfileDialogOpen && selectedChef && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center">
          <UserProfileDialog 
            user={selectedChef} 
            onUserUpdate={handleChefUpdate}
            onClose={() => {
              setIsProfileDialogOpen(false);
              setSelectedChef(null);
            }}
          />
        </div>
      )}
    </div>
  );
}
