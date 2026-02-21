#!/usr/bin/env node
/**
 * Firestore seeder – adds test invitation data for development
 * Usage:
 *   FIREBASE_SERVICE_ACCOUNT='...json...' node scripts/seed-firestore.js
 */

async function main() {
    // Initialize firebase-admin
    const admin = (await import("firebase-admin")).default;
    const fs = await import("fs");
    const path = await import("path");

    const projectId = process.env.FIREBASE_PROJECT_ID || "prashant-sujata";

    let credential;

    // Try to load from file path first
    if (process.env.FIREBASE_SERVICE_ACCOUNT_PATH) {
        const keyPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
        const keyFile = JSON.parse(
            fs.default.readFileSync(keyPath, "utf-8")
        );
        credential = admin.credential.cert(keyFile);
    } else if (process.env.FIREBASE_SERVICE_ACCOUNT) {
        // Try to load from JSON string
        const sa = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
        credential = admin.credential.cert(sa);
    } else {
        console.error(
            "❌ No Firebase credentials found. Please set one of:"
        );
        console.error("   - FIREBASE_SERVICE_ACCOUNT_PATH=/path/to/serviceAccountKey.json");
        console.error(
            "   - FIREBASE_SERVICE_ACCOUNT='{...json string...}'"
        );
        process.exit(1);
    }

    admin.initializeApp({ credential, projectId });

    const db = admin.firestore();

    try {
        console.log("Seeding Firestore with test invitation data...");

        // Create test invitation document
        const invitationId = "prashant-sujata-2025";
        const invitationData = {
            uid: invitationId,
            title: "Prashant & Sujata",
            description: "With joyful hearts, we invite you to celebrate the wedding of Prashant & Sujata.",
            groom_name: "Prashant",
            bride_name: "Sujata",
            parent_groom: "Mr Groom & Mrs Groom",
            parent_bride: "Mr Bride & Mrs Bride",
            wedding_date: "2025-06-19",
            time: "To be announced",
            location: "Venue to be announced",
            address: "Address to be announced",
            maps_url: "https://goo.gl/maps/example",
            maps_embed: "https://www.google.com/maps/embed?pb=example",
            og_image: "/images/og-image.jpg",
            favicon: "/images/favicon.ico",
            audio: {
                src: "/audio/fulfilling-humming.mp3",
                title: "Fulfilling Humming",
                autoplay: true,
                loop: true,
            },
            agenda: [
                {
                    title: "Ceremony",
                    date: "2025-06-19",
                    start_time: "10:00 AM",
                    end_time: "11:30 AM",
                    location: "Main Hall",
                    address: "123 Wedding Street",
                },
                {
                    title: "Reception",
                    date: "2025-06-19",
                    start_time: "12:00 PM",
                    end_time: "6:00 PM",
                    location: "Banquet Hall",
                    address: "123 Wedding Street",
                },
            ],
            banks: [
                {
                    bank: "Example Bank",
                    account_number: "1234567890",
                    account_name: "Prashant & Sujata Wedding",
                },
            ],
        };

        // Write invitation
        await db.collection("invitations").doc(invitationId).set(invitationData);
        console.log(`✓ Created invitation: ${invitationId}`);

        // Add sample wishes
        const wishesData = [
            { name: "John Doe", message: "Wishing you both a lifetime of happiness!", attendance: "ATTENDING" },
            { name: "Jane Smith", message: "Congratulations on your wedding!", attendance: "ATTENDING" },
            { name: "Bob Johnson", message: "May your love grow stronger every day!", attendance: "MAYBE" },
        ];

        for (const wish of wishesData) {
            await db.collection("wishes").add({
                invitation_uid: invitationId,
                name: wish.name,
                message: wish.message,
                attendance: wish.attendance,
                created_at: admin.firestore.FieldValue.serverTimestamp(),
            });
        }
        console.log(`✓ Added ${wishesData.length} sample wishes`);

        console.log("\n✅ Firestore seeding complete!");
        console.log(`\nVisit the app at: http://localhost:5173/invitation/${invitationId}`);
    } catch (err) {
        console.error("Seeding failed:", err);
        process.exit(1);
    } finally {
        process.exit(0);
    }
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
