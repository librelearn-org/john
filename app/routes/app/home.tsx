import type { Route } from "./+types/home";
import { authClient } from "~/utils/auth/client"
import { auth } from '~/utils/auth/server.server'
import { redirect, useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { Button } from "~/components/button/button";
import { useState } from "react";
import packageJson from "~/../package.json" with { type: "json" };

export async function loader(loaderArgs: Route.LoaderArgs) {
    const headers = new Headers(loaderArgs.request.headers)
    const result = await auth.api.getSession({ headers })
    const user = result?.user
    if (!user) {
        return redirect('/auth/login')
    }
    return {
        version: packageJson.version,
        user: user,
        gitCommit: process.env.GITHUB_SHA || process.env.VERCEL_GIT_COMMIT_SHA || "Unknown"
    };
}

export default function Home({ loaderData: {
    version: versie,
    user: user,
    gitCommit
} }: Route.ComponentProps) {
    const { t } = useTranslation();
    const [meerInfo, setMeerInfo] = useState(false)
    return (
        <div className="relative flex flex-col items-center justify-center min-h-screen min-w-full">
            <div className="flex flex-col items-center">
                <div className="flex flex-col items-center gap-1">
                    <h1 className="text-3xl font-bold">Welkom!</h1>
                    <p className="text-lg text-gray-300" onClick={() => { setMeerInfo(!meerInfo) }}>toon {meerInfo ? "minder" : "meer"} info</p>
                    {meerInfo ? <>
                        <p>Versie: {versie}</p>
                        <p>Username: {user.name}</p>
                        <p>Git commit: {gitCommit}</p>
                    </> : undefined}
                </div>
            </div>

        </div>
    )

}
