const MOCK_REPORTS = [
  { name: 'Sprint Velocity Report',    updated: '2 days ago',  format: 'PDF' },
  { name: 'Team Workload Summary',     updated: '1 week ago',  format: 'CSV' },
  { name: 'Q1 Delivery Performance',   updated: '2 weeks ago', format: 'PDF' },
]

export function ReportsView() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-900">Reports</h1>
        <button className="bg-brand-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-brand-700 transition-colors">
          + New report
        </button>
      </div>

      <div className="bg-white border border-slate-100 rounded-xl shadow-sm overflow-hidden">
        <div className="divide-y divide-slate-50">
          {MOCK_REPORTS.map((report) => (
            <div
              key={report.name}
              className="px-5 py-4 flex items-center gap-4"
            >
              <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500 flex-shrink-0">
                {report.format}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-900">
                  {report.name}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  Updated {report.updated}
                </p>
              </div>
              <button className="text-xs font-medium text-brand-600 hover:text-brand-700 transition-colors flex-shrink-0">
                Download
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}