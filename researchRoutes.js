const express  = require("express");
const router   = express.Router();
const Research = require("../models/Research");
const { createLog } = require('../utils/logger');

// ── CREATE (Mag-add ng bagong IP Asset) ─────────────────────────
router.post("/", async (req, res) => {
  try {
    const research = new Research(req.body);
    await research.save();

    // SUCCESS LOG: Kusa nitong babasahin kung anong module (Patent, Copyright, etc.)
    await createLog({
      user: req.user?.email || "System/Admin",
      action: "Create",
      module: research.category || "Reports", // Gagamitin ang category nito (e.g., Copyright, Patent) para sa dropdown filter mo
      desc: `Registered new IP record: "${research.researchTitle}" (Ref ID: ${research.referenceId || 'N/A'})`,
      ip: req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress,
      severity: "info"
    });

    res.json(research);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── GET ALL ─────────────────────────────────────────
router.get("/", async (req, res) => {
  try {
    const data = await Research.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── GET BY CATEGORY ─────────────────────────────────
router.get("/:category", async (req, res) => {
  try {
    const data = await Research.find({ category: req.params.category }).sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── UPDATE (Mag-edit ng IP Asset Details) ───────────────────────
router.put("/:id", async (req, res) => {
  try {
    const b = req.body;

    // helper: treat empty string / undefined / null all as null
    const strOrNull = (v) => (v && v.toString().trim() !== "" ? v.toString().trim() : null);

    const updateData = {};

    if (b.researchTitle   !== undefined) updateData.researchTitle  = b.researchTitle;
    if (b.referenceId     !== undefined) updateData.referenceId    = b.referenceId;
    if (b.department      !== undefined) updateData.department     = b.department;
    if (b.authors         !== undefined) updateData.authors        = b.authors;
    if (b.status          !== undefined) updateData.status         = b.status;
    if (b.date            !== undefined) updateData.date           = b.date;
    if (b.category        !== undefined) updateData.category       = b.category;
    if (b.googleDriveLink !== undefined) updateData.googleDriveLink = strOrNull(b.googleDriveLink);

    // Always write defect fields explicitly — null means "no defect", string means date
    updateData.defectNoticeDate  = strOrNull(b.defectNoticeDate);
    updateData.defectNoticeDate2 = strOrNull(b.defectNoticeDate2);
    updateData.defectNoticeDate3 = strOrNull(b.defectNoticeDate3);
    updateData.defectNoticeDate4 = strOrNull(b.defectNoticeDate4);
    updateData.defectNoticeDate5 = strOrNull(b.defectNoticeDate5);
    updateData.defectConfirmed  = b.defectConfirmed  === true || b.defectConfirmed  === "true";
    updateData.defectConfirmed2  = b.defectConfirmed2  === true || b.defectConfirmed2  === "true";
    updateData.defectConfirmed3  = b.defectConfirmed3  === true || b.defectConfirmed3  === "true";
    updateData.defectConfirmed4  = b.defectConfirmed4  === true || b.defectConfirmed4  === "true";
    updateData.defectConfirmed5  = b.defectConfirmed5  === true || b.defectConfirmed5  === "true";

    const updated = await Research.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true }
    );

    if (!updated) return res.status(404).json({ error: "Record not found" });

    // SUCCESS LOG: Magpapadala ng warning log para sa pagbabago ng system data
    await createLog({
      user: req.user?.email || "System/Admin",
      action: "Update",
      module: updated.category || "Reports",
      desc: `Updated details for IP record: "${updated.researchTitle}"`,
      ip: req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress,
      severity: "warning" // Orange badge sa admin-logs.html panel mo
    });

    console.log("✅ Saved:", updated._id.toString(), {
      defectNoticeDate:  updated.defectNoticeDate,
      defectNoticeDate2: updated.defectNoticeDate2,
      defectNoticeDate3: updated.defectNoticeDate3,
      defectNoticeDate4: updated.defectNoticeDate4,
      defectNoticeDate5: updated.defectNoticeDate5,
      confirmed: [updated.defectConfirmed, updated.defectConfirmed2, updated.defectConfirmed3, updated.defectConfirmed4, updated.defectConfirmed5]
    });

    res.json(updated);
  } catch (err) {
    console.error("❌ Update error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// ── DELETE (Magbura ng IP Asset) ───────────────────────────
router.delete("/:id", async (req, res) => {
  try {
    const research = await Research.findByIdAndDelete(req.params.id);
    if (!research) return res.status(404).json({ error: "Record not found" });

    // CRITICAL LOG: Kulay PULA dahil permanent deletion ng record!
    await createLog({
      user: req.user?.email || "System/Admin",
      action: "Delete",
      module: research.category || "Reports",
      desc: `Permanently deleted IP record: "${research.researchTitle}" (Ref ID: ${research.referenceId || 'N/A'})`,
      ip: req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress,
      severity: "critical" // Magti-trigger ng pulang alert badge!
    });

    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── PUT: STATUS UPDATE ONLY ─────────────────────────────────
router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    // FIX: Ginawang 'Research' imbes na 'Copyright' para hindi mag-crash ang route mo
    const updated = await Research.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!updated) return res.status(404).json({ message: "Record not found" });

    // SUCCESS LOG: Mag-a-activate ng logs para sa mabilisang status toggles
    await createLog({
      user: req.user?.email || "System/Admin",
      action: "Update",
      module: updated.category || "Reports",
      desc: `Changed status of "${updated.researchTitle}" to: ${status}`,
      ip: req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress,
      severity: "info"
    });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;