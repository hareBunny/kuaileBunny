import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function DisclaimerModal() {
  const [show, setShow] = useState(false)
  const [agreed, setAgreed] = useState(false)
  const [isAdult, setIsAdult] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    // 检查是否已同意过
    const hasAgreed = localStorage.getItem('disclaimer_agreed')
    if (!hasAgreed) {
      setShow(true)
    }
  }, [])

  const handleAgree = () => {
    if (!agreed || !isAdult) {
      alert('请确认您已年满18周岁并同意所有条款')
      return
    }

    localStorage.setItem('disclaimer_agreed', 'true')
    localStorage.setItem('disclaimer_agreed_time', new Date().toISOString())
    setShow(false)
  }

  const handleViewFull = () => {
    navigate('/disclaimer')
  }

  if (!show) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        {/* 头部 */}
        <div className="bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 text-white p-5 relative overflow-hidden">
          <div className="absolute inset-0 bg-black opacity-10"></div>
          <div className="relative flex items-center justify-center gap-2">
            <span className="text-3xl">⚠️</span>
            <h2 className="text-xl font-bold">重要声明</h2>
          </div>
          <p className="text-center text-sm mt-1 opacity-90">请仔细阅读以下内容</p>
        </div>

        {/* 内容 */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-gray-50">
          {/* 核心声明 */}
          <div className="bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-400 rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">🎯</span>
              <h3 className="font-bold text-red-700 text-lg">仅供娱乐参考</h3>
            </div>
            <p className="text-sm text-gray-800 leading-relaxed pl-8">
              本软件是彩票数据统计分析工具，<span className="font-bold text-red-600 bg-red-100 px-1 rounded">不保证中奖</span>，
              <span className="font-bold text-red-600 bg-red-100 px-1 rounded">不参与投注</span>，
              <span className="font-bold text-red-600 bg-red-100 px-1 rounded">不收取资金</span>。
            </p>
          </div>

          {/* 关键条款 */}
          <div className="space-y-3">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <div className="flex items-start gap-3">
                <span className="text-2xl flex-shrink-0">❌</span>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">不保证中奖</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    彩票开奖完全随机，本软件仅提供历史数据统计分析，无法预测未来开奖结果。
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <div className="flex items-start gap-3">
                <span className="text-2xl flex-shrink-0">📊</span>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">算法说明</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    算法仅对历史数据做统计分析（如冷热号、走势图），然后随机生成号码，不存在"内幕"或"特殊算法"。
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <div className="flex items-start gap-3">
                <span className="text-2xl flex-shrink-0">❌</span>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">不参与投注</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    本软件不参与实际投注，不代客下单，不收取投注资金。请前往正规彩票销售网点购买。
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <div className="flex items-start gap-3">
                <span className="text-2xl flex-shrink-0">❌</span>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">禁止虚假宣传</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    本软件不以"包中"、"内幕"、"稳赚"等虚假宣传诱导用户付费。
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <div className="flex items-start gap-3">
                <span className="text-2xl flex-shrink-0">🔞</span>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">未成年人禁止</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    严禁向未成年人（18周岁以下）销售会员服务。
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 shadow-sm border border-blue-200">
              <div className="flex items-start gap-3">
                <span className="text-2xl flex-shrink-0">💡</span>
                <div>
                  <h4 className="font-bold text-blue-900 mb-1">理性购彩</h4>
                  <p className="text-sm text-blue-800 leading-relaxed">
                    彩票仅供娱乐，请理性购彩，量力而行。不要沉迷，不要借钱购彩。
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 查看完整条款 */}
          <button
            onClick={handleViewFull}
            className="w-full text-blue-600 text-sm font-medium py-2 hover:text-blue-700 transition-colors flex items-center justify-center gap-1"
          >
            <span>查看完整法律声明与免责条款</span>
            <span>→</span>
          </button>

          {/* 确认选项 */}
          <div className="space-y-3 pt-3 border-t-2 border-gray-200">
            <label className="flex items-start gap-3 cursor-pointer bg-white rounded-lg p-3 border-2 border-gray-200 hover:border-red-300 transition-colors">
              <input
                type="checkbox"
                checked={isAdult}
                onChange={(e) => setIsAdult(e.target.checked)}
                className="mt-0.5 w-5 h-5 text-red-600 rounded focus:ring-2 focus:ring-red-500"
              />
              <span className="text-sm text-gray-800 leading-relaxed">
                我确认已年满<span className="font-bold text-red-600 text-base">18周岁</span>
              </span>
            </label>

            <label className="flex items-start gap-3 cursor-pointer bg-white rounded-lg p-3 border-2 border-gray-200 hover:border-red-300 transition-colors">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-0.5 w-5 h-5 text-red-600 rounded focus:ring-2 focus:ring-red-500"
              />
              <span className="text-sm text-gray-800 leading-relaxed">
                我已完整阅读、理解并同意遵守<span className="font-bold text-gray-900">法律声明与免责条款</span>的全部内容
              </span>
            </label>
          </div>
        </div>

        {/* 底部按钮 */}
        <div className="p-5 bg-white border-t-2 border-gray-100">
          <button
            onClick={handleAgree}
            disabled={!agreed || !isAdult}
            className={`w-full py-4 rounded-xl font-bold text-lg transition-all transform ${
              agreed && isAdult
                ? 'bg-gradient-to-r from-red-500 via-orange-500 to-red-500 text-white hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {agreed && isAdult ? '✓ 同意并继续' : '请先确认所有选项'}
          </button>
          <p className="text-xs text-gray-500 text-center mt-2">
            点击即表示您已理解并接受所有条款
          </p>
        </div>
      </div>
    </div>
  )
}
