// // components/RequestBookModal.js
// import React, { useState, useEffect } from "react";
// import { X, AlertCircle, BookOpen } from "lucide-react";

// const RequestBookModal = ({ book, isOpen, onClose, onSubmit }) => {
//   const [notes, setNotes] = useState("");
//   const [condition, setCondition] = useState("new");
//   const [edition, setEdition] = useState("");
//   const [isManual, setIsManual] = useState(false);

//   useEffect(() => {
//     if (book) {
//       setIsManual(!book.isbn13 && !book.isbn10);
//     }
//   }, [book]);

//   // Guard clause - return null early if modal is not open or book is null
//   if (!isOpen || !book) return null;

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     const requestData = {
//       bookData: {
//         title: book.title,
//         author: book.authors?.join(", ") || "",
//         isbn: book.isbn13 || book.isbn10 || "",
//         image: book.image,
//       },
//       details: {
//         condition,
//         edition: edition.trim() || undefined,
//         notes: notes.trim() || undefined,
//       },
//     };

//     onSubmit(requestData);
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//       <div className="bg-white rounded-lg max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-xl font-bold">Request "{book.title}"</h2>
//           <button
//             onClick={onClose}
//             className="text-gray-400 hover:text-gray-600"
//           >
//             <X className="h-6 w-6" />
//           </button>
//         </div>

//         {/* Book Info */}
//         <div className="flex mb-4">
//           {book.image ? (
//             <img
//               src={book.image}
//               alt={book.title}
//               className="h-24 w-16 object-cover mr-4"
//             />
//           ) : (
//             <div className="h-24 w-16 bg-gray-200 flex items-center justify-center mr-4">
//               <BookOpen className="h-8 w-8 text-gray-400" />
//             </div>
//           )}
//           <div>
//             <p className="font-semibold">{book.title}</p>
//             <p className="text-sm text-gray-600">
//               by {book.authors?.join(", ") || "Unknown Author"}
//             </p>
//             {book.isbn13 || book.isbn10 ? (
//               <p className="text-xs text-gray-500">
//                 ISBN: {book.isbn13 || book.isbn10}
//               </p>
//             ) : (
//               <p className="text-xs text-yellow-600 flex items-center">
//                 <AlertCircle className="h-3 w-3 mr-1" />
//                 Manual request - please verify details
//               </p>
//             )}
//           </div>
//         </div>

//         <form onSubmit={handleSubmit}>
//           {/* Edition Input */}
//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Edition (Optional)
//             </label>
//             <input
//               type="text"
//               value={edition}
//               onChange={(e) => setEdition(e.target.value)}
//               className="w-full border border-gray-300 rounded-md p-2"
//               placeholder="e.g., First Edition, Revised Edition"
//             />
//           </div>

//           {/* Condition Select */}
//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Preferred Condition
//             </label>
//             <select
//               value={condition}
//               onChange={(e) => setCondition(e.target.value)}
//               className="w-full border border-gray-300 rounded-md p-2"
//             >
//               <option value="new">New</option>
//               <option value="like_new">Like New</option>
//               <option value="very_good">Very Good</option>
//               <option value="good">Good</option>
//               <option value="acceptable">Acceptable</option>
//               <option value="any">Any Condition</option>
//             </select>
//           </div>

//           {/* Additional Notes */}
//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Additional Notes (Optional)
//             </label>
//             <textarea
//               value={notes}
//               onChange={(e) => setNotes(e.target.value)}
//               className="w-full border border-gray-300 rounded-md p-2"
//               rows={3}
//               placeholder="Any specific requirements, preferences, or details about this request..."
//             />
//           </div>

//           <div className="flex justify-end space-x-3">
//             <button
//               type="button"
//               onClick={onClose}
//               className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
//             >
//               Confirm Request
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default RequestBookModal;
