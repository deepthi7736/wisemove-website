const API_URL = "http://localhost:5000/api/enquiries";

let enquiries = [];

document.addEventListener("DOMContentLoaded", () => {
    loadEnquiries();

    const refreshBtn = document.getElementById("refreshBtn");
    if (refreshBtn) {
        refreshBtn.addEventListener("click", loadEnquiries);
    }

    const searchInput = document.getElementById("searchInput");
    if (searchInput) {
        searchInput.addEventListener("input", renderEnquiries);
    }

    const statusFilter = document.getElementById("statusFilter");
    if (statusFilter) {
        statusFilter.addEventListener("change", renderEnquiries);
    }

    const addBtn = document.getElementById("addEnquiryBtn");
    if (addBtn) {
        addBtn.addEventListener("click", openAddModal);
    }

    const cancelBtn = document.getElementById("cancelBtn");
    if (cancelBtn) {
        cancelBtn.addEventListener("click", closeModal);
    }

    const enquiryForm = document.getElementById("enquiryForm");
    if (enquiryForm) {
        enquiryForm.addEventListener("submit", saveEnquiry);
    }
});


// ========================================
// LOAD ENQUIRIES
// ========================================

async function loadEnquiries() {
    const loading = document.getElementById("loading");
    const error = document.getElementById("error");

    if (loading) {
        loading.hidden = false;
        loading.textContent = "Loading enquiries...";
    }

    if (error) {
        error.hidden = true;
        error.textContent = "";
    }

    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error(`Server returned ${response.status}`);
        }

        const data = await response.json();

        console.log("API response:", data);

        if (!data.success) {
            throw new Error(data.message || "Failed to load enquiries");
        }

        enquiries = Array.isArray(data.enquiries)
            ? data.enquiries
            : [];

        renderEnquiries();
        updateStats();

    } catch (err) {
        console.error("Error loading enquiries:", err);

        if (error) {
            error.textContent =
                "Unable to load enquiries. Make sure the backend is running on port 5000.";
            error.hidden = false;
        }

        const tbody = document.getElementById("enquiryBody");

        if (tbody) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="8" style="text-align:center;">
                        Failed to load enquiries.
                    </td>
                </tr>
            `;
        }

    } finally {
        if (loading) {
            loading.hidden = true;
        }
    }
}


// ========================================
// RENDER ENQUIRIES
// ========================================

function renderEnquiries() {
    const tbody = document.getElementById("enquiryBody");

    if (!tbody) {
        console.error("Element #enquiryBody not found.");
        return;
    }

    const searchInput = document.getElementById("searchInput");
    const statusFilter = document.getElementById("statusFilter");

    const search = searchInput
        ? searchInput.value.toLowerCase().trim()
        : "";

    const status = statusFilter
        ? statusFilter.value
        : "all";

    let filtered = enquiries.filter((enquiry) => {

        const searchText = `
            ${enquiry.name || ""}
            ${enquiry.email || ""}
            ${enquiry.company || ""}
            ${enquiry.phone || ""}
            ${enquiry.message || ""}
        `.toLowerCase();

        const matchesSearch = searchText.includes(search);

        const matchesStatus =
            status === "all" ||
            !status ||
            (enquiry.status || "New").toLowerCase() ===
            status.toLowerCase();

        return matchesSearch && matchesStatus;
    });

    if (filtered.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" style="text-align:center; padding:30px;">
                    No enquiries found.
                </td>
            </tr>
        `;

        return;
    }

    tbody.innerHTML = filtered.map((enquiry) => {

        const id = enquiry._id || enquiry.id;

        return `
            <tr>

                <td>
                    ${escapeHTML(enquiry.name || "-")}
                </td>

                <td>
                    ${escapeHTML(enquiry.email || "-")}
                </td>

                <td>
                    ${escapeHTML(enquiry.company || "-")}
                </td>

                <td>
                    ${escapeHTML(enquiry.phone || "-")}
                </td>

                <td>
                    ${escapeHTML(enquiry.message || "-")}
                </td>

                <td>
                    <span class="status status-${(enquiry.status || "New").toLowerCase()}">
                        ${escapeHTML(enquiry.status || "New")}
                    </span>
                </td>

                <td>
                    ${formatDate(enquiry.createdAt)}
                </td>

                <td>
                    <button
                        class="btn btn-small"
                        onclick="editEnquiry('${id}')">
                        Edit
                    </button>

                    <button
                        class="btn btn-small btn-danger"
                        onclick="deleteEnquiry('${id}')">
                        Delete
                    </button>
                </td>

            </tr>
        `;
    }).join("");
}


// ========================================
// UPDATE STATISTICS
// ========================================

function updateStats() {

    const totalElement = document.getElementById("totalCount");
    const newElement = document.getElementById("newCount");
    const contactedElement = document.getElementById("contactedCount");

    const total = enquiries.length;

    const newCount = enquiries.filter(
        enquiry =>
            (enquiry.status || "New").toLowerCase() === "new"
    ).length;

    const contactedCount = enquiries.filter(
        enquiry =>
            (enquiry.status || "").toLowerCase() === "contacted"
    ).length;

    if (totalElement) {
        totalElement.textContent = total;
    }

    if (newElement) {
        newElement.textContent = newCount;
    }

    if (contactedElement) {
        contactedElement.textContent = contactedCount;
    }
}


// ========================================
// OPEN ADD MODAL
// ========================================

function openAddModal() {

    const modal = document.getElementById("modal");
    const form = document.getElementById("enquiryForm");

    if (form) {
        form.reset();

        const idInput = document.getElementById("enquiryId");

        if (idInput) {
            idInput.value = "";
        }
    }

    if (modal) {
        modal.hidden = false;
    }
}


// ========================================
// CLOSE MODAL
// ========================================

function closeModal() {

    const modal = document.getElementById("modal");

    if (modal) {
        modal.hidden = true;
    }
}


// ========================================
// EDIT ENQUIRY
// ========================================

window.editEnquiry = function (id) {

    const enquiry = enquiries.find(
        item => String(item._id || item.id) === String(id)
    );

    if (!enquiry) {
        alert("Enquiry not found.");
        return;
    }

    const modal = document.getElementById("modal");

    if (!modal) {
        alert("Edit modal not found.");
        return;
    }

    const idInput = document.getElementById("enquiryId");
    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const companyInput = document.getElementById("company");
    const phoneInput = document.getElementById("phone");
    const messageInput = document.getElementById("message");
    const statusInput = document.getElementById("status");

    if (idInput) idInput.value = enquiry._id || enquiry.id || "";
    if (nameInput) nameInput.value = enquiry.name || "";
    if (emailInput) emailInput.value = enquiry.email || "";
    if (companyInput) companyInput.value = enquiry.company || "";
    if (phoneInput) phoneInput.value = enquiry.phone || "";
    if (messageInput) messageInput.value = enquiry.message || "";

    if (statusInput) {
        statusInput.value = enquiry.status || "New";
    }

    modal.hidden = false;
};


// ========================================
// SAVE ENQUIRY
// ========================================

async function saveEnquiry(event) {

    event.preventDefault();

    const id =
        document.getElementById("enquiryId")?.value.trim();

    const name =
        document.getElementById("name")?.value.trim();

    const email =
        document.getElementById("email")?.value.trim();

    const company =
        document.getElementById("company")?.value.trim();

    const phone =
        document.getElementById("phone")?.value.trim();

    const message =
        document.getElementById("message")?.value.trim();

    const status =
        document.getElementById("status")?.value || "New";

    if (!name || !email || !message) {
        alert("Name, email and message are required.");
        return;
    }

    const enquiryData = {
        name,
        email,
        company,
        phone,
        message,
        status
    };

    try {

        let response;

        if (id) {

            response = await fetch(`${API_URL}/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(enquiryData)
            });

        } else {

            response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(enquiryData)
            });

        }

        const data = await response.json();

        if (!response.ok || !data.success) {
            throw new Error(
                data.message || "Failed to save enquiry"
            );
        }

        alert(
            id
                ? "Enquiry updated successfully."
                : "Enquiry created successfully."
        );

        closeModal();

        await loadEnquiries();

    } catch (error) {

        console.error("Save error:", error);

        alert(
            "Could not save enquiry. Check the backend terminal."
        );
    }
}


// ========================================
// DELETE ENQUIRY
// ========================================

window.deleteEnquiry = async function (id) {

    const confirmed = confirm(
        "Are you sure you want to delete this enquiry?"
    );

    if (!confirmed) {
        return;
    }

    try {

        const response = await fetch(
            `${API_URL}/${id}`,
            {
                method: "DELETE"
            }
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
            throw new Error(
                data.message || "Failed to delete enquiry"
            );
        }

        alert("Enquiry deleted successfully.");

        await loadEnquiries();

    } catch (error) {

        console.error("Delete error:", error);

        alert(
            "Could not delete enquiry. Check the backend terminal."
        );
    }
};


// ========================================
// FORMAT DATE
// ========================================

function formatDate(date) {

    if (!date) {
        return "-";
    }

    const formattedDate = new Date(date);

    if (Number.isNaN(formattedDate.getTime())) {
        return "-";
    }

    return formattedDate.toLocaleString();
}


// ========================================
// HTML ESCAPING
// ========================================

function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}