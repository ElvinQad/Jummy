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
import { Trash2, UserCog, ChevronDown, ChevronUp, Search, Filter, Users, Edit } from "lucide-react";
import { useToast } from "../../../components/ui/use-toast";
import { api } from "../../../lib/axios";
import { Skeleton } from "../../../components/ui/skeleton";
import { UserProfileDialog } from "../Modals/UserProfileDialog";
import { formatDistanceToNow } from 'date-fns';
import { Input } from "../../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { Card, CardContent } from "../../../components/ui/card";

interface LastSeen {
  id: string;
  userId: number;
  timestamp: string;
  platform: string;
  deviceId: string;
  ip: string;
}

export interface User {
  id: number;
  email: string;
  phone: string;
  isAdmin: boolean;
  isChef: boolean;
  onlineStatus: string;
  googleId: string | null;
  emailVerifiedAt: string | null;
  createdAt: string;
  updatedAt: string;
  lastSeen: LastSeen;
  profile: {
    firstName: string;
    lastName: string;
  };
}

export default function UsersManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [expandedUserId, setExpandedUserId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await api.get('/admin/users');
      setUsers(data);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response?.data?.message || "Failed to load users"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    
    try {
      await api.delete(`/admin/users/${userId}`);
      
      setUsers(users.filter(user => user.id !== userId));
      toast({
        title: "Success",
        description: "User deleted successfully"
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response?.data?.message || "Failed to delete user"
      });
    }
  };

  const handleUserUpdate = (updatedUser: User) => {
    setUsers(users.map(user => user.id === updatedUser.id ? updatedUser : user));
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
                placeholder="Search users..."
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
                <SelectItem value="all">All Users</SelectItem>
                <SelectItem value="online">Online</SelectItem>
                <SelectItem value="offline">Offline</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-xl border border-border bg-card shadow-md overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-muted/5 transition-colors">
                  <TableHead className="text-foreground font-semibold text-base py-4">Email</TableHead>
                  <TableHead className="text-foreground font-semibold text-base py-4">Phone</TableHead>
                  <TableHead className="text-foreground font-semibold text-base py-4">Status</TableHead>
                  <TableHead className="text-right text-foreground font-semibold text-base py-4">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users
                  .filter(user => {
                    const matchesSearch = user.email.toLowerCase().includes(search.toLowerCase());
                    const matchesFilter = filter === 'all' ? true :
                      filter === 'online' ? user.onlineStatus === 'ONLINE' :
                      filter === 'offline' ? user.onlineStatus === 'OFFLINE' :
                      filter === 'active' ? user.status === 'ACTIVE' :
                      filter === 'inactive' ? user.status === 'INACTIVE' : true;
                    return matchesSearch && matchesFilter;
                  })
                  .map((user) => (
                    <>
                      <TableRow key={user.id} className="border-border hover:bg-muted/10 transition-all duration-200">
                        <TableCell className="font-medium text-foreground py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                              <span className="text-muted-foreground text-sm">
                                {user.profile?.firstName?.[0] || user.email.substring(0, 1)}
                                {user.profile?.lastName?.[0]}
                              </span>
                            </div>
                            <div className="flex flex-col">
                              <span>{user.email}</span>
                              {user.profile?.firstName && (
                                <span className="text-sm text-foreground/70">
                                  {user.profile.firstName} {user.profile.lastName}
                                </span>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-foreground">{user.phone}</TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-2">
                            <Badge 
                              className={`w-fit ${
                                user.onlineStatus === 'ONLINE' 
                                  ? 'bg-green-100/10 text-green-500 dark:bg-green-500/10 dark:text-green-400' 
                                  : 'bg-gray-100/10 text-gray-500 dark:bg-gray-500/10 dark:text-gray-400'
                              }`}
                            >
                              {user.onlineStatus}
                            </Badge>
                            {user.lastSeen && (
                              <div className="text-xs text-foreground/60">
                                <span className="capitalize">{user.lastSeen.platform}</span>
                                <span className="mx-1">•</span>
                                {formatDistanceToNow(new Date(user.lastSeen.timestamp), { addSuffix: true })}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => {
                                setSelectedUser(expandedUserId === user.id ? null : user);
                                setExpandedUserId(expandedUserId === user.id ? null : user.id);
                              }}
                              className="hover:bg-blue-500/10 text-muted-foreground hover:text-blue-400 transition-colors"
                            >
                              {expandedUserId === user.id ? (
                                <ChevronUp className="h-4 w-4" />
                              ) : (
                                <ChevronDown className="h-4 w-4" />
                              )}
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => {
                                setSelectedUser(user);
                                setIsProfileDialogOpen(true);
                              }}
                              className="hover:bg-blue-500/10 text-muted-foreground hover:text-blue-400 transition-colors"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteUser(user.id)}
                              className="hover:bg-red-500/10 text-muted-foreground hover:text-red-400 transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                      {expandedUserId === user.id && (
                        <TableRow>
                          <TableCell colSpan={5} className="bg-muted/5 dark:bg-muted/10 backdrop-blur-sm p-6">
                            <div className="border-t border-border/50 pt-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <h3 className="text-lg font-semibold text-foreground mb-4">User Details</h3>
                                  <div className="space-y-2">
                                    <p className="text-sm text-muted-foreground">ID: <span className="text-foreground">{user.id}</span></p>
                                    <p className="text-sm text-muted-foreground">Phone: <span className="text-foreground">{user.phone}</span></p>
                                    <p className="text-sm text-muted-foreground">Created: <span className="text-foreground">{new Date(user.createdAt).toLocaleDateString()}</span></p>
                                  </div>
                                </div>
                                <div>
                                  <h3 className="text-lg font-semibold text-gray-100 mb-4">Last Seen Details</h3>
                                  <div className="space-y-2">
                                    <p className="text-sm text-foreground/70">Platform: <span className="text-foreground">{user.lastSeen?.platform}</span></p>
                                    <p className="text-sm text-foreground/70">Device ID: <span className="text-foreground">{user.lastSeen?.deviceId}</span></p>
                                    <p className="text-sm text-foreground/70">IP: <span className="text-foreground">{user.lastSeen?.ip}</span></p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </>
                  ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
      {isProfileDialogOpen && selectedUser && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center">
          <UserProfileDialog 
            user={selectedUser} 
            onUserUpdate={handleUserUpdate}
            onClose={() => {
              setIsProfileDialogOpen(false);
              setSelectedUser(null);
            }}
          />
        </div>
      )}
    </div>
  );
}
