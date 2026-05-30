// Extension: wellbeing
// A passive, smart reminder. Instead of a blind timer, it nudges you at a
// natural seam: the moment you finish a chunk of work and start the next thing.
// It only speaks up when the finished chunk was substantial, and it tailors the
// message to context (a long push, a late night, or just a normal hand-off).
// Everything runs via session.log — NO model turns, no interruptions.

import { joinSession } from "@github/copilot-sdk/extension";

// How long you have to be at it before a transition is worth a nudge.
// This is a hard floor on elapsed work time — never nudge sooner (min 60 min).
const MIN_WORK_MIN = Math.max(60, Number(process.env.WELLBEING_MIN_WORK_MIN ?? 60));
// A long, intense push earns a warmer "that was a lot" message.
const BIG_TURNS = Math.max(1, Number(process.env.WELLBEING_MIN_TURNS ?? 16));
const BIG_WORK_MIN = MIN_WORK_MIN * 2;

function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

const NORMAL = [
    "Nice — that's a wrap on that piece. Take a breath before the next one.",
    "One thing done, another about to begin. Roll your shoulders back first.",
    "Good hand-off point. Grab some water before you dive back in.",
    "That chunk's behind you. A slow breath here makes the next bit sharper.",
    "Before the next task: unclench your jaw, drop your shoulders, reset.",
];

const BIG_PUSH = [
    "That was a solid stretch of work — genuinely. Stand up, stretch tall, and step away for five.",
    "You just pushed through a lot. Your eyes and shoulders have earned a real break, not just a breath.",
    "Big chunk done. Walk to the window, look at something far away, let your brain idle a minute.",
    "That was a heavy push. Water, a stretch, and a few minutes off-screen before the next mountain.",
];

const LATE = [
    "It's getting late — this might be a good one to call it a night on.",
    "Late hour. Whatever's next will be easier after some sleep.",
    "The terminal will keep till morning. Consider wrapping up soon.",
    "It's late — be kind to tomorrow-you and think about heading to bed.",
];

function isLate() {
    const h = new Date().getHours();
    return h >= 23 || h < 5;
}

function buildNudge({ turns, workMin }) {
    if (isLate()) return pick(LATE);
    if (turns >= BIG_TURNS || workMin >= BIG_WORK_MIN) return pick(BIG_PUSH);
    return pick(NORMAL);
}

const session = await joinSession({});

await session.log("wellbeing extension loaded — smart break nudges are on");

// --- Transition-aware nudging ----------------------------------------------
// We accumulate "work" (assistant turns + elapsed time) since the last nudge.
// A new user.message marks a transition — you just finished and are starting
// something new. If the finished chunk was substantial, that's when we nudge.
let assistantTurns = 0;
let workStartedAt = null;

session.on("assistant.message", () => {
    assistantTurns += 1;
    workStartedAt ??= Date.now();
});

session.on("user.message", async () => {
    if (workStartedAt === null) return; // nothing has happened yet
    const workMin = (Date.now() - workStartedAt) / 60_000;
    const substantial = workMin >= MIN_WORK_MIN;

    // Reset for the next chunk regardless — this message starts fresh work.
    const snapshot = { turns: assistantTurns, workMin };
    assistantTurns = 0;
    workStartedAt = null;

    if (substantial) {
        await session.log(`🌿 ${buildNudge(snapshot)}`);
    }
});
