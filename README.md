# Opord-Staff-System
The Opord Staff System is a mobile-responsive web application designed for Army Staff Officers (S1-S9) to accelerate the Military Decision-Making Process (MDMP). It uses a custom Doctrinal Logic Engine to parse OPORDs and generate staff-specific annexes, logistics projections, and signal PACE plans.

Part 1: The "Simple Scout" Guide (For the Team)
Imagine this app is like a specialized multi-tool, like a Swiss Army Knife, but for planning a mission.

How to Get In
The Secret Address: You don’t need to download anything from an App Store. Just open your web browser (Chrome or Edge) and type in the local address: localhost:3000.

The Home Base: This lives on your Computer’s Desktop (or the TOC Server). Think of it like a local radio station—you have to be in the "range" of the computer running it to see it.

How to Use It
Step 1: Feed the Bot. Click the "Choose File" button and give it your OPORD (the big mission plan).

Step 2: Pick Your Specialist. Click on a button like S4 (Supply) or S6 (Radio). It’s like calling that officer into your tent.

Step 3: Press "Activate". The bot reads the plan and does all the hard math for you—counting bullets, figuring out radio channels, and spotting dangers.

Step 4: Print the Map. Click the Printer Icon to get a clean paper copy to hand to the Commander.

Part 2: The "Master Architect" Guide (For Advanced Users)
For the users who want to add new "Staff Bots" or change how the math works.

The Folder Structure
The application is built using Next.js and TypeScript. To find the "guts," look in these two places:

The Logic Room (/app/api/mdmp/process/route.ts): This is where the math happens.

The Control Panel (/app/page.tsx): This is where the buttons and colors live.

How to Add a New Feature (e.g., An "S3 Air" Bot)
If you want to add a new section, follow these three steps:

1. Update the Brain (The API)
Open route.ts and add a new "case" to the logic switch:

TypeScript
case 'S3_AIR':
  return `[ANNEX D: AVIATION]
- LZ/PZ: Picked up from ${grids[0]} 
- ASSETS: 2x UH-60 requested for H-Hour lift.`;
2. Update the UI (The Page)
Open page.tsx and add your new bot name to the button list:

TypeScript
{["S1", "S2", "S3", "S3_AIR", "S4", ...].map(s => ( ... ))}
3. Change the Look
If you want the "Air Bot" to be a different color (like Sky Blue), add it to the botStyles object:

TypeScript
const botStyles = {
  S3_AIR: "text-sky-400 border-l-sky-500",
  // ... rest of the colors
};
Deployment & Hosting
Current Location: Currently, the app runs on your local machine using the command npm run dev.

Moving to the "Cloud": If you want the whole Battalion to access it from their own laptops, you would "Deploy" it to a service like Vercel or an internal Army server (using Docker). Once deployed, the address would change from localhost to something like https://pinckney-staff-system.army.mil.
