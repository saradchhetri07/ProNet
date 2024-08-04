import { ConnectRequest } from "../../interface/connectRequest";

export const makeCard = (
  connectionRequest: ConnectRequest,
  index: number,
  cardType: string,
) => {
    return /*HTML*/ `<div class="flex w-56 flex-col mt-6 text-gray-700 rounded-3xl bg-white shadow-md bg-clip-border">
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
</div> `
};
