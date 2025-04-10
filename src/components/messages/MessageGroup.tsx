
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tables } from '@/integrations/supabase/types';
import { Send } from 'lucide-react';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';

type Message = Tables<'messages'>;

interface MessageGroupProps {
  orderId: string;
  messages: Message[];
  orderDetails: Tables<'orders'> | null;
  agentId: string;
  onSendMessage: (orderId: string, receiverId: string, message: string) => Promise<{ success: boolean; error?: string }>;
}

const MessageGroup: React.FC<MessageGroupProps> = ({
  orderId,
  messages,
  orderDetails,
  agentId,
  onSendMessage,
}) => {
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);

  // Get customer ID from messages (assuming the first non-agent sender is the customer)
  const customerId = messages.find(m => m.sender_id !== agentId)?.sender_id || orderDetails?.customer_id;

  const handleSendMessage = async () => {
    if (!customerId) {
      toast.error('Cannot identify customer to reply to');
      return;
    }
    
    if (!newMessage.trim()) {
      toast.error('Message cannot be empty');
      return;
    }
    
    setSending(true);
    try {
      const result = await onSendMessage(orderId, customerId, newMessage);
      if (result.success) {
        setNewMessage('');
        toast.success('Message sent');
      } else {
        toast.error(`Failed to send message: ${result.error}`);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex justify-between items-center">
          <div>
            Order #{orderId.substring(0, 8)}
            {orderDetails && (
              <span className="ml-2 text-sm text-muted-foreground">
                ({orderDetails.status})
              </span>
            )}
          </div>
          {orderDetails && (
            <span className="text-sm font-normal text-muted-foreground">
              {formatDistanceToNow(new Date(orderDetails.created_at), { addSuffix: true })}
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="space-y-4">
          {messages.map((message) => (
            <div 
              key={message.id} 
              className={`flex ${message.sender_id === agentId ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex gap-2 max-w-[80%] ${message.sender_id === agentId ? 'flex-row-reverse' : ''}`}>
                <Avatar className="h-8 w-8">
                  <div className="h-full w-full flex items-center justify-center text-xs font-semibold">
                    {message.sender_id === agentId ? 'Me' : 'C'}
                  </div>
                </Avatar>
                <div className={`p-3 rounded-lg ${
                  message.sender_id === agentId 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-secondary'
                }`}>
                  <p>{message.message_text}</p>
                  <p className="text-xs mt-1 opacity-70">
                    {message.created_at && formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex w-full gap-2">
          <Textarea
            placeholder="Type your reply..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="min-h-[80px] flex-1"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.ctrlKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
          <Button 
            onClick={handleSendMessage} 
            disabled={sending || !newMessage.trim()} 
            size="icon" 
            className="h-10 w-10 shrink-0 self-end"
          >
            <Send size={18} />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default MessageGroup;
