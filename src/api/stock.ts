const API_URL = "http://localhost:5000/api/stock";

/* --------------------------------------------------
   GET ALL STOCK
-------------------------------------------------- */
export const getStock = async () => {
  const response = await fetch("http://localhost:5000/api/stock");

  if (!response.ok) {
    throw new Error("Failed to fetch stock");
  }

  return await response.json(); // MUST be an array
};

/* --------------------------------------------------
   CREATE STOCK ITEM
-------------------------------------------------- */
export async function createStock(data: any) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return res.json();
}

/* --------------------------------------------------
   UPDATE STOCK ITEM
-------------------------------------------------- */
export async function updateStock(id: number, data: any) {
  const res = await fetch(`http://localhost:5000/api/stock/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return res.json();
}

/* --------------------------------------------------
   DELETE STOCK ITEM
-------------------------------------------------- */
export async function deleteStock(id: number) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });
  return res.json();
}
