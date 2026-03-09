type PageHeaderProps = {
  title: string
  description?: string
  action?: React.ReactNode
}

export default function PageHeader({
  title,
  description,
  action,
}: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 mb-6 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {description && (
          <p className="text-sm text-gray-500 mt-1">{description}</p>
        )}
      </div>

      {action && <div>{action}</div>}
    </div>
  )
}