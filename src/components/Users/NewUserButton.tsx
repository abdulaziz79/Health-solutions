"use client";

import { useRouter } from "next/navigation";

export const NewUserButton = () => {
  const router = useRouter();

  return (
    <button
      type="button"
      className="rounded-md bg-blue-600 mb-2 px-4 py-2 text-white hover:bg-blue-700"
      onClick={() => router.push("/users/addEditUser")}
    >
      + New User
    </button>
  );
};
