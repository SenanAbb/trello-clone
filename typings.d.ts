import { Models } from "appwrite";

interface BoardState {
    board: Board;
    getBoard: () => void;
    setBoardState: (board: Board) => void;
    updateTodoInDB: (todo: Todo, columnId: TypedColumn) => void,
    searchString: string,
    setSearchString: (searchString: string) => void;
    deleteTask: (taskIndex: number, todo: Todo, id: TypedColumn) => void
}

interface Board {
    columns: Map<TypedColumn, Column>
}

type TypedColumn = "todo" | "inprogress" | "done"

interface Column {
    id: TypedColumn,
    todos: Todo[]
}

interface Todo {
    $id: string,
    $createdAt: string,
    title: string,
    status: string,
    image?: string
}

interface Image {
    bucketId: string,
    fileId: string
}