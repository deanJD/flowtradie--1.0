import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
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
};

export type AuthPayload = {
  __typename?: 'AuthPayload';
  token: Scalars['String']['output'];
  user: User;
};

export type CreateCustomerInput = {
  address?: InputMaybe<Scalars['String']['input']>;
  email: Scalars['String']['input'];
  name: Scalars['String']['input'];
  phone?: InputMaybe<Scalars['String']['input']>;
};

export type CreateExpenseInput = {
  amount: Scalars['Float']['input'];
  category: Scalars['String']['input'];
  date?: InputMaybe<Scalars['DateTime']['input']>;
  description: Scalars['String']['input'];
  jobId: Scalars['ID']['input'];
};

export type CreateInvoiceInput = {
  dueDate: Scalars['DateTime']['input'];
  gstRate?: InputMaybe<Scalars['Float']['input']>;
  invoiceNumber: Scalars['String']['input'];
  items: Array<CreateInvoiceItemInput>;
  jobId: Scalars['ID']['input'];
  status?: InputMaybe<InvoiceStatus>;
};

export type CreateInvoiceItemInput = {
  description: Scalars['String']['input'];
  quantity?: InputMaybe<Scalars['Int']['input']>;
  unitPrice: Scalars['Float']['input'];
};

export type CreateJobInput = {
  customerId: Scalars['ID']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  endDate?: InputMaybe<Scalars['DateTime']['input']>;
  location?: InputMaybe<Scalars['String']['input']>;
  managerId?: InputMaybe<Scalars['ID']['input']>;
  startDate?: InputMaybe<Scalars['DateTime']['input']>;
  status?: InputMaybe<JobStatus>;
  title: Scalars['String']['input'];
};

export type CreateQuoteInput = {
  expiryDate?: InputMaybe<Scalars['DateTime']['input']>;
  gstRate?: InputMaybe<Scalars['Float']['input']>;
  items: Array<CreateQuoteItemInput>;
  jobId: Scalars['ID']['input'];
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
  jobId: Scalars['ID']['input'];
  title: Scalars['String']['input'];
};

export type CreateTimeLogInput = {
  date: Scalars['DateTime']['input'];
  hoursWorked: Scalars['Float']['input'];
  jobId: Scalars['ID']['input'];
  notes?: InputMaybe<Scalars['String']['input']>;
  userId: Scalars['ID']['input'];
};

export type CreateUserInput = {
  email: Scalars['String']['input'];
  hourlyRate?: InputMaybe<Scalars['Float']['input']>;
  name: Scalars['String']['input'];
  phone?: InputMaybe<Scalars['String']['input']>;
  role?: InputMaybe<UserRole>;
};

export type Customer = {
  __typename?: 'Customer';
  address?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  jobs?: Maybe<Array<Job>>;
  name: Scalars['String']['output'];
  phone?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
};

export type Invoice = {
  __typename?: 'Invoice';
  createdAt: Scalars['DateTime']['output'];
  dueDate: Scalars['DateTime']['output'];
  gstAmount: Scalars['Float']['output'];
  gstRate: Scalars['Float']['output'];
  id: Scalars['ID']['output'];
  invoiceNumber: Scalars['String']['output'];
  issueDate: Scalars['DateTime']['output'];
  items: Array<InvoiceItem>;
  job: Job;
  payments: Array<Payment>;
  status: InvoiceStatus;
  subtotal: Scalars['Float']['output'];
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

export enum InvoiceStatus {
  Draft = 'DRAFT',
  Overdue = 'OVERDUE',
  Paid = 'PAID',
  PartiallyPaid = 'PARTIALLY_PAID',
  Sent = 'SENT'
}

export type Job = {
  __typename?: 'Job';
  createdAt: Scalars['DateTime']['output'];
  customer: Customer;
  description?: Maybe<Scalars['String']['output']>;
  endDate?: Maybe<Scalars['DateTime']['output']>;
  expenses?: Maybe<Array<JobExpense>>;
  id: Scalars['ID']['output'];
  invoices?: Maybe<Array<Invoice>>;
  location?: Maybe<Scalars['String']['output']>;
  manager?: Maybe<User>;
  quotes?: Maybe<Array<Quote>>;
  startDate?: Maybe<Scalars['DateTime']['output']>;
  status: JobStatus;
  tasks?: Maybe<Array<Task>>;
  timeLogs?: Maybe<Array<TimeLog>>;
  title: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type JobExpense = {
  __typename?: 'JobExpense';
  amount: Scalars['Float']['output'];
  category: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  date: Scalars['DateTime']['output'];
  description: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  job: Job;
  updatedAt: Scalars['DateTime']['output'];
};

export type JobProfitability = {
  __typename?: 'JobProfitability';
  job: Job;
  netProfit: Scalars['Float']['output'];
  totalLaborCosts: Scalars['Float']['output'];
  totalMaterialCosts: Scalars['Float']['output'];
  totalRevenue: Scalars['Float']['output'];
};

export enum JobStatus {
  Active = 'ACTIVE',
  Cancelled = 'CANCELLED',
  Completed = 'COMPLETED',
  Pending = 'PENDING'
}

export type LoginInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  _empty?: Maybe<Scalars['String']['output']>;
  createCustomer: Customer;
  createExpense: JobExpense;
  createInvoice: Invoice;
  createJob: Job;
  createQuote: Quote;
  createTask: Task;
  createTimeLog: TimeLog;
  createUser: User;
  deleteCustomer: Customer;
  deleteExpense: JobExpense;
  deleteInvoice: Invoice;
  deleteJob: Job;
  deleteQuote: Quote;
  deleteTask: Task;
  deleteTimeLog: TimeLog;
  deleteUser: User;
  login: AuthPayload;
  recordPayment: Payment;
  register: AuthPayload;
  updateCustomer: Customer;
  updateInvoice: Invoice;
  updateJob: Job;
  updateQuote: Quote;
  updateTask: Task;
  updateTimeLog: TimeLog;
  updateUser: User;
};


export type MutationCreateCustomerArgs = {
  input: CreateCustomerInput;
};


export type MutationCreateExpenseArgs = {
  input: CreateExpenseInput;
};


export type MutationCreateInvoiceArgs = {
  input: CreateInvoiceInput;
};


export type MutationCreateJobArgs = {
  input: CreateJobInput;
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


export type MutationDeleteCustomerArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteExpenseArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteInvoiceArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteJobArgs = {
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


export type MutationRecordPaymentArgs = {
  input: RecordPaymentInput;
};


export type MutationRegisterArgs = {
  input: RegisterInput;
};


export type MutationUpdateCustomerArgs = {
  id: Scalars['ID']['input'];
  input: UpdateCustomerInput;
};


export type MutationUpdateInvoiceArgs = {
  id: Scalars['ID']['input'];
  input: UpdateInvoiceInput;
};


export type MutationUpdateJobArgs = {
  id: Scalars['ID']['input'];
  input: UpdateJobInput;
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
  createdAt: Scalars['DateTime']['output'];
  date: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  invoice: Invoice;
  method: Scalars['String']['output'];
  notes?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
};

export type Query = {
  __typename?: 'Query';
  _empty?: Maybe<Scalars['String']['output']>;
  customer?: Maybe<Customer>;
  customers?: Maybe<Array<Customer>>;
  expenses?: Maybe<Array<JobExpense>>;
  invoice?: Maybe<Invoice>;
  invoices: Array<Invoice>;
  job?: Maybe<Job>;
  jobProfitability: JobProfitability;
  jobs?: Maybe<Array<Job>>;
  quote?: Maybe<Quote>;
  quotesByJob: Array<Quote>;
  task?: Maybe<Task>;
  tasks?: Maybe<Array<Task>>;
  timeLogsForJob?: Maybe<Array<TimeLog>>;
  timeLogsForUser?: Maybe<Array<TimeLog>>;
  user?: Maybe<User>;
  users: Array<User>;
};


export type QueryCustomerArgs = {
  id: Scalars['ID']['input'];
};


export type QueryExpensesArgs = {
  jobId: Scalars['ID']['input'];
};


export type QueryInvoiceArgs = {
  id: Scalars['ID']['input'];
};


export type QueryInvoicesArgs = {
  jobId?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryJobArgs = {
  id: Scalars['ID']['input'];
};


export type QueryJobProfitabilityArgs = {
  jobId: Scalars['ID']['input'];
};


export type QueryJobsArgs = {
  customerId?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryQuoteArgs = {
  id: Scalars['ID']['input'];
};


export type QueryQuotesByJobArgs = {
  jobId: Scalars['ID']['input'];
};


export type QueryTaskArgs = {
  id: Scalars['ID']['input'];
};


export type QueryTasksArgs = {
  jobId: Scalars['ID']['input'];
};


export type QueryTimeLogsForJobArgs = {
  jobId: Scalars['ID']['input'];
};


export type QueryTimeLogsForUserArgs = {
  userId: Scalars['ID']['input'];
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
  job: Job;
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

export type RecordPaymentInput = {
  amount: Scalars['Float']['input'];
  date?: InputMaybe<Scalars['DateTime']['input']>;
  invoiceId: Scalars['ID']['input'];
  method: Scalars['String']['input'];
  notes?: InputMaybe<Scalars['String']['input']>;
};

export type RegisterInput = {
  email: Scalars['String']['input'];
  name: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type Task = {
  __typename?: 'Task';
  assignedTo?: Maybe<User>;
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  dueDate?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['ID']['output'];
  isCompleted: Scalars['Boolean']['output'];
  job: Job;
  title: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type TimeLog = {
  __typename?: 'TimeLog';
  date: Scalars['DateTime']['output'];
  hoursWorked: Scalars['Float']['output'];
  id: Scalars['ID']['output'];
  job: Job;
  notes?: Maybe<Scalars['String']['output']>;
  user: User;
};

export type UpdateCustomerInput = {
  address?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateInvoiceInput = {
  dueDate?: InputMaybe<Scalars['DateTime']['input']>;
  gstRate?: InputMaybe<Scalars['Float']['input']>;
  invoiceNumber?: InputMaybe<Scalars['String']['input']>;
  items?: InputMaybe<Array<CreateInvoiceItemInput>>;
  status?: InputMaybe<InvoiceStatus>;
};

export type UpdateJobInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  endDate?: InputMaybe<Scalars['DateTime']['input']>;
  location?: InputMaybe<Scalars['String']['input']>;
  managerId?: InputMaybe<Scalars['ID']['input']>;
  startDate?: InputMaybe<Scalars['DateTime']['input']>;
  status?: InputMaybe<JobStatus>;
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
  createdAt: Scalars['String']['output'];
  email: Scalars['String']['output'];
  hourlyRate?: Maybe<Scalars['Float']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  phone?: Maybe<Scalars['String']['output']>;
  role: UserRole;
  tasks: Array<Task>;
  updatedAt: Scalars['String']['output'];
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
  AuthPayload: ResolverTypeWrapper<AuthPayload>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  CreateCustomerInput: CreateCustomerInput;
  CreateExpenseInput: CreateExpenseInput;
  CreateInvoiceInput: CreateInvoiceInput;
  CreateInvoiceItemInput: CreateInvoiceItemInput;
  CreateJobInput: CreateJobInput;
  CreateQuoteInput: CreateQuoteInput;
  CreateQuoteItemInput: CreateQuoteItemInput;
  CreateTaskInput: CreateTaskInput;
  CreateTimeLogInput: CreateTimeLogInput;
  CreateUserInput: CreateUserInput;
  Customer: ResolverTypeWrapper<Customer>;
  DateTime: ResolverTypeWrapper<Scalars['DateTime']['output']>;
  Float: ResolverTypeWrapper<Scalars['Float']['output']>;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  Invoice: ResolverTypeWrapper<Invoice>;
  InvoiceItem: ResolverTypeWrapper<InvoiceItem>;
  InvoiceStatus: InvoiceStatus;
  Job: ResolverTypeWrapper<Job>;
  JobExpense: ResolverTypeWrapper<JobExpense>;
  JobProfitability: ResolverTypeWrapper<JobProfitability>;
  JobStatus: JobStatus;
  LoginInput: LoginInput;
  Mutation: ResolverTypeWrapper<Record<PropertyKey, never>>;
  Payment: ResolverTypeWrapper<Payment>;
  Query: ResolverTypeWrapper<Record<PropertyKey, never>>;
  Quote: ResolverTypeWrapper<Quote>;
  QuoteItem: ResolverTypeWrapper<QuoteItem>;
  QuoteStatus: QuoteStatus;
  RecordPaymentInput: RecordPaymentInput;
  RegisterInput: RegisterInput;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  Task: ResolverTypeWrapper<Task>;
  TimeLog: ResolverTypeWrapper<TimeLog>;
  UpdateCustomerInput: UpdateCustomerInput;
  UpdateInvoiceInput: UpdateInvoiceInput;
  UpdateJobInput: UpdateJobInput;
  UpdateQuoteInput: UpdateQuoteInput;
  UpdateTaskInput: UpdateTaskInput;
  UpdateTimeLogInput: UpdateTimeLogInput;
  UpdateUserInput: UpdateUserInput;
  User: ResolverTypeWrapper<User>;
  UserRole: UserRole;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  AuthPayload: AuthPayload;
  Boolean: Scalars['Boolean']['output'];
  CreateCustomerInput: CreateCustomerInput;
  CreateExpenseInput: CreateExpenseInput;
  CreateInvoiceInput: CreateInvoiceInput;
  CreateInvoiceItemInput: CreateInvoiceItemInput;
  CreateJobInput: CreateJobInput;
  CreateQuoteInput: CreateQuoteInput;
  CreateQuoteItemInput: CreateQuoteItemInput;
  CreateTaskInput: CreateTaskInput;
  CreateTimeLogInput: CreateTimeLogInput;
  CreateUserInput: CreateUserInput;
  Customer: Customer;
  DateTime: Scalars['DateTime']['output'];
  Float: Scalars['Float']['output'];
  ID: Scalars['ID']['output'];
  Int: Scalars['Int']['output'];
  Invoice: Invoice;
  InvoiceItem: InvoiceItem;
  Job: Job;
  JobExpense: JobExpense;
  JobProfitability: JobProfitability;
  LoginInput: LoginInput;
  Mutation: Record<PropertyKey, never>;
  Payment: Payment;
  Query: Record<PropertyKey, never>;
  Quote: Quote;
  QuoteItem: QuoteItem;
  RecordPaymentInput: RecordPaymentInput;
  RegisterInput: RegisterInput;
  String: Scalars['String']['output'];
  Task: Task;
  TimeLog: TimeLog;
  UpdateCustomerInput: UpdateCustomerInput;
  UpdateInvoiceInput: UpdateInvoiceInput;
  UpdateJobInput: UpdateJobInput;
  UpdateQuoteInput: UpdateQuoteInput;
  UpdateTaskInput: UpdateTaskInput;
  UpdateTimeLogInput: UpdateTimeLogInput;
  UpdateUserInput: UpdateUserInput;
  User: User;
}>;

export type AuthPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['AuthPayload'] = ResolversParentTypes['AuthPayload']> = ResolversObject<{
  token?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
}>;

export type CustomerResolvers<ContextType = any, ParentType extends ResolversParentTypes['Customer'] = ResolversParentTypes['Customer']> = ResolversObject<{
  address?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  jobs?: Resolver<Maybe<Array<ResolversTypes['Job']>>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  phone?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
}>;

export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime';
}

export type InvoiceResolvers<ContextType = any, ParentType extends ResolversParentTypes['Invoice'] = ResolversParentTypes['Invoice']> = ResolversObject<{
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  dueDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  gstAmount?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  gstRate?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  invoiceNumber?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  issueDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  items?: Resolver<Array<ResolversTypes['InvoiceItem']>, ParentType, ContextType>;
  job?: Resolver<ResolversTypes['Job'], ParentType, ContextType>;
  payments?: Resolver<Array<ResolversTypes['Payment']>, ParentType, ContextType>;
  status?: Resolver<ResolversTypes['InvoiceStatus'], ParentType, ContextType>;
  subtotal?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  totalAmount?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
}>;

export type InvoiceItemResolvers<ContextType = any, ParentType extends ResolversParentTypes['InvoiceItem'] = ResolversParentTypes['InvoiceItem']> = ResolversObject<{
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  invoice?: Resolver<ResolversTypes['Invoice'], ParentType, ContextType>;
  quantity?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  total?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  unitPrice?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
}>;

export type JobResolvers<ContextType = any, ParentType extends ResolversParentTypes['Job'] = ResolversParentTypes['Job']> = ResolversObject<{
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  customer?: Resolver<ResolversTypes['Customer'], ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  endDate?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  expenses?: Resolver<Maybe<Array<ResolversTypes['JobExpense']>>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  invoices?: Resolver<Maybe<Array<ResolversTypes['Invoice']>>, ParentType, ContextType>;
  location?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  manager?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  quotes?: Resolver<Maybe<Array<ResolversTypes['Quote']>>, ParentType, ContextType>;
  startDate?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  status?: Resolver<ResolversTypes['JobStatus'], ParentType, ContextType>;
  tasks?: Resolver<Maybe<Array<ResolversTypes['Task']>>, ParentType, ContextType>;
  timeLogs?: Resolver<Maybe<Array<ResolversTypes['TimeLog']>>, ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
}>;

export type JobExpenseResolvers<ContextType = any, ParentType extends ResolversParentTypes['JobExpense'] = ResolversParentTypes['JobExpense']> = ResolversObject<{
  amount?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  category?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  date?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  job?: Resolver<ResolversTypes['Job'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
}>;

export type JobProfitabilityResolvers<ContextType = any, ParentType extends ResolversParentTypes['JobProfitability'] = ResolversParentTypes['JobProfitability']> = ResolversObject<{
  job?: Resolver<ResolversTypes['Job'], ParentType, ContextType>;
  netProfit?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  totalLaborCosts?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  totalMaterialCosts?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  totalRevenue?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
}>;

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  _empty?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createCustomer?: Resolver<ResolversTypes['Customer'], ParentType, ContextType, RequireFields<MutationCreateCustomerArgs, 'input'>>;
  createExpense?: Resolver<ResolversTypes['JobExpense'], ParentType, ContextType, RequireFields<MutationCreateExpenseArgs, 'input'>>;
  createInvoice?: Resolver<ResolversTypes['Invoice'], ParentType, ContextType, RequireFields<MutationCreateInvoiceArgs, 'input'>>;
  createJob?: Resolver<ResolversTypes['Job'], ParentType, ContextType, RequireFields<MutationCreateJobArgs, 'input'>>;
  createQuote?: Resolver<ResolversTypes['Quote'], ParentType, ContextType, RequireFields<MutationCreateQuoteArgs, 'input'>>;
  createTask?: Resolver<ResolversTypes['Task'], ParentType, ContextType, RequireFields<MutationCreateTaskArgs, 'input'>>;
  createTimeLog?: Resolver<ResolversTypes['TimeLog'], ParentType, ContextType, RequireFields<MutationCreateTimeLogArgs, 'input'>>;
  createUser?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationCreateUserArgs, 'input'>>;
  deleteCustomer?: Resolver<ResolversTypes['Customer'], ParentType, ContextType, RequireFields<MutationDeleteCustomerArgs, 'id'>>;
  deleteExpense?: Resolver<ResolversTypes['JobExpense'], ParentType, ContextType, RequireFields<MutationDeleteExpenseArgs, 'id'>>;
  deleteInvoice?: Resolver<ResolversTypes['Invoice'], ParentType, ContextType, RequireFields<MutationDeleteInvoiceArgs, 'id'>>;
  deleteJob?: Resolver<ResolversTypes['Job'], ParentType, ContextType, RequireFields<MutationDeleteJobArgs, 'id'>>;
  deleteQuote?: Resolver<ResolversTypes['Quote'], ParentType, ContextType, RequireFields<MutationDeleteQuoteArgs, 'id'>>;
  deleteTask?: Resolver<ResolversTypes['Task'], ParentType, ContextType, RequireFields<MutationDeleteTaskArgs, 'id'>>;
  deleteTimeLog?: Resolver<ResolversTypes['TimeLog'], ParentType, ContextType, RequireFields<MutationDeleteTimeLogArgs, 'id'>>;
  deleteUser?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationDeleteUserArgs, 'id'>>;
  login?: Resolver<ResolversTypes['AuthPayload'], ParentType, ContextType, RequireFields<MutationLoginArgs, 'input'>>;
  recordPayment?: Resolver<ResolversTypes['Payment'], ParentType, ContextType, RequireFields<MutationRecordPaymentArgs, 'input'>>;
  register?: Resolver<ResolversTypes['AuthPayload'], ParentType, ContextType, RequireFields<MutationRegisterArgs, 'input'>>;
  updateCustomer?: Resolver<ResolversTypes['Customer'], ParentType, ContextType, RequireFields<MutationUpdateCustomerArgs, 'id' | 'input'>>;
  updateInvoice?: Resolver<ResolversTypes['Invoice'], ParentType, ContextType, RequireFields<MutationUpdateInvoiceArgs, 'id' | 'input'>>;
  updateJob?: Resolver<ResolversTypes['Job'], ParentType, ContextType, RequireFields<MutationUpdateJobArgs, 'id' | 'input'>>;
  updateQuote?: Resolver<ResolversTypes['Quote'], ParentType, ContextType, RequireFields<MutationUpdateQuoteArgs, 'id' | 'input'>>;
  updateTask?: Resolver<ResolversTypes['Task'], ParentType, ContextType, RequireFields<MutationUpdateTaskArgs, 'id' | 'input'>>;
  updateTimeLog?: Resolver<ResolversTypes['TimeLog'], ParentType, ContextType, RequireFields<MutationUpdateTimeLogArgs, 'id' | 'input'>>;
  updateUser?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationUpdateUserArgs, 'id' | 'input'>>;
}>;

export type PaymentResolvers<ContextType = any, ParentType extends ResolversParentTypes['Payment'] = ResolversParentTypes['Payment']> = ResolversObject<{
  amount?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  date?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  invoice?: Resolver<ResolversTypes['Invoice'], ParentType, ContextType>;
  method?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  notes?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
}>;

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  _empty?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  customer?: Resolver<Maybe<ResolversTypes['Customer']>, ParentType, ContextType, RequireFields<QueryCustomerArgs, 'id'>>;
  customers?: Resolver<Maybe<Array<ResolversTypes['Customer']>>, ParentType, ContextType>;
  expenses?: Resolver<Maybe<Array<ResolversTypes['JobExpense']>>, ParentType, ContextType, RequireFields<QueryExpensesArgs, 'jobId'>>;
  invoice?: Resolver<Maybe<ResolversTypes['Invoice']>, ParentType, ContextType, RequireFields<QueryInvoiceArgs, 'id'>>;
  invoices?: Resolver<Array<ResolversTypes['Invoice']>, ParentType, ContextType, Partial<QueryInvoicesArgs>>;
  job?: Resolver<Maybe<ResolversTypes['Job']>, ParentType, ContextType, RequireFields<QueryJobArgs, 'id'>>;
  jobProfitability?: Resolver<ResolversTypes['JobProfitability'], ParentType, ContextType, RequireFields<QueryJobProfitabilityArgs, 'jobId'>>;
  jobs?: Resolver<Maybe<Array<ResolversTypes['Job']>>, ParentType, ContextType, Partial<QueryJobsArgs>>;
  quote?: Resolver<Maybe<ResolversTypes['Quote']>, ParentType, ContextType, RequireFields<QueryQuoteArgs, 'id'>>;
  quotesByJob?: Resolver<Array<ResolversTypes['Quote']>, ParentType, ContextType, RequireFields<QueryQuotesByJobArgs, 'jobId'>>;
  task?: Resolver<Maybe<ResolversTypes['Task']>, ParentType, ContextType, RequireFields<QueryTaskArgs, 'id'>>;
  tasks?: Resolver<Maybe<Array<ResolversTypes['Task']>>, ParentType, ContextType, RequireFields<QueryTasksArgs, 'jobId'>>;
  timeLogsForJob?: Resolver<Maybe<Array<ResolversTypes['TimeLog']>>, ParentType, ContextType, RequireFields<QueryTimeLogsForJobArgs, 'jobId'>>;
  timeLogsForUser?: Resolver<Maybe<Array<ResolversTypes['TimeLog']>>, ParentType, ContextType, RequireFields<QueryTimeLogsForUserArgs, 'userId'>>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<QueryUserArgs, 'id'>>;
  users?: Resolver<Array<ResolversTypes['User']>, ParentType, ContextType>;
}>;

export type QuoteResolvers<ContextType = any, ParentType extends ResolversParentTypes['Quote'] = ResolversParentTypes['Quote']> = ResolversObject<{
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  expiryDate?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  gstAmount?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  gstRate?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  issueDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  items?: Resolver<Array<ResolversTypes['QuoteItem']>, ParentType, ContextType>;
  job?: Resolver<ResolversTypes['Job'], ParentType, ContextType>;
  quoteNumber?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['QuoteStatus'], ParentType, ContextType>;
  subtotal?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  totalAmount?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
}>;

export type QuoteItemResolvers<ContextType = any, ParentType extends ResolversParentTypes['QuoteItem'] = ResolversParentTypes['QuoteItem']> = ResolversObject<{
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  quantity?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  quote?: Resolver<ResolversTypes['Quote'], ParentType, ContextType>;
  total?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  unitPrice?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
}>;

export type TaskResolvers<ContextType = any, ParentType extends ResolversParentTypes['Task'] = ResolversParentTypes['Task']> = ResolversObject<{
  assignedTo?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  dueDate?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  isCompleted?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  job?: Resolver<ResolversTypes['Job'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
}>;

export type TimeLogResolvers<ContextType = any, ParentType extends ResolversParentTypes['TimeLog'] = ResolversParentTypes['TimeLog']> = ResolversObject<{
  date?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  hoursWorked?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  job?: Resolver<ResolversTypes['Job'], ParentType, ContextType>;
  notes?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
}>;

export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = ResolversObject<{
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  hourlyRate?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  phone?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  role?: Resolver<ResolversTypes['UserRole'], ParentType, ContextType>;
  tasks?: Resolver<Array<ResolversTypes['Task']>, ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
}>;

export type Resolvers<ContextType = any> = ResolversObject<{
  AuthPayload?: AuthPayloadResolvers<ContextType>;
  Customer?: CustomerResolvers<ContextType>;
  DateTime?: GraphQLScalarType;
  Invoice?: InvoiceResolvers<ContextType>;
  InvoiceItem?: InvoiceItemResolvers<ContextType>;
  Job?: JobResolvers<ContextType>;
  JobExpense?: JobExpenseResolvers<ContextType>;
  JobProfitability?: JobProfitabilityResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Payment?: PaymentResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Quote?: QuoteResolvers<ContextType>;
  QuoteItem?: QuoteItemResolvers<ContextType>;
  Task?: TaskResolvers<ContextType>;
  TimeLog?: TimeLogResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
}>;

