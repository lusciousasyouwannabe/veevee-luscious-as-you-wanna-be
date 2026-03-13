import { useState, useRef } from "react";
import logo from "@/assets/logo-black-gold.png";
import bgImage from "@/assets/invoice-bg-lavender.jpg";

interface LineItem {
  id: number;
  description: string;
  quantity: number;
  rate: number;
}

const Invoice = () => {
  const printRef = useRef<HTMLDivElement>(null);

  const [invoiceNumber, setInvoiceNumber] = useState("INV-001");
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split("T")[0]);
  const [dueDate, setDueDate] = useState("");
  const [billTo, setBillTo] = useState({ name: "", address: "", email: "", phone: "" });
  const [notes, setNotes] = useState("");
  const [items, setItems] = useState<LineItem[]>([
    { id: 1, description: "", quantity: 1, rate: 0 },
  ]);

  const addItem = () =>
    setItems([...items, { id: Date.now(), description: "", quantity: 1, rate: 0 }]);

  const removeItem = (id: number) =>
    setItems(items.filter((i) => i.id !== id));

  const updateItem = (id: number, field: keyof LineItem, value: string | number) =>
    setItems(items.map((i) => (i.id === id ? { ...i, [field]: value } : i)));

  const subtotal = items.reduce((sum, i) => sum + i.quantity * i.rate, 0);
  const tax = subtotal * 0; // adjust tax rate as needed
  const total = subtotal + tax;

  const handlePrint = () => window.print();

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-fixed bg-no-repeat text-[hsl(40,20%,90%)] font-[var(--font-body)]"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* Dark overlay for readability */}
      <div className="min-h-screen bg-black/60 backdrop-blur-[2px]">
      {/* Controls - hidden on print */}
      <div className="print:hidden sticky top-0 z-50 bg-[hsl(0,0%,8%)] border-b border-[hsl(40,15%,18%)] px-6 py-3 flex items-center justify-between">
        <a href="/" className="text-sm text-[hsl(40,10%,55%)] hover:text-[hsl(43,72%,55%)] transition-colors">
          ← Back to site
        </a>
        <button
          onClick={handlePrint}
          className="border border-[hsl(43,72%,55%)] text-[hsl(43,72%,55%)] font-[var(--font-body)] text-xs tracking-[0.15em] uppercase px-6 py-2 hover:bg-[hsl(43,72%,55%)] hover:text-[hsl(0,0%,5%)] transition-all duration-300"
        >
          Print / Save PDF
        </button>
      </div>

      <div ref={printRef} className="max-w-3xl mx-auto px-6 py-12 print:py-6 print:px-0 print:max-w-none print:bg-white print:text-black">
        {/* Header */}
        <div className="flex items-start justify-between mb-12">
          <div>
            <img src={logo} alt="VeeVee Luscious" className="w-28 h-28 object-contain mb-3" />
            <p className="text-xs tracking-[0.2em] uppercase text-[hsl(43,72%,55%)] print:text-[#b8963e]">
              Luscious As You Wanna Be
            </p>
          </div>
          <div className="text-right space-y-1">
            <h1 className="font-[var(--font-display)] text-3xl font-bold text-[hsl(43,72%,55%)] print:text-[#b8963e]">
              INVOICE
            </h1>
            <div className="flex items-center justify-end gap-2">
              <label className="text-xs text-[hsl(40,10%,55%)] print:text-gray-500">#</label>
              <input
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                className="bg-transparent border-b border-[hsl(40,15%,18%)] print:border-gray-300 text-right text-sm w-32 focus:outline-none focus:border-[hsl(43,72%,55%)]"
              />
            </div>
            <div className="flex items-center justify-end gap-2">
              <label className="text-xs text-[hsl(40,10%,55%)] print:text-gray-500">Date</label>
              <input
                type="date"
                value={invoiceDate}
                onChange={(e) => setInvoiceDate(e.target.value)}
                className="bg-transparent border-b border-[hsl(40,15%,18%)] print:border-gray-300 text-right text-sm w-36 focus:outline-none focus:border-[hsl(43,72%,55%)]"
              />
            </div>
            <div className="flex items-center justify-end gap-2">
              <label className="text-xs text-[hsl(40,10%,55%)] print:text-gray-500">Due</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="bg-transparent border-b border-[hsl(40,15%,18%)] print:border-gray-300 text-right text-sm w-36 focus:outline-none focus:border-[hsl(43,72%,55%)]"
              />
            </div>
          </div>
        </div>

        {/* Bill To */}
        <div className="mb-10">
          <p className="text-xs tracking-[0.2em] uppercase text-[hsl(43,72%,55%)] print:text-[#b8963e] mb-3">Bill To</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              placeholder="Client Name"
              value={billTo.name}
              onChange={(e) => setBillTo({ ...billTo, name: e.target.value })}
              className="bg-transparent border-b border-[hsl(40,15%,18%)] print:border-gray-300 text-sm py-1 focus:outline-none focus:border-[hsl(43,72%,55%)] placeholder:text-[hsl(40,10%,35%)] print:placeholder:text-gray-400"
            />
            <input
              placeholder="Email"
              value={billTo.email}
              onChange={(e) => setBillTo({ ...billTo, email: e.target.value })}
              className="bg-transparent border-b border-[hsl(40,15%,18%)] print:border-gray-300 text-sm py-1 focus:outline-none focus:border-[hsl(43,72%,55%)] placeholder:text-[hsl(40,10%,35%)] print:placeholder:text-gray-400"
            />
            <input
              placeholder="Address"
              value={billTo.address}
              onChange={(e) => setBillTo({ ...billTo, address: e.target.value })}
              className="bg-transparent border-b border-[hsl(40,15%,18%)] print:border-gray-300 text-sm py-1 focus:outline-none focus:border-[hsl(43,72%,55%)] placeholder:text-[hsl(40,10%,35%)] print:placeholder:text-gray-400"
            />
            <input
              placeholder="Phone"
              value={billTo.phone}
              onChange={(e) => setBillTo({ ...billTo, phone: e.target.value })}
              className="bg-transparent border-b border-[hsl(40,15%,18%)] print:border-gray-300 text-sm py-1 focus:outline-none focus:border-[hsl(43,72%,55%)] placeholder:text-[hsl(40,10%,35%)] print:placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* Line Items */}
        <div className="mb-8">
          <div className="grid grid-cols-[1fr_80px_100px_100px_40px] gap-2 text-xs tracking-[0.15em] uppercase text-[hsl(43,72%,55%)] print:text-[#b8963e] border-b border-[hsl(43,72%,55%)] print:border-[#b8963e] pb-2 mb-3">
            <span>Description</span>
            <span className="text-center">Qty</span>
            <span className="text-right">Rate</span>
            <span className="text-right">Amount</span>
            <span className="print:hidden" />
          </div>

          {items.map((item) => (
            <div
              key={item.id}
              className="grid grid-cols-[1fr_80px_100px_100px_40px] gap-2 items-center mb-2"
            >
              <input
                placeholder="Item description"
                value={item.description}
                onChange={(e) => updateItem(item.id, "description", e.target.value)}
                className="bg-transparent border-b border-[hsl(40,15%,18%)] print:border-gray-300 text-sm py-1 focus:outline-none focus:border-[hsl(43,72%,55%)] placeholder:text-[hsl(40,10%,35%)] print:placeholder:text-gray-400"
              />
              <input
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) => updateItem(item.id, "quantity", parseInt(e.target.value) || 0)}
                className="bg-transparent border-b border-[hsl(40,15%,18%)] print:border-gray-300 text-sm py-1 text-center focus:outline-none focus:border-[hsl(43,72%,55%)]"
              />
              <input
                type="number"
                min="0"
                step="0.01"
                value={item.rate || ""}
                onChange={(e) => updateItem(item.id, "rate", parseFloat(e.target.value) || 0)}
                className="bg-transparent border-b border-[hsl(40,15%,18%)] print:border-gray-300 text-sm py-1 text-right focus:outline-none focus:border-[hsl(43,72%,55%)]"
                placeholder="0.00"
              />
              <p className="text-sm text-right">${(item.quantity * item.rate).toFixed(2)}</p>
              <button
                onClick={() => removeItem(item.id)}
                className="print:hidden text-[hsl(40,10%,35%)] hover:text-[hsl(0,84%,60%)] text-lg leading-none"
                title="Remove"
              >
                ×
              </button>
            </div>
          ))}

          <button
            onClick={addItem}
            className="print:hidden mt-3 text-xs tracking-[0.15em] uppercase text-[hsl(43,72%,55%)] hover:text-[hsl(43,80%,70%)] transition-colors"
          >
            + Add Line Item
          </button>
        </div>

        {/* Totals */}
        <div className="flex justify-end mb-10">
          <div className="w-64 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-[hsl(40,10%,55%)] print:text-gray-500">Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm border-b border-[hsl(40,15%,18%)] print:border-gray-300 pb-2">
              <span className="text-[hsl(40,10%,55%)] print:text-gray-500">Tax</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-[var(--font-display)] text-xl font-bold text-[hsl(43,72%,55%)] print:text-[#b8963e]">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div>
          <p className="text-xs tracking-[0.2em] uppercase text-[hsl(43,72%,55%)] print:text-[#b8963e] mb-2">Notes</p>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Payment terms, thank you message, etc."
            rows={3}
            className="w-full bg-transparent border border-[hsl(40,15%,18%)] print:border-gray-300 text-sm p-3 focus:outline-none focus:border-[hsl(43,72%,55%)] placeholder:text-[hsl(40,10%,35%)] print:placeholder:text-gray-400 resize-none"
          />
        </div>

        {/* Footer */}
        <div className="mt-12 pt-6 border-t border-[hsl(40,15%,18%)] print:border-gray-300 text-center">
          <p className="text-xs text-[hsl(40,10%,55%)] print:text-gray-500">
            VeeVee Luscious · Luscious As You Wanna Be · Thank you for your business
          </p>
        </div>
      </div>
    </div>
  );
};

export default Invoice;
