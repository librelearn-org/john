import { createTRPCRouter } from './trpc'
import { greetingRouter } from './routers/greeting'
import { cloudflareTRPCAPI } from './routers/cf'
export const appRouter = createTRPCRouter({
    user: greetingRouter,
    cf: cloudflareTRPCAPI
})

export type AppRouter = typeof appRouter
