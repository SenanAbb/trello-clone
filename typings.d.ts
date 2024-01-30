import { Models } from "appwrite";

interface BoardState {
    board: Board;
    getBoard: () => void;
    setBoardState: (board: Board) => void;
    updateTodoInDB: (todo: Todo, columnId: TypedColumn) => void,
    searchString: string,
    setSearchString: (searchString: string) => void;

    addTask: (todo: string, columnId: TypedColumn, image?: File | null) => void,
    deleteTask: (taskIndex: number, todo: Todo, id: TypedColumn) => void

    newTaskInput: string;
    setNewTaskInput: (input: string) => void;
    newTaskType: TypedColumn,
    setNewTaskType: (columnId: TypedColumn) => void;

    image: File | null;
    setImage: (image: File | null) => void,
}

interface Board {
    columns: Map<TypedColumn, Column>
}

type TypedColumn = "todo" | "inprogress" | "done"

interface Column {
    id: TypedColumn,
    todos: Todo[]
}

interface Image extends HTMLImageElement {
    bucketId: string,
    imageId: string
}

interface Todo {
    $id: string,
    $createdAt: string,
    title: string,
    status: string,
    image?: Image
}

interface Image {
    bucketId: string,
    fileId: string
}