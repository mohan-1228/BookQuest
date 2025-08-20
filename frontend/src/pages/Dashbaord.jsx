import React, { useState, useEffect } from "react";
import { useAuth } from "../context/authContext";
import { quotesAPI } from "../services/api";
import {
  BookOpen,
  Search,
  Bookmark,
  TrendingUp,
  Clock,
  Users,
  Bell,
} from "lucide-react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [recentBooks, setRecentBooks] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  const [myQuotes, setMyQuotes] = useState([]);
  const [stats, setStats] = useState({
    booksRead: 0,
    readingStreak: 0,
    hoursRead: 0,
    favoriteGenre: "None",
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user-specific data
        const [booksResponse, requestsResponse, quotesResponse] =
          await Promise.all([
            booksAPI.getAll(),
            requestsAPI.getMyRequests(),
            quotesAPI.getMyQuotes(),
          ]);

        setRecentBooks(booksResponse.data.slice(0, 3));
        setMyRequests(requestsResponse.data);
        setMyQuotes(quotesResponse.data);

        // Set mock stats (replace with actual API calls)
        setStats({
          booksRead: 12,
          readingStreak: 7,
          hoursRead: 42,
          favoriteGenre: "Mystery",
        });
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#0B2E33]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-full hover:bg-gray-100 relative">
              <Bell className="h-6 w-6 text-gray-600" />
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
            </button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#B8E3E9] to-[#93B1B5] flex items-center justify-center">
                <span className="text-[#0B2E33] font-semibold">
                  {currentUser?.name?.charAt(0) ||
                    currentUser?.email?.charAt(0) ||
                    "U"}
                </span>
              </div>
              <span className="text-gray-700">
                {currentUser?.name || currentUser?.email}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-[#0B2E33] to-[#93B1B5] rounded-2xl p-6 text-white mb-8 shadow-lg">
          <h2 className="text-2xl font-bold mb-2">
            Welcome back, {currentUser?.name || "Reader"}!
          </h2>
          <p className="mb-4 opacity-90">
            Continue your reading journey or discover new books.
          </p>
          <Link
            to="/browse"
            className="inline-block bg-white text-[#0B2E33] hover:bg-blue-50 font-medium py-2 px-4 rounded-lg transition-all duration-300"
          >
            Browse Books
          </Link>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-blue-100 text-blue-600 mr-4">
                <BookOpen className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-black">Books Read</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.booksRead}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-green-100 text-green-600 mr-4">
                <TrendingUp className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-black">Reading Streak</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.readingStreak} days
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-amber-100 text-amber-600 mr-4">
                <Clock className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm  text-black">Hours Read</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.hoursRead}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-pink-100 text-pink-600 mr-4">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-black">Favorite Genre</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.favoriteGenre}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Content Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Books */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-black">
              <BookOpen className="h-5 w-5" />
              Recently Added Books
            </h3>
            <div className="space-y-4">
              {recentBooks.length > 0 ? (
                recentBooks.map((book) => (
                  <div
                    key={book.id}
                    className="flex items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-16 h-24 bg-gray-200 rounded-lg flex-shrink-0 mr-4"></div>
                    <div className="flex-grow">
                      <h4 className="font-medium">{book.title}</h4>
                      <p className="text-sm text-gray-500">{book.author}</p>
                    </div>
                    <Link
                      to={`/book/${book.id}`}
                      className="text-[#0B2E33] hover:text-[#1A4D53]"
                    >
                      View
                    </Link>
                  </div>
                ))
              ) : (
                <p className="text-gray-900 text-center py-8">No books found</p>
              )}
            </div>
          </div>

          {/* My Requests */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-black">
              <Search className="h-5 w-5" />
              My Recent Requests
            </h3>
            <div className="space-y-4">
              {myRequests.length > 0 ? (
                myRequests.slice(0, 3).map((request) => (
                  <div
                    key={request.id}
                    className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <h4 className="font-medium">{request.title}</h4>
                    <p className="text-sm text-gray-500">
                      Status: {request.status}
                    </p>
                    <div className="mt-2 text-xs text-gray-500">
                      Created:{" "}
                      {new Date(request.created_at).toLocaleDateString()}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-900 text-center py-8">
                  No requests yet
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
