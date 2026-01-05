function CartItem({ item, onRemove }) {
  return (
    <div style={{
      border: "1px solid #ddd",
      padding: "12px",
      borderRadius: "6px",
      marginBottom: "10px"
    }}>
      <h4>{item.product.name}</h4>
      <p>Price: ₹{item.product.price}</p>
      <p>Quantity: {item.quantity}</p>

      <button
        style={{ background: "red", color: "white" }}
        onClick={() => onRemove(item.id)}
      >
        Remove
      </button>
    </div>
  );
}

export default CartItem;
