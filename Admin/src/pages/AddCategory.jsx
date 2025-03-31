import { database } from "../firebaseConfig";
import { ref, push, set } from "firebase/database";


const AddCategory = () => {

  const handleAddCategory =async (e) => {
    const category=e.get("category");
   
    if (category.trim() === "") {
      alert("Category name cannot be empty");
    }
    try {
      
    
  const categoryRef = ref(database, "categories"); 
  const newCategoryRef = push(categoryRef); 

  await set(newCategoryRef, {category });

      alert("Category added");
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };

  return (
    <div className="p-6 bg-gray-800  text-white rounded-lg shadow-lg w-96">
      <h2 className="text-2xl font-semibold mb-4">Add Category</h2>
      <form action={handleAddCategory} className="space-y-4">
        <div>
          <label className="block text-lg font-medium mb-2" htmlFor="category">
            Category Name
          </label>
          <input
            type="text"
            id="category"
            name="category"
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
