# Mini CRM

A simple sales management system for teams. Track leads, convert them to deals, and manage your sales process.

## What This Does

### Main Features
- ✅ **Login System**: Secure login with different user types
- ✅ **User Types**: Sales Rep, Sales Manager, and Administrator
- ✅ **Lead Tracking**: Add, edit, and track potential customers
- ✅ **Deal Management**: Convert leads to deals and track progress
- ✅ **Lead to Deal**: Turn qualified leads into sales opportunities
- ✅ **Data Privacy**: Sales Reps see only their data, Managers see everything
- ✅ **Easy Interface**: Simple forms and tables to manage everything

### Who Can Do What
- **Sales Rep**: 
  - Add and manage their own leads
  - Turn leads into deals
  - Track their own deals
  - Only see their own work

- **Sales Manager**:
  - See all leads and deals from the team
  - Update deal stages
  - Manage users and settings
  - View team statistics

## What It's Built With

- **Frontend**: Next.js (React framework)
- **Backend**: Next.js API routes
- **Login**: Secure token-based authentication
- **Data Storage**: In-memory (can be changed to a real database later)
- **Design**: Custom CSS with yellow and black theme

## How to Run This

### What You Need
- Node.js (version 18 or newer)
- npm (comes with Node.js)

### Setup Steps

1. **Download the code**
   ```bash
   git clone <repository-url>
   cd crm-sales-team
   ```

2. **Install required packages**
   ```bash
   npm install
   ```

3. **Start the application**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   Go to [http://localhost:3000](http://localhost:3000)

### Test Accounts

Try these accounts to see how it works:

- **Sales Rep**: 
  - Email: `alice@acme.com`
  - Password: `password`

- **Sales Manager**: 
  - Email: `bob@acme.com`
  - Password: `password`

- **Administrator**: 
  - Email: `admin@acme.com`
  - Password: `password`

## How to Use

### For Sales Reps

1. **Login** with your email and password
2. **Check Dashboard** to see your numbers
3. **Add Leads**:
   - Add new potential customers
   - Update their status (New → Contacted → Qualified)
   - Turn qualified leads into deals
4. **Track Deals**:
   - See deal value and progress
   - Update deal stages as they move forward

### For Sales Managers

1. **Login** with manager account
2. **View Dashboard** to see team numbers
3. **Monitor Team**:
   - See all leads from everyone
   - Track all deals and their progress
   - Manage users and settings
4. **Update Deal Stages**: Can change deal stages for any team member

## How Data is Stored

### User Information
- Name, email, password
- Role: Sales Rep, Manager, or Administrator

### Lead Information
- Name, email, phone number
- Status: New, Contacted, or Qualified
- Who owns the lead

### Deal Information
- Deal title and value
- Stage: Discovery, Proposal, Won, or Lost
- Who owns the deal
- Which lead it came from

## Technical Details

### Login System
- Login, signup, and logout
- Get current user info

### Lead Management
- Get, create, update, and delete leads
- Filtered by user role

### Deal Management
- Get, create, update, and delete deals
- Filtered by user role

### Dashboard
- Get statistics and numbers

### Admin
- Manage users (admin only)

## File Structure

```
crm-sales-team/
├── app/
│   ├── api/                 # Backend code
│   │   ├── auth/           # Login system
│   │   ├── leads/          # Lead management
│   │   ├── opportunities/  # Deal management
│   │   ├── dashboard/      # Statistics
│   │   ├── user/           # User info
│   │   └── admin/          # Admin functions
│   ├── dashboard/          # Dashboard page
│   ├── leads/              # Leads page
│   ├── opportunities/      # Deals page
│   ├── admin/              # Admin page
│   ├── login/              # Login page
│   ├── signup/             # Signup page
│   ├── layout.js           # Main layout
│   └── globals.css         # Styling
├── components/
│   ├── Header.js           # Top header
│   └── Navigation.js       # Menu
├── lib/
│   ├── auth.js             # Login functions
│   └── database.js         # Data storage
├── middleware.js           # Security
├── package.json
└── README.md
```

## Future Ideas

### Possible Improvements
- **Real Database**: Use MongoDB or PostgreSQL instead of memory
- **Live Updates**: Real-time updates when data changes
- **Email Reminders**: Send automatic emails for follow-ups
- **Better Reports**: More detailed analytics and charts
- **Mobile App**: Phone app version
- **API Docs**: Better documentation for developers
- **Testing**: Add automated tests
- **Deployment**: Easy cloud deployment

### Advanced Features
- **Lead Scoring**: Rate leads automatically
- **Visual Pipeline**: Drag and drop deal stages
- **Integrations**: Connect with Salesforce, HubSpot
- **Notifications**: Push notifications for important updates
- **File Uploads**: Attach documents to leads and deals
- **Calendar**: Schedule meetings and reminders

## How to Contribute

1. Fork the repository
2. Create a new branch for your changes
3. Make your changes
4. Test everything works
5. Submit a pull request

## Need Help?

If you have questions or find bugs, please open an issue in the repository.
