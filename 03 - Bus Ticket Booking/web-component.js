class TravelStatus extends HTMLElement {
  connectedCallback() {
    this.innerHTML = '<div class="notice">Next departure: 08:15 AM · Seats available</div>';
  }
}
customElements.define("travel-status", TravelStatus);
