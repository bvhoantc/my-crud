const Todo = require("../modals/todo");


const getTodos = async (req, res) => {
  try {
    const todos = await Todo.find({});
    res.json(todos);
  } catch (error) {
    res.send(error);
  }
};
const createTodo = async (req, res) => {
  try {
    const todo = new Todo({
      title: req.body.title,
      description: req.body.description,
      completed: req.body.completed,
    });
    const savedTodo = await todo.save();
    res.json(savedTodo);
  } catch (error) {
    res.send(error);
  }
};
const updateTodo = async (req, res) => {
  try {
    const updatedTodo = await Todo.findOneAndUpdate(
      { _id: req.params.todoID },
      {
        $set: {
          title: req.body.title,
          description: req.body.description,
          completed: req.body.completed,
        },
      },
      { new: true }
    );
    res.json(updatedTodo);
  } catch (error) {
    res.send(error);
  }
};

const deleteTodo = async (req, res) => {
  try {
    const deleteTodos = await Todo.findOneAndDelete(
      { _id: req.params.todoID }
    );
    res.json(deleteTodos);
  } catch (error) {
    res.send(error);
  }
};

module.exports = {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo
};
