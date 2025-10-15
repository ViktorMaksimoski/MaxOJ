import { DatabaseIcon, TimerIcon } from "lucide-react";

interface MetadataProps {
  timeL: number;
  memoryL: number;
}

export const Metadata = ({ timeL, memoryL }: MetadataProps) => {
  return (
    <div className="flex mt-2.5 gap-10">
      <button className="flex text-blue-900 text-lg items-center">
        <TimerIcon /> <span className="ml-1 font-semibold mr-0.5">{timeL}</span> s
      </button>
      <button className="flex text-blue-900 text-lg items-center">
        <DatabaseIcon /> <span className="ml-1 mr-0.5 font-semibold">{memoryL}</span> MB
      </button>
    </div>
  );
};
