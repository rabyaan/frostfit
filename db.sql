-- Create Database
CREATE DATABASE ff_db;
USE ff_db;

-- Customers Table
CREATE TABLE Customers (
    CustomerID INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(255) NOT NULL,
    Email VARCHAR(255) UNIQUE NOT NULL,
    Phone VARCHAR(15),
    ShippingAddress TEXT,
    PasswordHash VARCHAR(255) NOT NULL
);

-- Insert sample customers
INSERT INTO Customers (Name, Email, Phone, ShippingAddress, PasswordHash)
VALUES
('John Doe', 'john@example.com', '1234567890', '123 Elm St, Springfield', SHA2('password123', 256)),
('Jane Smith', 'jane@example.com', '9876543210', '456 Oak St, Springfield', SHA2('password456', 256));

-- Admins Table
CREATE TABLE Admins (
    AdminID INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(255) NOT NULL,
    Email VARCHAR(255) UNIQUE NOT NULL,
    PasswordHash VARCHAR(255) NOT NULL
);

-- Insert sample admin
INSERT INTO Admins (Name, Email, PasswordHash)
VALUES
('Admin User', 'admin@example.com', SHA2('adminpassword', 256));

-- Categories Table
CREATE TABLE Categories (
    CategoryID INT AUTO_INCREMENT PRIMARY KEY,
    CategoryName VARCHAR(255) NOT NULL UNIQUE
);

-- Insert sample categories
INSERT INTO Categories (CategoryName)
VALUES
('Coats'), ('Jackets'), ('Sweaters'), ('Accessories');

-- Products Table
CREATE TABLE Products (
    ProductID INT AUTO_INCREMENT PRIMARY KEY,
    ProductName VARCHAR(255) NOT NULL,
    Description TEXT,
    Price DECIMAL(10, 2) NOT NULL,
    Size VARCHAR(10),
    Color VARCHAR(50),
    StockQuantity INT NOT NULL,
    CategoryID INT,
    FOREIGN KEY (CategoryID) REFERENCES Categories(CategoryID)
);

-- Insert sample products
INSERT INTO Products (ProductName, Description, Price, Size, Color, StockQuantity, CategoryID)
VALUES
('Winter Coat', 'A warm winter coat', 120.00, 'M', 'Black', 10, 1),
('Parka Jacket', 'Insulated parka for extreme cold', 200.00, 'L', 'Green', 5, 2),
('Wool Sweater', 'Soft wool sweater', 80.00, 'S', 'Blue', 20, 3),
('Knitted Scarf', 'Hand-knitted woolen scarf', 25.00, 'One Size', 'Red', 50, 4);

-- Orders Table
CREATE TABLE Orders (
    OrderID INT AUTO_INCREMENT PRIMARY KEY,
    CustomerID INT,
    OrderDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    TotalAmount DECIMAL(10, 2),
    OrderStatus VARCHAR(50),
    FOREIGN KEY (CustomerID) REFERENCES Customers(CustomerID)
);

-- Insert sample orders
INSERT INTO Orders (CustomerID, TotalAmount, OrderStatus)
VALUES
(1, 300.00, 'Pending'),
(2, 105.00, 'Completed');

-- OrderItems Table
CREATE TABLE OrderItems (
    OrderItemID INT AUTO_INCREMENT PRIMARY KEY,
    OrderID INT,
    ProductID INT,
    Quantity INT,
    Price DECIMAL(10, 2),
    FOREIGN KEY (OrderID) REFERENCES Orders(OrderID),
    FOREIGN KEY (ProductID) REFERENCES Products(ProductID)
);

-- Insert sample order items
INSERT INTO OrderItems (OrderID, ProductID, Quantity, Price)
VALUES
(1, 1, 2, 240.00),
(1, 4, 2, 50.00),
(2, 3, 1, 80.00),
(2, 4, 1, 25.00);

-- Payments Table
CREATE TABLE Payments (
    PaymentID INT AUTO_INCREMENT PRIMARY KEY,
    OrderID INT,
    PaymentDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    PaymentAmount DECIMAL(10, 2),
    PaymentMethod VARCHAR(50),
    PaymentStatus VARCHAR(50),
    FOREIGN KEY (OrderID) REFERENCES Orders(OrderID)
);

-- Insert sample payments
INSERT INTO Payments (OrderID, PaymentAmount, PaymentMethod, PaymentStatus)
VALUES
(1, 300.00, 'Credit Card', 'Pending'),
(2, 105.00, 'PayPal', 'Completed');
