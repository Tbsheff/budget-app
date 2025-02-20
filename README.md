# Walit: An AI-Powered Budgeting and Expense Tracking Application Made for Students

## Table of Contents

- [Project Overview](#project-overview)
- [Architecture & Technology Stack](#architecture--technology-stack)
  - [Front-End](#front-end)
  - [Back-End](#back-end)
  - [Database](#database)
- [Security Measures](#security-measures)
- [Automatic Translation System](#automatic-translation-system)
- [AI Chatbot Integration](#ai-chatbot-integration)
  - [Chatbot Capabilities](#chatbot-capabilities)
  - [Chatbot Components](#chatbot-components)
- [Survey-Based Budget Initialization](#survey-based-budget-initialization)
  - [How It Works](#how-it-works)
  - [Survey Components](#survey-components)
- [Front-End Architecture](#front-end-architecture)
  - [UI Components](#ui-components)
  - [Budget Components](#budget-components)
  - [Navigation & Routing](#navigation--routing)
- [Authentication Middleware](#authentication-middleware)

---

## Project Overview
Walit is an an AI-Powered Budgeting App specifically designed to help students create and track their budgets no matter where they are at in their savings journey. This application is a comprehensive budgeting and expense-tracking system designed to provide users with AI-powered insights into their financial habits. It allows users to track income, expenses, savings goals, and budgeting analytics while maintaining high security and compliance with privacy regulations. The ease of use and AI integrations make this app perfect for students that are constantly on the go but want to make progress toward their financial goals.

---

## Architecture & Technology Stack

### Front-End

- **Framework:** React with TypeScript
- **State Management:** React Query for API state management
- **Routing:** React Router for navigation
- **UI Components:** Custom UI components with accessibility features
- **User Language Detection:** The app identifies the browser's language and translates the interface accordingly and automatically.
- **Accessible Design:** In profile settings, users can change the view mode to account for color blindness. Accessible for screen readers.

### Back-End

- **Server:** Node.js with Express
- **Authentication:** JWT-based authentication with Supabase authentication integration
- **Data Processing:** AI-driven receipt scanning with Azure AI Document Intelligence
- **Middleware:** Morgan for logging, CORS for security, Express JSON for request parsing
- **Chatbot Integration:** AI-powered chatbot using OpenAI API and NLP integration
- **Deployment:** App is fully deployed and scalable

### Database

- **Database Type:** MySQL (via Sequelize ORM)
- **Configuration:** Defined in `db.js` with connection pooling
- **Entities:** Users, Transactions, Budget Categories, Income, Expenses, Savings Goals
- **Encryption:** Data is encrypted through Supabase to protect sensitive information

---

## Security Measures

- **Authentication:** OAuth and JWT-based authentication
- **Data Protection:** Secure data transmission (HTTPS), encrypted database fields, and secure API keys
- **Integrity:** Database is SQL injection and app is XSS proof
- **Access Control:** Middleware for route protection, role-based access control (RBAC)
- **Privacy Compliance:** Privacy regulation compliant with data storage and management
- **Passwords:** BCrypt is used to hash and store passwords. Passwords are required to be complex (at least 12 characters with a capital letter, a number, and two special characters)


## Responsiveness

- **Real-Time AI-Powered Responses:** The chatbot and AI-driven financial assistant provide instant insights using streaming responses, minimizing latency.
- **Scalability:** Docker Compose to manage and deploy both the Node.js backend and React TypeScript frontend. It simplifies deployment, ensures consistency, and enables easy scaling
- **Impact on User Needs:** AI-driven budget recommendations help students make informed financial decisions with minimal effort. Helping students to learn finances in an easy, applied manner
- **User Experience:**  The UI dynamically adjusts to user preferences, offering personalized insights and an intuitive navigation experience
- **Technical Excellence:** AI optimizations, database indexing, and caching reduce processing time, ensuring smooth and efficient interactions
- **Creativity and Innovation:** Features like AI-powered receipt scanning and expense categorization enhance budgeting efficiency with minimal manual input. Multilingual ability expands the solution to different demographics
- **Security and Privacy:** All AI-generated insights and financial data are encrypted, ensuring compliance with industry privacy standards.


## Google Lighthouse 

Using Google's Lighthouse tool we were able to measure scores for our website's, accessibility, SEO, and practices. 
- ![image](https://github.com/user-attachments/assets/4ae1cb7e-8050-4a0e-8aa9-51db2e0d9deb)
- ![image](https://github.com/user-attachments/assets/fecad24e-6f46-4e04-be9b-c47b11d4f663)
- ![image](https://github.com/user-attachments/assets/976d4bfa-51ca-435f-b7d9-25d5cfd7b586)





---

## AI Chatbot Integration

### Chatbot Capabilities

- **Budget Assistance:** Adjusting budgets, suggesting savings plans, and analyzing spending habits.
- **Database Modifications:** The chatbot can edit financial data, such as updating transactions, adjusting budgets, and creating new savings goals.
- **UI Customization:** It can modify UI elements dynamically based on user requests.
- **Quick Action Recommendations:** Users can select predefined actions such as "Adjust My Budget," "Create a Savings Plan," or "Analyze My Spending Patterns."

### Chatbot Components

- `Chat.tsx` - Manages chatbot logic, message streaming, and AI interactions.
- `ChatButton.tsx` - Floating chat button to open the chatbot window.
- `ChatMessage.tsx` - Formats chat messages and supports Markdown rendering.
- `ChatPopup.tsx` - Displays the chatbot interface, with options for fullscreen and minimized modes.
- `QuickstartOptions.tsx` - Provides users with predefined chatbot actions for easy navigation.

---

## Survey-Based Budget Initialization

### How It Works

1. Users answer financial questions, such as:
   - Income details
   - Monthly expenses (rent, utilities, groceries, loans, etc.)
   - Financial priorities (debt repayment, savings, investments, etc.)
2. The AI processes responses and generates a personalized budget template.
3. The system pre-fills budget categories based on the user's situation.
4. Users can review and adjust their initial budget before proceeding.

### Survey Components

- `SurveyForm.tsx` - Main form handler, navigates between different pages.
- `SurveyPages.tsx` - Collects financial data such as income, expenses, and savings goals.
- `ProgressBar.tsx` - Displays user progress through the survey.
- `NavigationButtons.tsx` - Handles navigation between survey pages.
- `InputField.tsx` & `MultiSelect.tsx` - UI components for entering financial data.

---

## Front-End Architecture

### UI Components

#### Budget Components

- `BudgetProgress.tsx` – Displays a visual progress bar for budget tracking.
- `CategoryRow.tsx` – Handles category-specific spending, icons, and interactions.
- `CategorySection.tsx` – Organizes categories within budget groups and enables adding/deleting categories.
- `IconPicker.tsx` – Allows users to select and update icons for budget categories.
- `RenderAmount.tsx` – Manages budget input fields and API updates.
- `BudgetCategories.tsx` – Fetches budget data from the backend and structures it into groups.
- `BudgetSummary.tsx` – Provides an overview of total budget, spent amount, and remaining balance.

### Navigation & Routing

- `ProtectedRoute.tsx` – Restricts access to authenticated users.
- `Sidebar.tsx` – Global sidebar for navigating between different sections (Dashboard, Budget, Transactions, etc.).

---

## Authentication Middleware

```javascript
const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (req, res, next) => {
    const token = req.header('Authorization') && req.header('Authorization').split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Token is not valid' });
    }
};
```
