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
        <div
          className="mt-4 w-full sm:w-[90%] overflow-hidden rounded-lg
        border border-blue-300 shadow-sm bg-white"
        >
          <table className="w-full border-collapse">
            <thead className="bg-blue-50 border-b border-blue-200">
              <tr className="h-11">
                <th
                  className="hidden sm:table-cell w-[18%] px-4
                text-center text-sm font-semibold text-blue-600"
                >
                  Извор
                </th>

                <th className="px-4 text-center text-sm font-semibold text-blue-600">
                  Задача
                </th>

                <th className="w-[15%] px-3 text-center text-sm font-semibold text-blue-600">
                  Тежина
                </th>
              </tr>
            </thead>
            <tbody
              className="[&>tr]:border-b [&>tr]:border-slate-100 
            [&>tr:last-child]:border-0 [&>tr]:transition-colors 
            [&>tr:hover]:bg-slate-50"
            >
              {children}
            </tbody>
          </table>
        </div>
      </AuthOnly>
    </div>
  );
};
