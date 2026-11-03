// TypeScript example for JobConnect Recruitment
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
const firstRequest = addRequest("Apply for a vacancy");
console.log(firstRequest);
console.log(findRequest(1));
