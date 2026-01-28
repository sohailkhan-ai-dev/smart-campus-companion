// Demo data
const feesData = [
  { sem: "Semester 1", amount: 40000, paid: true },
  { sem: "Semester 2", amount: 45000, paid: false }
];

let payments = [
  { id: 1011, date: "2025-08-10", amount: 20000, mode: "UPI" },
  { id: 1022, date: "2026-01-05", amount: 20000, mode: "Net Banking" }
];

const semTable = document.getElementById("semTable");
const paymentHistory = document.getElementById("paymentHistory");

function renderFees() {
  let total = 0;
  let paid = 0;

  semTable.innerHTML = feesData.map((f, idx) => {
    total += f.amount;
    if (f.paid) paid += f.amount;

    return `
      <tr>
        <td>${f.sem}</td>
        <td>₹${f.amount}</td>
        <td class="${f.paid ? "status-paid" : "status-pending"}">
          ${f.paid ? "Paid" : "Pending"}
        </td>
        <td>
          ${f.paid ? "—" : `<button class="pay-btn" onclick="payNow(${idx})">Pay Now</button>`}
        </td>
      </tr>
    `;
  }).join("");

  document.getElementById("totalFees").innerText = `₹${total}`;
  document.getElementById("paidFees").innerText = `₹${paid}`;
  document.getElementById("pendingFees").innerText = `₹${total - paid}`;
  document.getElementById("feeStatus").innerText =
    paid === total ? "✅ Fully Paid" : "⚠ Partially Paid";

  renderPayments();
}

function renderPayments() {
  paymentHistory.innerHTML = payments.map(p => `
    <div class="item">
      <strong>Receipt #${p.id}</strong><br>
      Date: ${new Date(p.date).toLocaleDateString()}<br>
      Amount: ₹${p.amount}<br>
      Mode: ${p.mode}
    </div>
  `).join("");
}

function payNow(index) {
  const fee = feesData[index];
  if (!fee || fee.paid) return;

  // Demo payment
  alert(`Redirecting to payment gateway for ${fee.sem}...`);

  fee.paid = true;
  payments.push({
    id: Math.floor(Math.random() * 9000 + 1000),
    date: new Date().toISOString().slice(0,10),
    amount: fee.amount,
    mode: "UPI"
  });

  renderFees();
}

renderFees();
