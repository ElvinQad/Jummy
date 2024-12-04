import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { useState, useEffect } from "react";
import { api } from "../../../lib/axios";
import { useToast } from "../../../components/ui/use-toast";
import { Badge } from "../../../components/ui/badge";
import { UserCircle, Loader2 } from "lucide-react";
import { User } from "@jummy/shared-types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs";
import { format } from "date-fns";

interface UserProfileDialogProps {
  user: User;
  onUserUpdate: (updatedUser: User) => void;
  onClose: () => void;
}
export function UserProfileDialog({ user, onUserUpdate, onClose }: UserProfileDialogProps) {
  const [loading, setLoading] = useState(true);
  const [detailedUser, setDetailedUser] = useState<DetailedUser | null>(null);
  const [formData, setFormData] = useState({
    firstName: user?.profile?.firstName || '',
    lastName: user?.profile?.lastName || '',
    phone: user?.phone || '',
    email: user?.email || '',
    businessName: user?.cookProfile?.businessName || '',
    description: user?.cookProfile?.description || '',
    location: user?.cookProfile?.location || ''
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchUserDetails();
  }, [user.id]);

  const fetchUserDetails = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/admin/users/${user.id}`);
      setDetailedUser(data);
      setFormData({
        firstName: data.profile?.firstName || '',
        lastName: data.profile?.lastName || '',
        phone: data.phone || '',
        email: data.email || '',
        businessName: data.cookProfile?.businessName || '',
        description: data.cookProfile?.description || '',
        location: data.cookProfile?.location || ''
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch user details"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const { data } = await api.put(`/admin/users/${user.id}`, formData);
      onUserUpdate(data);
      toast({ title: "Success", description: "Profile updated successfully" });
      onClose();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response?.data?.message || "Failed to update profile"
      });
    }
  };

  if (loading) {
    return (
      <div className="p-4 flex items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="bg-background/95 dark:bg-background/95 backdrop-blur-xl max-h-[80vh] overflow-auto p-6 rounded-xl shadow-2xl border border-border">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center ring-2 ring-ring/30">
          {detailedUser?.profile?.avatar ? (
            <img src={detailedUser.profile.avatar} alt="Profile" className="w-full h-full rounded-full object-cover"/>
          ) : (
            <UserCircle className="w-8 h-8 text-muted-foreground" />
          )}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">
            {detailedUser?.profile?.firstName} {detailedUser?.profile?.lastName}
          </h3>
          <div className="flex gap-2">
            {detailedUser?.isChef && (
              <Badge variant="secondary">Chef</Badge>
            )}
            <Badge variant="outline">{detailedUser?.status}</Badge>
          </div>
        </div>
      </div>

      <Tabs defaultValue="profile" className="mt-6">
        <TabsList className="grid w-full grid-cols-5 bg-muted rounded-lg p-1">
          <TabsTrigger 
            value="profile"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >Profile</TabsTrigger>
          <TabsTrigger 
            value="addresses"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >Addresses ({detailedUser?.profile?.addresses?.length || 0})</TabsTrigger>
          <TabsTrigger 
            value="orders"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >Orders ({detailedUser?.orders?.length || 0})</TabsTrigger>
          <TabsTrigger 
            value="notifications"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >Notifications ({detailedUser?.notifications?.length || 0})</TabsTrigger>
          <TabsTrigger 
            value="messages"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >Messages ({detailedUser?.sentMessages?.length || 0})</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <form onSubmit={handleSubmit}>
            <table className="w-full border-collapse">
              <tbody className="divide-y divide-border">
                <tr>
                  <td className="py-2 px-3 text-sm text-muted-foreground">First Name</td>
                  <td className="py-2 px-3">
                    <Input
                      value={formData.firstName}
                      onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                      className="h-9 text-sm bg-muted/50"
                    />
                  </td>
                  <td className="py-2 px-3 text-sm text-muted-foreground">Last Name</td>
                  <td className="py-2 px-3">
                    <Input
                      value={formData.lastName}
                      onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                      className="h-9 text-sm bg-muted/50"
                    />
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-3 text-sm text-muted-foreground">Email</td>
                  <td className="py-2 px-3">
                    <Input
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className="h-9 text-sm bg-muted/50"
                    />
                  </td>
                  <td className="py-2 px-3 text-sm text-muted-foreground">Phone</td>
                  <td className="py-2 px-3">
                    <Input
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      className="h-9 text-sm bg-muted/50"
                    />
                  </td>
                </tr>
                {detailedUser?.isChef && (
                  <>
                    <tr>
                      <td className="py-2 px-3 text-sm text-muted-foreground">Business Name</td>
                      <td className="py-2 px-3">
                        <Input
                          value={formData.businessName}
                          onChange={(e) => setFormData(prev => ({ ...prev, businessName: e.target.value }))}
                          className="h-9 text-sm bg-muted/50"
                        />
                      </td>
                      <td className="py-2 px-3 text-sm text-muted-foreground">Location</td>
                      <td className="py-2 px-3">
                        <Input
                          value={formData.location}
                          onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                          className="h-9 text-sm bg-muted/50"
                        />
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 text-sm text-muted-foreground">Stats</td>
                      <td colSpan={3} className="py-2 px-3">
                        <div className="flex gap-6">
                          <span className="text-sm bg-muted/50 px-3 py-1 rounded-md">
                            <span className="text-muted-foreground">Orders:</span>{" "}
                            <span className="text-foreground">{detailedUser?.orders?.length || 0}</span>
                          </span>
                          <span className="text-sm bg-muted/50 px-3 py-1 rounded-md">
                            <span className="text-muted-foreground">Rating:</span>{" "}
                            <span className="text-foreground">{detailedUser?.cookProfile?.rating || 0}</span>
                          </span>
                          <span className="text-sm bg-muted/50 px-3 py-1 rounded-md">
                            <span className="text-muted-foreground">Earnings:</span>{" "}
                            <span className="text-foreground">${detailedUser?.cookProfile?.totalEarnings || 0}</span>
                          </span>
                        </div>
                      </td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>

            {/* Actions */}
            <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-border">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
                className="h-9 text-sm"
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                className="h-9 text-sm"
              >
                Save
              </Button>
            </div>
          </form>
        </TabsContent>

        <TabsContent value="addresses">
          <div className="space-y-4">
            {detailedUser?.profile?.addresses?.map(address => (
              <div key={address.id} className="p-4 bg-muted/50 rounded-lg border border-border">
                <div className="flex justify-between items-center mb-2">
                  <Badge variant="secondary">{address.title}</Badge>
                  {address.isDefault && (
                    <Badge variant="outline">Default</Badge>
                  )}
                </div>
                <p className="text-foreground">{address.addressLine1}</p>
                {address.addressLine2 && <p className="text-muted-foreground text-sm">{address.addressLine2}</p>}
                <p className="text-muted-foreground text-sm">{`${address.city}, ${address.district}`}</p>
                <div className="mt-2 text-xs text-muted-foreground">
                  Coordinates: {address.latitude}, {address.longitude}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="orders">
          <div className="space-y-4">
            {detailedUser?.orders?.map(order => (
              <div key={order.id} className="p-4 bg-muted/50 rounded-lg border border-border hover:border-border/80 transition-colors">
                <div className="flex justify-between items-center mb-2">
                  <Badge variant="outline">{order.status}</Badge>
                  <span className="text-sm text-muted-foreground">
                    {format(new Date(order.createdAt), 'MMM dd, yyyy HH:mm')}
                  </span>
                </div>
                <p className="text-foreground font-medium">Total: ${order.totalAmount}</p>
                <p className="text-sm text-muted-foreground">{order.deliveryDetails.address}</p>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="notifications">
          <div className="space-y-4">
            {detailedUser?.notifications?.map(notification => (
              <div key={notification.id} className="p-4 bg-muted/50 rounded-lg border border-border">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <Badge 
                      variant="secondary" 
                      className={
                        notification.type === 'SYSTEM' ? 'bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100' : 
                        notification.type === 'SUBSCRIPTION' ? 'bg-green-100 dark:bg-green-900 text-green-900 dark:text-green-100' : 
                        'bg-muted'
                      }
                    >
                      {notification.type}
                    </Badge>
                    {!notification.isRead && (
                      <Badge variant="destructive" className="ml-2">New</Badge>
                    )}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {format(new Date(notification.createdAt), 'MMM dd, yyyy HH:mm')}
                  </span>
                </div>
                <h4 className="text-foreground font-medium">{notification.title}</h4>
                <p className="text-sm text-muted-foreground">{notification.message}</p>
                {notification.data && (
                  <div className="mt-2 text-xs text-muted-foreground">
                    {JSON.stringify(notification.data)}
                  </div>
                )}
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="messages">
          <div className="space-y-4">
            {detailedUser?.sentMessages?.map(message => (
              <div key={message.id} className="p-4 bg-muted/50 rounded-lg border border-border hover:border-border/80 transition-colors">
                <div className="flex justify-between items-center mb-2">
                  <Badge variant={message.isRead ? 'outline' : 'secondary'}>
                    {message.isRead ? 'Read' : 'Unread'}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {format(new Date(message.createdAt), 'MMM dd, yyyy HH:mm')}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{message.content}</p>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
