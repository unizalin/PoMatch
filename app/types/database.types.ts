export type Profile = {
    id: string
    username: string
    full_name: string | null
    description: string | null
    avatar_url: string | null
    mbti: string | null
    zodiac: string | null
    location: string | null
    tags: string[] | null
    match_score: number
    likes_count: number
    followers_count: number
    role: string
    theme: string
    theme_config: any | null
    created_at?: string
    updated_at?: string
}

export type Link = {
    id: string
    profile_id: string
    title: string
    url: string
    icon: string | null
    clicks: number
    sort_order: number
    metadata: any | null
    created_at?: string
}

export type Database = {
    public: {
        Tables: {
            profiles: {
                Row: Profile
                Insert: Partial<Profile>
                Update: Partial<Profile>
            }
            links: {
                Row: Link
                Insert: Partial<Link>
                Update: Partial<Link>
            }
        }
    }
}
