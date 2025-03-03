"use server";


import { InsertProfile } from "@/db/schema";
import { ActionState } from "@/types";
import { createProfile, getProfileByUserId , getAllProfiles , updateProfile, deleteProfile } from "@/db/queries/profiles-queries";
import { revalidatePath } from "next/cache";

export async function createProfileAction(data: InsertProfile):Promise<ActionState> {
    try {
        const newProfile = await createProfile(data);
        revalidatePath("/");
        return { status: "success", data: newProfile };
    } catch (error) {
        return { status: "error", message: "Failed to create profile" };
    }
}

export async function getProfileByUserIdAction(userId: string):Promise<ActionState> {
    try {
        const profile = await getProfileByUserId(userId);
        return { status: "success", data: profile };
    } catch (error) {
        return { status: "error", message: "Failed to get profile" };
    }
}               

export async function getAllProfilesAction():Promise<ActionState> {
    try {
        const profiles = await getAllProfiles();
        return { status: "success", data: profiles };
    } catch (error) {
        return { status: "error", message: "Failed to get all profiles" };
    }
}

export async function updateProfileAction(userId: string, data: Partial<InsertProfile>):Promise<ActionState> {
    try {
        const updatedProfile = await updateProfile(userId, data);
        return { status: "success", data: updatedProfile };
    } catch (error) {
        return { status: "error", message: "Failed to update profile" };
    }       
}   

export async function deleteProfileAction(userId: string):Promise<ActionState> {
    try {
        const deletedProfile = await deleteProfile(userId);
        return { status: "success", data: deletedProfile };
    } catch (error) {
        return { status: "error", message: "Failed to delete profile" };
    }
}   