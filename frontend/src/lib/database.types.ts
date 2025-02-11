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
      budgets: {
        Row: {
          id: string
          user_id: string
          category: string
          amount: number
          timeframe: string
          goals: Json[]
          constraints: Json[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          category: string
          amount: number
          timeframe: string
          goals?: Json[]
          constraints?: Json[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          category?: string
          amount?: number
          timeframe?: string
          goals?: Json[]
          constraints?: Json[]
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}