// Generated from the Supabase project schema (`habita`, project ref xhssqgzsjlvvzbsyshhu)
// via the Supabase MCP `generate_typescript_types` tool. Regenerate after schema changes.

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.5";
  };
  public: {
    Tables: {
      conformite_categories: {
        Row: {
          id: string;
          property_id: string;
          sort_order: number;
          title: string;
        };
        Insert: {
          id?: string;
          property_id: string;
          sort_order?: number;
          title: string;
        };
        Update: {
          id?: string;
          property_id?: string;
          sort_order?: number;
          title?: string;
        };
        Relationships: [
          {
            foreignKeyName: "conformite_categories_property_id_fkey";
            columns: ["property_id"];
            isOneToOne: false;
            referencedRelation: "properties";
            referencedColumns: ["id"];
          },
        ];
      };
      conformite_items: {
        Row: {
          category_id: string;
          description: string;
          document_url: string | null;
          expiry_date: string | null;
          has_expiry: boolean;
          id: string;
          label: string;
          sort_order: number;
          status: string;
        };
        Insert: {
          category_id: string;
          description?: string;
          document_url?: string | null;
          expiry_date?: string | null;
          has_expiry?: boolean;
          id?: string;
          label: string;
          sort_order?: number;
          status?: string;
        };
        Update: {
          category_id?: string;
          description?: string;
          document_url?: string | null;
          expiry_date?: string | null;
          has_expiry?: boolean;
          id?: string;
          label?: string;
          sort_order?: number;
          status?: string;
        };
        Relationships: [
          {
            foreignKeyName: "conformite_items_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "conformite_categories";
            referencedColumns: ["id"];
          },
        ];
      };
      gestion_tasks: {
        Row: {
          cat: string;
          completed: boolean;
          created_at: string;
          deadline: string;
          docs: Json;
          explanation: string;
          id: string;
          next_action: string;
          platforms: Json;
          property_id: string;
          sub_label: string;
          title: string;
          updated_at: string;
          urgency: string;
          user_id: string;
        };
        Insert: {
          cat: string;
          completed?: boolean;
          created_at?: string;
          deadline?: string;
          docs?: Json;
          explanation?: string;
          id?: string;
          next_action?: string;
          platforms?: Json;
          property_id: string;
          sub_label?: string;
          title: string;
          updated_at?: string;
          urgency?: string;
          user_id: string;
        };
        Update: {
          cat?: string;
          completed?: boolean;
          created_at?: string;
          deadline?: string;
          docs?: Json;
          explanation?: string;
          id?: string;
          next_action?: string;
          platforms?: Json;
          property_id?: string;
          sub_label?: string;
          title?: string;
          updated_at?: string;
          urgency?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "gestion_tasks_property_id_fkey";
            columns: ["property_id"];
            isOneToOne: false;
            referencedRelation: "properties";
            referencedColumns: ["id"];
          },
        ];
      };
      profiles: {
        Row: {
          created_at: string;
          fiscal_res: string | null;
          lang: string;
          nationality: string | null;
          onboarding_complete: boolean;
          prop_status: string | null;
          reminder_delay_months: number;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          fiscal_res?: string | null;
          lang?: string;
          nationality?: string | null;
          onboarding_complete?: boolean;
          prop_status?: string | null;
          reminder_delay_months?: number;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          fiscal_res?: string | null;
          lang?: string;
          nationality?: string | null;
          onboarding_complete?: boolean;
          prop_status?: string | null;
          reminder_delay_months?: number;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      properties: {
        Row: {
          airbnb_ok: boolean;
          created_at: string;
          docs_ok: boolean;
          id: string;
          income_cents: number;
          license_expiry_date: string | null;
          license_number: string | null;
          license_obtained_date: string | null;
          location: string;
          name: string;
          pct: number;
          region: string;
          status: string;
          type: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          airbnb_ok?: boolean;
          created_at?: string;
          docs_ok?: boolean;
          id?: string;
          income_cents?: number;
          license_expiry_date?: string | null;
          license_number?: string | null;
          license_obtained_date?: string | null;
          location?: string;
          name: string;
          pct?: number;
          region?: string;
          status?: string;
          type?: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          airbnb_ok?: boolean;
          created_at?: string;
          docs_ok?: boolean;
          id?: string;
          income_cents?: number;
          license_expiry_date?: string | null;
          license_number?: string | null;
          license_obtained_date?: string | null;
          location?: string;
          name?: string;
          pct?: number;
          region?: string;
          status?: string;
          type?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      property_tags: {
        Row: {
          id: string;
          label: string;
          property_id: string;
          sort_order: number;
          variant: string;
        };
        Insert: {
          id?: string;
          label: string;
          property_id: string;
          sort_order?: number;
          variant?: string;
        };
        Update: {
          id?: string;
          label?: string;
          property_id?: string;
          sort_order?: number;
          variant?: string;
        };
        Relationships: [
          {
            foreignKeyName: "property_tags_property_id_fkey";
            columns: ["property_id"];
            isOneToOne: false;
            referencedRelation: "properties";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;
type DefaultSchema = DatabaseWithoutInternals["public"];

export type Tables<
  TableName extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
> = (DefaultSchema["Tables"] & DefaultSchema["Views"])[TableName] extends { Row: infer R } ? R : never;

export type TablesInsert<TableName extends keyof DefaultSchema["Tables"]> =
  DefaultSchema["Tables"][TableName] extends { Insert: infer I } ? I : never;

export type TablesUpdate<TableName extends keyof DefaultSchema["Tables"]> =
  DefaultSchema["Tables"][TableName] extends { Update: infer U } ? U : never;
