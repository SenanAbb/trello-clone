"use client";

import { useBoardStore } from "@/store/BoardStore";
import { Board, Column as ColumnType } from "@/typings";
import { useEffect } from "react";
import { Droppable, DragDropContext, DropResult } from "react-beautiful-dnd";
import Column from "./Column";

export default function Board() {
  const [board, getBoard, setBoardState, updateTodoInDB] = useBoardStore(
    (state) => [
      state.board,
      state.getBoard,
      state.setBoardState,
      state.updateTodoInDB,
    ]
  );

  useEffect(() => {
    getBoard();
  }, [getBoard]);

  const handleOnDragEnd = (result: DropResult) => {
    const { destination, source, type } = result;

    // Check if user dragged card outside of board
    if (!destination) return;

    // Handle a column drag
    if (type === "column") {
      const entries = Array.from(board.columns.entries());
      const [removed] = entries.splice(source.index, 1);
      entries.splice(destination.index, 0, removed);

      const rerrangedColumns = new Map(entries);
      setBoardState({ ...board, columns: rerrangedColumns });
    }

    // Handle card drag
    const columns = Array.from(board.columns);
    const startColIndex = columns[Number(source.droppableId)];
    const finishColIndex = columns[Number(destination.droppableId)];

    const startCol: ColumnType = {
      id: startColIndex[0],
      todos: startColIndex[1].todos,
    };

    const finishCol: ColumnType = {
      id: finishColIndex[0],
      todos: finishColIndex[1].todos,
    };

    if (!startCol || !finishCol) return;

    if (source.index === destination.index && startCol === finishCol) return;

    const newTodos = startCol.todos;
    const [todoRemoved] = newTodos.splice(source.index, 1);

    if (startCol.id === finishCol.id) {
      // Same column task drak
      newTodos.splice(destination.index, 0, todoRemoved);

      const newCol = {
        id: startCol.id,
        todos: newTodos,
      };

      const newColumns = new Map(board.columns);
      newColumns.set(startCol.id, newCol);

      setBoardState({ ...board, columns: newColumns });
    } else {
      // Draging to another column
      const finishTodos = Array.from(finishCol.todos);
      finishTodos.splice(destination.index, 0, todoRemoved);

      const newColumns = new Map(board.columns);
      const newCol = {
        id: startCol.id,
        todos: newTodos,
      };

      newColumns.set(startCol.id, newCol);
      newColumns.set(finishCol.id, {
        id: finishCol.id,
        todos: finishTodos,
      });

      // Update in DB
      updateTodoInDB(todoRemoved, finishCol.id);

      setBoardState({ ...board, columns: newColumns });
    }
  };

  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <Droppable droppableId="board" direction="horizontal" type="column">
        {(provided) => (
          /** Rendering all the columns */
          <div
            className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-7xl mx-auto"
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {Array.from(board.columns.entries()).map(([id, column], index) => {
              return (
                <Column key={id} id={id} todos={column.todos} index={index} />
              );
            })}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}
