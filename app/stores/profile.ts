import { defineStore } from 'pinia'
import { calculateMatchScore } from '~/utils/matchEngine'
import type { Database, Profile as DbProfile } from '~/types/database.types'

// Helper to map DB profile to Store profile
const mapDbProfile = (d: any) => ({
    id: d.id,
    username: d.username,
    name: d.full_name || 'PoMatch 使用者',
    description: d.description || '探索數位名片的無限可能 ✨',
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
        linkGlow: true,
        linkLayout: 'list',
        vOffset: 0,
        avatarOffset: 0,
        textOffset: 0,
        textVOffset: 0
    },
    persona: {
        mbti: d.mbti || 'ENFP',
        zodiac: d.zodiac || '雙子座',
        location: d.location || '',
        tags: d.tags || ['數位遊牧', '產品設計', '極簡主義']
    },
    interactiveStats: {
        matchScore: d.match_score || 88,
        likes: d.likes_count || 128,
        followers: d.followers_count || 256
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
                linkGlow: true,
                linkLayout: 'list',
                vOffset: 0,
                avatarOffset: 0,
                textOffset: 0,
                textVOffset: 0,
                cardMode: true,
                flipDirection: 'horizontal'
            },
            persona: {
                mbti: 'ENFP',
                zodiac: '雙子座',
                location: '',
                tags: ['數位遊牧', '產品設計', '極簡主義']
            },
            interactiveStats: {
                matchScore: 88,
                likes: 128,
                followers: 256
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
        currentFlipSide: 'front' as 'front' | 'back',
        allProfiles: [] as any[],
        _sortTimeout: null as any,
        // ── 歷史紀錄系統 ──
        historyStack: [] as string[],
        historyIndex: -1,
        isDirty: false,
        hasCheckedProfile: false // 避免在 middleware 中重複檢查
    }),

    getters: {
        computedAnalytics: (state) => {
            const profile = state.profile
            if (state.analytics && state.analytics.totalVisitors > 0) return state.analytics
            const seed = (profile.id && typeof profile.id === 'string') ? profile.id.split('-')[0].length : 10
            const likesCount = profile.interactiveStats?.likes ?? 0
            const followersCount = profile.interactiveStats?.followers ?? 0
            const baseVisitors = (likesCount * 15) + (followersCount * 5) + (seed * 85)
            const baseViews = baseVisitors * 2.4
            const ctr = ((likesCount + 10) / (baseVisitors + 100) * 100).toFixed(1) + '%'
            return {
                totalVisitors: Math.floor(baseVisitors),
                totalViews: Math.floor(baseViews),
                ctr,
                dailyTrend: [12, 18, 15, 29, 22, 35, 28, 42]
            }
        },
        canUndo: (state) => state.historyIndex > 0,
        canRedo: (state) => state.historyIndex < state.historyStack.length - 1
    },

    actions: {
        // ── 歷史紀錄核心操作 ──
        takeSnapshot() {
            const snapshot = JSON.stringify({
                profile: this.profile,
            })

            // 如果當前索引不是在最末端，則捨棄掉 Redo 的分支
            if (this.historyIndex < this.historyStack.length - 1) {
                this.historyStack = this.historyStack.slice(0, this.historyIndex + 1)
            }

            this.historyStack.push(snapshot)
            // 限制堆疊大小 (例如 50 步)
            if (this.historyStack.length > 50) {
                this.historyStack.shift()
            }
            this.historyIndex = this.historyStack.length - 1
            this.isDirty = true
        },

        undo() {
            if (!this.canUndo) return
            this.historyIndex--
            const sessionData = this.historyStack[this.historyIndex]
            if (!sessionData) return
            const state = JSON.parse(sessionData)
            this.profile = JSON.parse(JSON.stringify(state.profile))
            this.isDirty = true
        },

        redo() {
            if (!this.canRedo) return
            this.historyIndex++
            const sessionData = this.historyStack[this.historyIndex]
            if (!sessionData) return
            const state = JSON.parse(sessionData)
            this.profile = JSON.parse(JSON.stringify(state.profile))
            this.isDirty = true
        },

        async fetchProfile(identifier: string, isById: boolean = false) {
            console.log(`[PoMatch Debug] fetchProfile started. identifier: ${identifier}, isById: ${isById}`)
            this.loading = true
            const client = useSupabaseClient<Database>()
            try {
                let query = client.from('profiles').select('*, links(*)')

                if (isById) {
                    query = query.eq('id', identifier)
                } else {
                    query = query.eq('username', identifier)
                }

                const { data, error } = await query
                    .order('sort_order', { foreignTable: 'links', ascending: true })
                    .maybeSingle()

                if (error) {
                    console.error('[PoMatch Debug] fetchProfile error:', error)
                }

                if (data) {
                    console.log('[PoMatch Debug] fetchProfile success: Data found')
                    const mapped = mapDbProfile(data)
                    this.profile = {
                        ...this.profile,
                        ...mapped,
                        actionLinks: (data as any).links || []
                    }
                    // 初始化歷史紀錄
                    this.historyStack = [JSON.stringify({ profile: this.profile })]
                    this.historyIndex = 0
                    this.isDirty = false
                } else {
                    console.warn('[PoMatch Debug] fetchProfile: No profile found for this user.')
                }

                this.hasCheckedProfile = true
                return { data, error }
            } catch (err: any) {
                console.error('[PoMatch Debug] fetchProfile catastrophic error:', err)
                this.hasCheckedProfile = true
                return { data: null, error: err }
            } finally {
                this.loading = false
                console.log('[PoMatch Debug] fetchProfile finished.')
            }
        },
        setFlipSide(side: 'front' | 'back') {
            this.currentFlipSide = side
        },
        async saveChanges() {
            this.loading = true
            try {
                const { error } = await this.updateProfile(this.profile)
                if (!error) {
                    this.isDirty = false
                }
                return { error }
            } finally {
                this.loading = false
            }
        },
        async updateProfile(newData: any) {
            const client = useSupabaseClient<Database>()
            const { data: { user }, error: authError } = await client.auth.getUser()
            const userId = user?.id

            if (authError || !userId) return { error: authError || new Error('User session not found') }

            const dbPayload: any = {
                id: userId,
                username: this.profile.username || user.email?.split('@')[0],
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

            const { error } = await client.from('profiles').upsert(dbPayload)
            return { error }
        },
        async debouncedUpdateProfile(newData: any) {
            if (this._sortTimeout) clearTimeout(this._sortTimeout)
            this._sortTimeout = setTimeout(async () => {
                await this.updateProfile(newData)
                this._sortTimeout = null
            }, 1000)
        },
        async addLink(link: any) {
            const client = useSupabaseClient<Database>()
            const { data: { session } } = await client.auth.getSession()
            const userId = session?.user?.id

            if (!userId) return { data: null, error: new Error('Unauthorized') }

            const blockType = link.metadata?.block_type || 'standard_link'

            const { data, error } = await client
                .from('links')
                .insert({
                    profile_id: userId,
                    title: link.title || '新區塊',
                    url: link.url || '#',
                    icon: link.icon || 'mdi-cube-outline',
                    sort_order: this.profile.actionLinks.length,
                    metadata: {
                        ...link.metadata,
                        block_type: blockType
                    }
                } as any)
                .select()
                .single()

            if (data) {
                (this.profile.actionLinks as any[]).push(data as any)
                this.takeSnapshot()
            }
            return { data, error }
        },
        async applyIndustryPreset(type: string) {
            this.loading = true
            try {
                // 清除現有連結 (選用，或是附加？計畫中是說「自動新增一組」，這裡採附加方式但先過濾重複預設)
                const presetMap: Record<string, any[]> = {
                    'fb': [
                        { title: '精選菜色', url: '#', icon: 'mdi-silverware-fork-knife', metadata: { block_type: 'product_grid', items: [{ name: '招牌菜', price: '250', img: '' }] } },
                        { title: '立即預約', url: '#', icon: 'mdi-calendar-check', metadata: { block_type: 'standard_link', color: '#E1306C' } }
                    ],
                    'digital': [
                        { title: '我的服務', url: '#', icon: 'mdi-briefcase-variant', metadata: { block_type: 'service_card', details: '提供 UI/UX 設計與網頁開發' } },
                        { title: '查看作品集', url: '#', icon: 'mdi-folder-open', metadata: { block_type: 'standard_link', color: '#1877F2' } }
                    ],
                    'edu': [
                        { title: '本週課表', url: '#', icon: 'mdi-calendar-clock', metadata: { block_type: 'schedule_list', days: ['Mon', 'Wed', 'Fri'] } },
                        { title: '學費方案', url: '#', icon: 'mdi-currency-usd', metadata: { block_type: 'pricing_tier', price: '1500/月' } }
                    ],
                    'factory': [
                        { title: '產品目錄', url: '#', icon: 'mdi-factory', metadata: { block_type: 'standard_link' } },
                        { title: '聯繫窗口', url: '#', icon: 'mdi-phone-in-talk', metadata: { block_type: 'standard_link', color: '#06C755' } }
                    ],
                    'art': [
                        { title: '手作作品集', url: '#', icon: 'mdi-palette', metadata: { block_type: 'product_grid' } },
                        { title: '文創商城', url: '#', icon: 'mdi-storefront', metadata: { block_type: 'standard_link', color: '#FF3300' } }
                    ],
                    'agri': [
                        { title: '當季農產', url: '#', icon: 'mdi-leaf', metadata: { block_type: 'product_grid' } },
                        { title: '觀光預約', url: '#', icon: 'mdi-map-marker-radius', metadata: { block_type: 'standard_link' } }
                    ]
                }

                const blocks = presetMap[type] || []
                for (const block of blocks) {
                    await this.addLink(block)
                }
                this.takeSnapshot()
                return { success: true }
            } catch (err: any) {
                return { success: false, error: err.message }
            } finally {
                this.loading = false
            }
        },
        async updateLinkMetadata(linkId: string | number, metadata: any) {
            const client = useSupabaseClient<Database>()
            const { error } = await client.from('links').update({ metadata } as any).eq('id', linkId)
            if (!error) {
                const link = (this.profile.actionLinks as any[]).find(l => String(l.id) === String(linkId))
                if (link) link.metadata = { ...link.metadata, ...metadata }
            }
            return { error }
        },
        async deleteLink(linkId: string) {
            const client = useSupabaseClient<Database>()
            const { error } = await client.from('links').delete().eq('id', linkId)
            if (!error) {
                (this.profile.actionLinks as any[]) = (this.profile.actionLinks as any[]).filter(l => String(l.id) !== String(linkId))
                await this.updateLinkSortOrder()
            }
        },
        async updateLinkSortOrder() {
            const client = useSupabaseClient<Database>()
            const updates = (this.profile.actionLinks as any[]).map((link: any, index: number) => (
                client.from('links').update({ sort_order: index } as any).eq('id', link.id)
            ))
            await Promise.all(updates)
            this.isDirty = true
        },
        async debouncedUpdateLinkSortOrder() {
            if (this._sortTimeout) clearTimeout(this._sortTimeout)
            this._sortTimeout = setTimeout(async () => {
                await this.updateLinkSortOrder()
                this._sortTimeout = null
            }, 500)
        },
        async recordClick(linkId: string | number) {
            const link = (this.profile.actionLinks as any[]).find(l => String(l.id) === String(linkId))
            if (link) {
                link.clicks = (link.clicks || 0) + 1
                this.analytics.totalViews++
            }
        },
        async incrementLike() {
            if (this.profile && this.profile.interactiveStats) {
                const client = useSupabaseClient<Database>()
                this.profile.interactiveStats.likes++
                await client.rpc('increment_likes' as any, { profile_user_id: this.profile.id } as any)
            }
        },
        async checkIdAvailability(id: string) {
            const client = useSupabaseClient<Database>()
            const { data, error } = await client.from('profiles').select('username').eq('username', id.toLowerCase()).maybeSingle()
            return !data && !error
        },
        async hasProfile(userId: string) {
            console.log(`[PoMatch Debug] hasProfile check for: ${userId}. hasCheckedProfile: ${this.hasCheckedProfile}`)
            if (this.hasCheckedProfile) return true
            const client = useSupabaseClient<Database>()
            const { data, error } = await client.from('profiles').select('id').eq('id', userId).maybeSingle()

            if (error) {
                console.error('[PoMatch Debug] hasProfile error:', error)
            }

            this.hasCheckedProfile = true
            console.log(`[PoMatch Debug] hasProfile result: ${!!data}`)
            return !!data
        },
        async handleRegister(id: string) {
            const client = useSupabaseClient<Database>()
            const { data: { user: authUser } } = await client.auth.getUser()
            if (!authUser) return { success: false, error: '請先登入帳號' }
            const { error } = await client.from('profiles').insert({
                id: authUser.id,
                username: id.toLowerCase(),
                full_name: 'PoMatch 使用者',
                description: '探索數位名片的無限可能 ✨',
                mbti: 'ENFP',
                zodiac: '雙子座',
                tags: ['數位遊牧', '產品設計', '極簡主義'],
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
                const { data, error } = await client.from('profiles').select('*').limit(20)
                if (data) {
                    this.allProfiles = (data as any[]).map(d => mapDbProfile(d))
                }
                return { data, error }
            } finally {
                this.loading = false
            }
        }
    }
})
