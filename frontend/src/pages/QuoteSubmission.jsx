// pages/SubmitQuote.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { requestsAPI, quotesAPI } from "../services/api";
import {
  ArrowLeft,
  DollarSign,
  Save,
  Loader,
  AlertCircle,
  Calculator,
} from "lucide-react";

const SubmitQuote = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    books: [],
    notes: "",
    estimatedDelivery: "",
  });

  useEffect(() => {
    fetchRequest();
  }, [id]);

  const fetchRequest = async () => {
    try {
      setLoading(true);
      //   console.log("Fetching request with ID:", id);

      const response = await requestsAPI.getById(id);
      //   console.log("API Response:", response);

      if (response.data && response.data.success) {
        const requestData = response.data.data.request;
        // console.log("Request data received:", requestData);

        setRequest(requestData);

        // Initialize form data with books from the request
        const initialBooks = requestData.books.map((book) => ({
          bookId: book._id,
          title: book.title,
          author: book.author,
          isbn: book.isbn,
          quantity: book.quantity,
          condition: book.condition,
          unitPrice: "",
          totalPrice: 0,
        }));

        setFormData((prev) => ({
          ...prev,
          books: initialBooks,
        }));
      } else {
        throw new Error(response.data?.message || "Invalid response format");
      }
    } catch (err) {
      console.error("Error fetching request details:", err);
      console.error("Error response:", err.response?.data);
      setError(
        err.response?.data?.message || "Failed to fetch request details"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleUnitPriceChange = (index, unitPrice) => {
    const newBooks = [...formData.books];
    const unitPriceNum = parseFloat(unitPrice) || 0;

    newBooks[index] = {
      ...newBooks[index],
      unitPrice: unitPrice,
      totalPrice: unitPriceNum * newBooks[index].quantity,
    };

    setFormData((prev) => ({
      ...prev,
      books: newBooks,
    }));
  };

  const calculateTotalPrice = () => {
    return formData.books.reduce(
      (total, book) => total + (book.totalPrice || 0),
      0
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      // Validate all books have unit prices
      const hasEmptyPrices = formData.books.some(
        (book) => !book.unitPrice || parseFloat(book.unitPrice) <= 0
      );
      if (hasEmptyPrices) {
        throw new Error("Please enter valid unit prices for all books");
      }

      const totalPrice = calculateTotalPrice();
      if (totalPrice <= 0) {
        throw new Error("Total price must be greater than 0");
      }

      await quotesAPI.createQuotes(id, {
        books: formData.books.map((book) => ({
          bookId: book.bookId,
          title: book.title, // Add this
          author: book.author, // Add this
          isbn: book.isbn, // Add this
          quantity: book.quantity, // Add this
          condition: book.condition, // Add this
          unitPrice: parseFloat(book.unitPrice),
          totalPrice: book.totalPrice,
        })),
        totalPrice: totalPrice,
        notes: formData.notes,
        estimatedDelivery: formData.estimatedDelivery,
      });

      navigate("/vendor-dashboard", {
        state: { message: "Quote submitted successfully!" },
      });
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Failed to submit quote"
      );
    } finally {
      setSubmitting(false);
    }
  };
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0B2E33] to-[#14464b] flex items-center justify-center">
        <Loader className="h-8 w-8 animate-spin text-white" />
      </div>
    );
  }

  if (!request) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0B2E33] to-[#14464b] flex items-center justify-center">
        <div className="text-white text-center">
          <AlertCircle className="h-12 w-12 mx-auto mb-4" />
          <p className="text-xl mb-4">Request not found</p>
          <Link
            to="/requests"
            className="bg-[#2a7d84] text-white px-4 py-2 rounded-lg hover:bg-[#3a8d94]"
          >
            Back to Requests
          </Link>
        </div>
      </div>
    );
  }

  const totalPrice = calculateTotalPrice();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B2E33] to-[#14464b] py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Link
            to={`/requests/${id}`}
            className="flex items-center text-white hover:text-[#B8E3E9] mr-4"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Request
          </Link>
          <h1 className="text-2xl font-bold text-white flex items-center">
            <DollarSign className="h-6 w-6 mr-2" />
            Submit Quote
          </h1>
        </div>

        {/* Request Summary */}
        <div className="bg-white rounded-xl p-6 mb-6 text-black">
          <h2 className="text-lg font-semibold mb-4 text-black">
            Request Summary
          </h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-black">Request ID:</span>{" "}
              {request._id}
            </div>
            <div>
              <span className="font-medium text-black">Status:</span>
              <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                {request.status}
              </span>
            </div>
            <div>
              <span className="font-medium text-black">Total Books:</span>{" "}
              {request.books?.length}
            </div>
            <div>
              <span className="font-medium text-black">Requested by:</span>{" "}
              {request.userId?.name}
            </div>
          </div>
        </div>

        {/* Quote Form */}
        <div className="bg-white rounded-xl p-6 text-black">
          <h2 className="text-lg font-semibold mb-4 flex items-center text-black">
            <Calculator className="h-5 w-5 mr-2 text-black" />
            Book Pricing
          </h2>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Books Pricing Table */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b">
                      Book Details
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b">
                      Quantity
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b">
                      Condition
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b">
                      Unit Price ($)
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b">
                      Total ($)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {formData.books.map((book, index) => (
                    <tr key={book.bookId} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div>
                          <div className="font-medium text-gray-900">
                            {book.title}
                          </div>
                          <div className="text-sm text-gray-600">
                            by {book.author}
                          </div>
                          {book.isbn && (
                            <div className="text-xs text-gray-500">
                              ISBN: {book.isbn}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm">{book.quantity}</td>
                      <td className="px-4 py-3 text-sm capitalize">
                        {book.condition}
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={book.unitPrice}
                          onChange={(e) =>
                            handleUnitPriceChange(index, e.target.value)
                          }
                          className="w-24 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#0B2E33] focus:border-[#0B2E33]"
                          placeholder="0.00"
                          required
                        />
                      </td>
                      <td className="px-4 py-3 font-medium">
                        ${book.totalPrice.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-gray-50">
                    <td
                      colSpan="4"
                      className="px-4 py-3 text-right font-medium"
                    >
                      Grand Total:
                    </td>
                    <td className="px-4 py-3 font-bold text-lg text-[#0B2E33]">
                      ${totalPrice.toFixed(2)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Additional Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estimated Delivery Date
                </label>
                <input
                  type="date"
                  value={formData.estimatedDelivery}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      estimatedDelivery: e.target.value,
                    })
                  }
                  className="w-full p-3 rounded-lg bg-white border border-gray-300 focus:ring-2 focus:ring-[#0B2E33] focus:border-[#0B2E33] text-gray-900 appearance-none" // Changed to white bg
                  min={new Date().toISOString().split("T")[0]}
                />
                {/* Custom calendar icon */}
                <div className="absolute right-3 top-9 pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-900"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  rows="3"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B2E33] focus:border-[#0B2E33]"
                  placeholder="Add any additional notes about your quote..."
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4 pt-6 border-t">
              <Link
                to={`/requests/${id}`}
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={submitting || totalPrice <= 0}
                className="px-8 py-3 bg-[#0B2E33] text-white rounded-lg hover:bg-[#0a2529] disabled:opacity-50 disabled:cursor-not-allowed flex items-center font-medium"
              >
                {submitting ? (
                  <>
                    <Loader className="h-4 w-4 animate-spin mr-2" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Submit Quote (${totalPrice.toFixed(2)})
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SubmitQuote;

// pages/SubmitQuote.jsx
// import React, { useState, useEffect, useRef } from "react";
// import { useParams, useNavigate, Link } from "react-router-dom";
// import { requestsAPI, quotesAPI } from "../services/api";
// import {
//   ArrowLeft,
//   DollarSign,
//   Save,
//   Loader,
//   AlertCircle,
//   Calculator,
//   Download,
//   User,
//   Building,
//   Mail,
//   Phone,
//   MapPin,
// } from "lucide-react";
// import html2canvas from "html2canvas";
// import jsPDF from "jspdf";

// const SubmitQuote = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const pdfRef = useRef();
//   const [request, setRequest] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [submitting, setSubmitting] = useState(false);
//   const [error, setError] = useState("");
//   const [formData, setFormData] = useState({
//     vendorDetails: {
//       contactPerson: "",
//       businessName: "",
//       email: "",
//       phone: "",
//       address: "",
//       taxId: "",
//       paymentTerms: "Net 30",
//     },
//     books: [],
//     notes: "",
//     estimatedDelivery: "",
//     quoteValidUntil: "",
//   });

//   useEffect(() => {
//     fetchRequest();
//   }, [id]);

//   const fetchRequest = async () => {
//     try {
//       setLoading(true);
//       const response = await requestsAPI.getById(id);

//       if (response.data && response.data.success) {
//         const requestData = response.data.data.request;
//         setRequest(requestData);

//         const initialBooks = requestData.books.map((book) => ({
//           bookId: book._id,
//           title: book.title,
//           author: book.author,
//           isbn: book.isbn,
//           quantity: book.quantity,
//           condition: book.condition,
//           unitPrice: "",
//           totalPrice: 0,
//         }));

//         setFormData((prev) => ({
//           ...prev,
//           books: initialBooks,
//         }));
//       } else {
//         throw new Error(response.data?.message || "Invalid response format");
//       }
//     } catch (err) {
//       console.error("Error fetching request details:", err);
//       setError("Failed to fetch request details");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleVendorDetailChange = (field, value) => {
//     setFormData((prev) => ({
//       ...prev,
//       vendorDetails: {
//         ...prev.vendorDetails,
//         [field]: value,
//       },
//     }));
//   };

//   const handleUnitPriceChange = (index, unitPrice) => {
//     const newBooks = [...formData.books];
//     const unitPriceNum = parseFloat(unitPrice) || 0;

//     newBooks[index] = {
//       ...newBooks[index],
//       unitPrice: unitPrice,
//       totalPrice: unitPriceNum * newBooks[index].quantity,
//     };

//     setFormData((prev) => ({
//       ...prev,
//       books: newBooks,
//     }));
//   };

//   const calculateTotalPrice = () => {
//     return formData.books.reduce(
//       (total, book) => total + (book.totalPrice || 0),
//       0
//     );
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setSubmitting(true);
//     setError("");

//     try {
//       const hasEmptyPrices = formData.books.some(
//         (book) => !book.unitPrice || parseFloat(book.unitPrice) <= 0
//       );
//       if (hasEmptyPrices) {
//         throw new Error("Please enter valid unit prices for all books");
//       }

//       const totalPrice = calculateTotalPrice();
//       if (totalPrice <= 0) {
//         throw new Error("Total price must be greater than 0");
//       }

//       await quotesAPI.createQuotes(id, {
//         vendorDetails: formData.vendorDetails,
//         books: formData.books.map((book) => ({
//           bookId: book.bookId,
//           title: book.title,
//           author: book.author,
//           isbn: book.isbn,
//           quantity: book.quantity,
//           condition: book.condition,
//           unitPrice: parseFloat(book.unitPrice),
//           totalPrice: book.totalPrice,
//         })),
//         totalPrice: totalPrice,
//         notes: formData.notes,
//         estimatedDelivery: formData.estimatedDelivery,
//         quoteValidUntil: formData.quoteValidUntil,
//       });

//       navigate("/vendor-dashboard", {
//         state: { message: "Quote submitted successfully!" },
//       });
//     } catch (err) {
//       setError(
//         err.response?.data?.message || err.message || "Failed to submit quote"
//       );
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const downloadPDF = async () => {
//     const element = pdfRef.current;
//     const canvas = await html2canvas(element, { scale: 2 });
//     const imgData = canvas.toDataURL("image/png");

//     const pdf = new jsPDF("p", "mm", "a4");
//     const imgProps = pdf.getImageProperties(imgData);
//     const pdfWidth = pdf.internal.pageSize.getWidth();
//     const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

//     pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
//     pdf.save(`quote-${request._id.substring(0, 8)}.pdf`);
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-[#0B2E33] to-[#14464b] flex items-center justify-center">
//         <Loader className="h-8 w-8 animate-spin text-white" />
//       </div>
//     );
//   }

//   if (!request) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-[#0B2E33] to-[#14464b] flex items-center justify-center">
//         <div className="text-white text-center">
//           <AlertCircle className="h-12 w-12 mx-auto mb-4" />
//           <p className="text-xl mb-4">Request not found</p>
//           <Link
//             to="/requests"
//             className="bg-[#2a7d84] text-white px-4 py-2 rounded-lg hover:bg-[#3a8d94]"
//           >
//             Back to Requests
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   const totalPrice = calculateTotalPrice();

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-[#0B2E33] to-[#14464b] py-8 px-4">
//       <div className="max-w-6xl mx-auto">
//         {/* Header */}
//         <div className="flex items-center justify-between mb-6">
//           <div className="flex items-center">
//             <Link
//               to={`/requests/${id}`}
//               className="flex items-center text-white hover:text-[#B8E3E9] mr-4"
//             >
//               <ArrowLeft className="h-5 w-5 mr-2" />
//               Back to Request
//             </Link>
//             <h1 className="text-2xl font-bold text-white flex items-center">
//               <DollarSign className="h-6 w-6 mr-2" />
//               Submit Quote
//             </h1>
//           </div>
//           <button
//             onClick={downloadPDF}
//             className="flex items-center bg-white text-[#0B2E33] px-4 py-2 rounded-lg hover:bg-gray-100"
//           >
//             <Download className="h-4 w-4 mr-2" />
//             Download PDF
//           </button>
//         </div>

//         {/* PDF Template (hidden until download) */}
//         <div className="hidden">
//           <div ref={pdfRef} className="bg-white p-8">
//             <div className="border-b-2 border-gray-300 pb-4 mb-6">
//               <h1 className="text-2xl font-bold text-center">QUOTATION</h1>
//               <p className="text-center text-gray-600">
//                 Quote #{request._id.substring(0, 8)}
//               </p>
//             </div>

//             <div className="grid grid-cols-2 gap-8 mb-8">
//               <div>
//                 <h2 className="font-bold mb-2">Vendor Details</h2>
//                 <p>{formData.vendorDetails.businessName}</p>
//                 <p>{formData.vendorDetails.contactPerson}</p>
//                 <p>{formData.vendorDetails.email}</p>
//                 <p>{formData.vendorDetails.phone}</p>
//                 <p>{formData.vendorDetails.address}</p>
//               </div>

//               <div>
//                 <h2 className="font-bold mb-2">Client Details</h2>
//                 <p>{request.userId?.name}</p>
//                 <p>{request.userId?.email}</p>
//                 <p>Request #{request._id.substring(0, 8)}</p>
//               </div>
//             </div>

//             <table className="w-full border-collapse mb-6">
//               <thead>
//                 <tr className="bg-gray-100">
//                   <th className="border border-gray-300 p-2 text-left">
//                     Book Details
//                   </th>
//                   <th className="border border-gray-300 p-2">Qty</th>
//                   <th className="border border-gray-300 p-2">Unit Price</th>
//                   <th className="border border-gray-300 p-2">Total</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {formData.books.map((book, index) => (
//                   <tr key={index}>
//                     <td className="border border-gray-300 p-2">
//                       <div className="font-medium">{book.title}</div>
//                       <div className="text-sm">by {book.author}</div>
//                       {book.isbn && (
//                         <div className="text-xs">ISBN: {book.isbn}</div>
//                       )}
//                     </td>
//                     <td className="border border-gray-300 p-2 text-center">
//                       {book.quantity}
//                     </td>
//                     <td className="border border-gray-300 p-2 text-center">
//                       ${book.unitPrice}
//                     </td>
//                     <td className="border border-gray-300 p-2 text-center">
//                       ${book.totalPrice.toFixed(2)}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//               <tfoot>
//                 <tr>
//                   <td
//                     colSpan="3"
//                     className="border border-gray-300 p-2 text-right font-bold"
//                   >
//                     Total:
//                   </td>
//                   <td className="border border-gray-300 p-2 text-center font-bold">
//                     ${totalPrice.toFixed(2)}
//                   </td>
//                 </tr>
//               </tfoot>
//             </table>

//             <div className="grid grid-cols-2 gap-8">
//               <div>
//                 <h3 className="font-bold mb-2">Terms & Conditions</h3>
//                 <p>Payment Terms: {formData.vendorDetails.paymentTerms}</p>
//                 <p>Estimated Delivery: {formData.estimatedDelivery}</p>
//                 <p>Quote Valid Until: {formData.quoteValidUntil}</p>
//               </div>

//               <div>
//                 <h3 className="font-bold mb-2">Notes</h3>
//                 <p>{formData.notes || "No additional notes"}</p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Vendor Details Form */}
//         <div className="bg-white rounded-xl p-6 mb-6">
//           <h2 className="text-xl font-semibold mb-4 flex items-center">
//             <User className="h-5 w-5 mr-2" />
//             Vendor Information
//           </h2>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-medium mb-2">
//                 Contact Person *
//               </label>
//               <input
//                 type="text"
//                 value={formData.vendorDetails.contactPerson}
//                 onChange={(e) =>
//                   handleVendorDetailChange("contactPerson", e.target.value)
//                 }
//                 className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B2E33]"
//                 required
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium mb-2">
//                 Business Name *
//               </label>
//               <input
//                 type="text"
//                 value={formData.vendorDetails.businessName}
//                 onChange={(e) =>
//                   handleVendorDetailChange("businessName", e.target.value)
//                 }
//                 className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B2E33]"
//                 required
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium mb-2">Email *</label>
//               <input
//                 type="email"
//                 value={formData.vendorDetails.email}
//                 onChange={(e) =>
//                   handleVendorDetailChange("email", e.target.value)
//                 }
//                 className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B2E33]"
//                 required
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium mb-2">Phone *</label>
//               <input
//                 type="tel"
//                 value={formData.vendorDetails.phone}
//                 onChange={(e) =>
//                   handleVendorDetailChange("phone", e.target.value)
//                 }
//                 className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B2E33]"
//                 required
//               />
//             </div>

//             <div className="md:col-span-2">
//               <label className="block text-sm font-medium mb-2">
//                 Address *
//               </label>
//               <input
//                 type="text"
//                 value={formData.vendorDetails.address}
//                 onChange={(e) =>
//                   handleVendorDetailChange("address", e.target.value)
//                 }
//                 className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B2E33]"
//                 required
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium mb-2">
//                 Tax ID/VAT Number
//               </label>
//               <input
//                 type="text"
//                 value={formData.vendorDetails.taxId}
//                 onChange={(e) =>
//                   handleVendorDetailChange("taxId", e.target.value)
//                 }
//                 className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B2E33]"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium mb-2">
//                 Payment Terms
//               </label>
//               <select
//                 value={formData.vendorDetails.paymentTerms}
//                 onChange={(e) =>
//                   handleVendorDetailChange("paymentTerms", e.target.value)
//                 }
//                 className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B2E33]"
//               >
//                 <option value="Net 15">Net 15</option>
//                 <option value="Net 30">Net 30</option>
//                 <option value="Net 60">Net 60</option>
//                 <option value="Due on receipt">Due on receipt</option>
//               </select>
//             </div>
//           </div>
//         </div>

//         {/* Rest of your existing form (Book Pricing, Additional Information, etc.) */}
//         {/* ... [Keep your existing book pricing table and other sections] ... */}

//         {/* Quote Validity */}
//         <div className="bg-white rounded-xl p-6 mb-6">
//           <h2 className="text-xl font-semibold mb-4">Quote Validity</h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-medium mb-2">
//                 Quote Valid Until *
//               </label>
//               <input
//                 type="date"
//                 value={formData.quoteValidUntil}
//                 onChange={(e) =>
//                   setFormData({ ...formData, quoteValidUntil: e.target.value })
//                 }
//                 className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B2E33]"
//                 min={new Date().toISOString().split("T")[0]}
//                 required
//               />
//             </div>
//           </div>
//         </div>

//         {/* Submit Button */}
//         <div className="flex justify-end space-x-4 pt-6">
//           <Link
//             to={`/requests/${id}`}
//             className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
//           >
//             Cancel
//           </Link>
//           <button
//             type="submit"
//             disabled={submitting}
//             className="px-8 py-3 bg-[#0B2E33] text-white rounded-lg hover:bg-[#0a2529] disabled:opacity-50 flex items-center font-medium"
//           >
//             {submitting ? (
//               <>
//                 <Loader className="h-4 w-4 animate-spin mr-2" />
//                 Submitting...
//               </>
//             ) : (
//               <>
//                 <Save className="h-4 w-4 mr-2" />
//                 Submit Quote
//               </>
//             )}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SubmitQuote;
