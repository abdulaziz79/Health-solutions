import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

export function TopUsers({ className }: { className?: string }) {
  // Static data
  const data = [
    {
      id: 1,
      firstName: "Louai",
      lastName: "Baghdadi",
      email: "louai@example.com",
      dateOfBirth: "1995-05-10",
      role: "Admin",
      logo: "/images/user1.jpg",
      name: "Louai Baghdadi",
    },
    {
      id: 2,
      firstName: "Sarah",
      lastName: "Smith",
      email: "sarah@example.com",
      dateOfBirth: "1992-09-21",
      role: "User",
      logo: "/images/user2.jpg",
      name: "Sarah Smith",
    },
    {
      id: 3,
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      dateOfBirth: "1990-01-15",
      role: "User",
      logo: "/images/user3.jpg",
      name: "John Doe",
    },
  ];

  return (
    <div
      className={cn(
        "grid rounded-[10px] bg-white px-7.5 pb-4 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card",
        className
      )}
    >
      <h2 className="mb-4 text-body-2xlg font-bold text-dark dark:text-white">
        Top Users
      </h2>

      <Table>
        <TableHeader>
          <TableRow className="border-none uppercase [&>th]:text-center">
            <TableHead>Id</TableHead>
            <TableHead>First Name</TableHead>
            <TableHead>Last Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Date Of Birth</TableHead>
            <TableHead>Role</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.map((user, i) => (
            <TableRow
              className="text-center text-base font-medium text-dark dark:text-white"
              key={user.id}
            >
              <TableCell>{user.id}</TableCell>
              <TableCell>{user.firstName}</TableCell>
              <TableCell>{user.lastName}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.dateOfBirth}</TableCell>
              <TableCell>{user.role}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
