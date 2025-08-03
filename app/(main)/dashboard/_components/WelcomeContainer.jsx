"use client";

import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import React from "react";

function WelcomeContainer() {
  const { user } = useUser();

  const displayName = user?.fullName || user?.firstName || "User";

  return (
    <div className="bg-blue-100 p-5 rounded-xl flex justify-between items-center mt-1">
      {/* Welcome text */}
      <div>
        <h2 className="text-lg font-bold">
          Welcome Back, {displayName}!
        </h2>
        <p className="text-gray-600">
          AI-Driven Interviews, Hassle-Free Hiring
        </p>
      </div>

      {/* User avatar */}
      {user?.imageUrl && (
        <div className="mt-1">
          <Image
            src={user.imageUrl}
            alt={`${displayName}'s Avatar`}
            width={40}
            height={40}
            className="rounded-full"
          />
        </div>
      )}
    </div>
  );
}

export default WelcomeContainer;
