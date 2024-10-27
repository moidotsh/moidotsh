// src/types/supabase.ts

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string;
          name: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          created_at?: string;
        };
      };
      subcategories: {
        Row: {
          id: string;
          category_id: string;
          name: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          category_id: string;
          name: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          category_id?: string;
          name?: string;
          created_at?: string;
        };
      };
      chapters: {
        Row: {
          id: string;
          subcategory_id: string;
          number: number;
          title: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          subcategory_id: string;
          number: number;
          title?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          subcategory_id?: string;
          number?: number;
          title?: string | null;
          created_at?: string;
        };
      };
      units: {
        Row: {
          id: string;
          chapter_id: string;
          number: number;
          title: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          chapter_id: string;
          number: number;
          title?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          chapter_id?: string;
          number?: number;
          title?: string | null;
          created_at?: string;
        };
      };
      lessons: {
        Row: {
          id: string;
          unit_id: string;
          name: string;
          title: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          unit_id: string;
          name: string;
          title?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          unit_id?: string;
          name?: string;
          title?: string | null;
          created_at?: string;
        };
      };
      flashcards: {
        Row: {
          id: string;
          lesson_id: string;
          front: string;
          back: string | null;
          options: string[] | null;
          next_question_id: string | null;
          step_number: number | null;
          total_steps: number | null;
          never_display_first: boolean;
          source_file: string | null;
          source_path: string | null;
          created_at: string;
          user_id: string | null;
        };
        Insert: {
          id?: string;
          lesson_id: string;
          front: string;
          back?: string | null;
          options?: string[] | null;
          next_question_id?: string | null;
          step_number?: number | null;
          total_steps?: number | null;
          never_display_first?: boolean;
          source_file?: string | null;
          source_path?: string | null;
          created_at?: string;
          user_id?: string | null;
        };
        Update: {
          id?: string;
          lesson_id?: string;
          front?: string;
          back?: string | null;
          options?: string[] | null;
          next_question_id?: string | null;
          step_number?: number | null;
          total_steps?: number | null;
          never_display_first?: boolean;
          source_file?: string | null;
          source_path?: string | null;
          created_at?: string;
          user_id?: string | null;
        };
      };
    };
    Views: {
      flashcard_paths: {
        Row: {
          id: string;
          front: string;
          back: string | null;
          options: string[] | null;
          next_question_id: string | null;
          step_number: number | null;
          total_steps: number | null;
          never_display_first: boolean;
          source_file: string | null;
          source_path: string | null;
          created_at: string;
          lesson_id: string;
          lesson_name: string;
          unit_id: string;
          unit_number: number;
          chapter_id: string;
          chapter_number: number;
          subcategory_id: string;
          subcategory_name: string;
          category_id: string;
          category_name: string;
        };
      };
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
