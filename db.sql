-- Database: Winter Clothing E-commerce Database System

-- Drop existing tables to avoid conflicts
DROP TABLE IF EXISTS AdminLog, Payments, OrderItems, Orders, Products, Categories, Customers, Admin;

-- Create Admin Table
-- Create Admin Table first
CREATE TABLE Admin (
    AdminID INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Email VARCHAR(100) NOT NULL UNIQUE,
    PasswordHash VARCHAR(255) NOT NULL
);

-- Insert an admin record into the Admin table
INSERT INTO Admin (Name, Email, PasswordHash)
VALUES ('Admin User', 'admin@domain.com', 'hashed_password_value');

-- Create Categories Table
CREATE TABLE Categories (
    CategoryID INT AUTO_INCREMENT PRIMARY KEY,
    CategoryName VARCHAR(50) NOT NULL UNIQUE
);

-- Insert categories into Categories table (ensure Categories exist before referencing them in Products)
INSERT INTO Categories (CategoryName)
VALUES ('Jackets'), ('Sweaters'), ('Gloves'), ('Boots');

-- Create Products Table
CREATE TABLE Products (
    ProductID INT AUTO_INCREMENT PRIMARY KEY,
    ProductName VARCHAR(100) NOT NULL,
    Description TEXT,
    Price DECIMAL(10, 2) NOT NULL,
    Size VARCHAR(10),
    Color VARCHAR(30),
    StockQuantity INT NOT NULL,
    CategoryID INT,
    ManagedBy INT,
    FOREIGN KEY (CategoryID) REFERENCES Categories(CategoryID),
    FOREIGN KEY (ManagedBy) REFERENCES Admin(AdminID)
);

-- Insert Products (now CategoryID exists)
INSERT INTO Products (ProductName, Description, Price, Size, Color, StockQuantity, CategoryID, ManagedBy)
VALUES
    ('Thermal Gloves', 'Warm gloves for winter', 25.00, 'M', 'Black', 100, (SELECT CategoryID FROM Categories WHERE CategoryName = 'Gloves'), 1),
    ('Winter Jacket', 'Heavy-duty winter jacket', 80.00, 'L', 'Blue', 50, (SELECT CategoryID FROM Categories WHERE CategoryName = 'Jackets'), 1);

-- Create Customers Table
CREATE TABLE Customers (
    CustomerID INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Email VARCHAR(100) NOT NULL UNIQUE,
    Phone VARCHAR(15),
    ShippingAddress TEXT,
    PasswordHash VARCHAR(255)
);

-- Create Orders Table
CREATE TABLE Orders (
    OrderID INT AUTO_INCREMENT PRIMARY KEY,
    CustomerID INT,
    OrderDate DATE NOT NULL,
    TotalAmount DECIMAL(10, 2) NOT NULL,
    OrderStatus VARCHAR(20) NOT NULL,
    FOREIGN KEY (CustomerID) REFERENCES Customers(CustomerID)
);

-- Create OrderItems Table
CREATE TABLE OrderItems (
    OrderItemID INT AUTO_INCREMENT PRIMARY KEY,
    OrderID INT,
    ProductID INT,
    Quantity INT NOT NULL,
    Price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (OrderID) REFERENCES Orders(OrderID),
    FOREIGN KEY (ProductID) REFERENCES Products(ProductID)
);

-- Create Payments Table
CREATE TABLE Payments (
    PaymentID INT AUTO_INCREMENT PRIMARY KEY,
    OrderID INT,
    PaymentDate DATE NOT NULL,
    PaymentAmount DECIMAL(10, 2) NOT NULL,
    PaymentMethod VARCHAR(50),
    PaymentStatus VARCHAR(20) NOT NULL,
    FOREIGN KEY (OrderID) REFERENCES Orders(OrderID)
);


CREATE TABLE `Cart` (
    `CartID` INT AUTO_INCREMENT PRIMARY KEY,
    `CustomerID` INT NOT NULL,
    `ProductID` INT NOT NULL,
    `Quantity` INT NOT NULL,
    `DateAdded` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`CustomerID`) REFERENCES Customers(`CustomerID`),
    FOREIGN KEY (`ProductID`) REFERENCES Products(`ProductID`)
);


-- Create AdminLog Table for auditing
CREATE TABLE AdminLog (
    LogID INT AUTO_INCREMENT PRIMARY KEY,
    AdminID INT,
    Action VARCHAR(255),
    ActionDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (AdminID) REFERENCES Admin(AdminID)
);


-- --------------------------------------------------
-- STORED PROCEDURES
-- --------------------------------------------------

-- Drop existing procedures if they exist
DROP PROCEDURE IF EXISTS UpdateStock;
DROP PROCEDURE IF EXISTS MonthlyRevenueReport;

-- Procedure to Update Product Stock after an Order is Placed
DELIMITER //
CREATE PROCEDURE UpdateStock(IN prodID INT, IN qty INT)
BEGIN
    UPDATE Products
    SET StockQuantity = StockQuantity - qty
    WHERE ProductID = prodID;
END;
//
DELIMITER ;

-- Procedure to Generate Monthly Revenue Report
DELIMITER //
CREATE PROCEDURE MonthlyRevenueReport(IN year INT, IN month INT)
BEGIN
    SELECT SUM(PaymentAmount) AS TotalRevenue
    FROM Payments
    WHERE YEAR(PaymentDate) = year AND MONTH(PaymentDate) = month;
END;
//
DELIMITER ;

-- --------------------------------------------------
-- TRIGGERS
-- --------------------------------------------------

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS PreventNegativeStock;
DROP TRIGGER IF EXISTS LogAdminActions;

-- Trigger to Prevent Negative Stock Levels
DELIMITER //
CREATE TRIGGER PreventNegativeStock
BEFORE UPDATE ON Products
FOR EACH ROW
BEGIN
    IF NEW.StockQuantity < 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Stock cannot be negative.';
    END IF;
END;
//
DELIMITER ;

-- Trigger to Log Admin Actions for Adding or Deleting Products
-- Trigger to Log Admin Actions for Adding a Product (AFTER INSERT)
DELIMITER //
CREATE TRIGGER LogAdminActionsAfterInsert
AFTER INSERT ON Products
FOR EACH ROW
BEGIN
    INSERT INTO AdminLog (AdminID, Action)
    VALUES (1, CONCAT('Product ', NEW.ProductName, ' was added.'));
END;
//
DELIMITER ;

-- Trigger to Log Admin Actions for Deleting a Product (AFTER DELETE)
DELIMITER //
CREATE TRIGGER LogAdminActionsAfterDelete
AFTER DELETE ON Products
FOR EACH ROW
BEGIN
    INSERT INTO AdminLog (AdminID, Action)
    VALUES (1, CONCAT('Product ', OLD.ProductName, ' was deleted.'));
END;
//
DELIMITER ;


-- --------------------------------------------------
-- VIEWS
-- --------------------------------------------------

-- Drop existing views if they exist
DROP VIEW IF EXISTS CustomerOrderSummary;
DROP VIEW IF EXISTS RevenueByCategory;

-- View for Customer Order Summary
CREATE VIEW CustomerOrderSummary AS
SELECT 
    Customers.Name AS CustomerName,
    Orders.OrderID,
    Orders.OrderDate,
    Orders.TotalAmount,
    Payments.PaymentStatus
FROM Customers
JOIN Orders ON Customers.CustomerID = Orders.CustomerID
JOIN Payments ON Orders.OrderID = Payments.OrderID;

-- View for Revenue by Category
CREATE VIEW RevenueByCategory AS
SELECT 
    Categories.CategoryName,
    SUM(OrderItems.Quantity * OrderItems.Price) AS Revenue
FROM Categories
JOIN Products ON Categories.CategoryID = Products.CategoryID
JOIN OrderItems ON Products.ProductID = OrderItems.ProductID
GROUP BY Categories.CategoryName;

-- --------------------------------------------------
-- INDEXES
-- --------------------------------------------------

-- Optimize Query Performance
CREATE INDEX idx_category_id ON Products(CategoryID);
CREATE INDEX idx_order_date ON Orders(OrderDate);

-- --------------------------------------------------
-- COMMON QUERIES FOR FRONTEND INTEGRATION
-- --------------------------------------------------

-- 1. Add a New Product
INSERT INTO Products (ProductName, Description, Price, Size, Color, StockQuantity, CategoryID, ManagedBy)
VALUES ('Thermal Gloves', 'Warm gloves for winter', 25.00, 'M', 'Black', 100, 4, 1);

-- 2. Update Customer Email
UPDATE Customers 
SET Email = 'newemail@example.com' 
WHERE CustomerID = 1;

-- 3. Delete an Order
DELETE FROM Orders 
WHERE OrderID = 2;

-- 4. Get All Items in an Order, Including Product Names
SELECT 
    Orders.OrderID, 
    Products.ProductName, 
    OrderItems.Quantity, 
    OrderItems.Price
FROM Orders
JOIN OrderItems ON Orders.OrderID = OrderItems.OrderID
JOIN Products ON OrderItems.ProductID = Products.ProductID
WHERE Orders.CustomerID = 1;

-- 5. Get a List of All Products in the "Jackets" Category
SELECT 
    ProductName, 
    Price, 
    Size, 
    Color
FROM Products
WHERE CategoryID = (SELECT CategoryID FROM Categories WHERE CategoryName = 'Jackets');

-- 6. Calculate Total Sales for Each Product
SELECT 
    ProductID, 
    SUM(Quantity * Price) AS TotalSales
FROM OrderItems
GROUP BY ProductID;

-- 7. Track Low Stock Levels
SELECT 
    ProductName, 
    StockQuantity 
FROM Products
WHERE StockQuantity < 10;

-- 8. Generate Customer Order History
SELECT 
    Customers.Name, 
    Orders.OrderID, 
    Orders.OrderDate, 
    Orders.TotalAmount
FROM Customers
JOIN Orders ON Customers.CustomerID = Orders.CustomerID
WHERE Customers.CustomerID = 1;

-- 9. Generate Revenue Report by Month
SELECT 
    MONTH(PaymentDate) AS Month, 
    SUM(PaymentAmount) AS TotalRevenue
FROM Payments
GROUP BY MONTH(PaymentDate)
ORDER BY Month;

-- 10. View Customer Order Summary
SELECT * FROM CustomerOrderSummary;

-- 11. View Revenue by Category
SELECT * FROM RevenueByCategory;
