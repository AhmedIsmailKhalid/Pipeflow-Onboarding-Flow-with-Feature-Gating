const MOCK_METRICS = [
  { label: 'Tasks Completed', value: '48',   change: '+12%', positive: true },
  { label: 'Avg Cycle Time',  value: '3.2d', change: '-8%',  positive: true },
  { label: 'Velocity',        value: '14',   change: '+5%',  positive: true },
  { label: 'Blocked Tasks',   value: '2',    change: '-60%', positive: true },
]

const MOCK_BARS = [42, 67, 55, 80, 91, 74, 88]
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export function AnalyticsView() {
  const maxVal = Math.max(...MOCK_BARS)

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-bold text-slate-900">Analytics</h1>

      {/* Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {MOCK_METRICS.map((metric) => (
          <div
            key={metric.label}
            className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm"
          >
            <p className="text-2xl font-bold text-slate-900">{metric.value}</p>
            <p className="text-xs text-slate-500 mt-1">{metric.label}</p>
            <p className={`text-xs font-medium mt-2 ${metric.positive ? 'text-green-600' : 'text-red-600'}`}>
              {metric.change} vs last week
            </p>
          </div>
        ))}
      </div>

      {/* Bar chart */}
      <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-slate-900 mb-6">
          Tasks Completed — Last 7 Days
        </h2>
        <div className="flex items-end gap-3" style={{ height: '128px' }}>
          {MOCK_BARS.map((val, i) => (
            <div key={i} className="flex-1 flex flex-col items-center justify-end gap-1" style={{ height: '100%' }}>
              <div
                className="w-full bg-brand-500 rounded-t-md"
                style={{ height: `${(val / maxVal) * 100}%` }}
              />
              <span className="text-xs text-slate-400 flex-shrink-0">{DAYS[i]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}