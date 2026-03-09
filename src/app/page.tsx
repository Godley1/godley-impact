export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="px-6 py-20">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-sm font-semibold tracking-wide text-purple-700 uppercase mb-4">
              Volunteer Engagement • Nonprofit Visibility • Community Support
            </p>

            <h1 className="text-4xl md:text-6xl font-bold leading-tight text-gray-900">
              Connecting Volunteers, Nonprofits, and Community Support
            </h1>

            <p className="mt-6 text-lg text-gray-600 max-w-xl">
              Godley Impact helps volunteers track their service, empowers nonprofits to promote their mission, and connects people with trusted local resources and support.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <a
                href="/login"
                className="inline-flex items-center justify-center rounded-xl bg-purple-700 px-6 py-3 text-white font-medium hover:bg-purple-800 transition"
              >
                Get Started
              </a>

              <a
                href="/opportunities"
                className="inline-flex items-center justify-center rounded-xl border border-gray-300 px-6 py-3 text-gray-800 font-medium hover:bg-gray-50 transition"
              >
                Explore Opportunities
              </a>
            </div>

            <p className="mt-4 text-sm text-gray-500">
              Join opportunities, track impact, and discover resources in your community.
            </p>
          </div>

          <div className="rounded-3xl shadow-xl border border-gray-200 bg-gray-50 p-6">
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Community Impact Dashboard
              </h3>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="rounded-xl bg-purple-50 p-4">
                  <p className="text-sm text-gray-500">Hours Logged</p>
                  <p className="text-2xl font-bold text-gray-900">128</p>
                </div>
                <div className="rounded-xl bg-purple-50 p-4">
                  <p className="text-sm text-gray-500">Volunteers</p>
                  <p className="text-2xl font-bold text-gray-900">42</p>
                </div>
                <div className="rounded-xl bg-purple-50 p-4">
                  <p className="text-sm text-gray-500">Nonprofits</p>
                  <p className="text-2xl font-bold text-gray-900">9</p>
                </div>
                <div className="rounded-xl bg-purple-50 p-4">
                  <p className="text-sm text-gray-500">Resources</p>
                  <p className="text-2xl font-bold text-gray-900">24</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="rounded-xl border border-gray-200 p-4">
                  <p className="font-medium text-gray-900">Community Cleanup</p>
                  <p className="text-sm text-gray-500">Joined by 12 volunteers</p>
                </div>
                <div className="rounded-xl border border-gray-200 p-4">
                  <p className="font-medium text-gray-900">Food Distribution Drive</p>
                  <p className="text-sm text-gray-500">8 hours served this week</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Audience Cards Section */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Built for Every Part of the Community
          </h2>

          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Godley Impact supports volunteers, nonprofits, and community members through one connected platform.
          </p>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-2xl shadow-md border border-gray-200 p-6 bg-white text-left">
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Volunteers</h3>
              <p className="text-gray-600 mb-6">
                Discover opportunities, join events, log service hours, and track the impact you make over time.
              </p>
              <a href="/opportunities" className="font-medium text-purple-700 hover:underline">
                Explore Opportunities
              </a>
            </div>

            <div className="rounded-2xl shadow-md border border-gray-200 p-6 bg-white text-left">
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Nonprofits</h3>
              <p className="text-gray-600 mb-6">
                Post volunteer opportunities, manage participation, promote your mission, and measure community engagement.
              </p>
              <a href="/dashboard" className="font-medium text-purple-700 hover:underline">
                View Nonprofit Tools
              </a>
            </div>

            <div className="rounded-2xl shadow-md border border-gray-200 p-6 bg-white text-left">
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Community Members</h3>
              <p className="text-gray-600 mb-6">
                Find local nonprofits, trusted support services, and direct links to resources where help is available.
              </p>
              <a href="/resources" className="font-medium text-purple-700 hover:underline">
                Find Resources
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}