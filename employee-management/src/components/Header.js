export default function Header() {
  return (
    <div className="flex justify-end items-center bg-white shadow px-6 py-3">
      <button className="mr-6 text-gray-600 hover:text-blue-600 transition">
        🔔
      </button>
      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center cursor-pointer hover:shadow-md transition">
        👤
      </div>
    </div>
  );
}
