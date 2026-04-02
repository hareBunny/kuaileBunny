import { useNavigate } from 'react-router-dom'

export default function Disclaimer() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* 头部 */}
      <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-4 sticky top-0 z-10">
        <div className="flex items-center">
          <button onClick={() => navigate(-1)} className="mr-3">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-xl font-bold">法律声明与免责条款</h1>
        </div>
      </div>

      {/* 内容 */}
      <div className="p-4 space-y-6">
        {/* 重要声明 */}
        <div className="bg-red-50 border-2 border-red-500 rounded-lg p-4">
          <h2 className="text-lg font-bold text-red-600 mb-2">⚠️ 重要声明</h2>
          <p className="text-gray-700 leading-relaxed">
            本软件（快乐8百宝箱）是一款彩票数据统计分析工具，<span className="font-bold text-red-600">仅供娱乐参考</span>，请用户务必仔细阅读并理解以下条款。
          </p>
        </div>

        {/* 软件性质 */}
        <div className="bg-white rounded-lg p-4 shadow">
          <h2 className="text-lg font-bold text-gray-800 mb-3">一、软件性质说明</h2>
          <div className="space-y-2 text-gray-600">
            <p className="font-semibold">本软件提供以下功能：</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>彩票历史数据查询</li>
              <li>号码统计分析（冷热号、遗漏值等）</li>
              <li>走势图表展示</li>
              <li>随机号码生成</li>
            </ul>
            <div className="mt-3 p-3 bg-yellow-50 border-l-4 border-yellow-500">
              <p className="font-bold text-yellow-800">
                本软件仅作为数据统计和分析工具，所有功能均基于历史数据的统计分析，不具有任何预测功能。
              </p>
            </div>
          </div>
        </div>

        {/* 免责条款 */}
        <div className="bg-white rounded-lg p-4 shadow">
          <h2 className="text-lg font-bold text-gray-800 mb-3">二、免责条款</h2>
          
          <div className="space-y-3">
            <div>
              <h3 className="font-semibold text-red-600 mb-2">❌ 不保证中奖</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-600 ml-2">
                <li>本软件<span className="font-bold">不保证</span>使用者能够中奖</li>
                <li>本软件<span className="font-bold">不保证</span>任何投注收益</li>
                <li>彩票开奖结果完全随机，任何历史数据分析都<span className="font-bold">无法预测</span>未来开奖结果</li>
                <li>使用本软件产生的任何投注损失，软件开发者<span className="font-bold">不承担任何责任</span></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-blue-600 mb-2">📊 算法说明</h3>
              <p className="text-gray-600 mb-2">本软件的算法原理：</p>
              <ol className="list-decimal list-inside space-y-1 text-gray-600 ml-2">
                <li><span className="font-semibold">统计分析</span>：对历史开奖数据进行统计</li>
                <li><span className="font-semibold">数据展示</span>：以图表形式展示统计结果</li>
                <li><span className="font-semibold">随机生成</span>：基于统计数据随机生成号码组合</li>
              </ol>
              <div className="mt-2 p-2 bg-blue-50 rounded text-sm text-blue-800">
                <p>⚠️ 所有算法仅基于历史数据统计，不存在任何"内幕信息"或"特殊算法"</p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-red-600 mb-2">❌ 不参与投注</h3>
              <p className="text-gray-600 mb-2">本软件明确声明：</p>
              <ul className="list-disc list-inside space-y-1 text-gray-600 ml-2">
                <li><span className="font-bold">不参与</span>任何实际投注活动</li>
                <li><span className="font-bold">不代客</span>下单或购买彩票</li>
                <li><span className="font-bold">不收取</span>任何投注资金</li>
                <li><span className="font-bold">不提供</span>任何资金托管服务</li>
                <li><span className="font-bold">不组织</span>任何形式的合买或代购</li>
              </ul>
              <div className="mt-2 p-2 bg-green-50 rounded text-sm text-green-800">
                <p>✅ 用户如需购买彩票，请前往<span className="font-bold">正规彩票销售网点</span>或<span className="font-bold">官方授权平台</span></p>
              </div>
            </div>
          </div>
        </div>

        {/* 禁止虚假宣传 */}
        <div className="bg-white rounded-lg p-4 shadow">
          <h2 className="text-lg font-bold text-gray-800 mb-3">三、禁止虚假宣传</h2>
          
          <div className="space-y-3">
            <div>
              <h3 className="font-semibold text-red-600 mb-2">❌ 严禁使用的宣传用语</h3>
              <div className="grid grid-cols-2 gap-2">
                {['包中', '必中', '稳中', '内幕消息', '稳赚不赔', '保本收益', '专家推荐', '大师预测'].map(word => (
                  <div key={word} className="bg-red-50 text-red-600 px-3 py-1 rounded text-center text-sm">
                    ❌ {word}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-green-600 mb-2">✅ 真实表述</h3>
              <div className="grid grid-cols-2 gap-2">
                {['历史数据查询', '统计分析工具', '数据可视化', '娱乐性参考'].map(word => (
                  <div key={word} className="bg-green-50 text-green-600 px-3 py-1 rounded text-center text-sm">
                    ✅ {word}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 未成年人保护 */}
        <div className="bg-white rounded-lg p-4 shadow">
          <h2 className="text-lg font-bold text-gray-800 mb-3">四、未成年人保护</h2>
          
          <div className="space-y-3">
            <div className="bg-orange-50 border-l-4 border-orange-500 p-3">
              <h3 className="font-semibold text-orange-800 mb-2">❌ 禁止向未成年人销售</h3>
              <ul className="list-disc list-inside space-y-1 text-orange-700 text-sm ml-2">
                <li>本软件<span className="font-bold">严禁</span>向未成年人（18周岁以下）销售会员服务</li>
                <li>未成年人<span className="font-bold">不得</span>购买或使用本软件的付费功能</li>
                <li>如发现未成年人购买，将<span className="font-bold">立即退款</span>并停止服务</li>
              </ul>
            </div>

            <div className="text-sm text-gray-600">
              <p className="font-semibold mb-1">家长监护责任：</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>家长应监督未成年人使用互联网</li>
                <li>家长应妥善保管支付密码和账户信息</li>
                <li>如未成年人擅自购买，家长可联系客服申请退款</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 理性购彩 */}
        <div className="bg-white rounded-lg p-4 shadow">
          <h2 className="text-lg font-bold text-gray-800 mb-3">五、理性购彩提示</h2>
          
          <div className="space-y-3">
            <div className="bg-blue-50 p-3 rounded">
              <h3 className="font-semibold text-blue-800 mb-2">✅ 购彩原则</h3>
              <ul className="list-disc list-inside space-y-1 text-blue-700 text-sm ml-2">
                <li>彩票是一种娱乐方式，请<span className="font-bold">理性购彩</span></li>
                <li>请根据自身经济能力，<span className="font-bold">量力而行</span></li>
                <li>不要将彩票作为投资或赚钱手段</li>
                <li>不要借钱购买彩票</li>
                <li>不要沉迷于购彩</li>
              </ul>
            </div>

            <div className="bg-red-50 p-3 rounded">
              <h3 className="font-semibold text-red-800 mb-2">⚠️ 风险提示</h3>
              <ul className="list-disc list-inside space-y-1 text-red-700 text-sm ml-2">
                <li>彩票中奖概率极低</li>
                <li>购彩可能导致经济损失</li>
                <li>过度购彩可能影响正常生活</li>
                <li>如有购彩成瘾倾向，请及时寻求帮助</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 官方提示 */}
        <div className="bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg p-4">
          <h2 className="text-lg font-bold mb-3">🏛️ 中国福利彩票官方提示</h2>
          <ul className="space-y-2 text-sm">
            <li>✅ 快乐购彩，理性投注</li>
            <li>❌ 未成年人不得购买彩票</li>
            <li>❌ 拒绝非法彩票，远离赌博</li>
          </ul>
        </div>

        {/* 用户确认 */}
        <div className="bg-yellow-50 border-2 border-yellow-500 rounded-lg p-4">
          <h3 className="font-bold text-yellow-800 mb-2">📝 用户确认</h3>
          <p className="text-yellow-700 text-sm leading-relaxed">
            使用本软件即表示您已年满18周岁，已完整阅读、理解并同意遵守本声明的全部内容。
          </p>
        </div>

        {/* 更新日期 */}
        <div className="text-center text-gray-500 text-sm">
          <p>最后更新日期：2026年4月2日</p>
        </div>
      </div>
    </div>
  )
}
