import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const DemoHighlights = () => {
  const { t } = useTranslation();
  const items = [
    ["demoHighlightOneTitle", "demoHighlightOneBody"],
    ["demoHighlightTwoTitle", "demoHighlightTwoBody"],
    ["demoHighlightThreeTitle", "demoHighlightThreeBody"],
  ] as const;

  return (
    <section className="demoHighlights" aria-labelledby="demo-highlights-title">
      <div className="demoHighlightsIntro">
        <p className="heroEyebrow">{t("demoSectionEyebrow")}</p>
        <h2 id="demo-highlights-title">{t("demoSectionTitle")}</h2>
        <p>{t("demoSectionLead")}</p>
      </div>
      <div className="demoHighlightGrid">
        {items.map(([title, body]) => (
          <article className="demoHighlightCard" key={title}>
            <h3>{t(title)}</h3>
            <p>{t(body)}</p>
          </article>
        ))}
      </div>
      <Link className="heroSecondaryAction demoLearnLink" to="/platform-overview">
        {t("learnHowItWorks")}
      </Link>
    </section>
  );
};

export default DemoHighlights;
