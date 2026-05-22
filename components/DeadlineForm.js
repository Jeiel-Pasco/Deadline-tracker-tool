import React, { useState } from 'react';

export default function DeadlineForm({
  subject,
  taskName,
  dueDate,
  onSubjectChange,
  onTaskNameChange,
  onDueDateChange,
  onSubmit,
}) {
  const [error, setError] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    if (!subject.trim() || !taskName.trim() || !dueDate) {
      setError('Please fill in all fields.');
      return;
    }
    setError('');
    onSubmit(e);
  }

  return (
    <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-slate-700">
          Subject
        </label>
        <div className="mt-1">
          <input
            id="subject"
            name="subject"
            type="text"
            value={subject}
            onChange={(e) => onSubjectChange(e.target.value)}
            className="block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm sm:text-sm text-slate-900"
          />
        </div>
      </div>

      <div>
        <label htmlFor="taskName" className="block text-sm font-medium text-slate-700">
          Task Name
        </label>
        <div className="mt-1">
          <input
            id="taskName"
            name="taskName"
            type="text"
            value={taskName}
            onChange={(e) => onTaskNameChange(e.target.value)}
            className="block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm sm:text-sm text-slate-900"
          />
        </div>
      </div>

      <div>
        <label htmlFor="dueDate" className="block text-sm font-medium text-slate-700">
          Due Date
        </label>
        <div className="mt-1">
          <input
            id="dueDate"
            name="dueDate"
            type="date"
            value={dueDate}
            onChange={(e) => onDueDateChange(e.target.value)}
            className="block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm sm:text-sm text-slate-900"
          />
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      <button
        type="submit"
        className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600"
      >
        Submit
      </button>
    </form>
  );
}
