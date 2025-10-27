import React from 'react';

export default function Dashboard({ authUser }) {
    const isAdmin = authUser?.role === 'admin';

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-xl font-semibold">
                Welcome, {authUser?.name} ({authUser?.role})
            </h1>

            {/* main modules available to all users */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

                <button
                    className="rounded-xl shadow border p-4 text-left hover:shadow-md transition bg-white w-full"
                    onClick={() => { window.location.href = '/kharcha'; }}
                >
                    <div className="text-lg font-medium">Kharcha Map</div>
                    <div className="text-sm text-gray-500">
                        Track monthly expenses and burn
                    </div>
                </button>

                <button
                    className="rounded-xl shadow border p-4 text-left hover:shadow-md transition bg-white w-full"
                    onClick={() => { window.location.href = '/ration'; }}
                >
                    <div className="text-lg font-medium">Ration Brain</div>
                    <div className="text-sm text-gray-500">
                        Grocery price watch / inflation
                    </div>
                </button>

                <button
                    className="rounded-xl shadow border p-4 text-left hover:shadow-md transition bg-white w-full"
                    onClick={() => { window.location.href = '/reminders'; }}
                >
                    <div className="text-lg font-medium">Reminders / Health Guard</div>
                    <div className="text-sm text-gray-500">
                        BP meds, school fees, petrol refill, etc.
                    </div>
                </button>

            </div>

            {/* admin-only tools */}
            {isAdmin && (
                <div className="mt-8">
                    <h2 className="text-lg font-semibold mb-2">Admin Tools</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        <button
                            className="rounded-xl shadow border p-4 text-left hover:shadow-md transition bg-white w-full"
                            onClick={() => { window.location.href = '/admin/users'; }}
                        >
                            <div className="text-lg font-medium">Users</div>
                            <div className="text-sm text-gray-500">
                                Create and manage users
                            </div>
                        </button>

                        <button
                            className="rounded-xl shadow border p-4 text-left hover:shadow-md transition bg-white w-full"
                            onClick={() => { window.location.href = '/admin/categories'; }}
                        >
                            <div className="text-lg font-medium">Categories</div>
                            <div className="text-sm text-gray-500">
                                Budget / spend tags
                            </div>
                        </button>

                    </div>
                </div>
            )}
        </div>
    );
}
