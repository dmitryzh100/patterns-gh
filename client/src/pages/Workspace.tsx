import type {
  DraggableLocation,
  DroppableProvided,
  DropResult,
} from "@hello-pangea/dnd";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import React, { useContext, useEffect, useState } from "react";

import { CardEvent, ListEvent } from "../common/enums/enums";
import { type List } from "../common/types/types";
import { Column } from "../components/column/column";
import { ColumnCreator } from "../components/column-creator/column-creator";
import { SocketContext } from "../context/socket";
import { reorderService } from "../services/reorder.service";
import { Container } from "./styled/container";

export const Workspace = () => {
  const [lists, setLists] = useState<List[]>([]);

  const socket = useContext(SocketContext);

  useEffect(() => {
    socket.emit(ListEvent.GET, (lists: List[]) => setLists(lists));
    socket.on(ListEvent.UPDATE, (lists: List[]) => setLists(lists));

    return () => {
      socket.removeAllListeners(ListEvent.UPDATE).close();
    };
  }, []);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }

    const source: DraggableLocation = result.source;
    const destination: DraggableLocation = result.destination;

    const isNotMoved =
      source.droppableId === destination.droppableId &&
      source.index === destination?.index;

    if (isNotMoved) {
      return;
    }

    const isReorderLists = result.type === "COLUMN";

    if (isReorderLists) {
      setLists(
        reorderService.reorderLists(lists, source.index, destination.index)
      );
      socket.emit(ListEvent.REORDER, source.index, destination.index);

      return;
    }

    setLists(reorderService.reorderCards(lists, source, destination));
    socket.emit(CardEvent.REORDER, {
      sourceListId: source.droppableId,
      destinationListId: destination.droppableId,
      sourceIndex: source.index,
      destinationIndex: destination.index,
    });
  };

  const handleCreateList = (name: string): void => {
    socket.emit(ListEvent.CREATE, name);
  };

  const handleDeleteList = (listId: string): void => {
    socket.emit(ListEvent.DELETE, listId);
  };

  const handleRenameList = (listId: string, name: string): void => {
    socket.emit(ListEvent.RENAME, listId, name);
  };

  const handleCreateCard = (listId: string, cardName: string): void => {
    socket.emit(CardEvent.CREATE, listId, cardName);
  };

  const handleRenameCard = (
    listId: string,
    cardId: string,
    cardName: string
  ): void => {
    socket.emit(CardEvent.RENAME, listId, cardId, cardName);
  };

  const handleUpdateCard = (listId: string, cardId: string, cardDescription: string): void => {
    socket.emit(CardEvent.UPDATE, listId, cardId,  cardDescription);
  };

  const handleDeleteCard = (listId: string, cardId: string): void => {
    socket.emit(CardEvent.DELETE, listId, cardId);
  };

  const handleDuplicateCard = (listId: string, cardId: string): void => {
    socket.emit(CardEvent.DUPLICATE, listId, cardId);
  };

  return (
    <React.Fragment>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="board" type="COLUMN" direction="horizontal">
          {(provided: DroppableProvided) => (
            <Container
              className="workspace-container"
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {lists.map((list: List, index: number) => (
                <Column
                  key={list.id}
                  index={index}
                  listName={list.name}
                  cards={list.cards}
                  listId={list.id}
                  onDeleteList={handleDeleteList}
                  onRenameList={handleRenameList}
                  onCreateCard={handleCreateCard}
                  onRenameCard={handleRenameCard}
                  onUpdateCard={handleUpdateCard}
                  onDeleteCard={handleDeleteCard}
                  onDuplicateCard={handleDuplicateCard}
                />
              ))}
              {provided.placeholder}
              <ColumnCreator onCreateList={handleCreateList} />
            </Container>
          )}
        </Droppable>
      </DragDropContext>
    </React.Fragment>
  );
};
