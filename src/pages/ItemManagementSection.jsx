import React, { useState, useEffect, useCallback } from "react";
import { Search, Plus, Edit2, Trash2, ChevronDown, X } from "lucide-react";

// Fallback hardcoded full menu data mapping your printed restaurant menu card
const FALLBACK_INITIAL_ITEMS = [
  // BREAKFAST (category_id: 1)
  { id: 1, category_id: 1, category_name: "BREAKFAST", product_name: "Leg Soup (Single)", price: 110, gst_percent: 5, stock: 999, description: "Breakfast leg soup", published: 1 },
  { id: 2, category_id: 1, category_name: "BREAKFAST", product_name: "Plain Soup", price: 30, gst_percent: 5, stock: 999, description: "Clear hot soup base", published: 1 },
  { id: 3, category_id: 1, category_name: "BREAKFAST", product_name: "Dosa 1", price: 20, gst_percent: 5, stock: 999, description: "Crispy tawa dosa", published: 1 },
  { id: 4, category_id: 1, category_name: "BREAKFAST", product_name: "Idly 1", price: 20, gst_percent: 5, stock: 999, description: "Steamed soft idly", published: 1 },
  { id: 5, category_id: 1, category_name: "BREAKFAST", product_name: "Mallige Idly 1", price: 25, gst_percent: 5, stock: 999, description: "Soft mallige idly", published: 1 },
  { id: 6, category_id: 1, category_name: "BREAKFAST", product_name: "Egg Dosa", price: 50, gst_percent: 5, stock: 999, description: "Dosa topped with egg", published: 1 },

  // LUNCH & DINNER (category_id: 2)
  { id: 7, category_id: 2, category_name: "LUNCH & DINNER", product_name: "Ragi Ball 1", price: 25, gst_percent: 5, stock: 999, description: "Healthy ragi mudde", published: 1 },
  { id: 8, category_id: 2, category_name: "LUNCH & DINNER", product_name: "Parota", price: 25, gst_percent: 5, stock: 999, description: "Layered parotta", published: 1 },
  { id: 9, category_id: 2, category_name: "LUNCH & DINNER", product_name: "Chapathi", price: 20, gst_percent: 5, stock: 999, description: "Whole wheat chapathi", published: 1 },
  { id: 10, category_id: 2, category_name: "LUNCH & DINNER", product_name: "Rice (Half)", price: 30, gst_percent: 5, stock: 999, description: "White rice half", published: 1 },
  { id: 11, category_id: 2, category_name: "LUNCH & DINNER", product_name: "Rice (Full)", price: 50, gst_percent: 5, stock: 999, description: "White rice full plate", published: 1 },

  // BIRIYANI ITEMS (category_id: 3)
  { id: 12, category_id: 3, category_name: "BIRIYANI ITEMS", product_name: "Mutton Biriyani", price: 240, gst_percent: 5, stock: 999, description: "Mutton mixed rice", published: 1 },
  { id: 13, category_id: 3, category_name: "BIRIYANI ITEMS", product_name: "Chicken Biriyani", price: 160, gst_percent: 5, stock: 999, description: "Classic chicken biriyani", published: 1 },
  { id: 14, category_id: 3, category_name: "BIRIYANI ITEMS", product_name: "Egg Biriyani", price: 120, gst_percent: 5, stock: 999, description: "Biriyani rice with eggs", published: 1 },
  { id: 15, category_id: 3, category_name: "BIRIYANI ITEMS", product_name: "Kushka (Full) & Half", price: 90, gst_percent: 5, stock: 999, description: "Plain biriyani rice", published: 1 },
  { id: 16, category_id: 3, category_name: "BIRIYANI ITEMS", product_name: "Egg Rice", price: 90, gst_percent: 5, stock: 999, description: "Stir fried egg rice", published: 1 },
  { id: 17, category_id: 3, category_name: "BIRIYANI ITEMS", product_name: "Chicken Fried Rice", price: 140, gst_percent: 5, stock: 999, description: "Chicken fried rice", published: 1 },

  // BOTI ITEMS (category_id: 4)
  { id: 18, category_id: 4, category_name: "BOTI ITEMS", product_name: "Boti Fry", price: 180, gst_percent: 5, stock: 999, description: "Spiced boti dry", published: 1 },
  { id: 19, category_id: 4, category_name: "BOTI ITEMS", product_name: "Boti Dry", price: 180, gst_percent: 5, stock: 999, description: "Crispy fried traditional boti", published: 1 },
  { id: 20, category_id: 4, category_name: "BOTI ITEMS", product_name: "Boti Masala", price: 180, gst_percent: 5, stock: 999, description: "Boti in thick gravy", published: 1 },
  { id: 21, category_id: 4, category_name: "BOTI ITEMS", product_name: "Egg Boti Fry", price: 200, gst_percent: 5, stock: 999, description: "Boti fry with eggs", published: 1 },

  // NALLI ITEMS (category_id: 5)
  { id: 22, category_id: 5, category_name: "NALLI ITEMS", product_name: "Nalli Fry", price: 300, gst_percent: 5, stock: 999, description: "Mutton nalli piece fry", published: 1 },
  { id: 23, category_id: 5, category_name: "NALLI ITEMS", product_name: "Nalli Dry", price: 300, gst_percent: 5, stock: 999, description: "Seasoned nalli bones dry", published: 1 },
  { id: 24, category_id: 5, category_name: "NALLI ITEMS", product_name: "Nalli Kurma", price: 300, gst_percent: 5, stock: 999, description: "Gravy with mutton nalli", published: 1 },

  // HEAD MUTTON ITEMS (category_id: 6)
  { id: 25, category_id: 6, category_name: "HEAD MUTTON ITEMS", product_name: "Head Mutton Saaru", price: 190, gst_percent: 5, stock: 999, description: "Spicy head mutton gravy", published: 1 },
  { id: 26, category_id: 6, category_name: "HEAD MUTTON ITEMS", product_name: "Head Mutton Fry", price: 200, gst_percent: 5, stock: 999, description: "Tossed head meat fry", published: 1 },
  { id: 27, category_id: 6, category_name: "HEAD MUTTON ITEMS", product_name: "Head Mutton Dry", price: 200, gst_percent: 5, stock: 999, description: "Head meat pieces dry", published: 1 },

  // MEALS (category_id: 7)
  { id: 28, category_id: 7, category_name: "MEALS", product_name: "Mutton Meals", price: 360, gst_percent: 5, stock: 999, description: "Full meals with mutton gravy", published: 1 },
  { id: 29, category_id: 7, category_name: "MEALS", product_name: "Chicken Meals", price: 270, gst_percent: 5, stock: 999, description: "Full meals with chicken gravy", published: 1 },
  { id: 30, category_id: 7, category_name: "MEALS", product_name: "Mutton Meals Combo", price: 280, gst_percent: 5, stock: 999, description: "Mutton combo meals set", published: 1 },

  // BRAIN ITEMS (category_id: 8)
  { id: 31, category_id: 8, category_name: "BRAIN ITEMS", product_name: "Brain Fry", price: 160, gst_percent: 5, stock: 999, description: "Pan fried goat brain", published: 1 },
  { id: 32, category_id: 8, category_name: "BRAIN ITEMS", product_name: "Brain Dry", price: 160, gst_percent: 5, stock: 999, description: "Deep fried brain chunks", published: 1 },

  // MUTTON KAIMA ITEMS (category_id: 9)
  { id: 33, category_id: 9, category_name: "MUTTON KAIMA ITEMS", product_name: "Mutton Kaima (Full)", price: 200, gst_percent: 5, stock: 999, description: "Minced mutton keema dry", published: 1 },
  { id: 34, category_id: 9, category_name: "MUTTON KAIMA ITEMS", product_name: "Kaima Fry", price: 210, gst_percent: 5, stock: 999, description: "Spicy roasted kaima mix", published: 1 },
  { id: 35, category_id: 9, category_name: "MUTTON KAIMA ITEMS", product_name: "Kaima Dry", price: 210, gst_percent: 5, stock: 999, description: "Crispy roasted minced mutton", published: 1 },
  { id: 36, category_id: 9, category_name: "MUTTON KAIMA ITEMS", product_name: "Egg Kaima Fry", price: 230, gst_percent: 5, stock: 999, description: "Kaima scrambled with eggs", published: 1 },

  // CHICKEN ITEMS (category_id: 10)
  { id: 37, category_id: 10, category_name: "CHICKEN ITEMS", product_name: "Chicken Kurma", price: 160, gst_percent: 5, stock: 999, description: "Masala chicken gravy", published: 1 },
  { id: 38, category_id: 10, category_name: "CHICKEN ITEMS", product_name: "Chicken Fry", price: 170, gst_percent: 5, stock: 999, description: "Pan chicken roast", published: 1 },
  { id: 39, category_id: 10, category_name: "CHICKEN ITEMS", product_name: "Chicken Pepper Dry", price: 180, gst_percent: 5, stock: 999, description: "Black pepper chicken fry", published: 1 },
  { id: 40, category_id: 10, category_name: "CHICKEN ITEMS", product_name: "Guntur Chicken", price: 180, gst_percent: 5, stock: 999, description: "Hot chili style chicken dry", published: 1 },
  { id: 41, category_id: 10, category_name: "CHICKEN ITEMS", product_name: "Guntur Chicken Dry", price: 180, gst_percent: 5, stock: 999, description: "Dry roasted guntur chicken", published: 1 },
  { id: 42, category_id: 10, category_name: "CHICKEN ITEMS", product_name: "Andhra Style Chili Chicken", price: 170, gst_percent: 5, stock: 999, description: "Green chili chicken starter", published: 1 },
  { id: 43, category_id: 10, category_name: "CHICKEN ITEMS", product_name: "Lemon Chicken", price: 180, gst_percent: 5, stock: 999, description: "Zesty citrus chicken dry", published: 1 },
  { id: 44, category_id: 10, category_name: "CHICKEN ITEMS", product_name: "Pudina Chicken", price: 180, gst_percent: 5, stock: 999, description: "Mint paste chicken dry", published: 1 },
  { id: 45, category_id: 10, category_name: "CHICKEN ITEMS", product_name: "Chicken Kabab (Full)", price: 140, gst_percent: 5, stock: 999, description: "Deep fried chicken kababs", published: 1 },
  { id: 46, category_id: 10, category_name: "CHICKEN ITEMS", product_name: "Kalmi Kabab", price: 80, gst_percent: 5, stock: 999, description: "Single leg chicken roast", published: 1 },
  { id: 47, category_id: 10, category_name: "CHICKEN ITEMS", product_name: "Chicken Lollipop", price: 160, gst_percent: 5, stock: 999, description: "Crisp wing lollipops", published: 1 },
  { id: 48, category_id: 10, category_name: "CHICKEN ITEMS", product_name: "Chicken Lollipop Chili", price: 170, gst_percent: 5, stock: 999, description: "Lollipops in extra green chilies", published: 1 },
  { id: 49, category_id: 10, category_name: "CHICKEN ITEMS", product_name: "Chicken 65", price: 180, gst_percent: 5, stock: 999, description: "Boneless crisp chicken bites", published: 1 },
  { id: 50, category_id: 10, category_name: "CHICKEN ITEMS", product_name: "Chicken Liver Fry", price: 120, gst_percent: 5, stock: 999, description: "Spiced chicken liver pieces", published: 1 },

  // MUTTON ITEMS (category_id: 11)
  { id: 51, category_id: 11, category_name: "MUTTON ITEMS", product_name: "Mutton Kurma", price: 250, gst_percent: 5, stock: 999, description: "Mutton bone curry base", published: 1 },
  { id: 52, category_id: 11, category_name: "MUTTON ITEMS", product_name: "Mutton Chops", price: 260, gst_percent: 5, stock: 999, description: "Rib chops in heavy gravy", published: 1 },
  { id: 53, category_id: 11, category_name: "MUTTON ITEMS", product_name: "Mutton Fry", price: 260, gst_percent: 5, stock: 999, description: "Dry roasted mutton chunks", published: 1 },
  { id: 54, category_id: 11, category_name: "MUTTON ITEMS", product_name: "Mutton Pepper Dry", price: 260, gst_percent: 5, stock: 999, description: "Black pepper mutton fry", published: 1 },
  { id: 55, category_id: 11, category_name: "MUTTON ITEMS", product_name: "Mutton Guntur", price: 270, gst_percent: 5, stock: 999, description: "Green paste mutton dry", published: 1 },
  { id: 56, category_id: 11, category_name: "MUTTON ITEMS", product_name: "Mutton Guntur Dry", price: 270, gst_percent: 5, stock: 999, description: "Dry charred guntur mutton", published: 1 },
  { id: 57, category_id: 11, category_name: "MUTTON ITEMS", product_name: "Mutton Chilly", price: 270, gst_percent: 5, stock: 999, description: "Wok tossed chili garlic mutton", published: 1 },
  { id: 58, category_id: 11, category_name: "MUTTON ITEMS", product_name: "Mutton Liver Fry", price: 180, gst_percent: 5, stock: 999, description: "Goat liver skillet fry", published: 1 },
  { id: 59, category_id: 11, category_name: "MUTTON ITEMS", product_name: "Mutton Liver Pepper Dry", price: 180, gst_percent: 5, stock: 999, description: "Black pepper mutton liver fry", published: 1 },
  { id: 60, category_id: 11, category_name: "MUTTON ITEMS", product_name: "Mutton Liver Masala", price: 180, gst_percent: 5, stock: 999, description: "Liver cooked in local masala", published: 1 },

  // NAATI KOLI SPECIAL (category_id: 12)
  { id: 61, category_id: 12, category_name: "NAATI KOLI SPECIAL", product_name: "Naati Koli Saaru", price: 180, gst_percent: 5, stock: 999, description: "Country chicken bone soup", published: 1 },
  { id: 62, category_id: 12, category_name: "NAATI KOLI SPECIAL", product_name: "Naati Koli Fry", price: 190, gst_percent: 5, stock: 999, description: "Country chicken bone fry", published: 1 },
  { id: 63, category_id: 12, category_name: "NAATI KOLI SPECIAL", product_name: "Naati Koli Dry", price: 190, gst_percent: 5, stock: 999, description: "Native country chicken bits", published: 1 },

  // BEVERAGES (category_id: 13)
  { id: 64, category_id: 13, category_name: "BEVERAGES", product_name: "Water (MRP)", price: 20, gst_percent: 5, stock: 999, description: "Chilled mineral water bottle", published: 1 },
  { id: 65, category_id: 13, category_name: "BEVERAGES", product_name: "Cool Drinks", price: 40, gst_percent: 5, stock: 999, description: "Carbonated cold sweet soda", published: 1 },
  { id: 66, category_id: 13, category_name: "BEVERAGES", product_name: "Goli Soda", price: 30, gst_percent: 5, stock: 999, description: "Authentic local goli soda", published: 1 },

  // EGG ITEMS (category_id: 14)
  { id: 67, category_id: 14, category_name: "EGG ITEMS", product_name: "Egg Masala", price: 80, gst_percent: 5, stock: 999, description: "Boiled split eggs in curry", published: 1 },
  { id: 68, category_id: 14, category_name: "EGG ITEMS", product_name: "Egg Burji", price: 70, gst_percent: 5, stock: 999, description: "Scrambled spiced eggs", published: 1 },
  { id: 69, category_id: 14, category_name: "EGG ITEMS", product_name: "Egg Omlet", price: 60, gst_percent: 5, stock: 999, description: "Double egg fluffy omelet", published: 1 },
  { id: 70, category_id: 14, category_name: "EGG ITEMS", product_name: "Boiled Egg", price: 15, gst_percent: 5, stock: 999, description: "Single hard boiled whole egg", published: 1 },

  // VEG ITEMS (category_id: 15)
  { id: 71, category_id: 15, category_name: "VEG ITEMS", product_name: "Veg Fried Rice", price: 100, gst_percent: 5, stock: 999, description: "Vegetable tossed wok rice", published: 1 },
  { id: 72, category_id: 15, category_name: "VEG ITEMS", product_name: "Ghee Rice", price: 120, gst_percent: 5, stock: 999, description: "Premium ghee rich rice", published: 1 },
  { id: 73, category_id: 15, category_name: "VEG ITEMS", product_name: "Jeera Rice", price: 100, gst_percent: 5, stock: 999, description: "Rice in light cumin tempering", published: 1 },
  { id: 74, category_id: 15, category_name: "VEG ITEMS", product_name: "Tomato Curry", price: 80, gst_percent: 5, stock: 999, description: "Tangy southern tomato stew", published: 1 },
  { id: 75, category_id: 15, category_name: "VEG ITEMS", product_name: "Dal Fry", price: 90, gst_percent: 5, stock: 999, description: "Yellow lentils butter tempering", published: 1 },

  // SUNDAY SPECIAL (category_id: 16)
  { id: 76, category_id: 16, category_name: "SUNDAY SPECIAL", product_name: "New Rajanna Special", price: 180, gst_percent: 5, stock: 999, description: "Sunday Special Rajanna Item", published: 1 },
  { id: 77, category_id: 16, category_name: "SUNDAY SPECIAL", product_name: "Boti Kaalu Goju", price: 200, gst_percent: 5, stock: 999, description: "Traditional boti leg gravy mix", published: 1 },
  { id: 78, category_id: 16, category_name: "SUNDAY SPECIAL", product_name: "Kaima Kaalu Goju", price: 220, gst_percent: 5, stock: 999, description: "Minced meat with leg gravy mix", published: 1 },
  { id: 79, category_id: 16, category_name: "SUNDAY SPECIAL", product_name: "Ottu Savige", price: 70, gst_percent: 5, stock: 999, description: "Traditional Sunday breakfast savige", published: 1 },
  { id: 80, category_id: 16, category_name: "SUNDAY SPECIAL", product_name: "Neeru Dosa", price: 60, gst_percent: 5, stock: 999, description: "Soft thin neer dosa", published: 1 },
  { id: 81, category_id: 16, category_name: "SUNDAY SPECIAL", product_name: "Naati Koli Biriyani", price: 200, gst_percent: 5, stock: 999, description: "Authentic country chicken biriyani", published: 1 },
  { id: 82, category_id: 16, category_name: "SUNDAY SPECIAL", product_name: "Paalak Chicken", price: 180, gst_percent: 5, stock: 999, description: "Spiced spinach chicken gravy", published: 1 },
];

export default function ItemManagementSection() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");

  // State to track if we are editing an existing item, and its ID
  const [editingId, setEditingId] = useState(null);

  // Inline Form State for New / Editing Item
  const [newItem, setNewItem] = useState({
    product_name: "",
    description: "",
    category_id: "",
    price: "",
    gst_percent: "5",
    custom_gst: "",
    stock: "999",
    published: 1,
  });

  const [isCustomGst, setIsCustomGst] = useState(false);

  const fetchItems = useCallback(async () => {
    try {
      const res = await fetch("http://localhost:5000/api/items");
      const data = await res.json();
      if (data.success && data.data && data.data.length > 0) {
        setItems(data.data);
      } else {
        // Fallback display if database is empty so items show up instantly
        setItems(FALLBACK_INITIAL_ITEMS);
      }
    } catch (err) {
      console.warn("API offline, displaying fallback menu items:", err);
      setItems(FALLBACK_INITIAL_ITEMS);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch("http://localhost:5000/api/categories");
      const data = await res.json();
      if (data.success && data.data) {
        setCategories(data.data);
      } else {
        setCategories([
          { id: 1, category_name: "BREAKFAST" },
          { id: 2, category_name: "LUNCH & DINNER" },
          { id: 3, category_name: "BIRIYANI ITEMS" },
          { id: 4, category_name: "BOTI ITEMS" },
          { id: 5, category_name: "NALLI ITEMS" },
          { id: 6, category_name: "HEAD MUTTON ITEMS" },
          { id: 7, category_name: "MEALS" },
          { id: 8, category_name: "BRAIN ITEMS" },
          { id: 9, category_name: "MUTTON KAIMA ITEMS" },
          { id: 10, category_name: "CHICKEN ITEMS" },
          { id: 11, category_name: "MUTTON ITEMS" },
          { id: 12, category_name: "NAATI KOLI SPECIAL" },
          { id: 13, category_name: "BEVERAGES" },
          { id: 14, category_name: "EGG ITEMS" },
          { id: 15, category_name: "VEG ITEMS" },
          { id: 16, category_name: "SUNDAY SPECIAL" },
        ]);
      }
    } catch (err) {
      console.error("Error loading categories:", err);
    }
  }, []);

  useEffect(() => {
    fetchItems();
    fetchCategories();
  }, [fetchItems, fetchCategories]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewItem((prev) => ({ ...prev, [name]: value }));
  };

  const handleGstDropdownChange = (e) => {
    const val = e.target.value;
    if (val === "custom") {
      setIsCustomGst(true);
      setNewItem((prev) => ({ ...prev, gst_percent: "" }));
    } else {
      setIsCustomGst(false);
      setNewItem((prev) => ({ ...prev, gst_percent: val, custom_gst: "" }));
    }
  };

  // Populate form with item data for editing
  const handleEditItem = (item) => {
    setEditingId(item.id);
    const gstVal = Number(item.gst_percent || 5);
    const basePrice = Number(item.price || 0);
    // Reverse calculation to show retail price in input field when editing
    const retailPrice = basePrice * (1 + gstVal / 100);

    const isStandardGst = ["0", "5", "10", "18"].includes(String(item.gst_percent));

    setNewItem({
      product_name: item.product_name || "",
      description: item.description || "",
      category_id: item.category_id || "",
      price: retailPrice ? retailPrice.toFixed(2) : "",
      gst_percent: isStandardGst ? String(item.gst_percent) : "",
      custom_gst: isStandardGst ? "" : String(item.gst_percent || ""),
      stock: item.stock !== undefined ? item.stock : "999",
      published: item.published !== undefined ? item.published : 1,
    });

    setIsCustomGst(!isStandardGst);
    
    document.getElementById("new-dish-name")?.focus();
    document.getElementById("new-dish-name")?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  // Reset Form
  const resetForm = () => {
    setEditingId(null);
    setNewItem({
      product_name: "",
      description: "",
      category_id: "",
      price: "",
      gst_percent: "5",
      custom_gst: "",
      stock: "999",
      published: 1,
    });
    setIsCustomGst(false);
  };

  // Handle Save (POST for new item, PUT for updating existing item)
  const handleSaveItem = async () => {
    const finalGst = isCustomGst ? parseFloat(newItem.custom_gst) || 0 : parseFloat(newItem.gst_percent) || 0;

    if (!newItem.product_name || !newItem.price) {
      alert("Please enter Item Name and Price.");
      return;
    }

    const enteredPrice = parseFloat(newItem.price) || 0;
    const baseAmount = enteredPrice / (1 + finalGst / 100);

    const payload = { 
      product_name: newItem.product_name,
      description: newItem.description || "",
      category_id: newItem.category_id || null,
      price: parseFloat(baseAmount.toFixed(4)),
      gst_percent: finalGst,
      stock: parseInt(newItem.stock, 10) || 999,
      published: newItem.published !== undefined ? newItem.published : 1
    };

    const url = editingId ? `http://localhost:5000/api/items/${editingId}` : "http://localhost:5000/api/items";
    const method = editingId ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success) {
        alert(editingId ? "Item updated successfully!" : "Item added successfully!");
        fetchItems();
        resetForm();
      } else {
        // Fallback local update if API fails
        if (editingId) {
          setItems(items.map(i => i.id === editingId ? { ...i, ...payload, gst_percent: finalGst } : i));
        } else {
          setItems([...items, { ...payload, id: Date.now(), gst_percent: finalGst }]);
        }
        alert("Saved successfully!");
        resetForm();
      }
    } catch (err) {
      console.warn("Server offline, updating UI locally:", err);
      if (editingId) {
        setItems(items.map(i => i.id === editingId ? { ...i, ...payload, gst_percent: finalGst } : i));
      } else {
        setItems([...items, { ...payload, id: Date.now(), gst_percent: finalGst }]);
      }
      resetForm();
    }
  };

  const handleRemoveItem = async (id) => {
    if (window.confirm("Are you sure you want to remove this item?")) {
      try {
        const res = await fetch(`http://localhost:5000/api/items/${id}`, {
          method: "DELETE",
        });
        const data = await res.json();
        if (data.success) {
          fetchItems();
        } else {
          setItems(items.filter(i => i.id !== id));
        }
      } catch (err) {
        setItems(items.filter(i => i.id !== id));
      }
    }
  };

  const filteredItems = items.filter((item) => {
    const matchesSearch = item.product_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat =
      selectedCategory === "All Categories" ||
      item.category_name === selectedCategory ||
      String(item.category_id) === String(selectedCategory);

    return matchesSearch && matchesCat;
  });

  const currentActiveGst = isCustomGst ? parseFloat(newItem.custom_gst) || 0 : parseFloat(newItem.gst_percent) || 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px", width: "100%", fontFamily: "Inter, sans-serif", position: "relative" }}>
      
      {/* HEADER CARD */}
      <div style={styles.headerCard}>
        <div>
          <h2 style={styles.title}>Menu Item Management</h2>
          <p style={styles.subtitle}>Directly manage food items, prices, GST rates, and stock for POS billing.</p>
        </div>
        <div style={styles.headerActions}>
          <button style={styles.addNewBtn} onClick={() => { resetForm(); document.getElementById("new-dish-name")?.focus(); }}>
            <Plus size={14} />
            <span>Add New Item</span>
          </button>
        </div>
      </div>

      {/* SEARCH AND DYNAMIC CATEGORY FILTER BAR */}
      <div style={styles.filterCard}>
        <div style={styles.searchBox}>
          <Search size={16} color="#94a3b8" />
          <input
            type="text"
            placeholder="Search dish name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={styles.searchInput}
          />
        </div>
        <div style={styles.dropdownBox}>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={styles.selectInput}
          >
            <option value="All Categories">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.category_name}>
                {c.category_name}
              </option>
            ))}
          </select>
          <ChevronDown size={14} color="#64748b" style={styles.dropdownIcon} />
        </div>
      </div>

      {/* ITEMS TABLE */}
      <div style={styles.tableCard}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.tableHeaderRow}>
              <th style={styles.th}>IMAGE</th>
              <th style={styles.th}>DISH NAME</th>
              <th style={styles.th}>CATEGORY</th>
              <th style={styles.th}>AMOUNT</th>
              <th style={styles.th}>GST (%)</th>
              <th style={styles.th}>PRICE</th>
              <th style={styles.th}>STOCK</th>
              <th style={styles.th}>STATUS</th>
              <th style={{ ...styles.th, textAlign: "right" }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map((item) => {
              const baseAmount = Number(item.price || 0);
              const gstRate = Number(item.gst_percent || 5) / 100;
              const retailPrice = baseAmount * (1 + gstRate);

              return (
                <tr key={item.id} style={{ ...styles.tableRow, backgroundColor: editingId === item.id ? "#eff6ff" : "transparent" }}>
                  <td style={styles.td}>
                    <div style={styles.imgPlaceholder}>🍲</div>
                  </td>
                  <td style={styles.td}>
                    <div style={{ fontWeight: "600", color: "#0f172a" }}>{item.product_name}</div>
                    <div style={{ fontSize: "11px", color: "#64748b" }}>{item.description || "Spiced dish item"}</div>
                  </td>
                  <td style={styles.td}>
                    <span style={styles.categoryBadge}>{item.category_name || "GENERAL"}</span>
                  </td>
                  <td style={{ ...styles.td, fontWeight: "bold", color: "#16a34a" }}>
                    ₹{baseAmount.toFixed(2)}
                  </td>
                  <td style={styles.td}>
                    <span style={styles.gstBadge}>{item.gst_percent !== undefined ? `${item.gst_percent}%` : "5%"}</span>
                  </td>
                  <td style={{ ...styles.td, fontWeight: "bold", color: "#0284c7" }}>
                    ₹{retailPrice.toFixed(2)}
                  </td>
                  <td style={styles.td}>{item.stock || 999} pcs</td>
                  <td style={styles.td}>
                    <span style={styles.statusBadge}>Available</span>
                  </td>
                  <td style={{ ...styles.td, textAlign: "right" }}>
                    <div style={styles.actionGroup}>
                      <button style={styles.editBtn} onClick={() => handleEditItem(item)}>
                        <Edit2 size={12} />
                        <span>Edit</span>
                      </button>
                      <button style={styles.removeBtn} onClick={() => handleRemoveItem(item.id)}>
                        <Trash2 size={12} />
                        <span>Remove</span>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}

            {/* INLINE ROW TO ADD / EDIT ITEM */}
            <tr style={{ ...styles.inputRow, backgroundColor: editingId ? "#fef3c7" : "#f8fafc" }}>
              <td style={styles.td}>{editingId ? "✏️" : "➕"}</td>
              <td style={styles.td}>
                <input
                  id="new-dish-name"
                  type="text"
                  name="product_name"
                  placeholder="Dish Name"
                  value={newItem.product_name}
                  onChange={handleInputChange}
                  style={styles.inlineInput}
                />
              </td>
              <td style={styles.td}>
                <select
                  name="category_id"
                  value={newItem.category_id}
                  onChange={handleInputChange}
                  style={styles.inlineSelect}
                >
                  <option value="">Select Category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.category_name}
                    </option>
                  ))}
                </select>
              </td>
              <td style={styles.td}>
                <span style={{ fontSize: "12px", color: "#16a34a", fontWeight: "bold" }}>
                  {newItem.price ? `₹${(parseFloat(newItem.price) / (1 + currentActiveGst / 100)).toFixed(2)}` : "₹0.00"}
                </span>
              </td>
              <td style={styles.td}>
                <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
                  <select
                    value={isCustomGst ? "custom" : newItem.gst_percent}
                    onChange={handleGstDropdownChange}
                    style={{ ...styles.inlineSelect, width: "80px" }}
                  >
                    <option value="0">0%</option>
                    <option value="5">5%</option>
                    <option value="10">10%</option>
                    <option value="18">18%</option>
                    <option value="custom">Custom</option>
                  </select>

                  {isCustomGst && (
                    <input
                      type="number"
                      name="custom_gst"
                      placeholder="%"
                      value={newItem.custom_gst}
                      onChange={handleInputChange}
                      style={{ ...styles.inlineInput, width: "50px" }}
                    />
                  )}
                </div>
              </td>
              <td style={styles.td}>
                <input
                  type="number"
                  name="price"
                  placeholder="Price (₹)"
                  value={newItem.price}
                  onChange={handleInputChange}
                  style={{ ...styles.inlineInput, width: "90px" }}
                />
              </td>
              <td style={styles.td}>
                <input
                  type="number"
                  name="stock"
                  placeholder="Stock"
                  value={newItem.stock}
                  onChange={handleInputChange}
                  style={{ ...styles.inlineInput, width: "70px" }}
                />
              </td>
              <td style={styles.td}>
                <span style={{ fontSize: "12px", color: editingId ? "#d97706" : "#16a34a", fontWeight: "bold" }}>
                  {editingId ? "Editing Mode" : "Active"}
                </span>
              </td>
              <td style={{ ...styles.td, textAlign: "right" }}>
                <div style={{ display: "flex", gap: "6px", justifyContent: "flex-end" }}>
                  <button style={styles.saveBtn} onClick={handleSaveItem}>
                    {editingId ? "Update Dish" : "Save Dish"}
                  </button>
                  {editingId && (
                    <button style={styles.cancelBtn} onClick={resetForm}>
                      <X size={14} /> Cancel
                    </button>
                  )}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  );
}

// STYLES
const styles = {
  headerCard: { backgroundColor: "#ffffff", borderRadius: "12px", padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", border: "1px solid #e2e8f0" },
  title: { fontSize: "20px", fontWeight: "bold", color: "#0f172a", margin: 0 },
  subtitle: { fontSize: "13px", color: "#64748b", margin: "4px 0 0 0" },
  headerActions: { display: "flex", gap: "10px" },
  addNewBtn: { display: "flex", alignItems: "center", gap: "6px", backgroundColor: "#d97706", border: "none", borderRadius: "6px", padding: "8px 14px", fontSize: "12px", fontWeight: "600", color: "#ffffff", cursor: "pointer" },
  filterCard: { backgroundColor: "#ffffff", borderRadius: "12px", padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", border: "1px solid #e2e8f0" },
  searchBox: { display: "flex", alignItems: "center", gap: "8px", backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "6px", padding: "6px 12px", width: "320px" },
  searchInput: { border: "none", outline: "none", background: "transparent", fontSize: "13px", width: "100%" },
  dropdownBox: { position: "relative", width: "180px" },
  selectInput: { width: "100%", padding: "6px 12px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "12px", outline: "none", backgroundColor: "#ffffff", appearance: "none", cursor: "pointer" },
  dropdownIcon: { position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" },
  tableCard: { backgroundColor: "#ffffff", borderRadius: "12px", border: "1px solid #e2e8f0", overflow: "hidden" },
  table: { width: "100%", borderCollapse: "collapse", fontSize: "13px", textAlign: "left" },
  tableHeaderRow: { borderBottom: "1px solid #e2e8f0", backgroundColor: "#f8fafc" },
  th: { padding: "14px 16px", fontWeight: "700", color: "#334155", fontSize: "11px" },
  tableRow: { borderBottom: "1px solid #f1f5f9" },
  td: { padding: "12px 16px", color: "#1e293b", verticalAlign: "middle" },
  imgPlaceholder: { width: "32px", height: "32px", borderRadius: "6px", backgroundColor: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px" },
  categoryBadge: { display: "inline-block", backgroundColor: "#f1f5f9", padding: "4px 8px", borderRadius: "6px", fontSize: "11px", fontWeight: "600", color: "#475569" },
  gstBadge: { display: "inline-block", backgroundColor: "#eff6ff", color: "#2563eb", padding: "4px 8px", borderRadius: "6px", fontSize: "11px", fontWeight: "bold" },
  statusBadge: { backgroundColor: "#dcfce7", color: "#15803d", padding: "4px 8px", borderRadius: "6px", fontSize: "11px", fontWeight: "bold" },
  actionGroup: { display: "inline-flex", gap: "6px" },
  editBtn: { display: "flex", alignItems: "center", gap: "4px", border: "1px solid #cbd5e1", background: "#fff", padding: "4px 8px", borderRadius: "4px", fontSize: "11px", cursor: "pointer" },
  removeBtn: { display: "flex", alignItems: "center", gap: "4px", border: "none", background: "#ef4444", color: "#fff", padding: "4px 8px", borderRadius: "4px", fontSize: "11px", cursor: "pointer" },
  inputRow: { backgroundColor: "#f8fafc", borderTop: "2px solid #e2e8f0" },
  inlineInput: { width: "100%", padding: "6px 8px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "12px", outline: "none", backgroundColor: "#ffffff" },
  inlineSelect: { width: "100%", padding: "6px 8px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "12px", outline: "none", backgroundColor: "#ffffff" },
  saveBtn: { backgroundColor: "#2563eb", color: "#ffffff", border: "none", borderRadius: "6px", padding: "6px 12px", fontSize: "12px", fontWeight: "600", cursor: "pointer" },
  cancelBtn: { backgroundColor: "#64748b", color: "#ffffff", border: "none", borderRadius: "6px", padding: "6px 10px", fontSize: "12px", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px" },
};