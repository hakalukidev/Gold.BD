/**
 * Swappable SMS gateway interface. Swap `ConsoleSmsProvider` for a real vendor
 * (e.g. an SSL Wireless / Alpha SMS / Twilio adapter for BD numbers) by
 * implementing this interface and changing the export at the bottom — nothing
 * else in the codebase needs to change.
 */
export interface SmsProvider {
  send(phone: string, message: string): Promise<void>;
}

class ConsoleSmsProvider implements SmsProvider {
  async send(phone: string, message: string): Promise<void> {
    // No SMS vendor configured yet — log so OTPs are usable in local dev.
    console.log(`[sms-mock] -> ${phone}: ${message}`);
  }
}

export const smsProvider: SmsProvider = new ConsoleSmsProvider();
