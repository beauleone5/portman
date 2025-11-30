'use client';

import { useState } from 'react';

interface AddCompanyFormProps {
  onAdd: (name: string, ticker: string) => Promise<void>;
}

export default function AddCompanyForm({ onAdd }: AddCompanyFormProps) {
  const [name, setName] = useState('');
  const [ticker, setTicker] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      return;
    }

    setIsLoading(true);
    try {
      await onAdd(name.trim(), ticker.trim());
      setName('');
      setTicker('');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label htmlFor="company-name" className="block text-sm font-medium text-gray-700 mb-1">
          Company name
        </label>
        <input
          id="company-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Acme Corp"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          disabled={isLoading}
        />
      </div>
      <div>
        <label htmlFor="company-ticker" className="block text-sm font-medium text-gray-700 mb-1">
          Ticker (optional)
        </label>
        <input
          id="company-ticker"
          type="text"
          value={ticker}
          onChange={(e) => setTicker(e.target.value)}
          placeholder="e.g., ACME"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          disabled={isLoading}
        />
      </div>
      <button
        type="submit"
        disabled={isLoading || !name.trim()}
        className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? 'Adding...' : 'Follow company'}
      </button>
    </form>
  );
}
