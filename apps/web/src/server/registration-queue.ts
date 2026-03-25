import type { RegistrationPayload } from "@/lib/registration";

const queue: RegistrationPayload[] = [];

export function enqueueRegistration(payload: RegistrationPayload) {
  queue.push(payload);
}

export function getPendingRegistrations() {
  return queue;
}

export function triggerNotificationHooks(payload: RegistrationPayload) {
  const message = `New registration from ${payload.firstName} ${payload.lastName} (${payload.membershipPlan})`;
  console.info("[registration] sales notification →", message);
  if (payload.addTraining) {
    console.info("[registration] trainer notification →", payload.trainingFocus);
  }
}
