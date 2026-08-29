import { Link, Navigate, useParams } from "react-router-dom";
import Navbar from "pages/public/home/commonComponents/navbar/Navbar";
import SeoHead from "./SeoHead";
import LeadForm from "./LeadForm";
import { seoPageBySlug } from "./seoPages";
import "./seo.scss";

export default function SeoLandingPage() {
  const { slug = "" } = useParams();
  const page = seoPageBySlug.get(slug);
  if (!page) return <Navigate to="/" replace />;

  return (
    <main className="seoPage">
      <SeoHead
        title={page.title}
        description={page.description}
        canonicalPath={`/learn/${page.slug}`}
        keywords={`${page.keyword}, Beyvra, demo trading, paper trading, market education`}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: `${page.title} | Beyvra`,
          description: page.description,
          url: `https://beyvra.com/learn/${page.slug}`,
          publisher: { "@type": "Organization", name: "Beyvra", url: "https://beyvra.com" },
        }}
      />
      <Navbar />
      <section className="seoHero">
        <div className="seoHeroText">
          <span>{page.keyword}</span>
          <h1>{page.title}</h1>
          <p>{page.hero}</p>
          <div className="seoActions">
            <Link to="/signIn?tab=registration&mode=demo">{page.cta}</Link>
            <Link to="/privacy">Privacy</Link>
          </div>
        </div>
        <LeadForm source={page.slug} compact />
      </section>
      <section className="seoProof" aria-label="Beyvra trust points">
        {page.proof.map((item) => <p key={item}>{item}</p>)}
      </section>
      <section className="seoBody">
        <div>
          <span>Built for {page.audience}</span>
          {page.sections.map((section) => (
            <article key={section.heading}>
              <h2>{section.heading}</h2>
              <p>{section.body}</p>
            </article>
          ))}
        </div>
        <aside>
          <h2>What Beyvra will not claim</h2>
          <p>Beyvra does not promise profits, provide individualized investment advice, or hide that demo trading uses virtual funds.</p>
          <Link to="/demo-disclosure">Read demo disclosure</Link>
        </aside>
      </section>
    </main>
  );
}
