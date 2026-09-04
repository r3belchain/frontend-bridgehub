# Bridge Hub Space - Frontend
This is the frontend application for the Coworking Space booking and management system. Built with modern web technologies, it offers a seamless, responsive, and secure user experience with role-based access control.

## Tech Stack

*   **Framework:** React + Vite 
*   **Styling:** Tailwind CSS + DaisyUI
*   **Routing:** React Router Dom
*   **API Client:** Axios 
*   **Deployment:** Vercel

## Key Features

*   **Role-Based Access Control:** Distinct dashboards and permissions for Admins, Vendors, and Customers.
*   **Secure Authentication:** Automated JWT handling, secure routing, and instant redirect on 401/expired tokens.
*   **Space Management:** Vendors can add, update, and manage their coworking spaces dynamically.
*   **Interactive Booking:** Customers can easily browse available spaces, filter by price/amenities, and book sessions.


### Installation

Clone the repository:
```
git clone [https://github.com/yourusername/frontend-coworkingspace.git](https://github.com/yourusername/frontend-coworkingspace.git)

```

Navigate to the project directory and install dependencies:
```
cd frontend-coworkingspace
npm install

```


Create a `.env` file in the root directory and add your API URL:
```
VITE_API_URL=http://localhost:3000/v1

```


Start the development server:
```
npm run dev

```
