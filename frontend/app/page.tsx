import Twin from '@/components/twin';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
              Your Digital Twin
            </h1>
            <p className="text-lg text-gray-600 max-w-lg mx-auto leading-relaxed">
              Engage with a personalized AI companion that mirrors your unique personality, offering insightful and tailored conversations.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-xl">
            <Twin />
          </div>

          <footer className="mt-12 text-center text-sm text-gray-500">
            <p>
              Powered by{' '}
              <a
                href="https://x.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-700 hover:text-emerald-800 font-medium transition-colors duration-200"
              >
                xAI
              </a>{' '}
              | Built with{' '}
              <span className="font-medium">Next.js & FastAPI</span>
            </p>
          </footer>
        </div>
      </div>
    </main>
  );
}