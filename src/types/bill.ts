export type BillStatus = 'unpaid' | 'paid' | 'overdue' | 'partial'

export type BillCategory =
  | 'phone'       // 话费
  | 'electricity' // 电费
  | 'water'       // 水费
  | 'gas'         // 燃气费
  | 'property'    // 物业费
  | 'heating'     // 暖气费
  | 'internet'    // 宽带费

export interface Bill {
  id: string
  title: string        // "2024年12月电费"
  category: BillCategory
  amount: number       // 单位：分
  dueDate: string      // "YYYY-MM-DD"
  status: BillStatus
  roomNo?: string
  remark?: string
}

export type PayMethod = 'alipay' | 'wechat' | 'bank_card' | 'balance'

export interface PaymentRecord {
  id: string
  billIds: string[]
  amount: number
  method: PayMethod
  paidAt: string
  status: 'success' | 'failed' | 'pending'
  tradeNo: string
}
