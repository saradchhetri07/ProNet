import { Navbar } from "../../components/navbar";
import { accessToken, serverUrl } from "../../constants/constant";
import axios from "axios";
import { ConnectRequest } from "../../interface/connectRequest";
import { customToast } from "../../utils/toast";
import { makeCard } from "./card";

export class NetworkManager {
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
    console.log(`inside create recommendation container`);

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
      console.log(`response is`, response);

      if (response.status == 201) {
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
    return makeCard(connectionRequest, index, cardType);
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
    } catch (err: any) {
      throw new Error(err);
    }
  }

  private async fetchRecommendations() {
    try {
      const userRecommendationInfo = await axios.get(
        `${serverUrl}/connect/userRecommendation`,
        {
          headers: {
            Authorization: accessToken ? `Bearer ${accessToken}` : "",
          },
        },
      );

      if (userRecommendationInfo.data.length <= 2) {
        const response = await axios.get(`${serverUrl}/connect/coldStart`, {
          headers: {
            Authorization: accessToken ? `Bearer ${accessToken}` : "",
          },
        });

        if (response.status === 200) {
          this.recommendations = response.data;
          console.log(`data is`, response.data);
        }
      } else {
        console.log(`data is`, userRecommendationInfo.data);

        this.recommendations = userRecommendationInfo.data;
      }
    } catch (error) {
      throw new Error("failed to fetch recommendation");
    }
  }
  getUserSearchResult(name: string) {
    this.setUserInfoBySearch(name);
  }

  async setUserInfoBySearch(name: string) {
    try {
      const queryParams = new URLSearchParams({
        name: name,
      });

      console.log(`${serverUrl}/connect/search?${queryParams.toString()}`);

      const response = await axios.get(
        `${serverUrl}/connect/search?${queryParams.toString()}`,
        {
          headers: {
            Authorization: accessToken ? `Bearer ${accessToken}` : "",
          },
        },
      );
      console.log(`response from server`, response);

      this.recommendations = response.data;
      console.log(`user recommendations is`, this.recommendations);

      this.createRecommendationContainer();
    } catch (error) {}
  }
}
document.addEventListener("DOMContentLoaded", () => {
  const navbar = new Navbar("navbar-container");
  navbar.render();
  navbar.highlightActivePage();

  const networkManager = new NetworkManager();
});
