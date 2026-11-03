// TypeScript example for RentRide
type RequestRecord = {
  reference: number;
  details: string;
  status: "Received" | "In progress" | "Completed";
};
const requests: RequestRecord[] = [];
function addRequest(details: string): RequestRecord {
  const request: RequestRecord = {
    reference: requests.length + 1,
    details,
    status: "Received"
  };
  requests.push(request);
  return request;
}
function findRequest(reference: number): RequestRecord | undefined {
  return requests.find(request => request.reference === reference);
}
const firstRequest = addRequest("Book a vehicle");
console.log(firstRequest);
console.log(findRequest(1));
