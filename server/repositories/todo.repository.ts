import { desc, eq, and } from 'drizzle-orm'
import { getDb } from '#server/db'
import { todo } from '#server/db/schema'
import type { InferInsertModel } from 'drizzle-orm'

export const TodoRepository = {
  async findAllByUserId(userId: string) {
    const db = getDb()
    return db.select().from(todo).where(eq(todo.userId, userId)).orderBy(desc(todo.createdAt))
  },

  async findByIdAndUserId(id: string, userId: string) {
    const db = getDb()
    const [row] = await db
      .select()
      .from(todo)
      .where(and(eq(todo.id, id), eq(todo.userId, userId)))
    return row || null
  },

  async create(data: InferInsertModel<typeof todo>) {
    const db = getDb()
    const [created] = await db.insert(todo).values(data).returning()
    return created || null
  },

  async update(id: string, userId: string, updates: Partial<InferInsertModel<typeof todo>>) {
    const db = getDb()
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
    const db = getDb()
    const [deleted] = await db
      .delete(todo)
      .where(and(eq(todo.id, id), eq(todo.userId, userId)))
      .returning({ id: todo.id })
    return deleted || null
  },
}
