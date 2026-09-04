import { useLanguageSync } from "../hooks/useLanguageSync";
import { usePageMeta } from "../hooks/usePageMeta";
import { Navbar } from "../components/layout/Navbar";
import { Footer } from "../components/layout/Footer";
import { SEOHead } from "../components/SEOHead";
import { useTranslation } from "react-i18next";

export function PrivacyPolicy() {
  const lang = useLanguageSync();
  usePageMeta("privacy.meta.title", "privacy.meta.description");
  const { t } = useTranslation();

  const sectionClass = "mb-10";
  const headingClass = "text-2xl lg:text-3xl font-black mb-4 tracking-tight";
  const textClass = "text-zinc-600 text-lg leading-relaxed mb-4";
  const listClass =
    "list-disc list-inside text-zinc-600 text-lg leading-relaxed mb-4 space-y-2";

  return (
    <>
      <SEOHead
        breadcrumbs={[
          { name: t("nav.home", { defaultValue: "Home" }), url: `/${lang}/` },
          { name: t("footer.privacyPolicy"), url: `/${lang}/privacy-policy` },
        ]}
      />
      <Navbar />
      <main className="max-w-4xl mx-auto px-6 py-16 lg:py-24">
        <h1 className="text-4xl lg:text-6xl font-black tracking-tighter mb-4">
          {t("privacy.title")}
        </h1>
        <p className="text-zinc-500 font-bold mb-12">
          {t("privacy.lastUpdated")}
        </p>

        <div className={sectionClass}>
          <h2 className={headingClass}>{t("privacy.sections.intro.title")}</h2>
          <p className={textClass}>{t("privacy.sections.intro.text")}</p>
        </div>

        <div className={sectionClass}>
          <h2 className={headingClass}>
            {t("privacy.sections.dataCollect.title")}
          </h2>
          <p className={textClass}>{t("privacy.sections.dataCollect.text")}</p>
          <ul className={listClass}>
            <li>{t("privacy.sections.dataCollect.items.0")}</li>
            <li>{t("privacy.sections.dataCollect.items.1")}</li>
            <li>{t("privacy.sections.dataCollect.items.2")}</li>
          </ul>
        </div>

        <div className={sectionClass}>
          <h2 className={headingClass}>
            {t("privacy.sections.howWeUse.title")}
          </h2>
          <ul className={listClass}>
            <li>{t("privacy.sections.howWeUse.items.0")}</li>
            <li>{t("privacy.sections.howWeUse.items.1")}</li>
            <li>{t("privacy.sections.howWeUse.items.2")}</li>
          </ul>
        </div>

        <div className={sectionClass}>
          <h2 className={headingClass}>
            {t("privacy.sections.cookies.title")}
          </h2>
          <p className={textClass}>{t("privacy.sections.cookies.text")}</p>
          <ul className={listClass}>
            <li>{t("privacy.sections.cookies.items.0")}</li>
            <li>{t("privacy.sections.cookies.items.1")}</li>
          </ul>
          <p className={textClass}>{t("privacy.sections.cookies.optOut")}</p>
        </div>

        <div className={sectionClass}>
          <h2 className={headingClass}>
            {t("privacy.sections.retention.title")}
          </h2>
          <ul className={listClass}>
            <li>{t("privacy.sections.retention.items.0")}</li>
            <li>{t("privacy.sections.retention.items.1")}</li>
          </ul>
        </div>

        <div className={sectionClass}>
          <h2 className={headingClass}>{t("privacy.sections.gdpr.title")}</h2>
          <p className={textClass}>{t("privacy.sections.gdpr.text")}</p>
          <ul className={listClass}>
            <li>{t("privacy.sections.gdpr.items.0")}</li>
            <li>{t("privacy.sections.gdpr.items.1")}</li>
            <li>{t("privacy.sections.gdpr.items.2")}</li>
            <li>{t("privacy.sections.gdpr.items.3")}</li>
          </ul>
        </div>

        <div className={sectionClass}>
          <h2 className={headingClass}>
            {t("privacy.sections.contact.title")}
          </h2>
          <p className={textClass}>{t("privacy.sections.contact.text")}</p>
          <p className="text-lg font-bold text-black">
            engineering@epsystems.org
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
