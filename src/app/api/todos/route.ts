import { prisma } from '@/lib/prisma'
import { json, zodError } from '@/lib/http'
import { CreateTodoSchema } from '@/lib/validation/todo'

export async function GET() {
  const todos = await prisma.todo.findMany({ orderBy: { createdAt: 'desc' } })
  return json({ data: todos }, { status: 200 })
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null)
  const parsed = CreateTodoSchema.safeParse(body)
  if (!parsed.success) return zodError(parsed.error, 400)

  const todo = await prisma.todo.create({ data: { title: parsed.data.title } })
  return json({ data: todo }, { status: 201 })
}
