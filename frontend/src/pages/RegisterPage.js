import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';

function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [message, setMessage] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    const result = await register(name, email, password, role);
    if (result.success) {
      navigate('/');
    } else {
      setMessage(result.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-120px)] p-5">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center"
      >
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Register</h2>
        {message && <p className="text-red-600 mb-4 font-semibold">{message}</p>}
        <div className="mb-5 text-left">
          <label htmlFor="name" className="block mb-2 font-bold text-gray-700">Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />
        </div>
        <div className="mb-5 text-left">
          <label htmlFor="email" className="block mb-2 font-bold text-gray-700">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />
        </div>
        <div className="mb-5 text-left">
          <label htmlFor="password" className="block mb-2 font-bold text-gray-700">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />
        </div>
        <div className="mb-6 text-left">
          <label htmlFor="role" className="block mb-2 font-bold text-gray-700">Register as:</label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          >
            <option value="user">User (Book properties)</option>
            <option value="host">Host (List properties)</option>
          </select>
        </div>
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded w-full text-lg font-semibold transition"
        >
          Register
        </button>
      </form>
    </div>
  );
}

export default RegisterPage;
