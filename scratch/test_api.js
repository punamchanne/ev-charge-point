async function test() {
  try {
    const res = await fetch("http://localhost:3000/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ name: "test", email: "test@test.com", password: "password" }),
      headers: { "Content-Type": "application/json" }
    });
    console.log("Status:", res.status);
    const text = await res.text();
    console.log("Response starts with:", text.substring(0, 100));
  } catch (err) {
    console.error("Fetch failed:", err);
  }
}
test();
