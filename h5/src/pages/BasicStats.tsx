import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getBasicStats } from '../api/kuaile8'
import './Common.css'

interface NumberStat {
  number: number
  count: number
  percentage: number
}

export default function BasicStats() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<NumberStat[]>([])
  const [totalDraws, setTotalDraws] = useState(0)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const res: any = await getBasicStats({ days: 100 })
      if (res.data) {
        setData(res.data.slice(0, 20)) // 只显示前20个
        setTotalDraws(res.total_draws || 0)
      }
    } catch (error) {
      console.error('加载失败:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate(-1)}>‹</button>
        <h1 className="page-title">基础统计</h1>
        <div style={{width: '40px'}}></div>
      </div>

      {loading ? (
        <div className="loading">加载中...</div>
      ) : (
        <div className="content">
          <div className="card">
            <div className="card-title">号码出现频率（近{totalDraws}期）</div>
            <div className="stats-list">
              {data.map((item, index) => (
                <div key={index} className="stat-item">
                  <div className="stat-rank">{index + 1}</div>
                  <div className="stat-number">{item.number}</div>
                  <div className="stat-bar">
                    <div 
                      className="stat-bar-fill" 
                      style={{width: `${item.percentage}%`}}
                    ></div>
                  </div>
                  <div className="stat-count">{item.count}次</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
