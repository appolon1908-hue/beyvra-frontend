import { Link } from "react-router-dom";

export default function ContentReview() {
  return <main style={{ minHeight: "100svh", background: "var(--color-canvas)", color: "var(--color-text)", padding: "120px 20px", textAlign: "center" }}>
    <p style={{ color: "var(--color-warning)", fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase" }}>Content under review</p>
    <h1>This Codestra document is not published yet.</h1>
    <p style={{ maxWidth: 560, margin: "16px auto 28px", color: "var(--color-text-secondary)", lineHeight: 1.6 }}>The previous document has been withheld until Codestra ownership, wording, and effective-date approval are complete.</p>
    <Link to="/" style={{ color: "var(--color-brand)" }}>Back to home</Link>
  </main>;
}
