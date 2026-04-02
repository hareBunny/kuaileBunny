import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { createOrder } from '../api/membership'
import { useUserStore } from '../store/user'
import './Common.css'

export default function Membership() {
  const navigate = useNavigate()
  const { user } = useUserStore()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!user) {
      alert('请先登录')
      navigate('/login')
    }
  }, [user, navigate])

  const plans = [
    { name: '月度会员', price: 29.9, days: 30, type: 'monthly' },
    { name: '季度会员', price: 79.9, days: 90, type: 'quarterly', badge: '推荐' },
    { name: '年度会员', price: 299, days: 365, type: 'yearly' },
    { name: '永久会员', price: 999, days: 0, type: 'lifetime' }
  ]

  const handlePurchase = async (productType: string) => {
    if (!user) {
      alert('请先登录')
      navigate('/login')
      return
    }

    try {
      setLoading(true)
      const res: any = await createOrder({ productType })
      
      if (res.payment_url) {
        alert(`订单创建成功！\n订单号：${res.order_no}\n金额：¥${res.amount}\n\n请在新窗口完成支付`)
        // 实际项目中这里应该跳转到支付页面
        // window.location.href = res.payment_url
      }
    } catch (error) {
      console.error('创建订单失败:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate(-1)}>‹</button>
        <h1 className="page-title">开通会员</h1>
        <div style={{width: '40px'}}></div>
      </div>

      <div className="content">
        <div className="card">
          <div className="membership-title">👑 会员特权</div>
          <div className="privilege-list">
            <div className="privilege-item">✓ 无限次数据分析</div>
            <div className="privilege-item">✓ 高级统计图表</div>
            <div className="privilege-item">✓ AI智能预测</div>
            <div className="privilege-item">✓ 数据导出功能</div>
            <div className="privilege-item">✓ 365天历史数据</div>
          </div>
        </div>

        <div className="plans-grid">
          {plans.map((plan, index) => (
            <div key={index} className="plan-card">
              {plan.badge && <div className="plan-badge">{plan.badge}</div>}
              <div className="plan-name">{plan.name}</div>
              <div className="plan-price">¥{plan.price}</div>
              <div className="plan-days">
                {plan.days > 0 ? `${plan.days}天` : '终身'}
              </div>
              <button 
                className="plan-btn"
                onClick={() => handlePurchase(plan.type)}
                disabled={loading}
              >
                {loading ? '处理中...' : '立即开通'}
              </button>
            </div>
          ))}
        </div>

        {/* 重要声明 */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-5 shadow-md border-2 border-amber-400" style={{marginTop: '16px'}}>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">⚠️</span>
            <h3 className="text-amber-900 font-bold text-lg">重要声明</h3>
          </div>
          <div className="space-y-3 text-sm text-amber-900">
            <div className="flex items-start gap-2 bg-white bg-opacity-60 rounded-lg p-3">
              <span className="flex-shrink-0">•</span>
              <p>会员费用<span className="font-bold text-amber-800">仅用于</span>支付软件开发和维护成本</p>
            </div>
            <div className="flex items-start gap-2 bg-white bg-opacity-60 rounded-lg p-3">
              <span className="flex-shrink-0">•</span>
              <p>会员费用<span className="font-bold text-amber-800">不是</span>投注资金</p>
            </div>
            <div className="flex items-start gap-2 bg-white bg-opacity-60 rounded-lg p-3">
              <span className="flex-shrink-0">•</span>
              <p>会员服务<span className="font-bold text-amber-800">不保证</span>任何中奖收益</p>
            </div>
            <div className="flex items-start gap-2 bg-white bg-opacity-60 rounded-lg p-3">
              <span className="flex-shrink-0">•</span>
              <p>本软件<span className="font-bold text-amber-800">不参与</span>实际投注，<span className="font-bold text-amber-800">不代客</span>下单</p>
            </div>
            <div className="flex items-start gap-2 bg-gradient-to-r from-red-100 to-orange-100 rounded-lg p-3 border border-red-300">
              <span className="flex-shrink-0 text-red-600">🔞</span>
              <p className="font-bold text-red-700">未成年人（18周岁以下）禁止购买</p>
            </div>
            <div className="flex items-start gap-2 bg-white bg-opacity-60 rounded-lg p-3">
              <span className="flex-shrink-0">•</span>
              <p>
                购买会员即表示理解并同意
                <button 
                  onClick={() => navigate('/disclaimer')}
                  className="text-blue-600 font-semibold underline mx-1 hover:text-blue-700"
                >
                  法律声明与免责条款
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
