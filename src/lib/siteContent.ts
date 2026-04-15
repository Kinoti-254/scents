import "server-only";

import { cache } from "react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  defaultSiteContent,
  normalizeSiteContent,
  SiteContent
} from "@/lib/siteContentShared";

export const getSiteContent = cache(async () => {
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return defaultSiteContent;
  }

  const { data, error } = await supabase
    .from("site_content")
    .select("*")
    .eq("key", "default")
    .maybeSingle();

  if (error || !data) {
    return defaultSiteContent;
  }

  return normalizeSiteContent(data as Partial<SiteContent>);
});
