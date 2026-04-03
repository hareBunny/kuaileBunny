import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import './Home.css'

export default function Home() {
  const navigate = useNavigate()
  const [showDisclaimer, setShowDisclaimer] = useState(false)

  return (
    <div className="home-container">
      <div className="header">
        <h1 className="title">百宝箱</h1>
        <p className="subtitle">专业的彩票数据分析工具</p>
        <button type="button" className="profile-btn" onClick={() => navigate('/profile')}>
          👤
        </button>
      </div>
      
      <div className="zone-list">
        <div className="zone-card" onClick={() => navigate('/kuaile8')}>
          <div className="zone-icon">🎯</div>
          <div className="zone-info">
            <div className="zone-name">快乐8专区</div>
            <div className="zone-desc">实时开奖 · 数据分析 · AI预测</div>
          </div>
          <div className="zone-arrow">›</div>
        </div>
        
        <div className="zone-card coming-soon">
          <div className="zone-icon">🎲</div>
          <div className="zone-info">
            <div className="zone-name">更多专区</div>
            <div className="zone-desc">敬请期待...</div>
          </div>
          <div className="zone-badge">即将上线</div>
        </div>
      </div>

      {/* 底部法律条文 */}
      <div className="legal-footer">
        <div className="legal-content">
          <div className="legal-item">
            <span className="legal-icon">🎯</span>
            <span className="legal-text">仅供娱乐参考，不保证中奖</span>
          </div>
          <div className="legal-item">
            <span className="legal-icon">📊</span>
            <span className="legal-text">本软件仅提供数据统计分析</span>
          </div>
          <div className="legal-item">
            <span className="legal-icon">🚫</span>
            <span className="legal-text">不参与投注 · 不收取资金</span>
          </div>
          <button 
            type="button"
            onClick={() => setShowDisclaimer(true)}
            className="legal-link"
          >
            查看完整法律声明 →
          </button>
        </div>
      </div>

      {/* 免责声明弹窗 */}
      {showDisclaimer && (
        <div className="disclaimer-modal" onClick={() => setShowDisclaimer(false)}>
          <div className="disclaimer-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="disclaimer-modal-header">
              <h3>⚠️ 重要声明</h3>
              <button 
                type="button"
                className="disclaimer-modal-close"
                onClick={() => setShowDisclaimer(false)}
              >
                ✕
              </button>
            </div>
            <div className="disclaimer-modal-body">
              <div className="disclaimer-section">
                <div className="disclaimer-title">🎯 仅供娱乐参考</div>
                <p>本软件是彩票数据统计分析工具，不保证中奖，不参与投注，不收取资金。</p>
              </div>
              <div className="disclaimer-section">
                <div className="disclaimer-title">❌ 不保证中奖</div>
                <p>彩票开奖完全随机，本软件仅提供历史数据统计分析，无法预测未来开奖结果。</p>
              </div>
              <div className="disclaimer-section">
                <div className="disclaimer-title">📊 算法说明</div>
                <p>算法仅对历史数据做统计分析（如冷热号、走势图），然后随机生成号码，不存在"内幕"或"特殊算法"。</p>
              </div>
              <div className="disclaimer-section">
                <div className="disclaimer-title">🚫 不参与投注</div>
                <p>本软件不参与实际投注，不代客下单，不收取投注资金。请前往正规彩票销售网点购买。</p>
              </div>
              <div className="disclaimer-section">
                <div className="disclaimer-title">⛔ 禁止虚假宣传</div>
                <p>本软件不以"包中"、"内幕"、"稳赚"等虚假宣传诱导用户付费。</p>
              </div>
              <div className="disclaimer-section">
                <div className="disclaimer-title">🔞 未成年人禁止</div>
                <p>严禁向未成年人（18周岁以下）销售会员服务。</p>
              </div>
              <div className="disclaimer-section">
                <div className="disclaimer-title">💡 理性购彩</div>
                <p>彩票仅供娱乐，请理性购彩，量力而行。不要沉迷，不要借钱购彩。</p>
              </div>
            </div>
            <div className="disclaimer-modal-footer">
              <button 
                type="button"
                className="disclaimer-modal-btn"
                onClick={() => {
                  setShowDisclaimer(false)
                  navigate('/disclaimer')
                }}
              >
                查看完整法律声明
              </button>
              <button 
                type="button"
                className="disclaimer-modal-btn-primary"
                onClick={() => setShowDisclaimer(false)}
              >
                我已了解
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
