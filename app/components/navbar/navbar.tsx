import { Link, useLocation } from "react-router";

type knop = {
    title: string,
    linkTo: string
}

type NavbarProps = {
    knoppen?: knop[]
}

export const Navbar = ({ knoppen }: NavbarProps = {}) => {
    const buttons = knoppen ?? [
        { title: "Home", linkTo: "/app" },
        { title: "Learn", linkTo: "/app/learn" },
        { title: "Lists", linkTo: "/app/lists/viewer" },
    ]

    const location = useLocation()

    return (
        <aside className="sticky top-0 flex h-screen w-72 shrink-0 flex-col border-r border-neutral-800 bg-neutral-950 px-4 py-5 text-neutral-50">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">Navigation</p>
                    <p className="mt-1 text-sm text-neutral-300">Signed in</p>
                </div>
            </div>

            <div className="flex flex-1 flex-col gap-1">
                {buttons.map((knop) => {
                    const active = location.pathname === knop.linkTo

                    return (
                        <Link
                            key={`${knop.linkTo}-${knop.title}`}
                            to={knop.linkTo}
                            className={[
                                "rounded-xl px-4 py-3 text-sm font-medium transition-colors",
                                active
                                    ? "bg-white text-neutral-950 shadow-sm"
                                    : "text-neutral-300 hover:bg-neutral-900 hover:text-white",
                            ].join(" ")}
                        >
                            {knop.title}
                        </Link>
                    )
                })}
            </div>
        </aside>
    )
}