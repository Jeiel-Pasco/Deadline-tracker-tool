import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { compareAsc, parseISO } from 'date-fns';
import { supabase } from '../lib/supabaseClient';
import DeadlineForm from '../components/DeadlineForm';
import DeadlineList from '../components/DeadlineList';

export default function Dashboard() {
  const router = useRouter();
  const [deadlines, setDeadlines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subject, setSubject] = useState('');
  const [taskName, setTaskName] = useState('');
  const [dueDate, setDueDate] = useState('');

  useEffect(() => {
    async function loadDashboard() {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setLoading(false);
        router.push('/login');
        return;
      }

      const { data, error } = await supabase
        .from('deadlines')
        .select('id, subject, task_name, due_date')
        .eq('is_done', false);

      if (error) {
        console.error(error);
        setLoading(false);
        return;
      }

      setDeadlines(
        (data ?? []).map((row) => ({
          id: row.id,
          subject: row.subject,
          taskName: row.task_name,
          dueDate: row.due_date,
        }))
      );
      setLoading(false);
    }
    loadDashboard();
  }, [router]);

  async function addDeadline(e) {
    e.preventDefault();

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      console.error(userError ?? 'No logged-in user');
      return;
    }

    const { data, error } = await supabase
      .from('deadlines')
      .insert({
        user_id: user.id,
        subject,
        task_name: taskName,
        due_date: dueDate,
      })
      .select('id, subject, task_name, due_date')
      .single();

    if (error) {
      console.error(error);
      return;
    }

    setDeadlines((prev) => [
      ...prev,
      {
        id: data.id,
        subject: data.subject,
        taskName: data.task_name,
        dueDate: data.due_date,
      },
    ]);
    setSubject('');
    setTaskName('');
    setDueDate('');
  }

  async function markDeadlineDone(id) {
    const { error } = await supabase.from('deadlines').delete().eq('id', id);

    if (error) {
      console.error(error);
      return;
    }

    setDeadlines((prev) => prev.filter((deadline) => deadline.id !== id));
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push('/login');
  }

  const sortedDeadlines = [...deadlines].sort((a, b) =>
    compareAsc(parseISO(a.dueDate), parseISO(b.dueDate))
  );

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <h1 className="text-3xl font-bold text-slate-900">My Deadlines</h1>

      <section className="mt-8 border border-slate-200 rounded-lg p-6 bg-white">
        <h2 className="text-lg font-semibold text-slate-900">Add Deadline</h2>
        <DeadlineForm
          subject={subject}
          taskName={taskName}
          dueDate={dueDate}
          onSubjectChange={setSubject}
          onTaskNameChange={setTaskName}
          onDueDateChange={setDueDate}
          onSubmit={addDeadline}
        />
      </section>

      <section className="mt-6 border border-slate-200 rounded-lg p-6 bg-white">
        <h2 className="text-lg font-semibold text-slate-900">Upcoming</h2>
        {loading ? (
          <p className="mt-4 text-sm text-slate-600">Loading...</p>
        ) : (
          <DeadlineList deadlines={sortedDeadlines} onMarkDone={markDeadlineDone} />
        )}
      </section>

      <button
        type="button"
        onClick={handleLogout}
        className="mt-8 py-2 px-4 border border-slate-300 rounded-md text-sm font-medium text-slate-700 bg-white"
      >
        Logout
      </button>
    </div>
  );
}
