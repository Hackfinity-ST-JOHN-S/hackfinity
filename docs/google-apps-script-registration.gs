/**
 * Hackfinity 2026 registration receiver
 *
 * Bind this script to the organizer's Google Sheet. It writes validated
 * registrations to the "Registrations" tab.
 */
const REGISTRATION_SHEET_NAME = "Registrations";
const HACKFINITY_CONFIRMATION_URL = "https://hackfinity-st-john-s.github.io/hackfinity/registration-confirmation.html";
const CONFIRMATION_CACHE_SECONDS = 600;
const CATEGORY_CAPACITY = 40;
const REGISTRATION_HEADERS = [
  "Registration ID",
  "Submitted On",
  "Lead / Participant Name",
  "Email Address",
  "Student Contact",
  "Class / Grade",
  "School / Institution",
  "District / City",
  "Parent / Guardian Name",
  "Guardian Contact",
  "Team Name",
  "Team Size",
  "Registration Role",
  "Challenge Category",
  "Focus Areas",
  "Project Interest",
  "Consent Received",
  "Team Member Details",
  "Review Status",
  "Organiser Notes",
];

const REVIEW_STATUSES = ["New", "Under Review", "Shortlisted", "Contacted", "Complete"];
const REGISTRATION_COLUMN_WIDTHS = [150, 160, 190, 220, 145, 115, 220, 145, 190, 155, 175, 105, 145, 200, 230, 280, 125, 320, 135, 240];

const VALID_CATEGORIES = new Set([
  "Awareness Challenge",
  "Prevention Challenge",
  "Recovery & Rehabilitation Challenge",
  "Innovation Challenge",
]);

const VALID_SKILLS = new Set([
  "Artificial Intelligence",
  "Robotics",
  "Engineering",
  "Biotechnology",
  "Design Thinking",
  "Digital Technologies",
  "Entrepreneurship",
]);

function doGet(event) {
  if (String(event?.parameter?.availability || "") === "1") {
    return jsonResponse({ ok: true, capacity: CATEGORY_CAPACITY, categories: getCategoryAvailability() });
  }
  const nonce = String(event?.parameter?.confirmationNonce || "");
  if (nonce) {
    const result = CacheService.getScriptCache().get(confirmationCacheKey(nonce));
    return jsonResponse(result ? JSON.parse(result) : { source: "hackfinity-registration", nonce, pending: true });
  }
  return jsonResponse({ ok: true, service: "Hackfinity registration receiver" });
}

function getCategoryAvailability() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(REGISTRATION_SHEET_NAME);
  const registeredSchools = Object.fromEntries(Array.from(VALID_CATEGORIES, (category) => [category, new Set()]));
  if (!sheet || sheet.getLastRow() < 2) {
    return Object.fromEntries(Array.from(VALID_CATEGORIES, (category) => [category, { registeredSchools: 0, remaining: CATEGORY_CAPACITY }]));
  }

  const categoryColumn = REGISTRATION_HEADERS.indexOf("Challenge Category");
  const schoolColumn = REGISTRATION_HEADERS.indexOf("School / Institution");
  sheet.getRange(2, 1, sheet.getLastRow() - 1, REGISTRATION_HEADERS.length).getValues().forEach((row) => {
    const category = String(row[categoryColumn] || "").trim();
    const school = normalizeSchool(row[schoolColumn]);
    if (Object.prototype.hasOwnProperty.call(registeredSchools, category) && school) registeredSchools[category].add(school);
  });

  return Object.fromEntries(Array.from(VALID_CATEGORIES, (category) => {
    const count = registeredSchools[category].size;
    return [category, { registeredSchools: count, remaining: Math.max(0, CATEGORY_CAPACITY - count) }];
  }));
}

function normalizeSchool(value) {
  return String(value || "").trim().replace(/\s+/g, " ").toLowerCase();
}

function doPost(event) {
  let payload = {};
  try {
    payload = getPayload(event);

    // Quietly reject automated submissions that fill the hidden honeypot field.
    if (String(payload.website || "").trim()) {
      cacheConfirmation(payload, true);
      return confirmationResponse(payload, true);
    }

    const registration = validateRegistration(payload);
    const lock = LockService.getScriptLock();
    lock.waitLock(10000);

    try {
      const sheet = getRegistrationSheet();
      sheet.appendRow([
        Utilities.getUuid(),
        new Date(),
        registration.name,
        registration.email,
        registration.phone,
        registration.grade,
        registration.school,
        registration.district,
        registration.guardianName,
        registration.guardianPhone,
        registration.team,
        registration.teamSize,
        registration.registrationRole,
        registration.category,
        registration.skills.join(" • "),
        registration.projectInterest,
        "Yes",
        formatTeamMembers(registration.teamMembers),
        "New",
        "",
      ]);
      cacheConfirmation(payload, true);
    } finally {
      lock.releaseLock();
    }

    return confirmationResponse(payload, true);
  } catch (error) {
    console.error(error);
    cacheConfirmation(payload, false);
    return confirmationResponse(payload, false);
  }
}

function getPayload(event) {
  if (event?.parameter?.payload) return JSON.parse(event.parameter.payload);
  return JSON.parse(event?.postData?.contents || "{}");
}

function getRegistrationSheet() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(REGISTRATION_SHEET_NAME);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(REGISTRATION_SHEET_NAME);
  }

  const hasExpectedHeaders = sheet.getLastRow() > 0
    && REGISTRATION_HEADERS.every((header, index) => sheet.getRange(1, index + 1).getDisplayValue() === header);
  if (!hasExpectedHeaders) {
    sheet.getRange(1, 1, 1, REGISTRATION_HEADERS.length).setValues([REGISTRATION_HEADERS]);
    applyRegistrationSheetFormat(sheet);
  }

  return sheet;
}

function formatRegistrationSheet() {
  applyRegistrationSheetFormat(getRegistrationSheet());
}

function applyRegistrationSheetFormat(sheet) {
  const columnCount = REGISTRATION_HEADERS.length;
  const maximumRows = Math.max(sheet.getMaxRows(), 2);
  const headerRange = sheet.getRange(1, 1, 1, columnCount);

  headerRange
    .setBackground("#8B1E2D")
    .setFontColor("#FFFFFF")
    .setFontWeight("bold")
    .setFontSize(10)
    .setHorizontalAlignment("center")
    .setVerticalAlignment("middle")
    .setWrapStrategy(SpreadsheetApp.WrapStrategy.WRAP);
  sheet.setFrozenRows(1);
  sheet.setFrozenColumns(2);
  sheet.setRowHeight(1, 40);
  sheet.setTabColor("#8B1E2D");

  REGISTRATION_COLUMN_WIDTHS.forEach((width, index) => sheet.setColumnWidth(index + 1, width));
  sheet.getRange(2, 1, maximumRows - 1, columnCount)
    .setVerticalAlignment("middle")
    .setWrapStrategy(SpreadsheetApp.WrapStrategy.WRAP)
    .setFontSize(10);
  sheet.getRange(2, 2, maximumRows - 1, 1).setNumberFormat("dd mmm yyyy, hh:mm");
  sheet.getRange(2, 19, maximumRows - 1, 1).setDataValidation(
    SpreadsheetApp.newDataValidation().requireValueInList(REVIEW_STATUSES, true).setAllowInvalid(false).build(),
  );

  const filter = sheet.getFilter();
  if (!filter) sheet.getRange(1, 1, maximumRows, columnCount).createFilter();
}

function validateRegistration(payload) {
  const name = text(payload.name, 2, 80, "full name");
  const email = text(payload.email, 3, 160, "email address").toLowerCase();
  const phone = phoneNumber(payload.phone, "student contact");
  const grade = text(payload.grade, 1, 30, "class or grade");
  const school = text(payload.school, 2, 120, "school name");
  const district = text(payload.district, 2, 80, "district or city");
  const guardianName = text(payload.guardianName, 2, 80, "parent or guardian name");
  const guardianPhone = phoneNumber(payload.guardianPhone, "parent or guardian contact");
  const team = optionalText(payload.team, 80);
  const teamSize = String(payload.teamSize || "");
  const registrationRole = String(payload.registrationRole || "");
  const category = String(payload.category || "");
  const skills = Array.isArray(payload.skills) ? payload.skills.map((skill) => String(skill)) : [];
  const projectInterest = optionalText(payload.projectInterest, 500);
  const teamMembers = Array.isArray(payload.teamMembers) ? payload.teamMembers : [];

  if (!/^\S+@\S+\.\S+$/.test(email)) throw new Error("Invalid email address.");
  if (!/^[1-6]$/.test(teamSize)) throw new Error("Invalid team size.");
  if (!["Individual Participant", "Team Lead", "Team Member"].includes(registrationRole)) throw new Error("Invalid registration role.");
  if (!VALID_CATEGORIES.has(category)) throw new Error("Invalid challenge category.");
  if (!skills.length || skills.some((skill) => !VALID_SKILLS.has(skill))) throw new Error("Invalid areas to explore.");
  if (teamMembers.length !== Number(teamSize) - 1) throw new Error("Missing team member details.");
  if (payload.consent !== true) throw new Error("Consent is required.");

  return {
    name,
    email: safeForSheet(email),
    phone,
    grade,
    school,
    district,
    guardianName,
    guardianPhone,
    team,
    teamSize,
    registrationRole,
    category,
    skills: skills.map(safeForSheet),
    projectInterest,
    teamMembers: teamMembers.map((member, index) => validateTeamMember(member, index)),
  };
}

function validateTeamMember(member, index) {
  if (!member || typeof member !== "object") throw new Error(`Invalid team member ${index + 2}.`);
  const name = text(member.name, 2, 80, `team member ${index + 2} name`);
  const email = text(member.email, 3, 160, `team member ${index + 2} email`).toLowerCase();
  const phone = phoneNumber(member.phone, `team member ${index + 2} contact`);
  const grade = text(member.grade, 1, 30, `team member ${index + 2} class or grade`);

  if (!/^\S+@\S+\.\S+$/.test(email)) throw new Error(`Invalid team member ${index + 2} email.`);
  return { name, email: safeForSheet(email), phone, grade };
}

function formatTeamMembers(teamMembers) {
  if (!teamMembers.length) return "Individual registration";
  return teamMembers.map((member, index) => `Member ${index + 2}: ${member.name}\nClass / Grade: ${member.grade}\nContact: ${member.phone}\nEmail: ${member.email}`).join("\n\n");
}

function text(value, minimum, maximum, field) {
  const result = String(value || "").trim();
  if (result.length < minimum || result.length > maximum) throw new Error(`Invalid ${field}.`);
  return safeForSheet(result);
}

function optionalText(value, maximum) {
  const result = String(value || "").trim();
  if (result.length > maximum) throw new Error("Text is too long.");
  return safeForSheet(result);
}

function phoneNumber(value, field) {
  const result = String(value || "").trim();
  if (!/^[0-9+\-()\s]{8,20}$/.test(result)) throw new Error(`Invalid ${field}.`);
  return safeForSheet(result);
}

function safeForSheet(value) {
  return /^[=+\-@]/.test(value) ? `'${value}` : value;
}

function jsonResponse(body) {
  return ContentService.createTextOutput(JSON.stringify(body)).setMimeType(ContentService.MimeType.JSON);
}

function confirmationResponse(payload, ok) {
  const message = { source: "hackfinity-registration", nonce: String(payload?.nonce || ""), ok: Boolean(ok) };
  const confirmationUrl = `${HACKFINITY_CONFIRMATION_URL}?nonce=${encodeURIComponent(message.nonce)}&ok=${message.ok ? "1" : "0"}`;
  return HtmlService.createHtmlOutput(`<script>window.location.replace(${JSON.stringify(confirmationUrl)});</script><meta http-equiv="refresh" content="0; url=${confirmationUrl}">`)
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function confirmationCacheKey(nonce) {
  return `hackfinity-registration:${String(nonce || "")}`;
}

function cacheConfirmation(payload, ok) {
  const nonce = String(payload?.nonce || "");
  if (!nonce) return;
  CacheService.getScriptCache().put(
    confirmationCacheKey(nonce),
    JSON.stringify({ source: "hackfinity-registration", nonce, ok: Boolean(ok) }),
    CONFIRMATION_CACHE_SECONDS,
  );
}
