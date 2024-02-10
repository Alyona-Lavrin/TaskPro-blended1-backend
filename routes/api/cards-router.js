import express from "express";
import cardsController from "../../controllers/cards-controllers.js";
import {
  authenticate,
  isEmptyBody,
  isValidIdDashboard,
} from "../../midelwares/index.js";
import { valBody } from "../../decorators/index.js";
import {
  cardAddSchema,
  cardTransportSchema,
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
  // isValidIdDashboard,
  isEmptyBody,
  valBody(cardUpdateSchema),
  cardsController.updateCard
);
cardsRouter.patch(
  "/:id/transport",
  isValidIdDashboard,
  isEmptyBody,
  valBody(cardTransportSchema),
  cardsController.transportCard
);

cardsRouter.patch(
  "/:id/updateStatus",
  isValidIdDashboard,
  isEmptyBody,
  valBody(cardTransportSchema),
  cardsController.updateStatus
);

export default cardsRouter;
