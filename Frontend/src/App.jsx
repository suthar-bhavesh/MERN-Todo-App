import axios from "axios";
import { useState, useEffect } from "react";
import { X, Pencil } from "lucide-react";
const api_key = "http://localhost:8080/api/todos";

function App() {
  const [title, setTitle] = useState("");
  const [search, setSearch] = useState(() => {
    return localStorage.getItem("search") || "";
  });
  const [error, setError] = useState("");
  const [editid, seteditid] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [description, setdescription] = useState("");
  const [editDescription, seteditDescription] = useState("");
  const [todos, setTodos] = useState(() => {
    const localSavedTodos = localStorage.getItem("localtodos");
    return localSavedTodos ? JSON.parse(localSavedTodos) : [];
  });
  const [expandId, setexpandID] = useState(null);
  const [deleteErrorId, setdeleteErrorId] = useState("");

  // api call function
  const fetchTodos = async () => {
    setError("");

    try {
      const response = await axios.get(`${api_key}?search=${search}`);
      setTodos(response.data);

      localStorage.setItem("localtodos", JSON.stringify(response.data));
    } catch (err) {
      const browserTodos = localStorage.getItem("localtodos");

      if (browserTodos) {
        setTodos(JSON.parse(browserTodos));
        setError("Server Error. availble only local saved todos");
      } else {
        setError("Failed to fetch tasks. Please try again");
      }
    }
  };

  useEffect(() => {
    localStorage.setItem("search", search);
    fetchTodos();
  }, [search]);

  // add todos function
  const addTodo = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      setError("Please enter task");
      return;
    }
    try {
      const response = await axios.post(api_key, { title, description });
      const updatedTodos = [response.data, ...todos];
      setTodos(updatedTodos);
      localStorage.setItem("localtodos", JSON.stringify(updatedTodos));
      setTitle("");
      setdescription("");
    } catch (err) {
      setError("Failed to add task");
    }
  };

  // todos status changing function
  const toggleComplete = async (_id, currentStatus) => {
    try {
      const response = await axios.put(`${api_key}/${_id}`, {
        isCompleted: !currentStatus,
      });
      const updatedTodos = todos.map((todo) =>
        todo._id === _id ? response.data : todo,
      );
      setTodos(updatedTodos);
      localStorage.setItem("localtodos", JSON.stringify(updatedTodos));
    } catch (err) {
      setError("Failed to update status");
    }
  };

  // update todo function
  const updateTodo = async (_id) => {
    if (!editTitle.trim()) return;
    try {
      const response = await axios.put(`${api_key}/${_id}`, {
        title: editTitle,
        description: editDescription,
      });
      const updatedTodo = todos.map((todo) =>
        todo._id === _id ? response.data : todo,
      );
      setTodos(updatedTodo);
      localStorage.setItem("localtodos", JSON.stringify(updatedTodo));
      seteditid(null);
      setEditTitle("");
      seteditDescription("");
    } catch (err) {
      setError("Failed to update task");
    }
  };

  // todo delete function
  const DeleteTodo = async (_id, isCompleted) => {
    if (!isCompleted) {
      setdeleteErrorId(_id);
      return;
    }
    setdeleteErrorId(null);

    try {
      await axios.delete(`${api_key}/${_id}`);
      const updatedTodos = todos.filter((todo) => todo._id !== _id);
      setTodos(updatedTodos);
      localStorage.setItem("localtodos", JSON.stringify(updatedTodos));
    } catch (err) {
      setError("Failed to delete task");
    }
  };

  return (
    <section className="flex justify-center items-center h-screen">
      {/* Todos edits Modal */}
      {editid && (
        <div
          onClick={() => seteditid(null)}
          className="fixed inset-0 z-50 flex justify-center items-center bg-black/50"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white w-145.5 h-auto p-4 rounded-lg flex flex-col gap-9 popIn m-4"
          >
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Edit Task</h2>
              <X
                onClick={() => seteditid(null)}
                className="cursor-pointer hover:text-red-500 transition-all duration-75"
              />
            </div>
            <div className="flex flex-col gap-2.5">
              <div className="flex flex-col gap-2">
                <label htmlFor="title" className="font-bold">
                  Title
                </label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder="Edit Title"
                  className="border-2 border-black w-full p-2 rounded-lg"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="description" className="font-bold">
                  Description
                </label>
                <textarea
                  name="description"
                  id="description"
                  rows={4}
                  value={editDescription}
                  onChange={(e) => seteditDescription(e.target.value)}
                  placeholder="Edit Description"
                  className="border-2 border-black w-full p-3 rounded-lg resize-none text-justify"
                ></textarea>
              </div>
            </div>

            <div className="flex justify-end items-center gap-3">
              <button
                onClick={() => seteditid(null)}
                className="bg-amber-950 w-25 h-10 rounded-lg text-white cursor-pointer text-sm"
              >
                Cancel
              </button>
              <button
                onClick={() => updateTodo(editid)}
                className="bg-amber-950 w-25 h-10 rounded-lg text-white cursor-pointer text-sm"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* main body todos conten */}
      <div className="flex justify-center items-center w-198 h-auto bg-amber-100 border-2 border-black flex-col rounded-lg m-4">
        <div className="flex w-full justify-center items-center mt-3">
          <h2 className="flex font-bold text-xl">Todo List App</h2>
        </div>

        {/* add todos form */}
        <form onSubmit={addTodo} className="mt-3.5 w-full p-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center">
              <input
                type="text"
                placeholder="Enter new task..."
                value={title}
                id="text"
                name="text"
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (e.target.value.trim()) setError("");
                }}
                className={`w-full p-2 border-2 outline-none rounded-bl-lg rounded-tl-lg text-sm ${
                  error ? "border-red-500" : "border-black"
                }`}
              />
              <button
                type="submit"
                className="bg-amber-950 w-25 h-10 rounded-r-lg text-white cursor-pointer text-sm"
              >
                Add
              </button>
            </div>
            {error && (
              <p className="text-md-500 text-sm text-red-500">{error}</p>
            )}

            <div>
              <textarea
                name="description"
                id="description"
                value={description}
                onChange={(e) => setdescription(e.target.value)}
                placeholder="Add Description(option)"
                className="w-full p-2 border-2 border-black outline-none rounded-lg text-sm text-justify"
              ></textarea>
            </div>

            <input
              type="text"
              placeholder="Search tasks..."
              value={search}
              id="text"
              name="text"
              onChange={(e) => setSearch(e.target.value)}
              className="w-full p-2 border-2 border-black outline-none rounded-lg text-sm"
            />
          </div>
        </form>

        {/* todos body list */}
        <div className="flex flex-col h-80 overflow-y-auto w-full">
          <ul className="w-full p-4 flex flex-col gap-2">
            {todos.map((todo) => (
              <div
                key={todo._id}
                className="flex w-full flex-col bg-amber-50 gap-2 p-3 rounded-lg"
              >
                <li className="flex border-2 border-black rounded-lg items-center p-2 justify-between w-full">
                  <div className="flex gap-1.5 flex-col w-full">
                    <div className="flex gap-1">
                      <input
                        type="checkbox"
                        checked={todo.isCompleted}
                        id="checkbox"
                        name="checkbox"
                        onChange={() => {
                          toggleComplete(todo._id, todo.isCompleted);
                          setdeleteErrorId(null);
                        }}
                      />
                      <span
                        onClick={() =>
                          toggleComplete(todo._id, todo.isCompleted)
                        }
                        className={`cursor-pointer text-sm ${
                          todo.isCompleted ? "line-through text-gray-400" : ""
                        }`}
                      >
                        {todo.title}
                      </span>
                    </div>
                    {deleteErrorId === todo._id && (
                      <p className="text-sm text-red-500">
                        Please mark task then Delete
                      </p>
                    )}
                    {todo.description && (
                      <>
                        <div>
                          <p
                            className="overflow-hidden transition-all duration-300 text-sm text-gray-500 text-justify"
                            style={{
                              maxHeight:
                                expandId === todo._id ? "500px" : "24px",
                            }}
                          >
                            {todo.description}
                          </p>
                          {todo.description.length > 50 && (
                            <button
                              className="text-sm"
                              onClick={() =>
                                setexpandID(
                                  expandId === todo._id ? null : todo._id,
                                )
                              }
                            >
                              {expandId === todo._id
                                ? "Read Less... "
                                : "Read More..."}
                            </button>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </li>
                <div className="flex gap-2 items-center">
                  <Pencil
                    size={40}
                    onClick={() => {
                      seteditid(todo._id);
                      setEditTitle(todo.title);
                      seteditDescription(todo.description || "");
                    }}
                    className="bg-amber-950 text-white p-1.5 rounded-full"
                  />
                  <button
                    onClick={() => DeleteTodo(todo._id, todo.isCompleted)}
                    className="bg-amber-950 w-19.5 h-11 rounded-lg text-white cursor-pointer text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export default App;
