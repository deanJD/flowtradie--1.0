export var AddressType;
(function (AddressType) {
    AddressType["BusinessHq"] = "BUSINESS_HQ";
    AddressType["ClientBusiness"] = "CLIENT_BUSINESS";
    AddressType["ClientContact"] = "CLIENT_CONTACT";
})(AddressType || (AddressType = {}));
export var InvoiceStatus;
(function (InvoiceStatus) {
    InvoiceStatus["Draft"] = "DRAFT";
    InvoiceStatus["Overdue"] = "OVERDUE";
    InvoiceStatus["Paid"] = "PAID";
    InvoiceStatus["PartiallyPaid"] = "PARTIALLY_PAID";
    InvoiceStatus["Sent"] = "SENT";
})(InvoiceStatus || (InvoiceStatus = {}));
export var ProjectStatus;
(function (ProjectStatus) {
    ProjectStatus["Active"] = "ACTIVE";
    ProjectStatus["Cancelled"] = "CANCELLED";
    ProjectStatus["Completed"] = "COMPLETED";
    ProjectStatus["Pending"] = "PENDING";
})(ProjectStatus || (ProjectStatus = {}));
export var QuoteStatus;
(function (QuoteStatus) {
    QuoteStatus["Accepted"] = "ACCEPTED";
    QuoteStatus["Draft"] = "DRAFT";
    QuoteStatus["Rejected"] = "REJECTED";
    QuoteStatus["Sent"] = "SENT";
})(QuoteStatus || (QuoteStatus = {}));
export var UserRole;
(function (UserRole) {
    UserRole["Admin"] = "ADMIN";
    UserRole["Contractor"] = "CONTRACTOR";
    UserRole["Foreman"] = "FOREMAN";
    UserRole["Manager"] = "MANAGER";
    UserRole["Owner"] = "OWNER";
    UserRole["Worker"] = "WORKER";
})(UserRole || (UserRole = {}));
//# sourceMappingURL=graphql.js.map