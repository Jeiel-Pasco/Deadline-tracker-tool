import React from 'react';
import DeadlineItem from './DeadlineItem';

export default function DeadlineList({ deadlines, onMarkDone }) {
  if (deadlines.length === 0) {
    return (
      <p className="mt-4 text-sm text-slate-600">No deadlines yet. Add one above.</p>
    );
  }

  return (
    <div className="mt-4 space-y-3">
      {deadlines.map((deadline) => (
        <DeadlineItem
          key={deadline.id}
          id={deadline.id}
          subject={deadline.subject}
          taskName={deadline.taskName}
          dueDate={deadline.dueDate}
          onDone={onMarkDone}
        />
      ))}
    </div>
  );
}
