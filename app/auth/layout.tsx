import pageUrls from "@/lib/enums/page-urls";
import { features } from "@/lib/mockData";
import Link from "next/link";

const Layout = ({ children }: {
    children: React.ReactNode
}) => {
    return (
        <div className="min-h-screen w-full flex flex-col md:flex-row bg-gradient-to-br from-[#0a0f1a] via-[#101012] to-[#0a192f] relative overflow-hidden">
            <div className="pointer-events-none absolute inset-0 -z-10">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(59,130,246,0.10),transparent)]" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_80%_100%,rgba(34,211,238,0.08),transparent)]" />
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;utf8,<svg width=\'40\' height=\'40\' viewBox=\'0 0 40 40\' fill=\'none\' xmlns=\'http://www.w3.org/2000/svg\'><path d=\'M40 0H0V40\' stroke=\'%233B82F6\' stroke-width=\'1\' opacity=\'0.08\'/></svg>')] opacity-80" />
            </div>
            <div className="hidden md:flex flex-col justify-between w-full max-w-2xl px-12 py-14 bg-zinc-900/70 backdrop-blur-xl shadow-2xl rounded-r-3xl border-r border-blue-500/10">
                <div>
                    <div className="flex items-center gap-2 mb-8">
                        <Link href={pageUrls.HOME} prefetch>
                            <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">Codaive</span>
                        </Link>
                    </div>
                    <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight">Everything you need to code, in <span className="bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">one place</span></h1>
                    <div className="space-y-8 mt-8">
                        {features.map((f, i) => {
                            const Icon = f.icon;
                            return (
                                <div key={i} className="flex items-start gap-4 group">
                                    <Icon className="size-7 text-blue-400 group-hover:scale-110 group-hover:text-cyan-400 transition" />
                                    <div>
                                        <div className="font-semibold text-white mb-1 text-lg group-hover:text-blue-200 transition">{f.title}</div>
                                        <div className="text-zinc-300 text-base leading-relaxed group-hover:text-white/90 transition">{f.desc}</div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
                <div className="flex items-center gap-6 text-zinc-400 text-xs mt-12">
                    <a href="#" className="hover:underline">Terms</a>
                    <a href="#" className="hover:underline">Privacy</a>
                    <a href="#" className="hover:underline">Docs</a>
                    <a href="#" className="hover:underline">Helps</a>
                </div>
            </div>
            <div className="flex-1 flex items-center justify-center">
                {children}
            </div>
        </div>
    )
}

export default Layout;