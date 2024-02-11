import express from "express";
import cardsController from "../../controllers/cards-controllers.js";
import {
  authenticate,
  isEmptyBody,
} from "../../midelwares/index.js";
import { valBody } from "../../decorators/index.js";
import {
  cardAddSchema,
  cardUpdateSchema,
} from "../../models/card.js";

const cardsRouter = express.Router();

cardsRouter.use(authenticate);

cardsRouter.post(
  "/:columId",
  isEmptyBody,
  valBody(cardAddSchema),
  cardsController.addCard
);
cardsRouter.delete("/:cardsId",  cardsController.deleteCard);
cardsRouter.put(
  "/:cardsId",
  isEmptyBody,
  valBody(cardUpdateSchema),
  cardsController.updateCard
);

cardsRouter.patch(
  "/:cardsId/:owner",
  isEmptyBody,
  cardsController.updateStatus
);

export default cardsRouter;
