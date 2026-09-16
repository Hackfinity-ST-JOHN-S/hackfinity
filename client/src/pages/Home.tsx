import React, { type FormEvent, useEffect, useState } from "react";
import {
  ArrowDown,
  ArrowUpRight,
  Bot,
  CalendarDays,
  Check,
  ChevronDown,
  Compass,
  Earth,
  HeartHandshake,
  Layers3,
  Lightbulb,
  MapPin,
  Menu,
  Send,
  Sparkles,
  Wind,
  X,
  Zap,
} from "lucide-react";
import { registrationCategories, registrationSchema, studentSkillOptions, type RegistrationInput, type TeamMemberInput } from "@shared/registration";
import { matchRegistrationConfirmation } from "@shared/registrationConfirmation";
import { getRegistrationSubmissionState } from "@shared/registrationSubmission";

const eventDetails = {
  date: "31 OCT 2026",
  venue: "ST. JOHN'S SCHOOL, ANCHAL",
};

const officialHeaderCrestUrl = `${import.meta.env.BASE_URL}assets/st-johns-school-official-crest.jpg`;
const toofanNavigationLogoUrl = `${import.meta.env.BASE_URL}assets/toofan-the-narco-hunt-logo.png`;

const navItems = [
  { label: "The Storm", href: "#story" },
  { label: "Experience", href: "#experience" },
  { label: "Challenges", href: "#challenges" },
  { label: "Venue", href: "#venue" },
  { label: "Register", href: "#register" },
];

const impactCards = [
  {
    number: "01",
    icon: <Sparkles aria-hidden="true" />,
    title: "Project development grants",
    description: "The Top 5 winning teams received project development grants of ₹10,000 each.",
  },
  {
    number: "02",
    icon: <Compass aria-hidden="true" />,
    title: "Internship opportunities",
    description: "Selected students were offered internship opportunities with national and international organizations.",
  },
  {
    number: "03",
    icon: <Layers3 aria-hidden="true" />,
    title: "Expert collaboration",
    description: "Students worked alongside industry professionals, researchers, engineers, and domain experts.",
  },
  {
    number: "04",
    icon: <Zap aria-hidden="true" />,
    title: "Beyond the competition",
    description: "Several projects continued development beyond the competition stage.",
  },
];

const focusAreas = ["Artificial Intelligence", "Robotics", "Engineering", "Biotechnology", "Design Thinking", "Digital Technologies", "Entrepreneurship"];
const stJohnsLogoUrl = `${import.meta.env.BASE_URL}assets/st-johns-school.jpg`;
const registrationEndpoint = "https://script.google.com/macros/s/AKfycbznM1_OyBoMxXNCUz_0L9L1hxQaCipOWJLN0b59Rlvtor-qIqGGcv2tvn-eGGeJrJTuwg/exec";
const registrationConfirmationFrameName = "hackfinity-registration-confirmation";
const registrationResponseTimeoutMs = 30000;
const registrationStatusPollIntervalMs = 700;
const eventCountdownTarget = new Date("2026-10-31T00:00:00+05:30").getTime();

function createTeamMember(): TeamMemberInput {
  return { name: "", grade: "", phone: "", email: "" };
}

function getCountdownParts(now: number) {
  let remaining = Math.max(0, eventCountdownTarget - now);
  const days = Math.floor(remaining / 86_400_000);
  remaining -= days * 86_400_000;
  const hours = Math.floor(remaining / 3_600_000);
  remaining -= hours * 3_600_000;
  const minutes = Math.floor(remaining / 60_000);
  remaining -= minutes * 60_000;
  const seconds = Math.floor(remaining / 1_000);
  return { days, hours, minutes, seconds };
}

function EventCountdown() {
  const [now, setNow] = useState(() => Date.now());
  const countdown = getCountdownParts(now);

  useEffect(() => {
    const interval = window.setInterval(() => setNow(Date.now()), 1_000);
    return () => window.clearInterval(interval);
  }, []);

  const countdownUnits = [
    { label: "Days", value: countdown.days },
    { label: "Hours", value: countdown.hours },
    { label: "Minutes", value: countdown.minutes },
    { label: "Seconds", value: countdown.seconds },
  ];

  return (
    <div className="event-countdown" role="timer" aria-live="off" aria-label={`Countdown to 31 October 2026: ${countdown.days} days, ${countdown.hours} hours, ${countdown.minutes} minutes, and ${countdown.seconds} seconds remaining`}>
      <span className="event-countdown-label">COUNTDOWN TO EVENT DAY</span>
      <div className="event-countdown-units">
        {countdownUnits.map((unit) => (
          <span className="event-countdown-unit" key={unit.label}>
            <strong>{String(unit.value).padStart(unit.label === "Days" ? 3 : 2, "0")}</strong>
            <small>{unit.label}</small>
          </span>
        ))}
      </div>
    </div>
  );
}

function StJohnsLogo({ alt }: { alt: string }) {
  const [source, setSource] = useState(stJohnsLogoUrl);

  useEffect(() => {
    let objectUrl: string | undefined;
    const controller = new AbortController();

    fetch(stJohnsLogoUrl, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error("Unable to load the St. John’s School logo.");
        return response.blob();
      })
      .then((logoBlob) => {
        objectUrl = URL.createObjectURL(logoBlob);
        setSource(objectUrl);
      })
      .catch(() => {
        // The protected route remains as a safe fallback if a visitor is temporarily offline.
      });

    return () => {
      controller.abort();
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, []);

  return <img src={source} alt={alt} />;
}

const challengeCards = [
  {
    number: "01",
    icon: <Earth aria-hidden="true" />,
    title: "Awareness Challenge",
    kicker: "EDUCATE & EMPOWER",
    description: "Develop innovative solutions that educate students, parents, teachers, and society about the dangers of substance abuse.",
    examples: ["AI Awareness Chatbot", "VR Awareness Experience", "Interactive Educational Game", "AR Awareness Campaign", "Digital Learning Platform"],
  },
  {
    number: "02",
    icon: <Bot aria-hidden="true" />,
    title: "Prevention Challenge",
    kicker: "EARLY INTERVENTION",
    description: "Develop technologies that help prevent substance abuse through education, monitoring, and early intervention.",
    examples: ["AI-Based Detection Systems", "Anonymous Reporting Platform", "Smart School Safety Dashboard", "Predictive Risk Analytics", "Community Monitoring Solutions"],
  },
  {
    number: "03",
    icon: <HeartHandshake aria-hidden="true" />,
    title: "Recovery & Rehabilitation Challenge",
    kicker: "WELLNESS & SUPPORT",
    description: "Develop innovative solutions that support recovery, counselling, mental wellness, and rehabilitation.",
    examples: ["AI Recovery Companion", "Mental Wellness Application", "VR Therapy Experience", "Family Support Platform", "Recovery Monitoring System"],
  },
  {
    number: "04",
    icon: <Lightbulb aria-hidden="true" />,
    title: "Innovation Challenge",
    kicker: "BREAKTHROUGH FUTURES",
    description: "Create breakthrough ideas and futuristic technologies that could transform the fight against substance abuse.",
    examples: ["Smart Wellness Wearables", "AI Personal Mentor", "Smart City Solutions", "Blockchain-Based Tracking Systems", "Future Community Wellness Ecosystem"],
  },
];

const registrationDefaults: RegistrationInput = {
  name: "",
  email: "",
  phone: "",
  grade: "",
  school: "",
  district: "",
  guardianName: "",
  guardianPhone: "",
  team: "",
  teamSize: "1",
  registrationRole: "Individual Participant",
  category: "Awareness Challenge",
  skills: [],
  projectInterest: "",
  teamMembers: [],
  consent: false,
};

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [formValues, setFormValues] = useState<RegistrationInput>(registrationDefaults);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof RegistrationInput, string>>>({});
  const [submitState, setSubmitState] = useState<"idle" | "submitting" | "submitted" | "rejected" | "unavailable">("idle");
  const [honeypot, setHoneypot] = useState("");

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));

    if (reducedMotion || !("IntersectionObserver" in window)) {
      sections.forEach((section) => section.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      }),
      { threshold: 0.16 },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const closeMenu = () => setMenuOpen(false);

  const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const parsed = registrationSchema.safeParse(formValues);

    if (!parsed.success) {
      const errors = parsed.error.flatten().fieldErrors;
      setFieldErrors({
        name: errors.name?.[0],
        email: errors.email?.[0],
        phone: errors.phone?.[0],
        grade: errors.grade?.[0],
        school: errors.school?.[0],
        district: errors.district?.[0],
        guardianName: errors.guardianName?.[0],
        guardianPhone: errors.guardianPhone?.[0],
        team: errors.team?.[0],
        teamSize: errors.teamSize?.[0],
        registrationRole: errors.registrationRole?.[0],
        category: errors.category?.[0],
        skills: errors.skills?.[0],
        projectInterest: errors.projectInterest?.[0],
        teamMembers: errors.teamMembers?.[0],
        consent: errors.consent?.[0],
      });
      setSubmitState("idle");
      return;
    }

    setFieldErrors({});
    setSubmitState("submitting");

    const nonce = window.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;
    const transportForm = document.createElement("form");
    transportForm.action = registrationEndpoint;
    transportForm.method = "POST";
    transportForm.target = registrationConfirmationFrameName;
    transportForm.className = "registration-transport";

    const payload = document.createElement("textarea");
    payload.name = "payload";
    payload.value = JSON.stringify({ ...parsed.data, website: honeypot, nonce });
    transportForm.appendChild(payload);
    document.body.appendChild(transportForm);
    transportForm.submit();
    transportForm.remove();

    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), registrationResponseTimeoutMs);

    try {
      let outcome: "submitted" | "rejected" | null = null;
      while (!controller.signal.aborted && !outcome) {
        const statusUrl = `${registrationEndpoint}?confirmationNonce=${encodeURIComponent(nonce)}`;
        const response = await fetch(statusUrl, { cache: "no-store", signal: controller.signal });
        const state = getRegistrationSubmissionState(await response.json(), nonce);
        if (state === "unavailable") {
          await new Promise((resolve) => window.setTimeout(resolve, registrationStatusPollIntervalMs));
        } else {
          outcome = state;
        }
      }

      if (!outcome) throw new Error("The registration status was not available in time.");
      if (outcome === "submitted") {
        setFormValues(registrationDefaults);
        setHoneypot("");
        setSubmitState("submitted");
      } else {
        setSubmitState("rejected");
      }
    } catch {
      setSubmitState("unavailable");
    } finally {
      window.clearTimeout(timeout);
    }
  };

  const updateField = <Field extends keyof RegistrationInput>(field: Field, value: RegistrationInput[Field]) => {
    setFormValues((current) => ({ ...current, [field]: value }));
    setFieldErrors((current) => ({ ...current, [field]: undefined }));
    setSubmitState("idle");
  };

  const updateTeamSize = (teamSize: RegistrationInput["teamSize"]) => {
    const additionalMemberCount = Number(teamSize) - 1;
    setFormValues((current) => ({
      ...current,
      teamSize,
      teamMembers: Array.from({ length: additionalMemberCount }, (_, index) => current.teamMembers[index] ?? createTeamMember()),
    }));
    setFieldErrors((current) => ({ ...current, teamSize: undefined, teamMembers: undefined }));
    setSubmitState("idle");
  };

  const updateTeamMember = <Field extends keyof TeamMemberInput>(memberIndex: number, field: Field, value: TeamMemberInput[Field]) => {
    setFormValues((current) => ({
      ...current,
      teamMembers: current.teamMembers.map((member, index) => index === memberIndex ? { ...member, [field]: value } : member),
    }));
    setFieldErrors((current) => ({ ...current, teamMembers: undefined }));
    setSubmitState("idle");
  };

  const toggleSkill = (skill: typeof studentSkillOptions[number]) => {
    setFormValues((current) => ({
      ...current,
      skills: current.skills.includes(skill)
        ? current.skills.filter((currentSkill) => currentSkill !== skill)
        : [...current.skills, skill],
    }));
    setFieldErrors((current) => ({ ...current, skills: undefined }));
    setSubmitState("idle");
  };

  return (
    <div className="toofan-page">
      <a className="skip-link" href="#main-content">Skip to main content</a>

      <header className="site-header">
        <a className="school-lockup" href="#top" aria-label="Hackfinity home">
          <span className="school-host-mark" aria-hidden="true"><img className="school-host-crest" src={officialHeaderCrestUrl} alt="" /></span>
          <span className="school-lockup-copy">
            <span className="school-lockup-top">HOSTED BY</span>
            <span className="school-lockup-name">ST. JOHN&apos;S <em>SCHOOL · ANCHAL</em></span>
          </span>
        </a>

        <nav className="desktop-nav" aria-label="Main navigation">
          {navItems.map((item) => (
            <a href={item.href} key={item.label}>{item.label}</a>
          ))}
        </nav>

        <a className="nav-register" href="#register">
          <img className="nav-toofan-logo" src={toofanNavigationLogoUrl} alt="" aria-hidden="true" />
          <span>Claim your signal</span>
          <ArrowUpRight aria-hidden="true" />
        </a>
        <button
          className="mobile-menu-button"
          type="button"
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </header>

      {menuOpen && (
        <nav className="mobile-nav" aria-label="Mobile navigation">
          {navItems.map((item) => (
            <a href={item.href} key={item.label} onClick={closeMenu}>{item.label}</a>
          ))}
          <a className="mobile-nav-cta" href="#register" onClick={closeMenu}>Register interest <ArrowUpRight aria-hidden="true" /></a>
        </nav>
      )}

      <main id="main-content">
        <section
          id="top"
          className="hero-section"
          onPointerMove={(event) => {
            const bounds = event.currentTarget.getBoundingClientRect();
            const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
            const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;
            event.currentTarget.style.setProperty("--pointer-x", String(x));
            event.currentTarget.style.setProperty("--pointer-y", String(y));
          }}
          onPointerLeave={(event) => {
            event.currentTarget.style.setProperty("--pointer-x", "0");
            event.currentTarget.style.setProperty("--pointer-y", "0");
          }}
        >
          <div className="hero-grid" aria-hidden="true" />
          <div className="hero-glow glow-one" aria-hidden="true" />
          <div className="hero-glow glow-two" aria-hidden="true" />
          <div className="storm-beacons" aria-hidden="true"><span /><span /><span /><span /><span /></div>
          <div className="storm-system" aria-hidden="true">
            <div className="storm-orbit orbit-outer" />
            <div className="storm-orbit orbit-mid" />
            <div className="storm-orbit orbit-inner" />
            <div className="storm-eye" />
            <span className="storm-shard shard-a" />
            <span className="storm-shard shard-b" />
            <span className="storm-shard shard-c" />
            <span className="storm-shard shard-d" />
          </div>

          <div className="hero-content">
            <div className="hero-kicker reveal-up">
              ST. JOHN&apos;S SCHOOL, ANCHAL PRESENTS
            </div>
            <h1 className="hero-title" aria-label="Hackfinity, TOOFAN">
              <span className="hero-title-main">HACKFINITY</span>
              <span className="hero-title-sub">TOOFAN</span>
            </h1>
            <p className="hero-intro">Hackfinity is where restless minds meet the force of TOOFAN: a storm of bold ideas, real questions, and the courage to build through the chaos.</p>
            <div className="hero-actions">
              <a className="button button-primary" href="#register">Enter Hackfinity <ArrowUpRight aria-hidden="true" /></a>
              <a className="button button-ghost" href="#story">Find the signal <ArrowDown aria-hidden="true" /></a>
            </div>
            <EventCountdown />
          </div>

          <div className="hero-brief-card" aria-label="Hackfinity 2026 challenge summary">
            <span>2026 FIELD BRIEF</span>
            <strong>30 DAYS · 4 CHALLENGES</strong>
            <p>Building safer communities.</p>
          </div>

          <div className="hero-meta-panel">
            <div className="hero-meta-item">
              <CalendarDays aria-hidden="true" />
              <div><span>DATE</span><strong>{eventDetails.date}</strong></div>
            </div>
            <div className="hero-meta-divider" aria-hidden="true" />
            <div className="hero-meta-item">
              <MapPin aria-hidden="true" />
              <div><span>GROUND ZERO</span><strong>{eventDetails.venue}</strong></div>
            </div>
          </div>

          <a className="scroll-cue" href="#story" aria-label="Scroll to discover Hackfinity">
            <span>SCROLL TO DISCOVER</span><ChevronDown aria-hidden="true" />
          </a>
        </section>

        <section id="story" className="story-section section-shell">
          <div className="section-label"><span>01</span> ABOUT HACKFINITY 2026</div>
          <div className="story-layout" data-reveal>
            <div className="story-title-wrap">
              <p className="eyebrow">ST. JOHN&apos;S SCHOOL&apos;S FLAGSHIP INNOVATION PLATFORM</p>
              <h2>A launchpad for<br /><em>future innovators.</em></h2>
            </div>
            <div className="story-copy">
              <p>Hackfinity is St. John&apos;s School&apos;s flagship student innovation platform designed to inspire young minds to solve real-world challenges through research, technology, creativity, and entrepreneurship.</p>
              <p>Following the success of the inaugural edition, Hackfinity 2026 returns with a powerful social mission through TOOFAN – The Narco Hunt, a 30-day innovation challenge dedicated to developing solutions that help combat substance abuse and build safer communities.</p>
              <a className="text-link" href="#toofan-mission">Discover the mission <ArrowUpRight aria-hidden="true" /></a>
            </div>
          </div>

          <div className="marquee-band" aria-label="Hackfinity, TOOFAN, make it move">
            <div className="marquee-track">
              <span>HACKFINITY <i>✦</i> MAKE IT MOVE <i>✦</i> TOOFAN <i>✦</i> MAKE IT MATTER <i>✦</i> </span>
              <span aria-hidden="true">HACKFINITY <i>✦</i> MAKE IT MOVE <i>✦</i> TOOFAN <i>✦</i> MAKE IT MATTER <i>✦</i> </span>
            </div>
          </div>
        </section>

        <section id="experience" className="experience-section section-shell">
          <div className="experience-heading" data-reveal>
            <div className="section-label section-label-light"><span>02</span> IMPACT BEYOND THE COMPETITION</div>
            <h2>More than a<br /><em>hackathon.</em></h2>
            <p>The previous edition brought together hundreds of student innovators, researchers, creators, and future problem-solvers from more than 60 schools across South India.</p>
          </div>
          <div className="experience-grid">
            {impactCards.map((card) => (
              <article className="experience-card" key={card.number}>
                <div className="experience-card-top"><span>{card.number}</span>{card.icon}</div>
                <h3>{card.title}</h3>
                <p>{card.description}</p>
                <span className="card-line" aria-hidden="true" />
              </article>
            ))}
          </div>
          <div className="signal-quote">
            <Wind aria-hidden="true" />
            <p>Transform ideas into meaningful solutions<br /><span>with real-world impact.</span></p>
          </div>
        </section>

        <section id="toofan-mission" className="toofan-mission-section section-shell">
          <div className="toofan-mission-orbit" aria-hidden="true"><span /><span /><span /></div>
          <div className="toofan-mission-heading" data-reveal>
            <div className="section-label"><span>03</span> HACKFINITY 2026 THEME</div>
            <p className="eyebrow">A 30-DAY INNOVATION CHALLENGE</p>
            <h2>TOOFAN –<br /><em>The Narco Hunt.</em></h2>
          </div>
          <div className="toofan-mission-copy" data-reveal>
            <p>Substance abuse is one of society&apos;s most challenging issues and requires innovative thinking, research, technology, and collective action.</p>
            <p>TOOFAN challenges students to develop practical solutions that create awareness, strengthen prevention, support recovery and rehabilitation, and drive future innovation.</p>
          </div>
          <div className="focus-areas">
            <span>BUILD WITH</span>
            <div>{focusAreas.map((area) => <i key={area}>{area}</i>)}</div>
          </div>
        </section>

        <section id="challenges" className="challenges-section section-shell">
          <div className="challenges-heading" data-reveal>
            <div className="section-label"><span>04</span> FOUR CHALLENGES</div>
            <div>
              <p className="eyebrow">CHOOSE YOUR IMPACT</p>
              <h2>Four ways to<br /><em>build safer communities.</em></h2>
            </div>
            <p>Develop practical, people-centred solutions that help combat substance abuse and create measurable social impact.</p>
          </div>
          <div className="challenge-grid">
            {challengeCards.map((challenge) => (
              <article className="challenge-card" key={challenge.number}>
                <div className="challenge-card-glow" aria-hidden="true" />
                <div className="challenge-card-top"><span>CHALLENGE {challenge.number}</span>{challenge.icon}</div>
                <div className="challenge-card-body">
                  <p>{challenge.kicker}</p>
                  <h3>{challenge.title}</h3>
                  <div className="challenge-rule" aria-hidden="true"><span /><span /><span /></div>
                  <div className="challenge-copy"><span>BRIEF</span><p>{challenge.description}</p></div>
                  <div className="challenge-examples"><span>SAMPLE PROJECTS</span><div>{challenge.examples.map((example) => <i key={example}>{example}</i>)}</div></div>
                </div>
                <div className="challenge-index" aria-hidden="true">{challenge.number}</div>
              </article>
            ))}
          </div>
          <p className="challenge-disclaimer">Sample projects are prompts for exploration. The final challenge briefs and participation rules will be shared by the Hackfinity organisers.</p>
        </section>

        <section id="venue" className="venue-section section-shell">
          <div className="venue-graphic" aria-hidden="true">
            <div className="venue-sun" />
            <div className="venue-line venue-line-one" />
            <div className="venue-line venue-line-two" />
            <div className="venue-pin"><MapPin /></div>
            <div className="venue-rings"><span /><span /><span /></div>
          </div>
          <div className="venue-content" data-reveal>
            <div className="section-label"><span>05</span> FIND THE GROUND</div>
            <div className="official-host-mark official-host-mark-prominent">
              <span>OFFICIAL HOST · ST. JOHN&apos;S SCHOOL, ANCHAL</span>
              <StJohnsLogo alt="St. John’s School, Anchal" />
            </div>
            <p className="eyebrow">THE PLACE WHERE IT BEGINS</p>
            <h2>St. John&apos;s School,<br /><em>Anchal.</em></h2>
            <p>Our home base for a day of new signals, shared energy, and ideas set in motion. Full arrival and event-day information will be announced by the organising team.</p>
            <div className="venue-tag"><MapPin aria-hidden="true" /> MAR GREGORIOS CAMPUS, ANCHAL</div>
          </div>
        </section>

        <section id="register" className="register-section section-shell">
          <div className="register-heading" data-reveal>
            <div className="section-label section-label-light"><span>06</span> HOLD YOUR PLACE</div>
            <h2>Ready when<br />the <em>storm</em> is.</h2>
            <p>Drop a signal below. Valid student registrations are sent securely to the organiser&apos;s Hackfinity registration sheet.</p>
            <div className="registration-status"><span className="status-pulse" aria-hidden="true" /> REGISTRATION SYSTEM: LIVE</div>
          </div>

          <form className="registration-form" data-reveal onSubmit={handleFormSubmit} noValidate>
            <iframe className="registration-confirmation-frame" name={registrationConfirmationFrameName} title="Registration submission transport" />
            <div className="form-honeypot" aria-hidden="true">
              <label htmlFor="website">Website</label>
              <input id="website" tabIndex={-1} autoComplete="off" value={honeypot} onChange={(event) => setHoneypot(event.target.value)} />
            </div>
            <div className="form-section-heading"><span>01</span> STUDENT PROFILE</div>
            <div className="form-grid">
              <div className="form-field">
                <label htmlFor="name">FULL NAME</label>
                <input id="name" value={formValues.name} onChange={(event) => updateField("name", event.target.value)} placeholder="How should we call you?" autoComplete="name" aria-invalid={Boolean(fieldErrors.name)} aria-describedby={fieldErrors.name ? "name-error" : undefined} />
                {fieldErrors.name && <span id="name-error" className="field-error">{fieldErrors.name}</span>}
              </div>
              <div className="form-field">
                <label htmlFor="email">EMAIL ADDRESS</label>
                <input id="email" type="email" value={formValues.email} onChange={(event) => updateField("email", event.target.value)} placeholder="you@example.com" autoComplete="email" aria-invalid={Boolean(fieldErrors.email)} aria-describedby={fieldErrors.email ? "email-error" : undefined} />
                {fieldErrors.email && <span id="email-error" className="field-error">{fieldErrors.email}</span>}
              </div>
              <div className="form-field">
                <label htmlFor="phone">STUDENT CONTACT</label>
                <input id="phone" type="tel" value={formValues.phone} onChange={(event) => updateField("phone", event.target.value)} placeholder="Your mobile number" autoComplete="tel" aria-invalid={Boolean(fieldErrors.phone)} aria-describedby={fieldErrors.phone ? "phone-error" : undefined} />
                {fieldErrors.phone && <span id="phone-error" className="field-error">{fieldErrors.phone}</span>}
              </div>
              <div className="form-field">
                <label htmlFor="grade">CLASS / GRADE</label>
                <input id="grade" value={formValues.grade} onChange={(event) => updateField("grade", event.target.value)} placeholder="For example, Class XI" aria-invalid={Boolean(fieldErrors.grade)} aria-describedby={fieldErrors.grade ? "grade-error" : undefined} />
                {fieldErrors.grade && <span id="grade-error" className="field-error">{fieldErrors.grade}</span>}
              </div>
            </div>

            <div className="form-section-heading"><span>02</span> SCHOOL &amp; SAFETY CONTACT</div>
            <div className="form-grid">
              <div className="form-field form-field-wide">
                <label htmlFor="school">SCHOOL NAME</label>
                <input id="school" value={formValues.school} onChange={(event) => updateField("school", event.target.value)} placeholder="Where are you building from?" aria-invalid={Boolean(fieldErrors.school)} aria-describedby={fieldErrors.school ? "school-error" : undefined} />
                {fieldErrors.school && <span id="school-error" className="field-error">{fieldErrors.school}</span>}
              </div>
              <div className="form-field">
                <label htmlFor="district">DISTRICT / CITY</label>
                <input id="district" value={formValues.district} onChange={(event) => updateField("district", event.target.value)} placeholder="Your district or city" aria-invalid={Boolean(fieldErrors.district)} aria-describedby={fieldErrors.district ? "district-error" : undefined} />
                {fieldErrors.district && <span id="district-error" className="field-error">{fieldErrors.district}</span>}
              </div>
              <div className="form-field">
                <label htmlFor="guardianName">PARENT / GUARDIAN NAME</label>
                <input id="guardianName" value={formValues.guardianName} onChange={(event) => updateField("guardianName", event.target.value)} placeholder="For event communication" aria-invalid={Boolean(fieldErrors.guardianName)} aria-describedby={fieldErrors.guardianName ? "guardian-name-error" : undefined} />
                {fieldErrors.guardianName && <span id="guardian-name-error" className="field-error">{fieldErrors.guardianName}</span>}
              </div>
              <div className="form-field">
                <label htmlFor="guardianPhone">PARENT / GUARDIAN CONTACT</label>
                <input id="guardianPhone" type="tel" value={formValues.guardianPhone} onChange={(event) => updateField("guardianPhone", event.target.value)} placeholder="A reachable contact number" autoComplete="tel" aria-invalid={Boolean(fieldErrors.guardianPhone)} aria-describedby={fieldErrors.guardianPhone ? "guardian-phone-error" : undefined} />
                {fieldErrors.guardianPhone && <span id="guardian-phone-error" className="field-error">{fieldErrors.guardianPhone}</span>}
              </div>
            </div>

            <div className="form-section-heading"><span>03</span> YOUR HACKFINITY PATH</div>
            <div className="form-grid">
              <div className="form-field">
                <label htmlFor="team">TEAM NAME <span>OPTIONAL</span></label>
                <input id="team" value={formValues.team} onChange={(event) => updateField("team", event.target.value)} placeholder="Name your crew" aria-invalid={Boolean(fieldErrors.team)} aria-describedby={fieldErrors.team ? "team-error" : undefined} />
                {fieldErrors.team && <span id="team-error" className="field-error">{fieldErrors.team}</span>}
              </div>
              <div className="form-field">
                <label htmlFor="teamSize">TEAM SIZE</label>
                <select id="teamSize" value={formValues.teamSize} onChange={(event) => updateTeamSize(event.target.value as RegistrationInput["teamSize"])} aria-invalid={Boolean(fieldErrors.teamSize)} aria-describedby={fieldErrors.teamSize ? "team-size-error" : undefined}>
                  {["1", "2", "3", "4", "5", "6"].map((size) => <option key={size} value={size}>{size} participant{size === "1" ? "" : "s"}</option>)}
                </select>
                {fieldErrors.teamSize && <span id="team-size-error" className="field-error">{fieldErrors.teamSize}</span>}
              </div>
              <div className="form-field">
                <label htmlFor="registrationRole">REGISTRATION ROLE</label>
                <select id="registrationRole" value={formValues.registrationRole} onChange={(event) => updateField("registrationRole", event.target.value as RegistrationInput["registrationRole"])} aria-invalid={Boolean(fieldErrors.registrationRole)} aria-describedby={fieldErrors.registrationRole ? "role-error" : undefined}>
                  {(["Individual Participant", "Team Lead", "Team Member"] as const).map((role) => <option key={role} value={role}>{role}</option>)}
                </select>
                {fieldErrors.registrationRole && <span id="role-error" className="field-error">{fieldErrors.registrationRole}</span>}
              </div>
              <div className="form-field form-field-wide">
                <label htmlFor="category">PREFERRED CHALLENGE CATEGORY</label>
                <select id="category" value={formValues.category} onChange={(event) => updateField("category", event.target.value as RegistrationInput["category"])} aria-invalid={Boolean(fieldErrors.category)} aria-describedby={fieldErrors.category ? "category-error" : undefined}>
                  {registrationCategories.map((category) => <option key={category} value={category}>{category}</option>)}
                </select>
                {fieldErrors.category && <span id="category-error" className="field-error">{fieldErrors.category}</span>}
              </div>
            </div>

            {formValues.teamMembers.length > 0 && (
              <fieldset className="team-member-fieldset" aria-describedby={fieldErrors.teamMembers ? "team-members-error" : undefined}>
                <legend>ADDITIONAL TEAM MEMBER DETAILS</legend>
                <p>The team lead’s details are already captured above. Add the requested details for all {formValues.teamMembers.length} additional member{formValues.teamMembers.length === 1 ? "" : "s"}.</p>
                <div className="team-member-stack">
                  {formValues.teamMembers.map((member, index) => (
                    <article className="team-member-card" key={index}>
                      <div className="team-member-card-heading"><span>MEMBER {String(index + 2).padStart(2, "0")}</span><i aria-hidden="true" /></div>
                      <div className="form-grid">
                        <div className="form-field">
                          <label htmlFor={`member-${index}-name`}>FULL NAME</label>
                          <input id={`member-${index}-name`} value={member.name} onChange={(event) => updateTeamMember(index, "name", event.target.value)} placeholder="Team member’s full name" autoComplete="name" aria-invalid={Boolean(fieldErrors.teamMembers)} />
                        </div>
                        <div className="form-field">
                          <label htmlFor={`member-${index}-grade`}>CLASS / GRADE</label>
                          <input id={`member-${index}-grade`} value={member.grade} onChange={(event) => updateTeamMember(index, "grade", event.target.value)} placeholder="For example, Class XI" aria-invalid={Boolean(fieldErrors.teamMembers)} />
                        </div>
                        <div className="form-field">
                          <label htmlFor={`member-${index}-phone`}>STUDENT CONTACT</label>
                          <input id={`member-${index}-phone`} type="tel" value={member.phone} onChange={(event) => updateTeamMember(index, "phone", event.target.value)} placeholder="Team member’s mobile number" autoComplete="tel" aria-invalid={Boolean(fieldErrors.teamMembers)} />
                        </div>
                        <div className="form-field">
                          <label htmlFor={`member-${index}-email`}>EMAIL ADDRESS</label>
                          <input id={`member-${index}-email`} type="email" value={member.email} onChange={(event) => updateTeamMember(index, "email", event.target.value)} placeholder="member@example.com" autoComplete="email" aria-invalid={Boolean(fieldErrors.teamMembers)} />
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
                {fieldErrors.teamMembers && <span id="team-members-error" className="field-error">{fieldErrors.teamMembers}</span>}
              </fieldset>
            )}

            <fieldset className="form-choice-field" aria-describedby={fieldErrors.skills ? "skills-error" : undefined}>
              <legend>AREAS YOU WANT TO EXPLORE</legend>
              <p>Select one or more areas that your team may use.</p>
              <div className="choice-grid">
                {studentSkillOptions.map((skill) => <label className="choice-chip" key={skill}><input type="checkbox" checked={formValues.skills.includes(skill)} onChange={() => toggleSkill(skill)} /><span>{skill}</span></label>)}
              </div>
              {fieldErrors.skills && <span id="skills-error" className="field-error">{fieldErrors.skills}</span>}
            </fieldset>

            <div className="form-field form-field-message">
              <label htmlFor="projectInterest">WHAT PROBLEM OR IDEA DO YOU WANT TO EXPLORE? <span>OPTIONAL</span></label>
              <textarea id="projectInterest" value={formValues.projectInterest} onChange={(event) => updateField("projectInterest", event.target.value)} placeholder="A short note helps the organisers understand your interests." maxLength={500} aria-invalid={Boolean(fieldErrors.projectInterest)} aria-describedby={fieldErrors.projectInterest ? "project-error" : undefined} />
              {fieldErrors.projectInterest && <span id="project-error" className="field-error">{fieldErrors.projectInterest}</span>}
            </div>

            <label className="consent-check"><input type="checkbox" checked={formValues.consent} onChange={(event) => updateField("consent", event.target.checked)} aria-invalid={Boolean(fieldErrors.consent)} aria-describedby={fieldErrors.consent ? "consent-error" : undefined} /><span>I confirm that these details are accurate and that I have permission from my parent, guardian, or school to share them for Hackfinity event communication.</span></label>
            {fieldErrors.consent && <span id="consent-error" className="field-error">{fieldErrors.consent}</span>}
            <div className="form-submit-row">
              <button type="submit" className="button button-solar" disabled={submitState === "submitting"}>{submitState === "submitting" ? "Sending application…" : "Submit my application"} <Send aria-hidden="true" /></button>
              <p>Your details are used only for Hackfinity registration and are sent to the organiser&apos;s registration sheet.</p>
            </div>
            {submitState === "submitted" && (
              <div className="form-notice" role="status"><Check aria-hidden="true" /> Your registration has been confirmed by the Hackfinity organisers. Please keep your contact details available for event communication.</div>
            )}
            {submitState === "rejected" && (
              <div className="form-notice form-notice-error" role="alert">Your registration could not be accepted. Please review the details and try again.</div>
            )}
            {submitState === "unavailable" && (
              <div className="form-notice form-notice-error" role="alert">We could not confirm your registration right now. Please check your connection and try again.</div>
            )}
          </form>
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-mark"><strong>HACK<span>FINITY</span></strong><small>TOOFAN</small></div>
        <div className="footer-host">
          <span>HOSTED BY</span>
          <strong>ST. JOHN&apos;S SCHOOL, ANCHAL</strong>
        </div>
        <div className="footer-powered">
          <span>POWERED BY</span>
          <strong className="hownwhy-wordmark" aria-label="HOWNWHY" role="img"><span>HOW</span><i aria-hidden="true">N</i><span>WHY</span></strong>
        </div>
        <div className="footer-year">OCTOBER 2026</div>
      </footer>
    </div>
  );
}
