INSERT INTO users (email, password_hash)
VALUES ('demo@example.com', '$2b$10$7ABfLg0wLP6x7kJRJ.vB4.4dPjNQvR9q1vM8GMhQ8fS6n/.2WnM1G')
ON CONFLICT (email) DO NOTHING;

INSERT INTO tasks (title, description, status, created_by)
VALUES
  ('Set up backend', 'Initialize project and core modules', 'done', (SELECT id FROM users WHERE email = 'demo@example.com')),
  ('Implement WebSocket', 'Broadcast task updates to clients', 'in_progress', (SELECT id FROM users WHERE email = 'demo@example.com')),
  ('Ship demo page', 'Show live updates in browser', 'todo', (SELECT id FROM users WHERE email = 'demo@example.com'));
