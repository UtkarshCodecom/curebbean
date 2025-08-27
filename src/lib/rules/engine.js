export function evaluate(answers) {
  // EXAMPLE rules; replace with client logic charts
  if (answers["chest_pain"] === "Yes") {
    return { level: "emergency", reason: "Chest pain reported" };
  }
  if (answers["fever"] === "≥24h" && answers["cough"] === "Productive") {
    return { level: "non-urgent", reason: "Prolonged fever with productive cough" };
  }
  return { level: "self-care", reason: "No red flags detected" };
}

export const DISCLAIMER =
  "This tool does not provide medical advice. For emergencies, call local emergency services.";
