import Head from "next/head";
import {ChatWindow} from "@/app/components/chat";

export default function Home() {
    return (
        <>
            <Head>
                <title>Bidding Notice Parser</title>
                <meta name="description" content="Bidding Notice Parser" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className=" flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
                <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
                    <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
                        <span className="text-[hsl(280,100%,70%)]">Bidding Notice Parser</span>
                    </h1>
                    <div className="text-xltext-white sm:text-[1.5rem]">
                        <span className="text-[hsl(280,50%,70%)]">Enter the URL of the Bidding Notice link and click send to get the parsing results</span>
                    </div>
                    <ChatWindow endpoint="/api/chat" />
                </div>
            </main>
        </>
    );
}
