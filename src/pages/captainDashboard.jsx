import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Utensils, Layers, Search, ArrowLeft } from "lucide-react";

export default function CaptainDashboard() {
  const [items] = useState([
    { id: 1, product_name: 'Leg Soup (Single)', price: 110.00, category_name: 'Soups' },
    { id: 2, product_name: 'Plain Soup', price: 30.00, category_name: 'Soups' },
    { id: 3, product_name: 'Mutton Biriyani', price: 240.00, category_name: 'Biriyani Items' },
    { id: 4, product_name: 'Chicken Biriyani', price: 160.00, category_name: 'Biriyani Items' },
    { id: 5, product_name: 'Egg Biriyani', price: 120.00, category_name: 'Biriyani Items' },
    { id: 6, product_name: 'Kushka (Full) & Half', price: 90.00, category_name: 'Biriyani Items' },
    { id: 7, product_name: 'Naati Koli Biriyani', price: 200.00, category_name: 'Naati Koli Special' },
    { id: 8, product_name: 'Egg Dosa', price: 50.00, category_name: 'Breakfast' },
    { id: 9, product_name: 'Dosa 1', price: 20.00, category_name: 'Breakfast' },
    { id: 10, product_name: 'Idly 1', price: 20.00, category_name: 'Breakfast' },
    { id: 11, product_name: 'Mallige Idly 1', price: 25.00, category_name: 'Breakfast' },
    { id: 12, product_name: 'Ottu Savige', price: 70.00, category_name: 'Breakfast' },
    { id: 13, product_name: 'Neeru Dosa', price: 60.00, category_name: 'Breakfast' },
    { id: 14, product_name: 'Chapathi', price: 20.00, category_name: 'Lunch & Dinner' },
    { id: 15, product_name: 'Ragi Ball 1', price: 25.00, category_name: 'Lunch & Dinner' },
    { id: 16, product_name: 'Parota', price: 25.00, category_name: 'Lunch & Dinner' },
    { id: 17, product_name: 'Veg Fried Rice', price: 100.00, category_name: 'Lunch & Dinner' },
    { id: 18, product_name: 'Ghee Rice', price: 120.00, category_name: 'Lunch & Dinner' },
    { id: 19, product_name: 'Jeera Rice', price: 100.00, category_name: 'Lunch & Dinner' },
    { id: 20, product_name: 'Tomato Curry', price: 80.00, category_name: 'Lunch & Dinner' },
    { id: 21, product_name: 'Dal Fry', price: 90.00, category_name: 'Lunch & Dinner' },
    { id: 22, product_name: 'New Rajanna Special', price: 180.00, category_name: 'Lunch & Dinner' },
    { id: 23, product_name: 'Rice (Half)', price: 30.00, category_name: 'Meals' },
    { id: 24, product_name: 'Rice (Full)', price: 50.00, category_name: 'Meals' },
    { id: 25, product_name: 'Egg Rice', price: 90.00, category_name: 'Meals' },
    { id: 26, product_name: 'Mutton Meals', price: 360.00, category_name: 'Meals' },
    { id: 27, product_name: 'Chicken Meals', price: 270.00, category_name: 'Meals' },
    { id: 28, product_name: 'Mutton Meals Combo', price: 280.00, category_name: 'Meals' },
    { id: 29, product_name: 'Chicken Fried Rice', price: 140.00, category_name: 'Chicken Items' },
    { id: 30, product_name: 'Chicken Kurma', price: 160.00, category_name: 'Chicken Items' },
    { id: 31, product_name: 'Chicken Fry', price: 170.00, category_name: 'Chicken Items' },
    { id: 32, product_name: 'Chicken Pepper Dry', price: 180.00, category_name: 'Chicken Items' },
    { id: 33, product_name: 'Guntur Chicken', price: 180.00, category_name: 'Chicken Items' },
    { id: 34, product_name: 'Guntur Chicken Dry', price: 180.00, category_name: 'Chicken Items' },
    { id: 35, product_name: 'Andhra Style Chili Chicken', price: 170.00, category_name: 'Chicken Items' },
    { id: 36, product_name: 'Lemon Chicken', price: 180.00, category_name: 'Chicken Items' },
    { id: 37, product_name: 'Pudina Chicken', price: 180.00, category_name: 'Chicken Items' },
    { id: 38, product_name: 'Chicken Kabab (Full)', price: 140.00, category_name: 'Chicken Items' },
    { id: 39, product_name: 'Kalmi Kabab', price: 80.00, category_name: 'Chicken Items' },
    { id: 40, product_name: 'Chicken Lollipop', price: 160.00, category_name: 'Chicken Items' },
    { id: 41, product_name: 'Chicken Lollipop Chili', price: 170.00, category_name: 'Chicken Items' },
    { id: 42, product_name: 'Chicken 65', price: 180.00, category_name: 'Chicken Items' },
    { id: 43, product_name: 'Chicken Liver Fry', price: 120.00, category_name: 'Chicken Items' },
    { id: 44, product_name: 'Paalak Chicken', price: 180.00, category_name: 'Chicken Items' },
    { id: 45, product_name: 'Mutton Kurma', price: 250.00, category_name: 'Mutton Items' },
    { id: 46, product_name: 'Mutton Chops', price: 260.00, category_name: 'Mutton Items' },
    { id: 47, product_name: 'Mutton Fry', price: 260.00, category_name: 'Mutton Items' },
    { id: 48, product_name: 'Mutton Pepper Dry', price: 260.00, category_name: 'Mutton Items' },
    { id: 49, product_name: 'Mutton Guntur', price: 270.00, category_name: 'Mutton Items' },
    { id: 50, product_name: 'Mutton Guntur Dry', price: 270.00, category_name: 'Mutton Items' },
    { id: 51, product_name: 'Mutton Chilly', price: 270.00, category_name: 'Mutton Items' },
    { id: 52, product_name: 'Mutton Liver Fry', price: 180.00, category_name: 'Mutton Items' },
    { id: 53, product_name: 'Mutton Liver Pepper Dry', price: 180.00, category_name: 'Mutton Items' },
    { id: 54, product_name: 'Mutton Liver Masala', price: 180.00, category_name: 'Mutton Items' },
    { id: 55, product_name: 'Boti Fry', price: 180.00, category_name: 'Boti Items' },
    { id: 56, product_name: 'Boti Dry', price: 180.00, category_name: 'Boti Items' },
    { id: 57, product_name: 'Boti Masala', price: 180.00, category_name: 'Boti Items' },
    { id: 58, product_name: 'Egg Boti Fry', price: 200.00, category_name: 'Boti Items' },
    { id: 59, product_name: 'Boti Kaalu Goju', price: 200.00, category_name: 'Boti Items' },
    { id: 60, product_name: 'Nalli Fry', price: 300.00, category_name: 'Nalli Items' },
    { id: 61, product_name: 'Nalli Dry', price: 300.00, category_name: 'Nalli Items' },
    { id: 62, product_name: 'Nalli Kurma', price: 300.00, category_name: 'Nalli Items' },
    { id: 63, product_name: 'Head Mutton Saaru', price: 190.00, category_name: 'Head Mutton Items' },
    { id: 64, product_name: 'Head Mutton Fry', price: 200.00, category_name: 'Head Mutton Items' },
    { id: 65, product_name: 'Head Mutton Dry', price: 200.00, category_name: 'Head Mutton Items' },
    { id: 66, product_name: 'Brain Fry', price: 160.00, category_name: 'Brain Items' },
    { id: 67, product_name: 'Brain Dry', price: 160.00, category_name: 'Brain Items' },
    { id: 68, product_name: 'Mutton Kaima (Full)', price: 200.00, category_name: 'Mutton Kaima Items' },
    { id: 69, product_name: 'Kaima Fry', price: 210.00, category_name: 'Mutton Kaima Items' },
    { id: 70, product_name: 'Kaima Dry', price: 210.00, category_name: 'Mutton Kaima Items' },
    { id: 71, product_name: 'Egg Kaima Fry', price: 230.00, category_name: 'Mutton Kaima Items' },
    { id: 72, product_name: 'Kaima Kaalu Goju', price: 220.00, category_name: 'Mutton Kaima Items' },
    { id: 73, product_name: 'Naati Koli Saaru', price: 180.00, category_name: 'Naati Koli Special' },
    { id: 74, product_name: 'Naati Koli Fry', price: 190.00, category_name: 'Naati Koli Special' },
    { id: 75, product_name: 'Naati Koli Dry', price: 190.00, category_name: 'Naati Koli Special' },
    { id: 76, product_name: 'Egg Masala', price: 80.00, category_name: 'Egg Items' },
    { id: 77, product_name: 'Egg Burji', price: 70.00, category_name: 'Egg Items' },
    { id: 78, product_name: 'Egg Omlet', price: 60.00, category_name: 'Egg Items' },
    { id: 79, product_name: 'Boiled Egg', price: 15.00, category_name: 'Egg Items' },
    { id: 80, product_name: 'Water (MRP)', price: 20.00, category_name: 'Beverages' },
    { id: 81, product_name: 'Cool Drinks', price: 40.00, category_name: 'Beverages' },
    { id: 82, product_name: 'Goli Soda', price: 30.00, category_name: 'Beverages' }
  ]);

  const [categories] = useState([
    { id: 'all', category_name: 'All Items' },
    { id: 1, category_name: 'Beverages' },
    { id: 2, category_name: 'Biriyani Items' },
    { id: 3, category_name: 'Boti Items' },
    { id: 4, category_name: 'Brain Items' },
    { id: 5, category_name: 'Breakfast' },
    { id: 6, category_name: 'Chicken Items' },
    { id: 7, category_name: 'Egg Items' },
    { id: 8, category_name: 'Head Mutton Items' },
    { id: 9, category_name: 'Lunch & Dinner' },
    { id: 10, category_name: 'Meals' },
    { id: 11, category_name: 'Nalli Items' },
    { id: 12, category_name: 'Soups' },
    { id: 13, category_name: 'Mutton Items' },
    { id: 14, category_name: 'Mutton Kaima Items' },
    { id: 15, category_name: 'Naati Koli Special' }
  ]);

  const [selectedCategory, setSelectedCategory] = useState("All Items");
  const [searchQuery, setSearchQuery] = useState("");
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState("N/A");
  const [hasSelectedTable, setHasSelectedTable] = useState(false);
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  const fetchTables = () => {
    fetch("http://localhost:5000/api/tables")
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setTables(data.data);
        }
      })
      .catch(err => console.log("Using default tables fallback"));
  };

  useEffect(() => {
    fetchTables();
    const interval = setInterval(fetchTables, 3000);
    return () => clearInterval(interval);
  }, []);

  const filteredItems = items.filter(item => {
    const matchesCategory = selectedCategory === "All Items" || (item.category_name || "").toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch = item.product_name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSelectTable = (tCode) => {
    setSelectedTable(tCode);
    setHasSelectedTable(true);
    setCart([]);
  };

  const addToCart = (item) => {
    setCart(prev => {
      const existing = prev.find(i => i.product_name === item.product_name);
      if (existing) {
        return prev.map(i => i.product_name === item.product_name ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const updateQuantity = (id, delta) => {
    setCart(prev => prev.map(i => {
      if (i.id === id || (!i.id && i.product_name)) {
        const newQty = i.qty + delta;
        return newQty > 0 ? { ...i, qty: newQty } : null;
      }
      return i;
    }).filter(Boolean));
  };

  const removeItem = (id) => {
    setCart(prev => prev.filter(item => item.id !== id && item.product_name !== id));
  };

  const clearCart = () => {
    setCart([]);
  };

  const subtotal = cart.reduce((acc, curr) => acc + (parseFloat(curr.price || 0) * curr.qty), 0);

  const handleSendKOT = async () => {
    if (cart.length === 0) {
      alert("Cart is empty!");
      return;
    }
    if (selectedTable === "N/A") {
      alert("Please select a table first!");
      return;
    }

    const kotNo = `KOT-${Math.floor(1000 + Math.random() * 9000)}`;
    const kotData = {
      kot_no: kotNo,
      table_code: selectedTable,
      customer_name: "Captain Order",
      items: cart.map(i => ({ id: i.id, name: i.product_name, qty: i.qty }))
    };

    const detailedOrderData = {
      table_code: selectedTable,
      items: cart.map(i => ({ item_name: i.product_name, quantity: i.qty, price: i.price || 100 }))
    };

    try {
      await fetch("http://localhost:5000/api/kots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(kotData)
      });

      await fetch("http://localhost:5000/api/captain/table-orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(detailedOrderData)
      });

      await fetch(`http://localhost:5000/api/tables/status/${selectedTable}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Occupied" })
      });

      alert("Items saved to table and sent to Kitchen successfully!");
      setCart([]);
      fetchTables();
      setHasSelectedTable(false);
      setSelectedTable("N/A");
    } catch (err) {
      console.error(err);
      alert("Failed to send order to kitchen.");
    }
  };

  const totalTablesCount = tables.length > 0 ? tables.length : 9;
  const occupiedCount = tables.filter(t => (t.status || "").toLowerCase() === "occupied").length;
  const availableCount = totalTablesCount - occupiedCount;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", fontFamily: "Inter, sans-serif", backgroundColor: "#f8fafc" }}>
      {/* Header */}
      <header style={{ height: "60px", backgroundColor: "#0f172a", color: "#fff", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <h2 style={{ margin: 0, fontSize: "18px" }}>
            {hasSelectedTable ? `Captain Panel - Table: ${selectedTable}` : "Captain Panel - Select Table to Proceed"}
          </h2>
          <div style={{ display: "flex", gap: "10px", fontSize: "12px" }}>
            <span style={{ backgroundColor: "#16a34a", padding: "3px 8px", borderRadius: "4px", fontWeight: "bold" }}>Available: {availableCount}</span>
            <span style={{ backgroundColor: "#dc2626", padding: "3px 8px", borderRadius: "4px", fontWeight: "bold" }}>Occupied: {occupiedCount}</span>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          {hasSelectedTable && (
            <button 
              onClick={() => { setHasSelectedTable(false); setSelectedTable("N/A"); }} 
              style={{ backgroundColor: "#0284c7", color: "#fff", border: "none", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", fontWeight: "bold" }}
            >
              <ArrowLeft size={14} /> Change Table
            </button>
          )}
          <span>Captain: captain1</span>
          <button onClick={() => { localStorage.clear(); navigate("/"); }} style={{ backgroundColor: "#dc2626", color: "#fff", border: "none", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}>
            <LogOut size={16} /> Logout
          </button>
        </div>
      </header>

      {/* Main Body */}
      {!hasSelectedTable ? (
        /* PARTITIONED LAYOUT: TABLES PROMINENTLY ON THE RIGHT SIDE */
        <div style={{ display: "flex", flex: 1, overflow: "hidden", padding: "30px", gap: "30px", backgroundColor: "#f8fafc" }}>
          
          {/* Left Side: Welcome & Instructions Panel */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", paddingLeft: "40px" }}>
            <h1 style={{ color: "#0f172a", fontSize: "32px", marginBottom: "16px" }}>Welcome, Captain!</h1>
            <p style={{ color: "#64748b", fontSize: "16px", lineHeight: "1.6", maxWidth: "450px" }}>
              Please select a table from the right-hand panel to open menu categories, view live item lists, and manage order carts.
            </p>
          </div>

          {/* Right Side: Tables Grid Partition */}
          <div style={{ flex: 1.2, backgroundColor: "#fff", borderRadius: "12px", padding: "24px", border: "1px solid #e2e8f0", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)", overflowY: "auto", display: "flex", flexDirection: "column" }}>
            <h3 style={{ color: "#0f172a", marginBottom: "6px", fontSize: "18px" }}>Select a Table</h3>
            <p style={{ color: "#64748b", marginBottom: "20px", fontSize: "13px" }}>Click any available or occupied table to view or add items.</p>
            
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(180px, 1fr))", gap: "16px", alignContent: "start" }}>
              {tables.length > 0 ? (
                tables.map(t => {
                  const tCode = t.table_code || t.table_name;
                  const isOccupied = (t.status || "").toLowerCase() === "occupied";
                  
                  return (
                    <div 
                      key={t.id} 
                      onClick={() => handleSelectTable(tCode)}
                      style={{ 
                        padding: "20px", 
                        borderRadius: "10px", 
                        border: `2px solid ${isOccupied ? "#f87171" : "#22c55e"}`, 
                        backgroundColor: isOccupied ? "#fee2e2" : "#f0fdf4", 
                        cursor: "pointer", 
                        textAlign: "center",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.03)",
                        transition: "0.2s"
                      }}
                    >
                      <div style={{ fontWeight: "bold", fontSize: "16px", color: "#0f172a", marginBottom: "6px" }}>{t.table_name || t.table_code}</div>
                      <div style={{ fontSize: "12px", fontWeight: "bold", color: isOccupied ? "#dc2626" : "#16a34a" }}>
                        {isOccupied ? "Occupied" : "Available"}
                      </div>
                    </div>
                  );
                })
              ) : (
                ["Window View", "Quiet Corner", "Entrance", "Family Booth", "Large Group", "VIP Area", "Banquet Style", "Team Lunch", "Bar Side"].map(tblName => (
                  <div 
                    key={tblName} 
                    onClick={() => handleSelectTable(tblName)}
                    style={{ 
                      padding: "20px", 
                      borderRadius: "10px", 
                      border: "1px solid #22c55e", 
                      backgroundColor: "#f0fdf4", 
                      cursor: "pointer", 
                      textAlign: "center",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.03)"
                    }}
                  >
                    <div style={{ fontWeight: "bold", fontSize: "16px", color: "#0f172a", marginBottom: "6px" }}>{tblName}</div>
                    <div style={{ fontSize: "12px", fontWeight: "bold", color: "#16a34a" }}>Available</div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      ) : (
        /* POS & MENU VIEW (SLIDES IN AFTER TABLE IS SELECTED) */
        <div style={{ display: "flex", flex: 1, overflow: "hidden", padding: "16px", gap: "16px" }}>
          
          {/* Left Sidebar Categories */}
          <div style={{ width: "220px", backgroundColor: "#fff", borderRadius: "10px", padding: "12px", border: "1px solid #e2e8f0", overflowY: "auto", display: "flex", flexDirection: "column", gap: "6px" }}>
            <h4 style={{ margin: "0 0 8px 0", fontSize: "12px", color: "#64748b", textTransform: "uppercase" }}>Categories</h4>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.category_name)}
                style={{
                  textAlign: "left",
                  padding: "10px 12px",
                  borderRadius: "6px",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: selectedCategory === cat.category_name ? "bold" : "normal",
                  backgroundColor: selectedCategory === cat.category_name ? "#0f172a" : "#f1f5f9",
                  color: selectedCategory === cat.category_name ? "#fff" : "#334155",
                  fontSize: "13px",
                  transition: "0.2s"
                }}
              >
                {cat.category_name}
              </button>
            ))}
          </div>

          {/* Middle: Search Bar & Menu Items Grid */}
          <div style={{ flex: 2, backgroundColor: "#fff", borderRadius: "10px", padding: "16px", border: "1px solid #e2e8f0", display: "flex", flexDirection: "column", overflow: "hidden" }}>
            
            <div style={{ marginBottom: "14px", display: "flex", alignItems: "center", backgroundColor: "#f1f5f9", padding: "8px 14px", borderRadius: "8px", border: "1px solid #cbd5e1", gap: "8px" }}>
              <Search size={18} color="#64748b" />
              <input 
                type="text" 
                placeholder="Search item / scan barcode..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ border: "none", background: "transparent", outline: "none", width: "100%", fontSize: "14px" }}
              />
            </div>

            <h3 style={{ margin: "0 0 12px 0", color: "#0f172a", display: "flex", alignItems: "center", gap: "8px" }}>
              <Utensils size={18} /> {selectedCategory} ({filteredItems.length})
            </h3>

            <div style={{ flex: 1, overflowY: "auto", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px", alignContent: "start" }}>
              {filteredItems.map(item => (
                <div key={item.id} onClick={() => addToCart(item)} style={{ padding: "14px", border: "1px solid #cbd5e1", borderRadius: "8px", cursor: "pointer", backgroundColor: "#f8fafc", textAlign: "center", transition: "0.2s" }}>
                  <div style={{ fontWeight: "bold", fontSize: "13px", color: "#0f172a" }}>{item.product_name}</div>
                  <div style={{ color: "#0284c7", fontWeight: "600", marginTop: "6px" }}>₹{Number(item.price).toFixed(2)}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Current Order Cart */}
          <div style={{ flex: 1.3, backgroundColor: "#fff", borderRadius: "10px", padding: "16px", border: "1px solid #e2e8f0", display: "flex", flexDirection: "column", gap: "12px", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ margin: 0, color: "#0f172a", fontSize: "15px", display: "flex", alignItems: "center", gap: "6px" }}><Layers size={16} /> Current Order</h3>
              {cart.length > 0 && (
                <button onClick={clearCart} style={{ background: "#dc2626", color: "#fff", border: "none", padding: "4px 8px", fontSize: "11px", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}>
                  CLEAR CART
                </button>
              )}
            </div>

            <div style={{ fontSize: "12px", fontWeight: "bold", color: "#64748b" }}>
              ACTIVE TABLE: <span style={{ color: "#0284c7" }}>{selectedTable}</span>
            </div>

            <div style={{ flex: 1, overflowY: "auto", borderTop: "1px solid #e2e8f0", borderBottom: "1px solid #e2e8f0", padding: "8px 0" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid #cbd5e1", color: "#64748b", textAlign: "left" }}>
                    <th style={{ padding: "4px" }}>ITEM</th>
                    <th style={{ padding: "4px", textAlign: "center" }}>QTY</th>
                    <th style={{ padding: "4px", textAlign: "right" }}>PRICE</th>
                    <th style={{ padding: "4px", textAlign: "right" }}>TOTAL</th>
                    <th style={{ padding: "4px", textAlign: "center" }}>#</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.length === 0 ? (
                    <tr>
                      <td colSpan="5" style={{ textAlign: "center", color: "#94a3b8", padding: "20px" }}>Cart is empty</td>
                    </tr>
                  ) : (
                    cart.map((c) => (
                      <tr key={c.id || c.product_name} style={{ borderBottom: "1px dashed #f1f5f9" }}>
                        <td style={{ padding: "6px 2px", fontWeight: "500", width: "35%" }}>{c.product_name}</td>
                        <td style={{ padding: "6px 2px", textAlign: "center" }}>
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "4px" }}>
                            <button onClick={() => updateQuantity(c.id, -1)} style={{ padding: "1px 5px", background: "#e2e8f0", border: "none", borderRadius: "3px", cursor: "pointer", fontWeight: "bold" }}>-</button>
                            <span>{c.qty}</span>
                            <button onClick={() => updateQuantity(c.id, 1)} style={{ padding: "1px 5px", background: "#e2e8f0", border: "none", borderRadius: "3px", cursor: "pointer", fontWeight: "bold" }}>+</button>
                          </div>
                        </td>
                        <td style={{ padding: "6px 2px", textAlign: "right" }}>₹{Number(c.price || 100).toFixed(2)}</td>
                        <td style={{ padding: "6px 2px", textAlign: "right", fontWeight: "600" }}>₹{((c.price || 100) * c.qty).toFixed(2)}</td>
                        <td style={{ padding: "6px 2px", textAlign: "center" }}>
                          <button onClick={() => removeItem(c.id || c.product_name)} style={{ background: "none", border: "none", color: "#dc2626", cursor: "pointer", fontWeight: "bold" }} title="Remove item">✕</button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Totals Section */}
            <div style={{ fontSize: "13px", display: "flex", flexDirection: "column", gap: "6px", backgroundColor: "#f8fafc", padding: "10px", borderRadius: "6px" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#64748b" }}>Subtotal:</span>
                <span style={{ fontWeight: "600" }}>₹{subtotal.toFixed(2)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "16px", fontWeight: "bold", borderTop: "1px solid #cbd5e1", paddingTop: "6px", color: "#0f172a" }}>
                <span>Total Payable:</span>
                <span style={{ color: "#16a34a" }}>₹{subtotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Action Button */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <button onClick={handleSendKOT} style={{ width: "100%", padding: "12px", backgroundColor: "#16a34a", color: "#fff", border: "none", borderRadius: "6px", fontWeight: "bold", cursor: "pointer", fontSize: "14px" }}>
                Add Extra Items / Send to Kitchen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}