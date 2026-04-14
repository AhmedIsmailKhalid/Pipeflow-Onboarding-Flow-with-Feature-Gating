const MOCK_MEMBERS = [
  { name: 'Alex Chen',    email: 'alex@demo.com',    role: 'Owner',  initials: 'AC' },
  { name: 'Jordan Rivera',email: 'jordan@demo.com',  role: 'Admin',  initials: 'JR' },
  { name: 'Sam Patel',    email: 'sam@demo.com',     role: 'Member', initials: 'SP' },
]

export function TeamView() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-900">Team</h1>
        <button className="bg-brand-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-brand-700 transition-colors">
          + Invite member
        </button>
      </div>

      <div className="bg-white border border-slate-100 rounded-xl shadow-sm overflow-hidden">
        <div className="divide-y divide-slate-50">
          {MOCK_MEMBERS.map((member) => (
            <div
              key={member.email}
              className="px-5 py-4 flex items-center gap-4"
            >
              <div className="w-9 h-9 rounded-full bg-brand-100 flex items-center justify-center text-sm font-bold text-brand-700 flex-shrink-0">
                {member.initials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-900">
                  {member.name}
                </p>
                <p className="text-xs text-slate-500 truncate mt-0.5">
                  {member.email}
                </p>
              </div>
              <span className="text-xs font-medium text-slate-500 bg-slate-50 px-2.5 py-1 rounded-full">
                {member.role}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}