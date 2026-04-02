-- 用户表
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  phone TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  nickname TEXT NOT NULL,
  membership_type TEXT DEFAULT 'free',
  membership_expire_at INTEGER,
  today_analyze_count INTEGER DEFAULT 0,
  total_analyze_count INTEGER DEFAULT 0,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_membership ON users(membership_type);

-- 开奖结果表
CREATE TABLE IF NOT EXISTS lottery_results (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  lottery_type TEXT NOT NULL,
  draw_no TEXT UNIQUE NOT NULL,
  draw_date INTEGER NOT NULL,
  numbers TEXT NOT NULL,
  sum INTEGER NOT NULL,
  created_at INTEGER NOT NULL
);

CREATE INDEX idx_lottery_type_date ON lottery_results(lottery_type, draw_date DESC);
CREATE INDEX idx_lottery_draw_no ON lottery_results(draw_no);

-- 会员订单表
CREATE TABLE IF NOT EXISTS membership_orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  order_no TEXT UNIQUE NOT NULL,
  product_type TEXT NOT NULL,
  amount REAL NOT NULL,
  payment_method TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  paid_at INTEGER,
  created_at INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX idx_orders_user ON membership_orders(user_id);
CREATE INDEX idx_orders_status ON membership_orders(status);

-- 会员日志表
CREATE TABLE IF NOT EXISTS membership_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  action TEXT NOT NULL,
  feature_name TEXT NOT NULL,
  result TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX idx_logs_user ON membership_logs(user_id);
CREATE INDEX idx_logs_created ON membership_logs(created_at DESC);
