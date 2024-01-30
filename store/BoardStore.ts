import { create } from 'zustand'
import { getTodosGroupedByColumn } from '@/lib/getTodosGroupedByColumn'
import { BoardState, TypedColumn, Column, Board, Todo } from '@/typings'
import { ID, databases, storage } from '@/appwrite'
import uploadImage from '@/lib/uploadImage'

export const useBoardStore = create<BoardState>((set, get) => ({
    board: {
        columns: new Map<TypedColumn, Column>()
    },
    newTaskInput: "",
    setNewTaskInput: (input) => { set({ newTaskInput: input }) },
    newTaskType: "todo",
    setNewTaskType: (type) => { set({ newTaskType: type }) },
    searchString: "",
    setSearchString: (searchString) => { set({ searchString }) },
    image: null,
    setImage: (image: File | null) => { set({ image }) },
    getBoard: async () => {
        const board = await getTodosGroupedByColumn()
        set({ board })
    },
    setBoardState: (board: Board) => set({ board }),
    updateTodoInDB: async (todo, columnId) => {
        await databases.updateDocument(
            process.env.NEXT_PUBLIC_DATABASE_ID!,
            process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
            todo.$id,
            {
                title: todo.title,
                status: columnId
            }
        )
    },
    addTask: async (todo, columnId, image?: File | null) => {
        let file = image;

        if (image) {
            const fileUploaded = await uploadImage(image);
            if (fileUploaded) {
                file = {
                    //@ts-ignore
                    bucketId: fileUploaded.bucketId,
                    fileId: fileUploaded.$id
                }
            }
        }

        const { $id } = await databases.createDocument(
            process.env.NEXT_PUBLIC_DATABASE_ID!,
            process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
            ID.unique(),
            {
                title: todo,
                status: columnId,
                ...(file && { image: JSON.stringify(file) })
            }
        )

        set({ newTaskInput: "" })
        set((state) => {
            const newColumns = new Map(state.board.columns)

            //@ts-ignore
            const newTodo: Todo = {
                $id,
                $createdAt: new Date().toISOString(),
                title: todo,
                status: columnId,
                ...(file && { image: file })
            }

            const column = newColumns.get(columnId)

            if (!column) {
                newColumns.set(columnId, {
                    id: columnId,
                    todos: [newTodo]
                })
            } else {
                newColumns.get(columnId)?.todos.push(newTodo)
            }

            return {
                board: {
                    columns: newColumns
                }
            }
        })
    },
    deleteTask: async (taskIndex, todo, id) => {
        const newColumns = new Map(get().board.columns);

        newColumns.get(id)?.todos.splice(taskIndex, 1)

        set({ board: { columns: newColumns } })

        if (todo.image) {
            //@ts-ignore
            await storage.deleteFile(todo.image.bucketId, todo.image.fileId)
        }

        await databases.deleteDocument(
            //@ts-ignore
            process.env.NEXT_PUBLIC_DATABASE_ID,
            process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID,
            todo.$id
        )
    }
}))