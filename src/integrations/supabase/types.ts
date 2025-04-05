export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      agents: {
        Row: {
          agent_code: string
          created_at: string
          earnings: number | null
          full_name: string
          id: string
          location: string
          national_id: string
          online_status: boolean | null
          phone_number: string
          profile_picture: string | null
        }
        Insert: {
          agent_code: string
          created_at?: string
          earnings?: number | null
          full_name: string
          id: string
          location: string
          national_id: string
          online_status?: boolean | null
          phone_number: string
          profile_picture?: string | null
        }
        Update: {
          agent_code?: string
          created_at?: string
          earnings?: number | null
          full_name?: string
          id?: string
          location?: string
          national_id?: string
          online_status?: boolean | null
          phone_number?: string
          profile_picture?: string | null
        }
        Relationships: []
      }
      customers: {
        Row: {
          address: string
          created_at: string
          full_name: string
          id: string
          password_hash: string | null
          phone_number: string
          profile_picture: string | null
        }
        Insert: {
          address: string
          created_at?: string
          full_name: string
          id: string
          password_hash?: string | null
          phone_number: string
          profile_picture?: string | null
        }
        Update: {
          address?: string
          created_at?: string
          full_name?: string
          id?: string
          password_hash?: string | null
          phone_number?: string
          profile_picture?: string | null
        }
        Relationships: []
      }
      orders: {
        Row: {
          agent_id: string | null
          amount: number | null
          created_at: string
          customer_contact: string
          customer_id: string
          customer_name: string
          delivered_at: string | null
          delivery_address: string
          delivery_code: string
          delivery_fee: number | null
          description: string
          id: string
          location: string | null
          status: string
          updated_at: string
        }
        Insert: {
          agent_id?: string | null
          amount?: number | null
          created_at?: string
          customer_contact: string
          customer_id: string
          customer_name: string
          delivered_at?: string | null
          delivery_address: string
          delivery_code: string
          delivery_fee?: number | null
          description: string
          id?: string
          location?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          agent_id?: string | null
          amount?: number | null
          created_at?: string
          customer_contact?: string
          customer_id?: string
          customer_name?: string
          delivered_at?: string | null
          delivery_address?: string
          delivery_code?: string
          delivery_fee?: number | null
          description?: string
          id?: string
          location?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
        ]
      }
      tips: {
        Row: {
          agent_id: string
          amount: number
          created_at: string
          customer_id: string | null
          id: string
        }
        Insert: {
          agent_id: string
          amount: number
          created_at?: string
          customer_id?: string | null
          id?: string
        }
        Update: {
          agent_id?: string
          amount?: number
          created_at?: string
          customer_id?: string | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tips_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
        ]
      }
      withdrawals: {
        Row: {
          agent_id: string
          amount: number
          created_at: string
          id: string
          phone_number: string
          processed_at: string | null
          status: string
        }
        Insert: {
          agent_id: string
          amount: number
          created_at?: string
          id?: string
          phone_number: string
          processed_at?: string | null
          status?: string
        }
        Update: {
          agent_id?: string
          amount?: number
          created_at?: string
          id?: string
          phone_number?: string
          processed_at?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "withdrawals_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
