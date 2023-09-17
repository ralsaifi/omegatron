async function processContactForm(event) {
    event.preventDefault();
    const formElement = event.target;
    const formData = new FormData(formElement);
    const errorMessage = validateContactFormData(formData);
    const errorElement = formElement.querySelector(".error-message");
    const successElement = formElement.querySelector(".success-message");
    const submitButton = formElement.querySelector(".submit-button");

    errorElement.innerHTML = "";
    successElement.innerHTML = "";

    if (errorMessage) {
        errorElement.innerHTML = errorMessage;
        return;
    }

    submitButton.disabled = true;
    try {
        const data = await sendMessage(formData);
        if (data.ok) {
            formElement.reset();
            successElement.innerHTML = "Your message has been sent successfully";
        } else {
            errorElement.innerHTML = "Failed to send your message";
        }
    } catch (error) {
        errorElement.innerHTML = "Failed to send your message";
    }
    submitButton.disabled = false;
}

async function sendMessage(formData) {
    return await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(formData).toString(),
    });
}

function validateContactFormData(formData) {
    const dataObj = Object.fromEntries(formData.entries());

    if (dataObj.name.trim().length < 2)
        return "Please enter a valid name";
    if (!dataObj.email.trim().match(/.+\@.+\..+/))
        return "Please enter a valid email"
    if (dataObj.subject.trim().length < 2)
        return "Please enter a valid subject";
    if (dataObj.content.trim().length < 2)
        return "Please enter a valid message";
    if (dataObj.mobile.trim().length != 0 && dataObj.mobile.trim().length < 9)
        return "Please enter a valid mobile number";
    return "";
}

document.getElementById("contact-form").addEventListener("submit", processContactForm);