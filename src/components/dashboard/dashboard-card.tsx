type DashboardCardProps = {
  title?: string
  children: React.ReactNode
}

export default function DashboardCard({
  title,
  children,
}: DashboardCardProps) {
  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      {title && (
        <h3 className="text-sm font-semibold text-gray-700 mb-4">
          {title}
        </h3>
      )}

      {children}
    </div>
  )
}