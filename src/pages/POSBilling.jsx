import React, { useState, useEffect, useCallback } from "react";
import "../styles/POSBilling.css";
import { Bell } from "lucide-react";

const ProductImage = ({ src, name }) => {
  const [imageError, setImageError] = useState(false);

  if (!src || imageError) {
    return (
      <div
        style={{
          width: "100%",
          height: "90px",
          borderRadius: "6px",
          backgroundColor: "#f1f5f9",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "2rem",
          marginBottom: "8px",
        }}
      >
        🍲
      </div>
    );
  }

  return (
    <div
      style={{
        width: "100%",
        height: "90px",
        borderRadius: "6px",
        overflow: "hidden",
        backgroundColor: "#f1f5f9",
        marginBottom: "8px",
      }}
    >
      <img
        src={src}
        alt={name}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
        onError={() => setImageError(true)}
      />
    </div>
  );
};

export default function POSBilling({ openBillsList = [], setOpenBillsList, resumedBill = null, clearResumedBill }) {
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  // LIVE ACTIVE SESSION TRACKING FOR ADMIN DASHBOARD
  useEffect(() => {
    const cashierUsername = currentUser?.username || "cashier01";
    localStorage.setItem(`pos_active_session_${cashierUsername}`, "true");

    const handleUnload = () => {
      localStorage.removeItem(`pos_active_session_${cashierUsername}`);
    };
    window.addEventListener("beforeunload", handleUnload);

    return () => {
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, [currentUser]);

  // Dynamic States
  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [waitersList, setWaitersList] = useState([]);
  const [tablesList, setTablesList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All Items");
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState([]);

  // Live Date and Time State
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const [activeResumedBillId, setActiveResumedBillId] = useState(null);

  // KOT Counter & State
  const [kotCounter, setKotCounter] = useState(1);
  const [kotList, setKotList] = useState([]);

  // NOTIFICATION STATES FOR CASHIER BELL
  const [notifications, setNotifications] = useState([]);
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);

  const fetchNotifications = useCallback(() => {
    fetch("http://localhost:5000/api/notifications/Cashier")
      .then(res => res.json())
      .then(data => {
        if (data.success) setNotifications(data.data);
      })
      .catch(err => console.log("Cashier notification fetch error:", err));
  }, []);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const markNotificationRead = (id) => {
    fetch(`http://localhost:5000/api/notifications/read/${id}`, { method: "PUT" })
      .then(() => fetchNotifications());
  };

  const unreadCount = notifications.filter(n => n.is_read === 0).length;

  // PAYMENT MODAL STATES
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMode, setPaymentMode] = useState("CASH");
  const [paymentCashAmount, setPaymentCashAmount] = useState("");
  const [paymentUpiAmount, setPaymentUpiAmount] = useState("");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Table Selection View State
  const [showTableSelection, setShowTableSelection] = useState(false);
  const [selectedTable, setSelectedTable] = useState(null);

  // Customer State
  const [customerInfo, setCustomerInfo] = useState({ name: "Custom", phone: "", address: "" });

  // Vendor Payout States
  const [vendorName, setVendorName] = useState("");
  const [vendorPaymentMode, setVendorPaymentMode] = useState("Vendor");
  const [vendorSubOption, setVendorSubOption] = useState("CASH");
  const [vendorAdvanceType, setVendorAdvanceType] = useState("LOAN ISSUE"); 
  const [vendorCashAmount, setVendorCashAmount] = useState("");
  const [vendorSplitCash, setVendorSplitCash] = useState("");
  const [vendorSplitUpi, setVendorSplitUpi] = useState("");
  const [vendorNotes, setVendorNotes] = useState("");

  // Coupon State
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [couponCode, setCouponCode] = useState("");

  // Billing Adjustments
  const [discountPercent, setDiscountPercent] = useState("");
  const [parcelChargePerItem] = useState(5); 
  const [selectedWaiter, setSelectedWaiter] = useState("Unassigned");
  const [waiterTipAmount, setWaiterTipAmount] = useState(""); 
  const [isParcel, setIsParcel] = useState(false);

  // Modal Control States
  const [showDiscountModal, setShowDiscountModal] = useState(false);
  const [showWaiterModal, setShowWaiterModal] = useState(false);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [showVendorModal, setShowVendorModal] = useState(false);
  const [showKOTModal, setShowKOTModal] = useState(false);
  const [showTipModal, setShowTipModal] = useState(false);

  // CASHIER DROPDOWN & REPORT MODAL STATES
  const [showCashierDropdown, setShowCashierDropdown] = useState(false);
  const [showDailyReportModal, setShowDailyReportModal] = useState(false);

  // Dynamic Daily Report State
  const [liveReportMetrics, setLiveReportMetrics] = useState({
    totalBill: 0,
    cashRevenue: 0,
    upiRevenue: 0,
    partialRevenue: 0,
    vendorPayouts: 0,
    quickAmountNeeded: 0,
  });

  // Temp Modal Input States
  const [tempDiscount, setTempDiscount] = useState("");
  const [tempTipAmount, setTempTipAmount] = useState("");

  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch("http://localhost:5000/api/categories");
      const data = await res.json();
      if (data.success && data.data && data.data.length > 0) {
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
  }, []);

  const fetchMenuItems = useCallback(async () => {
    try {
      const res = await fetch("http://localhost:5000/api/items");
      const data = await res.json();
      if (data.success && data.data && data.data.length > 0) {
        const normalizedItems = data.data.map(item => ({
          ...item,
          category_name: (item.category_name || "VEG ITEMS").toUpperCase().trim()
        }));
        setMenuItems(normalizedItems);
      } else {
        setMenuItems([
          { id: 1, category_id: 1, category_name: "BREAKFAST", product_name: "Leg Soup (Single)", price: 110, gst_percent: 5 },
          { id: 2, category_id: 1, category_name: "BREAKFAST", product_name: "Plain Soup", price: 30, gst_percent: 5 },
          { id: 3, category_id: 1, category_name: "BREAKFAST", product_name: "Dosa 1", price: 20, gst_percent: 5 },
          { id: 4, category_id: 1, category_name: "BREAKFAST", product_name: "Idly 1", price: 20, gst_percent: 5 },
          { id: 5, category_id: 1, category_name: "BREAKFAST", product_name: "Mallige Idly 1", price: 25, gst_percent: 5 },
          { id: 6, category_id: 1, category_name: "BREAKFAST", product_name: "Egg Dosa", price: 50, gst_percent: 5 },
          { id: 7, category_id: 2, category_name: "LUNCH & DINNER", product_name: "Ragi Ball 1", price: 25, gst_percent: 5 },
          { id: 8, category_id: 2, category_name: "LUNCH & DINNER", product_name: "Parota", price: 25, gst_percent: 5 },
          { id: 9, category_id: 2, category_name: "LUNCH & DINNER", product_name: "Chapathi", price: 20, gst_percent: 5 },
          { id: 10, category_id: 2, category_name: "LUNCH & DINNER", product_name: "Rice (Half)", price: 30, gst_percent: 5 },
          { id: 11, category_id: 2, category_name: "LUNCH & DINNER", product_name: "Rice (Full)", price: 50, gst_percent: 5 },
          { id: 12, category_id: 3, category_name: "BIRIYANI ITEMS", product_name: "Mutton Biriyani", price: 240, gst_percent: 5 },
          { id: 13, category_id: 3, category_name: "BIRIYANI ITEMS", product_name: "Chicken Biriyani", price: 160, gst_percent: 5 },
          { id: 14, category_id: 3, category_name: "BIRIYANI ITEMS", product_name: "Egg Biriyani", price: 120, gst_percent: 5 },
          { id: 15, category_id: 3, category_name: "BIRIYANI ITEMS", product_name: "Kushka (Full) & Half", price: 90, gst_percent: 5 },
          { id: 16, category_id: 3, category_name: "BIRIYANI ITEMS", product_name: "Egg Rice", price: 90, gst_percent: 5 },
          { id: 17, category_id: 3, category_name: "BIRIYANI ITEMS", product_name: "Chicken Fried Rice", price: 140, gst_percent: 5 },
          { id: 18, category_id: 4, category_name: "BOTI ITEMS", product_name: "Boti Fry", price: 180, gst_percent: 5 },
          { id: 19, category_id: 4, category_name: "BOTI ITEMS", product_name: "Boti Dry", price: 180, gst_percent: 5 },
          { id: 20, category_id: 4, category_name: "BOTI ITEMS", product_name: "Boti Masala", price: 180, gst_percent: 5 },
          { id: 21, category_id: 4, category_name: "BOTI ITEMS", product_name: "Egg Boti Fry", price: 200, gst_percent: 5 },
          { id: 22, category_id: 5, category_name: "NALLI ITEMS", product_name: "Nalli Fry", price: 300, gst_percent: 5 },
          { id: 23, category_id: 5, category_name: "NALLI ITEMS", product_name: "Nalli Dry", price: 300, gst_percent: 5 },
          { id: 24, category_id: 5, category_name: "NALLI ITEMS", product_name: "Nalli Kurma", price: 300, gst_percent: 5 },
          { id: 25, category_id: 6, category_name: "HEAD MUTTON ITEMS", product_name: "Head Mutton Saaru", price: 190, gst_percent: 5 },
          { id: 26, category_id: 6, category_name: "HEAD MUTTON ITEMS", product_name: "Head Mutton Fry", price: 200, gst_percent: 5 },
          { id: 27, category_id: 6, category_name: "HEAD MUTTON ITEMS", product_name: "Head Mutton Dry", price: 200, gst_percent: 5 },
          { id: 28, category_id: 7, category_name: "MEALS", product_name: "Mutton Meals", price: 360, gst_percent: 5 },
          { id: 29, category_id: 7, category_name: "MEALS", product_name: "Chicken Meals", price: 270, gst_percent: 5 },
          { id: 30, category_id: 7, category_name: "MEALS", product_name: "Mutton Meals Combo", price: 280, gst_percent: 5 },
          { id: 31, category_id: 8, category_name: "BRAIN ITEMS", product_name: "Brain Fry", price: 160, gst_percent: 5 },
          { id: 32, category_id: 8, category_name: "BRAIN ITEMS", product_name: "Brain Dry", price: 160, gst_percent: 5 },
          { id: 33, category_id: 9, category_name: "MUTTON KAIMA ITEMS", product_name: "Mutton Kaima (Full)", price: 200, gst_percent: 5 },
          { id: 34, category_id: 9, category_name: "MUTTON KAIMA ITEMS", product_name: "Kaima Fry", price: 210, gst_percent: 5 },
          { id: 35, category_id: 9, category_name: "MUTTON KAIMA ITEMS", product_name: "Kaima Dry", price: 210, gst_percent: 5 },
          { id: 36, category_id: 9, category_name: "MUTTON KAIMA ITEMS", product_name: "Egg Kaima Fry", price: 230, gst_percent: 5 },
          { id: 37, category_id: 10, category_name: "CHICKEN ITEMS", product_name: "Chicken Kurma", price: 160, gst_percent: 5 },
          { id: 38, category_id: 10, category_name: "CHICKEN ITEMS", product_name: "Chicken Fry", price: 170, gst_percent: 5 },
          { id: 39, category_id: 10, category_name: "CHICKEN ITEMS", product_name: "Chicken Pepper Dry", price: 180, gst_percent: 5 },
          { id: 40, category_id: 10, category_name: "CHICKEN ITEMS", product_name: "Guntur Chicken", price: 180, gst_percent: 5 },
          { id: 41, category_id: 10, category_name: "CHICKEN ITEMS", product_name: "Guntur Chicken Dry", price: 180, gst_percent: 5 },
          { id: 42, category_id: 10, category_name: "CHICKEN ITEMS", product_name: "Andhra Style Chili Chicken", price: 170, gst_percent: 5 },
          { id: 43, category_id: 10, category_name: "CHICKEN ITEMS", product_name: "Lemon Chicken", price: 180, gst_percent: 5 },
          { id: 44, category_id: 10, category_name: "CHICKEN ITEMS", product_name: "Pudina Chicken", price: 180, gst_percent: 5 },
          { id: 45, category_id: 10, category_name: "CHICKEN ITEMS", product_name: "Chicken Kabab (Full)", price: 140, gst_percent: 5 },
          { id: 46, category_id: 10, category_name: "CHICKEN ITEMS", product_name: "Kalmi Kabab", price: 80, gst_percent: 5 },
          { id: 47, category_id: 10, category_name: "CHICKEN ITEMS", product_name: "Chicken Lollipop", price: 160, gst_percent: 5 },
          { id: 48, category_id: 10, category_name: "CHICKEN ITEMS", product_name: "Chicken Lollipop Chili", price: 170, gst_percent: 5 },
          { id: 49, category_id: 10, category_name: "CHICKEN ITEMS", product_name: "Chicken 65", price: 180, gst_percent: 5 },
          { id: 50, category_id: 10, category_name: "CHICKEN ITEMS", product_name: "Chicken Liver Fry", price: 120, gst_percent: 5 },
          { id: 51, category_id: 11, category_name: "MUTTON ITEMS", product_name: "Mutton Kurma", price: 250, gst_percent: 5 },
          { id: 52, category_id: 11, category_name: "MUTTON ITEMS", product_name: "Mutton Chops", price: 260, gst_percent: 5 },
          { id: 53, category_id: 11, category_name: "MUTTON ITEMS", product_name: "Mutton Fry", price: 260, gst_percent: 5 },
          { id: 54, category_id: 11, category_name: "MUTTON ITEMS", product_name: "Mutton Pepper Dry", price: 260, gst_percent: 5 },
          { id: 55, category_id: 11, category_name: "MUTTON ITEMS", product_name: "Mutton Guntur", price: 270, gst_percent: 5 },
          { id: 56, category_id: 11, category_name: "MUTTON ITEMS", product_name: "Mutton Guntur Dry", price: 270, gst_percent: 5 },
          { id: 57, category_id: 11, category_name: "MUTTON ITEMS", product_name: "Mutton Chilly", price: 270, gst_percent: 5 },
          { id: 58, category_id: 11, category_name: "MUTTON ITEMS", product_name: "Mutton Liver Fry", price: 180, gst_percent: 5 },
          { id: 59, category_id: 11, category_name: "MUTTON ITEMS", product_name: "Mutton Liver Pepper Dry", price: 180, gst_percent: 5 },
          { id: 60, category_id: 11, category_name: "MUTTON ITEMS", product_name: "Mutton Liver Masala", price: 180, gst_percent: 5 },
          { id: 61, category_id: 12, category_name: "NAATI KOLI SPECIAL", product_name: "Naati Koli Saaru", price: 180, gst_percent: 5 },
          { id: 62, category_id: 12, category_name: "NAATI KOLI SPECIAL", product_name: "Naati Koli Fry", price: 190, gst_percent: 5 },
          { id: 63, category_id: 12, category_name: "NAATI KOLI SPECIAL", product_name: "Naati Koli Dry", price: 190, gst_percent: 5 },
          { id: 64, category_id: 13, category_name: "BEVERAGES", product_name: "Water (MRP)", price: 20, gst_percent: 5 },
          { id: 65, category_id: 13, category_name: "BEVERAGES", product_name: "Cool Drinks", price: 40, gst_percent: 5 },
          { id: 66, category_id: 13, category_name: "BEVERAGES", product_name: "Goli Soda", price: 30, gst_percent: 5 },
          { id: 67, category_id: 14, category_name: "EGG ITEMS", product_name: "Egg Masala", price: 80, gst_percent: 5 },
          { id: 68, category_id: 14, category_name: "EGG ITEMS", product_name: "Egg Burji", price: 70, gst_percent: 5 },
          { id: 69, category_id: 14, category_name: "EGG ITEMS", product_name: "Egg Omlet", price: 60, gst_percent: 5 },
          { id: 70, category_id: 14, category_name: "EGG ITEMS", product_name: "Boiled Egg", price: 15, gst_percent: 5 },
          { id: 71, category_id: 15, category_name: "VEG ITEMS", product_name: "Veg Fried Rice", price: 100, gst_percent: 5 },
          { id: 72, category_id: 15, category_name: "VEG ITEMS", product_name: "Ghee Rice", price: 120, gst_percent: 5 },
          { id: 73, category_id: 15, category_name: "VEG ITEMS", product_name: "Jeera Rice", price: 100, gst_percent: 5 },
          { id: 74, category_id: 15, category_name: "VEG ITEMS", product_name: "Tomato Curry", price: 80, gst_percent: 5 },
          { id: 75, category_id: 15, category_name: "VEG ITEMS", product_name: "Dal Fry", price: 90, gst_percent: 5 },
          { id: 76, category_id: 16, category_name: "SUNDAY SPECIAL", product_name: "New Rajanna Special", price: 180, gst_percent: 5 },
          { id: 77, category_id: 16, category_name: "SUNDAY SPECIAL", product_name: "Boti Kaalu Goju", price: 200, gst_percent: 5 },
          { id: 78, category_id: 16, category_name: "SUNDAY SPECIAL", product_name: "Kaima Kaalu Goju", price: 220, gst_percent: 5 },
          { id: 79, category_id: 16, category_name: "SUNDAY SPECIAL", product_name: "Ottu Savige", price: 70, gst_percent: 5 },
          { id: 80, category_id: 16, category_name: "SUNDAY SPECIAL", product_name: "Neeru Dosa", price: 60, gst_percent: 5 },
          { id: 81, category_id: 16, category_name: "SUNDAY SPECIAL", product_name: "Naati Koli Biriyani", price: 200, gst_percent: 5 },
          { id: 82, category_id: 16, category_name: "SUNDAY SPECIAL", product_name: "Paalak Chicken", price: 180, gst_percent: 5 },
        ]);
      }
    } catch (err) {
      console.error("Error loading products:", err);
      setMenuItems([]);
    }
  }, []);

  const fetchTables = useCallback(async () => {
    try {
      const res = await fetch("http://localhost:5000/api/tables");
      const data = await res.json();
      if (data.success) {
        setTablesList(data.data);
      }
    } catch (err) {
      console.error("Error loading tables:", err);
    }
  }, []);

  const fetchWaitersList = useCallback(async () => {
    try {
      const res = await fetch("http://localhost:5000/api/waiters");
      const data = await res.json();
      if (data.success) setWaitersList(data.data);
    } catch (err) {
      console.error("Error loading waiters:", err);
    }
  }, []);

  const fetchOpenBills = useCallback(async () => {
    try {
      const res = await fetch("http://localhost:5000/api/open-bills");
      const data = await res.json();
      if (data.success && setOpenBillsList) {
        setOpenBillsList(data.data);
      }
    } catch (err) {
      console.error("Error fetching open bills:", err);
    }
  }, [setOpenBillsList]);

  const fetchKots = useCallback(async () => {
    try {
      const res = await fetch("http://localhost:5000/api/kots");
      const data = await res.json();
      if (data.success) {
        setKotList(data.data);
        if (data.data.length > 0) {
          const maxNo = Math.max(...data.data.map(k => parseInt(k.kot_no, 10) || 1));
          setKotCounter(maxNo + 1);
        }
      }
    } catch (err) {
      console.error("Error fetching KOTs:", err);
    }
  }, []);

  const fetchDailySummaryReport = async () => {
    try {
      const userId = currentUser.id || 1;
      const res = await fetch(`http://localhost:5000/api/reports/daily-summary?user_id=${userId}`);
      const data = await res.json();
      if (data.success) {
        setLiveReportMetrics(data.data);
      }
    } catch (err) {
      console.error("Error loading daily report metrics:", err);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchMenuItems();
    fetchTables();
    fetchWaitersList();
    fetchOpenBills();
    fetchKots();
  }, [fetchCategories, fetchMenuItems, fetchTables, fetchWaitersList, fetchOpenBills, fetchKots]);

  // Load resumed bill into Current Bill cart with corrected single-item unit price calculation
  useEffect(() => {
    const captainCartStorage = localStorage.getItem("pos_current_cart");
    const captainTableStorage = localStorage.getItem("pos_selected_table");

    let billToProcess = resumedBill || JSON.parse(localStorage.getItem("resumed_bill_data") || "null");

    if (!billToProcess && captainCartStorage) {
      try {
        const parsedCart = JSON.parse(captainCartStorage);
        if (parsedCart.length > 0) {
          billToProcess = {
            id: null,
            customer: "Captain Order",
            table: captainTableStorage || "None",
            items: parsedCart.map(i => ({
              id: i.id,
              product_name: i.product_name || i.name,
              price: Number(i.price) || 0,
              gst_percent: 5,
              qty: i.qty || i.quantity || 1
            }))
          };
        }
      } catch (e) {
        console.error("Error reading captain cart bridge:", e);
      }
    }

    if (billToProcess && billToProcess.items) {
      try {
        if (billToProcess.id) {
          setActiveResumedBillId(billToProcess.id);
        }

        const loadedCart = billToProcess.items.map((i, index) => {
          const rawName = i.name || i.product_name || "Item";
          const parts = rawName.split("x ");
          const qty = i.qty || i.quantity || (parts.length > 1 ? parseInt(parts[0], 10) : 1);
          const productName = parts.length > 1 ? parts[1] : rawName;
          
          const unitPrice = Number(i.price || 0);
          const itemTotal = Number(i.total || (unitPrice * qty) || 0);
          const finalPrice = unitPrice > 0 ? unitPrice : (qty > 0 ? itemTotal / qty : 0);

          return {
            id: i.id || index + 1,
            product_name: productName,
            price: finalPrice,
            gst_percent: i.gst_percent || 5,
            qty: qty,
            total: finalPrice * qty
          };
        });

        setCart(loadedCart);
        setCustomerInfo({ name: billToProcess.customer || "Custom", phone: "", address: "" });
        
        if (billToProcess.table && billToProcess.table !== "None" && billToProcess.table !== "N/A") {
          setSelectedTable({ table_code: billToProcess.table });
          setIsParcel(false);
        }
      } catch (e) {
        console.error("Error parsing resumed bill data:", e);
      }
      
      if (clearResumedBill) clearResumedBill();
      localStorage.removeItem("resumed_bill_data");
      localStorage.removeItem("pos_current_cart");
      localStorage.removeItem("pos_selected_table");
      localStorage.removeItem("pos_active_bill_id");
    }
  }, [resumedBill, clearResumedBill]);

  // Calculations
  const subtotal = cart.reduce((sum, item) => sum + item.total, 0);
  const totalQuantity = cart.reduce((sum, item) => sum + item.qty, 0);

  const numDiscount = Number(discountPercent) || 0;
  const totalParcelCharges = isParcel ? totalQuantity * parcelChargePerItem : 0;
  const tipAmount = Number(waiterTipAmount) || 0;

  const intermediateAmount = subtotal + totalParcelCharges;
  const discountAmount = (intermediateAmount * numDiscount) / 100;
  const taxableAmountBeforeTips = Math.max(0, intermediateAmount - discountAmount);
  const taxableAmount = taxableAmountBeforeTips + tipAmount;

  // Calculate dynamic total tax based on each item's specific gst_percent
  const taxAmount = cart.reduce((sum, item) => {
    const itemRatio = subtotal > 0 ? item.total / subtotal : 0;
    const itemTaxable = taxableAmount * itemRatio;
    const itemGstRate = (item.gst_percent !== undefined ? Number(item.gst_percent) : 5) / 100;
    return sum + (itemTaxable * itemGstRate);
  }, 0);

  // Apply Standard Round-Off: >= 0.50 rounds up, < 0.50 rounds down
  const rawNetTotal = taxableAmount + taxAmount;
  const netTotalDisplay = Math.round(rawNetTotal);

  const activeKOTCount = kotList.filter((k) => k.status === "Active").length;

  const handleOpenPaymentModal = useCallback(() => {
    if (cart.length === 0) {
      alert("Cart is empty!");
      return;
    }
    setPaymentMode("CASH");
    setPaymentCashAmount(netTotalDisplay.toFixed(2));
    setPaymentUpiAmount("0.00");
    setShowPaymentModal(true);
  }, [cart.length, netTotalDisplay]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "F2") {
        e.preventDefault();
        handleOpenPaymentModal();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleOpenPaymentModal]);

  const filteredItems = menuItems.filter((item) => {
    const targetCat = (selectedCategory || "").toUpperCase().trim();
    const itemCatName = (item.category_name || "").toUpperCase().trim();

    if (targetCat === "ALL ITEMS") return true;

    const matchingCategoryObj = categories.find(
      (c) => (c.category_name || "").toUpperCase().trim() === targetCat
    );

    const matchesCategory =
      itemCatName === targetCat ||
      (matchingCategoryObj && String(item.category_id) === String(matchingCategoryObj.id));

    const matchesSearch =
      !searchQuery ||
      (item.product_name &&
        item.product_name.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existing = prevCart.find((i) => i.id === product.id);
      if (existing) {
        return prevCart.map((i) =>
          i.id === product.id
            ? { ...i, qty: i.qty + 1, total: (i.qty + 1) * i.price }
            : i
        );
      }
      return [
        ...prevCart,
        {
          id: product.id,
          product_name: product.product_name,
          price: parseFloat(product.price),
          gst_percent: parseFloat(product.gst_percent) || 5,
          qty: 1,
          total: parseFloat(product.price),
        },
      ];
    });
  };

  const updateQty = (id, delta) => {
    setCart((prevCart) =>
      prevCart
        .map((item) => {
          if (item.id === id) {
            const newQty = item.qty + delta;
            if (newQty <= 0) return null;
            return { ...item, qty: newQty, total: newQty * item.price };
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const removeItem = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
    setDiscountPercent("");
    setWaiterTipAmount("");
    setSelectedWaiter("Unassigned");
    setIsParcel(false);
    setSelectedTable(null);
    setActiveResumedBillId(null);
    setCustomerInfo({ name: "Custom", phone: "", address: "" });
  };

  const autoSaveKOTToDB = async () => {
    if (cart.length === 0) return;
    const formattedKotNo = String(kotCounter).padStart(3, "0");
    const currentTableCode = isParcel ? "PARCEL" : (selectedTable ? selectedTable.table_code : "N/A");
    const payload = {
      kot_no: formattedKotNo,
      table_code: currentTableCode,
      customer_name: customerInfo.name,
      items: cart.map((item) => ({ id: item.id, name: item.product_name, qty: item.qty })),
    };

    try {
      const res = await fetch("http://localhost:5000/api/kots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        fetchKots();
        setKotCounter((prev) => prev + 1);
      }
    } catch (err) {
      console.error("Automatic KOT creation error:", err);
    }
  };

  const handleToggleParcel = async () => {
    const newParcelState = !isParcel;
    setIsParcel(newParcelState);

    if (newParcelState) {
      setSelectedTable(null);
      setShowTableSelection(false);
      setSelectedWaiter("Unassigned");
      setShowWaiterModal(false);
      setWaiterTipAmount("");
      setTempTipAmount("");
      setShowTipModal(false);

      if (cart.length > 0) {
        await autoSaveKOTToDB();
      }
    }
  };

  const handleSelectTable = (tbl) => {
    if (selectedTable && selectedTable.id === tbl.id) {
      setSelectedTable(null);
    } else {
      setSelectedTable(tbl);
      setIsParcel(false);
    }
    setShowTableSelection(false);
  };

  const handleSelectPaymentMode = (mode) => {
    setPaymentMode(mode);
    if (mode === "CASH") {
      setPaymentCashAmount(netTotalDisplay.toFixed(2));
      setPaymentUpiAmount("0.00");
    } else if (mode === "UPI") {
      setPaymentCashAmount("0.00");
      setPaymentUpiAmount(netTotalDisplay.toFixed(2));
    } else if (mode === "PARTIAL") {
      const half = (netTotalDisplay / 2).toFixed(2);
      setPaymentCashAmount(half);
      setPaymentUpiAmount((netTotalDisplay - parseFloat(half)).toFixed(2));
    }
  };

  const handleOpenBill = async () => {
    if (cart.length === 0) {
      alert("Cart is empty!");
      return;
    }

    const currentTableCode = isParcel ? "PARCEL" : (selectedTable ? selectedTable.table_code : null);

    const payload = {
      cashier_id: currentUser.id || 1,
      payment_type_id: 1,
      payment_status_id: 1, 
      table_code: currentTableCode,
      customer_name: customerInfo.name || "Custom",
      customer_phone: customerInfo.phone || null,
      waiter_name: isParcel ? null : selectedWaiter,
      waiter_tip: isParcel ? 0 : tipAmount,
      grandTotal: parseFloat(netTotalDisplay.toFixed(2)),
      discount_percentage: numDiscount,
      discount_amount: parseFloat(discountAmount.toFixed(2)),
      paymentMode: "CASH",
      cashAmount: 0,
      upiAmount: 0,
      sgst_amount: taxAmount / 2,
      cgst_amount: taxAmount / 2,
      cartItems: cart,
    };

    try {
      const res = await fetch("http://localhost:5000/api/payments/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        alert("Bill saved successfully and added to Open Bills!");
        clearCart();
        fetchOpenBills();
      } else {
        alert("Error saving open bill: " + data.message);
      }
    } catch (err) {
      console.error("Open bill error:", err);
      alert("Error connecting to server.");
    }
  };

  const triggerPrintReceipt = (currentCart, tableCode, custName, sub, tax, net, mode = "Cash", parcelActive = false) => {
    if (!currentCart || currentCart.length === 0) return;
    const gstVal = tax;
    const billNo = `HB-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`;
    const cashierName = currentUser.username || "cashier1";
    const resolvedTable = parcelActive ? "PARCEL" : (tableCode && tableCode !== "None" ? tableCode : "N/A");

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Bill Receipt</title>
          <style>
            body { font-family: 'Courier New', Courier, monospace; padding: 15px; color: #000; width: 300px; margin: 0 auto; font-size: 12px; }
            h2 { text-align: center; margin: 0 0 2px 0; font-size: 15px; letter-spacing: 1px; }
            .subtitle { text-align: center; font-size: 11px; margin: 0 0 4px 0; font-weight: bold; }
            .address, .info-line { text-align: center; font-size: 10px; margin: 2px 0; }
            .divider { border-top: 1px dashed #000; margin: 8px 0; }
            .details-table { width: 100%; font-size: 11px; margin-bottom: 4px; }
            .details-table td { padding: 1px 0; }
            .items-table { width: 100%; border-collapse: collapse; margin-top: 4px; font-size: 11px; }
            .items-table th { border-bottom: 1px dashed #000; padding: 4px 0; text-align: left; font-weight: bold; }
            .items-table td { padding: 4px 0; vertical-align: top; }
            .right { text-align: right; }
            .center { text-align: center; }
            .totals-section { margin-top: 6px; font-size: 11px; }
            .footer { text-align: center; font-size: 10px; margin-top: 12px; }
          </style>
        </head>
        <body>
          <h2>HOTEL ERP MANAGEMENT</h2>
          <div class="subtitle">FOOD & BEVERAGES</div>
          <div class="address">123, MG Road, Bengaluru - 560001</div>
          <div class="address">Ph: 9876543210 &nbsp; GSTIN: 29ABCDE1234F1Z5</div>
          <div class="divider"></div>
          <div style="text-align: center; font-weight: bold; font-size: 12px; margin-bottom: 6px;">BILL RECEIPT</div>
          
          <table class="details-table">
            <tr>
              <td><strong>Bill No</strong> : ${billNo}</td>
              <td><strong>Date</strong> : ${new Date().toLocaleDateString()}</td>
            </tr>
            <tr>
              <td><strong>Time</strong> : ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
              <td><strong>Table</strong> : ${resolvedTable}</td>
            </tr>
            <tr>
              <td colspan="2"><strong>Cashier</strong> : ${cashierName}</td>
            </tr>
            ${parcelActive ? `<tr><td colspan="2" style="color: #d97706; font-weight: bold;">Order Type : PARCEL</td></tr>` : ''}
          </table>

          <div class="divider"></div>

          <table class="items-table">
            <thead>
              <tr>
                <th>Item</th>
                <th class="center">Qty</th>
                <th class="right">Rate</th>
                <th class="right">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${currentCart.map(i => `
                <tr>
                  <td>${i.product_name}</td>
                  <td class="center">${i.qty}</td>
                  <td class="right">${Number(i.price).toFixed(2)}</td>
                  <td class="right">${Number(i.total).toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="divider"></div>

          <table class="details-table totals-section">
            <tr><td>Subtotal</td><td class="right">: ₹${sub.toFixed(2)}</td></tr>
            <tr><td>Discount</td><td class="right">: ₹0.00</td></tr>
            <tr><td>GST</td><td class="right">: ₹${gstVal.toFixed(2)}</td></tr>
            <tr><td><strong>GRAND TOTAL</strong></td><td class="right"><strong>: ₹${net.toFixed(2)}</strong></td></tr>
          </table>

          <div class="divider"></div>

          <table class="details-table">
            <tr><td>Payment Mode</td><td>: ${mode}</td></tr>
            <tr><td>Amount Paid</td><td>: ₹${net.toFixed(2)}</td></tr>
            <tr><td>Payment Status</td><td>: <span style="color: green; font-weight: bold;">Paid</span></td></tr>
          </table>

          <div class="divider"></div>

          <div class="footer">
            <div>Thank You! Visit Again.</div>
            <div style="margin-top: 8px;">*** All rights reserved ***</div>
          </div>

          <script>
            window.onload = function() {
              window.print();
              if (window.matchMedia) {
                const mediaQueryList = window.matchMedia('print');
                mediaQueryList.addListener(function(mql) {
                  if (!mql.matches) { window.close(); }
                });
              }
              window.onafterprint = function() { window.close(); };
              setTimeout(function() { window.close(); }, 1000);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleProcessPayment = async () => {
    const cashVal = paymentMode === "UPI" ? 0 : (parseFloat(paymentCashAmount) || 0);
    const upiVal = paymentMode === "CASH" ? 0 : (parseFloat(paymentUpiAmount) || 0);
    const totalPaid = cashVal + upiVal;

    if (Math.abs(totalPaid - netTotalDisplay) > 0.01) {
      alert(`Entered totals (₹${totalPaid.toFixed(2)}) must equal Net Total (₹${netTotalDisplay.toFixed(2)})`);
      return;
    }

    setIsProcessingPayment(true);

    const currentTableCode = isParcel ? "PARCEL" : (selectedTable ? selectedTable.table_code : "N/A");

    const kotPayload = {
      kot_no: String(kotCounter).padStart(3, "0"),
      table_code: currentTableCode,
      customer_name: customerInfo.name,
      items: cart.map((item) => ({ id: item.id, name: item.product_name, qty: item.qty })),
    };

    try {
      await fetch("http://localhost:5000/api/kots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(kotPayload),
      });
      fetchKots();
      setKotCounter((prev) => prev + 1);
    } catch (err) {
      console.error("KOT save error:", err);
    }

    let paymentTypeId = 1; 
    if (paymentMode === "UPI") paymentTypeId = 2; 
    if (paymentMode === "PARTIAL") paymentTypeId = 3; 

    const cartSnapshot = [...cart];
    const tableCodeSnapshot = currentTableCode;
    const customerNameSnapshot = customerInfo.name || "Custom";
    const subtotalSnapshot = subtotal;
    const taxAmountSnapshot = taxAmount;
    const netTotalSnapshot = netTotalDisplay;
    const paymentModeSnapshot = paymentMode;
    const parcelSnapshot = isParcel;

    try {
      if (activeResumedBillId) {
        const cleanId = activeResumedBillId.toString().replace(/[^0-9]/g, "");

        const res = await fetch(`http://localhost:5000/api/payments/status/${cleanId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            payment_status_id: 2, 
            payment_type_id: paymentTypeId,
            cash_amount: cashVal,
            upi_amount: upiVal,
            cashAmount: cashVal,
            upiAmount: upiVal,
            grandTotal: parseFloat(netTotalDisplay.toFixed(2)),
            discount_percentage: numDiscount,
            discount_amount: parseFloat(discountAmount.toFixed(2)),
            sgst_amount: taxAmount / 2,
            cgst_amount: taxAmount / 2,
            customer_name: customerInfo.name || "Custom",
            table_code: currentTableCode,
            paymentMode: paymentMode,
            cartItems: cart
          }),
        });

        const data = await res.json();
        if (data.success) {
          clearCart();
          setShowPaymentModal(false);
          fetchOpenBills();
          triggerPrintReceipt(cartSnapshot, tableCodeSnapshot, customerNameSnapshot, subtotalSnapshot, taxAmountSnapshot, netTotalSnapshot, paymentModeSnapshot, parcelSnapshot);
        } else {
          alert("Error updating bill: " + data.message);
        }
      } else {
        const paymentPayload = {
          cashier_id: currentUser.id || 1,
          payment_type_id: paymentTypeId,
          payment_status_id: 1, 
          table_code: currentTableCode,
          customer_name: customerInfo.name || "Custom",
          customer_phone: customerInfo.phone || null,
          waiter_name: isParcel ? null : selectedWaiter,
          waiter_tip: isParcel ? 0 : tipAmount,
          grandTotal: parseFloat(netTotalDisplay.toFixed(2)),
          discount_percentage: numDiscount,
          discount_amount: parseFloat(discountAmount.toFixed(2)),
          paymentMode: paymentMode,
          cashAmount: cashVal,
          upiAmount: upiVal,
          cash_amount: cashVal,
          upi_amount: upiVal,
          sgst_amount: taxAmount / 2,
          cgst_amount: taxAmount / 2,
          cartItems: cart,
        };

        const res = await fetch("http://localhost:5000/api/payments/process", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(paymentPayload),
        });

        const data = await res.json();
        if (data.success) {
          clearCart();
          setShowPaymentModal(false);
          fetchOpenBills();
          triggerPrintReceipt(cartSnapshot, tableCodeSnapshot, customerNameSnapshot, subtotalSnapshot, taxAmountSnapshot, netTotalSnapshot, paymentModeSnapshot, parcelSnapshot);
        } else {
          alert("Payment Error: " + (data.message || "Unable to save transaction."));
        }
      }
    } catch (err) {
      console.error("Payment error:", err);
      alert("Payment Error: Could not connect to the server.");
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handleAddVendorPayment = async () => {
    if (!vendorName.trim()) {
      alert("Please enter a valid name!");
      return;
    }

    const totalVal = parseFloat(vendorCashAmount) || 0;
    let cashVal = 0;
    let upiVal = 0;

    if (vendorSubOption === "CASH") {
      cashVal = totalVal;
    } else if (vendorSubOption === "UPI") {
      upiVal = totalVal;
    } else {
      cashVal = parseFloat(vendorSplitCash) || 0;
      upiVal = parseFloat(vendorSplitUpi) || 0;
    }

    const totalPaid = cashVal + upiVal;
    const balanceDue = vendorPaymentMode === "Vendor" ? Math.max(0, totalVal - totalPaid) : 0;

    if (totalVal <= 0) {
      alert("Please enter a valid amount!");
      return;
    }

    const prefixLabel = vendorPaymentMode === "Vendor" ? "VENDOR" : `EMPLOYEE (${vendorAdvanceType})`;
    const payload = {
      cashier_id: currentUser.id || null,
      vendor_name: `${prefixLabel} - [${vendorSubOption}] ${vendorName}`,
      payment_mode: vendorSubOption,
      cash_amount: cashVal,
      upi_amount: upiVal,
      total_amount: totalPaid,
      balance_due: balanceDue,
      notes: vendorNotes,
    };

    try {
      const res = await fetch("http://localhost:5000/api/vendor-payouts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success) {
        alert(`Successfully Recorded Expense of ₹${totalPaid.toFixed(2)}${vendorPaymentMode === "Vendor" ? ` (Balance Due: ₹${balanceDue.toFixed(2)})` : ""} for ${vendorName}!`);
        setVendorName("");
        setVendorCashAmount("");
        setVendorSplitCash("");
        setVendorSplitUpi("");
        setVendorNotes("");
        setShowVendorModal(false);
        fetchDailySummaryReport();
      } else {
        alert("Database error: " + data.message);
      }
    } catch (err) {
      console.error("Vendor payout error:", err);
      alert("Error connecting to server.");
    }
  };

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) {
      alert("Please enter a coupon code!");
      return;
    }
    alert(`Coupon code "${couponCode}" applied successfully!`);
    setCouponCode("");
    setShowCouponModal(false);
  };

  const handleGenerateKOT = async () => {
    if (cart.length === 0) {
      alert("Cart is empty!");
      return;
    }

    const currentTableCode = isParcel ? "PARCEL" : (selectedTable ? selectedTable.table_code : "N/A");

    const openBillPayload = {
      cashier_id: currentUser.id || 1,
      payment_type_id: 1,
      payment_status_id: 1, 
      table_code: currentTableCode,
      customer_name: customerInfo.name || "Custom",
      customer_phone: customerInfo.phone || null,
      waiter_name: selectedWaiter,
      waiter_tip: tipAmount,
      grandTotal: parseFloat(netTotalDisplay.toFixed(2)),
      discount_percentage: numDiscount,
      discount_amount: parseFloat(discountAmount.toFixed(2)),
      paymentMode: "CASH",
      cashAmount: 0,
      upiAmount: 0,
      sgst_amount: taxAmount / 2,
      cgst_amount: taxAmount / 2,
      cartItems: cart,
    };

    try {
      const openBillRes = await fetch("http://localhost:5000/api/payments/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(openBillPayload),
      });
      const openBillData = await openBillRes.json();

      if (!openBillData.success) {
        alert("Error saving bill to Open Bills: " + openBillData.message);
        return;
      }

      const formattedKotNo = String(kotCounter).padStart(3, "0");
      const kotPayload = {
        kot_no: formattedKotNo,
        table_code: currentTableCode,
        customer_name: customerInfo.name,
        items: cart.map((item) => ({ id: item.id, name: item.product_name, qty: item.qty })),
      };

      const res = await fetch("http://localhost:5000/api/kots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(kotPayload),
      });
      const data = await res.json();
      if (data.success) {
        alert(`KOT #${formattedKotNo} Generated, Saved to DB, & Stored in Open Bills!`);
        fetchKots();
        fetchOpenBills();
        setKotCounter((prev) => prev + 1);
        clearCart(); 
      } else {
        alert("Error saving KOT: " + data.message);
      }
    } catch (err) {
      console.error("KOT creation error:", err);
      alert("Error connecting to server.");
    }
  };

  const handleCancelKOT = async (kotId) => {
    try {
      const kotToCancel = kotList.find((kot) => String(kot.id) === String(kotId));
      if (!kotToCancel) {
        alert("KOT not found!");
        return;
      }

      const res = await fetch(`http://localhost:5000/api/kots/status/${kotId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Cancelled" }),
      });

      const data = await res.json();
      if (data.success) {
        let kotItems = kotToCancel.items;
        if (typeof kotItems === "string") {
          try { kotItems = JSON.parse(kotItems); } catch (e) { kotItems = []; }
        }
        if (!Array.isArray(kotItems)) kotItems = [];

        const cancelledCartItems = kotItems.map((kotItem, index) => {
          const itemId = kotItem.id;
          const menuItem = menuItems.find(
            (item) =>
              String(item.id) === String(itemId) ||
              String(item.product_name).trim().toLowerCase() === String(kotItem.name || "").trim().toLowerCase()
          );
          const quantity = Number(kotItem.qty) || 1;
          const price = menuItem ? Number(menuItem.price) || 0 : Number(kotItem.price) || 0;
          const gstPercent = menuItem ? Number(menuItem.gst_percent) || 5 : Number(kotItem.gst_percent) || 5;

          return {
            id: `cancelled-${kotId}-${itemId || index}`,
            product_name: menuItem?.product_name || kotItem.name || "Unknown Item",
            price: price,
            gst_percent: gstPercent,
            qty: quantity,
            total: price * quantity,
            isCancelledKot: true 
          };
        });

        setCart((prevCart) => {
          const updatedCart = [...prevCart];
          cancelledCartItems.forEach((newItem) => {
            const existingIndex = updatedCart.findIndex(
              (item) => String(item.product_name).trim().toLowerCase() === String(newItem.product_name).trim().toLowerCase()
            );
            if (existingIndex !== -1) {
              const existingItem = updatedCart[existingIndex];
              updatedCart[existingIndex] = {
                ...existingItem,
                qty: existingItem.qty + newItem.qty,
                total: (existingItem.qty + newItem.qty) * existingItem.price,
                isCancelledKot: true
              };
            } else {
              updatedCart.push(newItem);
            }
          });
          return updatedCart;
        });

        await fetchKots();
        setShowKOTModal(false); 
      } else {
        alert("Error cancelling KOT: " + (data.message || "Unknown error"));
      }
    } catch (err) {
      console.error("Error cancelling KOT:", err);
      alert("Error cancelling KOT. Please try again.");
    }
  };

  const handleCompleteKOT = async (kotId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/kots/status/${kotId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Completed" }),
      });
      const data = await res.json();
      if (data.success) {
        fetchKots();
      }
    } catch (err) {
      console.error("Error completing KOT:", err);
    }
  };

  const bottomBtnStyle = {
    padding: "8px 12px",
    backgroundColor: "#1e293b",
    color: "#fff",
    border: "1px solid #334155",
    borderRadius: "4px",
    fontSize: "0.8rem",
    fontWeight: "bold",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    whiteSpace: "nowrap",
    flexShrink: 0,
  };

  const cartQtyBtnStyle = {
    width: "20px",
    height: "20px",
    borderRadius: "4px",
    border: "1px solid #cbd5e1",
    backgroundColor: "#f8fafc",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const modalOverlayStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 100,
  };

  return (
    <div
      className="pos-app-wrapper"
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        width: "100%",
        overflow: "hidden",
        backgroundColor: "#f8fafc",
      }}
    >
      {/* TOP HEADER */}
      <header
        style={{
          height: "50px",
          flexShrink: 0,
          backgroundColor: "#0f172a",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 16px",
          borderBottom: "1px solid #1e293b",
          zIndex: 10,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <img 
            src="/assets/images/erp-logo.png" 
            alt="ERP Logo" 
            style={{ height: "35px", width: "35px", objectFit: "contain", borderRadius: "4px" }} 
          />
          <h2 style={{ margin: 0, fontSize: "1.1rem", fontWeight: "bold", color: "#38bdf8" }}>
            HOTEL ERP POS
          </h2>
        </div>

        <div style={{ position: "relative", width: "350px" }}>
          <input
            type="text"
            placeholder="🔍 Search item / Scan barcode..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: "100%",
              padding: "6px 12px",
              borderRadius: "4px",
              border: "1px solid #334155",
              backgroundColor: "#1e293b",
              color: "#fff",
              fontSize: "0.85rem",
              outline: "none",
            }}
          />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{ fontSize: "0.85rem", color: "#94a3b8", fontWeight: "500" }}>
            🕒 {currentDateTime.toLocaleDateString()} {currentDateTime.toLocaleTimeString()}
          </div>

          {/* Cashier Notification Bell Component */}
          <div style={{ position: "relative", display: "inline-block" }}>
            <button 
              onClick={() => setShowNotificationDropdown(!showNotificationDropdown)}
              style={{ background: "none", border: "none", color: "#fff", cursor: "pointer", position: "relative", padding: "6px", display: "flex", alignItems: "center" }}
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span style={{ position: "absolute", top: "-2px", right: "-2px", background: "#dc2626", color: "#fff", fontSize: "9px", padding: "2px 5px", borderRadius: "50%", fontWeight: "bold" }}>
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotificationDropdown && (
              <div style={{ position: "absolute", right: 0, top: "40px", width: "320px", background: "#fff", color: "#0f172a", borderRadius: "8px", boxShadow: "0 4px 15px rgba(0,0,0,0.2)", zIndex: 1000, padding: "12px", maxHeight: "400px", overflowY: "auto", textAlign: "left" }}>
                <h4 style={{ margin: "0 0 10px 0", fontSize: "14px", borderBottom: "1px solid #e2e8f0", paddingBottom: "6px" }}>Cashier Critical Alerts</h4>
                {notifications.length === 0 ? (
                  <p style={{ fontSize: "12px", color: "#64748b", textAlign: "center" }}>No alerts received</p>
                ) : (
                  notifications.map(n => (
                    <div 
                      key={n.id} 
                      onClick={() => markNotificationRead(n.id)}
                      style={{ padding: "10px", borderBottom: "1px solid #f1f5f9", backgroundColor: n.is_read === 0 ? "#fee2e2" : "#f8fafc", borderRadius: "6px", marginBottom: "6px", cursor: "pointer" }}
                    >
                      <div style={{ fontWeight: "bold", fontSize: "12px", color: n.is_read === 0 ? "#991b1b" : "#0f172a" }}>{n.title}</div>
                      <div style={{ fontSize: "11px", color: "#475569", marginTop: "2px" }}>{n.message}</div>
                      <div style={{ fontSize: "9px", color: "#94a3b8", marginTop: "4px", textAlign: "right" }}>{new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          <div style={{ position: "relative" }}>
            <button
              onClick={() => setShowCashierDropdown(!showCashierDropdown)}
              style={{
                background: "none",
                border: "none",
                color: "#94a3b8",
                fontSize: "0.85rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "4px",
                padding: "4px 8px",
                borderRadius: "4px",
              }}
            >
              👤 Cashier: <strong style={{ color: "#fff" }}>{currentUser.username || "cashier1"}</strong> ⌄
            </button>

            {showCashierDropdown && (
              <div
                style={{
                  position: "absolute",
                  top: "38px",
                  right: 0,
                  backgroundColor: "#fff",
                  border: "1px solid #cbd5e1",
                  borderRadius: "6px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                  width: "200px",
                  zIndex: 200,
                  overflow: "hidden",
                }}
              >
                <button
                  onClick={() => {
                    fetchDailySummaryReport();
                    setShowDailyReportModal(true);
                    setShowCashierDropdown(false);
                  }}
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    textAlign: "left",
                    background: "none",
                    border: "none",
                    fontSize: "0.85rem",
                    fontWeight: "bold",
                    color: "#0f172a",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  📊 Daily Summary Report
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* MIDDLE MAIN CONTENT */}
      <div
        className="pos-main-layout"
        style={{
          display: "grid",
          gridTemplateColumns: "180px 1fr 380px",
          flex: 1,
          overflow: "hidden",
        }}
      >
        {/* Left Categories Sidebar */}
        <aside
          style={{
            backgroundColor: "#ffffff",
            borderRight: "1px solid #e2e8f0",
            padding: "10px 8px 15px 8px",
            display: "flex",
            flexDirection: "column",
            height: "100%",
            boxSizing: "border-box",
            overflowY: "auto",
          }}
        >
          <h3 style={{ margin: "0 0 8px 4px", fontSize: "0.82rem", color: "#64748b", fontWeight: "bold" }}>
            📁 CATEGORIES
          </h3>

          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <button
              onClick={() => {
                setSelectedCategory("All Items");
                setShowTableSelection(false);
              }}
              className={`category-btn ${selectedCategory === "All Items" && !showTableSelection ? "active" : ""}`}
            >
              All Items
            </button>

            {categories.map((cat) => {
              const catNameUpper = (cat.category_name || "").toUpperCase().trim();
              const isSelected = selectedCategory.toUpperCase().trim() === catNameUpper && !showTableSelection;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.category_name);
                    setShowTableSelection(false);
                  }}
                  className={`category-btn ${isSelected ? "active" : ""}`}
                >
                  {cat.category_name}
                </button>
              );
            })}
          </div>
        </aside>

        {/* Center Main Workspace */}
        <main
          style={{
            padding: "16px",
            overflowY: "auto",
            height: "100%",
            boxSizing: "border-box",
            backgroundColor: "#e2e8f0",
          }}
        >
          {showTableSelection ? (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <h3 style={{ margin: 0, fontSize: "1.1rem", color: "#0f172a", fontWeight: "bold" }}>
                  TABLE SELECTION GRID
                </h3>
                {selectedTable && (
                  <button
                    onClick={() => { setSelectedTable(null); setShowTableSelection(false); }}
                    style={{ padding: "6px 12px", backgroundColor: "#ef4444", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "0.8rem", fontWeight: "bold" }}
                  >
                    Deselect Current Table ({selectedTable.table_code})
                  </button>
                )}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "16px" }}>
                {tablesList.map((tbl) => {
                  const isSelected = selectedTable && selectedTable.id === tbl.id;
                  return (
                    <div
                      key={tbl.id}
                      onClick={() => handleSelectTable(tbl)}
                      style={{
                        position: "relative",
                        border: isSelected ? "2px solid #0284c7" : "1px solid #cbd5e1",
                        borderRadius: "8px",
                        backgroundColor: isSelected ? "#e0f2fe" : "#fff",
                        padding: "16px 12px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        cursor: "pointer",
                      }}
                    >
                      {isSelected && <span style={{ position: "absolute", top: "8px", right: "8px", fontSize: "0.65rem", fontWeight: "bold", color: "#0284c7" }}>SELECTED</span>}
                      <div style={{ fontSize: "2.5rem", marginBottom: "8px" }}>🪑</div>
                      <div style={{ fontWeight: "bold", fontSize: "0.85rem", textAlign: "center" }}>{tbl.table_name || tbl.table_code}</div>
                      <div style={{ fontSize: "0.75rem", color: "#64748b" }}>Capacity: {tbl.capacity}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                <h3 style={{ margin: 0, fontSize: "1rem", color: "#0f172a" }}>📦 PRODUCTS ({filteredItems.length})</h3>
                <span style={{ fontSize: "0.85rem", color: "#64748b" }}>Category: <strong>{selectedCategory}</strong></span>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "12px" }}>
                {filteredItems.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => addToCart(item)}
                    style={{
                      cursor: "pointer",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      padding: "10px",
                      borderRadius: "8px",
                      border: "1px solid #cbd5e1",
                      backgroundColor: "#fff",
                    }}
                  >
                    <ProductImage src={item.image} name={item.product_name} />
                    <h4 style={{ margin: "4px 0", fontSize: "0.9rem", textAlign: "center", color: "#0f172a" }}>{item.product_name}</h4>
                    <p style={{ margin: 0, fontWeight: "bold", color: "#16a34a", fontSize: "0.9rem" }}>₹ {Number(item.price || 0).toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </main>

        {/* Right Bill Panel */}
        <aside style={{ backgroundColor: "#fff", borderLeft: "1px solid #e2e8f0", display: "flex", flexDirection: "column", height: "100%" }}>
          <div style={{ padding: "12px", borderBottom: "1px solid #e2e8f0", backgroundColor: "#f8fafc" }}>
            <h3 style={{ margin: 0, fontSize: "1rem", color: "#0f172a" }}>
              🛒 CURRENT BILL {isParcel && <span style={{ color: "#d97706", fontSize: "0.85rem" }}>(📦 PARCEL)</span>}
            </h3>
            <p style={{ margin: "4px 0 0 0", fontSize: "0.8rem", color: "#64748b" }}>
              🪑 Table: <strong>{isParcel ? "PARCEL" : (selectedTable ? selectedTable.table_code : "None")}</strong> | Customer: <strong>{customerInfo.name}</strong>
            </p>
            <p style={{ margin: "2px 0 0 0", fontSize: "0.75rem", color: "#64748b" }}>
              📅 {currentDateTime.toLocaleDateString()} {currentDateTime.toLocaleTimeString()}
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 30px", padding: "8px 12px", backgroundColor: "#f1f5f9", fontSize: "0.75rem", fontWeight: "bold" }}>
            <span>ITEM</span><span>QTY</span><span>PRICE</span><span>TOTAL</span><span></span>
          </div>

          <div style={{ flex: 1, maxHeight: "calc(100vh - 350px)", overflowY: "auto", padding: "8px 12px", scrollbarWidth: "thin", scrollbarColor: "#cbd5e1 #f8fafc" }}>
            {cart.length === 0 ? (
              <p style={{ textAlign: "center", color: "#94a3b8", marginTop: "30px", fontSize: "0.85rem" }}>Cart is empty</p>
            ) : (
              cart.map((item) => (
                <div key={item.id} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 30px", alignItems: "center", padding: "8px 0", borderBottom: "1px solid #f1f5f9", fontSize: "0.8rem" }}>
                  <div style={{ fontWeight: item.isCancelledKot ? "900" : "500", color: item.isCancelledKot ? "#b91c1c" : "#0f172a", fontSize: item.isCancelledKot ? "0.9rem" : "0.8rem" }}>
                    {item.product_name}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    <button onClick={() => updateQty(item.id, -1)} style={cartQtyBtnStyle}>-</button>
                    <span style={{ fontWeight: item.isCancelledKot ? "900" : "normal" }}>{item.qty}</span>
                    <button onClick={() => updateQty(item.id, 1)} style={cartQtyBtnStyle}>+</button>
                  </div>
                  <div>₹{Number(item.price || 0).toFixed(2)}</div>
                  <div style={{ fontWeight: item.isCancelledKot ? "900" : "bold" }}>₹{Number(item.total || 0).toFixed(2)}</div>
                  <button onClick={() => removeItem(item.id)} style={{ background: "none", border: "none", cursor: "pointer" }}>❌</button>
                </div>
              ))
            )}
          </div>

          <div style={{ padding: "12px", borderTop: "1px solid #e2e8f0", backgroundColor: "#f8fafc", fontSize: "0.8rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", margin: "3px 0" }}>
              <span>Subtotal</span><span>₹ {subtotal.toFixed(2)}</span>
            </div>

            {isParcel && (
              <div style={{ display: "flex", justifyContent: "space-between", color: "#d97706", margin: "3px 0" }}>
                <span>Parcel Charges ({totalQuantity} items)</span><span>+ ₹ {totalParcelCharges.toFixed(2)}</span>
              </div>
            )}

            {numDiscount > 0 && (
              <div style={{ display: "flex", justifyContent: "space-between", color: "#16a34a", margin: "3px 0" }}>
                <span>Discount ({numDiscount}%)</span><span>- ₹ {discountAmount.toFixed(2)}</span>
              </div>
            )}

            {tipAmount > 0 && (
              <div style={{ display: "flex", justifyContent: "space-between", color: "#8b5cf6", margin: "3px 0" }}>
                <span>Waiter Tip ({selectedWaiter})</span><span>+ ₹ {tipAmount.toFixed(2)}</span>
              </div>
            )}

            <div style={{ display: "flex", justifyContent: "space-between", margin: "3px 0", color: "#475569" }}>
              <span>GST</span><span>+ ₹ {taxAmount.toFixed(2)}</span>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "8px", paddingTop: "6px", borderTop: "2px solid #cbd5e1", fontSize: "1.1rem", fontWeight: "bold" }}>
              <span>NET TOTAL</span>
              <span style={{ color: "#16a34a" }}>₹ {netTotalDisplay.toFixed(2)}</span>
            </div>

            <div style={{ display: "flex", gap: "6px", marginTop: "10px" }}>
              <button
                onClick={handleOpenBill}
                style={{ flex: 1, padding: "10px 4px", backgroundColor: "#0284c7", color: "#fff", border: "none", borderRadius: "6px", fontWeight: "bold", cursor: "pointer", fontSize: "0.78rem" }}
              >
                📂 OPEN BILL
              </button>

              <button
                disabled={isParcel}
                onClick={handleGenerateKOT}
                style={{ 
                  flex: 1, 
                  padding: "10px 4px", 
                  backgroundColor: isParcel ? "#475569" : "#8b5cf6", 
                  color: "#fff", 
                  border: "none", 
                  borderRadius: "6px", 
                  fontWeight: "bold", 
                  cursor: isParcel ? "not-allowed" : "pointer", 
                  fontSize: "0.78rem",
                  opacity: isParcel ? 0.6 : 1
                }}
              >
                🍳 KOT {isParcel ? "(Auto)" : ""}
              </button>

              <button
                onClick={handleOpenPaymentModal}
                style={{ flex: 1.4, padding: "10px 4px", backgroundColor: "#d97706", color: "#fff", border: "none", borderRadius: "6px", fontWeight: "bold", cursor: "pointer", fontSize: "0.78rem" }}
              >
                💳 PAYMENT (F2)
              </button>
            </div>

            <div style={{ display: "flex", gap: "6px", marginTop: "8px" }}>
              <button
                onClick={() => triggerPrintReceipt(cart, selectedTable ? selectedTable.table_code : "None", customerInfo.name, subtotal, taxAmount, netTotalDisplay, paymentMode, isParcel)}
                style={{ flex: 1, padding: "8px", backgroundColor: "#475569", color: "#fff", border: "none", borderRadius: "6px", fontWeight: "bold", cursor: "pointer", fontSize: "0.78rem" }}
              >
                🖨️ PRINT
              </button>

              <button
                onClick={clearCart}
                style={{ flex: 1, padding: "8px", backgroundColor: "#64748b", color: "#fff", border: "none", borderRadius: "6px", fontWeight: "bold", cursor: "pointer", fontSize: "0.78rem" }}
              >
                ✖️ CLOSE
              </button>
            </div>
          </div>
        </aside>
      </div>

      {/* BOTTOM TASKBAR */}
      <footer
        style={{
          height: "50px",
          flexShrink: 0,
          backgroundColor: "#0f172a",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "0 12px",
          borderTop: "1px solid #334155",
          width: "100%",
          zIndex: 10,
          boxSizing: "border-box",
          overflowX: "auto",
        }}
      >
        <button
          style={{
            ...bottomBtnStyle,
            backgroundColor: isParcel ? "#d97706" : "#1e293b",
          }}
          onClick={handleToggleParcel}
        >
          📦 PARCEL {isParcel ? "(Active)" : ""}
        </button>

        <button 
          disabled={isParcel}
          style={{ 
            ...bottomBtnStyle, 
            backgroundColor: isParcel ? "#475569" : showTableSelection ? "#0284c7" : "#1e293b",
            opacity: isParcel ? 0.6 : 1,
            cursor: isParcel ? "not-allowed" : "pointer"
          }} 
          onClick={() => {
            if (isParcel) {
              alert("Table selection is disabled while Parcel mode is active.");
              return;
            }
            setShowTableSelection(!showTableSelection);
          }}
        >
          🪑 TABLE {selectedTable ? `(${selectedTable.table_code})` : ""}
        </button>

        <button
          style={{ ...bottomBtnStyle, backgroundColor: "#1e293b" }}
          onClick={() => setShowKOTModal(true)}
        >
          🍳 ACTIVE KOTs ({activeKOTCount})
        </button>

        <button style={{ ...bottomBtnStyle, backgroundColor: numDiscount > 0 ? "#16a34a" : "#1e293b" }} onClick={() => { setTempDiscount(discountPercent); setShowDiscountModal(true); }}>
          % DISCOUNT {numDiscount > 0 ? `(${numDiscount}%)` : ""}
        </button>

        <button
          disabled={isParcel}
          style={{
            ...bottomBtnStyle,
            backgroundColor: isParcel
              ? "#475569"
              : tipAmount > 0
              ? "#8b5cf6"
              : "#1e293b",
            opacity: isParcel ? 0.6 : 1,
            cursor: isParcel ? "not-allowed" : "pointer",
          }}
          onClick={() => {
            if (isParcel) return;
            setTempTipAmount(waiterTipAmount);
            setShowTipModal(true);
          }}
        >
          💵 TIP {isParcel ? "(Disabled)" : tipAmount > 0 ? `(₹${tipAmount})` : ""}
        </button>

        <button
          disabled={isParcel}
          style={{
            ...bottomBtnStyle,
            backgroundColor: isParcel ? "#475569" : "#1e293b",
            opacity: isParcel ? 0.6 : 1,
            cursor: isParcel ? "not-allowed" : "pointer",
          }}
          onClick={() => {
            if (isParcel) return;
            setShowWaiterModal(true);
          }}
        >
          🤵 WAITER ({isParcel ? "Disabled" : selectedWaiter})
        </button>

        <button style={bottomBtnStyle} onClick={() => setShowCustomerModal(true)}>
          👤 CUSTOMER ({customerInfo.name})
        </button>

        <button style={bottomBtnStyle} onClick={() => setShowVendorModal(true)}>
          🚚 VENDOR
        </button>

        <button style={bottomBtnStyle} onClick={() => setShowCouponModal(true)}>
          🎟️ COUPON
        </button>

        <button onClick={clearCart} style={{ ...bottomBtnStyle, backgroundColor: "#ef4444", color: "#fff", marginLeft: "auto" }}>
          🗑️ CLEAR CART
        </button>
      </footer>

      {/* DAILY SUMMARY REPORT MODAL */}
      {showDailyReportModal && (
        <div style={modalOverlayStyle}>
          <div
            style={{
              backgroundColor: "#f8fafc",
              border: "2px solid #0284c7",
              borderRadius: "12px",
              width: "420px",
              padding: "20px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
              color: "#0f172a",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            <div style={{ borderBottom: "2px solid #0f172a", paddingBottom: "6px" }}>
              <h3 style={{ margin: 0, fontSize: "1rem", color: "#0f172a", fontWeight: "bold" }}>
                DAILY SUMMARY REPORT - [{new Date().toLocaleDateString()}] ({currentUser.username || "cashier1"})
              </h3>
            </div>

            <div style={{ textAlign: "center", borderBottom: "1px dashed #cbd5e1", paddingBottom: "10px" }}>
              <div style={{ fontSize: "1.1rem", fontWeight: "bold", color: "#991b1b" }}>TOTAL BILL:</div>
              <div style={{ fontSize: "1.8rem", fontWeight: "bold", color: "#0f172a" }}>
                ₹ {liveReportMetrics.totalBill.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </div>
            </div>

            <div style={{ fontSize: "0.95rem", borderBottom: "1px dashed #cbd5e1", paddingBottom: "8px" }}>
              <div style={{ fontWeight: "bold", fontSize: "1.05rem", color: "#0f172a", marginBottom: "4px" }}>
                Revenue by MOP:
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", margin: "3px 0" }}>
                <span>• Cash:</span>
                <strong>₹ {liveReportMetrics.cashRevenue.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", margin: "3px 0" }}>
                <span>• UPI:</span>
                <strong>₹ {liveReportMetrics.upiRevenue.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", margin: "3px 0" }}>
                <span>• Partial:</span>
                <strong>₹ {liveReportMetrics.partialRevenue.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</strong>
              </div>
            </div>

            <div style={{ fontSize: "0.95rem", borderBottom: "1px dashed #cbd5e1", paddingBottom: "8px" }}>
              <div style={{ fontWeight: "bold", fontSize: "1.05rem", color: "#0f172a", marginBottom: "4px" }}>
                Expenses:
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", color: "#991b1b" }}>
                <span>• Vendor Payouts:</span>
                <strong>₹ {liveReportMetrics.vendorPayouts.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</strong>
              </div>
            </div>

            <div style={{ display: "flex", gap: "10px", marginTop: "6px" }}>
              <button
                onClick={() => alert("Printing Summary Report...")}
                style={{
                  flex: 1.5,
                  padding: "10px",
                  backgroundColor: "#0284c7",
                  color: "#fff",
                  border: "none",
                  borderRadius: "6px",
                  fontWeight: "bold",
                  fontSize: "0.85rem",
                  cursor: "pointer",
                }}
              >
                🖨️ PRINT REPORT
              </button>
              <button
                onClick={() => setShowDailyReportModal(false)}
                style={{
                  flex: 1,
                  padding: "10px",
                  backgroundColor: "#f1f5f9",
                  color: "#0f172a",
                  border: "1px solid #cbd5e1",
                  borderRadius: "6px",
                  fontWeight: "bold",
                  fontSize: "0.85rem",
                  cursor: "pointer",
                }}
              >
                CLOSE
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PAYMENT MODAL */}
      {showPaymentModal && (
        <div style={modalOverlayStyle}>
          <div style={{ background: "#fff", padding: "20px", borderRadius: "8px", width: "380px" }}>
            <h3>Complete Payment</h3>
            <p style={{ margin: "4px 0 12px 0", fontSize: "0.9rem", color: "#475569" }}>
              Net Total: <strong>₹ {netTotalDisplay.toFixed(2)}</strong>
            </p>

            <div style={{ display: "flex", gap: "6px", marginBottom: "12px" }}>
              {["CASH", "UPI", "PARTIAL"].map((mode) => (
                <button
                  key={mode}
                  onClick={() => handleSelectPaymentMode(mode)}
                  style={{
                    flex: 1,
                    padding: "8px",
                    fontWeight: "bold",
                    borderRadius: "4px",
                    border: paymentMode === mode ? "2px solid #0284c7" : "1px solid #cbd5e1",
                    backgroundColor: paymentMode === mode ? "#e0f2fe" : "#f8fafc",
                    color: paymentMode === mode ? "#0284c7" : "#0f172a",
                    cursor: "pointer",
                  }}
                >
                  {mode}
                </button>
              ))}
            </div>

            {paymentMode !== "UPI" && (
              <>
                <label style={{ fontSize: "0.8rem", fontWeight: "bold" }}>Cash Paid:</label>
                <input
                  type="number"
                  value={paymentCashAmount}
                  onChange={(e) => {
                    const cashVal = e.target.value;
                    setPaymentCashAmount(cashVal);
                    if (paymentMode === "PARTIAL") {
                      const cashNum = parseFloat(cashVal) || 0;
                      const remainingUpi = Math.max(0, netTotalDisplay - cashNum);
                      setPaymentUpiAmount(remainingUpi.toFixed(2));
                    }
                  }}
                  style={{ width: "100%", padding: "8px", marginTop: "4px", marginBottom: "8px", boxSizing: "border-box" }}
                />
              </>
            )}

            {paymentMode !== "CASH" && (
              <>
                <label style={{ fontSize: "0.8rem", fontWeight: "bold" }}>UPI Paid:</label>
                <input
                  type="number"
                  value={paymentUpiAmount}
                  onChange={(e) => {
                    const upiVal = e.target.value;
                    setPaymentUpiAmount(upiVal);
                    if (paymentMode === "PARTIAL") {
                      const upiNum = parseFloat(upiVal) || 0;
                      const remainingCash = Math.max(0, netTotalDisplay - upiNum);
                      setPaymentCashAmount(remainingCash.toFixed(2));
                    }
                  }}
                  style={{ width: "100%", padding: "8px", marginTop: "4px", marginBottom: "12px", boxSizing: "border-box" }}
                />
              </>
            )}

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
              <button onClick={() => setShowPaymentModal(false)} style={{ padding: "8px 12px" }}>Cancel</button>
              <button
                onClick={handleProcessPayment}
                disabled={isProcessingPayment}
                style={{ padding: "8px 16px", background: "#16a34a", color: "#fff", border: "none", fontWeight: "bold", borderRadius: "4px", cursor: "pointer" }}
              >
                {isProcessingPayment ? "Processing..." : "Confirm & Print Bill"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* OTHER MODALS */}
      {showDiscountModal && (
        <div style={modalOverlayStyle}>
          <div style={{ background: "#fff", padding: "20px", borderRadius: "8px", width: "300px" }}>
            <h3>Apply Discount (%)</h3>
            <input
              type="number"
              placeholder="e.g. 10"
              value={tempDiscount}
              onChange={(e) => setTempDiscount(e.target.value)}
              style={{ width: "100%", padding: "8px", marginTop: "10px", boxSizing: "border-box" }}
            />
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "15px" }}>
              <button onClick={() => setShowDiscountModal(false)} style={{ padding: "6px 12px" }}>Cancel</button>
              <button onClick={() => { setDiscountPercent(tempDiscount); setShowDiscountModal(false); }} style={{ padding: "6px 12px", background: "#16a34a", color: "#fff", border: "none" }}>Apply</button>
            </div>
          </div>
        </div>
      )}

      {showTipModal && !isParcel && (
        <div style={modalOverlayStyle}>
          <div style={{ background: "#fff", padding: "20px", borderRadius: "8px", width: "300px" }}>
            <h3>Waiter Tip (₹)</h3>
            <input
              type="number"
              placeholder="e.g. 50"
              value={tempTipAmount}
              onChange={(e) => setTempTipAmount(e.target.value)}
              style={{ width: "100%", padding: "8px", marginTop: "10px", boxSizing: "border-box" }}
            />
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "15px" }}>
              <button onClick={() => setShowTipModal(false)} style={{ padding: "6px 12px" }}>Cancel</button>
              <button
                onClick={() => {
                  if (isParcel) {
                    setWaiterTipAmount("");
                    setTempTipAmount("");
                    setShowTipModal(false);
                    return;
                  }
                  setWaiterTipAmount(tempTipAmount);
                  setShowTipModal(false);
                }}
                style={{ padding: "6px 12px", background: "#8b5cf6", color: "#fff", border: "none" }}
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

      {showCouponModal && (
        <div style={modalOverlayStyle}>
          <div style={{ background: "#fff", padding: "20px", borderRadius: "8px", width: "300px" }}>
            <h3>Apply Coupon Code</h3>
            <input
              type="text"
              placeholder="Enter coupon code"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              style={{ width: "100%", padding: "8px", marginTop: "10px", boxSizing: "border-box" }}
            />
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "15px" }}>
              <button onClick={() => setShowCouponModal(false)} style={{ padding: "6px 12px" }}>Cancel</button>
              <button onClick={handleApplyCoupon} style={{ padding: "6px 12px", background: "#0284c7", color: "#fff", border: "none" }}>Apply</button>
            </div>
          </div>
        </div>
      )}

      {showWaiterModal && !isParcel && (
        <div style={modalOverlayStyle}>
          <div style={{ background: "#fff", padding: "20px", borderRadius: "8px", width: "320px" }}>
            <h3>Select Waiter</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginTop: "10px", maxHeight: "200px", overflowY: "auto" }}>
              {waitersList.map((w) => (
                <button
                  key={w.id || w.waiter_name}
                  onClick={() => { setSelectedWaiter(w.waiter_name); setShowWaiterModal(false); }}
                  style={{ padding: "8px", textAlign: "left", background: "#f1f5f9", border: "1px solid #cbd5e1", borderRadius: "4px", cursor: "pointer" }}
                >
                  {w.waiter_name}
                </button>
              ))}
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "15px" }}>
              <button onClick={() => setShowWaiterModal(false)} style={{ padding: "6px 12px" }}>Close</button>
            </div>
          </div>
        </div>
      )}

      {showCustomerModal && (
        <div style={modalOverlayStyle}>
          <div style={{ background: "#fff", padding: "20px", borderRadius: "8px", width: "320px" }}>
            <h3>Customer Details</h3>
            <input
              type="text"
              placeholder="Customer Name"
              value={customerInfo.name}
              onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
              style={{ width: "100%", padding: "8px", marginTop: "10px", boxSizing: "border-box" }}
            />
            <input
              type="text"
              placeholder="Phone Number"
              value={customerInfo.phone}
              onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
              style={{ width: "100%", padding: "8px", marginTop: "8px", boxSizing: "border-box" }}
            />
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "15px" }}>
              <button onClick={() => setShowCustomerModal(false)} style={{ padding: "6px 12px" }}>Cancel</button>
              <button onClick={() => setShowCustomerModal(false)} style={{ padding: "6px 12px", background: "#0284c7", color: "#fff", border: "none" }}>Save</button>
            </div>
          </div>
        </div>
      )}

      {/* UNIVERSAL VENDOR & EMPLOYEE EXPENSE MODAL */}
      {showVendorModal && (
        <div style={modalOverlayStyle}>
          <div style={{ background: "#fff", padding: "20px", borderRadius: "8px", width: "380px", boxShadow: "0 10px 25px rgba(0,0,0,0.2)" }}>
            <h3 style={{ margin: "0 0 15px 0", fontSize: "1.1rem", color: "#0f172a" }}>
              {vendorPaymentMode === "Vendor" ? "ADD VENDOR EXPENSE" : "EMPLOYEE ADVANCE & SETTLEMENT"}
            </h3>
            
            <label style={{ fontSize: "0.75rem", fontWeight: "bold", color: "#64748b", display: "block", marginBottom: "4px" }}>PAYMENT METHOD</label>
            <select
              value={vendorPaymentMode}
              onChange={(e) => {
                const mode = e.target.value;
                setVendorPaymentMode(mode);
                setVendorSubOption("CASH");
                setVendorSplitCash(vendorCashAmount);
                setVendorSplitUpi("0");
              }}
              style={{ width: "100%", padding: "8px", marginBottom: "12px", borderRadius: "4px", border: "1px solid #cbd5e1", backgroundColor: "#fff", boxSizing: "border-box", fontSize: "0.9rem", fontWeight: "bold", color: "#0284c7" }}
            >
              <option value="Vendor">VENDOR</option>
              <option value="Employee">EMPLOYEE</option>
            </select>

            {vendorPaymentMode === "Employee" && (
              <>
                <label style={{ fontSize: "0.75rem", fontWeight: "bold", color: "#64748b", display: "block", marginBottom: "4px" }}>Advance Type</label>
                <div style={{ display: "flex", gap: "6px", marginBottom: "12px" }}>
                  {["LOAN ISSUE", "SALARY ADVANCE"].map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setVendorAdvanceType(opt)}
                      style={{
                        flex: 1,
                        padding: "6px 4px",
                        fontSize: "0.72rem",
                        fontWeight: "bold",
                        borderRadius: "4px",
                        border: vendorAdvanceType === opt ? "2px solid #16a34a" : "1px solid #cbd5e1",
                        backgroundColor: vendorAdvanceType === opt ? "#dcfce7" : "#f8fafc",
                        color: vendorAdvanceType === opt ? "#16a34a" : "#0f172a",
                        cursor: "pointer",
                      }}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </>
            )}

            <label style={{ fontSize: "0.75rem", fontWeight: "bold", color: "#64748b", display: "block", marginBottom: "4px" }}>
              Transaction Mode
            </label>
            <div style={{ display: "flex", gap: "6px", marginBottom: "12px" }}>
              {["CASH", "UPI", "PARTIAL"].map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => {
                    setVendorSubOption(opt);
                    const total = parseFloat(vendorCashAmount) || 0;
                    if (opt === "CASH") {
                      setVendorSplitCash(total.toString());
                      setVendorSplitUpi("0");
                    } else if (opt === "UPI") {
                      setVendorSplitCash("0");
                      setVendorSplitUpi(total.toString());
                    } else if (opt === "PARTIAL") {
                      const half = (total / 2).toFixed(2);
                      setVendorSplitCash(half);
                      setVendorSplitUpi((total - parseFloat(half)).toFixed(2));
                    }
                  }}
                  style={{
                    flex: 1,
                    padding: "6px 4px",
                    fontSize: "0.72rem",
                    fontWeight: "bold",
                    borderRadius: "4px",
                    border: vendorSubOption === opt ? "2px solid #0284c7" : "1px solid #cbd5e1",
                    backgroundColor: vendorSubOption === opt ? "#e0f2fe" : "#f8fafc",
                    color: vendorSubOption === opt ? "#0284c7" : "#0f172a",
                    cursor: "pointer",
                  }}
                >
                  {opt}
                </button>
              ))}
            </div>

            <label style={{ fontSize: "0.75rem", fontWeight: "bold", color: "#64748b", display: "block", marginBottom: "4px" }}>
              {vendorPaymentMode === "Vendor" ? "Vendor Name" : "Employee Name"}
            </label>
            <input
              type="text"
              placeholder={vendorPaymentMode === "Vendor" ? "Enter vendor name" : "Enter employee name"}
              value={vendorName}
              onChange={(e) => setVendorName(e.target.value)}
              style={{ width: "100%", padding: "8px", marginBottom: "12px", borderRadius: "4px", border: "1px solid #cbd5e1", boxSizing: "border-box", fontSize: "0.9rem" }}
            />

            <label style={{ fontSize: "0.75rem", fontWeight: "bold", color: "#64748b", display: "block", marginBottom: "4px" }}>Total Amount (₹)</label>
            <input
              type="number"
              placeholder="0.00"
              value={vendorCashAmount}
              onChange={(e) => {
                const val = e.target.value;
                setVendorCashAmount(val);
                const total = parseFloat(val) || 0;
                if (vendorSubOption === "CASH") {
                  setVendorSplitCash(val);
                  setVendorSplitUpi("0");
                } else if (vendorSubOption === "UPI") {
                  setVendorSplitCash("0");
                  setVendorSplitUpi(val);
                } else if (vendorSubOption === "PARTIAL") {
                  const half = (total / 2).toFixed(2);
                  setVendorSplitCash(half);
                  setVendorSplitUpi((total - parseFloat(half)).toFixed(2));
                }
              }}
              style={{ width: "100%", padding: "8px", marginBottom: "12px", borderRadius: "4px", border: "1px solid #cbd5e1", boxSizing: "border-box", fontSize: "0.9rem" }}
            />

            {vendorSubOption === "PARTIAL" && (
              <div style={{ display: "flex", gap: "8px", marginBottom: "12px", backgroundColor: "#f1f5f9", padding: "8px", borderRadius: "6px" }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: "0.7rem", fontWeight: "bold", color: "#475569" }}>Cash Paid:</label>
                  <input
                    type="number"
                    value={vendorSplitCash}
                    onChange={(e) => {
                      const cashVal = e.target.value;
                      setVendorSplitCash(cashVal);
                      const total = parseFloat(vendorCashAmount) || 0;
                      const cash = parseFloat(cashVal) || 0;
                      setVendorSplitUpi(Math.max(0, total - cash).toFixed(2));
                    }}
                    style={{ width: "100%", padding: "6px", boxSizing: "border-box", fontSize: "0.85rem", marginTop: "2px" }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: "0.7rem", fontWeight: "bold", color: "#475569" }}>UPI Paid:</label>
                  <input
                    type="number"
                    value={vendorSplitUpi}
                    onChange={(e) => {
                      const upiVal = e.target.value;
                      setVendorSplitUpi(upiVal);
                      const total = parseFloat(vendorCashAmount) || 0;
                      const upi = parseFloat(upiVal) || 0;
                      setVendorSplitCash(Math.max(0, total - upi).toFixed(2));
                    }}
                    style={{ width: "100%", padding: "6px", boxSizing: "border-box", fontSize: "0.85rem", marginTop: "2px" }}
                  />
                </div>
              </div>
            )}

            {vendorPaymentMode === "Vendor" && (
              <div style={{ marginBottom: "12px", padding: "8px", backgroundColor: "#fef3c7", borderRadius: "4px", border: "1px solid #f59e0b", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "0.78rem", fontWeight: "bold", color: "#92400e" }}>Balance Due (Credit):</span>
                <strong style={{ color: "#b45309", fontSize: "0.9rem" }}>
                  ₹ {Math.max(0, (parseFloat(vendorCashAmount) || 0) - ((parseFloat(vendorSplitCash) || 0) + (parseFloat(vendorSplitUpi) || 0))).toFixed(2)}
                </strong>
              </div>
            )}

            <label style={{ fontSize: "0.75rem", fontWeight: "bold", color: "#64748b", display: "block", marginBottom: "4px" }}>Description / Notes</label>
            <textarea
              placeholder="Enter notes or description..."
              value={vendorNotes}
              onChange={(e) => setVendorNotes(e.target.value)}
              style={{ width: "100%", padding: "8px", marginBottom: "16px", borderRadius: "4px", border: "1px solid #cbd5e1", boxSizing: "border-box", fontSize: "0.85rem", height: "60px", resize: "none" }}
            />

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
              <button 
                type="button"
                onClick={() => setShowVendorModal(false)} 
                style={{ padding: "8px 14px", background: "#f1f5f9", border: "1px solid #cbd5e1", borderRadius: "4px", cursor: "pointer", fontWeight: "bold", color: "#0f172a", fontSize: "0.8rem" }}
              >
                Cancel
              </button>
              <button 
                type="button"
                onClick={handleAddVendorPayment} 
                style={{ padding: "8px 16px", background: "#d97706", color: "#fff", border: "none", borderRadius: "4px", fontWeight: "bold", cursor: "pointer", fontSize: "0.8rem" }}
              >
                Save & Sync
              </button>
            </div>
          </div>
        </div>
      )}

      {showKOTModal && (
        <div style={modalOverlayStyle}>
          <div style={{ background: "#fff", padding: "20px", borderRadius: "8px", width: "480px", maxHeight: "80vh", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <button onClick={() => setShowKOTModal(false)} style={{ background: "none", border: "none", fontSize: "1.1rem", fontWeight: "bold", cursor: "pointer", color: "#64748b" }}>✕</button>
              <h3 style={{ margin: 0 }}>Active KOTs</h3>
              <div style={{ width: "20px" }}></div>
            </div>
            {kotList.length === 0 ? (
              <p style={{ color: "#94a3b8", textAlign: "center", margin: "20px 0" }}>No active KOTs found</p>
            ) : (
              kotList.map((kot) => (
                <div key={kot.id} style={{ border: "1px solid #cbd5e1", borderRadius: "6px", padding: "10px", marginTop: "10px", backgroundColor: kot.status === "Cancelled" ? "#fee2e2" : kot.status === "Completed" ? "#dcfce7" : "#fff" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold" }}>
                    <span>KOT #{kot.kotNo} ({kot.table || "N/A"}) - <span style={{ color: kot.status === "Active" ? "#2563eb" : kot.status === "Completed" ? "#16a34a" : "#dc2626" }}>{kot.status}</span></span>
                    <span>{kot.dateStr ? `${kot.dateStr} ` : ''}{kot.time}</span>
                  </div>
                  <div style={{ fontSize: "0.85rem", color: "#475569", marginTop: "4px" }}>
                    {kot.items.map((it, idx) => (
                      <div key={idx}>• {it.name} (x{it.qty})</div>
                    ))}
                  </div>
                  {kot.status === "Active" && (
                    <div style={{ display: "flex", gap: "8px", marginTop: "8px", justifyContent: "flex-end" }}>
                      <button onClick={() => handleCancelKOT(kot.id)} style={{ padding: "4px 8px", backgroundColor: "#ef4444", color: "#fff", border: "none", borderRadius: "4px", fontSize: "0.75rem", cursor: "pointer" }}>Cancel KOT</button>
                      <button onClick={() => handleCompleteKOT(kot.id)} style={{ padding: "4px 8px", backgroundColor: "#16a34a", color: "#fff", border: "none", borderRadius: "4px", fontSize: "0.75rem", cursor: "pointer" }}>Complete KOT</button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}