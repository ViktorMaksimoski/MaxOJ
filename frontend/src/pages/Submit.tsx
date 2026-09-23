import { useRef, useState } from "react";
import { JudgeSidebar } from "../layout/JudgeSidebar";
import { useNavigate, useParams } from "react-router";
import { formatNum } from "../lib/formatNum";
import { useAuth } from "../contexts/AuthContext";
import toast from "react-hot-toast";

export const Submit = () => {
  const [code, setCode] = useState(`#include <bits/stdc++.h>
using namespace std;
\nint main() {
    cout << "Hello World" << endl;
    return 0;
}`);
  const { user, loading } = useAuth();
  const inputRef = useRef(null);
  const gutterRef = useRef(null);
  const [bad, setBad] = useState(false);
  const { year, compId, taskId } = useParams();
  const navigate = useNavigate();

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
    if(code.length > 6000) {
      toast.error('Вашиот код не смее да содржи повеќе од 6000 карактери')
      setBad(true);
      return ;
    }
    
    for (const pattern of forbiddenPatterns)
      if (pattern.test(code)) {
        setBad(true);
        toast.error(`Вашиот код не смее да содржи ${pattern}`)
        return;
      }

    if(!user) {
      toast.error("Мора да бидете најавени за да пратите решение")
      return ;
    }

    const pid = `${year}${compId}${taskId}`;
    const token = await user.getIdToken();

    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/submission`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({
        pid: pid,
        code: code
      })
    })

    const data = await res.json();

    if(!data.success) {
      toast.error(data.message || "Грешка при испраќање на решението")
      return ;
    }

    await toast.success("Решението е успешно испратено")

    setTimeout(() => {
      navigate(`/judge/submission/${data.submissionId}`)
    }, 1000)

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
        <h1 className="font-medium text-gray-800 text-3xl tracking-wide">
          Испратете решение за {formatNum(taskId)} задача
        </h1>

        <div
          className={`flex border mt-6 rounded-md overflow-hidden resize-none
        ${bad ? "border-[3px] border-red-600" : "border-blue-400"}`}
          style={{ maxHeight: "22rem" }}
        >
          <div
            ref={gutterRef}
            className={`text-center select-none py-3 px-2
            font-mono text-base leading-5 border-r-2 
            ${!bad ? "border-r-blue-500" : "border-r-red-600"}
            ${bad ? "bg-red-300 text-red-700" : "bg-blue-200 text-blue-700"}`}
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
            focus:outline-none text-blue-950 code-scrollbar`}
            style={{ maxHeight: "22rem" }}
          />
        </div>
        <div className="flex mt-3 gap-6">
          <button
            onClick={submitCode}
            className="self-start tracking-wide border-2
          border-blue-300 bg-white hover:border-blue-400 text-blue-700
           font-medium px-5 py-2 rounded-md transition duration-200"
          >
            Испрати
          </button>
          
          <div className="flex items-center gap-4">
              <input type="file" 
              accept=".cpp" id="fileUpload"
              className="hidden"
              onChange={handleFileUpload} />

              <label htmlFor="fileUpload" className="tracking-wide
              border-2 border-blue-300 bg-white
               text-blue-700 font-medium px-5 py-2 hover:border-blue-400
              rounded-md transition duration-200 cursor-pointer">
                Прикачи
              </label>
          </div>
        </div>
      </div>
    </div>
  );
};
