import type { DraggableProvided } from "@hello-pangea/dnd";

import { type Card } from "../../common/types/types";
import { CopyButton } from "../primitives/copy-button";
import { DeleteButton } from "../primitives/delete-button";
import { Splitter } from "../primitives/styled/splitter";
import { Text } from "../primitives/text";
import { Title } from "../primitives/title";
import { Container } from "./styled/container";
import { Content } from "./styled/content";
import { Footer } from "./styled/footer";

type Props = {
  card: Card;
  isDragging: boolean;
  provided: DraggableProvided;
  onRenameCard: (cardId: string, name: string) => void;
  onUpdateCard: (cardId: string, description: string) => void;
  onDeleteCard: (cardId: string) => void;
  onDuplicateCard: (cardId: string) => void;
};

export const CardItem = ({
  card,
  isDragging,
  provided,
  onRenameCard,
  onUpdateCard,
  onDeleteCard,
  onDuplicateCard,
}: Props) => {
  const onCardTitleChange = (name: string) => {
    onRenameCard(card.id, name);
  };

  const onCardDscriptionChange = (description: string) => {
    onUpdateCard(card.id, description);
  };

  const onCardDeleteClick = () => {
    onDeleteCard(card.id);
  };

  const onCardCopyClick = () => {
    onDuplicateCard(card.id);
  };

  return (
    <Container
      className="card-container"
      isDragging={isDragging}
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      data-is-dragging={isDragging}
      data-testid={card.id}
      aria-label={card.name}
    >
      <Content>
        <Title
          onChange={onCardTitleChange}
          title={card.name}
          fontSize="large"
          isBold
        />
        <Text text={card.description} onChange={onCardDscriptionChange} />
        <Footer>
          <DeleteButton onClick={onCardDeleteClick} />
          <Splitter />
          <CopyButton onClick={onCardCopyClick} />
        </Footer>
      </Content>
    </Container>
  );
};
