import i18n from "i18next";
import { Link, redirect } from "react-router";
import type { Route } from "./+types/_index";
import { auth } from "~/utils/auth/server.server";

export async function loader(loaderArgs: Route.LoaderArgs) {
    const headers = new Headers(loaderArgs.request.headers);
    const result = await auth.api.getSession({ headers });
    const user = result?.user;

    if (user) {
        return redirect("/app");
    }

    return null;
}

export default function Home() {
    return (
        <main className="flex min-h-screen items-center justify-center p-6">
            <Link
                to="/auth/login"
                className="inline-flex h-11 items-center justify-center rounded-md border border-neutral-300 bg-white px-5 text-sm font-medium text-neutral-900 shadow-sm transition-colors hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:ring-offset-2"
            >
                {i18n.t("auth:login")}
            </Link>
        </main>
    );
}