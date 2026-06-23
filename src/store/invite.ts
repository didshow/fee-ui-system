import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Invitee {
  phone: string    // masked: 138****0000
  joinedAt: string // ISO timestamp
  rewarded: boolean
}

interface InviteState {
  code: string | null
  invitees: Invitee[]
  /** Generate a code for the current user (idempotent) */
  ensureCode: (userId: string) => string
  /** Called during registration when inviteCode is provided; returns true if matched */
  recordInvitee: (inviteCode: string, phone: string) => boolean
  markRewarded: (phone: string) => void
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function generateCode(userId: string): string {
  const suffix = Math.random().toString(36).slice(2, 6).toUpperCase()
  return `INV-${userId.slice(-4).toUpperCase()}-${suffix}`
}

export function maskPhone(phone: string): string {
  return phone.length >= 7 ? `${phone.slice(0, 3)}****${phone.slice(-4)}` : phone
}

/** Coins awarded to inviter per successful referral */
export const INVITE_REWARD_COINS = 50

// ─── Store ────────────────────────────────────────────────────────────────────

export const useInviteStore = create<InviteState>()(
  persist(
    (set, get) => ({
      code: null,
      invitees: [],

      ensureCode: (userId) => {
        const existing = get().code
        if (existing) return existing
        const newCode = generateCode(userId)
        set({ code: newCode })
        return newCode
      },

      recordInvitee: (inviteCode, phone) => {
        if (get().code !== inviteCode) return false
        const masked = maskPhone(phone)
        if (get().invitees.some((i) => i.phone === masked)) return false
        set((s) => ({
          invitees: [
            ...s.invitees,
            { phone: masked, joinedAt: new Date().toISOString(), rewarded: false },
          ],
        }))
        return true
      },

      markRewarded: (phone) =>
        set((s) => ({
          invitees: s.invitees.map((i) =>
            i.phone === phone ? { ...i, rewarded: true } : i
          ),
        })),
    }),
    { name: 'invite-storage' }
  )
)
