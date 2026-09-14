import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Grievance Officer",
  description:
    "How to raise a grievance with CraftGali, who handles it, and the timelines we are held to.",
};

/**
 * Rule 3(2) of the IT (Intermediary Guidelines and Digital Media Ethics Code)
 * Rules, 2021 requires an intermediary to publish the *name*, *designation* and
 * *contact details* of a real Grievance Officer resident in India.
 *
 * These are a legal appointment, not copy — fill them in before launch. The page
 * refuses to invent them and says so publicly while they are unset.
 */
const OFFICER = {
  name: "",
  designation: "Grievance Officer",
  email: "",
  address: "",
};

const published = Boolean(OFFICER.name && OFFICER.email && OFFICER.address);

const STAGES = [
  {
    figure: "24h",
    title: "Acknowledgement",
    body: "Every grievance is acknowledged in writing within twenty-four hours of receipt, with a reference number you can quote.",
  },
  {
    figure: "72h",
    title: "Unlawful content",
    body: "A complaint that content is unlawful — impersonation, someone else's photographs, a listing that breaks the law rather than our guidelines — is acted on within seventy-two hours.",
  },
  {
    figure: "15d",
    title: "Resolution",
    body: "Every grievance is disposed of within fifteen days of receipt. If we need longer we will tell you why, in writing, before the fifteen days are up.",
  },
];

export default function GrievancePage() {
  return (
    <main className="cg-doc">
      <header className="cg-doc__head">
        <p className="cg-eyebrow cg-eyebrow--accent">Grievance redressal</p>
        <h1 className="cg-doc__title">If something here has wronged you, this is the way in</h1>
        <p className="cg-lede cg-doc__lede">
          Use the Report link on a listing or a studio for anything that breaks our{" "}
          <Link href="/guidelines">guidelines</Link>. This page is for the step beyond
          that — a formal grievance, which we are held to a clock on.
        </p>
      </header>

      <section className="cg-doc__officer">
        <h2 className="cg-eyebrow">The officer</h2>
        {published ? (
          <address className="cg-doc__address">
            <strong>{OFFICER.name}</strong>
            <span>{OFFICER.designation}</span>
            <a href={`mailto:${OFFICER.email}`}>{OFFICER.email}</a>
            <span>{OFFICER.address}</span>
          </address>
        ) : (
          <div className="cg-notice">
            <p className="cg-notice__title">Not yet appointed</p>
            <p className="cg-notice__body">
              CraftGali has not yet published a Grievance Officer. Until it does, write to
              the team and the complaint will be logged and answered to the same timelines
              set out below.
            </p>
          </div>
        )}
      </section>

      <ol className="cg-doc__rules">
        {STAGES.map((stage) => (
          <li key={stage.figure} className="cg-doc__rule">
            <span className="cg-doc__figure">{stage.figure}</span>
            <div>
              <h2 className="cg-doc__ruletitle">{stage.title}</h2>
              <p className="cg-doc__body">{stage.body}</p>
            </div>
          </li>
        ))}
      </ol>

      <section className="cg-doc__section">
        <h2 className="cg-doc__heading">What to include</h2>
        <ul className="cg-doc__list">
          <li>A link to the listing, studio or conversation you are complaining about.</li>
          <li>What happened, in your own words, and what you would like done.</li>
          <li>Your name and a way to reach you — a grievance cannot be answered anonymously.</li>
        </ul>
      </section>

      <div className="cg-notice cg-doc__notice">
        <p className="cg-notice__title">One thing we cannot do</p>
        <p className="cg-notice__body">
          CraftGali processes no payments and takes no commission, so we cannot reverse a
          transfer or recover money sent outside the app. A grievance can get a studio
          suspended and a listing removed; it cannot refund you. That is why the first rule
          on <Link href="/trust">Trust &amp; Safety</Link> is to never pay in advance.
        </p>
      </div>
    </main>
  );
}
