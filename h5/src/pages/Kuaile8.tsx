import { useNavigate } from 'react-router-dom'
import './Kuaile8.css'

export default function Kuaile8() {
  const navigate = useNavigate()

  const handleNavigate = (url: string) => {
    navigate(url)
  }

  const handleVipNavigate = (_url: string) => {
    const confirmed = window.confirm('此功能需要开通会员才能使用\n\n是否立即开通？')
    if (confirmed) {
      navigate('/membership')
    }
  }

  return (
    <div className="kuaile8-container">
      <button className="back-button" onClick={() => navigate(-1)}>
        ‹
      </button>
      
      <div className="kuaile8-header">
        <span className="kuaile8-title">快乐8百宝箱</span>
        <span className="kuaile8-subtitle">专业的彩票数据分析工具</span>
      </div>
      
      <div className="section">
        <div className="section-title">🎁 免费工具</div>
        <div className="tool-grid">
          <div className="tool-item" onClick={() => handleNavigate('/latest')}>
            <span className="tool-icon">🎯</span>
            <span className="tool-name">最新开奖</span>
            <span className="tool-desc">实时更新</span>
          </div>
          <div className="tool-item" onClick={() => handleNavigate('/history')}>
            <span className="tool-icon">📅</span>
            <span className="tool-name">历史数据</span>
            <span className="tool-desc">近7天</span>
          </div>
          <div className="tool-item" onClick={() => handleNavigate('/basic-stats')}>
            <span className="tool-icon">📊</span>
            <span className="tool-name">基础统计</span>
            <span className="tool-desc">号码频率</span>
          </div>
        </div>
      </div>
      
      <div className="section vip-section">
        <div className="section-title">👑 会员专区</div>
        <div className="tool-grid">
          <div className="tool-item locked" onClick={() => handleVipNavigate('/analysis')}>
            <span className="tool-icon">🔬</span>
            <span className="tool-name">高级分析</span>
            <span className="tool-desc">深度统计</span>
            <div className="lock-badge">🔒</div>
          </div>
          <div className="tool-item locked" onClick={() => handleVipNavigate('/ai-predict')}>
            <span className="tool-icon">🤖</span>
            <span className="tool-name">AI预测</span>
            <span className="tool-desc">智能推荐</span>
            <div className="lock-badge">🔒</div>
          </div>
          <div className="tool-item locked" onClick={() => handleVipNavigate('/trend-chart')}>
            <span className="tool-icon">📈</span>
            <span className="tool-name">走势图表</span>
            <span className="tool-desc">可视化</span>
            <div className="lock-badge">🔒</div>
          </div>
          <div className="tool-item locked" onClick={() => handleVipNavigate('/export')}>
            <span className="tool-icon">📥</span>
            <span className="tool-name">数据导出</span>
            <span className="tool-desc">Excel</span>
            <div className="lock-badge">🔒</div>
          </div>
        </div>
      </div>
    </div>
  )
}
