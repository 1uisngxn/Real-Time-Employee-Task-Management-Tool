import { useState } from "react";
import { FiSearch } from "react-icons/fi";

export default function EmployeeSearchFilter({ onSearch, role, status, onRoleChange, onStatusChange }) {
  const [searchText, setSearchText] = useState("");

  const handleSearch = () => {
    onSearch(searchText);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div className="flex flex-wrap gap-4 items-center mb-6">
      {/* Search Input */}
      <div className="relative flex-1 min-w-[220px]">
        <input
          type="text"
          placeholder="Search by name or email"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onKeyDown={handleKeyDown}
          className="border p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400 pr-10"
        />
        <FiSearch
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
          onClick={handleSearch}
        />
      </div>

      {/* Role Filter */}
      <select
        value={role}
        onChange={(e) => onRoleChange(e.target.value)}
        className="border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        <option value="All">All Roles</option>
        <option value="Manager">Manager</option>
        <option value="Staff">Employee</option>
      </select>

      {/* Status Filter */}
      <select
        value={status}
        onChange={(e) => onStatusChange(e.target.value)}
        className="border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        <option value="All">All Status</option>
        <option value="Active">Active</option>
        <option value="Inactive">Inactive</option>
      </select>
    </div>
  );
}
