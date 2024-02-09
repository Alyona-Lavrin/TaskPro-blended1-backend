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
  "/",
  isEmptyBody,
  valBody(cardAddSchema),
  cardsController.addCard
);
cardsRouter.delete("/:id", isValidIdDashboard, cardsController.deleteCard);
cardsRouter.put(
  "/:id",
  isValidIdDashboard,
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

export default cardsRouter;
