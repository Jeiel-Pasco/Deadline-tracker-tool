import React from 'react';
import { isPast, parseISO } from 'date-fns';

export default function DeadlineItem({ id, subject, taskName, dueDate, onDone }) {
  const overdue = isPast(parseISO(dueDate));

  return (
    <div
      className={`border rounded-lg p-4 ${
        overdue ? 'bg-red-100 border-red-200' : 'bg-slate-50 border-slate-200'
      }`}
    >
      <p className="text-sm text-slate-600">
        <span className="font-medium text-slate-700">Subject:</span> {subject}
      </p>
      <p className="mt-1 text-sm text-slate-600">
        <span className="font-medium text-slate-700">Task Name:</span> {taskName}
      </p>
      <p className="mt-1 text-sm text-slate-600">
        <span className="font-medium text-slate-700">Due Date:</span> {dueDate}
      </p>
      <button
        type="button"
        onClick={() => onDone(id)}
        className="mt-3 py-1.5 px-3 border border-slate-300 rounded-md text-sm font-medium text-slate-700 bg-white"
      >
        Done
      </button>
    </div>
  );
}
