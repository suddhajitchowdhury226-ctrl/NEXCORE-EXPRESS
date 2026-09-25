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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      appliance_services: {
        Row: {
          allow_quantity: boolean
          category: string
          created_at: string
          description: string
          id: string
          is_active: boolean
          name: string
          price: number
          pricing_rule: string
          requires_quote: boolean
          slug: string
          sort_order: number
          unit_label: string | null
          updated_at: string
        }
        Insert: {
          allow_quantity?: boolean
          category?: string
          created_at?: string
          description?: string
          id?: string
          is_active?: boolean
          name: string
          price?: number
          pricing_rule?: string
          requires_quote?: boolean
          slug: string
          sort_order?: number
          unit_label?: string | null
          updated_at?: string
        }
        Update: {
          allow_quantity?: boolean
          category?: string
          created_at?: string
          description?: string
          id?: string
          is_active?: boolean
          name?: string
          price?: number
          pricing_rule?: string
          requires_quote?: boolean
          slug?: string
          sort_order?: number
          unit_label?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      bookings: {
        Row: {
          booking_number: string
          created_at: string
          crew_size: number | null
          customer_id: string
          destination_address: string
          id: string
          pickup_address: string
          quote_id: string | null
          requirements: string | null
          scheduled_date: string | null
          scheduled_time: string | null
          service_id: string | null
          status: string
          total_amount: number | null
          updated_at: string
        }
        Insert: {
          booking_number?: string
          created_at?: string
          crew_size?: number | null
          customer_id: string
          destination_address: string
          id?: string
          pickup_address: string
          quote_id?: string | null
          requirements?: string | null
          scheduled_date?: string | null
          scheduled_time?: string | null
          service_id?: string | null
          status?: string
          total_amount?: number | null
          updated_at?: string
        }
        Update: {
          booking_number?: string
          created_at?: string
          crew_size?: number | null
          customer_id?: string
          destination_address?: string
          id?: string
          pickup_address?: string
          quote_id?: string | null
          requirements?: string | null
          scheduled_date?: string | null
          scheduled_time?: string | null
          service_id?: string | null
          status?: string
          total_amount?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          address_line: string | null
          city: string | null
          company_name: string | null
          country: string
          created_at: string
          email: string
          full_name: string
          id: string
          notes: string | null
          phone: string | null
          postal_code: string | null
          province: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          address_line?: string | null
          city?: string | null
          company_name?: string | null
          country?: string
          created_at?: string
          email: string
          full_name: string
          id?: string
          notes?: string | null
          phone?: string | null
          postal_code?: string | null
          province?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          address_line?: string | null
          city?: string | null
          company_name?: string | null
          country?: string
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          notes?: string | null
          phone?: string | null
          postal_code?: string | null
          province?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      enquiries: {
        Row: {
          admin_notes: string | null
          created_at: string
          customer_id: string | null
          email: string
          enquiry_type: string
          id: string
          location: string | null
          message: string
          name: string
          phone: string | null
          reference: string
          status: string
          subject: string
          updated_at: string
        }
        Insert: {
          admin_notes?: string | null
          created_at?: string
          customer_id?: string | null
          email: string
          enquiry_type?: string
          id?: string
          location?: string | null
          message: string
          name: string
          phone?: string | null
          reference?: string
          status?: string
          subject: string
          updated_at?: string
        }
        Update: {
          admin_notes?: string | null
          created_at?: string
          customer_id?: string | null
          email?: string
          enquiry_type?: string
          id?: string
          location?: string | null
          message?: string
          name?: string
          phone?: string | null
          reference?: string
          status?: string
          subject?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "enquiries_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      faqs: {
        Row: {
          answer: string
          category: string
          created_at: string
          id: string
          is_active: boolean
          question: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          answer: string
          category?: string
          created_at?: string
          id?: string
          is_active?: boolean
          question: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          answer?: string
          category?: string
          created_at?: string
          id?: string
          is_active?: boolean
          question?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      invoice_items: {
        Row: {
          amount: number
          created_at: string
          description: string
          id: string
          invoice_id: string
          quantity: number
          unit_price: number
        }
        Insert: {
          amount?: number
          created_at?: string
          description: string
          id?: string
          invoice_id: string
          quantity?: number
          unit_price?: number
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string
          id?: string
          invoice_id?: string
          quantity?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "invoice_items_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          amount_paid: number
          booking_id: string | null
          created_at: string
          currency: string
          customer_id: string
          due_date: string | null
          id: string
          invoice_number: string
          issue_date: string
          notes: string | null
          paid_at: string | null
          sent_at: string | null
          status: string
          subtotal: number
          tax_amount: number
          tax_rate: number
          total: number
          updated_at: string
        }
        Insert: {
          amount_paid?: number
          booking_id?: string | null
          created_at?: string
          currency?: string
          customer_id: string
          due_date?: string | null
          id?: string
          invoice_number: string
          issue_date?: string
          notes?: string | null
          paid_at?: string | null
          sent_at?: string | null
          status?: string
          subtotal?: number
          tax_amount?: number
          tax_rate?: number
          total?: number
          updated_at?: string
        }
        Update: {
          amount_paid?: number
          booking_id?: string | null
          created_at?: string
          currency?: string
          customer_id?: string
          due_date?: string | null
          id?: string
          invoice_number?: string
          issue_date?: string
          notes?: string | null
          paid_at?: string | null
          sent_at?: string | null
          status?: string
          subtotal?: number
          tax_amount?: number
          tax_rate?: number
          total?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoices_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          booking_id: string | null
          created_at: string
          currency: string
          customer_id: string | null
          id: string
          invoice_id: string | null
          method: string
          notes: string | null
          paid_at: string | null
          provider: string
          provider_reference: string | null
          service_booking_id: string | null
          status: string
          updated_at: string
        }
        Insert: {
          amount: number
          booking_id?: string | null
          created_at?: string
          currency?: string
          customer_id?: string | null
          id?: string
          invoice_id?: string | null
          method?: string
          notes?: string | null
          paid_at?: string | null
          provider?: string
          provider_reference?: string | null
          service_booking_id?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          amount?: number
          booking_id?: string | null
          created_at?: string
          currency?: string
          customer_id?: string | null
          id?: string
          invoice_id?: string | null
          method?: string
          notes?: string | null
          paid_at?: string | null
          provider?: string
          provider_reference?: string | null
          service_booking_id?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_service_booking_id_fkey"
            columns: ["service_booking_id"]
            isOneToOne: false
            referencedRelation: "service_bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      quotes: {
        Row: {
          additional_requirements: string | null
          admin_notes: string | null
          company_name: string | null
          created_at: string
          customer_id: string | null
          destination_address: string
          destination_city: string | null
          destination_latitude: number | null
          destination_longitude: number | null
          email: string
          full_name: string
          id: string
          message: string | null
          moving_date: string | null
          phone: string | null
          pickup_address: string
          pickup_city: string | null
          pickup_latitude: number | null
          pickup_longitude: number | null
          property_details: string | null
          property_type: string | null
          quoted_amount: number | null
          reference: string
          service_type: string
          shipment_details: string | null
          status: string
          updated_at: string
        }
        Insert: {
          additional_requirements?: string | null
          admin_notes?: string | null
          company_name?: string | null
          created_at?: string
          customer_id?: string | null
          destination_address: string
          destination_city?: string | null
          destination_latitude?: number | null
          destination_longitude?: number | null
          email: string
          full_name: string
          id?: string
          message?: string | null
          moving_date?: string | null
          phone?: string | null
          pickup_address: string
          pickup_city?: string | null
          pickup_latitude?: number | null
          pickup_longitude?: number | null
          property_details?: string | null
          property_type?: string | null
          quoted_amount?: number | null
          reference?: string
          service_type: string
          shipment_details?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          additional_requirements?: string | null
          admin_notes?: string | null
          company_name?: string | null
          created_at?: string
          customer_id?: string | null
          destination_address?: string
          destination_city?: string | null
          destination_latitude?: number | null
          destination_longitude?: number | null
          email?: string
          full_name?: string
          id?: string
          message?: string | null
          moving_date?: string | null
          phone?: string | null
          pickup_address?: string
          pickup_city?: string | null
          pickup_latitude?: number | null
          pickup_longitude?: number | null
          property_details?: string | null
          property_type?: string | null
          quoted_amount?: number | null
          reference?: string
          service_type?: string
          shipment_details?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "quotes_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      service_areas: {
        Row: {
          country: string
          created_at: string
          id: string
          is_active: boolean
          latitude: number | null
          longitude: number | null
          name: string
          notes: string | null
          postal_prefixes: string[]
          province: string | null
          radius_km: number
          sort_order: number
          updated_at: string
        }
        Insert: {
          country?: string
          created_at?: string
          id?: string
          is_active?: boolean
          latitude?: number | null
          longitude?: number | null
          name: string
          notes?: string | null
          postal_prefixes?: string[]
          province?: string | null
          radius_km?: number
          sort_order?: number
          updated_at?: string
        }
        Update: {
          country?: string
          created_at?: string
          id?: string
          is_active?: boolean
          latitude?: number | null
          longitude?: number | null
          name?: string
          notes?: string | null
          postal_prefixes?: string[]
          province?: string | null
          radius_km?: number
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      service_booking_items: {
        Row: {
          booking_id: string
          created_at: string
          id: string
          line_total: number
          name: string
          quantity: number
          service_id: string | null
          unit_price: number
        }
        Insert: {
          booking_id: string
          created_at?: string
          id?: string
          line_total?: number
          name: string
          quantity?: number
          service_id?: string | null
          unit_price?: number
        }
        Update: {
          booking_id?: string
          created_at?: string
          id?: string
          line_total?: number
          name?: string
          quantity?: number
          service_id?: string | null
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "service_booking_items_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "service_bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_booking_items_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "appliance_services"
            referencedColumns: ["id"]
          },
        ]
      }
      service_bookings: {
        Row: {
          admin_notes: string | null
          appliance_brand: string | null
          appliance_count: number | null
          appliance_model: string | null
          appliance_type: string | null
          booking_number: string
          city: string | null
          created_at: string
          currency: string
          customer_id: string | null
          delivery_address: string | null
          delivery_instructions: string | null
          email: string
          full_name: string
          id: string
          notes: string | null
          paid_at: string | null
          payment_intent: string | null
          payment_reference: string | null
          payment_status: string
          phone: string | null
          pickup_location: string | null
          postal_code: string | null
          province: string | null
          remove_existing: boolean
          service_date: string | null
          service_time: string | null
          status: string
          street_address: string | null
          subtotal: number
          tax_amount: number
          tax_rate: number
          total: number
          updated_at: string
        }
        Insert: {
          admin_notes?: string | null
          appliance_brand?: string | null
          appliance_count?: number | null
          appliance_model?: string | null
          appliance_type?: string | null
          booking_number?: string
          city?: string | null
          created_at?: string
          currency?: string
          customer_id?: string | null
          delivery_address?: string | null
          delivery_instructions?: string | null
          email: string
          full_name: string
          id?: string
          notes?: string | null
          paid_at?: string | null
          payment_intent?: string | null
          payment_reference?: string | null
          payment_status?: string
          phone?: string | null
          pickup_location?: string | null
          postal_code?: string | null
          province?: string | null
          remove_existing?: boolean
          service_date?: string | null
          service_time?: string | null
          status?: string
          street_address?: string | null
          subtotal?: number
          tax_amount?: number
          tax_rate?: number
          total?: number
          updated_at?: string
        }
        Update: {
          admin_notes?: string | null
          appliance_brand?: string | null
          appliance_count?: number | null
          appliance_model?: string | null
          appliance_type?: string | null
          booking_number?: string
          city?: string | null
          created_at?: string
          currency?: string
          customer_id?: string | null
          delivery_address?: string | null
          delivery_instructions?: string | null
          email?: string
          full_name?: string
          id?: string
          notes?: string | null
          paid_at?: string | null
          payment_intent?: string | null
          payment_reference?: string | null
          payment_status?: string
          phone?: string | null
          pickup_location?: string | null
          postal_code?: string | null
          province?: string | null
          remove_existing?: boolean
          service_date?: string | null
          service_time?: string | null
          status?: string
          street_address?: string | null
          subtotal?: number
          tax_amount?: number
          tax_rate?: number
          total?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "service_bookings_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          base_price: number | null
          category: string
          created_at: string
          icon: string
          id: string
          image_url: string | null
          is_active: boolean
          long_description: string | null
          short_description: string
          slug: string
          sort_order: number
          title: string
          updated_at: string
        }
        Insert: {
          base_price?: number | null
          category?: string
          created_at?: string
          icon?: string
          id?: string
          image_url?: string | null
          is_active?: boolean
          long_description?: string | null
          short_description: string
          slug: string
          sort_order?: number
          title: string
          updated_at?: string
        }
        Update: {
          base_price?: number | null
          category?: string
          created_at?: string
          icon?: string
          id?: string
          image_url?: string | null
          is_active?: boolean
          long_description?: string | null
          short_description?: string
          slug?: string
          sort_order?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      shipments: {
        Row: {
          booking_id: string | null
          created_at: string
          crew_size: number | null
          current_latitude: number | null
          current_location: string | null
          current_longitude: number | null
          customer_id: string | null
          delivered_at: string | null
          destination_address: string
          destination_city: string | null
          destination_latitude: number | null
          destination_longitude: number | null
          estimated_delivery: string | null
          id: string
          notes: string | null
          order_number: string | null
          origin_address: string
          origin_city: string | null
          origin_latitude: number | null
          origin_longitude: number | null
          pickup_date: string | null
          progress_percent: number
          reference: string | null
          status: string
          tracking_number: string
          updated_at: string
          vehicle: string | null
        }
        Insert: {
          booking_id?: string | null
          created_at?: string
          crew_size?: number | null
          current_latitude?: number | null
          current_location?: string | null
          current_longitude?: number | null
          customer_id?: string | null
          delivered_at?: string | null
          destination_address: string
          destination_city?: string | null
          destination_latitude?: number | null
          destination_longitude?: number | null
          estimated_delivery?: string | null
          id?: string
          notes?: string | null
          order_number?: string | null
          origin_address: string
          origin_city?: string | null
          origin_latitude?: number | null
          origin_longitude?: number | null
          pickup_date?: string | null
          progress_percent?: number
          reference?: string | null
          status?: string
          tracking_number: string
          updated_at?: string
          vehicle?: string | null
        }
        Update: {
          booking_id?: string | null
          created_at?: string
          crew_size?: number | null
          current_latitude?: number | null
          current_location?: string | null
          current_longitude?: number | null
          customer_id?: string | null
          delivered_at?: string | null
          destination_address?: string
          destination_city?: string | null
          destination_latitude?: number | null
          destination_longitude?: number | null
          estimated_delivery?: string | null
          id?: string
          notes?: string | null
          order_number?: string | null
          origin_address?: string
          origin_city?: string | null
          origin_latitude?: number | null
          origin_longitude?: number | null
          pickup_date?: string | null
          progress_percent?: number
          reference?: string | null
          status?: string
          tracking_number?: string
          updated_at?: string
          vehicle?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "shipments_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shipments_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      site_content: {
        Row: {
          group_name: string
          id: string
          key: string
          label: string
          updated_at: string
          value: string
        }
        Insert: {
          group_name?: string
          id?: string
          key: string
          label: string
          updated_at?: string
          value?: string
        }
        Update: {
          group_name?: string
          id?: string
          key?: string
          label?: string
          updated_at?: string
          value?: string
        }
        Relationships: []
      }
      tracking_events: {
        Row: {
          created_at: string
          description: string | null
          event_time: string
          id: string
          latitude: number | null
          location: string | null
          longitude: number | null
          shipment_id: string
          status: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          event_time?: string
          id?: string
          latitude?: number | null
          location?: string | null
          longitude?: number | null
          shipment_id: string
          status: string
        }
        Update: {
          created_at?: string
          description?: string | null
          event_time?: string
          id?: string
          latitude?: number | null
          location?: string | null
          longitude?: number | null
          shipment_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "tracking_events_shipment_id_fkey"
            columns: ["shipment_id"]
            isOneToOne: false
            referencedRelation: "shipments"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_staff: { Args: { _user_id: string }; Returns: boolean }
      submit_enquiry: { Args: { _payload: Json }; Returns: string }
      submit_quote: { Args: { _payload: Json }; Returns: string }
      track_shipment: { Args: { _ref: string }; Returns: Json }
    }
    Enums: {
      app_role: "admin" | "staff" | "customer"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "staff", "customer"],
    },
  },
} as const
