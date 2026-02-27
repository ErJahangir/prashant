// Firestore-backed client API (frontend)
import { getFirestore } from "@/lib/firebase-client";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query as q,
  where,
  orderBy,
  limit as limitFn,
  addDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";

const db = getFirestore();


export async function fetchWishes(uid, { limit = 50, offset = 0 } = {}) {
  if (!uid) return { success: false, error: "Missing uid" };

  const col = collection(db, "wishes");
  const qq = q(col, where("invitation_uid", "==", uid));

  const snap = await getDocs(qq);
  let data = snap.docs.map((d) => {
    const src = d.data();
    const created = src.created_at && src.created_at.toDate ? src.created_at.toDate() : new Date(src.created_at);
    return {
      id: d.id,
      name: src.name,
      message: src.message,
      attendance: src.attendance,
      created_at: created.toISOString(), // Return ISO string
    };
  });

  // Sort in JavaScript instead of Firestore (avoids composite index requirement)
  data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  // Apply limit and offset
  if (offset) data = data.slice(offset);
  if (limit) data = data.slice(0, limit);

  return { success: true, data };
}

export async function createWish(uid, wishData) {
  if (!uid) throw new Error("Missing uid");
  const col = collection(db, "wishes");

  // check duplicate
  const dupQ = q(col, where("invitation_uid", "==", uid), where("name", "==", wishData.name));
  const dupSnap = await getDocs(dupQ);
  if (dupSnap.size > 0) {
    const err = new Error("You have already submitted a wish. Each guest can only send one wish.");
    err.code = "DUPLICATE_WISH";
    throw err;
  }

  const ref = await addDoc(col, {
    invitation_uid: uid,
    name: wishData.name,
    message: wishData.message,
    attendance: wishData.attendance,
    created_at: serverTimestamp(),
  });

  const createdDoc = await getDoc(ref);
  const src = createdDoc.data();
  const created = src.created_at && src.created_at.toDate ? src.created_at.toDate() : new Date(src.created_at);

  return {
    success: true,
    data: {
      id: createdDoc.id,
      name: src.name,
      message: src.message,
      attendance: src.attendance,
      created_at: created.toISOString(), // Return ISO string
    },
  };
}

export async function checkWishSubmitted(uid, name) {
  if (!uid || !name) return { success: true, hasSubmitted: false };
  const col = collection(db, "wishes");
  const snap = await getDocs(q(col, where("invitation_uid", "==", uid), where("name", "==", name)));
  return { success: true, hasSubmitted: snap.size > 0 };
}

export async function deleteWish(uid, wishId) {
  if (!wishId) return { success: false, error: "Missing id" };
  const docRef = doc(db, "wishes", wishId);
  const existing = await getDoc(docRef);
  if (!existing.exists()) return { success: false, error: "Wish not found" };
  const src = existing.data();
  if (src.invitation_uid !== uid) return { success: false, error: "Wish not found" };
  await deleteDoc(docRef);
  return { success: true };
}

// ======================================================
// Export CSV
// ======================================================

export async function downloadWishesExport(uid) {
  const col = collection(db, "wishes");
  const qq = q(col, where("invitation_uid", "==", uid));
  const snap = await getDocs(qq);

  // Sort in JavaScript instead of Firestore (avoids composite index requirement)
  const sortedDocs = snap.docs.sort((a, b) => {
    const aTime = a.data().created_at?.toMillis?.() || new Date(a.data().created_at).getTime();
    const bTime = b.data().created_at?.toMillis?.() || new Date(b.data().created_at).getTime();
    return aTime - bTime;
  });

  const escapeCsv = (val) => {
    if (val == null) return "";
    const s = String(val);
    if (s.includes(",") || s.includes('"') || s.includes("\n")) {
      return `"${s.replace(/"/g, '""')}"`;
    }
    return s;
  };

  const formatDate = (d) => {
    if (!d) return "";
    const date = d && d.toDate ? d.toDate() : new Date(d);
    return date.toISOString().replace("T", " ").slice(0, 19);
  };

  const header = "Name,Message,Attendance,Date";
  const rows = sortedDocs.map((doc) => {
    const r = doc.data();
    return `${escapeCsv(r.name)},${escapeCsv(r.message)},${escapeCsv(r.attendance)},${escapeCsv(formatDate(r.created_at))}`;
  });
  const csv = [header, ...rows].join("\n");
  const bom = "\uFEFF";
  const body = bom + csv;

  const blob = new Blob([body], { type: "text/csv; charset=utf-8" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `wishes-${uid}.csv`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(link.href);
}

// ======================================================
// Stats
// ======================================================

export async function fetchAttendanceStats(uid) {
  const col = collection(db, "wishes");
  const snap = await getDocs(q(col, where("invitation_uid", "==", uid)));
  const counts = { attending: 0, not_attending: 0, maybe: 0, total: snap.size };
  snap.docs.forEach((d) => {
    const a = d.data().attendance;
    if (a === "ATTENDING") counts.attending += 1;
    else if (a === "NOT_ATTENDING") counts.not_attending += 1;
    else if (a === "MAYBE") counts.maybe += 1;
  });
  return { success: true, data: counts };
}

// ======================================================
// Invitation
// ======================================================

export async function fetchInvitation(uid) {
  try {
    const snap = await Promise.race([
      getDoc(doc(db, "invitations", uid)),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Request timeout")), 12000)
      ),
    ]);

    if (!snap.exists()) {
      return { success: false, error: "Invitation not found" };
    }

    return { success: true, data: snap.data() };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

