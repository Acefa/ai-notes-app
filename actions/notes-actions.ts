"use server";


import { ActionState } from "@/types";
import { createNote, getNoteById, getNotesByUserId, updateNote, deleteNote } from "@/db/queries/notes-queries";
import { revalidatePath } from "next/cache";
import { InsertNote } from "@/db/schema/notes-schema";



export async function createNoteAction(data: InsertNote):Promise<ActionState> {
    try {
        const newNote = await createNote(data);
        revalidatePath("/");
        return { status: "success", data: newNote };
    } catch (error) {
        return { status: "error", message: "Failed to create note" };
    }
}

export async function getNoteByIdAction(id: string):Promise<ActionState> {
    try {
        const note = await getNoteById(id);
        return { status: "success", data: note };
    } catch (error) {
        return { status: "error", message: "Failed to get note" };
    }
}   

export async function getNotesByUserIdAction(userId: string):Promise<ActionState> {
    try {
        const notes = await getNotesByUserId(userId);
        return { status: "success", data: notes };
    } catch (error) {
        return { status: "error", message: "Failed to get notes" };
    }
}       

export async function updateNoteAction(id: string, data: Partial<InsertNote>):Promise<ActionState> {
    try {
        const updatedNote = await updateNote(id, data);
        return { status: "success", data: updatedNote };
    } catch (error) {
        return { status: "error", message: "Failed to update note" };
    }
}

export async function deleteNoteAction(id: string):Promise<ActionState> {
    try {
        const deletedNote = await deleteNote(id);
        return { status: "success", data: deletedNote };
    } catch (error) {
        return { status: "error", message: "Failed to delete note" };
    }
}
    
