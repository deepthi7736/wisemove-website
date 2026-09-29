(function () {
  const API_URL = "http://localhost:5000/api/enquiries";

  document.addEventListener("submit", async function (event) {
    const form = event.target;

    if (!form.matches("[data-enquiry-form]")) {
      return;
    }

    event.preventDefault();
    event.stopImmediatePropagation();

    const status = form.querySelector("[data-form-status]");
    const button = form.querySelector('button[type="submit"]');

    const formData = new FormData(form);

    const data = {
      name: formData.get("name")?.trim() || "",
      email: formData.get("email")?.trim() || "",
      company: formData.get("company")?.trim() || "",
      phone: formData.get("phone")?.trim() || "",
      subject: formData.get("subject")?.trim() || "",
      message: formData.get("message")?.trim() || ""
    };

    if (!data.name || !data.email || !data.message) {
      if (status) {
        status.textContent = "Please fill in your name, email and message.";
      }
      return;
    }

    if (button) {
      button.disabled = true;
      button.dataset.originalText = button.innerHTML;
      button.innerHTML = "Sending...";
    }

    if (status) {
      status.textContent = "Sending your enquiry...";
    }

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to submit enquiry.");
      }

      if (status) {
        status.textContent =
          "Thank you! Your enquiry has been submitted successfully. We'll get back to you soon.";
      }

      form.reset();

    } catch (error) {
      console.error("Enquiry submission error:", error);

      if (status) {
        status.textContent =
          "Unable to submit your enquiry right now. Please try again.";
      }

    } finally {
      if (button) {
        button.disabled = false;
        button.innerHTML = button.dataset.originalText;
      }
    }
  }, true);
})();
