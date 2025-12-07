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
  const win = window.open("", "_blank");
  if (!win) return;

  const itemsRows = data.items
    .map(
      (item: any) => `
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #f2f2f2;">${item.description}</td>
          <td style="padding: 10px 0; text-align:center; border-bottom: 1px solid #f2f2f2;">${item.quantity}</td>
          <td style="padding: 10px 0; text-align:right; border-bottom: 1px solid #f2f2f2;">₹${item.price}</td>
          <td style="padding: 10px 0; text-align:right; border-bottom: 1px solid #f2f2f2;">₹${item.total}</td>
        </tr>
      `
    )
    .join("");

  win.document.write(`
    <html>
      <head>
        <title>Invoice</title>

        <style>
          body {
            font-family: 'Georgia', serif;
            background: #fcf8f6;
            margin: 0;
            padding: 0;
          }

          .invoice-container {
            width: 780px;
            margin: 40px auto;
            padding: 40px 50px;
            background: white;
            box-shadow: 0 0 5px rgba(0,0,0,0.1);

            /* Footer fix */
            min-height: 1000px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
          }

          .header-title {
            font-size: 46px;
            font-weight: bold;
            color: #d65c28;
            margin-bottom: 6px;
          }

          .invoice-number {
            font-size: 14px;
            color: #d65c28;
            margin-top: -4px;
          }

          .flex {
            display: flex;
            justify-content: space-between;
          }

          .right-contact {
            text-align: right;
            font-size: 14px;
          }

          .right-contact-title {
            color: #d65c28;
            font-weight: bold;
          }

          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 35px;
          }

          th {
            color: #d65c28;
            font-size: 13px;
            padding-bottom: 8px;
            border-bottom: 1px solid #eee;
            text-align: left;
            letter-spacing: 0.5px;
          }

          td {
            font-size: 14px;
          }

          .summary {
            width: 260px;
            margin-left: auto;
            margin-top: 30px;
          }

          .summary td {
            padding: 5px 0;
          }

          .summary .grand-total {
            font-size: 18px;
            font-weight: bold;
            border-top: 2px solid #aaa;
            padding-top: 8px;
            color: #d65c28;
          }

          .date-issued {
            margin-top: 30px;
            font-size: 13px;
          }

          .bottom-line {
            border-top: 4px solid #d65c28;
            margin: 40px 0 30px 0;
          }

          .footer {
            font-size: 13px;
            line-height: 20px;
          }

          .footer-logo {
            text-align: right;
          }

          .footer-logo-name {
            color: #d65c28;
            font-size: 16px;
            font-weight: bold;
            letter-spacing: 1px;
          }
        </style>

      </head>

      <body>
        <div class="invoice-container">

          <div>
            <div class="flex">
              <div>
                <div class="header-title">INVOICE</div>
                <div class="invoice-number">INVOICE#: ${data.billNumber}</div>
              </div>

              <div class="right-contact">
                <div class="right-contact-title">CUSTOMER CONTACT</div>
                ${data.customerName}<br/>
                ${data.billDate}<br/>
                ${data.paymentMode}
              </div>
            </div>

            <table>
              <thead>
                <tr>
                  <th>Description</th>
                  <th style="text-align:center;">QTY</th>
                  <th style="text-align:right;">PRICE</th>
                  <th style="text-align:right;">TOTAL</th>
                </tr>
              </thead>
              <tbody>${itemsRows}</tbody>
            </table>

            <table class="summary">
              <tr>
                <td>Subtotal:</td>
                <td style="text-align:right;">₹${data.subtotal}</td>
              </tr>
              <tr>
                <td>Tax (18%):</td>
                <td style="text-align:right;">₹${(data.subtotal * 0.18).toFixed(2)}</td>
              </tr>
              <tr>
                <td class="grand-total">Total:</td>
                <td class="grand-total" style="text-align:right;">₹${(data.subtotal * 1.18).toFixed(2)}</td>
              </tr>
            </table>
          </div>

          <!-- FIXED BOTTOM FOOTER -->
          <div style="margin-top:auto;">
            <div class="bottom-line"></div>

            <div style="display:flex; justify-content:space-between; align-items:flex-start;">
              <div class="footer">
                Fresh Soft Tissue Enterprises <br>
                6-27-700 Park Ave <br>
                Pune, Maharashtra <br>
                411006 <br>
                fsenterprises523@gmail.com <br>
                www.fsenterprise.com
              </div>

              <div class="footer-logo">
                <div class="footer-logo-name">BRAND KIT</div>
              </div>
            </div>
          </div>

        </div>

        <script>
          window.print();
          setTimeout(() => window.close(), 400);
        </script>

      </body>
    </html>
  `);

  win.document.close();
}
