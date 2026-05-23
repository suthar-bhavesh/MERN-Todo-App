const Todo = require("../models/todo-models");

// get all todos
const getTodos = async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};

    if (search) {
      query.title = { $regex: search, $options: "i" };
    }

    const todos = await Todo.find(query).sort({ createdAt: -1 });
    res.status(200).json(todos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// get single todos
const getsingleTodos = async (req, res) => {
  const { id } = req.params;
  const singleTodo = await Todo.findById(id);

  if (!singleTodo) {
    return res
      .status(404)
      .json({ message: `Todo not found for this id: ${id}` });
  }
  res.status(200).json(singleTodo);
};

// Add Todos
const createTodo = async (req, res) => {
  try {
    const { title, description, isCompleted } = req.body;

    if (!title) {
      return res.status(404).json({
        success: false,
        message: "Title is required",
      });
    }

    const newTodo = await Todo.create({ title, description, isCompleted });
    res.status(200).json(newTodo);
  } catch (error) {
    res.status(500).json({ message: "Please fill required fields" });
  }
};

// Updated Todos
const updateTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const UpdatedNewtodo = await Todo.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!UpdatedNewtodo) {
      return res
        .status(404)
        .json({ message: `Todo not found for this id: ${id}` });
    }
    res.status(200).json(UpdatedNewtodo);
  } catch (error) {
    res.status(500).json({ message: `Todo has been updated for this ${id}` });
  }
};

// Deleted Todos
const deleteTodo = async (req, res) => {
  const { id } = req.params;
  const deleteTodo = await Todo.findByIdAndDelete(id);
  if (!deleteTodo) {
    return res
      .status(404)
      .json({ message: `Todo not found for this id: ${id}` });
  }
  res.status(200).json({ message: "Todo deleted successfully" });
};

module.exports = {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
  getsingleTodos,
};
