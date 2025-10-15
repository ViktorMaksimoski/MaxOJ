import React, { useState } from "react";
import toast from "react-hot-toast";

interface SampleProps {
  children: React.ReactNode;
}

export const Sample = ({ children }: SampleProps) => {
  const [hovered, setHovered] = useState(false)
  const deca = React.Children.toArray(children);

  const copyText = async (c) => {
    try {
        await navigator.clipboard.writeText(c.props.children.props.children)
        toast.success('Примерот е успешно копиран')
    } catch(err) {
        toast.error('Не може да се копира примерот')
    }
  }

  return (
    <div className="flex w-full justify-between">
      {deca.map((dete, i) => (
        <div className={`bg-gray-100 border px-4 py-1.5 
        w-[40%] ${hovered && "border-blue-400"} mb-3.5
        hover:bg-sky-100 cursor-pointer`}
        key={i}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={() => copyText(dete)}>{dete}</div>
      ))}
    </div>
  );
};
