// import React, { useState, useEffect, useCallback } from "react";
// import {
//   Search,
//   BookOpen,
//   Plus,
//   Loader,
//   AlertCircle,
//   Filter,
//   X,
//   Sliders,
//   Grid,
//   List,
// } from "lucide-react";
// import { useAuth } from "../context/authContext";
// import {
//   searchBooks,
//   searchBooksWithFilters,
//   cancelPendingRequests,
// } from "../services/isbnapi.js";

// import { useNavigate } from "react-router-dom";
// import RequestBookModal from "../pages/RequestBookModal.jsx";

// const BookBrowser = () => {
//   const { currentUser } = useAuth();
//   const [books, setBooks] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [selectedBook, setSelectedBook] = useState(null);
//   const [showRequestModal, setShowRequestModal] = useState(false);
//   const [filters, setFilters] = useState({
//     sortBy: "relevance",
//     subject: "",
//     author: "",
//   });
//   const [showFilters, setShowFilters] = useState(false);
//   const [page, setPage] = useState(1);
//   const [hasMore, setHasMore] = useState(false);
//   const [searchHistory, setSearchHistory] = useState([]);
//   const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'list'

//   // Load search history from localStorage
//   useEffect(() => {
//     const savedHistory = localStorage.getItem("bookSearchHistory");
//     if (savedHistory) {
//       setSearchHistory(JSON.parse(savedHistory));
//     }
//   }, []);

//   // Save search history to localStorage
//   const saveToSearchHistory = useCallback(
//     (query) => {
//       const updatedHistory = [
//         query,
//         ...searchHistory.filter((item) => item !== query).slice(0, 4),
//       ];
//       setSearchHistory(updatedHistory);
//       localStorage.setItem("bookSearchHistory", JSON.stringify(updatedHistory));
//     },
//     [searchHistory]
//   );

//   // Debounced search function
//   const debouncedSearch = useCallback(
//     debounce(async (query, pageNum = 1, filters = {}) => {
//       if (!query.trim()) {
//         setBooks([]);
//         setIsLoading(false);
//         return;
//       }

//       setIsLoading(true);
//       setError(null);

//       try {
//         let data;

//         if (Object.keys(filters).length > 0) {
//           data = await searchBooksWithFilters(query, filters, pageNum);
//         } else {
//           data = await searchBooks(query, pageNum);
//         }

//         if (pageNum === 1) {
//           setBooks(data.books || []);
//         } else {
//           setBooks((prev) => [...prev, ...(data.books || [])]);
//         }

//         setHasMore(data.books && data.books.length >= 10);
//         saveToSearchHistory(query);
//       } catch (err) {
//         setError(err.message);
//         console.error("Search error:", err);
//       } finally {
//         setIsLoading(false);
//       }
//     }, 500),
//     [saveToSearchHistory]
//   );

//   // Handle search input change
//   useEffect(() => {
//     setPage(1);
//     debouncedSearch(searchTerm, 1, filters);
//   }, [searchTerm, debouncedSearch]);

//   // Handle filter changes
//   useEffect(() => {
//     if (searchTerm) {
//       setPage(1);
//       debouncedSearch(searchTerm, 1, filters);
//     }
//   }, [filters, debouncedSearch, searchTerm]);

//   // Clean up on unmount
//   useEffect(() => {
//     return () => {
//       cancelPendingRequests();
//     };
//   }, []);

//   // Load more results
//   const loadMore = () => {
//     const nextPage = page + 1;
//     setPage(nextPage);
//     debouncedSearch(searchTerm, nextPage, filters);
//   };

//   // Request a book
//   const requestBook = (book) => {
//     if (!currentUser) {
//       setError("Please log in to request books");
//       return;
//     }
//     setSelectedBook(book);
//     setShowRequestModal(true);
//   };

//   // Handle book request submission
//   const handleRequestSubmit = async (requestData) => {
//     try {
//       // Your existing request API call
//       setShowRequestModal(false);
//       setSelectedBook(null);
//       setError(null);
//       // Show success notification
//     } catch (err) {
//       setError("Failed to create request. Please try again.");
//     }
//   };

//   // Clear search
//   const clearSearch = () => {
//     setSearchTerm("");
//     setBooks([]);
//     setError(null);
//     setFilters({
//       sortBy: "relevance",
//       subject: "",
//       author: "",
//     });
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       <div className="max-w-7xl mx-auto">
//         <div className="text-center mb-8">
//           <h1 className="text-3xl font-bold text-gray-900 mb-2">
//             Browse Books
//           </h1>
//           <p className="text-gray-600">
//             Discover millions of books from our database
//           </p>
//         </div>

//         {/* Search Form */}
//         <div className="mb-8">
//           <div className="relative max-w-2xl mx-auto">
//             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//               <Search className="h-5 w-5 text-gray-400" />
//             </div>
//             <input
//               type="text"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="block w-full pl-10 pr-24 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//               placeholder="Search by title, author, or ISBN..."
//               list="searchHistory"
//             />

//             {/* Search history dropdown */}
//             <datalist id="searchHistory">
//               {searchHistory.map((item, index) => (
//                 <option key={index} value={item} />
//               ))}
//             </datalist>

//             {searchTerm && (
//               <button
//                 type="button"
//                 onClick={clearSearch}
//                 className="absolute right-20 bottom-2.5 p-1 text-gray-400 hover:text-gray-600"
//               >
//                 <X className="h-5 w-5" />
//               </button>
//             )}

//             <button
//               type="button"
//               onClick={() => setShowFilters(!showFilters)}
//               className="absolute right-12 bottom-2.5 p-1 text-gray-400 hover:text-gray-600"
//               title="Filters"
//             >
//               <Sliders className="h-5 w-5" />
//             </button>
//           </div>

//           {/* View Mode Toggle */}
//           <div className="flex justify-center mt-4">
//             <div className="bg-white rounded-lg p-1 shadow-sm">
//               <button
//                 onClick={() => setViewMode("grid")}
//                 className={`p-2 rounded-md ${
//                   viewMode === "grid"
//                     ? "bg-blue-100 text-blue-600"
//                     : "text-gray-500"
//                 }`}
//               >
//                 <Grid className="h-4 w-4" />
//               </button>
//               <button
//                 onClick={() => setViewMode("list")}
//                 className={`p-2 rounded-md ${
//                   viewMode === "list"
//                     ? "bg-blue-100 text-blue-600"
//                     : "text-gray-500"
//                 }`}
//               >
//                 <List className="h-4 w-4" />
//               </button>
//             </div>
//           </div>

//           {/* Filters */}
//           {showFilters && (
//             <div className="max-w-2xl mx-auto mt-4 bg-white p-4 rounded-lg shadow-md">
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Sort By
//                   </label>
//                   <select
//                     value={filters.sortBy}
//                     onChange={(e) =>
//                       setFilters({ ...filters, sortBy: e.target.value })
//                     }
//                     className="w-full border border-gray-300 rounded-md p-2"
//                   >
//                     <option value="relevance">Relevance</option>
//                     <option value="newest">Newest</option>
//                     <option value="popularity">Popularity</option>
//                     <option value="title">Title</option>
//                   </select>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Subject
//                   </label>
//                   <input
//                     type="text"
//                     value={filters.subject}
//                     onChange={(e) =>
//                       setFilters({ ...filters, subject: e.target.value })
//                     }
//                     className="w-full border border-gray-300 rounded-md p-2"
//                     placeholder="e.g., fiction, science"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Author
//                   </label>
//                   <input
//                     type="text"
//                     value={filters.author}
//                     onChange={(e) =>
//                       setFilters({ ...filters, author: e.target.value })
//                     }
//                     className="w-full border border-gray-300 rounded-md p-2"
//                     placeholder="Author name"
//                   />
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Error Messages */}
//         {error && (
//           <div className="max-w-2xl mx-auto mb-6">
//             <div
//               className={`p-4 rounded-lg flex items-start ${
//                 error.includes("Please log in")
//                   ? "bg-yellow-50 border border-yellow-200 text-yellow-800"
//                   : "bg-red-50 border border-red-200 text-red-800"
//               }`}
//             >
//               <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
//               <p>{error}</p>
//             </div>
//           </div>
//         )}

//         {/* Loading State */}
//         {isLoading && (
//           <div className="flex justify-center items-center py-12">
//             <Loader className="h-8 w-8 animate-spin text-blue-600" />
//             <span className="ml-2 text-gray-600">Searching books...</span>
//           </div>
//         )}

//         {/* Books Display */}
//         {books.length > 0 ? (
//           <>
//             <div
//               className={`${
//                 viewMode === "grid"
//                   ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
//                   : "space-y-4"
//               } mb-8`}
//             >
//               {books.map((book) => (
//                 <BookCard
//                   key={book.isbn13 || book.isbn10 || book.title}
//                   book={book}
//                   onRequest={requestBook}
//                   viewMode={viewMode}
//                 />
//               ))}
//             </div>

//             {/* Load More Button */}
//             {hasMore && (
//               <div className="text-center mb-8">
//                 <button
//                   onClick={loadMore}
//                   disabled={isLoading}
//                   className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-2 px-6 rounded-md inline-flex items-center transition-colors"
//                 >
//                   {isLoading ? (
//                     <>
//                       <Loader className="h-4 w-4 animate-spin mr-2" />
//                       Loading...
//                     </>
//                   ) : (
//                     "Load More Books"
//                   )}
//                 </button>
//               </div>
//             )}
//           </>
//         ) : (
//           !isLoading &&
//           searchTerm && (
//             <div className="text-center py-12 bg-white rounded-lg shadow-sm">
//               <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
//               <h3 className="text-lg font-medium text-gray-900 mb-2">
//                 No books found
//               </h3>
//               <p className="text-gray-600">
//                 Try different search terms or check your spelling.
//               </p>
//             </div>
//           )
//         )}

//         {/* Empty State */}
//         {!searchTerm && !isLoading && (
//           <div className="text-center py-12 bg-white rounded-lg shadow-sm">
//             <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
//             <h3 className="text-lg font-medium text-gray-900 mb-2">
//               Find Your Next Read
//             </h3>
//             <p className="text-gray-600">
//               Search for books by title, author, or ISBN to get started.
//             </p>

//             {/* Search History */}
//             {searchHistory.length > 0 && (
//               <div className="mt-6">
//                 <h4 className="text-sm font-medium text-gray-700 mb-2">
//                   Recent Searches
//                 </h4>
//                 <div className="flex flex-wrap justify-center gap-2">
//                   {searchHistory.map((term, index) => (
//                     <button
//                       key={index}
//                       onClick={() => setSearchTerm(term)}
//                       className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
//                     >
//                       {term}
//                     </button>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>
//         )}
//       </div>

//       {/* Request Book Modal */}
//       <RequestBookModal
//         book={selectedBook}
//         isOpen={showRequestModal}
//         onClose={() => setShowRequestModal(false)}
//         onSubmit={handleRequestSubmit}
//       />
//     </div>
//   );
// };

// // Book Card Component
// const BookCard = ({ book, onRequest, viewMode }) => {
//   if (viewMode === "list") {
//     return (
//       <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow flex">
//         <div className="h-32 w-24 bg-gray-200 flex items-center justify-center flex-shrink-0 mr-4">
//           {book.image ? (
//             <img
//               src={book.image}
//               alt={book.title}
//               className="h-full w-full object-cover"
//               onError={(e) => {
//                 e.target.style.display = "none";
//                 e.target.nextSibling.style.display = "flex";
//               }}
//             />
//           ) : null}
//           <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100">
//             <BookOpen className="h-8 w-8 text-gray-400" />
//           </div>
//         </div>
//         <div className="flex-grow">
//           <h3 className="font-semibold text-lg mb-1">{book.title}</h3>
//           <p className="text-gray-600 text-sm mb-2">
//             by {book.authors?.join(", ") || "Unknown Author"}
//           </p>
//           {book.isbn13 || book.isbn10 ? (
//             <p className="text-gray-500 text-xs mb-3">
//               ISBN: {book.isbn13 || book.isbn10}
//             </p>
//           ) : null}
//           <button
//             onClick={() => onRequest(book)}
//             className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md flex items-center transition-colors"
//           >
//             <Plus className="h-4 w-4 mr-1" />
//             Request This Book
//           </button>
//         </div>
//       </div>
//     );
//   }

//   // Grid view (default)
//   return (
//     <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col">
//       <div className="h-48 bg-gray-200 flex items-center justify-center">
//         {book.image ? (
//           <img
//             src={book.image}
//             alt={book.title}
//             className="h-full w-full object-cover"
//             onError={(e) => {
//               e.target.style.display = "none";
//               e.target.nextSibling.style.display = "flex";
//             }}
//           />
//         ) : null}
//         <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100">
//           <BookOpen className="h-12 w-12 text-gray-400" />
//         </div>
//       </div>
//       <div className="p-4 flex-grow flex flex-col">
//         <h3 className="font-semibold text-lg mb-1 line-clamp-2">
//           {book.title}
//         </h3>
//         <p className="text-gray-600 text-sm mb-2">
//           by {book.authors?.join(", ") || "Unknown Author"}
//         </p>

//         <div className="mt-auto pt-2">
//           {book.isbn13 || book.isbn10 ? (
//             <p className="text-gray-500 text-xs mb-3">
//               ISBN: {book.isbn13 || book.isbn10}
//             </p>
//           ) : null}

//           <button
//             onClick={() => onRequest(book)}
//             className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md flex items-center justify-center transition-colors"
//           >
//             <Plus className="h-4 w-4 mr-1" />
//             Request This Book
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Debounce utility function
// function debounce(func, wait) {
//   let timeout;
//   return function executedFunction(...args) {
//     const later = () => {
//       clearTimeout(timeout);
//       func(...args);
//     };
//     clearTimeout(timeout);
//     timeout = setTimeout(later, wait);
//   };
// }

// export default BookBrowser;
