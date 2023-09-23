import {NextRequest, NextResponse} from "next/server";
import {z} from "zod";

import {ChatOpenAI} from "langchain/chat_models/openai";
import {ChatPromptTemplate, HumanMessagePromptTemplate, SystemMessagePromptTemplate,} from "langchain/prompts";
import {createStructuredOutputChainFromZod} from "langchain/chains/openai_functions";
import {Page, chromium} from "playwright";

const proxyUrl = process.env.PROXY_URL
const proxyUsername = process.env.PROXY_USERNAME
const proxyPassword = process.env.PROXY_PASSWORD
let proxyServer: { server: string; username: string | undefined; password: string | undefined; } | undefined = undefined
if (proxyUrl ) {
    proxyServer = {
        server: proxyUrl,
        username: proxyUsername,
        password: proxyPassword,
    }
}

async function openPageResponse(url: string) {
    const browser = await chromium.launch(
        {
            // headless: false,
            args: [
                "--disable-web-security",
                "--disable-extensions",
                "--disable-sync",
                "--disable-setuid-sandbox",
                "--no-first-run",
                "--no-sandbox",
                "--ignore-certificate-errors",
                "--disable-blink-features=AutomationControlled",
                "--user-agent=\"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36\"",
            ],
            proxy: proxyServer,
        }
    );
    const context = await browser.newContext();
    const page: Page = await context.newPage();
    await page.route(
        "**/*",
        (route) => {
            if (route.request().resourceType() in ["image"]) {
                route.abort();
            } else {
                route.continue();
            }
        }
    )
    await page.goto(url);
    const content = await page.innerText("body")
    await browser.close();
    console.log(content)
    return content
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const prompt = new ChatPromptTemplate({
            promptMessages: [
                SystemMessagePromptTemplate.fromTemplate("You are a bidding notice parser, Generate details of a bidding notice"),
                HumanMessagePromptTemplate.fromTemplate("\nInput:\n{input}"),
            ],
            inputVariables: ["input"],
        })

        const content = await openPageResponse(body.content)



        const llm = new ChatOpenAI({modelName: "gpt-3.5-turbo-0613", temperature: 0.7});


        const zodSchema = z.object({
            title: z.string().describe("The title of the bidding notice"),
            city: z.string().describe("The city of the bidding notice"),
            summary: z.string().describe("The summary of the bidding notice"),
            date: z.string().describe("The date of the bidding notice"),
            budget_price: z.string().describe("The budget price of the bidding notice"),
            purchasers_name: z.string().describe("The purchasers contact name of the bidding notice"),
            purchasers_phone: z.string().describe("The purchasers contact phone of the bidding notice"),
        })

        const chain = createStructuredOutputChainFromZod(zodSchema, {
            prompt,
            llm,
            outputKey: "bidding",
        });

        const response = await chain.call({input: content})
        // const response = content

        return NextResponse.json(response, {status: 200})


    } catch (e: any) {
        return NextResponse.json({error: e.message}, {status: 500})
    }
}
