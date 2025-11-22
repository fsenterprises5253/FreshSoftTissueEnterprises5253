export interface PrintBillData {
  billNumber?: string;
  customerName: string;
  billDate?: string;
  paymentMode?: string;
  items: {
    gsm_number: number | string;
    description: string;
    quantity: number;
    price: number;
    total: number;
  }[];
  subtotal: number;
}

export function printBillInvoice(data: any) {
  console.log("PRINT DATA =>", data);

  const win = window.open("", "_blank");
  if (!win) {
    alert("Popup blocked! Allow popups for printing.");
    return;
  }

  win.document.write(`
    <html>
      <head>
        <title>Invoice</title>
        <style>
          body { font-family: Arial; padding: 20px; }
          table { border-collapse: collapse; width: 100%; }
          th, td { border: 1px solid #ddd; padding: 8px; }
          th { background: #f3f3f3; }
        </style>
      </head>
      <body>
        <h2>Invoice ${data.billNumber}</h2>
        <p><b>Customer:</b> ${data.customerName}</p>
        <p><b>Date:</b> ${data.billDate}</p>
        <p><b>Payment Mode:</b> ${data.paymentMode}</p>

        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>GSM</th>
              <th>Description</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${data.items.map((it: any, i: number) => `
              <tr>
                <td>${i + 1}</td>
                <td>${it.gsm_number}</td>
                <td>${it.description}</td>
                <td>${it.quantity}</td>
                <td>₹${it.price}</td>
                <td>₹${it.total}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>

        <h3 style="text-align:right">
          Total: ₹${data.subtotal}
        </h3>

        <script>
          window.print();
          setTimeout(() => window.close(), 300);
        </script>
      </body>
    </html>
  `);

  win.document.close();
}
