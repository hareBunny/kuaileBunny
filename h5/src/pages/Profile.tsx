import { useNavigate } from 'react-router-dom'
import { useUserStore } from '../store/user'
import './Common.css'

export default function Profile() {
  const navigate = useNavigate()
  const { user, logout } = useUserStore()

  const handleLogout = () => {
    if (confirm('确定要退出登录吗？')) {
      logout()
      navigate('/login')
    }
  }

  if (!user) {
    return (
      <div className="page-container">
        <div className="page-header">
          <button className="back-btn" onClick={() => navigate(-1)}>‹</button>
          <h1 className="page-title">我的</h1>
          <div style={{width: '40px'}}></div>
        </div>

        <div className="content">
          <div className="card">
            <div className="profile-avatar">👤</div>
            <div className="profile-name">未登录</div>
            <button className="primary-btn" onClick={() => navigate('/login')}>
              立即登录
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate(-1)}>‹</button>
        <h1 className="page-title">我的</h1>
        <div style={{width: '40px'}}></div>
      </div>

      <div className="content">
        <div className="card">
          <div className="profile-avatar">👤</div>
          <div className="profile-name">{user.nickname}</div>
          <div className="profile-phone">{user.phone}</div>
          <div className="profile-membership">
            {user.membershipType === 'free' ? '免费用户' : '会员用户'}
          </div>
          
          {user.membershipType === 'free' && (
            <button className="primary-btn" onClick={() => navigate('/membership')}>
              开通会员
            </button>
          )}
          
          <button className="secondary-btn" onClick={handleLogout}>
            退出登录
          </button>
        </div>

        {/* 法律声明入口 */}
        <div className="card" style={{marginTop: '16px'}}>
          <button 
            className="menu-item" 
            onClick={() => navigate('/disclaimer')}
            style={{
              width: '100%',
              padding: '16px',
              textAlign: 'left',
              background: 'none',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer'
            }}
          >
            <span style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
              <span>⚖️</span>
              <span>法律声明与免责条款</span>
            </span>
            <span>›</span>
          </button>
        </div>
      </div>
    </div>
  )
}
