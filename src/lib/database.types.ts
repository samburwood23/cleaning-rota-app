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
      households: {
        Row: {
          id: string
          name: string
          invite_code: string
          created_by: string
          created_at: string
          theme: string
          rotation_day: number
        }
        Insert: {
          id?: string
          name: string
          invite_code?: string
          created_by: string
          created_at?: string
          theme?: string
          rotation_day?: number
        }
        Update: {
          id?: string
          name?: string
          invite_code?: string
          created_by?: string
          created_at?: string
          theme?: string
          rotation_day?: number
        }
      }
      household_members: {
        Row: {
          id: string
          household_id: string
          user_id: string
          display_name: string
          color: string
          role: 'admin' | 'member'
          created_at: string
        }
        Insert: {
          id?: string
          household_id: string
          user_id: string
          display_name: string
          color?: string
          role?: 'admin' | 'member'
          created_at?: string
        }
        Update: {
          id?: string
          household_id?: string
          user_id?: string
          display_name?: string
          color?: string
          role?: 'admin' | 'member'
          created_at?: string
        }
      }
      tasks: {
        Row: {
          id: string
          household_id: string
          name: string
          description: string | null
          frequency: 'daily' | 'weekly' | 'biweekly' | 'monthly'
          icon: string | null
          created_at: string
        }
        Insert: {
          id?: string
          household_id: string
          name: string
          description?: string | null
          frequency?: 'daily' | 'weekly' | 'biweekly' | 'monthly'
          icon?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          household_id?: string
          name?: string
          description?: string | null
          frequency?: 'daily' | 'weekly' | 'biweekly' | 'monthly'
          icon?: string | null
          created_at?: string
        }
      }
      task_assignments: {
        Row: {
          id: string
          task_id: string
          user_id: string
          household_id: string
          week_start_date: string
          completed: boolean
          completed_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          task_id: string
          user_id: string
          household_id: string
          week_start_date: string
          completed?: boolean
          completed_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          task_id?: string
          user_id?: string
          household_id?: string
          week_start_date?: string
          completed?: boolean
          completed_at?: string | null
          created_at?: string
        }
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
  }
}
