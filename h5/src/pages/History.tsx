import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getHistory } from '../api/kuaile8'
import './Common.css'

interface DrawResult {
  draw_no: string
  draw_date: number
  numbers: number[]
  sum: number
}

export default function History() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<DrawResult[]>([])

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const res: any = await getHistory({ days: 7, limit: 20 })
      if (res.data) {
        setData(res.data)
      }
    } catch (error) {
      console.error('加载失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp)
    return date.toLocaleString('zh-CN', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate(-1)}>‹</button>
        <h1 className="page-title">历史数据</h1>
        <div style={{width: '40px'}}></div>
      </div>

      {loading ? (
        <div className="loading">加载中...</div>
      ) : (
        <div className="content">
          {data.length > 0 ? (
            data.map((item, index) => (
              <div key={index} className="card history-card">
                <div className="history-header">
                  <span className="issue">期号：{item.draw_no}</span>
                  <span className="time">{formatDate(item.draw_date)}</span>
                </div>
                <div className="numbers-grid small">
                  {item.numbers.map((num, idx) => (
                    <div key={idx} className="number-ball small">{num}</div>
                  ))}
                </div>
                <div className="sum-info small">
                  总和：<span className="sum-value">{item.sum}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="empty">暂无数据</div>
          )}
        </div>
      )}
    </div>
  )
}
