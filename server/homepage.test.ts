import { describe, expect, it } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import Home from "../client/src/pages/Home";

describe("TOOFAN homepage", () => {
  it("renders the essential event details and primary navigation", () => {
    const page = renderToStaticMarkup(createElement(Home));

    expect(page).toContain("HACKFINITY");
    expect(page).toContain("TOOFAN");
    expect(page).not.toContain("TOOFAN THEME");
    expect(page).toContain("ABOUT HACKFINITY 2026");
    expect(page).toContain("TOOFAN – The Narco Hunt");
    expect(page).toContain("30-day innovation challenge");
    expect(page).toContain("more than 60 schools across South India");
    expect(page).toContain("₹10,000 each");
    expect(page).toContain("Artificial Intelligence");
    expect(page).toContain("31 OCT 2026");
    expect(page).toContain("ST. JOHN&#x27;S SCHOOL, ANCHAL");
    expect(page).toContain("The Storm");
    expect(page).toContain("Experience");
    expect(page).toContain("Venue");
    expect(page).toContain("Register");
    expect(page).toContain("FOUR CHALLENGES");
    expect(page).toContain("Awareness Challenge");
    expect(page).toContain("Prevention Challenge");
    expect(page).toContain("Recovery &amp; Rehabilitation");
    expect(page).toContain("Innovation Challenge");
    expect(page).toContain("AI Awareness Chatbot");
    expect(page).toContain("Smart School Safety Dashboard");
    expect(page).toContain("AI Recovery Companion");
    expect(page).toContain("Smart Wellness Wearables");
  });

  it("presents host and partner identity while accurately describing the live Sheets registration state", () => {
    const page = renderToStaticMarkup(createElement(Home));

    expect(page).toContain("OFFICIAL HOST");
    expect(page).toContain("POWERED BY");
    expect(page).toContain("HOWNWHY");
    expect(page).toContain('/assets/st-johns-school.jpg');
    expect(page).toContain('school-host-mark');
    expect(page).toContain('school-host-crest');
    expect(page).toContain('/assets/st-johns-school-official-crest.jpg');
    expect(page).toContain('nav-toofan-logo');
    expect(page).toContain('/assets/toofan-the-narco-hunt-logo.png');
    expect(page).toContain("30 DAYS · 4 CHALLENGES");
    expect(page).toContain("COUNTDOWN TO EVENT DAY");
    expect(page).toContain("REGISTRATION SYSTEM: LIVE");
    expect(page).toContain("are sent to the organiser&#x27;s registration sheet.");
    expect(page).toContain("Submit my application");
    expect(page).toContain("PARENT / GUARDIAN CONTACT");
    expect(page).toContain("PREFERRED CHALLENGE CATEGORY");
    expect(page).toContain("AREAS YOU WANT TO EXPLORE");
    expect(page).toContain("TEAM SIZE");
  });
});
