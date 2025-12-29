"use client";

import { GlobeIcon } from "@/assets/icons";
import DatePickerOne from "@/components/FormElements/DatePicker/DatePickerOne";
import InputGroup from "@/components/FormElements/InputGroup";
import { Select } from "@/components/FormElements/select";
import { useState } from "react";

type Role = { id: number; name: string };

type UserFormProps = {
  roles: Role[];
};

const UserForm: React.FC<UserFormProps> = ({ roles }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [profileImage, setProfileImage] = useState<File | null>(null);

  // New state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleDebug = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const formData = new FormData();

      // text fields
      formData.append("firstName", firstName);  
      formData.append("lastName", lastName);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("role", selectedRole);
      formData.append(
        "dateOfBirth",
        selectedDate ? selectedDate.toISOString() : ""
      );

      if (profileImage) {
        formData.append("image", profileImage);
      }

      const res = await fetch("/api/users", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();

      if (!res.ok) {
        setError(result.error || "Something went wrong");
      } else {
        setSuccess("User created successfully!");
        setFirstName("");
        setLastName("");
        setEmail("");
        setPassword("");
        setSelectedRole("");
        setSelectedDate(null);
        setProfileImage(null);
      }
    } catch (err: any) {
      setError(err.message || "Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <InputGroup
        label="First Name"
        placeholder="Enter first name"
        type="text"
        value={firstName}
        handleChange={(e) => setFirstName(e.target.value)}
        required
      />
      <InputGroup
        label="Last Name"
        placeholder="Enter last name"
        type="text"
        value={lastName}
        handleChange={(e) => setLastName(e.target.value)}
        required
      />

      <DatePickerOne
        value={selectedDate}
        onChange={setSelectedDate}
        title="Date Of Birth"
      />

      <InputGroup
        label="Email"
        placeholder="Enter email address"
        type="text"
        value={email}
        handleChange={(e) => setEmail(e.target.value)}
        required
      />

      <InputGroup
        label="Password"
        placeholder="Enter password"
        type="password"
        value={password}
        handleChange={(e) => setPassword(e.target.value)}
        required
      />

      <Select
        items={roles.map((role) => ({
          label: role.name,
          value: role.id.toString(),
        }))}
        placeholder="Select a role"
        label="Select Role"
        onValueChange={setSelectedRole}
        prefixIcon={<GlobeIcon />}
      />

      <InputGroup
        type="file"
        fileStyleVariant="style1"
        label="Attach file"
        placeholder="Attach file"
        handleChange={(e) => setProfileImage(e.target.files?.[0] || null)}
      />

      {error && <p className="text-sm text-red-500 mt-2">{error}</p>}

      {success && <p className="text-sm text-green-500 mt-2">{success}</p>}

      <button
        type="button"
        onClick={handleDebug}
        disabled={loading}
        className={`mt-6 flex justify-center rounded-lg bg-primary p-[13px] font-medium text-white hover:bg-opacity-90 ${
          loading ? "opacity-70 cursor-not-allowed" : ""
        }`}
      >
        {loading ? "Saving..." : "Save"}
      </button>
    </div>
  );
};

export default UserForm;
