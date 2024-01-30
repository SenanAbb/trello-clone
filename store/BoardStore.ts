import { create } from 'zustand'
import { getTodosGroupedByColumn } from '@/lib/getTodosGroupedByColumn'
import { BoardState, TypedColumn, Column, Board, Todo } from '@/typings'
import { databases, storage } from '@/appwrite'
import { todo } from 'node:test'

export const useBoardStore = create<BoardState>((set, get) => ({
    board: {
        columns: new Map<TypedColumn, Column>()
    },
    searchString: "",
    setSearchString: (searchString) => { set({ searchString }) },
    getBoard: async () => {
        const board = await getTodosGroupedByColumn()
        set({ board })
    },
    setBoardState: (board: Board) => set({ board }),
    updateTodoInDB: async (todo, columnId) => {
        await databases.updateDocument(
            //@ts-ignore
            process.env.NEXT_PUBLIC_DATABASE_ID,
            process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID,
            todo.$id,
            {
                title: todo.title,
                status: columnId
            }
        )
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