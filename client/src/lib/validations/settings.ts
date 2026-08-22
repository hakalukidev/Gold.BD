import { z } from "zod";

export const siteSettingsSchema = z.object({
  address: z.string().trim().max(300).optional().or(z.literal("")),
  bin: z.string().trim().max(50).optional().or(z.literal("")),
  phone: z.string().trim().max(30).optional().or(z.literal("")),
});
export type SiteSettingsInput = z.infer<typeof siteSettingsSchema>;
