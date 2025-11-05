// Create the popup element
const popup = document.createElement('div');
popup.id = 'popup-message';
document.body.appendChild(popup);

// Popup function
function showPopup(message) {
  popup.textContent = message;
  popup.classList.add('display');
  setTimeout(() => {
    popup.classList.remove('display');     
  }, 2500);
}

// Contact form submission
document.getElementById("contactForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent form from submitting normally
    
    let parms = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        subject: document.getElementById("subject").value,
        message: document.getElementById("message").value,
    };
    
    // Add this line to check what's being sent
    console.log("Sending parameters:", parms);

    emailjs.send("service_9s13aj6", "template_e3ade2k", parms)
        .then(function() {
            showPopup("✅ Email sent successfully!");
            document.getElementById("contactForm").reset(); // Clear the form
        })
        .catch(function(error) {
            showPopup("❌ Failed to send email. Please try again.");
            console.error("EmailJS error:", error);
        });
});