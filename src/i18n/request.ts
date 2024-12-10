import { getRequestConfig } from "next-intl/server";
import { cookies, headers } from "next/headers";
import { i18n } from ".";

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  let locale = cookieStore.get("locale")?.value;
  if (!locale) {
    const headerStore = await headers();
    locale = headerStore.get("accept-language")?.split(",")[0]?.split("-")[0];
  }

  if (!locale || !i18n.supportedLanguages.includes(locale)) {
    locale = i18n.defaultLanguage;
  }

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});
