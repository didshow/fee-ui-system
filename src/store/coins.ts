import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface CoinsState {
  balance: number
  topUp: (coins: number) => void
  /** Returns false if balance is insufficient — caller must handle */
  spend: (coins: number) => boolean
}

export const useCoinsStore = create<CoinsState>()(
  persist(
    (set, get) => ({
      balance: 1280,
      topUp: (coins) => set((s) => ({ balance: s.balance + coins })),
      spend: (coins) => {
        if (get().balance < coins) return false
        set((s) => ({ balance: s.balance - coins }))
        return true
      },
    }),
    { name: 'coins-storage' }
  )
)
