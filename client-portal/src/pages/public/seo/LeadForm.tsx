import { FormEvent, useMemo, useState } from "react";
import { submitLead, trackPublicEvent } from "./tracking";

type LeadFormProps = {
  source: string;
  compact?: boolean;
};

const interests = ["Demo account", "Charts", "Market data", "Risk controls", "Business access"];

export default function LeadForm({ source, compact = false }: LeadFormProps) {
  const [selected, setSelected] = useState("Demo account");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [message, setMessage] = useState("");
  const formId = useMemo(() => `lead-${source.replace(/[^a-z0-9]+/gi, "-")}`, [source]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const currentForm = event.currentTarget;
    const form = new FormData(currentForm);
    const email = String(form.get("email") || "").trim();
    const name = String(form.get("name") || "").trim();
    const goal = String(form.get("goal") || "").trim();
    if (!email || !email.includes("@") || !name) {
      setStatus("error");
      setMessage("Add your name and a valid email to continue.");
      return;
    }
    setStatus("sending");
    setMessage("");
    try {
      await submitLead({
        source,
        name,
        email,
        interest: selected,
        goal,
        consent: form.get("contactConsent") === "on",
      });
      trackPublicEvent("lead_submit", { source, interest: selected });
      setStatus("sent");
      setMessage("Thanks. Your Beyvra request was received.");
      currentForm.reset();
    } catch {
      setStatus("error");
      setMessage("The request could not be sent right now. Please try again later.");
    }
  };

  return (
    <form className={compact ? "leadForm compact" : "leadForm"} id={formId} onSubmit={handleSubmit}>
      <div className="leadFormHeader">
        <span>Client access</span>
        <strong>Get the right Beyvra start path</strong>
      </div>
      <div className="leadInterestGroup" role="radiogroup" aria-label="Interest">
        {interests.map((interest) => (
          <button
            aria-checked={selected === interest}
            className={selected === interest ? "active" : ""}
            key={interest}
            onClick={() => setSelected(interest)}
            role="radio"
            type="button"
          >
            {interest}
          </button>
        ))}
      </div>
      <label>
        Name
        <input name="name" autoComplete="name" placeholder="Your name" />
      </label>
      <label>
        Email
        <input name="email" type="email" autoComplete="email" placeholder="you@example.com" />
      </label>
      <label>
        What do you want to do first?
        <textarea name="goal" rows={compact ? 3 : 4} placeholder="Tell us what you want to explore in Beyvra." />
      </label>
      <label className="leadConsent">
        <input name="contactConsent" type="checkbox" />
        I agree Beyvra may contact me about this request. No investment advice is provided through this form.
      </label>
      <button className="leadSubmit" disabled={status === "sending"} type="submit">
        {status === "sending" ? "Sending..." : "Request access"}
      </button>
      {message ? <p className={`leadMessage ${status}`} role="status">{message}</p> : null}
    </form>
  );
}
