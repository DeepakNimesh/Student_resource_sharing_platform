# Student Resource Sharing Platform (SRSP) - Deep Dive Guide

Welcome to the detailed guide for the SRSP project! This document is designed for beginners to understand **what** this project is, **how** it works under the hood, and **why** the code is written the way it is.

## Table of Contents
1. [Project Overview](#1-project-overview)
2. [Tech Stack Explained](#2-tech-stack-explained)
3. [Project Structure](#3-project-structure)
4. [Backend Configuration (Appwrite)](#4-backend-configuration-appwrite)
5. [Global State Management (AuthContext)](#5-global-state-management-authcontext)
6. [Routing (App & ProtectedRoute)](#6-routing-app--protectedroute)
7. [Pages Deep Dive](#7-pages-deep-dive)
    - [Authentication (Auth.jsx)](#authentication-authjsx)
    - [Home Page (Home.jsx)](#home-page-homejsx)
    - [Upload Page (Upload.jsx)](#upload-page-uploadjsx)
8. [Components Deep Dive](#8-components-deep-dive)
    - [Resource Card (ResourceCard.jsx)](#resource-card-resourcecardjsx)
9. [Styling (Tailwind & CSS)](#9-styling-tailwind--css)

---

## 1. Project Overview

The Student Resource Sharing Platform is a web application where students can:
- **Sign up and Log in** securely.
- **Upload PDF files** (like notes, past papers) with details (Semester, Batch).
- **View and Download** resources uploaded by others.
- **Rate** resources on a 5-star scale.
- **Delete** their own uploaded resources.
- **Search and Filter** resources easily.

---

## 2. Tech Stack Explained

- **React.js (via Vite):** The core library used to build the User Interface. We use Vite instead of Create React App because it is much faster for development.
- **Appwrite:** This is our "Backend as a Service" (BaaS). Instead of writing our own server (Node.js/Python) and database (MongoDB/SQL), Appwrite gives us ready-to-use services for Authentication, Databases, and File Storage.
- **Tailwind CSS:** A utility-first CSS framework. Instead of writing custom CSS files, we use small, predefined classes (like `flex`, `text-white`, `bg-slate-900`) directly in our HTML/JSX to style elements quickly.
- **React Router Dom:** A library that allows us to have multiple pages (like `/`, `/auth`, `/upload`) in a "Single Page Application" without reloading the browser.
- **Lucide-React:** A library for beautiful, clean icons (like the search icon, trash bin, etc.).

---

## 3. Project Structure

Here is how our `src` folder is organized:

```text
src/
├── appwrite/
│   └── config.js         # Connects our React app to the Appwrite servers
├── components/           # Reusable UI parts used across different pages
│   ├── Navbar.jsx        # The top navigation bar
│   ├── ProtectedRoute.jsx# A guard that prevents unlogged users from seeing certain pages
│   └── ResourceCard.jsx  # The box that displays a single PDF's info
├── context/
│   └── AuthContext.jsx   # Manages the "logged in" state globally for the whole app
├── pages/                # The main views/screens of the app
│   ├── Auth.jsx          # The Login / Signup screen
│   ├── Home.jsx          # The main dashboard with all resources
│   └── Upload.jsx        # The form to upload a new PDF
├── App.jsx               # The root component that sets up our page routes
├── main.jsx              # The entry point that injects React into the HTML file
└── index.css             # Global CSS and Tailwind configurations
```

---

## 4. Backend Configuration (Appwrite)

**File:** `src/appwrite/config.js`

To talk to our backend, we need a client. Think of the `Client` as a phone. To make a call, we need to dial a specific number (Endpoint) and specify who we are calling (Project ID).

```javascript
import { Client, Account, Databases, Storage } from 'appwrite';

// 1. Initialize the client
const client = new Client();

// 2. Set up the connection details
client
    .setEndpoint('https://cloud.appwrite.io/v1') // The Appwrite server URL
    .setProject('YOUR_PROJECT_ID'); // Your specific project identifier

// 3. Export specific services so we can use them in other files
export const account = new Account(client); // For login/signup
export const databases = new Databases(client); // For saving text data (titles, descriptions)
export const storage = new Storage(client); // For saving physical files (PDFs)

// 4. Configuration constants to avoid typing these strings repeatedly
export const APPWRITE_CONFIG = {
    databaseId: 'MainDatabase',
    collectionId: 'resources',
    bucketId: 'pdfs'
};
```
*Beginner Tip:* Always keep your IDs in a central configuration file. If you ever need to change a database ID, you only change it here, not in 50 different files!

---

## 5. Global State Management (AuthContext)

**File:** `src/context/AuthContext.jsx`

**Why do we need this?**
Imagine you log in on the `/auth` page. Now you go to the `/upload` page. How does the `/upload` page know you are logged in? We could pass the user data from component to component (Prop Drilling), but that gets messy. 
Instead, we use React's **Context API**. It acts like a global cloud that holds our user data. Any component can plug into this cloud and ask, "Is the user logged in?"

```javascript
import { createContext, useContext, useEffect, useState } from 'react';
import { account } from '../appwrite/config';

// 1. Create the Context (The "Cloud")
const AuthContext = createContext();

// 2. Create a Provider component. This wraps around our whole app.
export const AuthProvider = ({ children }) => {
    // State to hold the user's details. null means not logged in.
    const [user, setUser] = useState(null); 
    // State to track if we are currently checking the login status
    const [loading, setLoading] = useState(true);

    // useEffect runs once when the app starts. It checks if there's a saved session.
    useEffect(() => {
        checkUserStatus();
    }, []);

    const checkUserStatus = async () => {
        try {
            // Ask Appwrite: "Do you remember me?"
            const currentUser = await account.get();
            setUser(currentUser); // If yes, save user to state
        } catch (error) {
            setUser(null); // If no, ensure user is null
        } finally {
            setLoading(false); // We are done checking
        }
    };

    // Login function
    const login = async (email, password) => {
        // ... calls account.createEmailPasswordSession()
    };

    // Logout function
    const logout = async () => {
        // ... calls account.deleteSession('current')
    };

    // 3. Provide the data and functions to the rest of the app
    return (
        <AuthContext.Provider value={{ user, loading, login, logout, signup }}>
            {!loading && children} 
        </AuthContext.Provider>
    );
};

// 4. A custom hook to easily access this context in other files
export const useAuth = () => useContext(AuthContext);
```
*Beginner Tip:* `useEffect` is a React Hook that lets you synchronize a component with an external system (like Appwrite). The empty array `[]` at the end means "only run this once when the app first loads."

---

## 6. Routing (App & ProtectedRoute)

**File:** `src/App.jsx` & `src/components/ProtectedRoute.jsx`

Routing determines which component shows up based on the URL in the browser's address bar.

```javascript
// src/App.jsx snippet
<Router>
  <AuthProvider> {/* The global state provider */}
    <Navbar />
    <Routes>
      <Route path="/" element={<Home />} /> {/* Anyone can see Home */}
      <Route path="/auth" element={<Auth />} /> {/* Anyone can see Login */}
      
      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/upload" element={<Upload />} /> {/* Only logged-in users */}
      </Route>
    </Routes>
  </AuthProvider>
</Router>
```

**How does ProtectedRoute work?**
```javascript
// src/components/ProtectedRoute.jsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = () => {
    // 1. Get the current user from our global context
    const { user, loading } = useAuth();

    if (loading) return <div>Loading...</div>;

    // 2. If user exists, render the child routes (<Outlet />). 
    //    If not, redirect them to the auth page (<Navigate />).
    return user ? <Outlet /> : <Navigate to="/auth" />;
};
```

---

## 7. Pages Deep Dive

### Home Page (Home.jsx)
This page is responsible for fetching all resources from the database and displaying them. It also handles searching.

**Key Concepts:**
1. **Fetching Data:** We use `useEffect` to call `databases.listDocuments()` when the page loads. We save the result in a state variable `const [resources, setResources] = useState([])`.
2. **Filtering:** We don't ask the database to search every time the user types a letter. Instead, we fetch *all* resources once, and use plain JavaScript to filter the array based on what's in the search box.
```javascript
const filteredResources = resources.filter(res => {
    // Does the title or semester include the typed search term?
    const matchesSearch = res.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          res.semester.toString().includes(searchTerm);
    return matchesSearch;
});
```

### Upload Page (Upload.jsx)
This is a two-step process. We can't put a 5MB PDF directly into a text database. 

**How it works:**
1. **Step 1: Save the File.** We use `storage.createFile()` to upload the physical PDF to an Appwrite Storage Bucket. Appwrite gives us back a unique ID for that file (e.g., `file123`).
2. **Step 2: Save the Text Data.** We use `databases.createDocument()` to create a database entry containing the Title, Description, Semester, and the `pdfId` we just got. We also save the `uploaderId` so we know who owns it.

```javascript
// 1. Upload file to Storage
const fileResponse = await storage.createFile(
    APPWRITE_CONFIG.bucketId,
    ID.unique(), // Generate a random ID for the file
    file         // The actual PDF file from the input
);

// 2. Create document in Database linking to the file
await databases.createDocument(
    APPWRITE_CONFIG.databaseId,
    APPWRITE_CONFIG.collectionId,
    ID.unique(),
    {
        title: title, // From React state
        description: description,
        semester: semester, // Stored as a string based on Appwrite config
        batch: batch,
        pdfId: fileResponse.$id, // The ID of the file we just uploaded!
        uploaderId: user.$id,    // The ID of the currently logged-in user
        uploaderName: user.name,
        avgRating: 0,
        totalRatings: 0
    }
);
```

---

## 8. Components Deep Dive

### Resource Card (ResourceCard.jsx)
This component takes a single `resource` object and displays its data.

**Deleting Files:**
We only want the person who uploaded the file to be able to delete it.
```javascript
// We get the current logged-in user
const { user } = useAuth();

// We check if their ID matches the ID of the person who uploaded this specific resource
const isOwner = user && user.$id === resource.uploaderId;

// Later in the HTML (JSX), we conditionally render the delete button
{isOwner && (
    <button onClick={handleDelete}>Delete</button>
)}
```

**The Rating Formula:**
When someone clicks a star, we don't just store "5". We have to calculate a new average.
*Formula:* `((Current Average * Total Number of Ratings) + New Rating) / (Total Number of Ratings + 1)`

```javascript
const currentAvg = resource.avgRating || 0;
const totalRatings = resource.totalRatings || 0;
// Calculate new math
const updatedAvg = ((currentAvg * totalRatings) + newRating) / (totalRatings + 1);

// Tell Appwrite to update this specific document with the new numbers
await databases.updateDocument(
    APPWRITE_CONFIG.databaseId,
    APPWRITE_CONFIG.collectionId,
    resource.$id, // Which document to update
    {
        avgRating: parseFloat(updatedAvg.toFixed(2)), // e.g., 4.56
        totalRatings: totalRatings + 1 // Increment total raters by 1
    }
);
```

---

## 9. Styling (Tailwind & CSS)

We used a **Dark Theme** for a modern aesthetic.

**Tailwind Classes Explained:**
- `bg-slate-900`: A very dark grayish-blue background color.
- `text-slate-100`: Off-white text color for good contrast against dark backgrounds.
- `flex items-center justify-between`: Uses CSS Flexbox to put items on the same line and space them far apart.
- `hover:bg-primary-500`: Changes the background color when the user hovers their mouse over the element.
- `transition-all`: Makes hover effects smooth (fading in) instead of instant.

In `src/index.css`, we created custom shortcut classes using Tailwind's `@apply` directive to keep our JSX clean:
```css
.btn-primary {
  @apply px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-500 active:scale-95 transition-all font-semibold shadow-lg shadow-primary-900/30;
}
```
Instead of writing those 10 classes every time we need a button, we just write `className="btn-primary"`.

---

## Conclusion
By breaking the app down into separate components (Cards, Navbars) and separate concerns (Auth Context, Database Logic, UI), we create an application that is easy to read, debug, and scale. 

Happy coding!
