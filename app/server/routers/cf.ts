import type { TRPCRouterRecord } from '@trpc/server'
import { TRPCError } from '@trpc/server'
import { send } from 'vite'
import { z } from 'zod'
import { protectedProcedure, publicProcedure, veryProtectedProcedure } from '~/server/trpc'
import { sendMessageToDiscord } from '~/utils/discord.server'
import Cloudflare from "cloudflare"
import type { RecordEditParams } from 'cloudflare/resources/dns/records.mjs'
const dnsRecordTypes = [
    "A",
    "AAAA",
    "CNAME",
    "TXT",
    "NS",
    "PTR",
] as const;

export const cloudflareTRPCAPI = {
    hello: publicProcedure.query(async ({ ctx }) => {
        return 'hello world'
    }),
    getDNS: veryProtectedProcedure.query(async ({ ctx }) => {
        const client = new Cloudflare()
        const records = await client.dns.records.list({
            zone_id: process.env["CLOUDFLARE_ZONE"] || "0e53a6058c326d60246cced1d779e264",
        });
        return records.result
    }),
    updateDNSRecord: veryProtectedProcedure
        .input(
            z.object({
                id: z.string(),
                type: z.enum(dnsRecordTypes),
                name: z.string(),
                content: z.string(),
                ttl: z.number().default(1),
                proxied: z.boolean().optional(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const client = new Cloudflare()
            try {
                await client.dns.records.edit(input.id, {
                    zone_id: process.env["CLOUDFLARE_ZONE"] || "0e53a6058c326d60246cced1d779e264",
                    type: input.type as RecordEditParams["type"],
                    name: input.name,
                    content: input.content,
                    ttl: input.ttl,
                    proxied: input.proxied,
                })
            } catch (e) {
                console.error(e)
                throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to update DNS record' })
            }
        }),
    removeDNSRecord: veryProtectedProcedure
        .input(
            z.object({
                id: z.string(),
            })
        )
        .mutation(async ({ input }) => {
            const client = new Cloudflare();

            try {
                await client.dns.records.delete(input.id, {
                    zone_id: process.env.CLOUDFLARE_ZONE!,
                });

                return { success: true };
            } catch (e) {
                console.error(e);
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Failed to remove DNS record",
                });
            }
        }),
    createDNSRecord: veryProtectedProcedure
        .input(
            z.object({
                type: z.enum(dnsRecordTypes),
                name: z.string(),
                content: z.string(),
                ttl: z.number().default(1),
                proxied: z.boolean().default(true),
            })
        )
        .mutation(async ({ input }) => {
            const client = new Cloudflare();

            try {
                const record = await client.dns.records.create({
                    zone_id: process.env.CLOUDFLARE_ZONE!,
                    type: input.type,
                    name: input.name,
                    content: input.content,
                    ttl: input.ttl,
                    proxied: input.proxied,
                });

                return record;
            } catch (e) {
                console.error(e);
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Failed to create DNS record",
                });
            }
        }),
    getDNSRecord: veryProtectedProcedure
        .input(
            z.string(),
        )
        .query(async ({ input }) => {
            const client = new Cloudflare();

            try {
                return await client.dns.records.get(input, {
                    zone_id: process.env.CLOUDFLARE_ZONE!,
                });
            } catch (e) {
                console.error(e);
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "DNS record not found",
                });
            }
        }),
} satisfies TRPCRouterRecord
