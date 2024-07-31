import type { DroppableProvided } from "@hello-pangea/dnd";
import { Droppable } from "@hello-pangea/dnd";

import { type Card } from "../../common/types/types";
import { List } from "./components/list";
import { ListWrapper } from "./styled/list-wrapper";
import { ScrollContainer } from "./styled/scroll-container";

type Props = {
  listId: string;
  listType: string;
  cards: Card[];
  onRenameCard: (cardId: string, name: string) => void;
  onUpdateCard: (cardId: string, description: string) => void;
  onDeleteCard: (cardId: string) => void;
  onDuplicateCard: (cardId: string) => void;
};

const CardsList = ({
  listId,
  listType,
  cards,
  onRenameCard,
  onUpdateCard,
  onDeleteCard,
  onDuplicateCard,
}: Props) => {
  return (
    <Droppable droppableId={listId} type={listType}>
      {(dropProvided: DroppableProvided) => (
        <ListWrapper {...dropProvided.droppableProps}>
          <ScrollContainer>
            <List
              cards={cards}
              dropProvided={dropProvided}
              onRenameCard={onRenameCard}
              onUpdateCard={onUpdateCard}
              onDeleteCard={onDeleteCard}
              onDuplicateCard={onDuplicateCard}
            />
          </ScrollContainer>
        </ListWrapper>
      )}
    </Droppable>
  );
};

export { CardsList };
