import type { Bill, PaymentRecord } from '@/types/bill'

export const mockBills: Bill[] = [
  {
    id: 'b001',
    title: '2025年05月电费',
    category: 'electricity',
    amount: 18600,
    dueDate: '2025-06-15',
    status: 'unpaid',
    roomNo: '301',
  },
  {
    id: 'b002',
    title: '2025年05月水费',
    category: 'water',
    amount: 4200,
    dueDate: '2025-06-15',
    status: 'unpaid',
    roomNo: '301',
  },
  {
    id: 'b003',
    title: '2025年05月燃气费',
    category: 'gas',
    amount: 9800,
    dueDate: '2025-06-10',
    status: 'overdue',
    roomNo: '301',
  },
  {
    id: 'b004',
    title: '2025年第二季度物业费',
    category: 'property',
    amount: 120000,
    dueDate: '2025-07-01',
    status: 'unpaid',
    roomNo: '301',
  },
  {
    id: 'b005',
    title: '2025年04月电费',
    category: 'electricity',
    amount: 16400,
    dueDate: '2025-05-15',
    status: 'paid',
    roomNo: '301',
  },
]

export const mockRecords: PaymentRecord[] = [
  {
    id: 'r001',
    billIds: ['b005'],
    amount: 16400,
    method: 'alipay',
    paidAt: '2025-05-10T09:30:00Z',
    status: 'success',
    tradeNo: 'T20250510001',
  },
  {
    id: 'r002',
    billIds: ['b002'],
    amount: 4000,
    method: 'wechat',
    paidAt: '2025-04-12T14:20:00Z',
    status: 'success',
    tradeNo: 'T20250412002',
  },
]

export const categoryLabel: Record<string, string> = {
  phone:       '话费',
  electricity: '电费',
  water:       '水费',
  gas:         '燃气费',
  property:    '物业费',
  heating:     '暖气费',
  internet:    '宽带费',
}

export const categoryIcon: Record<string, string> = {
  phone:       '📱',
  electricity: '⚡',
  water:       '💧',
  gas:         '🔥',
  property:    '🏠',
  heating:     '♨️',
  internet:    '📡',
}
