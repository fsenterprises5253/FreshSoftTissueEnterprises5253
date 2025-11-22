export async function getUsers() {
  const res = await fetch("http://localhost:5000/users");
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
}
