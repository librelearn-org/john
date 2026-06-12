import type { RecordResponse } from "cloudflare/resources/dns/records.mjs";
import type { Route } from "./+types/home";
import { caller } from "~/utils/trpc/server.server";
import { useNavigate } from "react-router";
import { Edit } from "lucide-react";
import { Button } from "~/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { useTRPC } from "~/utils/trpc/react";

export async function loader(loaderArgs: Route.LoaderArgs) {
    const api = await caller(loaderArgs);
    const dnsEntries = await api.cf.getDNS();

    return dnsEntries;
}

export default function Home({ loaderData: dnsEntriesC }: Route.ComponentProps) {
    const nav = useNavigate()
    const trpc = useTRPC();
    const newEntry = useMutation({
        ...trpc.cf.createDNSRecord.mutationOptions(),
        onSettled(data) {
            nav("/app/dns/" + data?.id);
        },
    });
    return (
        <div className="relative flex flex-col items-center justify-center min-h-screen min-w-full">
            <div className="flex flex-col items-center gap-4">
                {/* header */}
                <h1 className="text-3xl font-bold">DNS Records</h1>

                <Button
                    onClick={() => {
                        newEntry.mutate(
                            {
                                type: "CNAME",
                                name: "temp",
                                content: "siemvk.nl",
                            }
                        )
                    }}
                    variant="secondary"
                >
                    Add new record
                </Button>

                <div className="flex flex-col items-center gap-1">
                    <div className="overflow-hidden rounded-lg border border-gray-700">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-zinc-900">
                                    <tr>
                                        <th className="p-3 text-left">Type</th>
                                        <th className="p-3 text-left">Name</th>
                                        <th className="p-3 text-left">Proxied?</th>
                                        <th className="p-3 text-left">Content</th>
                                        <th className="p-3 text-left">Edit</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {dnsEntriesC.map((entry: RecordResponse) => (
                                        <tr
                                            key={entry.id}

                                            className="border-t border-gray-700 hover:bg-zinc-900"
                                        >
                                            <td className="p-3">{entry.type}</td>
                                            <td className="p-3 break-all">{entry.name}</td>
                                            <td className="p-3">
                                                {entry.proxied ? (
                                                    <span className="text-orange-500">Yes</span>
                                                ) : (
                                                    <span className="text-gray-400">No</span>
                                                )}
                                            </td>
                                            <td className="p-3 break-all font-mono text-sm">
                                                {entry.content}
                                            </td>
                                            <td onClick={() => { nav("/app/dns/" + entry.id) }}>
                                                <Edit></Edit>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}