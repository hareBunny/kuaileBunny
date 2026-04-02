export const metadata = {
  title: '快乐8百宝箱 API',
  description: '快乐8彩票数据分析API服务',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  )
}
