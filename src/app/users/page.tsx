import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { TopUsers } from "@/components/Users";
import { NewUserButton } from "@/components/Users/NewUserButton";
import { TopUsersSkeleton } from "@/components/Users/skeleton";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Users Page",
  // other metadata
};

const UsersPage = () => {
  return (
    <>
      <Breadcrumb pageName="Users" />

      <NewUserButton />

      <div className="space-y-10">
        <Suspense fallback={<TopUsersSkeleton />}>
          <TopUsers />
        </Suspense>
      </div>
    </>
  );
};

export default UsersPage;
