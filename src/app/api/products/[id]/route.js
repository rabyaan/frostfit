import { query } from '../../../../lib/db';

export async function GET(req) {
    const urlParts = req.url.split('/');
    const id = urlParts[urlParts.length - 1];
    
    if (!id) {
        return new Response(JSON.stringify({ message: 'Product ID is required' }), { status: 400 });
    }

    try {
        const products = await query('SELECT * FROM Products WHERE ProductID = ?', [id]);
        if (products.length === 0) {
            return new Response(JSON.stringify({ message: 'Product not found' }), { status: 404 });
        }
        return new Response(JSON.stringify(products[0]), { status: 200 });
    } catch (error) {
        console.error('Error fetching product:', error);
        return new Response(JSON.stringify({ message: 'Internal server error' }), { status: 500 });
    }
}

export async function PUT(req) {
  const urlParts = req.url.split('/');
  const id = urlParts[urlParts.length - 1];

  if (!id) {
      return new Response(JSON.stringify({ message: 'Product ID is required' }), { status: 400 });
  }

  const { productName, description, price, size, color, stockQuantity, categoryId } = await req.json();

  try {
      const result = await query(
          'UPDATE Products SET ProductName = ?, Description = ?, Price = ?, Size = ?, Color = ?, StockQuantity = ?, CategoryID = ? WHERE ProductID = ?',
          [productName, description, price, size, color, stockQuantity, categoryId, id]
      );

      if (result.affectedRows === 0) {
          return new Response(JSON.stringify({ message: 'Product not found' }), { status: 404 });
      }

      return new Response(JSON.stringify({ message: 'Product updated successfully' }), { status: 200 });
  } catch (error) {
      console.error('Error updating product:', error);
      return new Response(JSON.stringify({ message: 'Internal server error' }), { status: 500 });
  }
}


export async function DELETE(req) {
  const urlParts = req.url.split('/');
  const id = urlParts[urlParts.length - 1];

  if (!id) {
      return new Response(JSON.stringify({ message: 'Product ID is required' }), { status: 400 });
  }

  try {
      const result = await query('DELETE FROM Products WHERE ProductID = ?', [id]);

      if (result.affectedRows === 0) {
          return new Response(JSON.stringify({ message: 'Product not found' }), { status: 404 });
      }

      return new Response(JSON.stringify({ message: 'Product deleted successfully' }), { status: 200 });
  } catch (error) {
      console.error('Error deleting product:', error);
      return new Response(JSON.stringify({ message: 'Internal server error' }), { status: 500 });
  }
}