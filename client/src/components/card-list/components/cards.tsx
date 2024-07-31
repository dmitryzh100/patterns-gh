import type {
  DraggableProvided,
  DraggableStateSnapshot,
} from "@hello-pangea/dnd";
import { Draggable } from "@hello-pangea/dnd";
import React from "react";

import { type Card } from "../../../common/types/types";
import { CardItem } from "../../card-item/card-item";

type Props = {
  cards: Card[];
  onRenameCard: (cardId: string, name: string) => void;
  onUpdateCard: (cardId: string, description: string) => void;
  onDeleteCard: (cardId: string) => void;
  onDuplicateCard: (cardId: string) => void;
};

const Cards = ({
  cards,
  onRenameCard,
  onUpdateCard,
  onDeleteCard,
  onDuplicateCard,
}: Props) => (
  <React.Fragment>
    {cards.map((card: Card, index: number) => (
      <Draggable key={card.id} draggableId={card.id} index={index}>
        {(
          dragProvided: DraggableProvided,
          dragSnapshot: DraggableStateSnapshot
        ) => (
          <CardItem
            key={card.id}
            card={card}
            isDragging={dragSnapshot.isDragging}
            provided={dragProvided}
            onRenameCard={onRenameCard}
            onUpdateCard={onUpdateCard}
            onDeleteCard={onDeleteCard}
            onDuplicateCard={onDuplicateCard}
          />
        )}
      </Draggable>
    ))}
  </React.Fragment>
);

export { Cards };
