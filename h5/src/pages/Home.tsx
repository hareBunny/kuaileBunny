import { useNavigate } from 'react-router-dom'
import './Home.css'

export default function Home() {
  const navigate = useNavigate()

  return (
    <div className="home-container">
      <div className="header">
        <h1 className="title">百宝箱</h1>
        <p className="subtitle">专业的彩票数据分析工具</p>
        <button className="profile-btn" onClick={() => navigate('/profile')}>
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

      {/* 免责声明 */}
      <div className="px-5 py-6 text-center bg-gradient-to-b from-transparent to-gray-100">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 max-w-sm mx-auto">
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="text-xl">⚠️</span>
            <p className="text-red-600 font-bold text-sm">
              仅供娱乐参考，不保证中奖
            </p>
          </div>
          <p className="text-xs text-gray-600 leading-relaxed mb-3">
            本软件仅提供数据统计分析<br/>
            不参与投注 · 不收取资金
          </p>
          <button 
            onClick={() => navigate('/disclaimer')}
            className="text-blue-600 text-xs font-medium hover:text-blue-700 transition-colors flex items-center justify-center gap-1 mx-auto"
          >
            <span>查看完整法律声明</span>
            <span>→</span>
          </button>
        </div>
      </div>
    </div>
  )
}
