import React, { useEffect, useState } from "react";
import TodoItem from "./TodoItem";
import * as Yup from "Yup";
import { useFormik } from "formik";
import { IoMdCheckmark } from "react-icons/io";
import { IoMdClose } from "react-icons/io";

const initialValues = { text: "" };

const todoSchema = Yup.object().shape({
  text: Yup.string()
    .required("Please enter a valid task")
    .min(2, "Enter minimum 2 characters")
    .max(20, "Max 20 characters allowed"),
});

const TodoApp = () => {
  const [todos, setTodos] = useState([]);
  const [editingTodoId, setEditingTodoId] = useState(null);
  const [editingTodoText, setEditingTodoText] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const fetchData = () => {
    const data = JSON.parse(localStorage.getItem("ToDo"));
    data != null ? setTodos(data) : setTodos([]);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formik = useFormik({
    initialValues,
    validationSchema: todoSchema,
    onSubmit: (values) => {
      formik.resetForm();
      const newData = [...todos, { id: Date.now(), text: values.text }];
      // setTodos([...todos, { id: Date.now(), text: values.text }]);
      localStorage.setItem("ToDo", JSON.stringify(newData));
      fetchData();
    },
  });

  const handleDeleteTodo = (id) => {
    // setTodos(todos.filter((todo) => todo.id !== id));
    const restTodo = todos.filter((todo) => todo.id !== id);
    localStorage.setItem("ToDo", JSON.stringify(restTodo));
    fetchData();
  };

  const handleEditTodo = (id) => {
    const todoToEdit = todos.find((todo) => todo.id === id);
    setEditingTodoId(id);
    setEditingTodoText(todoToEdit.text);
  };

  const handleSaveEdit = () => {
    todoSchema
      .validate({ text: editingTodoText })
      .then(() => {
        const updatedTodos = todos.map((todo) => {
          if (todo.id === editingTodoId) {
            return { ...todo, text: editingTodoText.trim("") };
          }
          return todo;
        });
        // setTodos(updatedTodos);
        localStorage.setItem("ToDo", JSON.stringify(updatedTodos));
        fetchData();
        setEditingTodoId(null);
        setEditingTodoText("");
        setErrorMsg("");
      })
      .catch((err) => {
        setErrorMsg(err.errors);
      });
  };

  const handleCancelEdit = () => {
    setEditingTodoId(null);
    setEditingTodoText("");
    setErrorMsg("");
  };

  const handleEditChange = (e) => {
    setEditingTodoText(e.target.value);
  };

  return (
    <div className="flex flex-col items-center h-screen bg-slate-950 text-white/80">
      <h1 className="pt-5 pb-2 text-3xl font-semibold ">TODO APP</h1>
      <p className="h-10 p-2 text-xs text-red-500 sm:text-base">
        {errorMsg != "" ? <span>{errorMsg}</span> : null}
        {formik.errors.text && formik.touched.text ? formik.errors.text : null}
      </p>
      <form className="flex flex-row gap-5 " onSubmit={formik.handleSubmit}>
        <input
          type="text"
          id="text"
          name="text"
          value={formik.values.text}
          onChange={formik.handleChange}
          placeholder="Add a new todo"
          className="p-2 rounded-md outline-none bg-slate-800 placeholder-slate-500"
        />
        <button
          type="submit"
          className="p-2 border rounded-md hover:bg-green-800 hover:border-transparent"
        >
          Add
        </button>
      </form>
      <ul className="flex flex-col-reverse p-2 ">
        {todos.map((todo) => (
          <li key={todo.id} className="flex justify-between w-64 ">
            {editingTodoId === todo.id ? (
              <input
                type="text"
                value={editingTodoText}
                onChange={handleEditChange}
                className="w-48 px-2 py-1 rounded-sm outline-none bg-slate-800 focus-within:outline-blue-400"
              />
            ) : (
              <TodoItem
                todo={todo}
                onDelete={handleDeleteTodo}
                onEdit={handleEditTodo}
              />
            )}
            {editingTodoId === todo.id && (
              <div className="flex gap-3 ">
                <button
                  className="text-xl hover:text-green-500"
                  onClick={handleSaveEdit}
                >
                  <IoMdCheckmark />
                </button>
                <button
                  className="text-xl hover:text-red-600"
                  onClick={handleCancelEdit}
                >
                  <IoMdClose />
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoApp;
