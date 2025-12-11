import { z } from 'zod';

const ZodUserSchema = z.object({
    username: z.string().min(1).max(50),
    email: z.email(),
    passwordHash: z.string().min(8).max(100),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
    lastLoginAt: z.date().optional(),
})

type UserType = z.infer<typeof ZodUserSchema>

const ZodLinkSchema = z.object({
    groupId: z.string().min(1),
    sharedBy: z.string().min(1),
    label: z.string().min(1).max(50),
    url: z.url(),
    description: z.string(),
    tags: z.array(z.string()),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
})

type LinkType = z.infer<typeof ZodLinkSchema>

const ZodGroupSchema = z.object({
    name: z.string().min(1).max(50),
    isPrivate: z.boolean(),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
})

type GroupType = z.infer<typeof ZodGroupSchema>

const ZodMemberShipSchema = z.object({
    userId: z.string().min(1),
    groupId: z.string().min(1),
    role: z.enum(['owner', 'contributer', 'reader']),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
})

type MemberShipType = z.infer<typeof ZodMemberShipSchema>


interface EntityConfig<T> {
    schema: z.ZodObject<any>,
    type: T
}

export const UserConfig: EntityConfig<UserType> = {
    schema: ZodUserSchema,
    type: {} as UserType,
}

export const GroupConfig: EntityConfig<GroupType> = {
    schema: ZodGroupSchema,
    type: {} as GroupType,
}

export const LinkConfig: EntityConfig<LinkType> = {
    schema: ZodLinkSchema,
    type: {} as LinkType,
}

export const MemberShipConfig: EntityConfig<MemberShipType> = {
    schema: ZodLinkSchema,
    type: {} as MemberShipType,
}

export function validateSchema<T>(data: object, config: EntityConfig<T>): {
    data?: T
} | {
    error?: string
} {
    try {
        let parsedResponse = config.schema.safeParse(data);

        if (parsedResponse && parsedResponse.success) return {
            data: parsedResponse.data as T
        };

        return {
            error: parsedResponse.error.message
        }
    } catch (err) {
        console.error(err);
        let message = err instanceof Error ? err.message : 'unexpected error';
        return {
            error: message
        }
    }
}

/**
 * 
 * {
  "name": "ZodError",
  "message": "[\n  {\n    \"expected\": \"string\",\n    \"code\": \"invalid_type\",\n    \"path\": [\n      \"passwordHash\"\n    ],\n    \"message\": \"Invalid input: expected string, received undefined\"\n  }\n]"
}
 */

