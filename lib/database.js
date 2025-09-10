let users = [
  {
    id: "u1",
    name: "Alice Rep",
    email: "alice@acme.com",
    password: "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // password
    role: "rep"
  },
  {
    id: "u2",
    name: "Bob Manager",
    email: "bob@acme.com",
    password: "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // password
    role: "manager"
  },
  {
    id: "u3",
    name: "Admin User",
    email: "admin@acme.com",
    password: "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // password
    role: "admin"
  },
  {
    id: "u4",
    name: "John Sales Rep",
    email: "john@company.com",
    password: "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // password
    role: "rep"
  },
  {
    id: "u5",
    name: "John Manager",
    email: "john@company.com",
    password: "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // password
    role: "manager"
  },
  {
    id: "u6",
    name: "John Admin",
    email: "john@company.com",
    password: "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // password
    role: "admin"
  }
];

let leads = [
  {
    id: "l1",
    name: "John Buyer",
    email: "john@buyer.com",
    phone: "9999999999",
    status: "New",
    ownerId: "u1"
  },
  {
    id: "l2",
    name: "Jane Customer",
    email: "jane@customer.com", 
    phone: "8888888888",
    status: "Contacted",
    ownerId: "u1"
  }
];

let opportunities = [
  {
    id: "o1",
    title: "John Buyer – First Deal",
    value: 5000,
    stage: "Discovery",
    ownerId: "u1",
    leadId: "l1"
  }
];

export const generateId = () => Math.random().toString(36).substr(2, 9);

export const getUsers = () => users;
export const getUserById = (id) => users.find(u => u.id === id);
export const getUserByEmail = (email) => users.find(u => u.email === email);
export const addUser = (user) => {
  const newUser = { ...user, id: generateId() };
  users.push(newUser);
  return newUser;
};

export const getLeads = (ownerId = null) => {
  if (ownerId) {
    return leads.filter(l => l.ownerId === ownerId);
  }
  return leads;
};

export const getLeadById = (id) => leads.find(l => l.id === id);
export const addLead = (lead) => {
  const newLead = { ...lead, id: generateId() };
  leads.push(newLead);
  return newLead;
};
export const updateLead = (id, updates) => {
  const index = leads.findIndex(l => l.id === id);
  if (index !== -1) {
    leads[index] = { ...leads[index], ...updates };
    return leads[index];
  }
  return null;
};
export const deleteLead = (id) => {
  const index = leads.findIndex(l => l.id === id);
  if (index !== -1) {
    return leads.splice(index, 1)[0];
  }
  return null;
};

export const getOpportunities = (ownerId = null) => {
  if (ownerId) {
    return opportunities.filter(o => o.ownerId === ownerId);
  }
  return opportunities;
};

export const getOpportunityById = (id) => opportunities.find(o => o.id === id);
export const addOpportunity = (opportunity) => {
  const newOpportunity = { ...opportunity, id: generateId() };
  opportunities.push(newOpportunity);
  return newOpportunity;
};
export const updateOpportunity = (id, updates) => {
  const index = opportunities.findIndex(o => o.id === id);
  if (index !== -1) {
    opportunities[index] = { ...opportunities[index], ...updates };
    return opportunities[index];
  }
  return null;
};
export const deleteOpportunity = (id) => {
  const index = opportunities.findIndex(o => o.id === id);
  if (index !== -1) {
    return opportunities.splice(index, 1)[0];
  }
  return null;
};
