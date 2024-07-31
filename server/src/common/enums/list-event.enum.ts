const ListEvent = {
  GET: "list:get",
  REORDER: "list:reorder",
  UPDATE: "list:update",
  CREATE: "list:create",
  RENAME: "list:rename",
  DELETE: "list:delete",
  UNDO: "list:undo",
  REDO: "list:redo",
} as const;

export { ListEvent };
