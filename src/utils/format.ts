/**
 * 金额：分 → 元，保留两位小数
 * @example formatAmount(8800) → "88.00"
 */
export function formatAmount(fen: number): string {
  return (fen / 100).toFixed(2)
}

/**
 * 金额：分 → 带 ¥ 符号
 * @example formatAmountWithSymbol(8800) → "¥88.00"
 */
export function formatAmountWithSymbol(fen: number): string {
  return `¥${formatAmount(fen)}`
}

/**
 * 日期：YYYY-MM-DD → "YYYY年MM月DD日"
 * @example formatDate("2025-01-15") → "2025年01月15日"
 */
export function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split('-')
  return `${year}年${month}月${day}日`
}

/**
 * 日期：YYYY-MM-DD → "MM月DD日"
 * @example formatDateShort("2025-01-15") → "01月15日"
 */
export function formatDateShort(dateStr: string): string {
  const [, month, day] = dateStr.split('-')
  return `${month}月${day}日`
}

/**
 * 判断账单是否已逾期
 */
export function isOverdue(dueDate: string): boolean {
  return new Date(dueDate) < new Date(new Date().toDateString())
}
