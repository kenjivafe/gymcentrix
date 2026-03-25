import { z } from "zod";

export const membershipPlans = [
  {
    id: "standard",
    name: "Standard",
    price: "$69",
    cadence: "per month",
    perks: ["Full gym access", "Locker usage", "Group classes"],
  },
  {
    id: "premium",
    name: "Premium",
    price: "$109",
    cadence: "per month",
    perks: ["Standard perks", "RFID locker priority", "1 PT session/mo"],
  },
  {
    id: "elite",
    name: "Elite",
    price: "$169",
    cadence: "per month",
    perks: ["Premium perks", "Unlimited sauna", "3 PT sessions/mo"],
  },
] as const;

export const registrationSchema = z
  .object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    email: z.string().email("Enter a valid email"),
    phone: z.string().min(7, "Enter a valid phone number"),
    goals: z.string().min(10, "Tell us a bit more about your goals"),
    membershipPlan: z.enum(membershipPlans.map((plan) => plan.id) as [string, ...string[]]),
    addTraining: z.boolean().default(false),
    trainingFocus: z.string().optional(),
    trainerPreference: z.string().optional(),
    availability: z.string().optional(),
    consentPolicies: z.boolean(),
    consentComms: z.boolean().default(false),
    honeypot: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.addTraining) {
      if (!data.trainingFocus || data.trainingFocus.length < 5) {
        ctx.addIssue({
          path: ["trainingFocus"],
          code: z.ZodIssueCode.custom,
          message: "Share what you want to focus on",
        });
      }
      if (!data.trainerPreference || data.trainerPreference.length < 3) {
        ctx.addIssue({
          path: ["trainerPreference"],
          code: z.ZodIssueCode.custom,
          message: "Let us know trainer preferences",
        });
      }
      if (!data.availability || data.availability.length < 3) {
        ctx.addIssue({
          path: ["availability"],
          code: z.ZodIssueCode.custom,
          message: "Provide availability windows",
        });
      }
    }

    if (!data.consentPolicies) {
      ctx.addIssue({
        path: ["consentPolicies"],
        code: z.ZodIssueCode.custom,
        message: "You must accept gym policies",
      });
    }

    if (data.honeypot && data.honeypot.trim().length > 0) {
      ctx.addIssue({
        path: ["honeypot"],
        code: z.ZodIssueCode.custom,
        message: "Spam detection triggered",
      });
    }
  });

export type RegistrationFormData = z.infer<typeof registrationSchema>;

export type RegistrationPayload = RegistrationFormData & {
  id: string;
  createdAt: string;
};
