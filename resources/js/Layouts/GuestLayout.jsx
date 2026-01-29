import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="flex min-h-screen flex-col items-center bg-gray-100 pt-6 sm:justify-center sm:pt-0">
            <div>
                <Link href="/" className="flex items-center gap-3 text-[#001a4a] font-semibold">
                    <img
                        src="/icons/appicon.png"
                        alt="Roznamcha logo"
                        className="h-16 w-16 rounded-2xl border border-[#001a4a]/10 bg-white object-cover shadow-md"
                    />
                    <div className="text-left leading-tight hidden sm:block">
                        <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Roznamcha</p>
                        <p className="text-base text-slate-700">Household Control Room</p>
                    </div>
                </Link>
            </div>

            <div className="mt-6 w-full overflow-hidden bg-white px-6 py-4 shadow-md sm:max-w-md sm:rounded-lg">
                {children}
            </div>
        </div>
    );
}
