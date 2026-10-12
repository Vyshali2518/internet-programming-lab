
const filterButtons = document.querySelectorAll(".menu-tabs button");
const menuCards = document.querySelectorAll(".menu-card");

filterButtons.forEach(function(button) {
    button.addEventListener("click", function() {
        const category = button.dataset.filter;

        menuCards.forEach(function(card) {
            if (category === "all" ||
                card.dataset.category === category) {
                card.style.display = "";
            } else {
                card.style.display = "none";
            }
        });

        filterButtons.forEach(function(item) {
            item.classList.remove("active");
        });

        button.classList.add("active");
    });
});

// Prevent selecting a past reservation date
const dateInput = document.getElementById("date");

function getLocalDate() {
    const today = new Date();
    today.setMinutes(
        today.getMinutes() - today.getTimezoneOffset()
    );
    return today.toISOString().split("T")[0];
}

dateInput.min = getLocalDate();

// Demo reservation submission
const bookingForm = document.getElementById("bookingForm");

bookingForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const message = document.getElementById("message");

    message.textContent =
        "Thank you, " + name +
        "! Your demo request has been received. No actual booking was made.";

    bookingForm.reset();
    dateInput.min = getLocalDate();
});
