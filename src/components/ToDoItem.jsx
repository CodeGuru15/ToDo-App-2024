import React, { useState } from "react";
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";

const TodoItem = ({ todo, onDelete, onEdit }) => {
  const [isDelete, setIsDelete] = useState(false);
  return (
    <div className="flex flex-row justify-between w-64 gap-2 p-2 ">
      {isDelete ? (
        <div className="absolute top-0 left-0 z-50 flex flex-col items-center justify-center w-screen h-screen gap-5 text-xs backdrop-blur-sm bg-white/20">
          <p>Delete {todo.text} ?</p>
          <button
            onClick={() => {
              onDelete(todo.id);
              setIsDelete(false);
            }}
            className="p-2 border rounded-sm hover:text-red-600 hover:border-red-600"
          >
            Confirm
          </button>
          <button
            onClick={() => setIsDelete(false)}
            className="p-2 border rounded-sm hover:text-green-600 hover:border-green-600"
          >
            Cancel
          </button>
        </div>
      ) : null}
      <span>{todo.text}</span>
      <div className="flex items-center gap-3 ">
        <button className="text-green-500 " onClick={() => onEdit(todo.id)}>
          <FaEdit />
        </button>
        <button className="text-red-600 " onClick={() => setIsDelete(true)}>
          <RiDeleteBin6Line />
        </button>
      </div>
    </div>
  );
};

export default TodoItem;
