import { useEffect, useState } from 'react'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs'
import toast from 'react-hot-toast'

interface CodeProps {
    children: string;
}

export const Code = ({ children }: CodeProps) => {
  const [lines, setLines] = useState<string[]>([]);
  const [show, setShow] = useState<boolean>(true);

  useEffect(() => {
    setLines(children.split('\n'))
  }, [])

  const copyText = async () => {
    try {
        await navigator.clipboard.writeText(children);
        toast.success('Кодот е успешно копиран')
    } catch(err) {
        console.log(err)
    }
  }

  const showButton = () => {
    setShow(!show);
  }

  const displayedCode = !show ? lines.join('\n') : lines.slice(0, 15).join('\n')

  return (
    <div className='w-[90%] py-2 bg-sky-50 mt-2 relative shadow-md shadow-slate-200'>
        <button className='absolute top-2 right-3
        text-white bg-blue-500 font-semibold text-base
         px-3 py-0.5 shadow-md shadow-sky-200
         hover:bg-blue-600'
         onClick={() => copyText()}>
            Копирај
        </button>
        <div className='px-4 py-1 whitespace-pre'>
            <SyntaxHighlighter language="cpp" style={docco}>
                {displayedCode}
            </SyntaxHighlighter>
            {lines.length > 10 && <div className='w-full text-center'>
                <button className='bg-blue-500 font-semibold mb-1
                text-base shadow-sm shadow-sky-200 text-white
                px-3 py-0.5' onClick={() => showButton()}>
                    {show ? "Прикажи повеќе" : "Скриј"}
                </button>
            </div>}
        </div>
    </div>
  )
}
