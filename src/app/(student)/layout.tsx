export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold">DSA Tracker</h1>
            </div>
            <nav className="flex items-center space-x-4">
              <a href="/topics" className="text-gray-600 hover:text-gray-900">Topics</a>
              <a href="/practice" className="text-gray-600 hover:text-gray-900">Practice</a>
              <a href="/leaderboard" className="text-gray-600 hover:text-gray-900">Leaderboard</a>
              <a href="/profile" className="text-gray-600 hover:text-gray-900">Profile</a>
            </nav>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
