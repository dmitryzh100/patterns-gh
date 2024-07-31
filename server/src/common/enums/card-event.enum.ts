const CardEvent = {
  CREATE: "card:create",
  REORDER: "card:reorder",
  DELETE: "card:delete",
  DUPLICATE: "card:duplicate",
  UPDATE: "card:update",
  RENAME: "card:rename",
  UNDO: "card:undo",
  REDO: "card:redo",
} as const;

export { CardEvent };
