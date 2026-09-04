# Bridge Hub Space - Frontend
This is the frontend application for the Coworking Space booking and management system. Built with modern web technologies, it offers a seamless, responsive, and secure user experience with role-based access control.

## Tech Stack

*   **Framework:** React + Vite (for lightning-fast HMR and building)
*   **Styling:** Tailwind CSS + DaisyUI
*   **Routing:** React Router Dom
*   **API Client:** Axios (with custom interceptors for JWT handling)
*   **Deployment:** Vercel

## Key Features

*   **Role-Based Access Control:** Distinct dashboards and permissions for Admins, Vendors, and Customers.
*   **Secure Authentication:** Automated JWT handling, secure routing, and instant redirect on 401/expired tokens.
*   **Space Management:** Vendors can add, update, and manage their coworking spaces dynamically.
*   **Interactive Booking:** Customers can easily browse available spaces, filter by price/amenities, and book sessions.


### Installation

1. Clone the repository:
   ```bash
   git clone [https://github.com/yourusername/frontend-coworkingspace.git](https://github.com/yourusername/frontend-coworkingspace.git)

```

2. Navigate to the project directory and install dependencies:
```bash
cd frontend-coworkingspace
npm install

```


3. Create a `.env` file in the root directory and add your API URL:
```env
VITE_API_URL=http://localhost:3000/v1

```


4. Start the development server:
```bash
npm run dev

```
