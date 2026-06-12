import { useMutation } from "@tanstack/react-query";
import type { Route } from "./+types/dns-edit";
import { useTranslation } from "react-i18next";
import { caller } from "~/utils/trpc/server.server";
import { useTRPC } from "~/utils/trpc/react";
import { useNavigate } from "react-router";
import { useState } from "react";

// Shadcn componenten
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Checkbox } from "~/components/ui/checkbox";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "~/components/ui/select";

export async function loader(loaderArgs: Route.LoaderArgs) {
    const { id } = loaderArgs.params;

    if (!id) {
        console.log("geen id")
        throw new Response("Missing DNS record id", {
            status: 400,
        });
    }

    const api = await caller(loaderArgs);

    return api.cf.getDNSRecord(id);
}

export default function EditDnsRecord({ loaderData: dns }: Route.ComponentProps) {
    const { t } = useTranslation();
    const trpc = useTRPC();
    const nav = useNavigate();

    const [name, setName] = useState(dns.name || "fucking kut shit");
    const [content, setContent] = useState(dns.content || "");
    const [type, setType] = useState(dns.type || "A");
    const [proxied, setProxied] = useState(dns.proxied || false);
    const [bezig, setbezig] = useState(false)

    const editMutation = useMutation({
        ...trpc.cf.updateDNSRecord.mutationOptions(),
        onSettled() {
            nav("/app/dns");
        },
        onMutate() {
            setbezig(true)
            return undefined
        },
    });
    const remover = useMutation({
        ...trpc.cf.removeDNSRecord.mutationOptions(),
        onSettled() {
            nav("/app/dns");
        },
        onMutate() {
            setbezig(true)
            return undefined
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        editMutation.mutate({
            id: dns.id,
            name,
            content,
            type,
            proxied,
        });
    };

    return (
        <div className="container max-w-xl py-10 p-5">
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{dns.name}</h1>
                    <p className="text-sm text-muted-foreground">
                        Bewerk de instellingen voor dit DNS-record.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Record Type */}
                    <div className="space-y-2">
                        <Label htmlFor="type">Type</Label>
                        <Select value={type} onValueChange={setType}>
                            <SelectTrigger id="type">
                                <SelectValue placeholder="Selecteer type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="A">A</SelectItem>
                                <SelectItem value="AAAA">AAAA</SelectItem>
                                <SelectItem value="CNAME">CNAME</SelectItem>
                                <SelectItem value="TXT">TXT</SelectItem>
                                <SelectItem value="MX">MX</SelectItem>

                            </SelectContent>
                        </Select>
                    </div>

                    {/* Name */}
                    <div className="space-y-2">
                        <Label htmlFor="name">Naam (Name)</Label>
                        <Input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    {/* Content/IP */}
                    <div className="space-y-2">
                        <Label htmlFor="content">Inhoud (Content/IP)</Label>
                        <Input
                            id="content"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            required
                        />
                    </div>

                    {/* Proxied Status */}
                    <div className="flex items-center space-x-2 pt-2">
                        <Checkbox
                            id="proxied"
                            checked={proxied}
                            onCheckedChange={(checked) => setProxied(!!checked)}
                        />
                        <Label
                            htmlFor="proxied"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            Proxied (Cloudflare proxy)
                        </Label>
                    </div>

                    {/* Acties */}
                    <div className="flex justify-end gap-2 pt-4">
                        <Button
                            variant="destructive"

                            onClick={() => {
                                remover.mutate({
                                    id: dns.id
                                })
                            }}
                            disabled={bezig}
                        >
                            Verwijder
                        </Button>

                        <Button
                            type="button"
                            onClick={() => nav("/app/dns")}
                            disabled={bezig}
                        >
                            Annuleren
                        </Button>
                        <Button
                            type="submit"
                            disabled={bezig}
                            variant="secondary"
                        >
                            {bezig ? "iets aan het doen..." : "Opslaan"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}