import { useEffect, useState } from "react";
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
        { title: "DNS", linkTo: "/app/dns" },
    ]

    const location = useLocation()
    const [quote, setQuote] = useState("");
    function isFeestdagenPeriode(): boolean {
        const nu = new Date();
        const maand = nu.getMonth(); // Let op: Januari = 0, December = 11
        const dag = nu.getDate();

        // Check 1: Is het december vanaf de 6e?
        if (maand === 11 && dag >= 6) {
            return true;
        }

        // Check 2: Is het januari tot en met de 3e?
        if (maand === 0 && dag <= 3) {
            return true;
        }

        return false;
    }
    function isklaasPeriode(): boolean {
        const nu = new Date();
        const maand = nu.getMonth(); // Let op: Januari = 0, December = 11
        const dag = nu.getDate();

        if (maand === 10 && dag >= 9) {
            return true;
        }
        if (maand === 11 && dag <= 6) {
            return true;
        }

        return false;
    }
    useEffect(() => {
        if (isFeestdagenPeriode()) {
            setQuote(feestdagen[Math.floor(Math.random() * feestdagen.length)]);
        } else if (isklaasPeriode()) {
            setQuote(bigS[Math.floor(Math.random() * bigS.length)]);
        } else {
            setQuote(qoutes[Math.floor(Math.random() * qoutes.length)]);
        }
    }, []);
    const qoutes = [
        "Manager sinds 2026",
        "0/10 op goolge reviews",
        "WAAROM IS DE CLOUDFLARE API ZO KUT",
        "Niet te verwarren met John Deere.",
        "WIE IS JOHN?!?!??",
        "-2 gebruikers",
        "Discord integratie komt misschien ooit",
        "stuur help",
        "Werkt niet op mobiel!",
        "FUCK JONATAN",
        "Wist je dat John 'God is genadig' betekend",
        "fijne {maand}!",
        "Minecraft is een leuk spel",
        "John is niet echt, hij is simpleweg de naam van de website.",
        "Bijna weer kerst.... (hoop ik, deze berichten zijn random)",
        "Bijna weer sinterklaas.... (hoop ik, deze berichten zijn random)",
        "Ik zou nu moeten leren maar ipv dat ben ik dingen aan het bedenken om hier neer te zetten (:",
        "(:",
        "):<",
        "Betaal je belasting!",
        "Beter dan ash dmen voor dns veranderingen!",
        "Beter dan gekke account toegang!",

    ]
    const feestdagen = [
        "fijne feestdagen",
        "o o o ik kan niet wachten",
        "alles geurt naar kerst",
        "Samenwarmgezellig, samen bij elkaar",
        "m m m ik verheug me op dit feest ieder jaar",
        "iets over takken met kerstbomen en een bos",
        "ER ZIJN GEEN BETAALDE VAKANTIEDAGEN, dit is omdat er geen betaalde dagen zijn.",
        "John (die niet echt is) wenst je een fijne feestdagen!",
        "chocolademelk",
        "Sneeuw plz",
        "jammer dat de sint weer weg is ):",
        ":D"
    ]
    const bigS = [
        "Fijne sinterklaas",
        "PEPERNOTEN",
        "Zie ginds komt de stoomboot uit Spanje weer aan",
        "Sinterklaas kapoentje, gooi wat in mijn schoentje",
        "psst wil je een geheim weten? Sinterklaas is niet echt, jij kan nooit zo veel schoenen vullen als hij, hij doet het dus gwn helemaal niet zelf, hij heeft een deal met bol.com, hij sturen die kado's gewoon naar jouw huis en zegt dat hij ze in jouw schoen heeft gedaan",
        "John (die niet echt is) wenst je een fijne sinterklaas!",
        "DE KESTMAN IS EEN GOEDKOPE VERSIE VAN SINTERKLAAS DIE ALLEEN OP KERST BESTAAT",
        "Sinterklaas is eigenlijk gewoon de kerstman die in december werkt",
    ]

    return (
        <aside className="sticky top-0 flex h-screen w-72 shrink-0 flex-col border-r border-neutral-800 bg-neutral-950 px-4 py-5 text-neutral-50">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">JOHN MANAGER</p>
                    <p className="mt-1 text-sm text-neutral-300">{quote}</p>
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