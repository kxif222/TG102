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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      game_answers: {
        Row: {
          answer: string
          answered_at: string
          id: string
          is_correct: boolean
          question_id: string | null
          session_id: string | null
          time_taken: number | null
          user_id: string | null
        }
        Insert: {
          answer: string
          answered_at?: string
          id?: string
          is_correct: boolean
          question_id?: string | null
          session_id?: string | null
          time_taken?: number | null
          user_id?: string | null
        }
        Update: {
          answer?: string
          answered_at?: string
          id?: string
          is_correct?: boolean
          question_id?: string | null
          session_id?: string | null
          time_taken?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "game_answers_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "game_answers_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "game_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "game_answers_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      game_participants: {
        Row: {
          correct_answers: number | null
          id: string
          joined_at: string
          score: number | null
          session_id: string | null
          user_id: string | null
          wrong_answers: number | null
        }
        Insert: {
          correct_answers?: number | null
          id?: string
          joined_at?: string
          score?: number | null
          session_id?: string | null
          user_id?: string | null
          wrong_answers?: number | null
        }
        Update: {
          correct_answers?: number | null
          id?: string
          joined_at?: string
          score?: number | null
          session_id?: string | null
          user_id?: string | null
          wrong_answers?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "game_participants_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "game_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "game_participants_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      game_sessions: {
        Row: {
          category_id: string | null
          created_at: string
          current_question: number | null
          ended_at: string | null
          host_id: string | null
          id: string
          max_players: number | null
          quiz_type_id: string | null
          room_code: string | null
          settings: Json | null
          started_at: string | null
          status: string | null
          total_questions: number | null
        }
        Insert: {
          category_id?: string | null
          created_at?: string
          current_question?: number | null
          ended_at?: string | null
          host_id?: string | null
          id?: string
          max_players?: number | null
          quiz_type_id?: string | null
          room_code?: string | null
          settings?: Json | null
          started_at?: string | null
          status?: string | null
          total_questions?: number | null
        }
        Update: {
          category_id?: string | null
          created_at?: string
          current_question?: number | null
          ended_at?: string | null
          host_id?: string | null
          id?: string
          max_players?: number | null
          quiz_type_id?: string | null
          room_code?: string | null
          settings?: Json | null
          started_at?: string | null
          status?: string | null
          total_questions?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "game_sessions_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "quiz_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "game_sessions_host_id_fkey"
            columns: ["host_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "game_sessions_quiz_type_id_fkey"
            columns: ["quiz_type_id"]
            isOneToOne: false
            referencedRelation: "quiz_types"
            referencedColumns: ["id"]
          },
        ]
      }
      leaderboard: {
        Row: {
          category_id: string | null
          created_at: string
          id: string
          quiz_type_id: string | null
          rank: number | null
          score: number
          session_id: string | null
          user_id: string | null
        }
        Insert: {
          category_id?: string | null
          created_at?: string
          id?: string
          quiz_type_id?: string | null
          rank?: number | null
          score: number
          session_id?: string | null
          user_id?: string | null
        }
        Update: {
          category_id?: string | null
          created_at?: string
          id?: string
          quiz_type_id?: string | null
          rank?: number | null
          score?: number
          session_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leaderboard_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "quiz_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leaderboard_quiz_type_id_fkey"
            columns: ["quiz_type_id"]
            isOneToOne: false
            referencedRelation: "quiz_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leaderboard_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "game_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leaderboard_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string | null
          games_played: number | null
          id: string
          total_score: number | null
          updated_at: string
          username: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          games_played?: number | null
          id: string
          total_score?: number | null
          updated_at?: string
          username: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          games_played?: number | null
          id?: string
          total_score?: number | null
          updated_at?: string
          username?: string
        }
        Relationships: []
      }
      questions: {
        Row: {
          category_id: string | null
          correct_answer: string
          created_at: string
          difficulty: number | null
          id: string
          options: Json
          question_text: string
        }
        Insert: {
          category_id?: string | null
          correct_answer: string
          created_at?: string
          difficulty?: number | null
          id?: string
          options: Json
          question_text: string
        }
        Update: {
          category_id?: string | null
          correct_answer?: string
          created_at?: string
          difficulty?: number | null
          id?: string
          options?: Json
          question_text?: string
        }
        Relationships: [
          {
            foreignKeyName: "questions_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "quiz_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_categories: {
        Row: {
          created_at: string
          description: string | null
          icon: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      quiz_types: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_multiplayer: boolean | null
          max_players: number | null
          name: string
          time_limit: number | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_multiplayer?: boolean | null
          max_players?: number | null
          name: string
          time_limit?: number | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_multiplayer?: boolean | null
          max_players?: number | null
          name?: string
          time_limit?: number | null
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
