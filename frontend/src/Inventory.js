import React, { useState, useEffect } from "react";
import "./Inventory.css";

const Inventory = () => {
  const [items, setItems] = useState([]);
  const initialValue = {
    name: "",
    quantity: 0,
    price: 0,
  };
  const [formData, setFormData] = useState(initialValue);

  const [editItem, setEditItem] = useState(null);

  const [errors, setErrors] = useState({}); // Added errors state

  const [successMessage, setSuccessMessage] = useState("");

  const validateValues = (data) => {
    let validationErrors = {};
    if (data.name === "") {
      validationErrors.name = "Please enter Item Name";
    }
    if (data.quantity <= 0) {
      validationErrors.quantity = "Quantity must be greater than 0";
    }
    if (data.price <= 0) {
      validationErrors.price = "Price must be greater than 0";
    }
    return validationErrors;
  };

  useEffect(() => {
    const fetchInventoryData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/items");
        if (response.ok) {
          const data = await response.json();
          setItems(data);
        } else {
          console.error(
            "Failed to fetch inventory data. Server returned:",
            response.status,
            response.statusText
          );
        }
      } catch (error) {
        console.error("Error fetching inventory data:", error);
      }
    };

    fetchInventoryData();
  }, []);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({}); // Clear errors when the user makes changes
  };

  const handleAddItem = async () => {
    const validationErrors = validateValues(formData);
    if (Object.keys(validationErrors).length === 0) {
      try {
        const response = await fetch("http://localhost:5000/api/items", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          const newItem = await response.json();
          setItems([...items, newItem]);
          setFormData(initialValue);
        } else {
          setErrors("An unknown error occurred !!");
        }
      } catch (error) {
        console.error("Error adding item:", error);
        setErrors("An unknown error occurred");
      }
    } else {
      setErrors(validationErrors); // Set validation errors in state
    }
  };

  const handleUpdateItem = async () => {
    const validationErrors = validateValues(formData);

    if (Object.keys(validationErrors).length === 0) {
      try {
        const itemId = items[editItem]._id;
        const url = `http://localhost:5000/api/items/${itemId}`;
        const method = "PUT";

        await fetch(url, {
          method,
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        const updatedItem = { ...items[editItem], ...formData };
        const updatedItems = [...items];
        updatedItems[editItem] = updatedItem;

        setItems(updatedItems);
        setFormData(initialValue);
        setEditItem(null);
        setSuccessMessage("Updated successfully");
        setTimeout(() => {
          setSuccessMessage("")
        }, 3000)
      } catch (error) {
        console.error("Error Updating item:", error);
      }
    } else {
      setErrors(validationErrors);
    }
  };

  const handleEditItem = (index) => {
    setFormData(items[index]);
    setEditItem(index);
  };

  const handleDeleteItem = async (itemId) => {
    try {
      const url = `http://localhost:5000/api/items/${itemId}`;
      const method = "DELETE";

      const response = await fetch(url, {
        method,
      });

      if (response.status === 200) {
        const updatedItems = items.filter((item) => item._id !== itemId);
        setItems(updatedItems);
        setSuccessMessage("Deleted Sucessfully");
        setTimeout(() => {
          setSuccessMessage("")
        }, 3000);
      } else {
        console.error("Failed to delete item");
      }
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  return (
    <div className="container">
      <h1>Inventory Management</h1>
      <div>
        <h2>Add New Item</h2>
        <label>
          Item Name:
          <input
            type="text"
            name="name"
            placeholder="Item Name"
            value={formData.name}
            onChange={handleFormChange}
          />
          {errors.name && <div className="errorMsg">{errors.name}</div>}
        </label>
        <label>
          Item Quantity:
          <input
            type="number"
            name="quantity"
            placeholder="Quantity"
            value={formData.quantity}
            onChange={handleFormChange}
          />
          {errors.quantity && <div className="errorMsg">{errors.quantity}</div>}
        </label>
        <label>
          Item Price:
          <input
            type="number"
            name="price"
            placeholder="Price"
            value={formData.price}
            onChange={handleFormChange}
          />
          {errors.price && <div className="errorMsg">{errors.price}</div>}
        </label>
        {editItem !== null ? (
          <button className="btn btn-primary" onClick={handleUpdateItem}>
            Update Item
          </button>
        ) : (
          <button className="btn btn-primary" onClick={handleAddItem}>
            Add Item
          </button>
        )}
      </div>
      <div>
        {successMessage && <div class="alert alert-success d-flex align-items-center" role="alert">
          <svg
            class="bi flex-shrink-0 me-2"
            width="24"
            height="24"
            role="img"
            aria-label="Success:"
          >
          </svg>
          <div>{successMessage}</div>
        </div>}
        <h2>Inventory</h2>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={item._id}>
                <td>{item.name}</td>
                <td>{item.quantity}</td>
                <td>${item.price}</td>
                <td>
                  <button
                    className="btn btn-dark"
                    onClick={() => handleEditItem(index)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDeleteItem(item._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default Inventory;
