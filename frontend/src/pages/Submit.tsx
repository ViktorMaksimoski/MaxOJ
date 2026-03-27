import { useRef, useState } from "react";
import { JudgeSidebar } from "../layout/JudgeSidebar";
import { useParams } from "react-router";
import { formatNum } from "../lib/formatNum";
import toast from "react-hot-toast";

export const Submit = () => {
  const [code, setCode] = useState(`#include <bits/stdc++.h>
using namespace std;
\nint main() {
    cout << "Hello World" << endl;
    return 0;
}`);
  const inputRef = useRef(null);
  const gutterRef = useRef(null);
  const [bad, setBad] = useState(false);
  const { year, compId, taskId } = useParams();

  const handleKeyDown = (e) => {
    if (e.key !== "Tab") return;
    e.preventDefault();

    const textarea = e.target;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    const val = code.substring(0, start) + "\t" + code.substring(end);
    setCode(val);

    setTimeout(() => {
      textarea.selectionStart = textarea.selctionEnd = start + 1;
    }, 0);
  };

  const forbiddenPatterns = [
    /#\s*pragma/i,
    /system\s*\(/i,
    /fork\s*\(/i,
    /exec\s*\(/i,
    /popen\s*\(/i,
    /fstream\s*\(/i,
  ];

  const submitCode = async () => {
    for (const pattern of forbiddenPatterns)
      if (pattern.test(code)) {
        setBad(true);
        return;
      }

    setBad(false);
  };

  const syncScroll = () => {
    if (gutterRef.current && inputRef.current)
      gutterRef.current.scrollTop = inputRef.current.scrollTop;
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if(!file) return ;

    if(!file.name.endsWith(".cpp")) {
      toast.error('Може да прикачите за .cpp фајл')
      return ;
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      setCode(event.target.result)
    }
    reader.readAsText(file)
  }

  const lineCount = code.split("\n").length;
  const lineNumbers = Array.from({ length: lineCount }, (_, i) => i + 1).join(
    "\n"
  );

  return (
    <div className="flex justify-evenly w-full px-12 pt-3 gap-6">
      <div
        className="hidden sm:flex sm:flex-1 sm:sticky sm:top-24 
          sm:h-fit sm:self-start"
      >
        <JudgeSidebar />
      </div>
      <div className="flex-[3] mb-4 w-full [&_b]:text-blue-900">
        <h1 className="text-bold text-4xl tracking-wide">
          Испратете решение за {formatNum(taskId)} задача
        </h1>

        <div
          className={`flex border mt-6 rounded-sm overflow-hidden resize-none
        ${bad ? "border-[3px] border-red-600" : "border-gray-700"}`}
          style={{ maxHeight: "22rem" }}
        >
          <div
            ref={gutterRef}
            className={`text-center select-none py-3 px-2 
            font-mono text-base leading-5 border-r-2 border-r-blue-700
            ${bad ? "bg-red-300 text-red-700" : "bg-sky-500 text-blue-900"}`}
            style={{ width: "2.5rem", overflow: "hidden", whiteSpace: "pre" }}
          >
            {lineNumbers}
          </div>

          <textarea
            ref={inputRef}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onScroll={syncScroll}
            onKeyDown={handleKeyDown}
            rows={30}
            spellCheck={false}
            className={`w-full overflow-y-auto font-mono 
            text-base p-3 leading-5 resize-none
            focus:outline-none text-blue-950`}
            style={{ maxHeight: "22rem" }}
          />
        </div>
        <div className="flex mt-3 gap-6">
          <button
            onClick={submitCode}
            className="self-start tracking-wide border-[1.5px] 
          border-sky-400 bg-blue-800 hover:bg-blue-900 text-white 
          font-medium px-5 py-2 rounded-sm transition"
          >
            Испрати
          </button>
          
          <div className="flex items-center gap-4">
              <input type="file" 
              accept=".cpp" id="fileUpload"
              className="hidden"
              onChange={handleFileUpload} />

              <label htmlFor="fileUpload" className="tracking-wide
              border-[1.5px] border-sky-400 bg-blue-800
              hover:bg-blue-900 text-white font-medium px-5 py-2
              rounded-sm transition">
                Прикачи
              </label>
          </div>
        </div>
      </div>
    </div>
  );
};
