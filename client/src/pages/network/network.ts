import { connectRequest } from "./../../../../server/src/controllers/connection.controllers";
import { Navbar } from "../../components/navbar";
import { accessToken, serverUrl } from "../../constants/constant";
import axios from "axios";
import { ConnectRequest } from "../../interface/connectRequest";
import { customToast } from "../../utils/toast";

class NetworkManager {
  private recommendationsContainer!: HTMLDivElement;
  private requestContainer!: HTMLDivElement;
  private requestConnect!: ConnectRequest[];
  private recommendations!: ConnectRequest[];
  private mainSectionRequestCard!: HTMLDivElement;
  private mainSectionRecommendationCard!: HTMLDivElement;

  constructor() {
    this.recommendationsContainer = document.querySelector(
      "#main-section__recommendations",
    )!;
    this.requestContainer = document.querySelector("#main-section__request")!;
    this.mainSectionRequestCard = document.querySelector(
      "#main-section__request__card",
    )!;
    this.mainSectionRecommendationCard = document.querySelector(
      "#main-section__recommendation__card",
    )!;

    this.init();
  }
  private async init() {
    await this.fetchRequest();
    await this.fetchRecommendations();
    this.createRequestContainer();
    this.createRecommendationContainer();
  }

  private async acceptConnections(event: MouseEvent) {
    const button = event.currentTarget as HTMLButtonElement;
    const requestId = button.getAttribute("data-request-id");

    try {
      // (`type is`, typeof parseInt(requestId));

      const response = await axios.post(
        `${serverUrl}/connect/accept/${parseInt(requestId!)}`,
        {
          status: "confirmed",
        },
        {
          headers: {
            Authorization: accessToken ? `Bearer ${accessToken}` : "",
          },
        },
      );

      if (response.status == 202) {
        //create toast
        `response is`, response;

        customToast(response.data.message);
        this.updatePost(requestId!);
      }
    } catch (error: any) {
      throw new Error(error);
    }
  }

  private async rejectConnections(event: MouseEvent) {
    const button = event.currentTarget as HTMLButtonElement;
    const requestId = button.getAttribute("data-request-id");

    try {
      const response = await axios.delete(
        `${serverUrl}/connect/reject/${parseInt(requestId!)}`,
        {
          headers: {
            Authorization: accessToken ? `Bearer ${accessToken}` : "",
          },
        },
      );

      if (response.status == 200) {
        //create toast
        customToast(response.data.message);
        this.updatePost(requestId!);
      }
    } catch (error: any) {
      throw new Error(error);
    }
  }

  private updatePost(requestId: string) {
    this.requestConnect = this.requestConnect.filter((connectRequest) => {
      return connectRequest.userId !== requestId;
    });
    //create toast
    this.createRequestContainer();
  }

  private createRequestContainer() {
    // creating card for each of the user
    this.mainSectionRequestCard.innerHTML = "";
    this.requestConnect.forEach((request, index) => {
      const requestCard = document.createElement("div");
      requestCard.innerHTML = this.makeCard(request, index, "request");
      requestCard.id = `requestCard${index}`;
      this.mainSectionRequestCard.appendChild(requestCard);

      // Adding event listeners to the Accept and Reject buttons
      const acceptButton = document.getElementById(`accept-button-${index}`);
      const rejectButton = document.getElementById(`reject-button-${index}`);

      if (acceptButton) {
        acceptButton.addEventListener("click", (event) =>
          this.acceptConnections(event),
        );
      }

      if (rejectButton) {
        rejectButton.addEventListener("click", (event) =>
          this.rejectConnections(event),
        );
      }
    });
  }

  private createRecommendationContainer() {
    this.mainSectionRecommendationCard.innerHTML = "";
    this.recommendations.forEach((recommendation, index) => {
      const recommendationCard = document.createElement("div");
      recommendationCard.innerHTML = this.makeCard(
        recommendation,
        index,
        "recommendation",
      );
      recommendationCard.id = `requestCard${index}`;
      this.mainSectionRecommendationCard.appendChild(recommendationCard);

      const sendRequestButton = document.getElementById(
        `send-request-button-${index}`,
      );

      if (sendRequestButton) {
        sendRequestButton.addEventListener("click", (event) =>
          this.sendRequest(event),
        );
      }
    });
  }

  private async sendRequest(event: MouseEvent) {
    const button = event.currentTarget as HTMLButtonElement;
    const requestId = button.getAttribute("data-request-id");

    try {
      // (`type is`, typeof parseInt(requestId));

      const response = await axios.post(
        `${serverUrl}/connect/${parseInt(requestId!)}`,
        {},
        {
          headers: {
            Authorization: accessToken ? `Bearer ${accessToken}` : "",
          },
        },
      );
      `response is`, response;
      if (response.status == 202) {
        //create toast

        customToast(response.data.message);
        this.updatePost(requestId!);
      }
    } catch (error: any) {
      throw new Error(error);
    }
  }

  private makeCard(
    connectionRequest: ConnectRequest,
    index: number,
    cardType: string,
  ) {
    return `<div class="flex w-56 flex-col mt-6 text-gray-700 rounded-3xl bg-white shadow-md bg-clip-border">
  <div
    class="relative h-75 w-10/12 mt-5 mx-4 overflow-hidden text-white shadow-lg bg-clip-border rounded-2xl bg-blue-gray-500 shadow-blue-gray-500/40">
    <img
      src=${connectionRequest.profilePhotoUrl}
      alt="card-image" />
  </div>
  <div class="p-6">
    <h5 class="block mb-2 font-primary text-xl antialiased font-semibold leading-snug tracking-normal text-blue-gray-900 ">
      ${connectionRequest.name}
    </h5>
    <p class="block text-base antialiased font-light leading-relaxed text-inherit font-primary">
      ${connectionRequest.currentPosition}
    </p>
  </div>
     <div class="p-4 pt-2 pr-6 flex justify-between gap-2">
     ${
       cardType === "request"
         ? `
              <button
                id="accept-button-${index}"
                class="font-primary font-bold text-center uppercase transition-all text-xs py-3 px-6 rounded-xl bg-black text-white shadow-md shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none"
                data-request-id="${connectionRequest.userId}"
                type="button">
                Accept
              </button>
              <button
                id="reject-button-${index}"
                class="font-primary font-bold text-center uppercase transition-all text-xs py-3 px-6 rounded-xl bg-black text-white shadow-md shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none"
                type="button"
                data-request-id="${connectionRequest.userId}">
                Reject
              </button>
            `
         : `
              <button
                id="send-request-button-${index}"
                class="font-primary font-bold text-center uppercase transition-all text-xs py-3 px-6 rounded-xl bg-primary text-white shadow-md shadow-gray-900/10 hover:shadow-lg hover:shadow-blue-500/20 focus:opacity-[0.85] focus:shadow-none"
                type="button"
                data-request-id="${connectionRequest.userId}">
     ${connectionRequest.status == "confirmed" ? "Pending" : "send request"}
              </button>
            `
     }
  </div>
</div>  `;
  }
  private async fetchRequest() {
    try {
      const response = await axios.get(
        `${serverUrl}/connect/requestedUserInfo`,
        {
          headers: {
            Authorization: accessToken ? `Bearer ${accessToken}` : "",
          },
        },
      );

      this.requestConnect = response.data;

      `gotten response of connect user is`, this.requestConnect;
    } catch (err: any) {
      throw new Error(err);
    }
  }

  private async fetchRecommendations() {
    try {
      const response = await axios.get(
        `${serverUrl}/connect/userRecommendation`,
        {
          headers: {
            Authorization: accessToken ? `Bearer ${accessToken}` : "",
          },
        },
      );

      if (response.status === 200) {
        this.recommendations = response.data;
        `recommendations is`, this.recommendations;
      }
    } catch (error) {
      throw new Error("failed to fetch recommendation");
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const navbar = new Navbar("navbar-container");
  navbar.render();
  navbar.highlightActivePage();

  const networkManager = new NetworkManager();
});
