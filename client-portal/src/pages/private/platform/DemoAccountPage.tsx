import { useState } from "react";

export default function DemoAccountPage({ section = "profile" }: { section?: "profile" | "settings" }) {
  const [saved, setSaved] = useState(false);
  return <main className="demo-account-page" aria-labelledby="demo-account-title">
    <h1 id="demo-account-title">{section === "profile" ? "Demo profile" : "Demo settings"}</h1>
    <p className="demo-account-disclosure">Codestra Demo account · Virtual funds only · No monetary value</p>
    {section === "profile" ? <section aria-label="Profile details">
      <label>Display name<input name="displayName" placeholder="Optional display name" /></label>
      <label>Email<input name="email" type="email" readOnly placeholder="Your registered email" /></label>
      <p>Account type: <strong>Registered Demo</strong></p>
      <button type="button" onClick={() => setSaved(true)}>{saved ? "Saved" : "Save profile"}</button>
    </section> : <section aria-label="Demo preferences">
      <label>Language<select defaultValue="en"><option value="en">English</option></select></label>
      <label>Time zone<select defaultValue="UTC"><option value="UTC">UTC</option></select></label>
      <label>Default virtual amount<input type="number" min="1" defaultValue="100" /></label>
      <label>Default duration<select defaultValue="15"><option value="5">5 seconds</option><option value="15">15 seconds</option><option value="30">30 seconds</option><option value="60">60 seconds</option></select></label>
      <label><input type="checkbox" /> Reduce motion</label>
      <label><input type="checkbox" defaultChecked /> Platform notifications</label>
      <button type="button" onClick={() => setSaved(true)}>{saved ? "Saved" : "Save settings"}</button>
    </section>}
  </main>;
}
