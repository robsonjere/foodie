export default function StatsCard({ title, value, unit, icon: Icon, color = 'primary' }) {
  const colorClasses = {
    primary: 'bg-primary-100 text-primary-600',
    secondary: 'bg-secondary-100 text-secondary-600',
    success: 'bg-success-100 text-success-600',
    warning: 'bg-warning-100 text-warning-600',
    danger: 'bg-danger-100 text-danger-600',
  };

  return (
    <div className="card p-6 border-neutral-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-neutral-600 mb-2">{title}</p>
          <div className="flex items-end gap-2">
            <p className="text-3xl md:text-4xl font-bold text-neutral-900">
              {value}
            </p>
            {unit && <span className="text-sm font-medium text-neutral-500 mb-1">{unit}</span>}
          </div>
        </div>
        {Icon && (
          <div className={`p-4 rounded-xl ${colorClasses[color]} shadow-sm`}>
            <Icon size={32} />
          </div>
        )}
      </div>
    </div>
  );
}
