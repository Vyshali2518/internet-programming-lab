document.querySelectorAll("form[data-message]").forEach(function (form) {
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    form.querySelector(".message").textContent = form.dataset.message;
    form.reset();
  });
});
