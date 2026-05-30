// Extension: wellbeing
// A passive reminder that nudges you to step back, breathe, hydrate, and stretch
// after you've been heads-down for a while. No tools, no model turns — it just
// prints a gentle note to the timeline when you've been idle.

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

const BODY = [
    "Take one slow breath in, and a longer one out.",
    "Unclench your jaw and drop your shoulders.",
    "When did you last drink some water? Maybe now's the time.",
    "Stand up, reach for the ceiling, and roll your shoulders back.",
    "Look at something 20 feet away for 20 seconds — your eyes will thank you.",
    "Reset your posture: feet flat, back tall, screen at eye level.",
    "Step away for five minutes; you'll come back sharper.",
];

const CLOSERS = [
    "There's a whole life beyond the terminal — it'll still be here when you return.",
    "The boxes will keep running while you take care of you.",
    "Small pauses are how good work stays good.",
    "You're doing great. Be kind to yourself.",
    "Future-you, well-rested, says thanks.",
];

function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function buildCheckin() {
    return [pick(OPENERS), pick(BODY), pick(CLOSERS)].join(" ");
}

const session = await joinSession({});

await session.log("wellbeing extension loaded — gentle idle reminders are on");

// --- Self-scheduling idle nudges -------------------------------------------
// The extension runs its own timer. `session.log` prints straight to the
// timeline with NO model turn (no cost, no interruption). We only nudge after a
// stretch of inactivity so it never talks over you mid-task. Configure the
// cadence with WELLBEING_INTERVAL_MIN (default 60).
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
    await session.log(`🌿 ${buildCheckin()}`);
}, Math.min(intervalMs, 60_000));
// Don't let the timer alone keep the process alive; the CLI owns the lifecycle.
timer.unref?.();

session.on("session.shutdown", () => clearInterval(timer));
