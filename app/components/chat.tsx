"use client";

import type {ChangeEvent, FormEvent, KeyboardEventHandler} from "react";
import {useState} from "react";

export function ChatWindow(
    props: {
        endpoint: string
    }
) {
    const [inputValue, setInputValue] = useState('');
    const [returnValue, setReturnValue] = useState('');
    const [loading, setLoading] = useState(false); // 新增的加载状态变量

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    const handleShortCutKeyPress = async (e:any) => {
        if (e.key === 'Enter') {
            await sendContent(e);
        }
    }
    async function sendContent(e: FormEvent | KeyboardEvent) {
        e.preventDefault();
        setLoading(true); // 开始加载

        const response = await fetch(props.endpoint, {
            method: 'POST',
            body: JSON.stringify({
                content: inputValue
            })
        });
        const data = await response.json();
        console.log(data);
        setReturnValue(JSON.stringify(data, null, 2));
        setLoading(false); // 加载结束
    }

    return (
        <div className="flex w-full flex-col">
            <div className="mt-4 text-center text-gray-400">
                <span className="text-[hsl(80%,80%,80%)]">🌰:  http://www.ccgp.gov.cn/cggg/dfgg/zbgg/202309/t20230910_20674273.htm</span>
            </div>
            <form onSubmit={sendContent} className="flex w-full flex-col">
                <div className="flex w-full mt-4">
                    <input
                        className="grow mr-8 p-4 rounded-2xl"
                        value={inputValue}
                        onChange={handleInputChange}

                    />
                    <button
                        type="submit"
                        className="shrink-0 px-8 py-4 bg-sky-600 rounded-full w-28"
                        onKeyDown={handleShortCutKeyPress}
                    >
                        <span>发送</span>
                    </button>
                </div>

            </form>
            <div className="mt-4 text-center text-gray-400">
                <span className="text-[hsl(80%,80%,80%)]">解析结果</span>
            </div>

            <div className="mt-4 p-4 rounded-xl bg-gray-200 flex-grow">
                {loading ? (
                    <div className="flex flex-col justify-center items-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-sky-600 border-opacity-75 mb-4"></div>
                        <div className="text-center">
                            <span className="text-gray-400">解析中...</span>
                        </div>
                    </div>

                ) : (
                    <pre
                        className="whitespace-pre-wrap break-word"
                    >
                        {returnValue}
                    </pre>
                )}
            </div>
        </div>
    )
}
