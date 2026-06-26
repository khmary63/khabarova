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
      bookings: {
        Row: {
          ai_summary: string | null
          created_at: string
          datetime: string
          error_message: string | null
          id: string
          name: string
          phone: string
          source: string
          status: string
          yclients_record_id: number | null
        }
        Insert: {
          ai_summary?: string | null
          created_at?: string
          datetime: string
          error_message?: string | null
          id?: string
          name: string
          phone: string
          source?: string
          status?: string
          yclients_record_id?: number | null
        }
        Update: {
          ai_summary?: string | null
          created_at?: string
          datetime?: string
          error_message?: string | null
          id?: string
          name?: string
          phone?: string
          source?: string
          status?: string
          yclients_record_id?: number | null
        }
        Relationships: []
      }
      click_events: {
        Row: {
          created_at: string
          id: string
          label: string
          path: string
          session_id: string | null
          target: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          label: string
          path: string
          session_id?: string | null
          target?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          label?: string
          path?: string
          session_id?: string | null
          target?: string | null
        }
        Relationships: []
      }
      lead_magnet_submissions: {
        Row: {
          created_at: string
          id: string
          magnet_title: string | null
          name: string
          phone: string
          post_id: string | null
          post_slug: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          magnet_title?: string | null
          name: string
          phone: string
          post_id?: string | null
          post_slug?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          magnet_title?: string | null
          name?: string
          phone?: string
          post_id?: string | null
          post_slug?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lead_magnet_submissions_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          created_at: string
          id: string
          name: string
          phone: string
          source: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          phone: string
          source?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          phone?: string
          source?: string
        }
        Relationships: []
      }
      page_views: {
        Row: {
          created_at: string
          id: string
          path: string
          referrer: string | null
          session_id: string | null
          user_agent: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          path: string
          referrer?: string | null
          session_id?: string | null
          user_agent?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          path?: string
          referrer?: string | null
          session_id?: string | null
          user_agent?: string | null
        }
        Relationships: []
      }
      portfolio_projects: {
        Row: {
          created_at: string
          description: string
          id: string
          image_url: string
          images: Json
          layout: string
          published: boolean
          sort_order: number
          tag: string
          title: string
          updated_at: string
          url: string | null
        }
        Insert: {
          created_at?: string
          description?: string
          id?: string
          image_url: string
          images?: Json
          layout?: string
          published?: boolean
          sort_order?: number
          tag?: string
          title: string
          updated_at?: string
          url?: string | null
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          image_url?: string
          images?: Json
          layout?: string
          published?: boolean
          sort_order?: number
          tag?: string
          title?: string
          updated_at?: string
          url?: string | null
        }
        Relationships: []
      }
      posts: {
        Row: {
          category: string
          content: string
          cover_image_url: string | null
          created_at: string
          excerpt: string
          id: string
          lead_magnet_button_label: string | null
          lead_magnet_description: string | null
          lead_magnet_enabled: boolean
          lead_magnet_file_name: string | null
          lead_magnet_file_path: string | null
          lead_magnet_title: string | null
          published: boolean
          published_at: string | null
          slug: string
          tags: string[]
          telegram_posted_at: string | null
          title: string
          updated_at: string
        }
        Insert: {
          category?: string
          content?: string
          cover_image_url?: string | null
          created_at?: string
          excerpt?: string
          id?: string
          lead_magnet_button_label?: string | null
          lead_magnet_description?: string | null
          lead_magnet_enabled?: boolean
          lead_magnet_file_name?: string | null
          lead_magnet_file_path?: string | null
          lead_magnet_title?: string | null
          published?: boolean
          published_at?: string | null
          slug: string
          tags?: string[]
          telegram_posted_at?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          content?: string
          cover_image_url?: string | null
          created_at?: string
          excerpt?: string
          id?: string
          lead_magnet_button_label?: string | null
          lead_magnet_description?: string | null
          lead_magnet_enabled?: boolean
          lead_magnet_file_name?: string | null
          lead_magnet_file_path?: string | null
          lead_magnet_title?: string | null
          published?: boolean
          published_at?: string | null
          slug?: string
          tags?: string[]
          telegram_posted_at?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          enabled: boolean
          key: string
          updated_at: string
        }
        Insert: {
          enabled?: boolean
          key: string
          updated_at?: string
        }
        Update: {
          enabled?: boolean
          key?: string
          updated_at?: string
        }
        Relationships: []
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
