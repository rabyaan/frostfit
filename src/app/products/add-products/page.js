"use client";

// src/app/products/add-product/page.js
import { useState } from 'react';

export default function AddProductPage() {
  // Define state variables for the form fields
  const [name, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [size, setSize] = useState('');
  const [color, setColor] = useState('');
  const [stock, setStockQuantity] = useState('');
  const [categoryId, setCategoryID] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);  // To store any error messages

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);  // Reset any previous errors

    // Validate that all fields are filled
    if (!name || !description || !price || !size || !color || !stock || !categoryId) {
      setError('All fields are required.');
      setLoading(false);
      return;
    }

    // Ensure price, stock, and categoryId are valid numbers
    if (isNaN(price) || isNaN(stock) || isNaN(categoryId)) {
      setError('Price, Stock Quantity, and Category ID must be valid numbers.');
      setLoading(false);
      return;
    }

    // Prepare the new product object
    const newProduct = {
      name: name,
      description: description,
      price: parseFloat(price),
      size: size,
      color: color,
      stock: parseInt(stock, 10),
      categoryId: parseInt(categoryId, 10)
    };
    

    // Log the request data for debugging
    console.log("Sending data to backend:", JSON.stringify(newProduct));

    try {
      // Make a POST request to the API to add the product
      const response = await fetch('/api/products/add-product', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProduct),
      });

      const data = await response.json();

      // Log the response data for debugging
      console.log("Backend response:", data);

      if (response.ok) {
        alert('Product added successfully!');
        // Reset the form fields after successful submission
        setProductName('');
        setDescription('');
        setPrice('');
        setSize('');
        setColor('');
        setStockQuantity('');
        setCategoryID('');
      } else {
        setError(`Failed to add product: ${data.message}`);
      }
    } catch (error) {
      console.error('Error adding product:', error);
      setError('An error occurred while adding the product.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Add a New Product</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}  {/* Display error message */}

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Product Name</label>
          <input
            id="name"
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setProductName(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="description">Description</label>
          <input
            id="description"
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="price">Price</label>
          <input
            id="price"
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="size">Size</label>
          <input
            id="size"
            type="text"
            placeholder="Size"
            value={size}
            onChange={(e) => setSize(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="color">Color</label>
          <input
            id="color"
            type="text"
            placeholder="Color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="stock">Stock Quantity</label>
          <input
            id="stock"
            type="number"
            placeholder="Stock Quantity"
            value={stock}
            onChange={(e) => setStockQuantity(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="categoryId">Category ID</label>
          <input
            id="categoryId"
            type="number"
            placeholder="Category ID"
            value={categoryId}
            onChange={(e) => setCategoryID(e.target.value)}
            required
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Adding...' : 'Add Product'}
        </button>
      </form>
    </div>
  );
}
