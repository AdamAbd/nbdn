import { desc, eq, and } from 'drizzle-orm'
import { db } from '#server/db'
import { todo } from '#server/db/schema'
import type { TodoRow } from '#server/utils/todo'
import type { InferInsertModel } from 'drizzle-orm'

export const TodoRepository = {
  async findAllByUserId(userId: string) {
    return db.select().from(todo).where(eq(todo.userId, userId)).orderBy(desc(todo.createdAt))
  },

  async findByIdAndUserId(id: string, userId: string) {
    const [row] = await db
      .select()
      .from(todo)
      .where(and(eq(todo.id, id), eq(todo.userId, userId)))
    return row || null
  },

  async create(data: InferInsertModel<typeof todo>) {
    const [created] = await db.insert(todo).values(data).returning()
    return created || null
  },

  async update(id: string, userId: string, updates: Partial<InferInsertModel<typeof todo>>) {
    const [updated] = await db
      .update(todo)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(and(eq(todo.id, id), eq(todo.userId, userId)))
      .returning()
    return updated || null
  },

  async delete(id: string, userId: string) {
    const [deleted] = await db
      .delete(todo)
      .where(and(eq(todo.id, id), eq(todo.userId, userId)))
      .returning({ id: todo.id })
    return deleted || null
  },
}
