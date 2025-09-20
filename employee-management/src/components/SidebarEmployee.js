export default function Sidebar({ activePage, setActivePage }) {
  const menuItems = [
    { name: "Manage Task", icon: "📋" },
    { name: "Message", icon: "💬" },
  ];

  return (
    <div className="w-64 bg-white shadow-md h-screen p-4 flex flex-col">
      <div className="flex items-center justify-center mb-8">
        <img
          src="https://play-lh.googleusercontent.com/8Uheuf8hmbhT-fyQMEXIuSWKov6iygy7He2v-Q--Ya0lKPshW3SseyvBe_7yNqd6GXSD"
          alt="Company Logo"
          className="h-12 object-contain"
        />
      </div>
      <ul className="flex-1">
        {menuItems.map((item) => (
          <li
            key={item.name}
            className={`flex items-center gap-3 p-3 mb-2 cursor-pointer rounded-lg transition ${
              activePage === item.name
                ? "bg-blue-600 text-white font-semibold"
                : "hover:bg-gray-100 text-gray-700"
            }`}
            onClick={() => setActivePage(item.name)}
          >
            <span>{item.icon}</span> {item.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
