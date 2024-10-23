import { Router } from "express";
import { GET_INCIDENTS, INCIDENT_REPORT } from "../controllers";

const router = Router();

router.post("/incident", INCIDENT_REPORT);

router.get("/incidents", GET_INCIDENTS);

export default router;
