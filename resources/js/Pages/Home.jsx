import React from 'react';

export default function Home({ authUser }) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-gray-100 text-gray-900 p-6">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border p-6 space-y-4">
                <div className="text-center space-y-2">
                    <h1 className="text-2xl font-bold">
                        Roznamcha
                    </h1>
                    <p className="text-sm text-gray-600 leading-relaxed">
                        Your household survival cockpit — track kharcha, grocery inflation,
                        reminders for bills & medicines, and your month-end survival report.
                    </p>
                </div>

                {authUser ? (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
                        <div className="text-sm text-green-700 font-medium">
                            Welcome back, {authUser.name} ({authUser.role})
                        </div>
                        <button
                            className="mt-3 w-full rounded-xl bg-green-600 text-white py-2 text-sm font-semibold hover:bg-green-700 transition"
                            onClick={() => window.location.href = '/dashboard'}
                        >
                            Go to Dashboard
                        </button>
                    </div>
                ) : (
                    <div className="space-y-3">
                        <button
                            className="w-full rounded-xl bg-blue-600 text-white py-2 text-sm font-semibold hover:bg-blue-700 transition"
                            onClick={() => window.location.href = '/login'}
                        >
                            Login
                        </button>

                        <button
                            className="w-full rounded-xl bg-gray-900 text-white py-2 text-sm font-semibold hover:bg-black transition"
                            onClick={() => window.location.href = '/register'}
                        >
                            Sign up (free)
                        </button>
                    </div>
                )}

                <div className="pt-4 text-[11px] text-gray-400 text-center leading-relaxed">
                    v0.1 public preview — landing page is intentionally open.
                </div>
            </div>
        </div>
    );
}
