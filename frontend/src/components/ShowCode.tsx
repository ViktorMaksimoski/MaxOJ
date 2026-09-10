import { useRef, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import toast from "react-hot-toast";
import { ClipboardIcon, DownloadIcon } from "lucide-react";

export const ShowCode = ({ id }) => {
    const [show, setShow] = useState(false);
    const [code, setCode] = useState("");
    const { user, loading } = useAuth();
    const inputRef = useRef(null);
    const gutterRef = useRef(null);

    const getCode = async () => {
        const token = await user?.getIdToken();
        const res = await fetch(`http://localhost:5001/api/codes/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        })

        const data = await res.json();

        if(!data.success) {
            toast.error(data.message);
            return ;
        }

        setCode(data.code);
        // window.alert(data.code)

        setShow(true);
    }

    const copyCode = async() => {
        try {
            await navigator.clipboard.writeText(code);
            toast.success('Кодот е успешно копиран')
        } catch(err) {
            console.log(err);
            toast.error('Кодот не можеше да се копира')
        }
    }

    const downloadCode = () => {
        const blob = new Blob([code], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = `${id}.cpp`

        a.click();

        URL.revokeObjectURL(url);
    }

    const syncScroll = () => {
        if (gutterRef.current && inputRef.current)
            gutterRef.current.scrollTop = inputRef.current.scrollTop;
    };

    if(!show) {
        return (
            <button className="text-white bg-blue-700 text-lg shadow-md
            px-7 py-1.5 mt-5 rounded-md font-medium"
            onClick={getCode}>
                Прикажи код
            </button>
        )
    }

    const lineCount = code.split("\n").length;
    const lineNumbers = Array.from({ length: lineCount }, (_, i) => i + 1).join(
        "\n"
    );

    return (
        <div className="flex border mt-6 resize-none overflow-hidden
        rounded-md border-gray-700 w-full relative"
        style={{ height: "22rem" }}>
            <div className="absolute top-5 right-5 flex items-start gap-5">
                <button className="group bg-sky-500 text-blue-800
                font-mono text-base hover:text-blue-900 py-1 px-1 border-2 
                border-blue-700 flex items-center gap-1"
                onClick={copyCode}>
                    <ClipboardIcon size={23} />

                    <span
                    className="max-w-0 opacity-0 overflow-hidden whitespace-nowrap
                    group-hover:max-w-20 group-hover:opacity-100
                    transition-all duration-200"
                    >
                        Копирај
                    </span>
                </button>
                <button className="group bg-sky-500 text-blue-800 font-mono
                text-base hover:text-blue-900 py-1 px-1 border-2
                border-blue-700 flex items-center gap-1"
                onClick={downloadCode}>
                    <DownloadIcon size={23} />

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
            font-mono text-base leading-5 border-r-2 border-r-blue-700
            bg-sky-500 text-blue-900"
            style={{ width: "2.5rem", overflow: "hidden", whiteSpace: "pre" }}>
                {lineNumbers}
            </div>

            <textarea 
                ref={inputRef}
                spellCheck={false}
                rows={30}
                value={code}
                onScroll={syncScroll}

                className="w-full overflow-y-auto font-mono
                text-base p-3 leading-5 resize-none
                focus:outline-none text-blue-950"

                style={{ maxHeight: "22rem" }}

                readOnly={true}
            />
        </div>
    )
}