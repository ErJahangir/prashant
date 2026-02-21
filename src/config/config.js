const config = {
  data: {
    // Main invitation title that appears on the page
    title: "Prashant & Sujata",
    // Opening message/description of the invitation
    description:
      "With joyful hearts, we invite you to celebrate the wedding of Prashant & Sujata.",
    // Groom's name
    groomName: "Prashant",
    // Bride's name
    brideName: "Sujata",
    // Groom's parents names
    parentGroom: "Mr Groom & Mrs Groom",
    // Bride's parents names
    parentBride: "Mr Bride & Mrs Bride",
    // Wedding date (format: YYYY-MM-DD) – main event (Phere)
    date: "2025-06-19",
    // Google Maps link for location (short clickable link)
    maps_url: "https://goo.gl/maps/abcdef",
    // Google Maps embed code to display map on website
    maps_embed:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.0000000000005!2d106.8270733147699!3d-6.175392995514422!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f4f1b6d7b1e7%3A0x2e69f4f1b6d7b1e7!2sMonumen%20Nasional!5e0!3m2!1sid!2sid!4v1633666820004!5m2!1sid!2sid",
    // Event time (free format) – update when venue is set
    time: "To be announced",
    // Venue/building name
    location: "Venue to be announced",
    // Full address of the wedding venue
    address: "Address to be announced",
    // Image that appears when link is shared on social media
    ogImage: "/images/og-image.jpg",
    // Icon that appears in browser tab
    favicon: "/images/favicon.ico",
    // List of event agenda/schedule
    agenda: [
      {
        title: "Tilak",
        date: "2025-06-13",
        startTime: "",
        endTime: "",
        location: "Venue to be announced",
        address: "",
      },
      {
        title: "Katha & Matkor",
        date: "2025-06-18",
        startTime: "",
        endTime: "",
        location: "Venue to be announced",
        address: "",
      },
      {
        title: "Wedding (Phere)",
        date: "2025-06-19",
        startTime: "",
        endTime: "",
        location: "Venue to be announced",
        address: "",
      },
      {
        title: "Reception",
        date: "2025-06-21",
        startTime: "",
        endTime: "",
        location: "Venue to be announced",
        address: "",
      },
    ],

    // Background music settings
    audio: {
      // Music file (choose one or replace with your own file)
      src: "/audio/fulfilling-humming.mp3", // or /audio/nature-sound.mp3
      // Music title to display
      title: "Fulfilling Humming", // or Nature Sound
      // Whether music plays automatically when website opens
      autoplay: true,
      // Whether music repeats continuously
      loop: true
    },

    // List of bank accounts for digital envelope/gifts
    banks: [
      {
        bank: "Bank name",
        accountNumber: "Account number",
        accountName: "PRASHANT / SUJATA",
      },
      // Add more bank accounts as needed
    ]
  }
};

export default config;