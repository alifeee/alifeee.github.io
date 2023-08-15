class AliveChecker extends HTMLElement {
  // a little roundel that shows if the server is alive or not
  // it calls the /alive endpoint of the server and checks if the response is 200
  constructor() {
    super();

    this.src = "";

    const shadow = this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    if (!this.hasAttribute("src")) {
      throw new Error("src attribute is required");
    }
    this.src = this.getAttribute("src");

    this.render();
    this.checkAlive();
  }

  //  send http request to check if the server is alive
  async checkAlive() {
    let response;
    try {
      response = await fetch(this.src, { mode: "no-cors" });
      if (response.status === 200) {
        this.shadowRoot.getElementById("indicator").style.backgroundColor =
          "#00ff00";
      } else {
        throw new Error("Server alive check did not return 200");
      }
    } catch (error) {
      console.group("Server is not alive");
      if (response) {
        console.log(response);
        console.log("Response status: ", response.status);
      } else {
        console.log("No response");
      }
      console.groupEnd();
      this.shadowRoot.getElementById("indicator").style.backgroundColor =
        "#ff0000";
      throw error;
    }
  }

  render() {
    this.shadowRoot.innerHTML = "";
    const indicator = document.createElement("div");
    indicator.setAttribute("class", "indicator");
    indicator.setAttribute("id", "indicator");

    const style = document.createElement("style");
    style.textContent = `
    .indicator {
        display: inline-block;
        height: 1rem;
        width: 1rem;
        border-radius: 50%;
        background-color: #ffaa00;
    }
    `;

    this.shadowRoot.appendChild(indicator);
    this.shadowRoot.appendChild(style);
  }
}

customElements.define("alive-checker", AliveChecker);
