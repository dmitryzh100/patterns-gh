import type { DraggableLocation } from "@hello-pangea/dnd";

import { type Card, type List } from "../common/types/types";

// export const reorderService = {
//   reorderLists(items: List[], startIndex: number, endIndex: number): List[] {
//     const [removed] = items.splice(startIndex, 1);
//     items.splice(endIndex, 0, removed);

//     return items;
//   },

//   reorderCards(
//     lists: List[],
//     source: DraggableLocation,
//     destination: DraggableLocation
//   ): List[] {
//     const current: Card[] =
//       lists.find((list) => list.id === source.droppableId)?.cards || [];
//     const next: Card[] =
//       lists.find((list) => list.id === destination.droppableId)?.cards || [];
//     const target: Card = current[source.index];

//     const isMovingInSameList = source.droppableId === destination.droppableId;

//     if (isMovingInSameList) {
//       const [removed] = current.splice(source.index, 1);
//       current.splice(destination.index, 0, removed);
//       const reordered: Card[] = current;

//       return lists.map((list) =>
//         list.id === source.droppableId ? { ...list, cards: reordered } : list
//       );
//     }

//     const newLists = lists.map((list) => {
//       if (list.id === source.droppableId) {
//         return {
//           ...list,
//           cards: this.removeCardFromList(current, source.index),
//         };
//       }

//       if (list.id === destination.droppableId) {
//         return {
//           ...list,
//           cards: this.addCardToList(next, destination.index, target),
//         };
//       }

//       return list;
//     });

//     return newLists;
//   },

//   removeCardFromList(cards: Card[], index: number): Card[] {
//     return cards.slice(0, index).concat(cards.slice(index + 1));
//   },

//   addCardToList(cards: Card[], index: number, card: Card): Card[] {
//     return cards.slice(0, index).concat(card).concat(cards.slice(index));
//   },
// };

import { remove, insert } from "ramda";

// Utility functions
const findListById = (lists: List[], id: string): List | undefined =>
  lists.find((list) => list.id === id);

const updateListCards = (
  lists: List[],
  listId: string,
  newCards: Card[]
): List[] =>
  lists.map((list) =>
    list.id === listId ? { ...list, cards: newCards } : list
  );

// Remove card from a list
const removeCardFromList = (cards: Card[], index: number): Card[] =>
  remove(index, 1, cards);

// Add card to a list
const addCardToList = (cards: Card[], index: number, card: Card): Card[] =>
  insert(index, card, cards);

// Generic reorder function using Ramda
const reorder = <T>(items: T[], startIndex: number, endIndex: number): T[] => {
  const item = items[startIndex];
  const itemsWithout = remove(startIndex, 1, items);
  return insert(endIndex, item, itemsWithout);
};

// Reorder cards within the same list using generic reorder function
const reorderCardsInSameList = (
  cards: Card[],
  startIndex: number,
  endIndex: number
): Card[] => reorder(cards, startIndex, endIndex);

// Reorder lists function using generic reorder function
const reorderLists = (
  items: List[],
  startIndex: number,
  endIndex: number
): List[] => reorder(items, startIndex, endIndex);

// Reorder cards function
const reorderCards = (
  lists: List[],
  source: DraggableLocation,
  destination: DraggableLocation
): List[] => {
  const currentList = findListById(lists, source.droppableId);
  const destinationList = findListById(lists, destination.droppableId);

  if (!currentList || !destinationList) {
    return lists;
  }

  const currentCards = currentList.cards;
  const destinationCards = destinationList.cards;
  const targetCard = currentCards[source.index];

  const isMovingInSameList = source.droppableId === destination.droppableId;

  if (isMovingInSameList) {
    const reorderedCards = reorderCardsInSameList(
      currentCards,
      source.index,
      destination.index
    );
    return updateListCards(lists, source.droppableId, reorderedCards);
  }

  const newSourceCards = removeCardFromList(currentCards, source.index);
  const newDestinationCards = addCardToList(
    destinationCards,
    destination.index,
    targetCard
  );

  const updatedLists = lists.map((list) => {
    if (list.id === source.droppableId) {
      return { ...list, cards: newSourceCards };
    }

    if (list.id === destination.droppableId) {
      return { ...list, cards: newDestinationCards };
    }

    return list;
  });

  return updatedLists;
};

export const reorderService = {
  reorderLists,
  reorderCards,
};
