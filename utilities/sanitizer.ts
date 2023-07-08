// sanitises the lab name for the cloud
export function sanitizeLabName(labName: string) {
  return labName.replace(/\s+/g, "-").toLowerCase();
}
