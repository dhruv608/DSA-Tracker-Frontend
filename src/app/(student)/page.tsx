export default function StudentHome() {
  return (
    <div className="space-y-8">
      <section className="text-center py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Track your progress, get your rank up
        </h1>
        <p className="text-xl text-gray-600">
          Master DSA with structured learning and progress tracking
        </p>
      </section>
      
      <section className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Top Topics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Topic cards will go here */}
        </div>
        <div className="text-center mt-8">
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
            Show More Topics
          </button>
        </div>
      </section>
    </div>
  );
}
