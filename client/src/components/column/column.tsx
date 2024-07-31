import type {
  DraggableProvided,
  DraggableStateSnapshot,
} from "@hello-pangea/dnd";
import { Draggable } from "@hello-pangea/dnd";

import { type Card } from "../../common/types/types";
import { CardsList } from "../card-list/card-list";
import { DeleteButton } from "../primitives/delete-button";
import { Splitter } from "../primitives/styled/splitter";
import { Title } from "../primitives/title";
import { Footer } from "./components/footer";
import { Container } from "./styled/container";
import { Header } from "./styled/header";

type Props = {
  listId: string;
  listName: string;
  cards: Card[];
  index: number;
  onDeleteList: (id: string) => void;
  onRenameList: (id: string, name: string) => void;
  onCreateCard: (id: string, name: string) => void;
  onRenameCard: (id: string, cardId: string, name: string) => void;
  onUpdateCard: (id: string, cardId: string, description: string) => void;
  onDeleteCard: (id: string, cardId: string) => void;
  onDuplicateCard: (id: string, cardId: string) => void;
};

export const Column = ({
  listId,
  listName,
  cards,
  index,
  onDeleteList,
  onRenameList,
  onCreateCard,
  onRenameCard,
  onUpdateCard,
  onDeleteCard,
  onDuplicateCard,
}: Props) => {
  const onDeleteListHandle = () => {
    onDeleteList(listId);
  };

  const onRenameListHandle = (name: string) => {
    onRenameList(listId, name);
  };

  const onCreateCardHandle = (cardName: string) => {
    onCreateCard(listId, cardName);
  };

  const onRenameCardHandle = (cardId: string, cardName: string) => {
    onRenameCard(listId, cardId, cardName);
  };
  const onUpdateCardHandle = (cardId: string, cardName: string) => {
    onUpdateCard(listId, cardId, cardName);
  };
  const onDeleteCardHandle = (cardId: string) => {
    onDeleteCard(listId, cardId);
  };
  const onDuplicateCardHandle = (cardId: string) => {
    onDuplicateCard(listId, cardId);
  };

  return (
    <Draggable draggableId={listId} index={index}>
      {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
        <Container
          className="column-container"
          ref={provided.innerRef}
          {...provided.draggableProps}
        >
          <Header
            className="column-header"
            isDragging={snapshot.isDragging}
            {...provided.dragHandleProps}
          >
            <Title
              aria-label={listName}
              title={listName}
              onChange={onRenameListHandle}
              fontSize="large"
              width={200}
              isBold
            />
            <Splitter />
            <DeleteButton color="#FFF0" onClick={onDeleteListHandle} />
          </Header>
          <CardsList
            listId={listId}
            listType="CARD"
            cards={cards}
            onRenameCard={onRenameCardHandle}
            onUpdateCard={onUpdateCardHandle}
            onDeleteCard={onDeleteCardHandle}
            onDuplicateCard={onDuplicateCardHandle}
          />
          <Footer onCreateCard={onCreateCardHandle} />
        </Container>
      )}
    </Draggable>
  );
};
