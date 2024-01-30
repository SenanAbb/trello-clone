import { Todo, TypedColumn } from "@/typings";
import React from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import TodoCard from "./TodoCard";
import { PlusCircleIcon } from "@heroicons/react/24/solid";
import { useBoardStore } from "@/store/BoardStore";
import { useModalStore } from "@/store/ModalStore";

type Props = {
  id: TypedColumn;
  todos: Todo[];
  index: number;
};

const idToColumnText: {
  [key in TypedColumn]: string;
} = {
  todo: "To Do",
  inprogress: "In Progress",
  done: "Done",
};

export default function Column({ id, todos, index }: Props) {
  const [searchString] = useBoardStore((state) => [state.searchString]);
  const [openModal] = useModalStore((state) => [state.openModal]);

  return (
    <Draggable draggableId={id} index={index}>
      {(provided) => {
        return (
          <div
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
            className="bg-[#ffffff50] rounded-md"
          >
            {/** Render droppable todos in the column */}
            <Droppable droppableId={index.toString()} type="card">
              {(provided, snapshot) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className={`p-2 rounded-2xl shadow-sm ${
                    snapshot.isDraggingOver ? "bg-green-200" : "bg-white/500"
                  }`}
                >
                  <h2 className="flex justify-between font-bold text-xl p-2">
                    {idToColumnText[id]}

                    <span className="text-gray-500 bg-gray-200 rounded-full px-2 py-1 text-sm">
                      {!searchString
                        ? todos.length
                        : todos.filter((todo) =>
                            todo.title.includes(searchString)
                          ).length}
                    </span>
                  </h2>

                  <div className="space-y-2">
                    {todos.map((todo, index) => {
                      if (
                        searchString &&
                        !todo.title
                          .toLowerCase()
                          .includes(searchString.toLowerCase())
                      )
                        return null;
                      return (
                        <Draggable
                          key={todo.$id}
                          draggableId={todo.$id}
                          index={index}
                        >
                          {(provided) => (
                            <TodoCard
                              todo={todo}
                              index={index}
                              id={id}
                              innerRef={provided.innerRef}
                              draggableProps={provided.draggableProps}
                              dragHandleProps={provided.dragHandleProps}
                            />
                          )}
                        </Draggable>
                      );
                    })}
                    {provided.placeholder}
                    <div className="flex flex-end justify-end">
                      <button
                        onClick={openModal}
                        className="text-green-500 hover:text-green-600"
                      >
                        <PlusCircleIcon className="h-10 w-10" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </Droppable>
          </div>
        );
      }}
    </Draggable>
  );
}
