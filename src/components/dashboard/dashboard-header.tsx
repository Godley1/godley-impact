type DashboardHeaderProps = {
  email: string | null
  isAdmin: boolean
}

export default function DashboardHeader({
  email,
  isAdmin,
}: DashboardHeaderProps) {
  return (
    <header className="border-b bg-white px-8 py-4">
      <div className="flex items-center justify-between">

        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Godley Impact Dashboard
          </h2>
          <p className="text-sm text-gray-500">
            Manage volunteer activity and platform impact
          </p>
        </div>

        <div className="text-right">
          <p className="text-sm font-medium text-gray-900">
            {email ?? "User"}
          </p>
          <p className="text-xs text-gray-500">
            {isAdmin ? "Administrator" : "Volunteer"}
          </p>
        </div>

      </div>
    </header>
  )
}