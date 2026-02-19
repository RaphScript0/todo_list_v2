import { prisma } from '@/lib/prisma'
import { json, zodError } from '@/lib/http'
import { TodoIdSchema, UpdateTodoSchema } from '@/lib/validation/todo'

type Ctx = { params: { id: string } }

export async function PATCH(req: Request, ctx: Ctx) {
  const { id } = ctx.params
  const idParsed = TodoIdSchema.safeParse(id)
  if (!idParsed.success) return zodError(idParsed.error, 400)

  const body = await req.json().catch(() => null)
  const parsed = UpdateTodoSchema.safeParse(body)
  if (!parsed.success) return zodError(parsed.error, 400)

  try {
    const todo = await prisma.todo.update({
      where: { id },
      data: parsed.data,
    })
    return json({ data: todo }, { status: 200 })
  } catch {
    return json({ error: 'NOT_FOUND' }, { status: 404 })
  }
}

export async function DELETE(_req: Request, ctx: Ctx) {
  const { id } = ctx.params
  const idParsed = TodoIdSchema.safeParse(id)
  if (!idParsed.success) return zodError(idParsed.error, 400)

  try {
    await prisma.todo.delete({ where: { id } })
    return new Response(null, { status: 204 })
  } catch {
    return json({ error: 'NOT_FOUND' }, { status: 404 })
  }
}
