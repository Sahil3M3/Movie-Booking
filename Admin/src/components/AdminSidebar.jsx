import { Link } from "react-router-dom";

const AdminSidebar = () => {
  return (
    <div className="h-auto w-64 bg-gray-900 text-white flex flex-col p-4 shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>

      <nav className="flex flex-col space-y-4">
        <Link to="/admin/add-category" className="p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition">
          Add Category
        </Link>
        <Link to="/admin/add-movie" className="p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition">
          Add Movie
        </Link>
        <Link to="/admin/showtime-management" className="p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition">
          Showtime Management
        </Link>
        <Link to="/admin/booked-movies" className="p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition">
          Booked Movies
        </Link>
      </nav>
    </div>
  );
};

export default AdminSidebar;
