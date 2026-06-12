import i18n from "i18next";
import { Link, redirect, useNavigate } from "react-router";
import type { Route } from "./+types/_index";
import { auth } from "~/utils/auth/server.server";
import { Button } from "~/components/ui/button";

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
    const nav = useNavigate()
    return (
        <main className="flex flex-col min-h-screen items-center justify-center p-6">
            <img src="https://www.pngplay.com/wp-content/uploads/1/Men-In-Suit-PNG-Background-Stock-Images.png" className="w-64"></img>
            <h1 className="text-4xl font-bold mt-4">John Manager</h1>
            <Button
                onClick={() => { nav("/auth/login") }}
                variant="secondary"
            >
                {i18n.t("auth:login")}
            </Button>

        </main>
    );
}