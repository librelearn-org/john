import { prefix, route, type RouteConfig } from "@react-router/dev/routes";

export default [
    route("/", "routes/_index.tsx"),

    route("/api/auth/*", "routes/api/auth.ts"),
    route("/api/trpc/*", "routes/api/trpc.ts"),

    route("/app", "routes/app/layout.tsx", [
        route("", "routes/app/home.tsx"),
        route("dns", "routes/app/dns.tsx"),
        route("dns/:id", "routes/app/dns-edit.tsx")
    ]),

    ...prefix("auth", [
        route("login", "routes/auth/login.tsx"),
    ]),
    route("/nee", "routes/nee.tsx"),
] satisfies RouteConfig;
