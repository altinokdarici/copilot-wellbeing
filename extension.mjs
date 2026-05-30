// Extension: wellbeing
// A wellbeing check-in tool: warm nudges to step back, breathe, hydrate, and stretch.

import { joinSession } from "@github/copilot-sdk/extension";

// A small library of warm, varied check-in fragments. We assemble 2-3 of these
// at random so the nudge feels fresh every time rather than canned.
const OPENERS = [
    "Hey — quick step back from the terminal.",
    "Pause for a second; the code can wait.",
    "Time for a tiny reset.",
    "Checking in on the human behind the keyboard.",
    "Breathe — you've earned a moment.",
    "A gentle nudge from your future, less-stiff self.",
];

const BODY = {
    breathe: [
        "Take one slow breath in, and a longer one out.",
        "Unclench your jaw and drop your shoulders.",
        "Three deep breaths — in through the nose, out slowly.",
    ],
    hydrate: [
        "When did you last drink some water? Maybe now's the time.",
        "Refill that glass — your brain runs on hydration.",
        "Grab some water before the next deep dive.",
    ],
    stretch: [
        "Stand up, reach for the ceiling, and roll your shoulders back.",
        "Give your wrists and neck a slow stretch.",
        "A quick walk to the window resets more than you'd think.",
    ],
    eyes: [
        "Look at something 20 feet away for 20 seconds — your eyes will thank you.",
        "Blink, soften your gaze, and let your eyes rest off-screen for a moment.",
    ],
    posture: [
        "Reset your posture: feet flat, back tall, screen at eye level.",
        "Notice how you're sitting — ease back into a comfortable, upright position.",
    ],
    break: [
        "Maybe this is a good spot to take a real break.",
        "Step away for five minutes; you'll come back sharper.",
    ],
};

const CLOSERS = [
    "There's a whole life beyond the terminal — it'll still be here when you return.",
    "The boxes will keep running while you take care of you.",
    "Small pauses are how good work stays good.",
    "You're doing great. Be kind to yourself.",
    "Future-you, well-rested, says thanks.",
];

const FOCI = Object.keys(BODY);

function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function buildCheckin(focus) {
    const key = focus && focus !== "random" && BODY[focus] ? focus : pick(FOCI);
    return [pick(OPENERS), pick(BODY[key]), pick(CLOSERS)].join(" ");
}

const session = await joinSession({
    tools: [
        {
            name: "wellbeing_checkin",
            description:
                "Return a short, warm, varied wellbeing check-in (2-3 sentences) nudging the user " +
                "to step back, breathe, hydrate, stretch, rest their eyes, or fix their posture. " +
                "Use when the user asks for a wellbeing nudge, a 'how is life' reminder, or a break prompt.",
            parameters: {
                type: "object",
                properties: {
                    focus: {
                        type: "string",
                        description: "Optional area to emphasize; defaults to a random pick.",
                        enum: [...FOCI, "random"],
                    },
                },
            },
            // No side effects — just returns text, so don't prompt the user for permission.
            skipPermission: true,
            handler: async (args) => buildCheckin(args?.focus),
        },
    ],
});

await session.log("wellbeing extension loaded — call wellbeing_checkin for a warm nudge");

// --- Self-scheduling idle nudges -------------------------------------------
// Instead of relying on the CLI's /schedule, the extension runs its own timer.
// `session.log` prints straight to the timeline with NO model turn (no cost, no
// interruption). We only nudge after a stretch of inactivity so it never talks
// over you mid-task. Configure the cadence with WELLBEING_INTERVAL_MIN (default 60).
const intervalMin = Math.max(1, Number(process.env.WELLBEING_INTERVAL_MIN ?? 60));
const intervalMs = intervalMin * 60_000;

let lastActivityAt = Date.now();
const bump = () => {
    lastActivityAt = Date.now();
};
session.on("user.message", bump);
session.on("assistant.message", bump);

// Check frequently, but only emit once a full idle interval has elapsed.
const timer = setInterval(async () => {
    if (Date.now() - lastActivityAt < intervalMs) {
        return; // you've been active recently — stay quiet
    }
    lastActivityAt = Date.now();
    await session.log(`🌿 ${buildCheckin("random")}`);
}, Math.min(intervalMs, 60_000));
// Don't let the timer alone keep the process alive; the CLI owns the lifecycle.
timer.unref?.();

session.on("session.shutdown", () => clearInterval(timer));
