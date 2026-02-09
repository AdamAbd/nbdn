import { pgTable, text, timestamp, boolean, index, jsonb } from 'drizzle-orm/pg-core'
import { user } from '#server/db/schema/auth'

export const todo = pgTable(
  'todo',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    title: text('title').notNull(),
    description: text('description'),
    jsonValue: jsonb('json_value'),
    photoUrl: text('photo_url'),
    completed: boolean('completed').default(false).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at'),
  },
  (table) => [index('todo_userId_idx').on(table.userId)]
)
