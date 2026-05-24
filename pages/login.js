import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabaseClient';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [mode, setMode] = useState('login'); // 'login' or 'signup'

  async function handleLogin() {
    setMessage('');
    setIsError(false);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setIsError(true);
      setMessage(error.message);
      return;
    }
    router.push('/dashboard');
  }

  async function handleSignUp() {
    setMessage('');
    setIsError(false);
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      setIsError(true);
      setMessage(error.message);
      return;
    }
    // Auto login after signup
    const { error: loginError } = await supabase.auth.signInWithPassword({ email, password });
    if (loginError) {
      setIsError(true);
      setMessage('Account created. Please log in.');
      setMode('login');
      return;
    }
    router.push('/dashboard');
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900">
          {mode === 'login' ? 'Sign in to your account' : 'Create an account'}
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-slate-200">
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Email address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-slate-900"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-slate-900"
                placeholder="••••••••"
              />
            </div>

            {message && (
              <p className={`text-sm ${isError ? 'text-red-600' : 'text-green-600'}`}>
                {message}
              </p>
            )}

            <button
              type="button"
              onClick={mode === 'login' ? handleLogin : handleSignUp}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none transition-colors"
            >
              {mode === 'login' ? 'Login' : 'Create Account'}
            </button>

            <p className="text-center text-sm text-slate-600">
              {mode === 'login' ? (
                <>
                  No account?{' '}
                  <button
                    type="button"
                    onClick={() => { setMode('signup'); setMessage(''); }}
                    className="text-indigo-600 hover:underline font-medium"
                  >
                    Sign up
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => { setMode('login'); setMessage(''); }}
                    className="text-indigo-600 hover:underline font-medium"
                  >
                    Log in
                  </button>
                </>
              )}
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
