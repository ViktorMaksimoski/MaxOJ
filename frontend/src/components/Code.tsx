import { ClipboardIcon, DownloadIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'

interface CodeProps {
    children: string;
}

export const Code = ({ children }: CodeProps) => {
  const inputRef = useRef(null)
  const gutterRef = useRef(null)

  const linesCount = children.split('\n').length
  const lineNumbers = Array.from({ length: linesCount }, (_, i) => i + 1).join(
    "\n"
   );

  const syncScroll = () => {
        if (gutterRef.current && inputRef.current)
            gutterRef.current.scrollTop = inputRef.current.scrollTop;
    };

    const copyCode = async() => {
        try {
            await navigator.clipboard.writeText(children);
            toast.success('Кодот е успешно копиран')
        } catch(err) {
            console.log(err);
            toast.error('Кодот не можеше да се копира')
        }
    }

    const downloadCode = () => {
        const blob = new Blob([children], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = `kod.cpp`

        a.click();

        URL.revokeObjectURL(url);
    }

  return (
    <div className='flex border mt-6 resize-none overflow-hidden
    rounded-md border-blue-400 w-full sm:w-[90%] relative'
    style={{ height: '22rem' }}>
        <div className="absolute top-5 right-8 flex items-start gap-3">
                <button className="group bg-blue-200 text-blue-700
                font-mono text-base hover:text-blue-800 py-1 px-1.5 border-2 
                border-blue-500 flex items-center justify-center"
                onClick={copyCode}>
                    <ClipboardIcon size={19} />

                    <span
                    className="max-w-0 opacity-0 overflow-hidden whitespace-nowrap
                    group-hover:max-w-20 group-hover:opacity-100
                    transition-all duration-200"
                    >
                        Копирај
                    </span>
                </button>
                <button className="group bg-blue-200 text-blue-700 font-mono
                text-base hover:text-blue-800 py-1 px-1.5 border-2
                border-blue-500 flex items-center"
                onClick={downloadCode}>
                    <DownloadIcon size={19} />

                    <span
                    className="max-w-0 opacity-0 overflow-hidden whitespace-nowrap
                    group-hover:max-w-20 group-hover:opacity-100
                    transition-all duration-200"
                    >
                        Спушти
                    </span>
                </button>
            </div>
        <div ref={gutterRef} className="text-center select-none py-3 px-2
        font-mono text-base leading-5 border-r-2 border-r-blue-500
        bg-blue-200 text-blue-700"
        style={{ width: "2.5rem", overflow: "hidden", whiteSpace: "pre" }}>
            {lineNumbers}
        </div>

        <textarea 
            ref={inputRef}
            spellCheck={false}
            rows={30}
            value={children}
            onScroll={syncScroll}

            className="w-full overflow-y-auto font-mono
            text-base p-3 leading-5 resize-none
            focus:outline-none text-blue-950 code-scrollbar"

            style={{ maxHeight: "22rem" }}

            readOnly={true}
            />
    </div>
  )
}
