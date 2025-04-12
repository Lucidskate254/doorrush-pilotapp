
import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuthCheck } from '@/hooks/useAuthCheck';
import { useAgentMessages } from '@/hooks/useAgentMessages';
import MessageGroup from '@/components/messages/MessageGroup';
import { Card, CardContent } from '@/components/ui/card';
import { MessageCircle } from 'lucide-react';

const Messages = () => {
  const { userId, agentData, isLoading } = useAuthCheck();
  const { 
    groupedMessages, 
    loading: loadingMessages, 
    error,
    sendMessage
  } = useAgentMessages(userId);

  // Handle loading states
  if (isLoading || loadingMessages) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-[50vh]">
          <div className="animate-pulse text-center">
            <p>Loading messages...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Handle error states
  if (error) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-[50vh]">
          <div className="text-center text-destructive">
            <p>Error loading messages: {error}</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const orderIds = Object.keys(groupedMessages);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Messages</h1>
          <p className="text-muted-foreground">
            View and reply to messages from customers
          </p>
        </div>

        {orderIds.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-10 text-center">
              <MessageCircle className="h-12 w-12 text-muted-foreground mb-3 opacity-50" />
              <h3 className="font-semibold text-lg">No messages yet</h3>
              <p className="text-muted-foreground max-w-md mt-1">
                When customers send you messages about their orders, they will appear here.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {orderIds.map((orderId) => (
              <MessageGroup
                key={orderId}
                orderId={orderId}
                messages={groupedMessages[orderId].messages}
                orderDetails={groupedMessages[orderId].orderDetails}
              />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Messages;
