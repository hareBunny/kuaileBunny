import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getLatest } from '../api/kuaile8'
import './Common.css'

interface DrawResult {
  draw_no: string
  draw_date: number
  numbers: number[]
  sum: number
}

export default function Latest() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<DrawResult | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const res: any = await getLatest()
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
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate(-1)}>‹</button>
        <h1 className="page-title">最新开奖</h1>
        <div style={{width: '40px'}}></div>
      </div>

      {loading ? (
        <div className="loading">加载中...</div>
      ) : data ? (
        <div className="content">
          <div className="card">
            <div className="card-title">期号：{data.draw_no}</div>
            <div className="draw-time">开奖时间：{formatDate(data.draw_date)}</div>
            
            <div className="numbers-grid">
              {data.numbers.map((num, index) => (
                <div key={index} className="number-ball">{num}</div>
              ))}
            </div>
            
            <div className="sum-info">
              <span>总和：</span>
              <span className="sum-value">{data.sum}</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="empty">暂无数据</div>
      )}
    </div>
  )
}
