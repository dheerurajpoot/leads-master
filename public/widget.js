(function () {
	"use strict";

	// Widget configuration
	const config = {
		apiUrl: "https://yourdomain.com/api/leads",
		theme: "light", // or 'dark'
		width: "100%",
		height: "auto",
	};

	// Create widget container
	function createWidget() {
		const widget = document.createElement("div");
		widget.id = "leads-master-widget";
		widget.innerHTML = `
      <div class="lm-widget-container" style="
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        max-width: 500px;
        margin: 0 auto;
        background: white;
        border-radius: 12px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        overflow: hidden;
      ">
        <div class="lm-header" style="
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 24px;
          text-align: center;
        ">
          <h3 style="margin: 0; font-size: 20px; font-weight: 600;">
            Apply for a Business Loan
          </h3>
          <p style="margin: 8px 0 0 0; opacity: 0.9; font-size: 14px;">
            Get quick approval in 24 hours
          </p>
        </div>
        
        <div class="lm-form" style="padding: 24px;">
          <form id="lm-lead-form">
            <div style="margin-bottom: 20px;">
              <label style="display: block; margin-bottom: 8px; font-weight: 500; color: #374151;">
                Full Name *
              </label>
              <input type="text" name="name" required style="
                width: 100%;
                padding: 12px;
                border: 2px solid #e5e7eb;
                border-radius: 8px;
                font-size: 16px;
                transition: border-color 0.2s;
                box-sizing: border-box;
              " placeholder="Enter your full name">
            </div>
            
            <div style="margin-bottom: 20px;">
              <label style="display: block; margin-bottom: 8px; font-weight: 500; color: #374151;">
                Phone Number *
              </label>
              <input type="tel" name="phone" required style="
                width: 100%;
                padding: 12px;
                border: 2px solid #e5e7eb;
                border-radius: 8px;
                font-size: 16px;
                transition: border-color 0.2s;
                box-sizing: border-box;
              " placeholder="Enter your phone number">
            </div>
            
            <div style="margin-bottom: 20px;">
              <label style="display: block; margin-bottom: 8px; font-weight: 500; color: #374151;">
                Email *
              </label>
              <input type="email" name="email" required style="
                width: 100%;
                padding: 12px;
                border: 2px solid #e5e7eb;
                border-radius: 8px;
                font-size: 16px;
                transition: border-color 0.2s;
                box-sizing: border-box;
              " placeholder="Enter your email">
            </div>
            
            <div style="margin-bottom: 20px;">
              <label style="display: block; margin-bottom: 8px; font-weight: 500; color: #374151;">
                City
              </label>
              <input type="text" name="city" style="
                width: 100%;
                padding: 12px;
                border: 2px solid #e5e7eb;
                border-radius: 8px;
                font-size: 16px;
                transition: border-color 0.2s;
                box-sizing: border-box;
              " placeholder="Enter your city">
            </div>
            
            <div style="margin-bottom: 24px;">
              <label style="display: block; margin-bottom: 8px; font-weight: 500; color: #374151;">
                Loan Amount
              </label>
              <input type="number" name="loanAmount" min="0" style="
                width: 100%;
                padding: 12px;
                border: 2px solid #e5e7eb;
                border-radius: 8px;
                font-size: 16px;
                transition: border-color 0.2s;
                box-sizing: border-box;
              " placeholder="Enter loan amount">
            </div>
            
            <button type="submit" id="lm-submit-btn" style="
              width: 100%;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              border: none;
              padding: 14px;
              border-radius: 8px;
              font-size: 16px;
              font-weight: 600;
              cursor: pointer;
              transition: transform 0.2s;
            " onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='translateY(0)'">
              Submit Application
            </button>
          </form>
          
          <div id="lm-success" style="display: none; text-align: center; padding: 20px;">
            <div style="color: #10b981; font-size: 48px; margin-bottom: 16px;">✓</div>
            <h4 style="margin: 0 0 8px 0; color: #374151;">Application Submitted!</h4>
            <p style="margin: 0; color: #6b7280;">We'll contact you shortly.</p>
          </div>
          
          <div id="lm-error" style="display: none; text-align: center; padding: 20px; color: #ef4444;">
            <p id="lm-error-message"></p>
          </div>
        </div>
      </div>
    `;

		return widget;
	}

	// Handle form submission
	function handleSubmit(event) {
		event.preventDefault();

		const form = event.target;
		const submitBtn = document.getElementById("lm-submit-btn");
		const successDiv = document.getElementById("lm-success");
		const errorDiv = document.getElementById("lm-error");
		const errorMessage = document.getElementById("lm-error-message");

		// Get form data
		const formData = new FormData(form);
		const data = {
			name: formData.get("name"),
			phone: formData.get("phone"),
			email: formData.get("email"),
			city: formData.get("city") || "",
			loanAmount: formData.get("loanAmount")
				? Number(formData.get("loanAmount"))
				: undefined,
		};

		// Show loading state
		submitBtn.textContent = "Submitting...";
		submitBtn.disabled = true;
		submitBtn.style.opacity = "0.7";

		// Submit to API
		fetch(config.apiUrl, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		})
			.then((response) => response.json())
			.then((result) => {
				if (result.ok) {
					// Show success
					form.style.display = "none";
					successDiv.style.display = "block";
				} else {
					throw new Error(result.error || "Submission failed");
				}
			})
			.catch((error) => {
				// Show error
				errorMessage.textContent =
					error.message || "Something went wrong. Please try again.";
				errorDiv.style.display = "block";

				// Reset button
				submitBtn.textContent = "Submit Application";
				submitBtn.disabled = false;
				submitBtn.style.opacity = "1";
			});
	}

	// Initialize widget
	function init() {
		const container = document.getElementById("leads-master-container");
		if (!container) {
			console.error(
				'Leads Master: Container not found. Add <div id="leads-master-container"></div> to your page.'
			);
			return;
		}

		const widget = createWidget();
		container.appendChild(widget);

		// Add event listener
		document
			.getElementById("lm-lead-form")
			.addEventListener("submit", handleSubmit);

		// Add hover effects
		const inputs = widget.querySelectorAll("input");
		inputs.forEach((input) => {
			input.addEventListener("focus", () => {
				input.style.borderColor = "#667eea";
			});
			input.addEventListener("blur", () => {
				input.style.borderColor = "#e5e7eb";
			});
		});
	}

	// Auto-initialize when DOM is ready
	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", init);
	} else {
		init();
	}

	// Expose for manual initialization
	window.LeadsMaster = {
		init: init,
		config: config,
	};
})();
