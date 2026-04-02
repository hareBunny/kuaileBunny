export const MEMBERSHIP_TYPES = {
  FREE: 'free',
  MONTHLY: 'monthly',
  QUARTERLY: 'quarterly',
  YEARLY: 'yearly',
  LIFETIME: 'lifetime',
} as const

export const MEMBERSHIP_PRICES = {
  monthly: 29.9,
  quarterly: 79.9,
  yearly: 299,
  lifetime: 999,
}

export const MEMBERSHIP_DAYS = {
  monthly: 30,
  quarterly: 90,
  yearly: 365,
  lifetime: 36500, // 100年
}

export const FREE_USER_LIMITS = {
  daily_analyze_limit: 3,
  history_range_days: 30,
  advanced_stats: false,
  ai_predict: false,
  export_data: false,
}

export const MEMBER_BENEFITS = {
  daily_analyze_limit: -1, // 无限制
  history_range_days: 365,
  advanced_stats: true,
  ai_predict: true,
  export_data: true,
}
