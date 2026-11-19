import express from "express";
import upload from "../middleware/upload.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { authorizeRole } from "../middleware/roleMiddleware.js";
import { exportResolvedComplaintsCSV } from "../controllers/complaintController.js";
import {
  createComplaint,
  getMyComplaints,
  getAllComplaints,
  updateComplaintStatus,
  getComplaintById,
  getResolvedComplaints,
  notifyWarden,
  deleteComplaintsByMonth
} from "../controllers/complaintController.js";

const router = express.Router();

/* ----------------------------
      COMPLAINT CREATION
----------------------------- */
router.post(
  "/",
  authMiddleware,
  upload.single("file"),
  createComplaint
);

/* ----------------------------
      COMPLAINT MANAGEMENT
----------------------------- */
router.get("/my", authMiddleware, getMyComplaints);

router.get("/resolved", authMiddleware, getResolvedComplaints);

router.post("/notify-warden", authMiddleware, notifyWarden);

router.get("/", authMiddleware, getAllComplaints);

/* ----------------------------
      DYNAMIC ROUTES
----------------------------- */
router.get("/:id", authMiddleware, getComplaintById);

router.put(
  "/:id",
  authMiddleware,
  authorizeRole(["warden", "chief_warden", "admin"]),
  updateComplaintStatus
);

router.delete(
  "/delete-by-month",
  authMiddleware,
  authorizeRole(["admin", "chief_warden"]),
  deleteComplaintsByMonth
);
router.get(
  "/export/resolved",
  authMiddleware,
  authorizeRole(["admin", "chief_warden"]),
  exportResolvedComplaintsCSV
);

export default router;
