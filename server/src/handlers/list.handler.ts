import type { Socket } from "socket.io";

import { ListEvent, LogLevel } from "../common/enums/enums";
import { List } from "../data/models/list";
import { SocketHandler } from "./socket.handler";

class ListHandler extends SocketHandler {
  public handleConnection(socket: Socket): void {
    socket.on(ListEvent.CREATE, this.createList.bind(this));
    socket.on(ListEvent.DELETE, this.deleteList.bind(this));
    socket.on(ListEvent.RENAME, this.renameList.bind(this));
    socket.on(ListEvent.GET, this.getLists.bind(this));
    socket.on(ListEvent.REORDER, this.reorderLists.bind(this));
  }

  private getLists(callback: (lists: List[]) => void): void {
    try {
      callback(this.db.getData());
      this.logger.log(LogLevel.INFO, "Fetched lists");
    } catch (error) {
      this.logger.log(LogLevel.ERROR, `Error fetching lists: ${error.message}`);
    }
  }

  private reorderLists(sourceIndex: number, destinationIndex: number): void {
    try {
      const lists = this.db.getData();
      const reorderedLists = this.reorderService.reorder(
        lists,
        sourceIndex,
        destinationIndex
      );
      this.db.setData(reorderedLists);
      this.updateLists();
      this.logger.log(
        LogLevel.INFO,
        `Reordered lists from index ${sourceIndex} to ${destinationIndex}`
      );
    } catch (error) {
      this.logger.log(
        LogLevel.ERROR,
        `Error reordering lists: ${error.message}`
      );
    }
  }

  private createList(name: string): void {
    try {
      const lists = this.db.getData();
      const newList = new List(name);
      this.db.setData(lists.concat(newList));
      this.updateLists();
      this.logger.log(LogLevel.INFO, `Created new list with name ${name}`);
    } catch (error) {
      this.logger.log(
        LogLevel.ERROR,
        `Error creating list with name ${name}: ${error.message}`
      );
    }
  }

  private deleteList(id: string): void {
    try {
      const lists = this.db.getData();
      this.db.setData(lists.filter((list) => list.id !== id));
      this.updateLists();
      this.logger.log(LogLevel.INFO, `Deleted list with id ${id}`);
    } catch (error) {
      this.logger.log(
        LogLevel.ERROR,
        `Error deleting list with id ${id}: ${error.message}`
      );
    }
  }

  private renameList(id: string, name: string): void {
    try {
      const lists = this.db.getData();
      const listIndex = lists.findIndex((list) => list.id === id);
      if (listIndex === -1) {
        throw new Error("List not found");
      }

      const updatedList = new List(name);
      updatedList.setCards(lists[listIndex].cards);

      this.db.setData([
        ...lists.slice(0, listIndex),
        updatedList,
        ...lists.slice(listIndex + 1),
      ]);
      this.updateLists();
      this.logger.log(LogLevel.INFO, `Renamed list with id ${id} to ${name}`);
    } catch (error) {
      this.logger.log(
        LogLevel.ERROR,
        `Error renaming list with id ${id}: ${error.message}`
      );
    }
  }
}

export { ListHandler };
