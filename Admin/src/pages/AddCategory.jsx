import { useEffect, useState } from "react";
import { useDispatch,useSelector } from "react-redux";
import { addCategory } from "../store/movie";
import { useNavigate } from "react-router-dom";


const AddCategory = () => {
  const [category, setCategory] = useState("");
  const dispatch = useDispatch();
  const {user,loading}=useSelector(state=>state.auth);
  const navigate=useNavigate();
  console.log(user,loading);
  

       useEffect(()=>{
            
        if( !loading && !user)
          navigate("/")
       },
      [user,loading,navigate])

  const handleAddCategory = (e) => {
    e.preventDefault();
    if (category.trim() === "") {
      alert("Category name cannot be empty");
      return;
    }
    dispatch(addCategory(category));
    setCategory(""); // Reset input field
  };

  return (
    <div className="p-6 bg-gray-800 text-white rounded-lg shadow-lg w-96">
      <h2 className="text-2xl font-semibold mb-4">Add Category</h2>
      <form onSubmit={handleAddCategory} className="space-y-4">
        <div>
          <label className="block text-lg font-medium mb-2" htmlFor="category">
            Category Name
          </label>
          <input
            type="text"
            id="category"
            name="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-2 border border-gray-600 bg-gray-700 rounded-md focus:ring focus:ring-blue-400 outline-none"
            placeholder="Enter category name"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition-all duration-300"
        >
          Add Category
        </button>
      </form>
    </div>
  );
};

export default AddCategory;
