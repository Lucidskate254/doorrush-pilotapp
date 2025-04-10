
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';

type Message = Tables<'messages'> & {
  order_details?: Tables<'orders'>;
};

type GroupedMessages = {
  [orderId: string]: {
    messages: Message[];
    orderDetails: Tables<'orders'> | null;
  };
};

export const useAgentMessages = (agentId: string | null) => {
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [groupedMessages, setGroupedMessages] = useState<GroupedMessages>({});
  const [error, setError] = useState<string | null>(null);

  // Fetch all messages where the agent is the receiver
  useEffect(() => {
    if (!agentId) return;

    const fetchMessages = async () => {
      try {
        setLoading(true);
        
        // Get all messages where the agent is the receiver or sender
        const { data, error } = await supabase
          .from('messages')
          .select(`
            *,
            order_details:orders(*)
          `)
          .or(`receiver_id.eq.${agentId},sender_id.eq.${agentId}`)
          .order('created_at', { ascending: false });

        if (error) {
          throw error;
        }

        if (data) {
          setMessages(data as Message[]);
          
          // Group messages by order_id
          const grouped: GroupedMessages = {};
          data.forEach((message: Message) => {
            if (!grouped[message.order_id]) {
              grouped[message.order_id] = {
                messages: [],
                orderDetails: message.order_details || null,
              };
            }
            grouped[message.order_id].messages.push(message);
          });
          
          // Sort messages within each group by creation date
          Object.keys(grouped).forEach(orderId => {
            grouped[orderId].messages.sort((a, b) => {
              return new Date(a.created_at || '').getTime() - new Date(b.created_at || '').getTime();
            });
          });
          
          setGroupedMessages(grouped);
        }
      } catch (error: any) {
        console.error('Error fetching messages:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [agentId]);

  // Send a new message
  const sendMessage = async (orderId: string, receiverId: string, messageText: string) => {
    if (!agentId || !receiverId || !messageText.trim()) {
      return { success: false, error: 'Missing required information' };
    }

    try {
      const { data, error } = await supabase
        .from('messages')
        .insert({
          order_id: orderId,
          sender_id: agentId,
          receiver_id: receiverId,
          message_text: messageText.trim(),
        })
        .select('*');

      if (error) {
        throw error;
      }

      // Update the local state with the new message
      if (data && data.length > 0) {
        const newMessage = data[0] as Message;
        setMessages(prev => [...prev, newMessage]);
        
        // Update grouped messages
        setGroupedMessages(prev => {
          const updated = { ...prev };
          if (!updated[orderId]) {
            updated[orderId] = {
              messages: [],
              orderDetails: null,
            };
          }
          updated[orderId].messages.push(newMessage);
          
          // Re-sort messages by creation date
          updated[orderId].messages.sort((a, b) => {
            return new Date(a.created_at || '').getTime() - new Date(b.created_at || '').getTime();
          });
          
          return updated;
        });
      }

      return { success: true };
    } catch (error: any) {
      console.error('Error sending message:', error);
      return { success: false, error: error.message };
    }
  };

  return {
    loading,
    messages,
    groupedMessages,
    error,
    sendMessage,
  };
};
