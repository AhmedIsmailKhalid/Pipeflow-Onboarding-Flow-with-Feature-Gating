const MOCK_PROJECTS = [
  { name: 'Website Redesign',       status: 'In Progress', tasks: 12, completion: 65,  color: 'bg-blue-500' },
  { name: 'Q2 Marketing Campaign',  status: 'Planning',    tasks: 8,  completion: 20,  color: 'bg-purple-500' },
  { name: 'API v2 Development',     status: 'In Progress', tasks: 24, completion: 40,  color: 'bg-green-500' },
]

export function ProjectsView() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-900">Projects</h1>
        <button className="bg-brand-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-brand-700 transition-colors">
          + New project
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {MOCK_PROJECTS.map((project) => (
          <div
            key={project.name}
            className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-3 h-3 rounded-full mt-1 ${project.color}`} />
              <span className="text-xs font-medium text-slate-500 bg-slate-50 px-2 py-1 rounded-full">
                {project.status}
              </span>
            </div>

            <h3 className="font-semibold text-slate-900 mb-1">{project.name}</h3>
            <p className="text-xs text-slate-500 mb-4">
              {project.tasks} tasks
            </p>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs text-slate-500">Progress</span>
                <span className="text-xs font-medium text-slate-700">
                  {project.completion}%
                </span>
              </div>
              <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${project.color}`}
                  style={{ width: `${project.completion}%` }}
                />
              </div>
            </div>
          </div>
        ))}

        {/* Empty new project card */}
        <button className="border-2 border-dashed border-slate-200 rounded-xl p-5 flex flex-col items-center justify-center gap-2 hover:border-brand-300 hover:bg-brand-50 transition-colors group min-h-40">
          <span className="text-2xl">+</span>
          <span className="text-sm font-medium text-slate-500 group-hover:text-brand-600 transition-colors">
            New project
          </span>
        </button>
      </div>
    </div>
  )
}