
// PocketBase client configuration
import PocketBase from 'pocketbase';

// Initialize the PocketBase client
// Replace this URL with your PocketBase instance URL when deployed
export const pocketbaseUrl = "http://127.0.0.1:8090";
export const pb = new PocketBase(pocketbaseUrl);

// Export types for PocketBase collections
export type Customer = {
  id: string;
  collectionId: string;
  collectionName: string;
  created: string;
  updated: string;
  full_name: string;
  phone_number: string;
  address: string;
  profile_picture?: string;
};

export type Agent = {
  id: string;
  collectionId: string;
  collectionName: string;
  created: string;
  updated: string;
  agent_code: string;
  full_name: string;
  phone_number: string;
  location: string;
  national_id: string;
  profile_picture?: string;
  online_status: boolean;
  earnings: number;
};

export type Order = {
  id: string;
  collectionId: string;
  collectionName: string;
  created: string;
  updated: string;
  customer_id: string;
  agent_id?: string;
  customer_name: string;
  customer_contact: string;
  delivery_address: string;
  description: string;
  status: 'available' | 'assigned' | 'on_transit' | 'delivered';
  delivery_code: string;
  amount?: number;
  delivery_fee?: number;
  location?: string;
  delivered_at?: string;
  confirmed_at?: string;
};

export type Message = {
  id: string;
  collectionId: string;
  collectionName: string;
  created: string;
  updated: string;
  order_id: string;
  sender_id: string;
  receiver_id: string;
  message_text: string;
};

// Helper function to check if user is authenticated
export const isAuthenticated = () => {
  return pb.authStore.isValid;
};

// Helper to get current user ID
export const getCurrentUserId = () => {
  return pb.authStore.model?.id || null;
};

// Helper to get current user data
export const getCurrentUser = () => {
  return pb.authStore.model;
};

// Helper to check if the user is an agent (based on collection name)
export const isAgent = () => {
  return pb.authStore.model?.collectionName === 'agents';
};

// Helper to check if the user is a customer
export const isCustomer = () => {
  return pb.authStore.model?.collectionName === 'customers';
};
