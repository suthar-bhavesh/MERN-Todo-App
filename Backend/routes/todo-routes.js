const express = require("express");
const router = express.Router();
const {
  getTodos,
  getsingleTodos,
  createTodo,
  updateTodo,
  deleteTodo,
} = require("../controllers/todo-controllers");

router.route("/").get(getTodos).post(createTodo);
router.route("/:id").put(updateTodo).delete(deleteTodo).get(getsingleTodos);

module.exports = router;
