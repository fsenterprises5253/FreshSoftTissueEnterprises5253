import React, { useState } from "react";

const InvoiceForm: React.FC = () => {
  const [invoiceData, setInvoiceData] = useState({
    invoiceNo: "",
    branch: "",
    salesman: "",
    date: "",
    customer: "",
    items: [{ partNo: "", description: "", brand: "", qty: "", price: "", amount: "" }],
  });

  const handleItemChange = (index: number, field: string, value: string) => {
    const updatedItems = [...invoiceData.items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    setInvoiceData({ ...invoiceData, items: updatedItems });
  };

  const addItem = () => {
    setInvoiceData({
      ...invoiceData,
      items: [...invoiceData.items, { partNo: "", description: "", brand: "", qty: "", price: "", amount: "" }],
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-5xl mx-auto border">
      <h2 className="text-center text-xl font-bold mb-4 uppercase">
        Al-Shamali Intl. Co. Auto Parts Center
      </h2>
      <h3 className="text-center text-gray-700 mb-4">EZZY STORE — Credit Invoice</h3>

      {/* Invoice Header */}
      <div className="grid grid-cols-2 gap-4 border p-4 mb-4">
        <div>
          <label className="block text-sm font-medium">Invoice #</label>
          <input
            type="text"
            value={invoiceData.invoiceNo}
            onChange={(e) => setInvoiceData({ ...invoiceData, invoiceNo: e.target.value })}
            className="w-full border rounded-md p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Date</label>
          <input
            type="date"
            value={invoiceData.date}
            onChange={(e) => setInvoiceData({ ...invoiceData, date: e.target.value })}
            className="w-full border rounded-md p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Branch</label>
          <input
            type="text"
            value={invoiceData.branch}
            onChange={(e) => setInvoiceData({ ...invoiceData, branch: e.target.value })}
            className="w-full border rounded-md p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Salesman</label>
          <input
            type="text"
            value={invoiceData.salesman}
            onChange={(e) => setInvoiceData({ ...invoiceData, salesman: e.target.value })}
            className="w-full border rounded-md p-2"
          />
        </div>
      </div>

      {/* Customer */}
      <div className="mb-4">
        <label className="block text-sm font-medium">Customer (Messers)</label>
        <input
          type="text"
          value={invoiceData.customer}
          onChange={(e) => setInvoiceData({ ...invoiceData, customer: e.target.value })}
          className="w-full border rounded-md p-2"
        />
      </div>

      {/* Table */}
      <table className="w-full border-collapse border text-sm mb-6">
        <thead className="bg-gray-100 border">
          <tr>
            <th className="border p-2">S.No</th>
            <th className="border p-2">Part No.</th>
            <th className="border p-2">Description</th>
            <th className="border p-2">Brand</th>
            <th className="border p-2">Qty</th>
            <th className="border p-2">U-Price</th>
            <th className="border p-2">Amount</th>
          </tr>
        </thead>
        <tbody>
          {invoiceData.items.map((item, index) => (
            <tr key={index}>
              <td className="border p-2 text-center">{index + 1}</td>
              <td className="border p-2">
                <input
                  type="text"
                  value={item.partNo}
                  onChange={(e) => handleItemChange(index, "partNo", e.target.value)}
                  className="w-full border-none"
                />
              </td>
              <td className="border p-2">
                <input
                  type="text"
                  value={item.description}
                  onChange={(e) => handleItemChange(index, "description", e.target.value)}
                  className="w-full border-none"
                />
              </td>
              <td className="border p-2">
                <input
                  type="text"
                  value={item.brand}
                  onChange={(e) => handleItemChange(index, "brand", e.target.value)}
                  className="w-full border-none"
                />
              </td>
              <td className="border p-2">
                <input
                  type="number"
                  value={item.qty}
                  onChange={(e) => handleItemChange(index, "qty", e.target.value)}
                  className="w-full border-none"
                />
              </td>
              <td className="border p-2">
                <input
                  type="number"
                  value={item.price}
                  onChange={(e) => handleItemChange(index, "price", e.target.value)}
                  className="w-full border-none"
                />
              </td>
              <td className="border p-2 text-right">
                {(Number(item.qty) * Number(item.price) || 0).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button
        onClick={addItem}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        + Add Row
      </button>

      {/* Footer */}
      <div className="mt-6 flex justify-between items-center border-t pt-4">
        <p className="text-sm">Receiver ___________________</p>
        <p className="text-sm">Signature ___________________</p>
      </div>

      <div className="text-center mt-6">
        <button
          onClick={handlePrint}
          className="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700"
        >
          Print Invoice
        </button>
      </div>
    </div>
  );
};

export default InvoiceForm;
