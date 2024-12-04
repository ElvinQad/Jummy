import { X, Bell } from "lucide-react"
import { motion } from "framer-motion"
import { Card } from "./ui/card"
import { Button } from "./ui/button"
import { format } from 'date-fns';
import { useNotificationStore } from '../lib/stores/notificationStore';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationModal: React.FC<NotificationModalProps> = ({ 
  isOpen, 
  onClose 
}) => {
  const { 
    notifications, 
    conversations,
    markAsRead, 
    markAllAsRead, 
    isLoading 
  } = useNotificationStore();

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className="relative w-full sm:w-[400px] mx-auto"
    >
      <Card className="w-full shadow-xl bg-background/98 backdrop-blur-sm">
        <div className="p-4 border-b">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">Notifications</h3>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Tabs defaultValue="notifications" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="notifications" className="flex-1">
              Notifications ({notifications?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="messages" className="flex-1">
              Messages ({conversations?.length || 0})
            </TabsTrigger>
          </TabsList>

          <div className="max-h-[60vh] overflow-y-auto p-4">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
              </div>
            ) : (
              <>
                <TabsContent value="notifications">
                  {!notifications?.length ? (
                    <p className="text-center text-muted-foreground py-8">
                      No notifications yet
                    </p>
                  ) : (
                    <div className="space-y-4">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => markAllAsRead('notification')}
                        className="w-full mb-2"
                      >
                        Mark all as read
                      </Button>
                      {notifications.map((notification) => (
                        <div 
                          key={notification.id}
                          className={`p-4 rounded-lg ${
                            notification.isRead ? 'bg-muted/50' : 'bg-accent'
                          } cursor-pointer`}
                          onClick={() => markAsRead('notification', notification.id)}
                        >
                          <h4 className="font-semibold">{notification.title}</h4>
                          <p className="text-sm text-muted-foreground">{notification.message}</p>
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(notification.createdAt), 'MMM d, yyyy HH:mm')}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="messages">
                  {!conversations?.length ? (
                    <p className="text-center text-muted-foreground py-8">
                      No messages yet
                    </p>
                  ) : (
                    <div className="space-y-4">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => markAllAsRead('message')}
                        className="w-full mb-2"
                      >
                        Mark all as read
                      </Button>
                      {conversations.map((conversation) => (
                        <div 
                          key={conversation.conversationId}
                          className={`p-4 rounded-lg ${
                            conversation.unreadCount > 0 ? 'bg-accent' : 'bg-muted/50'
                          } cursor-pointer`}
                          onClick={() => markAsRead('message', conversation.lastMessage.id)}
                        >
                          <div className="flex items-center gap-3 mb-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={conversation.lastMessage.sender.profile.avatar} />
                              <AvatarFallback>
                                {conversation.lastMessage.sender.profile.firstName[0]}
                                {conversation.lastMessage.sender.profile.lastName[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                              <span className="font-semibold">
                                {conversation.lastMessage.sender.profile.firstName} {conversation.lastMessage.sender.profile.lastName}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {format(new Date(conversation.lastMessage.createdAt), 'MMM d, yyyy HH:mm')}
                              </span>
                            </div>
                          </div>
                          <p className="text-sm pl-11">{conversation.lastMessage.content}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>
              </>
            )}
          </div>
        </Tabs>
      </Card>
    </motion.div>
  );
};

export default NotificationModal;
