import { defineStore } from 'pinia'

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
        updateProfile(newData) {
            this.profile = { ...this.profile, ...newData }
        },
        addLink(link) {
            this.profile.actionLinks.push({ ...link, id: Date.now(), clicks: 0 })
        },
        recordClick(linkId) {
            const link = this.profile.actionLinks.find(l => l.id === linkId)
            if (link) {
                link.clicks++
                this.analytics.totalViews++
            }
        },
        incrementLike() {
            if (this.profile && this.profile.interactiveStats) {
                this.profile.interactiveStats.likes++
                // Future: Persist to Supabase here
            }
        }
    }
})
