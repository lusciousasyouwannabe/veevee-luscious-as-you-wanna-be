import { Helmet } from "react-helmet-async";

export const SITE_URL = "https://veeveeluscious.com";

interface SeoProps {
  title: string;
  description: string;
  path: string;
  noindex?: boolean;
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
}

/** Per-route head tags: title, description, canonical, Open Graph and JSON-LD. */
const Seo = ({ title, description, path, noindex, jsonLd }: SeoProps) => {
  const url = `${SITE_URL}${path}`;
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      {jsonLd && (
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      )}
    </Helmet>
  );
};

export default Seo;
