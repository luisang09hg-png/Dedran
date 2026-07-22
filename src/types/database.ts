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
      profiles: {
        Row: {
          id: string
          user_id: string
          full_name: string
          title: string
          location: string
          bio: string
          avatar_url: string
          banner_url: string
          connections_count: number
          profile_views: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          full_name: string
          title?: string
          location?: string
          bio?: string
          avatar_url?: string
          banner_url?: string
          connections_count?: number
          profile_views?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          full_name?: string
          title?: string
          location?: string
          bio?: string
          avatar_url?: string
          banner_url?: string
          connections_count?: number
          profile_views?: number
          updated_at?: string
        }
      }
      posts: {
        Row: {
          id: string
          author_id: string
          type: 'regular' | 'temporary'
          content: string
          image_url: string | null
          likes_count: number
          comments_count: number
          shares_count: number
          expires_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          author_id: string
          type?: 'regular' | 'temporary'
          content: string
          image_url?: string | null
          likes_count?: number
          comments_count?: number
          shares_count?: number
          expires_at?: string | null
          created_at?: string
        }
        Update: {
          type?: 'regular' | 'temporary'
          content?: string
          image_url?: string | null
          likes_count?: number
          comments_count?: number
          shares_count?: number
          expires_at?: string | null
        }
      }
      courses: {
        Row: {
          id: string
          title: string
          instructor: string
          category: string
          level: string
          duration: string
          enrolled_count: number
          rating: number
          reviews_count: number
          thumbnail_url: string
          price: string
          tags: string[]
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          instructor: string
          category: string
          level: string
          duration: string
          enrolled_count?: number
          rating?: number
          reviews_count?: number
          thumbnail_url?: string
          price?: string
          tags?: string[]
          created_at?: string
        }
        Update: {
          title?: string
          instructor?: string
          category?: string
          level?: string
          duration?: string
          enrolled_count?: number
          rating?: number
          reviews_count?: number
          thumbnail_url?: string
          price?: string
          tags?: string[]
        }
      }
      course_enrollments: {
        Row: {
          id: string
          user_id: string
          course_id: string
          progress: number
          enrolled_at: string
        }
        Insert: {
          id?: string
          user_id: string
          course_id: string
          progress?: number
          enrolled_at?: string
        }
        Update: {
          progress?: number
        }
      }
      applications: {
        Row: {
          id: string
          user_id: string
          company: string
          role: string
          location: string
          type: string
          salary: string
          status: string
          recruiter: string | null
          next_action: string | null
          applied_date: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          company: string
          role: string
          location?: string
          type?: string
          salary?: string
          status?: string
          recruiter?: string | null
          next_action?: string | null
          applied_date?: string
          created_at?: string
        }
        Update: {
          company?: string
          role?: string
          location?: string
          type?: string
          salary?: string
          status?: string
          recruiter?: string | null
          next_action?: string | null
        }
      }
      payments: {
        Row: {
          id: string
          user_id: string
          provider: 'stripe' | 'paypal'
          provider_payment_id: string
          amount: number
          currency: string
          status: string
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          provider: 'stripe' | 'paypal'
          provider_payment_id: string
          amount: number
          currency?: string
          status: string
          description?: string | null
          created_at?: string
        }
        Update: {
          status?: string
        }
      }
      saved_posts: {
        Row: {
          user_id: string
          post_id: string
          saved_at: string
        }
        Insert: {
          user_id: string
          post_id: string
          saved_at?: string
        }
        Update: Record<string, never>
      }
      post_likes: {
        Row: {
          user_id: string
          post_id: string
          liked_at: string
        }
        Insert: {
          user_id: string
          post_id: string
          liked_at?: string
        }
        Update: Record<string, never>
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}
