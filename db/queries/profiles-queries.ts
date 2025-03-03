import { eq } from "drizzle-orm";
import { db } from "../db";
import { profilesTable, type InsertProfile , type SelectProfile} from "../schema/profiles-schema";

export const createProfile = async (data: InsertProfile) => {
    try {
        const profile = await db.insert(profilesTable).values(data).returning();
        return profile;
    } catch (error) {
        console.error(error);
        throw new Error("Failed to create profile");
    }
};

export const getProfileByUserId = async (userId: string) => {
    try {
        const profile = await db.query.profiles.findFirst({ where: eq(profilesTable.userId, userId) });
        return profile;
    } catch (error) {
        console.error(error);
        throw new Error("Failed to get profile");
    }
};

export const updateProfile = async (userId: string, data: Partial<InsertProfile>) => {
    try {
        const profile = await db.update(profilesTable).set(data).where(eq(profilesTable.userId, userId)).returning();
        return profile;
    } catch (error) {
        console.error(error);
        throw new Error("Failed to update profile");
    }
};

export const deleteProfile = async (userId: string) => {
    try {
        const profile = await db.delete(profilesTable).where(eq(profilesTable.userId, userId)).returning();
        return profile;
    } catch (error) {
        console.error(error);
        throw new Error("Failed to delete profile");
    }
};

export const getAllProfiles = async () => {
    try {
        const profiles = await db.query.profiles.findMany();
        return profiles;
    } catch (error) {
        console.error(error);
        throw new Error("Failed to get all profiles");
    }
};

export const updateProfileByStripeCustomerId = async (stripeCustomerId: string, data: Partial<InsertProfile>) => {
    try {
      const [updatedProfile] = await db.update(profilesTable).set(data).where(eq(profilesTable.stripeCustomerId, stripeCustomerId)).returning();
      return updatedProfile;
    } catch (error) {
      console.error("Error updating profile by stripe customer ID:", error);
      throw new Error("Failed to update profile");
    }
  };

