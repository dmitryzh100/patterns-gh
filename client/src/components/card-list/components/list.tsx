import { DroppableProvided } from "@hello-pangea/dnd";

import { type Card } from "../../../common/types/types";
import { DropZone } from "../styled/drop-zone";
import { Cards } from "./cards";

type Props = {
  dropProvided: DroppableProvided;
  cards: Card[];
  onRenameCard: (cardId: string, name: string) => void;
  onUpdateCard: (cardId: string, description: string) => void;
  onDeleteCard: (cardId: string) => void;
  onDuplicateCard: (cardId: string) => void;
};

const List = ({
  cards,
  dropProvided,
  onRenameCard,
  onUpdateCard,
  onDeleteCard,
  onDuplicateCard,
}: Props) => {
  return (
    <div className="list-container">
      <DropZone ref={dropProvided.innerRef}>
        <Cards
          cards={cards}
          onRenameCard={onRenameCard}
          onUpdateCard={onUpdateCard}
          onDeleteCard={onDeleteCard}
          onDuplicateCard={onDuplicateCard}
        />
        {dropProvided.placeholder}
      </DropZone>
    </div>
  );
};

export { List };
