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
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      ambassador_applications: {
        Row: {
          applicant_type: string
          city: string
          created_at: string
          email: string
          full_name: string
          id: string
          interest: string
          linkedin_url: string | null
          motivation: string | null
          phone: string
          privacy_acknowledged: boolean
          reference_id: string | null
          reviewed_at: string | null
          reviewer_note: string | null
          social_media_consent: boolean
          status: string
          time_commitment: string | null
          user_id: string | null
        }
        Insert: {
          applicant_type: string
          city: string
          created_at?: string
          email: string
          full_name: string
          id?: string
          interest: string
          linkedin_url?: string | null
          motivation?: string | null
          phone: string
          privacy_acknowledged?: boolean
          reference_id?: string | null
          reviewed_at?: string | null
          reviewer_note?: string | null
          social_media_consent?: boolean
          status?: string
          time_commitment?: string | null
          user_id?: string | null
        }
        Update: {
          applicant_type?: string
          city?: string
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          interest?: string
          linkedin_url?: string | null
          motivation?: string | null
          phone?: string
          privacy_acknowledged?: boolean
          reference_id?: string | null
          reviewed_at?: string | null
          reviewer_note?: string | null
          social_media_consent?: boolean
          status?: string
          time_commitment?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      badges: {
        Row: {
          awarded_at: string
          code: string
          id: string
          label: string
          volunteer_id: string
        }
        Insert: {
          awarded_at?: string
          code: string
          id?: string
          label: string
          volunteer_id: string
        }
        Update: {
          awarded_at?: string
          code?: string
          id?: string
          label?: string
          volunteer_id?: string
        }
        Relationships: []
      }
      endorsements: {
        Row: {
          author_name: string
          author_role: string | null
          body: string
          created_at: string
          evidence_level: string
          id: string
          volunteer_id: string
        }
        Insert: {
          author_name: string
          author_role?: string | null
          body: string
          created_at?: string
          evidence_level?: string
          id?: string
          volunteer_id: string
        }
        Update: {
          author_name?: string
          author_role?: string | null
          body?: string
          created_at?: string
          evidence_level?: string
          id?: string
          volunteer_id?: string
        }
        Relationships: []
      }
      events: {
        Row: {
          capacity: number | null
          city: string
          created_at: string
          created_by: string | null
          description: string | null
          ends_at: string | null
          id: string
          location: string | null
          starts_at: string
          status: string
          title: string
        }
        Insert: {
          capacity?: number | null
          city: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          ends_at?: string | null
          id?: string
          location?: string | null
          starts_at: string
          status?: string
          title: string
        }
        Update: {
          capacity?: number | null
          city?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          ends_at?: string | null
          id?: string
          location?: string | null
          starts_at?: string
          status?: string
          title?: string
        }
        Relationships: []
      }
      points_ledger: {
        Row: {
          activity: string
          created_at: string
          evidence: string | null
          id: string
          points: number
          reason: string | null
          reviewed_at: string | null
          reviewer_id: string | null
          status: string
          user_id: string
        }
        Insert: {
          activity: string
          created_at?: string
          evidence?: string | null
          id?: string
          points: number
          reason?: string | null
          reviewed_at?: string | null
          reviewer_id?: string | null
          status?: string
          user_id: string
        }
        Update: {
          activity?: string
          created_at?: string
          evidence?: string | null
          id?: string
          points?: number
          reason?: string | null
          reviewed_at?: string | null
          reviewer_id?: string | null
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          agreement_accepted_at: string | null
          availability: string | null
          city: string | null
          created_at: string
          full_name: string | null
          id: string
          interests: string | null
          languages: string | null
          onboarding_completed: boolean
          orientation_completed_at: string | null
          phone: string | null
          preferred_format: string | null
          skills: string | null
          starter_completed_at: string | null
          updated_at: string
        }
        Insert: {
          agreement_accepted_at?: string | null
          availability?: string | null
          city?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          interests?: string | null
          languages?: string | null
          onboarding_completed?: boolean
          orientation_completed_at?: string | null
          phone?: string | null
          preferred_format?: string | null
          skills?: string | null
          starter_completed_at?: string | null
          updated_at?: string
        }
        Update: {
          agreement_accepted_at?: string | null
          availability?: string | null
          city?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          interests?: string | null
          languages?: string | null
          onboarding_completed?: boolean
          orientation_completed_at?: string | null
          phone?: string | null
          preferred_format?: string | null
          skills?: string | null
          starter_completed_at?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      readiness_completions: {
        Row: {
          completed_at: string
          created_at: string
          external_id: string
          id: string
          note: string | null
          paid_verified: boolean
          recorded_by: string
          referral_code: string | null
          status: string
          volunteer_id: string | null
        }
        Insert: {
          completed_at?: string
          created_at?: string
          external_id: string
          id?: string
          note?: string | null
          paid_verified?: boolean
          recorded_by: string
          referral_code?: string | null
          status?: string
          volunteer_id?: string | null
        }
        Update: {
          completed_at?: string
          created_at?: string
          external_id?: string
          id?: string
          note?: string | null
          paid_verified?: boolean
          recorded_by?: string
          referral_code?: string | null
          status?: string
          volunteer_id?: string | null
        }
        Relationships: []
      }
      referral_codes: {
        Row: {
          code: string
          created_at: string
          user_id: string
        }
        Insert: {
          code: string
          created_at?: string
          user_id: string
        }
        Update: {
          code?: string
          created_at?: string
          user_id?: string
        }
        Relationships: []
      }
      shift_signups: {
        Row: {
          created_at: string
          event_id: string
          hours: number | null
          id: string
          led_crew_size: number | null
          rating: number | null
          reviewer_note: string | null
          role_type: string
          status: string
          verified_at: string | null
          verified_by: string | null
          volunteer_id: string
        }
        Insert: {
          created_at?: string
          event_id: string
          hours?: number | null
          id?: string
          led_crew_size?: number | null
          rating?: number | null
          reviewer_note?: string | null
          role_type?: string
          status?: string
          verified_at?: string | null
          verified_by?: string | null
          volunteer_id: string
        }
        Update: {
          created_at?: string
          event_id?: string
          hours?: number | null
          id?: string
          led_crew_size?: number | null
          rating?: number | null
          reviewer_note?: string | null
          role_type?: string
          status?: string
          verified_at?: string | null
          verified_by?: string | null
          volunteer_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "shift_signups_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
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
      ensure_my_referral_code: { Args: never; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role:
        | "admin"
        | "reviewer"
        | "organizer"
        | "city_coordinator"
        | "finance"
        | "volunteer"
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
      app_role: [
        "admin",
        "reviewer",
        "organizer",
        "city_coordinator",
        "finance",
        "volunteer",
      ],
    },
  },
} as const
