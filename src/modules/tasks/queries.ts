export const taskQueries = {
  create: `
    INSERT INTO tasks (title, description, status, created_by)
    VALUES ($1, $2, $3, $4)
    RETURNING id, title, description, status, created_by, created_at, updated_at
  `,
  updateStatus: `
    UPDATE tasks
    SET
      status = $2,
      updated_at = NOW()
    WHERE id = $1
    RETURNING id, title, description, status, created_by, created_at, updated_at
  `,
  listByStatus: `
    SELECT id, title, description, status, created_by, created_at, updated_at
    FROM tasks
    WHERE created_by = $1 AND status = $2
    ORDER BY updated_at DESC
    LIMIT $3 OFFSET $4
  `,
  countByStatus: `
    SELECT COUNT(*) as total
    FROM tasks
    WHERE created_by = $1 AND status = $2
  `,
  list: `
    SELECT id, title, description, status, created_by, created_at, updated_at
    FROM tasks
    WHERE created_by = $1
    ORDER BY updated_at DESC
    LIMIT $2 OFFSET $3
  `,
  count: `
    SELECT COUNT(*) as total
    FROM tasks
    WHERE created_by = $1
  `,
  findById: `
    SELECT id, title, description, status, created_by, created_at, updated_at
    FROM tasks
    WHERE id = $1
    LIMIT 1
  `
};
