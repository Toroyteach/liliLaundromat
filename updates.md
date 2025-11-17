# Frontend Developer Guidelines (Laundry Management System)

This document provides **clear instructions for the frontend developer** based on the required pages, UI behaviors, pagination, filtering, and settings structures. It is meant to guide implementation for the Inertia/React (or any frontend) layer.

---

# 1. Dashboard Pages

Each Dashboard section must include pagination and use efficient API endpoints.

## **1.1 Overview**

### **Notifications**

* Display the most recent notifications.
* **Pagination:** 10 items per page.
* Show basic notification info: message, type, created_at.

---

## **1.2 Analytics**

### **Top Customers**

* Display customers based on frequency or total orders.
* **Pagination:** 10 items per page.
* Show: name, phone, email, total orders, total revenue if provided.

---

## **1.3 Operations**

### **Recent Orders**

* Show latest orders (ID, customer name, total items, status).
* **Pagination:** 10 per page.

### **Outstanding Invoices**

* Show invoices not yet fully paid.
* Columns: Invoice ID, Customer, Amount Due, Due Date.
* **Pagination:** 10 per page.

### **Recent Payments**

* Show payment transactions.
* Columns: amount, method, reference, processed_by, paid_at.
* **Pagination:** 10 per page.

### **Lost Item Logs**

* Shows logs for items reported lost.
* Columns: item info, order number, customer, date, handler.
* **Pagination:** 10 per page.

---

# 2. Track Laundry Page

This page allows tracking of **order items**.

* Each **order item** is shown with: garment name, color, status/stage, assigned handler, timestamps.
* **Pagination:** 10–20 items per page depending on UI spacing.
* Include a search bar to search by order number or customer.

---

# 3. Orders Page

Show a list of customer orders.

* Columns include: Order No., Customer, Total Items, Status, Total Price, Created At.
* **Pagination:** 10–20 per page.
* Filters required:

  * Customer
  * Status (Pending, Processing, Done, Cancelled)
  * Date range

Clicking an order should open full order detail.

---

# 4. Payments Page

Shows recent transactions.

* Columns: customer, amount, method, reference, status, paid_at.
* **Pagination:** 10 per page.
* Filters: method (M-Pesa, cash, card), date range.

---

# 5. Customers Page

* Display: name, phone, email, address, total orders, loyalty points.
* **Pagination:** 10–20 per page.

### **Search Feature**

* Add a search bar that searches by:

  * name
  * phone
  * email

Ensure search applies instantly (debounced input recommended).

---

# 6. Settings Section

Settings contains two major subsections:

* **Roles & Permissions**
* **Garments & Pricing**

Both must be displayed as **sub-pages** under `/settings`.

---

# 6.1 Roles & Permissions

We are using **Laravel's basic roles/permissions**. Roles cannot be added/removed through the UI.

### **Pages Needed**

## **6.1.1 Roles List Page**

Path: `/settings/roles`

Show all roles in the system.

* Columns: role name, description (optional), total permissions.
* Action: *View Permissions* button.

---

## **6.1.2 Role Permissions Page**

Path: `/settings/roles/{role}/permissions`

Shows all permissions assigned to a specific role.

### **Features:**

* Left column: **All system permissions**.
* Right column: **Permissions assigned to this role**.
* Ability to **add/remove permissions** from the role.

### **Important:**

* **Roles cannot be created or deleted here.**
* **Permissions cannot be created or deleted.**

Only assignment logic is allowed.

---

## **6.1.3 User Roles Page**

Path: `/settings/users/{user}/roles`

Shows all roles assigned to a specific user.

### **Features:**

* Display list of user roles.
* Option to attach/detach roles.
* Do **NOT** allow creating new roles.

---

# 6.2 Garments & Pricing Management

This section manages **garment types** and their pricing.

Path: `/settings/garments`

### **Features:**

* List all garment types.

  * Columns: `name`, `default_pricing_mode`, `default_price`.
* CRUD actions:

  * Add new garment type
  * Update garment type
  * Delete garment type

### **Pricing Logic:**

Based on the model structure, a garment type has:

* name (e.g., Shirt, Trousers)
* default pricing mode (per-item, per-kg, per-set)
* default price

The UI must allow selecting pricing mode from a dropdown.

---

# 7. Data Understanding Summary (Frontend Reference)

The following clarifies relationships **without copying backend code**.

### **Customer → Orders → Payments**

* A customer has many orders.
* A customer has many payments.
* Orders link to payments.

### **Order Item → GarmetHandling Log**

* Each order item may have several handling logs.
* Each log has:

  * description
  * handler
  * stage
  * scanned time

The UI for tracking must show these logs in order.

### **Garment Type**

Used in pricing and order item cost calculations.

---

# 8. General UI Requirements

* All paginated lists must have **page number navigation**.
* Use a **loading state** for all API operations.
* Use **empty-state placeholders** for empty lists.
* Use **modals** for create/update/delete actions where appropriate.
* Errors and success messages must be displayed clearly.

---

# END OF DOCUMENT
