import type React from "react";
import { AuthOnly } from "./AuthOnly";

interface TasksTableProps {
  children: React.ReactNode;
}

export const TasksTable = ({ children }: TasksTableProps) => {
  return (
    <div className="mt-8">
      <h2 className="text-2xl">Задачи</h2>
      <AuthOnly>
        <table className="mt-2 w-[90%] shadow-sm shadow-blue-200 border border-blue-300 rounded-lg border-separate">
          <thead className="border-gray-100">
            <tr className="h-7">
              <th className="w-[18%] font-semibold text-blue-700">Извор</th>
              <th className="font-semibold text-blue-700">Задача</th>
              <th className="w-[15%] font-semibold text-blue-700">Тежина</th>
            </tr>
          </thead>
          <tbody>{children}</tbody>
        </table>
      </AuthOnly>
    </div>
  );
};
