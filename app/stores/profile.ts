import { defineStore } from 'pinia'
import { calculateMatchScore } from '~/utils/matchEngine'

export const useProfileStore = defineStore('profile', {
    state: () => ({
        profile: {
            id: 'un1',
            name: 'Felix un1',
            description: '數位遊民 | 產品設計師',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
            theme: 'default',
            persona: {
                mbti: 'INFP',
                zodiac: '雙魚座',
                location: '台北, 台灣',
                tags: ['數位遊民', '產品設計', '攝影']
            },
            interactiveStats: {
                matchScore: 85,
                likes: 1240,
                followers: 450
            },
            socialLinks: [
                { platform: 'facebook', url: '#', icon: 'mdi-facebook', color: '#1877F2' },
                { platform: 'instagram', url: '#', icon: 'mdi-instagram', color: '#E4405F' },
                { platform: 'twitter', url: '#', icon: 'mdi-twitter', color: '#000000' }
            ],
            actionLinks: [
                { id: 1, title: '我的作品集', url: 'https://example.com/portfolio', icon: 'mdi-briefcase-outline', clicks: 0 },
                { id: 2, title: '追蹤我的 YouTube', url: 'https://youtube.com', icon: 'mdi-youtube', clicks: 0 },
                { id: 3, title: '與我聯繫', url: 'mailto:felix@example.com', icon: 'mdi-email-outline', clicks: 0 }
            ]
        },
        analytics: {
            totalVisitors: 1250,
            totalViews: 3500,
            ctr: '12.5%',
            dailyTrend: [100, 150, 120, 200, 180, 250, 230]
        }
    }),

    actions: {
        async fetchProfile(username: string) {
            const client = useSupabaseClient()
            const { data, error } = await client
                .from('profiles')
                .select('*')
                .eq('username', username)
                .single()

            if (data) {
                const profileData = data as any
                this.profile = {
                    ...this.profile,
                    id: profileData.id,
                    name: profileData.full_name,
                    description: profileData.description,
                    avatar: profileData.avatar_url,
                    persona: {
                        mbti: profileData.mbti,
                        zodiac: profileData.zodiac,
                        location: profileData.location,
                        tags: profileData.tags
                    },
                    interactiveStats: {
                        matchScore: profileData.match_score,
                        likes: profileData.likes_count,
                        followers: profileData.followers_count
                    }
                }
            }
            return { data, error }
        },
        async updateProfile(newData: any) {
            const client = useSupabaseClient()
            const { error } = await client
                .from('profiles')
                .update(newData as never)
                .eq('id', this.profile.id)

            if (!error) {
                this.profile = { ...this.profile, ...newData }
            }
        },
        async recordClick(linkId: number) {
            const link = this.profile.actionLinks.find(l => l.id === linkId)
            if (link) {
                link.clicks++
                this.analytics.totalViews++
            }
        },
        async incrementLike() {
            if (this.profile && this.profile.interactiveStats) {
                const client = useSupabaseClient()
                this.profile.interactiveStats.likes++

                // Optimistic update or RPC
                await client.rpc('increment_likes' as never, { profile_user_id: this.profile.id } as never)
            }
        },
        async checkIdAvailability(id: string) {
            const client = useSupabaseClient()
            const { data, error } = await client
                .from('profiles')
                .select('username')
                .eq('username', id.toLowerCase())
                .maybeSingle()

            return !data && !error
        },
        async handleRegister(id: string) {
            const client = useSupabaseClient()
            const user = useSupabaseUser()

            const { error } = await client
                .from('profiles')
                .insert({
                    id: user.value?.id,
                    username: id.toLowerCase(),
                    full_name: '新用戶',
                    mbti: 'UNKNOWN',
                    zodiac: 'UNKNOWN'
                } as never)

            if (!error) {
                this.profile.id = id
                return true
            }
            return false
        },
        calculateMatch(otherPersona: any) {
            if (!this.profile || !this.profile.persona) return 0
            return calculateMatchScore(this.profile.persona, otherPersona)
        }
    }
})
