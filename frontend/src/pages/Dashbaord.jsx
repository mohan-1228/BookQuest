// // import React, { useState, useEffect } from "react";
// // import { useAuth } from "../context/authContext";
// // import UserDashboard from "../pages/UserDashbaord";

// // const Dashboard = () => {
// //   const { user } = useAuth(); // Make sure this is 'user' not 'currentUser'
// //   const [isLoading, setIsLoading] = useState(true);

// //   useEffect(() => {
// //     const timer = setTimeout(() => {
// //       setIsLoading(false);
// //     }, 500);
// //     return () => clearTimeout(timer);
// //   }, []);

// //   if (isLoading) {
// //     return (
// //       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
// //         <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#0B2E33]"></div>
// //       </div>
// //     );
// //   }

// //   // DEBUG: Check what user data we have
// //   console.log("User data in Dashboard:", user);
// //   console.log("User role:", user?.role);

// //   // Render the appropriate dashboard based on user role
// //   return (
// //     <div className="min-h-screen bg-gray-50">
// //       {user?.role === "vendor" ? ( // Use 'role' not 'userType'
// //         <VendorDashboard />
// //       ) : (
// //         <UserDashboard />
// //       )}
// //     </div>
// //   );
// // };

// // export default Dashboard;

// import React, { useState, useEffect } from "react";
// import { useAuth } from "../context/authContext";
// import UserDashboard from "../pages/UserDashbaord";
// import VendorDashboard from "../pages/VendorDashboard";

// const Dashboard = () => {
//   const { user } = useAuth();
//   const [isLoading, setIsLoading] = useState(true);

//   // Debug: Check what's in localStorage
//   useEffect(() => {
//     const savedUser = localStorage.getItem("user");
//     const token = localStorage.getItem("userToken");
//     console.log("LocalStorage user:", savedUser);
//     console.log("LocalStorage token:", token ? "Exists" : "Missing");
//     console.log("AuthContext user:", user);
//   }, [user]);

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setIsLoading(false);
//     }, 1000);
//     return () => clearTimeout(timer);
//   }, []);

//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#0B2E33]"></div>
//       </div>
//     );
//   }

//   if (!user) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <h2 className="text-2xl font-bold text-red-600">User not found</h2>
//           <p className="text-gray-600">Please try logging in again</p>
//         </div>
//       </div>
//     );
//   }

//   console.log("Rendering dashboard for user:", user);
//   console.log("User role:", user.role);

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {user.role === "vendor" ? <VendorDashboard /> : <UserDashboard />}
//     </div>
//   );
// };

// export default Dashboard;
