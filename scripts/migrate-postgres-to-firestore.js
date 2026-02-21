#!/usr/bin/env node
/**
 * Migration script: Postgres -> Firestore
 * Usage:
 *   FIREBASE_SERVICE_ACCOUNT='...json...' DATABASE_URL='postgresql://...' node scripts/migrate-postgres-to-firestore.js
 */

import { URL } from "url";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
    // init firebase-admin
    const admin = (await import("firebase-admin")).default;

    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
        const sa = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
        admin.initializeApp({ credential: admin.credential.cert(sa) });
    } else {
        admin.initializeApp();
    }

    const db = admin.firestore();

    // connect to Postgres
    const { Pool } = (await import("pg")).default || (await import("pg"));
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
        console.error("Please set DATABASE_URL environment variable for Postgres connection.");
        process.exit(1);
    }

    const pool = new Pool({ connectionString });

    try {
        console.log("Fetching invitations...");
        const invRes = await pool.query("SELECT * FROM invitations");
        console.log(`Found ${invRes.rows.length} invitations`);

        // batch write invitations
        let batch = db.batch();
        let ops = 0;
        for (const inv of invRes.rows) {
            const docRef = db.collection("invitations").doc(inv.uid);
            const payload = { ...inv };
            // preserve original column names but convert Buffer/json types to JS objects if necessary
            batch.set(docRef, payload);
            ops++;
            if (ops >= 450) {
                await batch.commit();
                batch = db.batch();
                ops = 0;
            }
        }
        if (ops > 0) await batch.commit();

        // Migrate agenda
        console.log("Fetching agenda items...");
        const agendaRes = await pool.query("SELECT * FROM agenda");
        console.log(`Found ${agendaRes.rows.length} agenda items`);
        batch = db.batch();
        ops = 0;
        for (const a of agendaRes.rows) {
            const id = a.id ? String(a.id) : db.collection("agenda").doc().id;
            const docRef = db.collection("agenda").doc(id);
            batch.set(docRef, { ...a });
            ops++;
            if (ops >= 450) { await batch.commit(); batch = db.batch(); ops = 0; }
        }
        if (ops > 0) await batch.commit();

        // Migrate banks
        console.log("Fetching banks...");
        const banksRes = await pool.query("SELECT * FROM banks");
        console.log(`Found ${banksRes.rows.length} bank records`);
        batch = db.batch(); ops = 0;
        for (const b of banksRes.rows) {
            const id = b.id ? String(b.id) : db.collection("banks").doc().id;
            const docRef = db.collection("banks").doc(id);
            batch.set(docRef, { ...b });
            ops++;
            if (ops >= 450) { await batch.commit(); batch = db.batch(); ops = 0; }
        }
        if (ops > 0) await batch.commit();

        // Migrate wishes
        console.log("Fetching wishes...");
        const wishesRes = await pool.query("SELECT * FROM wishes");
        console.log(`Found ${wishesRes.rows.length} wishes`);
        batch = db.batch(); ops = 0;
        for (const w of wishesRes.rows) {
            const id = w.id ? String(w.id) : db.collection("wishes").doc().id;
            const docRef = db.collection("wishes").doc(id);

            const payload = { ...w };
            // convert created_at to Firestore Timestamp if present
            if (payload.created_at) {
                payload.created_at = admin.firestore.Timestamp.fromDate(new Date(payload.created_at));
            }

            batch.set(docRef, payload);
            ops++;
            if (ops >= 450) { await batch.commit(); batch = db.batch(); ops = 0; }
        }
        if (ops > 0) await batch.commit();

        console.log("Migration completed successfully.");
    } catch (err) {
        console.error("Migration failed:", err);
    } finally {
        await pool.end();
        process.exit(0);
    }
}

main().catch((err) => { console.error(err); process.exit(1); });
