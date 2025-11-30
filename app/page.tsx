'use client';

import { useEffect, useState } from 'react';
import AddCompanyForm from '@/components/AddCompanyForm';
import CompanyList from '@/components/CompanyList';
import NewsFeed from '@/components/NewsFeed';

interface Company {
  id: string;
  name: string;
  ticker: string | null;
}

interface NewsItem {
  id: string;
  companyName: string;
  title: string;
  source: string;
  url: string;
  publishedAt: string;
  description?: string;
  impactScore: number;
}

function generateUserId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export default function DashboardPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isLoadingNews, setIsLoadingNews] = useState(false);

  // Initialize user ID from localStorage or create new one
  useEffect(() => {
    const storedUserId = localStorage.getItem('boardsignal_user_id');
    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      const newUserId = generateUserId();
      localStorage.setItem('boardsignal_user_id', newUserId);
      setUserId(newUserId);
    }
  }, []);

  // Fetch companies when userId is available
  useEffect(() => {
    if (!userId) return;

    fetchCompanies();
  }, [userId]);

  // Fetch news whenever companies change
  useEffect(() => {
    if (!userId) return;

    fetchNews();
  }, [companies, userId]);

  const fetchCompanies = async () => {
    if (!userId) return;

    try {
      const response = await fetch(`/api/companies?userId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        setCompanies(data);
      }
    } catch (error) {
      console.error('Error fetching companies:', error);
    }
  };

  const fetchNews = async () => {
    if (!userId) return;

    setIsLoadingNews(true);
    try {
      const response = await fetch(`/api/news?userId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        setNews(data);
      }
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setIsLoadingNews(false);
    }
  };

  const handleAddCompany = async (name: string, ticker: string) => {
    if (!userId) return;

    try {
      const response = await fetch('/api/companies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          name,
          ticker: ticker || undefined,
        }),
      });

      if (response.ok) {
        await fetchCompanies();
      }
    } catch (error) {
      console.error('Error adding company:', error);
    }
  };

  const handleUnfollowCompany = async (companyId: string) => {
    if (!userId) return;

    try {
      const response = await fetch(`/api/companies/${companyId}?userId=${userId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchCompanies();
      }
    } catch (error) {
      console.error('Error unfollowing company:', error);
    }
  };

  if (!userId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Initializing...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">BoardSignal</h1>
          <p className="text-sm text-gray-600 mt-1">
            News signals for your portfolio companies
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar - Company Management */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Your Companies
              </h2>

              <div className="mb-6">
                <AddCompanyForm onAdd={handleAddCompany} />
              </div>

              <div className="border-t border-gray-200 pt-4">
                <h3 className="text-sm font-medium text-gray-700 mb-3">
                  Following ({companies.length})
                </h3>
                <CompanyList
                  companies={companies}
                  onUnfollow={handleUnfollowCompany}
                />
              </div>
            </div>
          </div>

          {/* Main Area - News Feed */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                News Feed
              </h2>
              <NewsFeed news={news} isLoading={isLoadingNews} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
