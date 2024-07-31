import type { Socket } from "socket.io";

import { CardEvent, LogLevel } from "../common/enums/enums";
import { Card } from "../data/models/card";
import { SocketHandler } from "./socket.handler";

class CardHandler extends SocketHandler {
  public handleConnection(socket: Socket): void {
    socket.on(CardEvent.CREATE, this.createCard.bind(this));
    socket.on(CardEvent.RENAME, this.renameCard.bind(this));
    socket.on(CardEvent.UPDATE, this.updateCardDescription.bind(this));
    socket.on(CardEvent.DELETE, this.deleteCard.bind(this));
    socket.on(CardEvent.DUPLICATE, this.duplicateCard.bind(this));
    socket.on(CardEvent.REORDER, this.reorderCards.bind(this));
  }

  private createCard(listId: string, cardName: string): void {
    try {
      const lists = this.db.getData();
      const newCard = new Card(cardName, "");

      const updatedLists = lists.map((list) =>
        list.id === listId ? list.setCards(list.cards.concat(newCard)) : list
      );

      this.db.setData(updatedLists);
      this.updateLists();
      this.logger.log(
        LogLevel.INFO,
        `Card created in list ${listId} with name ${cardName}`
      );
    } catch (error) {
      this.logger.log(
        LogLevel.ERROR,
        `Error creating card in list ${listId}: ${error.message}`
      );
    }
  }

  private updateCardProperty(
    listId: string,
    cardId: string,
    update: Partial<{ name: string; description: string }>
  ): void {
    try {
      const lists = this.db.getData();

      const list = lists.find((list) => list.id === listId);
      if (!list) {
        throw new Error("List not found");
      }

      const cardIndex = list.cards.findIndex((card) => card.id === cardId);
      if (cardIndex === -1) {
        throw new Error("Card not found");
      }

      const card = list.cards[cardIndex];
      const updatedCard = new Card(
        update.name ?? card.name,
        update.description ?? card.description
      );

      list.cards[cardIndex] = updatedCard;

      this.db.setData(lists);
      this.updateLists();

      this.logger.log(
        LogLevel.INFO,
        `Card updated in list ${listId} with id ${cardId}`
      );
    } catch (error) {
      this.logger.log(
        LogLevel.ERROR,
        `Error updating card in list ${listId} with id ${cardId}: ${error.message}`
      );
    }
  }

  private renameCard(listId: string, cardId: string, cardName: string): void {
    this.updateCardProperty(listId, cardId, { name: cardName });
  }

  private updateCardDescription(
    listId: string,
    cardId: string,
    cardDescription: string
  ): void {
    this.updateCardProperty(listId, cardId, { description: cardDescription });
  }

  private deleteCard(listId: string, cardId: string): void {
    try {
      const lists = this.db.getData();

      const list = lists.find((list) => list.id === listId);
      if (!list) {
        throw new Error("List not found");
      }

      const updatedCards = list.cards.filter((card) => card.id !== cardId);

      const updatedLists = lists.map((list) =>
        list.id === listId ? list.setCards(updatedCards) : list
      );

      this.db.setData(updatedLists);
      this.updateLists();

      this.logger.log(
        LogLevel.INFO,
        `Card deleted in list ${listId} with id ${cardId}`
      );
    } catch (error) {
      this.logger.log(
        LogLevel.ERROR,
        `Error deleting card in list ${listId} with id ${cardId}: ${error.message}`
      );
    }
  }

  private duplicateCard(listId: string, cardId: string): void {
    try {
      const lists = this.db.getData();

      const list = lists.find((list) => list.id === listId);
      if (!list) {
        throw new Error("List not found");
      }

      const cardIndex = list.cards.findIndex((card) => card.id === cardId);
      if (cardIndex === -1) {
        throw new Error("Card not found");
      }

      const card = list.cards[cardIndex];
      const duplicatedCard = card.clone();

      const updatedLists = lists.map((list) =>
        list.id === listId
          ? list.setCards(list.cards.concat(duplicatedCard))
          : list
      );

      this.db.setData(updatedLists);
      this.updateLists();

      this.logger.log(
        LogLevel.INFO,
        `Card duplicated in list ${listId} with id ${cardId}`
      );
    } catch (error) {
      this.logger.log(
        LogLevel.ERROR,
        `Error duplicating card in list ${listId} with id ${cardId}: ${error.message}`
      );
    }
  }

  private reorderCards({
    sourceIndex,
    destinationIndex,
    sourceListId,
    destinationListId,
  }: {
    sourceIndex: number;
    destinationIndex: number;
    sourceListId: string;
    destinationListId: string;
  }): void {
    try {
      const lists = this.db.getData();
      const reordered = this.reorderService.reorderCards({
        lists,
        sourceIndex,
        destinationIndex,
        sourceListId,
        destinationListId,
      });
      this.db.setData(reordered);
      this.updateLists();

      this.logger.log(
        LogLevel.INFO,
        `Cards reordered from list ${sourceListId} to ${destinationListId}`
      );
    } catch (error) {
      this.logger.log(
        LogLevel.ERROR,
        `Error reordering cards: ${error.message}`
      );
    }
  }
}

export { CardHandler };
