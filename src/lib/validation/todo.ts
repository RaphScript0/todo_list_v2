import { z } from 'zod'

export const TodoIdSchema = z.string().min(1)

export const CreateTodoSchema = z.object({
  title: z.string().trim().min(1).max(200),
})

export const UpdateTodoSchema = z
  .object({
    title: z.string().trim().min(1).max(200).optional(),
    completed: z.boolean().optional(),
  })
  .refine((v) => Object.keys(v).length > 0, {
    message: 'At least one field must be provided',
  })
