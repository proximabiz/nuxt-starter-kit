export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      diagram_type: {
        Row: {
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          name: string
          status: boolean
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          name: string
          status?: boolean
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
          status?: boolean
          updated_at?: string | null
        }
        Relationships: []
      }
      diagram_version: {
        Row: {
          created_at: string
          details: string | null
          diagram_id: string | null
          id: string
          response: Json | null
          updated_at: string | null
          user_id: string | null
          versions: string | null
        }
        Insert: {
          created_at?: string
          details?: string | null
          diagram_id?: string | null
          id?: string
          response?: Json | null
          updated_at?: string | null
          user_id?: string | null
          versions?: string | null
        }
        Update: {
          created_at?: string
          details?: string | null
          diagram_id?: string | null
          id?: string
          response?: Json | null
          updated_at?: string | null
          user_id?: string | null
          versions?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'public_diagram_version_diagram_id_fkey'
            columns: ['diagram_id']
            isOneToOne: false
            referencedRelation: 'diagrams'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'public_diagram_version_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
      diagrams: {
        Row: {
          access: Database['public']['Enums']['access']
          created_at: string
          details: string | null
          diagram_identifier: string | null
          diagram_type_id: string | null
          id: string
          keywords: Json | null
          response: Json | null
          title: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          access?: Database['public']['Enums']['access']
          created_at?: string
          details?: string | null
          diagram_identifier?: string | null
          diagram_type_id?: string | null
          id?: string
          keywords?: Json | null
          response?: Json | null
          title?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          access?: Database['public']['Enums']['access']
          created_at?: string
          details?: string | null
          diagram_identifier?: string | null
          diagram_type_id?: string | null
          id?: string
          keywords?: Json | null
          response?: Json | null
          title?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'diagrams_diagram_type_id_fkey'
            columns: ['diagram_type_id']
            isOneToOne: false
            referencedRelation: 'diagram_type'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'diagrams_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
      subscription_type: {
        Row: {
          created_at: string
          currency: string | null
          description: string
          features: Json | null
          id: string
          monthly_price: number
          name: string
          status: boolean
          updated_at: string
          yearly_price: number | null
        }
        Insert: {
          created_at?: string
          currency?: string | null
          description?: string
          features?: Json | null
          id?: string
          monthly_price?: number
          name?: string
          status?: boolean
          updated_at?: string
          yearly_price?: number | null
        }
        Update: {
          created_at?: string
          currency?: string | null
          description?: string
          features?: Json | null
          id?: string
          monthly_price?: number
          name?: string
          status?: boolean
          updated_at?: string
          yearly_price?: number | null
        }
        Relationships: []
      }
      user_address_details: {
        Row: {
          address: string
          city: string
          country: string
          created_at: string
          id: string
          is_active: boolean
          phone_number: string | null
          region: string
          updated_at: string
          user_id: string | null
          zip_code: string
        }
        Insert: {
          address?: string
          city?: string
          country?: string
          created_at?: string
          id?: string
          is_active?: boolean
          phone_number?: string | null
          region?: string
          updated_at?: string
          user_id?: string | null
          zip_code?: string
        }
        Update: {
          address?: string
          city?: string
          country?: string
          created_at?: string
          id?: string
          is_active?: boolean
          phone_number?: string | null
          region?: string
          updated_at?: string
          user_id?: string | null
          zip_code?: string
        }
        Relationships: [
          {
            foreignKeyName: 'public_user_address_details_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
      user_details: {
        Row: {
          created_at: string
          gst_number: string | null
          id: string
          is_active: boolean
          name: string
          organisation_name: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          gst_number?: string | null
          id?: string
          is_active?: boolean
          name?: string
          organisation_name?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          gst_number?: string | null
          id?: string
          is_active?: boolean
          name?: string
          organisation_name?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'public_user_details_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
      user_stripe_details: {
        Row: {
          created_at: string
          created_by: string | null
          has_payment_method_active: boolean | null
          id: string
          stripe_payment_method_id: string | null
          stripe_user_id: string | null
          updated_at: string | null
          updated_by: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          has_payment_method_active?: boolean | null
          id?: string
          stripe_payment_method_id?: string | null
          stripe_user_id?: string | null
          updated_at?: string | null
          updated_by?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          has_payment_method_active?: boolean | null
          id?: string
          stripe_payment_method_id?: string | null
          stripe_user_id?: string | null
          updated_at?: string | null
          updated_by?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'public_user_stripe_details_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
      user_subscriptions: {
        Row: {
          amount: number
          auto_renew: boolean
          created_at: string
          currency: string | null
          id: string
          is_subscription_active: boolean | null
          note: string | null
          plan_end_date: string
          plan_start_date: string
          plan_type: string | null
          sub_key: string | null
          sub_type_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amount?: number
          auto_renew?: boolean
          created_at?: string
          currency?: string | null
          id?: string
          is_subscription_active?: boolean | null
          note?: string | null
          plan_end_date: string
          plan_start_date: string
          plan_type?: string | null
          sub_key?: string | null
          sub_type_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          auto_renew?: boolean
          created_at?: string
          currency?: string | null
          id?: string
          is_subscription_active?: boolean | null
          note?: string | null
          plan_end_date?: string
          plan_start_date?: string
          plan_type?: string | null
          sub_key?: string | null
          sub_type_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'public_user_subscriptions_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'user_subscriptions_sub_type_id_fkey'
            columns: ['sub_type_id']
            isOneToOne: false
            referencedRelation: 'subscription_type'
            referencedColumns: ['id']
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_diagram_versions: {
        Args: {
          diagramid: string
        }
        Returns: {
          id: string
          diagram_id: string
          user_id: string
          name: string
          versions: string
          response: Json
          created_at: string
          updated_at: string
        }[]
      }
      get_diagram_versions_test: {
        Args: {
          diagram_id: string
        }
        Returns: {
          id: string
          digram: string
          user_id: string
          name: string
          versions: string
          response: Json
          created_at: string
          updated_at: string
        }[]
      }
      get_user_subscription: {
        Args: {
          userid: string
        }
        Returns: Database['public']['CompositeTypes']['subscription_info']
      }
      get_user_subscription_old: {
        Args: {
          userid: string
        }
        Returns: {
          id: string
          user_id: string
          amount: number
          plan_start_date: string
          plan_end_date: string
          auto_renew: boolean
          is_subscription_active: boolean
          sub_key: string
          name: string
          description: string
          monthly_price: number
          status: boolean
          features: Json
          yearly_price: number
        }[]
      }
    }
    Enums: {
      access: 'public' | 'private'
    }
    CompositeTypes: {
      subscription_info: {
        id: string
        user_id: string
        amount: number
        plan_start_date: string
        plan_end_date: string
        auto_renew: boolean
        is_subscription_active: boolean
        sub_key: string
        name: string
        description: string
        monthly_price: number
        status: boolean
        features: Json
        yearly_price: number
        subscription_status: string
      }
    }
  }
}

export type Tables<
  PublicTableNameOrOptions extends
  | keyof (Database['public']['Tables'] & Database['public']['Views'])
  | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
    Database[PublicTableNameOrOptions['schema']]['Views'])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
  Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R
    }
      ? R
      : never
  : PublicTableNameOrOptions extends keyof (Database['public']['Tables'] &
  Database['public']['Views'])
    ? (Database['public']['Tables'] &
    Database['public']['Views'])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
        ? R
        : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
  | keyof Database['public']['Tables']
  | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
    Insert: infer I
  }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database['public']['Tables']
    ? Database['public']['Tables'][PublicTableNameOrOptions] extends {
      Insert: infer I
    }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
  | keyof Database['public']['Tables']
  | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
    Update: infer U
  }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database['public']['Tables']
    ? Database['public']['Tables'][PublicTableNameOrOptions] extends {
      Update: infer U
    }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
  | keyof Database['public']['Enums']
  | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
  : PublicEnumNameOrOptions extends keyof Database['public']['Enums']
    ? Database['public']['Enums'][PublicEnumNameOrOptions]
    : never
