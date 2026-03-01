import { defineStore } from 'pinia'
import { calculateMatchScore } from '~/utils/matchEngine'
import type { Database, Profile as DbProfile } from '~/types/database.types'

// Helper to map DB profile to Store profile
const mapDbProfile = (d: any) => ({
    id: d.id,
    username: d.username,
    name: d.full_name || '未命名',
    description: d.description || '',
    avatar: d.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${d.username}`,
    theme: d.theme || 'glassmorphism',
    themeConfig: d.theme_config || {
        auroraIntensity: 0.5,
        glassIntensity: 10,
        grainOpacity: 0.1,
        profileGlow: 0.5,
        profileBorderWidth: 2,
        profileBorderRadius: 50,
        nameScale: 1,
        contentGap: 16,
        linkRadius: 12,
        linkGap: 8,
        linkHoverScale: 1.02,
        linkGlow: true
    },
    persona: {
        mbti: d.mbti || 'UNKNOWN',
        zodiac: d.zodiac || 'UNKNOWN',
        location: d.location || '',
        tags: d.tags || []
    },
    interactiveStats: {
        matchScore: d.match_score || 0,
        likes: d.likes_count || 0,
        followers: d.followers_count || 0
    }
})

export const useProfileStore = defineStore('profile', {
    state: () => ({
        loading: false,
        profile: {
            id: '',
            username: '',
            name: '',
            description: '',
            avatar: '',
            theme: 'glassmorphism',
            themeConfig: {
                auroraIntensity: 0.5,
                glassIntensity: 10,
                grainOpacity: 0.1,
                profileGlow: 0.5,
                profileBorderWidth: 2,
                profileBorderRadius: 50,
                nameScale: 1,
                contentGap: 16,
                linkRadius: 12,
                linkGap: 8,
                linkHoverScale: 1.02,
                linkGlow: true
            },
            persona: {
                mbti: 'UNKNOWN',
                zodiac: 'UNKNOWN',
                location: '',
                tags: [] as string[]
            },
            interactiveStats: {
                matchScore: 0,
                likes: 0,
                followers: 0
            },
            socialLinks: [] as any[],
            actionLinks: [] as any[]
        },
        analytics: {
            totalVisitors: 0,
            totalViews: 0,
            ctr: '0%',
            dailyTrend: [] as number[]
        },
        allProfiles: [] as any[]
    }),

    getters: {
        // TC-G01: Provide deterministic "realistic" stats if live tracking isn't enabled
        computedAnalytics: (state) => {
            const profile = state.profile
            if (state.analytics.totalVisitors > 0) return state.analytics

            // Generate deterministic stats based on profile ID or Username
            const seed = profile.id ? profile.id.split('-')[0].length : 10
            const likes = profile.interactiveStats?.likes || 0
            const followers = profile.interactiveStats?.followers || 0

            const baseVisitors = (likes * 15) + (followers * 5) + (seed * 85)
            const baseViews = baseVisitors * 2.4
            const ctr = ((likes + 10) / (baseVisitors + 100) * 100).toFixed(1) + '%'

            return {
                totalVisitors: Math.floor(baseVisitors),
                totalViews: Math.floor(baseViews),
                ctr,
                dailyTrend: [12, 18, 15, 29, 22, 35, 28, 42]
            }
        }
    },

    actions: {
        async fetchProfile(username: string) {
            this.loading = true
            const client = useSupabaseClient<Database>()
            try {
                const { data, error } = await client
                    .from('profiles')
                    .select('*')
                    .eq('username', username)
                    .maybeSingle()

                if (data) {
                    this.profile = {
                        ...this.profile,
                        ...mapDbProfile(data as any)
                    }
                }
                return { data, error }
            } finally {
                this.loading = false
            }
        },
        async updateProfile(newData: any) {
            const client = useSupabaseClient<Database>()

            // Use getUser() directly for maximum reliability in async actions
            const { data: { user }, error: authError } = await client.auth.getUser()
            const userId = user?.id

            if (authError || !userId) {
                console.error('[ProfileStore] updateProfile failed: No session', authError)
                return { error: authError || new Error('User session not found') }
            }

            const dbPayload: any = {
                id: userId,
                username: user.email?.split('@')[0] || 'user',
                updated_at: new Date().toISOString()
            }

            if (newData.name !== undefined) dbPayload.full_name = newData.name
            if (newData.description !== undefined) dbPayload.description = newData.description
            if (newData.avatar !== undefined) dbPayload.avatar_url = newData.avatar
            if (newData.theme !== undefined) dbPayload.theme = newData.theme
            if (newData.themeConfig !== undefined) dbPayload.theme_config = newData.themeConfig

            if (newData.persona) {
                if (newData.persona.mbti !== undefined) dbPayload.mbti = newData.persona.mbti
                if (newData.persona.zodiac !== undefined) dbPayload.zodiac = newData.persona.zodiac
                if (newData.persona.location !== undefined) dbPayload.location = newData.persona.location
                if (newData.persona.tags !== undefined) dbPayload.tags = newData.persona.tags
            }

            console.log('[ProfileStore] Upserting payload:', dbPayload)
            const { error } = await client.from('profiles').upsert(dbPayload)

            if (!error) {
                await this.fetchProfile(dbPayload.username)
            } else {
                console.error('[ProfileStore] Update failed:', error)
            }

            return { error }
        },
        async addLink(link: any) {
            const client = useSupabaseClient<Database>()
            const user = useSupabaseUser()
            if (!user.value) return { data: null, error: new Error('Unauthorized') }

            const { data, error } = await client
                .from('links')
                .insert({
                    profile_id: user.value.id,
                    title: link.title,
                    url: link.url,
                    icon: link.icon || 'mdi-link-variant',
                    sort_order: this.profile.actionLinks.length
                } as never)
                .select()
                .single()

            if (data) {
                this.profile.actionLinks.push(data as any)
            }
            return { data, error }
        },
        async deleteLink(linkId: string) {
            const client = useSupabaseClient<Database>()
            const { error } = await client
                .from('links')
                .delete()
                .eq('id', linkId)

            if (!error) {
                this.profile.actionLinks = this.profile.actionLinks.filter(l => String(l.id) !== String(linkId))
                // Re-index sort_order after deletion
                await this.updateLinkSortOrder()
            }
        },
        async updateLinkSortOrder() {
            // TC-L03: Persist sort order to database
            const client = useSupabaseClient<Database>()
            const updates = this.profile.actionLinks.map((link: any, index: number) => (
                client.from('links').update({ sort_order: index } as never).eq('id', link.id)
            ))
            await Promise.all(updates)
        },
        async recordClick(linkId: string | number) {
            const link = this.profile.actionLinks.find(l => String(l.id) === String(linkId))
            if (link) {
                link.clicks++
                this.analytics.totalViews++
            }
        },
        async incrementLike() {
            if (this.profile && this.profile.interactiveStats) {
                const client = useSupabaseClient<Database>()
                this.profile.interactiveStats.likes++
                await client.rpc('increment_likes' as never, { profile_user_id: this.profile.id } as never)
            }
        },
        async checkIdAvailability(id: string) {
            const client = useSupabaseClient<Database>()
            const { data, error } = await client
                .from('profiles')
                .select('username')
                .eq('username', id.toLowerCase())
                .maybeSingle()

            return !data && !error
        },
        async hasProfile(userId: string) {
            const client = useSupabaseClient<Database>()
            const { data } = await client
                .from('profiles')
                .select('id')
                .eq('id', userId)
                .maybeSingle()
            return !!data
        },
        async handleRegister(id: string) {
            const client = useSupabaseClient<Database>()
            const { data: { user: authUser } } = await client.auth.getUser()

            if (!authUser) return { success: false, error: '請先登入帳號' }

            const { error } = await client
                .from('profiles')
                .insert({
                    id: authUser.id,
                    username: id.toLowerCase(),
                    full_name: '新用戶',
                    mbti: 'UNKNOWN',
                    zodiac: 'UNKNOWN',
                    role: 'user'
                } as any)

            if (!error) {
                this.profile.id = authUser.id
                this.profile.name = '新用戶'
                return { success: true }
            }
            return { success: false, error: error.message }
        },
        calculateMatch(otherPersona: any) {
            if (!this.profile || !this.profile.persona) return 0
            return calculateMatchScore(this.profile.persona, otherPersona)
        },
        async fetchAllProfiles() {
            this.loading = true
            const client = useSupabaseClient<Database>()
            try {
                const { data, error } = await client
                    .from('profiles')
                    .select('id, username, full_name, description, avatar_url, mbti, zodiac, location, tags, match_score, likes_count, followers_count')
                    .limit(20)

                if (data) {
                    this.allProfiles = data.map(d => mapDbProfile(d as any))
                }
                return { data, error }
            } finally {
                this.loading = false
            }
        }
    }
})
