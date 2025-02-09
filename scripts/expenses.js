let buyPremiumBtn = document.getElementById("rzp-button1");
let premiumFeatures = document.getElementById("premium-features");
let premiumUserText = document.getElementById("premium-user-text");
let token;
let page;
let rowsPerPage;

window.addEventListener("DOMContentLoaded", () => {
  token = localStorage.getItem("token");
  let isPremiumUser = localStorage.getItem("isPremiumUser");
  if (isPremiumUser === "true") {
    buyPremiumBtn.style.display = "none";
    premiumFeatures.style.display = "block";
    premiumUserText.style.display = "block";
  }
  page = 1;

  rowsPerPage = parseInt(localStorage.getItem("rowsPerPage")) || 5;

  document.getElementById("rowsPerPage").value = rowsPerPage;
  getExpenses(page, rowsPerPage);
  getIncome();
});

document.getElementById("rzp-button1").onclick = async function (e) {
  const token = localStorage.getItem("token");
  const response = await axios.get(
    "http://localhost:3000/purchase/premiummembership",
    { headers: { Authorization: token } }
  );
  var options = {
    key: response.data.key_id,
    order_id: response.data.order.id,
    handler: async function (response) {
      const updateTransaction = await axios.post(
        "http://localhost:3000/purchase/updatetransactionstatus",
        {
          order_id: options.order_id,
          payment_id: response.razorpay_payment_id,
          status: "SUCCESSFUL",
        },
        { headers: { Authorization: token } }
      );

      localStorage.setItem("isPremiumUser", true);

      alert("you're a premium user");
      window.location.reload();
    },
  };
  const rzp1 = new Razorpay(options);
  rzp1.open();
  e.preventDefault();

  rzp1.on("payment.failed", async function (response) {
    await axios.post(
      "http://localhost:3000/purchase/updatetransactionstatus",
      {
        order_id: options.order_id,
        payment_id: null,
        status: "FAILED",
      },
      { headers: { Authorization: token } }
    );
    alert("sonething went wrong");
  });
};

document
  .getElementById("expense-form")
  .addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = {
      expense: event.target.expense.value,
      description: event.target.description.value,
      type: event.target.type.value,
    };
    resetForm();
    await axios.post("http://localhost:3000/expenses/addexpense", formData, {
      headers: { Authorization: token },
    });
    getExpenses(page, rowsPerPage);
  });

function resetForm() {
  document.getElementById("expense").value = "";
  document.getElementById("description").value = "";
  document.getElementById("type").value = "";
}

async function getExpenses(page, limit) {
  try {
    const expensesContainer = document.getElementById("expenses");
    const getExpenseResponse = await axios.get(
      `http://localhost:3000/expenses/getexpenses?page=${page}&limit=${limit}`,
      { headers: { Authorization: token } }
    );

    const expenses = getExpenseResponse.data.expenses;
    currentPage = getExpenseResponse.data.currentPage;
    totalPages = getExpenseResponse.data.totalPages;

    expensesContainer.innerHTML = ``;
    expenses.forEach((expense) => {
      const expenseData = document.createElement("p");
      expenseData.innerHTML = `
        ${expense.expense} - ${expense.description} - ${expense.type}
        <button onclick = "deleteExpense(${expense.id})">Delete</button>
        `;
      expenseData.id = "record-amount";
      expensesContainer.append(expenseData);
      showPagination(currentPage);
    });
  } catch (err) {
    console.error("get expenses error:", err);
  }
}

function updateRowsPerPage() {
  const rowsPerPageSelect = document.getElementById("rowsPerPage");
  rowsPerPage = parseInt(rowsPerPageSelect.value) || 5;
  localStorage.setItem("rowsPerPage", rowsPerPage);
  currentPage = 1;
  getExpenses(currentPage, rowsPerPage);
}

function showPagination(currentPage) {
  const paginationContainer = document.getElementById("pagination");
  paginationContainer.innerHTML = "";

  const prevButton = document.createElement("button");
  prevButton.textContent = "<";
  prevButton.disabled = currentPage === 1;
  prevButton.onclick = () => getExpenses(currentPage - 1, rowsPerPage);
  paginationContainer.appendChild(prevButton);

  const pageInfo = document.createElement("span");
  pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
  paginationContainer.appendChild(pageInfo);

  const nextButton = document.createElement("button");
  nextButton.textContent = ">";
  nextButton.disabled = currentPage === totalPages;
  nextButton.onclick = () => getExpenses(currentPage + 1, rowsPerPage);
  paginationContainer.appendChild(nextButton);
}

async function deleteExpense(expenseId) {
  await axios.delete(`http://localhost:3000/expenses/delete/${expenseId}`, {
    headers: { Authorization: token },
  });
  getExpenses(page, rowsPerPage);
}

async function getLeaderBoard() {
  const leaderBoardResponse = await axios.get(
    "http://localhost:3000/premium/leaderboard",
    { headers: { Authorization: token } }
  );
  const leaderboardContainer = document.getElementById("leaderboard");
  leaderboardContainer.style.display = "block";
  leaderboardContainer.innerHTML = "";
  leaderBoardResponse.data.forEach((lead) => {
    const leader = document.createElement("p");
    leader.innerHTML = `Name: ${lead.userName}  -  total expense: ${lead.totalExpense}`;
    leaderboardContainer.append(leader);
  });
}

async function filterExpenses(period) {
  document.getElementById("table-head").style.display = "flex";
  let filteredRecords = await axios.get(
    `http://localhost:3000/premium/filteredreport/${period}`,
    { headers: { Authorization: token } }
  );
  const recordsTable = document.getElementById("records-table");
  recordsTable.innerHTML = "";
  let tableRows = "";
  filteredRecords.data.forEach((record) => {
    const recordDate = record.updatedAt
      .split("T")[0]
      .replace(/\s+/g, "")
      .trim();
    const row = `<tr>
        <td>${recordDate}</td>
        <td>${record.description}</td>
        <td>${record.type ? record.type : ""}</td>
        <td>${record.expense ? record.expense : "-"}</td>
        <td>${record.income ? record.income : "-"}</td>
    </tr>`;
    tableRows += row;
  });
  recordsTable.innerHTML += tableRows;
}

async function downloadReport() {
  document
    .getElementById("download-btn")
    .addEventListener("click", async function () {
      const downloadResponse = await axios.get(
        `http://localhost:3000/download/downloadreport`,
        { headers: { Authorization: token } }
      );
      console.log(downloadResponse);
      if (downloadResponse.status === 200 && downloadResponse.data.fileURL) {
        var a = document.createElement("a");
        a.href = downloadResponse.data.fileURL;
        a.download = "myexpenditures.csv";
        a.click();
      } else {
        console.error("No file URL received or download failed");
      }
    });
}

document
  .getElementById("income-form")
  .addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = {
      income: event.target.income.value,
      description: event.target.description.value,
    };
    event.target.income.value = "";
    event.target.description.value = "";

    const incomeResponse = await axios.post(
      "http://localhost:3000/income/addincome",
      formData,
      {
        headers: { Authorization: token },
      }
    );

    getIncome();
  });

async function getIncome() {
  const incomeContainer = document.getElementById("income-container");
  const getIncomeResponse = await axios.get(
    "http://localhost:3000/income/getincome",
    { headers: { Authorization: token } }
  );

  incomeContainer.innerHTML = ``;
  getIncomeResponse.data.forEach((income) => {
    const incomeData = document.createElement("p");
    incomeData.innerHTML = `
        ${income.income} - ${income.description}
        <button onclick = "deleteIncome(${income.id})">Delete</button>
        `;

    incomeContainer.append(incomeData);
  });
}

async function deleteIncome(incomeId) {
  await axios.delete(`http://localhost:3000/income/delete/${incomeId}`, {
    headers: { Authorization: token },
  });
  getIncome();
}
