export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      bundle_components: {
        Row: {
          bundle_id: string
          component_type: string
          created_at: string
          customer_choice: boolean
          display_label: string | null
          group_id: string | null
          id: string
          product_id: string | null
          quantity: number
          required: boolean
          sort_order: number
          substitution_mode: string
          updated_at: string
        }
        Insert: {
          bundle_id: string
          component_type?: string
          created_at?: string
          customer_choice?: boolean
          display_label?: string | null
          group_id?: string | null
          id?: string
          product_id?: string | null
          quantity?: number
          required?: boolean
          sort_order?: number
          substitution_mode?: string
          updated_at?: string
        }
        Update: {
          bundle_id?: string
          component_type?: string
          created_at?: string
          customer_choice?: boolean
          display_label?: string | null
          group_id?: string | null
          id?: string
          product_id?: string | null
          quantity?: number
          required?: boolean
          sort_order?: number
          substitution_mode?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bundle_components_bundle_id_fkey"
            columns: ["bundle_id"]
            isOneToOne: false
            referencedRelation: "bundles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bundle_components_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "substitution_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bundle_components_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      bundle_fulfillments: {
        Row: {
          bundle_id: string | null
          bundle_name: string
          created_at: string
          id: string
          order_reference: string | null
          selections: Json
        }
        Insert: {
          bundle_id?: string | null
          bundle_name: string
          created_at?: string
          id?: string
          order_reference?: string | null
          selections?: Json
        }
        Update: {
          bundle_id?: string | null
          bundle_name?: string
          created_at?: string
          id?: string
          order_reference?: string | null
          selections?: Json
        }
        Relationships: [
          {
            foreignKeyName: "bundle_fulfillments_bundle_id_fkey"
            columns: ["bundle_id"]
            isOneToOne: false
            referencedRelation: "bundles"
            referencedColumns: ["id"]
          },
        ]
      }
      bundles: {
        Row: {
          archived: boolean
          blocking_item: string | null
          category: string
          created_at: string
          description: string | null
          id: string
          image_key: string
          is_visible: boolean
          manual_hidden: boolean
          name: string
          notes: string | null
          original_price: number | null
          own_quantity: number
          price: number
          savings_label: string | null
          slug: string
          sort_order: number
          status: string
          surprise_mode: boolean
          track_own_inventory: boolean
          updated_at: string
        }
        Insert: {
          archived?: boolean
          blocking_item?: string | null
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          image_key?: string
          is_visible?: boolean
          manual_hidden?: boolean
          name: string
          notes?: string | null
          original_price?: number | null
          own_quantity?: number
          price?: number
          savings_label?: string | null
          slug: string
          sort_order?: number
          status?: string
          surprise_mode?: boolean
          track_own_inventory?: boolean
          updated_at?: string
        }
        Update: {
          archived?: boolean
          blocking_item?: string | null
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          image_key?: string
          is_visible?: boolean
          manual_hidden?: boolean
          name?: string
          notes?: string | null
          original_price?: number | null
          own_quantity?: number
          price?: number
          savings_label?: string | null
          slug?: string
          sort_order?: number
          status?: string
          surprise_mode?: boolean
          track_own_inventory?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      customer_profiles: {
        Row: {
          billing_address: string | null
          completed_orders: number
          created_at: string
          email: string
          first_order_date: string | null
          flag_reason: string | null
          flagged_for_review: boolean
          id: string
          newsletter_subscriber: boolean
          phone: string | null
          redemption_date: string | null
          shipping_address: string | null
          updated_at: string
          user_id: string | null
          welcome_discount_sent: boolean
          welcome_discount_sent_at: string | null
        }
        Insert: {
          billing_address?: string | null
          completed_orders?: number
          created_at?: string
          email: string
          first_order_date?: string | null
          flag_reason?: string | null
          flagged_for_review?: boolean
          id?: string
          newsletter_subscriber?: boolean
          phone?: string | null
          redemption_date?: string | null
          shipping_address?: string | null
          updated_at?: string
          user_id?: string | null
          welcome_discount_sent?: boolean
          welcome_discount_sent_at?: string | null
        }
        Update: {
          billing_address?: string | null
          completed_orders?: number
          created_at?: string
          email?: string
          first_order_date?: string | null
          flag_reason?: string | null
          flagged_for_review?: boolean
          id?: string
          newsletter_subscriber?: boolean
          phone?: string | null
          redemption_date?: string | null
          shipping_address?: string | null
          updated_at?: string
          user_id?: string | null
          welcome_discount_sent?: boolean
          welcome_discount_sent_at?: string | null
        }
        Relationships: []
      }
      discount_codes: {
        Row: {
          active: boolean
          amount: number
          code: string
          created_at: string
          description: string | null
          discount_type: string
          eligible_categories: string[]
          excluded_slugs: string[]
          expires_at: string | null
          first_order_only: boolean
          id: string
          min_purchase: number
          stackable: boolean
          updated_at: string
        }
        Insert: {
          active?: boolean
          amount?: number
          code: string
          created_at?: string
          description?: string | null
          discount_type?: string
          eligible_categories?: string[]
          excluded_slugs?: string[]
          expires_at?: string | null
          first_order_only?: boolean
          id?: string
          min_purchase?: number
          stackable?: boolean
          updated_at?: string
        }
        Update: {
          active?: boolean
          amount?: number
          code?: string
          created_at?: string
          description?: string | null
          discount_type?: string
          eligible_categories?: string[]
          excluded_slugs?: string[]
          expires_at?: string | null
          first_order_only?: boolean
          id?: string
          min_purchase?: number
          stackable?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      discount_redemptions: {
        Row: {
          billing_address: string | null
          code: string
          created_at: string
          customer_id: string | null
          discount_amount: number
          email: string
          flag_reason: string | null
          flagged: boolean
          id: string
          order_reference: string | null
          order_subtotal: number
          phone: string | null
          shipping_address: string | null
        }
        Insert: {
          billing_address?: string | null
          code: string
          created_at?: string
          customer_id?: string | null
          discount_amount?: number
          email: string
          flag_reason?: string | null
          flagged?: boolean
          id?: string
          order_reference?: string | null
          order_subtotal?: number
          phone?: string | null
          shipping_address?: string | null
        }
        Update: {
          billing_address?: string | null
          code?: string
          created_at?: string
          customer_id?: string | null
          discount_amount?: number
          email?: string
          flag_reason?: string | null
          flagged?: boolean
          id?: string
          order_reference?: string | null
          order_subtotal?: number
          phone?: string | null
          shipping_address?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "discount_redemptions_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customer_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      email_send_log: {
        Row: {
          created_at: string
          error_message: string | null
          id: string
          message_id: string | null
          metadata: Json | null
          recipient_email: string
          status: string
          template_name: string
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          id?: string
          message_id?: string | null
          metadata?: Json | null
          recipient_email: string
          status: string
          template_name: string
        }
        Update: {
          created_at?: string
          error_message?: string | null
          id?: string
          message_id?: string | null
          metadata?: Json | null
          recipient_email?: string
          status?: string
          template_name?: string
        }
        Relationships: []
      }
      email_send_state: {
        Row: {
          auth_email_ttl_minutes: number
          batch_size: number
          id: number
          retry_after_until: string | null
          send_delay_ms: number
          transactional_email_ttl_minutes: number
          updated_at: string
        }
        Insert: {
          auth_email_ttl_minutes?: number
          batch_size?: number
          id?: number
          retry_after_until?: string | null
          send_delay_ms?: number
          transactional_email_ttl_minutes?: number
          updated_at?: string
        }
        Update: {
          auth_email_ttl_minutes?: number
          batch_size?: number
          id?: number
          retry_after_until?: string | null
          send_delay_ms?: number
          transactional_email_ttl_minutes?: number
          updated_at?: string
        }
        Relationships: []
      }
      email_template_settings: {
        Row: {
          id: string
          settings: Json
          template_name: string
          updated_at: string
        }
        Insert: {
          id?: string
          settings?: Json
          template_name: string
          updated_at?: string
        }
        Update: {
          id?: string
          settings?: Json
          template_name?: string
          updated_at?: string
        }
        Relationships: []
      }
      email_unsubscribe_tokens: {
        Row: {
          created_at: string
          email: string
          id: string
          token: string
          used_at: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          token: string
          used_at?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          token?: string
          used_at?: string | null
        }
        Relationships: []
      }
      inventory_log: {
        Row: {
          action: string
          changed_by: string | null
          changed_by_email: string | null
          created_at: string
          id: string
          note: string | null
          product_id: string | null
          product_name: string
          quantity_added: number
          quantity_after: number | null
          quantity_before: number | null
          quantity_sold: number
          sku: string | null
          status_after: string | null
        }
        Insert: {
          action: string
          changed_by?: string | null
          changed_by_email?: string | null
          created_at?: string
          id?: string
          note?: string | null
          product_id?: string | null
          product_name: string
          quantity_added?: number
          quantity_after?: number | null
          quantity_before?: number | null
          quantity_sold?: number
          sku?: string | null
          status_after?: string | null
        }
        Update: {
          action?: string
          changed_by?: string | null
          changed_by_email?: string | null
          created_at?: string
          id?: string
          note?: string | null
          product_id?: string | null
          product_name?: string
          quantity_added?: number
          quantity_after?: number | null
          quantity_before?: number | null
          quantity_sold?: number
          sku?: string | null
          status_after?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inventory_log_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      newsletter_signups: {
        Row: {
          created_at: string
          email: string
          id: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
        }
        Relationships: []
      }
      processed_orders: {
        Row: {
          created_at: string
          id: string
          line_items: Json
          order_reference: string
          result: Json | null
        }
        Insert: {
          created_at?: string
          id?: string
          line_items?: Json
          order_reference: string
          result?: Json | null
        }
        Update: {
          created_at?: string
          id?: string
          line_items?: Json
          order_reference?: string
          result?: Json | null
        }
        Relationships: []
      }
      products: {
        Row: {
          archived: boolean
          category: string
          created_at: string
          description: string | null
          id: string
          image_key: string
          ingredients: string | null
          is_visible: boolean
          last_production_date: string | null
          manual_hidden: boolean
          name: string
          notes: string | null
          price: number
          quantity: number
          restocked_at: string | null
          seo_description: string | null
          seo_title: string | null
          size: string | null
          sku: string | null
          slug: string
          sold_out_at: string | null
          sort_order: number
          status: string
          tags: string[]
          updated_at: string
          variant_key: string | null
        }
        Insert: {
          archived?: boolean
          category: string
          created_at?: string
          description?: string | null
          id?: string
          image_key: string
          ingredients?: string | null
          is_visible?: boolean
          last_production_date?: string | null
          manual_hidden?: boolean
          name: string
          notes?: string | null
          price?: number
          quantity?: number
          restocked_at?: string | null
          seo_description?: string | null
          seo_title?: string | null
          size?: string | null
          sku?: string | null
          slug: string
          sold_out_at?: string | null
          sort_order?: number
          status?: string
          tags?: string[]
          updated_at?: string
          variant_key?: string | null
        }
        Update: {
          archived?: boolean
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          image_key?: string
          ingredients?: string | null
          is_visible?: boolean
          last_production_date?: string | null
          manual_hidden?: boolean
          name?: string
          notes?: string | null
          price?: number
          quantity?: number
          restocked_at?: string | null
          seo_description?: string | null
          seo_title?: string | null
          size?: string | null
          sku?: string | null
          slug?: string
          sold_out_at?: string | null
          sort_order?: number
          status?: string
          tags?: string[]
          updated_at?: string
          variant_key?: string | null
        }
        Relationships: []
      }
      substitution_group_products: {
        Row: {
          created_at: string
          group_id: string
          id: string
          preference_order: number
          product_id: string
        }
        Insert: {
          created_at?: string
          group_id: string
          id?: string
          preference_order?: number
          product_id: string
        }
        Update: {
          created_at?: string
          group_id?: string
          id?: string
          preference_order?: number
          product_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "substitution_group_products_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "substitution_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "substitution_group_products_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      substitution_groups: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      suppressed_emails: {
        Row: {
          created_at: string
          email: string
          id: string
          metadata: Json | null
          reason: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          metadata?: Json | null
          reason: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          metadata?: Json | null
          reason?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      deduct_bundle_inventory: {
        Args: { _bundle_id: string; _order_reference?: string; _qty?: number }
        Returns: Json
      }
      delete_email: {
        Args: { message_id: number; queue_name: string }
        Returns: boolean
      }
      email_queue_dispatch: { Args: never; Returns: undefined }
      enqueue_email: {
        Args: { payload: Json; queue_name: string }
        Returns: number
      }
      move_to_dlq: {
        Args: {
          dlq_name: string
          message_id: number
          payload: Json
          source_queue: string
        }
        Returns: number
      }
      read_email_batch: {
        Args: { batch_size: number; queue_name: string; vt: number }
        Returns: {
          message: Json
          msg_id: number
          read_ct: number
        }[]
      }
      recalc_bundle: { Args: { _bundle_id: string }; Returns: undefined }
      recalc_bundles_for_product: {
        Args: { _product_id: string }
        Returns: undefined
      }
      resolve_bundle_component: {
        Args: { _component_id: string }
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
