import React from "react";
import { useAuth } from "../../context/authContext";

export default function Profile() {
  const { user } = useAuth();

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Your Profile</h1>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center mb-6">
          <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center text-4xl font-bold text-white">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="ml-6">
            <h2 className="text-2xl font-semibold">{user?.name}</h2>
            <p className="text-gray-600">{user?.email}</p>
            <span className="inline-block mt-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              {user?.role}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium mb-3">Account Information</h3>
            <div className="space-y-2">
              <p>
                <span className="font-medium">Member since:</span>{" "}
                {new Date(user?.createdAt).toLocaleDateString()}
              </p>
              <p>
                <span className="font-medium">User ID:</span> {user?.id}
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-3">Profile Settings</h3>
            <button className="bg-primary text-white px-4 py-2 rounded-md mr-3">
              Edit Profile
            </button>
            <button className="border border-primary text-primary px-4 py-2 rounded-md">
              Change Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
