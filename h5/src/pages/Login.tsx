import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login, register } from '../api/auth'
import { useUserStore } from '../store/user'
import './Login.css'

export default function Login() {
  const navigate = useNavigate()
  const { setUser, setToken } = useUserStore()
  const [isLogin, setIsLogin] = useState(true)
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [nickname, setNickname] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!phone || !password) {
      alert('请填写完整信息')
      return
    }
    
    if (phone.length !== 11) {
      alert('请输入正确的手机号')
      return
    }
    
    if (password.length < 6) {
      alert('密码至少6位')
      return
    }
    
    try {
      setLoading(true)
      
      const res: any = isLogin 
        ? await login({ phone, password })
        : await register({ phone, password, nickname })
      
      if (res.token && res.user) {
        setToken(res.token)
        setUser(res.user)
        alert(isLogin ? '登录成功' : '注册成功')
        navigate('/')
      }
    } catch (error: any) {
      console.error('操作失败:', error)
      alert(error.response?.data?.error || '操作失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      <div className="login-header">
        <h1 className="login-title">快乐8百宝箱</h1>
        <p className="login-subtitle">专业的彩票数据分析工具</p>
      </div>

      <div className="login-card">
        <div className="tab-buttons">
          <button 
            className={isLogin ? 'active' : ''} 
            onClick={() => setIsLogin(true)}
          >
            登录
          </button>
          <button 
            className={!isLogin ? 'active' : ''} 
            onClick={() => setIsLogin(false)}
          >
            注册
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>手机号</label>
            <input
              type="tel"
              placeholder="请输入手机号"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              maxLength={11}
            />
          </div>

          {!isLogin && (
            <div className="form-group">
              <label>昵称</label>
              <input
                type="text"
                placeholder="请输入昵称（可选）"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
              />
            </div>
          )}

          <div className="form-group">
            <label>密码</label>
            <input
              type="password"
              placeholder="请输入密码（至少6位）"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button 
            type="submit" 
            className="submit-btn"
            disabled={loading}
          >
            {loading ? '处理中...' : (isLogin ? '登录' : '注册')}
          </button>
        </form>

        <div className="login-footer">
          <button onClick={() => navigate('/')}>
            暂不登录，先看看
          </button>
        </div>
      </div>
    </div>
  )
}
