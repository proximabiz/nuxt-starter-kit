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
      chargebee_item_price_details: {
        Row: {
          chargebee_item_price_id: string | null
          chargebee_plan_id: string | null
          created_at: string
          currency_code: string | null
          external_name: string | null
          id: string
          is_taxable: boolean | null
          name: string | null
          period_unit: string | null
          price: number | null
          pricing_model: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          chargebee_item_price_id?: string | null
          chargebee_plan_id?: string | null
          created_at?: string
          currency_code?: string | null
          external_name?: string | null
          id?: string
          is_taxable?: boolean | null
          name?: string | null
          period_unit?: string | null
          price?: number | null
          pricing_model?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          chargebee_item_price_id?: string | null
          chargebee_plan_id?: string | null
          created_at?: string
          currency_code?: string | null
          external_name?: string | null
          id?: string
          is_taxable?: boolean | null
          name?: string | null
          period_unit?: string | null
          price?: number | null
          pricing_model?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
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
          active_status: boolean | null
          created_at: string
          details: string | null
          diagram_identifier: string | null
          diagram_type_id: string | null
          id: string
          keywords: Json | null
          response: Json | null
          sub_type_id: string | null
          title: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          access?: Database['public']['Enums']['access']
          active_status?: boolean | null
          created_at?: string
          details?: string | null
          diagram_identifier?: string | null
          diagram_type_id?: string | null
          id?: string
          keywords?: Json | null
          response?: Json | null
          sub_type_id?: string | null
          title?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          access?: Database['public']['Enums']['access']
          active_status?: boolean | null
          created_at?: string
          details?: string | null
          diagram_identifier?: string | null
          diagram_type_id?: string | null
          id?: string
          keywords?: Json | null
          response?: Json | null
          sub_type_id?: string | null
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
            foreignKeyName: 'diagrams_sub_type_id_fkey'
            columns: ['sub_type_id']
            isOneToOne: false
            referencedRelation: 'subscription_type'
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
          chargebee_plan_id: string | null
          chargeebee_product_family_id: string | null
          created_at: string
          currency: string | null
          description: string
          features: Json | null
          id: string
          limit: number | null
          monthly_price: number
          name: string
          status: boolean
          updated_at: string
          yearly_price: number | null
        }
        Insert: {
          chargebee_plan_id?: string | null
          chargeebee_product_family_id?: string | null
          created_at?: string
          currency?: string | null
          description?: string
          features?: Json | null
          id?: string
          limit?: number | null
          monthly_price?: number
          name?: string
          status?: boolean
          updated_at?: string
          yearly_price?: number | null
        }
        Update: {
          chargebee_plan_id?: string | null
          chargeebee_product_family_id?: string | null
          created_at?: string
          currency?: string | null
          description?: string
          features?: Json | null
          id?: string
          limit?: number | null
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
            isOneToOne: true
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
      user_chargebee_details: {
        Row: {
          chargebee_payment_method_id: string | null
          chargebee_status: string | null
          chargebee_user_id: string | null
          created_at: string
          created_by: string | null
          gateway: string | null
          has_payment_method_active: boolean | null
          id: string
          payment_source_id: string | null
          updated_at: string | null
          updated_by: string | null
          user_id: string
        }
        Insert: {
          chargebee_payment_method_id?: string | null
          chargebee_status?: string | null
          chargebee_user_id?: string | null
          created_at?: string
          created_by?: string | null
          gateway?: string | null
          has_payment_method_active?: boolean | null
          id?: string
          payment_source_id?: string | null
          updated_at?: string | null
          updated_by?: string | null
          user_id: string
        }
        Update: {
          chargebee_payment_method_id?: string | null
          chargebee_status?: string | null
          chargebee_user_id?: string | null
          created_at?: string
          created_by?: string | null
          gateway?: string | null
          has_payment_method_active?: boolean | null
          id?: string
          payment_source_id?: string | null
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
            isOneToOne: true
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
      user_subscriptions: {
        Row: {
          amount: number
          auto_renew: boolean
          chargebee_payment_method_id: string | null
          chargebee_payment_status: string | null
          chargeebee_subscription_id: string | null
          created_at: string
          currency: string | null
          gateway: string | null
          id: string
          is_subscription_active: boolean | null
          note: string | null
          object: string | null
          payment_method_type: string | null
          payment_source_id: string | null
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
          chargebee_payment_method_id?: string | null
          chargebee_payment_status?: string | null
          chargeebee_subscription_id?: string | null
          created_at?: string
          currency?: string | null
          gateway?: string | null
          id?: string
          is_subscription_active?: boolean | null
          note?: string | null
          object?: string | null
          payment_method_type?: string | null
          payment_source_id?: string | null
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
          chargebee_payment_method_id?: string | null
          chargebee_payment_status?: string | null
          chargeebee_subscription_id?: string | null
          created_at?: string
          currency?: string | null
          gateway?: string | null
          id?: string
          is_subscription_active?: boolean | null
          note?: string | null
          object?: string | null
          payment_method_type?: string | null
          payment_source_id?: string | null
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
      get_diagrams_list: {
        Args: {
          userid: string
        }
        Returns: {
          id: string
          user_id: string
          diagram_type_id: string
          title: string
          keywords: Json
          details: string
          access: Database['public']['Enums']['access']
          diagram_identifier: string
          active_status: boolean
          plan_name: string
          response: Json
          created_at: string
          updated_at: string
        }[]
      }
      get_user_address_details: {
        Args: {
          param_user_id: string
        }
        Returns: {
          country: string
          zip_code: string
          city: string
          region: string
          address: string
          phone_number: string
          name: string
          organisation_name: string
          gst_number: string
        }[]
      }
      get_user_subscription: {
        Args: {
          userid: string
        }
        Returns: Database['public']['CompositeTypes']['subscription_info']
      }
      insert_or_update_user_address_details_new: {
        Args: {
          param_country: string
          param_zip_code: string
          param_city: string
          param_region: string
          param_address: string
          param_phone_number: string
          param_name: string
          param_organisation_name: string
          param_user_id: string
        }
        Returns: string
      }
      insert_or_updte_user_address_details: {
        Args: {
          param_country: string
          param_zip_code: string
          param_city: string
          param_region: string
          param_address: string
          param_phone_number: string
          param_name: string
          param_organisation_name: string
          param_user_id: string
        }
        Returns: undefined
      }
    }
    Enums: {
      access: 'public' | 'private'
    }
    CompositeTypes: {
      subscription_info: {
        id: string | null
        user_id: string | null
        amount: number | null
        plan_start_date: string | null
        plan_end_date: string | null
        auto_renew: boolean | null
        is_subscription_active: boolean | null
        sub_key: string | null
        sub_type_id: string | null
        name: string | null
        description: string | null
        monthly_price: number | null
        status: boolean | null
        features: Json | null
        yearly_price: number | null
        plan_type: string | null
        subscription_status: string | null
      }
      subscription_info_test: {
        id: string | null
        user_id: string | null
        amount: number | null
        plan_start_date: string | null
        plan_end_date: string | null
        auto_renew: boolean | null
        is_subscription_active: boolean | null
        sub_key: string | null
        name: string | null
        description: string | null
        monthly_price: number | null
        status: boolean | null
        features: Json | null
        yearly_price: number | null
        subscription_status: string | null
        plan_type: string | null
      }
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, 'public'>]

export type Tables<
  PublicTableNameOrOptions extends
  | keyof (PublicSchema['Tables'] & PublicSchema['Views'])
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
  : PublicTableNameOrOptions extends keyof (PublicSchema['Tables'] &
  PublicSchema['Views'])
    ? (PublicSchema['Tables'] &
    PublicSchema['Views'])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
        ? R
        : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
  | keyof PublicSchema['Tables']
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
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
      Insert: infer I
    }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
  | keyof PublicSchema['Tables']
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
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
      Update: infer U
    }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
  | keyof PublicSchema['Enums']
  | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema['Enums']
    ? PublicSchema['Enums'][PublicEnumNameOrOptions]
    : never
