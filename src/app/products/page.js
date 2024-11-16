'use client'; // Add this line

import { useState, useEffect } from 'react';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products/get-products');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (products.length === 0) return <p>No products found.</p>;

  return (
    <div>
      <h1>Products</h1>
      {products.map((product) => (
        <div key={product.ProductID}>
          <h2>{product.ProductName}</h2>
          <p>{product.Description}</p>
            <p>Price: ${product.Price}</p>
            <p>Category: {product.Color}</p>
        </div>
      ))}
    </div>
  );
}
