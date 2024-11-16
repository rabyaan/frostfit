'use client';

import { useEffect, useState } from 'react';

export default function Products() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            const res = await fetch('/api/products');
            const data = await res.json();
            setProducts(data);
        };

        fetchProducts();
    }, []);

    return (
        <div>
            <h1>Products</h1>
            <ul>
                {products.map((product) => (
                    <li key={product.ProductID}>
                        <h2>{product.ProductName}</h2>
                        <p>{product.Description}</p>
                        <p>Price: {product.Price}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}
