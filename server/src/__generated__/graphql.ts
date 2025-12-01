import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { GraphQLContext } from '../context.js';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: any; output: any; }
  JSON: { input: any; output: any; }
};

export type Address = {
  __typename?: 'Address';
  addressType: AddressType;
  city: Scalars['String']['output'];
  country?: Maybe<Scalars['String']['output']>;
  countryCode?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['ID']['output'];
  line1: Scalars['String']['output'];
  line2?: Maybe<Scalars['String']['output']>;
  postcode: Scalars['String']['output'];
  state?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
};

export enum AddressType {
  Business = 'BUSINESS',
  ClientBusiness = 'CLIENT_BUSINESS',
  ClientSite = 'CLIENT_SITE',
  Other = 'OTHER',
  Site = 'SITE'
}

export type AuthPayload = {
  __typename?: 'AuthPayload';
  token: Scalars['String']['output'];
  user: User;
};

export type BillableItem = {
  __typename?: 'BillableItem';
  businessId: Scalars['ID']['output'];
  createdAt: Scalars['DateTime']['output'];
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  unitPrice: Scalars['Float']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type Business = {
  __typename?: 'Business';
  address?: Maybe<Address>;
  createdAt: Scalars['DateTime']['output'];
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  legalName?: Maybe<Scalars['String']['output']>;
  logoUrl?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  phone?: Maybe<Scalars['String']['output']>;
  region: Region;
  regionId: Scalars['ID']['output'];
  registrationNumber?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
  website?: Maybe<Scalars['String']['output']>;
};

export type Client = {
  __typename?: 'Client';
  addresses: Array<Address>;
  businessId: Scalars['ID']['output'];
  businessName?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  firstName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  invoices: Array<Invoice>;
  lastName: Scalars['String']['output'];
  notes?: Maybe<Scalars['String']['output']>;
  phone?: Maybe<Scalars['String']['output']>;
  projects: Array<Project>;
  type: ClientType;
  updatedAt: Scalars['DateTime']['output'];
};

export enum ClientType {
  Commercial = 'COMMERCIAL',
  Other = 'OTHER',
  Residential = 'RESIDENTIAL'
}

export type CreateAddressInput = {
  addressType?: InputMaybe<AddressType>;
  city: Scalars['String']['input'];
  country?: InputMaybe<Scalars['String']['input']>;
  countryCode?: InputMaybe<Scalars['String']['input']>;
  line1: Scalars['String']['input'];
  line2?: InputMaybe<Scalars['String']['input']>;
  postcode: Scalars['String']['input'];
  state?: InputMaybe<Scalars['String']['input']>;
};

export type CreateBillableItemInput = {
  businessId: Scalars['ID']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  unitPrice: Scalars['Float']['input'];
};

export type CreateBusinessInput = {
  city: Scalars['String']['input'];
  country?: InputMaybe<Scalars['String']['input']>;
  email: Scalars['String']['input'];
  legalName?: InputMaybe<Scalars['String']['input']>;
  line1: Scalars['String']['input'];
  line2?: InputMaybe<Scalars['String']['input']>;
  logoUrl?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  phone?: InputMaybe<Scalars['String']['input']>;
  postcode: Scalars['String']['input'];
  regionId: Scalars['ID']['input'];
  registrationNumber?: InputMaybe<Scalars['String']['input']>;
  state?: InputMaybe<Scalars['String']['input']>;
  website?: InputMaybe<Scalars['String']['input']>;
};

export type CreateClientInput = {
  addresses?: InputMaybe<Array<CreateAddressInput>>;
  businessId: Scalars['ID']['input'];
  businessName?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
  notes?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<ClientType>;
};

export type CreateExpenseInput = {
  amount: Scalars['Float']['input'];
  businessId: Scalars['ID']['input'];
  category: Scalars['String']['input'];
  date?: InputMaybe<Scalars['DateTime']['input']>;
  description: Scalars['String']['input'];
  projectId: Scalars['ID']['input'];
};

export type CreateInvoiceInput = {
  clientAddressId?: InputMaybe<Scalars['ID']['input']>;
  clientId: Scalars['ID']['input'];
  dueDate?: InputMaybe<Scalars['DateTime']['input']>;
  issueDate?: InputMaybe<Scalars['DateTime']['input']>;
  items: Array<CreateInvoiceItemInput>;
  notes?: InputMaybe<Scalars['String']['input']>;
  projectId: Scalars['ID']['input'];
  subtotal: Scalars['Float']['input'];
  taxAmount: Scalars['Float']['input'];
  taxRate?: InputMaybe<Scalars['Float']['input']>;
  totalAmount: Scalars['Float']['input'];
};

export type CreateInvoiceItemInput = {
  description: Scalars['String']['input'];
  quantity?: InputMaybe<Scalars['Int']['input']>;
  unitPrice: Scalars['Float']['input'];
};

export type CreatePaymentInput = {
  amount: Scalars['Float']['input'];
  businessId: Scalars['ID']['input'];
  date?: InputMaybe<Scalars['DateTime']['input']>;
  invoiceId: Scalars['ID']['input'];
  method: Scalars['String']['input'];
  notes?: InputMaybe<Scalars['String']['input']>;
};

export type CreateProjectInput = {
  clientId: Scalars['ID']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  endDate?: InputMaybe<Scalars['DateTime']['input']>;
  location?: InputMaybe<Scalars['String']['input']>;
  managerId?: InputMaybe<Scalars['ID']['input']>;
  startDate?: InputMaybe<Scalars['DateTime']['input']>;
  status?: InputMaybe<ProjectStatus>;
  title: Scalars['String']['input'];
};

export type CreateQuoteInput = {
  expiryDate?: InputMaybe<Scalars['DateTime']['input']>;
  gstRate?: InputMaybe<Scalars['Float']['input']>;
  items: Array<CreateQuoteItemInput>;
  projectId: Scalars['ID']['input'];
  quoteNumber: Scalars['String']['input'];
  status?: InputMaybe<QuoteStatus>;
};

export type CreateQuoteItemInput = {
  description: Scalars['String']['input'];
  quantity?: InputMaybe<Scalars['Int']['input']>;
  unitPrice: Scalars['Float']['input'];
};

export type CreateTaskInput = {
  assignedToId?: InputMaybe<Scalars['ID']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  dueDate?: InputMaybe<Scalars['DateTime']['input']>;
  projectId: Scalars['ID']['input'];
  title: Scalars['String']['input'];
};

export type CreateTimeLogInput = {
  businessId: Scalars['ID']['input'];
  date: Scalars['DateTime']['input'];
  hoursWorked: Scalars['Float']['input'];
  notes?: InputMaybe<Scalars['String']['input']>;
  projectId: Scalars['ID']['input'];
  userId: Scalars['ID']['input'];
};

export type CreateUserInput = {
  email: Scalars['String']['input'];
  hourlyRate?: InputMaybe<Scalars['Float']['input']>;
  name: Scalars['String']['input'];
  phone?: InputMaybe<Scalars['String']['input']>;
  role?: InputMaybe<UserRole>;
};

export type DashboardSummary = {
  __typename?: 'DashboardSummary';
  invoicesDueSoon: Scalars['Int']['output'];
  tasksDueToday: Scalars['Int']['output'];
  totalOpenProjects: Scalars['Int']['output'];
  totalRevenueYTD: Scalars['Float']['output'];
};

export type Invoice = {
  __typename?: 'Invoice';
  businessSnapshot: Scalars['JSON']['output'];
  clientSnapshot: Scalars['JSON']['output'];
  createdAt: Scalars['DateTime']['output'];
  currencyCode: Scalars['String']['output'];
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  dueDate: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  invoiceNumber: Scalars['String']['output'];
  invoicePrefix: Scalars['String']['output'];
  invoiceSequence: Scalars['Int']['output'];
  issueDate: Scalars['DateTime']['output'];
  items: Array<InvoiceItem>;
  notes?: Maybe<Scalars['String']['output']>;
  payments: Array<Payment>;
  project: Project;
  status: InvoiceStatus;
  subtotal: Scalars['Float']['output'];
  taxAmount: Scalars['Float']['output'];
  taxLabelSnapshot: Scalars['String']['output'];
  taxRate: Scalars['Float']['output'];
  totalAmount: Scalars['Float']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type InvoiceItem = {
  __typename?: 'InvoiceItem';
  description: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  invoice: Invoice;
  quantity: Scalars['Int']['output'];
  total: Scalars['Float']['output'];
  unitPrice: Scalars['Float']['output'];
};

export type InvoiceSettings = {
  __typename?: 'InvoiceSettings';
  abn?: Maybe<Scalars['String']['output']>;
  bankDetails?: Maybe<Scalars['String']['output']>;
  businessId: Scalars['ID']['output'];
  businessName?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  defaultDueDays?: Maybe<Scalars['Int']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  fromEmail?: Maybe<Scalars['String']['output']>;
  fromName?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  invoicePrefix?: Maybe<Scalars['String']['output']>;
  logoUrl?: Maybe<Scalars['String']['output']>;
  phone?: Maybe<Scalars['String']['output']>;
  smtpHost?: Maybe<Scalars['String']['output']>;
  smtpPassword?: Maybe<Scalars['String']['output']>;
  smtpPort?: Maybe<Scalars['Int']['output']>;
  smtpUser?: Maybe<Scalars['String']['output']>;
  startingNumber?: Maybe<Scalars['Int']['output']>;
  taxLabel?: Maybe<Scalars['String']['output']>;
  taxRate?: Maybe<Scalars['Float']['output']>;
  updatedAt: Scalars['DateTime']['output'];
  website?: Maybe<Scalars['String']['output']>;
};

export type InvoiceSettingsInput = {
  abn?: InputMaybe<Scalars['String']['input']>;
  bankDetails?: InputMaybe<Scalars['String']['input']>;
  businessName?: InputMaybe<Scalars['String']['input']>;
  defaultDueDays?: InputMaybe<Scalars['Int']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  fromEmail?: InputMaybe<Scalars['String']['input']>;
  fromName?: InputMaybe<Scalars['String']['input']>;
  invoicePrefix?: InputMaybe<Scalars['String']['input']>;
  logoUrl?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
  smtpHost?: InputMaybe<Scalars['String']['input']>;
  smtpPassword?: InputMaybe<Scalars['String']['input']>;
  smtpPort?: InputMaybe<Scalars['Int']['input']>;
  smtpUser?: InputMaybe<Scalars['String']['input']>;
  startingNumber?: InputMaybe<Scalars['Int']['input']>;
  taxLabel?: InputMaybe<Scalars['String']['input']>;
  taxRate?: InputMaybe<Scalars['Float']['input']>;
  website?: InputMaybe<Scalars['String']['input']>;
};

export enum InvoiceStatus {
  Draft = 'DRAFT',
  Overdue = 'OVERDUE',
  Paid = 'PAID',
  PartiallyPaid = 'PARTIALLY_PAID',
  Sent = 'SENT'
}

export type LoginInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  _empty?: Maybe<Scalars['String']['output']>;
  createBillableItem: BillableItem;
  createBusiness: Business;
  createClient: Client;
  createExpense: ProjectExpense;
  createInvoice: Invoice;
  createInvoiceFromQuote: Invoice;
  createPayment: Payment;
  createProject: Project;
  createQuote: Quote;
  createTask: Task;
  createTimeLog: TimeLog;
  createUser: User;
  deleteBillableItem: BillableItem;
  deleteClient: Client;
  deleteExpense: ProjectExpense;
  deleteInvoice: Invoice;
  deletePayment: Payment;
  deleteProject: Project;
  deleteQuote: Quote;
  deleteTask: Task;
  deleteTimeLog: TimeLog;
  deleteUser: User;
  login: AuthPayload;
  register: AuthPayload;
  updateBillableItem: BillableItem;
  updateBusiness: Business;
  updateClient: Client;
  updateInvoice: Invoice;
  updateInvoiceSettings: InvoiceSettings;
  updatePayment: Payment;
  updateProject: Project;
  updateQuote: Quote;
  updateTask: Task;
  updateTimeLog: TimeLog;
  updateUser: User;
};


export type MutationCreateBillableItemArgs = {
  input: CreateBillableItemInput;
};


export type MutationCreateBusinessArgs = {
  input: CreateBusinessInput;
};


export type MutationCreateClientArgs = {
  input: CreateClientInput;
};


export type MutationCreateExpenseArgs = {
  input: CreateExpenseInput;
};


export type MutationCreateInvoiceArgs = {
  input: CreateInvoiceInput;
};


export type MutationCreateInvoiceFromQuoteArgs = {
  quoteId: Scalars['ID']['input'];
};


export type MutationCreatePaymentArgs = {
  input: CreatePaymentInput;
};


export type MutationCreateProjectArgs = {
  input: CreateProjectInput;
};


export type MutationCreateQuoteArgs = {
  input: CreateQuoteInput;
};


export type MutationCreateTaskArgs = {
  input: CreateTaskInput;
};


export type MutationCreateTimeLogArgs = {
  input: CreateTimeLogInput;
};


export type MutationCreateUserArgs = {
  input: CreateUserInput;
};


export type MutationDeleteBillableItemArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteClientArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteExpenseArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteInvoiceArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeletePaymentArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteProjectArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteQuoteArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteTaskArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteTimeLogArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteUserArgs = {
  id: Scalars['ID']['input'];
};


export type MutationLoginArgs = {
  input: LoginInput;
};


export type MutationRegisterArgs = {
  input: RegisterInput;
};


export type MutationUpdateBillableItemArgs = {
  id: Scalars['ID']['input'];
  input: UpdateBillableItemInput;
};


export type MutationUpdateBusinessArgs = {
  id: Scalars['ID']['input'];
  input: UpdateBusinessInput;
};


export type MutationUpdateClientArgs = {
  id: Scalars['ID']['input'];
  input: UpdateClientInput;
};


export type MutationUpdateInvoiceArgs = {
  id: Scalars['ID']['input'];
  input: UpdateInvoiceInput;
};


export type MutationUpdateInvoiceSettingsArgs = {
  input: InvoiceSettingsInput;
};


export type MutationUpdatePaymentArgs = {
  id: Scalars['ID']['input'];
  input: UpdatePaymentInput;
};


export type MutationUpdateProjectArgs = {
  id: Scalars['ID']['input'];
  input: UpdateProjectInput;
};


export type MutationUpdateQuoteArgs = {
  id: Scalars['ID']['input'];
  input: UpdateQuoteInput;
};


export type MutationUpdateTaskArgs = {
  id: Scalars['ID']['input'];
  input: UpdateTaskInput;
};


export type MutationUpdateTimeLogArgs = {
  id: Scalars['ID']['input'];
  input: UpdateTimeLogInput;
};


export type MutationUpdateUserArgs = {
  id: Scalars['ID']['input'];
  input: UpdateUserInput;
};

export type Payment = {
  __typename?: 'Payment';
  amount: Scalars['Float']['output'];
  businessId: Scalars['ID']['output'];
  date: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  invoice: Invoice;
  invoiceId: Scalars['ID']['output'];
  method: Scalars['String']['output'];
  notes?: Maybe<Scalars['String']['output']>;
};

export type Project = {
  __typename?: 'Project';
  budgetedAmount?: Maybe<Scalars['Float']['output']>;
  businessId: Scalars['ID']['output'];
  client: Client;
  createdAt: Scalars['DateTime']['output'];
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  endDate?: Maybe<Scalars['DateTime']['output']>;
  expenses: Array<ProjectExpense>;
  financialSummary: ProjectFinancialSummary;
  id: Scalars['ID']['output'];
  invoices: Array<Invoice>;
  isOverdue: Scalars['Boolean']['output'];
  location?: Maybe<Scalars['String']['output']>;
  manager?: Maybe<User>;
  progress: Scalars['Float']['output'];
  quotes: Array<Quote>;
  startDate?: Maybe<Scalars['DateTime']['output']>;
  status: ProjectStatus;
  tasks: Array<Task>;
  timeLogs: Array<TimeLog>;
  title: Scalars['String']['output'];
  totalHoursWorked: Scalars['Float']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type ProjectExpense = {
  __typename?: 'ProjectExpense';
  amount: Scalars['Float']['output'];
  category: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  date: Scalars['DateTime']['output'];
  description: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  project: Project;
  updatedAt: Scalars['DateTime']['output'];
};

export type ProjectFinancialSummary = {
  __typename?: 'ProjectFinancialSummary';
  estimatedProfit: Scalars['Float']['output'];
  expensesTotal: Scalars['Float']['output'];
  hoursWorked: Scalars['Float']['output'];
  invoicesTotal: Scalars['Float']['output'];
  paymentsTotal: Scalars['Float']['output'];
};

export type ProjectProfitability = {
  __typename?: 'ProjectProfitability';
  netProfit: Scalars['Float']['output'];
  project: Project;
  totalLaborCosts: Scalars['Float']['output'];
  totalMaterialCosts: Scalars['Float']['output'];
  totalRevenue: Scalars['Float']['output'];
};

export enum ProjectStatus {
  Active = 'ACTIVE',
  Cancelled = 'CANCELLED',
  Completed = 'COMPLETED',
  Pending = 'PENDING'
}

export type Query = {
  __typename?: 'Query';
  _empty?: Maybe<Scalars['String']['output']>;
  billableItems: Array<BillableItem>;
  business?: Maybe<Business>;
  businesses: Array<Business>;
  client?: Maybe<Client>;
  clients: Array<Client>;
  expenses: Array<ProjectExpense>;
  getDashboardSummary: DashboardSummary;
  invoice?: Maybe<Invoice>;
  invoiceSettings?: Maybe<InvoiceSettings>;
  invoices: Array<Invoice>;
  me?: Maybe<User>;
  payments: Array<Payment>;
  project?: Maybe<Project>;
  projectProfitability: ProjectProfitability;
  projectReport: ProjectFinancialSummary;
  projects: Array<Project>;
  quote?: Maybe<Quote>;
  quotesByProject: Array<Quote>;
  task?: Maybe<Task>;
  tasks: Array<Task>;
  timeLog?: Maybe<TimeLog>;
  timeLogs: Array<TimeLog>;
  user?: Maybe<User>;
  users: Array<User>;
};


export type QueryBillableItemsArgs = {
  businessId: Scalars['ID']['input'];
};


export type QueryBusinessArgs = {
  id: Scalars['ID']['input'];
};


export type QueryClientArgs = {
  id: Scalars['ID']['input'];
};


export type QueryClientsArgs = {
  businessId: Scalars['ID']['input'];
};


export type QueryExpensesArgs = {
  projectId: Scalars['ID']['input'];
};


export type QueryInvoiceArgs = {
  id: Scalars['ID']['input'];
};


export type QueryInvoicesArgs = {
  projectId?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryPaymentsArgs = {
  invoiceId: Scalars['ID']['input'];
};


export type QueryProjectArgs = {
  id: Scalars['ID']['input'];
};


export type QueryProjectProfitabilityArgs = {
  projectId: Scalars['ID']['input'];
};


export type QueryProjectReportArgs = {
  id: Scalars['ID']['input'];
};


export type QueryQuoteArgs = {
  id: Scalars['ID']['input'];
};


export type QueryQuotesByProjectArgs = {
  projectId: Scalars['ID']['input'];
};


export type QueryTaskArgs = {
  id: Scalars['ID']['input'];
};


export type QueryTimeLogArgs = {
  id: Scalars['ID']['input'];
};


export type QueryUserArgs = {
  id: Scalars['ID']['input'];
};

export type Quote = {
  __typename?: 'Quote';
  createdAt: Scalars['DateTime']['output'];
  expiryDate?: Maybe<Scalars['DateTime']['output']>;
  gstAmount: Scalars['Float']['output'];
  gstRate: Scalars['Float']['output'];
  id: Scalars['ID']['output'];
  issueDate: Scalars['DateTime']['output'];
  items: Array<QuoteItem>;
  project: Project;
  quoteNumber: Scalars['String']['output'];
  status: QuoteStatus;
  subtotal: Scalars['Float']['output'];
  totalAmount: Scalars['Float']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type QuoteItem = {
  __typename?: 'QuoteItem';
  description: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  quantity: Scalars['Int']['output'];
  quote: Quote;
  total: Scalars['Float']['output'];
  unitPrice: Scalars['Float']['output'];
};

export enum QuoteStatus {
  Accepted = 'ACCEPTED',
  Draft = 'DRAFT',
  Rejected = 'REJECTED',
  Sent = 'SENT'
}

export type Region = {
  __typename?: 'Region';
  code: Scalars['String']['output'];
  currencyCode: Scalars['String']['output'];
  currencySymbol?: Maybe<Scalars['String']['output']>;
  defaultTaxRate?: Maybe<Scalars['Float']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  taxLabel?: Maybe<Scalars['String']['output']>;
};

export type RegisterInput = {
  email: Scalars['String']['input'];
  name: Scalars['String']['input'];
  password: Scalars['String']['input'];
  regionCode: Scalars['String']['input'];
};

export type Task = {
  __typename?: 'Task';
  assignedTo?: Maybe<User>;
  assignedToId?: Maybe<Scalars['ID']['output']>;
  businessId: Scalars['ID']['output'];
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  dueDate?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['ID']['output'];
  isCompleted: Scalars['Boolean']['output'];
  project: Project;
  projectId: Scalars['ID']['output'];
  status: TaskStatus;
  title: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export enum TaskStatus {
  Cancelled = 'CANCELLED',
  Completed = 'COMPLETED',
  InProgress = 'IN_PROGRESS',
  Pending = 'PENDING'
}

export type TimeLog = {
  __typename?: 'TimeLog';
  businessId: Scalars['ID']['output'];
  date: Scalars['DateTime']['output'];
  hoursWorked: Scalars['Float']['output'];
  id: Scalars['ID']['output'];
  notes?: Maybe<Scalars['String']['output']>;
  project: Project;
  projectId: Scalars['ID']['output'];
  user: User;
  userId: Scalars['ID']['output'];
};

export type UpdateBillableItemInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  unitPrice: Scalars['Float']['input'];
};

export type UpdateBusinessInput = {
  city?: InputMaybe<Scalars['String']['input']>;
  country?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  legalName?: InputMaybe<Scalars['String']['input']>;
  line1?: InputMaybe<Scalars['String']['input']>;
  line2?: InputMaybe<Scalars['String']['input']>;
  logoUrl?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
  postcode?: InputMaybe<Scalars['String']['input']>;
  registrationNumber?: InputMaybe<Scalars['String']['input']>;
  state?: InputMaybe<Scalars['String']['input']>;
  website?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateClientInput = {
  addresses?: InputMaybe<Array<CreateAddressInput>>;
  businessName?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  firstName?: InputMaybe<Scalars['String']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<ClientType>;
};

export type UpdateInvoiceInput = {
  businessSnapshot?: InputMaybe<Scalars['JSON']['input']>;
  clientSnapshot?: InputMaybe<Scalars['JSON']['input']>;
  dueDate?: InputMaybe<Scalars['DateTime']['input']>;
  invoiceNumber?: InputMaybe<Scalars['String']['input']>;
  issueDate?: InputMaybe<Scalars['DateTime']['input']>;
  items?: InputMaybe<Array<CreateInvoiceItemInput>>;
  notes?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<InvoiceStatus>;
  taxRate?: InputMaybe<Scalars['Float']['input']>;
};

export type UpdatePaymentInput = {
  amount?: InputMaybe<Scalars['Float']['input']>;
  date?: InputMaybe<Scalars['DateTime']['input']>;
  method?: InputMaybe<Scalars['String']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateProjectInput = {
  budgetedAmount?: InputMaybe<Scalars['Float']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  endDate?: InputMaybe<Scalars['DateTime']['input']>;
  location?: InputMaybe<Scalars['String']['input']>;
  managerId?: InputMaybe<Scalars['ID']['input']>;
  startDate?: InputMaybe<Scalars['DateTime']['input']>;
  status?: InputMaybe<ProjectStatus>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateQuoteInput = {
  expiryDate?: InputMaybe<Scalars['DateTime']['input']>;
  gstRate?: InputMaybe<Scalars['Float']['input']>;
  items?: InputMaybe<Array<CreateQuoteItemInput>>;
  quoteNumber?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<QuoteStatus>;
};

export type UpdateTaskInput = {
  assignedToId?: InputMaybe<Scalars['ID']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  dueDate?: InputMaybe<Scalars['DateTime']['input']>;
  isCompleted?: InputMaybe<Scalars['Boolean']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateTimeLogInput = {
  date?: InputMaybe<Scalars['DateTime']['input']>;
  hoursWorked?: InputMaybe<Scalars['Float']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateUserInput = {
  email?: InputMaybe<Scalars['String']['input']>;
  hourlyRate?: InputMaybe<Scalars['Float']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
  role?: InputMaybe<UserRole>;
};

export type User = {
  __typename?: 'User';
  business?: Maybe<Business>;
  businessId?: Maybe<Scalars['ID']['output']>;
  createdAt: Scalars['DateTime']['output'];
  email: Scalars['String']['output'];
  hourlyRate?: Maybe<Scalars['Float']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  phone?: Maybe<Scalars['String']['output']>;
  role: UserRole;
  tasks: Array<Task>;
  updatedAt: Scalars['DateTime']['output'];
};

export enum UserRole {
  Admin = 'ADMIN',
  Contractor = 'CONTRACTOR',
  Foreman = 'FOREMAN',
  Manager = 'MANAGER',
  Owner = 'OWNER',
  Worker = 'WORKER'
}

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>, TArgs = Record<PropertyKey, never>> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>, TArgs = Record<PropertyKey, never>> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = Record<PropertyKey, never>, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>, TArgs = Record<PropertyKey, never>> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;





/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  Address: ResolverTypeWrapper<Address>;
  AddressType: AddressType;
  AuthPayload: ResolverTypeWrapper<AuthPayload>;
  BillableItem: ResolverTypeWrapper<BillableItem>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  Business: ResolverTypeWrapper<Business>;
  Client: ResolverTypeWrapper<Client>;
  ClientType: ClientType;
  CreateAddressInput: CreateAddressInput;
  CreateBillableItemInput: CreateBillableItemInput;
  CreateBusinessInput: CreateBusinessInput;
  CreateClientInput: CreateClientInput;
  CreateExpenseInput: CreateExpenseInput;
  CreateInvoiceInput: CreateInvoiceInput;
  CreateInvoiceItemInput: CreateInvoiceItemInput;
  CreatePaymentInput: CreatePaymentInput;
  CreateProjectInput: CreateProjectInput;
  CreateQuoteInput: CreateQuoteInput;
  CreateQuoteItemInput: CreateQuoteItemInput;
  CreateTaskInput: CreateTaskInput;
  CreateTimeLogInput: CreateTimeLogInput;
  CreateUserInput: CreateUserInput;
  DashboardSummary: ResolverTypeWrapper<DashboardSummary>;
  DateTime: ResolverTypeWrapper<Scalars['DateTime']['output']>;
  Float: ResolverTypeWrapper<Scalars['Float']['output']>;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  Invoice: ResolverTypeWrapper<Invoice>;
  InvoiceItem: ResolverTypeWrapper<InvoiceItem>;
  InvoiceSettings: ResolverTypeWrapper<InvoiceSettings>;
  InvoiceSettingsInput: InvoiceSettingsInput;
  InvoiceStatus: InvoiceStatus;
  JSON: ResolverTypeWrapper<Scalars['JSON']['output']>;
  LoginInput: LoginInput;
  Mutation: ResolverTypeWrapper<Record<PropertyKey, never>>;
  Payment: ResolverTypeWrapper<Payment>;
  Project: ResolverTypeWrapper<Project>;
  ProjectExpense: ResolverTypeWrapper<ProjectExpense>;
  ProjectFinancialSummary: ResolverTypeWrapper<ProjectFinancialSummary>;
  ProjectProfitability: ResolverTypeWrapper<ProjectProfitability>;
  ProjectStatus: ProjectStatus;
  Query: ResolverTypeWrapper<Record<PropertyKey, never>>;
  Quote: ResolverTypeWrapper<Quote>;
  QuoteItem: ResolverTypeWrapper<QuoteItem>;
  QuoteStatus: QuoteStatus;
  Region: ResolverTypeWrapper<Region>;
  RegisterInput: RegisterInput;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  Task: ResolverTypeWrapper<Task>;
  TaskStatus: TaskStatus;
  TimeLog: ResolverTypeWrapper<TimeLog>;
  UpdateBillableItemInput: UpdateBillableItemInput;
  UpdateBusinessInput: UpdateBusinessInput;
  UpdateClientInput: UpdateClientInput;
  UpdateInvoiceInput: UpdateInvoiceInput;
  UpdatePaymentInput: UpdatePaymentInput;
  UpdateProjectInput: UpdateProjectInput;
  UpdateQuoteInput: UpdateQuoteInput;
  UpdateTaskInput: UpdateTaskInput;
  UpdateTimeLogInput: UpdateTimeLogInput;
  UpdateUserInput: UpdateUserInput;
  User: ResolverTypeWrapper<User>;
  UserRole: UserRole;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Address: Address;
  AuthPayload: AuthPayload;
  BillableItem: BillableItem;
  Boolean: Scalars['Boolean']['output'];
  Business: Business;
  Client: Client;
  CreateAddressInput: CreateAddressInput;
  CreateBillableItemInput: CreateBillableItemInput;
  CreateBusinessInput: CreateBusinessInput;
  CreateClientInput: CreateClientInput;
  CreateExpenseInput: CreateExpenseInput;
  CreateInvoiceInput: CreateInvoiceInput;
  CreateInvoiceItemInput: CreateInvoiceItemInput;
  CreatePaymentInput: CreatePaymentInput;
  CreateProjectInput: CreateProjectInput;
  CreateQuoteInput: CreateQuoteInput;
  CreateQuoteItemInput: CreateQuoteItemInput;
  CreateTaskInput: CreateTaskInput;
  CreateTimeLogInput: CreateTimeLogInput;
  CreateUserInput: CreateUserInput;
  DashboardSummary: DashboardSummary;
  DateTime: Scalars['DateTime']['output'];
  Float: Scalars['Float']['output'];
  ID: Scalars['ID']['output'];
  Int: Scalars['Int']['output'];
  Invoice: Invoice;
  InvoiceItem: InvoiceItem;
  InvoiceSettings: InvoiceSettings;
  InvoiceSettingsInput: InvoiceSettingsInput;
  JSON: Scalars['JSON']['output'];
  LoginInput: LoginInput;
  Mutation: Record<PropertyKey, never>;
  Payment: Payment;
  Project: Project;
  ProjectExpense: ProjectExpense;
  ProjectFinancialSummary: ProjectFinancialSummary;
  ProjectProfitability: ProjectProfitability;
  Query: Record<PropertyKey, never>;
  Quote: Quote;
  QuoteItem: QuoteItem;
  Region: Region;
  RegisterInput: RegisterInput;
  String: Scalars['String']['output'];
  Task: Task;
  TimeLog: TimeLog;
  UpdateBillableItemInput: UpdateBillableItemInput;
  UpdateBusinessInput: UpdateBusinessInput;
  UpdateClientInput: UpdateClientInput;
  UpdateInvoiceInput: UpdateInvoiceInput;
  UpdatePaymentInput: UpdatePaymentInput;
  UpdateProjectInput: UpdateProjectInput;
  UpdateQuoteInput: UpdateQuoteInput;
  UpdateTaskInput: UpdateTaskInput;
  UpdateTimeLogInput: UpdateTimeLogInput;
  UpdateUserInput: UpdateUserInput;
  User: User;
}>;

export type AddressResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Address'] = ResolversParentTypes['Address']> = ResolversObject<{
  addressType?: Resolver<ResolversTypes['AddressType'], ParentType, ContextType>;
  city?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  country?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  countryCode?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  deletedAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  line1?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  line2?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  postcode?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  state?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
}>;

export type AuthPayloadResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['AuthPayload'] = ResolversParentTypes['AuthPayload']> = ResolversObject<{
  token?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
}>;

export type BillableItemResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['BillableItem'] = ResolversParentTypes['BillableItem']> = ResolversObject<{
  businessId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  deletedAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  unitPrice?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
}>;

export type BusinessResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Business'] = ResolversParentTypes['Business']> = ResolversObject<{
  address?: Resolver<Maybe<ResolversTypes['Address']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  deletedAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  legalName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  logoUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  phone?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  region?: Resolver<ResolversTypes['Region'], ParentType, ContextType>;
  regionId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  registrationNumber?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  website?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
}>;

export type ClientResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Client'] = ResolversParentTypes['Client']> = ResolversObject<{
  addresses?: Resolver<Array<ResolversTypes['Address']>, ParentType, ContextType>;
  businessId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  businessName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  deletedAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  email?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  firstName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  invoices?: Resolver<Array<ResolversTypes['Invoice']>, ParentType, ContextType>;
  lastName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  notes?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  phone?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  projects?: Resolver<Array<ResolversTypes['Project']>, ParentType, ContextType>;
  type?: Resolver<ResolversTypes['ClientType'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
}>;

export type DashboardSummaryResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['DashboardSummary'] = ResolversParentTypes['DashboardSummary']> = ResolversObject<{
  invoicesDueSoon?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  tasksDueToday?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  totalOpenProjects?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  totalRevenueYTD?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
}>;

export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime';
}

export type InvoiceResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Invoice'] = ResolversParentTypes['Invoice']> = ResolversObject<{
  businessSnapshot?: Resolver<ResolversTypes['JSON'], ParentType, ContextType>;
  clientSnapshot?: Resolver<ResolversTypes['JSON'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  currencyCode?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  deletedAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  dueDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  invoiceNumber?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  invoicePrefix?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  invoiceSequence?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  issueDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  items?: Resolver<Array<ResolversTypes['InvoiceItem']>, ParentType, ContextType>;
  notes?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  payments?: Resolver<Array<ResolversTypes['Payment']>, ParentType, ContextType>;
  project?: Resolver<ResolversTypes['Project'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['InvoiceStatus'], ParentType, ContextType>;
  subtotal?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  taxAmount?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  taxLabelSnapshot?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  taxRate?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  totalAmount?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
}>;

export type InvoiceItemResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['InvoiceItem'] = ResolversParentTypes['InvoiceItem']> = ResolversObject<{
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  invoice?: Resolver<ResolversTypes['Invoice'], ParentType, ContextType>;
  quantity?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  total?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  unitPrice?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
}>;

export type InvoiceSettingsResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['InvoiceSettings'] = ResolversParentTypes['InvoiceSettings']> = ResolversObject<{
  abn?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  bankDetails?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  businessId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  businessName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  defaultDueDays?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  email?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  fromEmail?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  fromName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  invoicePrefix?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  logoUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  phone?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  smtpHost?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  smtpPassword?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  smtpPort?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  smtpUser?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  startingNumber?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  taxLabel?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  taxRate?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  website?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
}>;

export interface JsonScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['JSON'], any> {
  name: 'JSON';
}

export type MutationResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  _empty?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createBillableItem?: Resolver<ResolversTypes['BillableItem'], ParentType, ContextType, RequireFields<MutationCreateBillableItemArgs, 'input'>>;
  createBusiness?: Resolver<ResolversTypes['Business'], ParentType, ContextType, RequireFields<MutationCreateBusinessArgs, 'input'>>;
  createClient?: Resolver<ResolversTypes['Client'], ParentType, ContextType, RequireFields<MutationCreateClientArgs, 'input'>>;
  createExpense?: Resolver<ResolversTypes['ProjectExpense'], ParentType, ContextType, RequireFields<MutationCreateExpenseArgs, 'input'>>;
  createInvoice?: Resolver<ResolversTypes['Invoice'], ParentType, ContextType, RequireFields<MutationCreateInvoiceArgs, 'input'>>;
  createInvoiceFromQuote?: Resolver<ResolversTypes['Invoice'], ParentType, ContextType, RequireFields<MutationCreateInvoiceFromQuoteArgs, 'quoteId'>>;
  createPayment?: Resolver<ResolversTypes['Payment'], ParentType, ContextType, RequireFields<MutationCreatePaymentArgs, 'input'>>;
  createProject?: Resolver<ResolversTypes['Project'], ParentType, ContextType, RequireFields<MutationCreateProjectArgs, 'input'>>;
  createQuote?: Resolver<ResolversTypes['Quote'], ParentType, ContextType, RequireFields<MutationCreateQuoteArgs, 'input'>>;
  createTask?: Resolver<ResolversTypes['Task'], ParentType, ContextType, RequireFields<MutationCreateTaskArgs, 'input'>>;
  createTimeLog?: Resolver<ResolversTypes['TimeLog'], ParentType, ContextType, RequireFields<MutationCreateTimeLogArgs, 'input'>>;
  createUser?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationCreateUserArgs, 'input'>>;
  deleteBillableItem?: Resolver<ResolversTypes['BillableItem'], ParentType, ContextType, RequireFields<MutationDeleteBillableItemArgs, 'id'>>;
  deleteClient?: Resolver<ResolversTypes['Client'], ParentType, ContextType, RequireFields<MutationDeleteClientArgs, 'id'>>;
  deleteExpense?: Resolver<ResolversTypes['ProjectExpense'], ParentType, ContextType, RequireFields<MutationDeleteExpenseArgs, 'id'>>;
  deleteInvoice?: Resolver<ResolversTypes['Invoice'], ParentType, ContextType, RequireFields<MutationDeleteInvoiceArgs, 'id'>>;
  deletePayment?: Resolver<ResolversTypes['Payment'], ParentType, ContextType, RequireFields<MutationDeletePaymentArgs, 'id'>>;
  deleteProject?: Resolver<ResolversTypes['Project'], ParentType, ContextType, RequireFields<MutationDeleteProjectArgs, 'id'>>;
  deleteQuote?: Resolver<ResolversTypes['Quote'], ParentType, ContextType, RequireFields<MutationDeleteQuoteArgs, 'id'>>;
  deleteTask?: Resolver<ResolversTypes['Task'], ParentType, ContextType, RequireFields<MutationDeleteTaskArgs, 'id'>>;
  deleteTimeLog?: Resolver<ResolversTypes['TimeLog'], ParentType, ContextType, RequireFields<MutationDeleteTimeLogArgs, 'id'>>;
  deleteUser?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationDeleteUserArgs, 'id'>>;
  login?: Resolver<ResolversTypes['AuthPayload'], ParentType, ContextType, RequireFields<MutationLoginArgs, 'input'>>;
  register?: Resolver<ResolversTypes['AuthPayload'], ParentType, ContextType, RequireFields<MutationRegisterArgs, 'input'>>;
  updateBillableItem?: Resolver<ResolversTypes['BillableItem'], ParentType, ContextType, RequireFields<MutationUpdateBillableItemArgs, 'id' | 'input'>>;
  updateBusiness?: Resolver<ResolversTypes['Business'], ParentType, ContextType, RequireFields<MutationUpdateBusinessArgs, 'id' | 'input'>>;
  updateClient?: Resolver<ResolversTypes['Client'], ParentType, ContextType, RequireFields<MutationUpdateClientArgs, 'id' | 'input'>>;
  updateInvoice?: Resolver<ResolversTypes['Invoice'], ParentType, ContextType, RequireFields<MutationUpdateInvoiceArgs, 'id' | 'input'>>;
  updateInvoiceSettings?: Resolver<ResolversTypes['InvoiceSettings'], ParentType, ContextType, RequireFields<MutationUpdateInvoiceSettingsArgs, 'input'>>;
  updatePayment?: Resolver<ResolversTypes['Payment'], ParentType, ContextType, RequireFields<MutationUpdatePaymentArgs, 'id' | 'input'>>;
  updateProject?: Resolver<ResolversTypes['Project'], ParentType, ContextType, RequireFields<MutationUpdateProjectArgs, 'id' | 'input'>>;
  updateQuote?: Resolver<ResolversTypes['Quote'], ParentType, ContextType, RequireFields<MutationUpdateQuoteArgs, 'id' | 'input'>>;
  updateTask?: Resolver<ResolversTypes['Task'], ParentType, ContextType, RequireFields<MutationUpdateTaskArgs, 'id' | 'input'>>;
  updateTimeLog?: Resolver<ResolversTypes['TimeLog'], ParentType, ContextType, RequireFields<MutationUpdateTimeLogArgs, 'id' | 'input'>>;
  updateUser?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationUpdateUserArgs, 'id' | 'input'>>;
}>;

export type PaymentResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Payment'] = ResolversParentTypes['Payment']> = ResolversObject<{
  amount?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  businessId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  date?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  invoice?: Resolver<ResolversTypes['Invoice'], ParentType, ContextType>;
  invoiceId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  method?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  notes?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
}>;

export type ProjectResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Project'] = ResolversParentTypes['Project']> = ResolversObject<{
  budgetedAmount?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  businessId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  client?: Resolver<ResolversTypes['Client'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  deletedAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  endDate?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  expenses?: Resolver<Array<ResolversTypes['ProjectExpense']>, ParentType, ContextType>;
  financialSummary?: Resolver<ResolversTypes['ProjectFinancialSummary'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  invoices?: Resolver<Array<ResolversTypes['Invoice']>, ParentType, ContextType>;
  isOverdue?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  location?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  manager?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  progress?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  quotes?: Resolver<Array<ResolversTypes['Quote']>, ParentType, ContextType>;
  startDate?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  status?: Resolver<ResolversTypes['ProjectStatus'], ParentType, ContextType>;
  tasks?: Resolver<Array<ResolversTypes['Task']>, ParentType, ContextType>;
  timeLogs?: Resolver<Array<ResolversTypes['TimeLog']>, ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  totalHoursWorked?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
}>;

export type ProjectExpenseResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['ProjectExpense'] = ResolversParentTypes['ProjectExpense']> = ResolversObject<{
  amount?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  category?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  date?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  project?: Resolver<ResolversTypes['Project'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
}>;

export type ProjectFinancialSummaryResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['ProjectFinancialSummary'] = ResolversParentTypes['ProjectFinancialSummary']> = ResolversObject<{
  estimatedProfit?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  expensesTotal?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  hoursWorked?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  invoicesTotal?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  paymentsTotal?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
}>;

export type ProjectProfitabilityResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['ProjectProfitability'] = ResolversParentTypes['ProjectProfitability']> = ResolversObject<{
  netProfit?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  project?: Resolver<ResolversTypes['Project'], ParentType, ContextType>;
  totalLaborCosts?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  totalMaterialCosts?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  totalRevenue?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
}>;

export type QueryResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  _empty?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  billableItems?: Resolver<Array<ResolversTypes['BillableItem']>, ParentType, ContextType, RequireFields<QueryBillableItemsArgs, 'businessId'>>;
  business?: Resolver<Maybe<ResolversTypes['Business']>, ParentType, ContextType, RequireFields<QueryBusinessArgs, 'id'>>;
  businesses?: Resolver<Array<ResolversTypes['Business']>, ParentType, ContextType>;
  client?: Resolver<Maybe<ResolversTypes['Client']>, ParentType, ContextType, RequireFields<QueryClientArgs, 'id'>>;
  clients?: Resolver<Array<ResolversTypes['Client']>, ParentType, ContextType, RequireFields<QueryClientsArgs, 'businessId'>>;
  expenses?: Resolver<Array<ResolversTypes['ProjectExpense']>, ParentType, ContextType, RequireFields<QueryExpensesArgs, 'projectId'>>;
  getDashboardSummary?: Resolver<ResolversTypes['DashboardSummary'], ParentType, ContextType>;
  invoice?: Resolver<Maybe<ResolversTypes['Invoice']>, ParentType, ContextType, RequireFields<QueryInvoiceArgs, 'id'>>;
  invoiceSettings?: Resolver<Maybe<ResolversTypes['InvoiceSettings']>, ParentType, ContextType>;
  invoices?: Resolver<Array<ResolversTypes['Invoice']>, ParentType, ContextType, Partial<QueryInvoicesArgs>>;
  me?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  payments?: Resolver<Array<ResolversTypes['Payment']>, ParentType, ContextType, RequireFields<QueryPaymentsArgs, 'invoiceId'>>;
  project?: Resolver<Maybe<ResolversTypes['Project']>, ParentType, ContextType, RequireFields<QueryProjectArgs, 'id'>>;
  projectProfitability?: Resolver<ResolversTypes['ProjectProfitability'], ParentType, ContextType, RequireFields<QueryProjectProfitabilityArgs, 'projectId'>>;
  projectReport?: Resolver<ResolversTypes['ProjectFinancialSummary'], ParentType, ContextType, RequireFields<QueryProjectReportArgs, 'id'>>;
  projects?: Resolver<Array<ResolversTypes['Project']>, ParentType, ContextType>;
  quote?: Resolver<Maybe<ResolversTypes['Quote']>, ParentType, ContextType, RequireFields<QueryQuoteArgs, 'id'>>;
  quotesByProject?: Resolver<Array<ResolversTypes['Quote']>, ParentType, ContextType, RequireFields<QueryQuotesByProjectArgs, 'projectId'>>;
  task?: Resolver<Maybe<ResolversTypes['Task']>, ParentType, ContextType, RequireFields<QueryTaskArgs, 'id'>>;
  tasks?: Resolver<Array<ResolversTypes['Task']>, ParentType, ContextType>;
  timeLog?: Resolver<Maybe<ResolversTypes['TimeLog']>, ParentType, ContextType, RequireFields<QueryTimeLogArgs, 'id'>>;
  timeLogs?: Resolver<Array<ResolversTypes['TimeLog']>, ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<QueryUserArgs, 'id'>>;
  users?: Resolver<Array<ResolversTypes['User']>, ParentType, ContextType>;
}>;

export type QuoteResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Quote'] = ResolversParentTypes['Quote']> = ResolversObject<{
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  expiryDate?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  gstAmount?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  gstRate?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  issueDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  items?: Resolver<Array<ResolversTypes['QuoteItem']>, ParentType, ContextType>;
  project?: Resolver<ResolversTypes['Project'], ParentType, ContextType>;
  quoteNumber?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['QuoteStatus'], ParentType, ContextType>;
  subtotal?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  totalAmount?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
}>;

export type QuoteItemResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['QuoteItem'] = ResolversParentTypes['QuoteItem']> = ResolversObject<{
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  quantity?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  quote?: Resolver<ResolversTypes['Quote'], ParentType, ContextType>;
  total?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  unitPrice?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
}>;

export type RegionResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Region'] = ResolversParentTypes['Region']> = ResolversObject<{
  code?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  currencyCode?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  currencySymbol?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  defaultTaxRate?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  taxLabel?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
}>;

export type TaskResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Task'] = ResolversParentTypes['Task']> = ResolversObject<{
  assignedTo?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  assignedToId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  businessId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  dueDate?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  isCompleted?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  project?: Resolver<ResolversTypes['Project'], ParentType, ContextType>;
  projectId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['TaskStatus'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
}>;

export type TimeLogResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['TimeLog'] = ResolversParentTypes['TimeLog']> = ResolversObject<{
  businessId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  date?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  hoursWorked?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  notes?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  project?: Resolver<ResolversTypes['Project'], ParentType, ContextType>;
  projectId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  userId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
}>;

export type UserResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = ResolversObject<{
  business?: Resolver<Maybe<ResolversTypes['Business']>, ParentType, ContextType>;
  businessId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  hourlyRate?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  phone?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  role?: Resolver<ResolversTypes['UserRole'], ParentType, ContextType>;
  tasks?: Resolver<Array<ResolversTypes['Task']>, ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
}>;

export type Resolvers<ContextType = GraphQLContext> = ResolversObject<{
  Address?: AddressResolvers<ContextType>;
  AuthPayload?: AuthPayloadResolvers<ContextType>;
  BillableItem?: BillableItemResolvers<ContextType>;
  Business?: BusinessResolvers<ContextType>;
  Client?: ClientResolvers<ContextType>;
  DashboardSummary?: DashboardSummaryResolvers<ContextType>;
  DateTime?: GraphQLScalarType;
  Invoice?: InvoiceResolvers<ContextType>;
  InvoiceItem?: InvoiceItemResolvers<ContextType>;
  InvoiceSettings?: InvoiceSettingsResolvers<ContextType>;
  JSON?: GraphQLScalarType;
  Mutation?: MutationResolvers<ContextType>;
  Payment?: PaymentResolvers<ContextType>;
  Project?: ProjectResolvers<ContextType>;
  ProjectExpense?: ProjectExpenseResolvers<ContextType>;
  ProjectFinancialSummary?: ProjectFinancialSummaryResolvers<ContextType>;
  ProjectProfitability?: ProjectProfitabilityResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Quote?: QuoteResolvers<ContextType>;
  QuoteItem?: QuoteItemResolvers<ContextType>;
  Region?: RegionResolvers<ContextType>;
  Task?: TaskResolvers<ContextType>;
  TimeLog?: TimeLogResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
}>;

