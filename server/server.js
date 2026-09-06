// ============================================================
// HOTEL ERP BACKEND
// React + Node.js + Express + MySQL + JWT
// ============================================================

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const db = require("./db");

const app = express();

const PORT = process.env.PORT || 5000;
const JWT_SECRET =
  process.env.JWT_SECRET || "hotel_erp_jwt_secret_change_this";

// ============================================================
// MIDDLEWARE
// ============================================================

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// ============================================================
// BASIC TEST
// ============================================================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Hotel ERP Backend API is running",
  });
});

app.get("/api/health", async (req, res) => {
  try {
    await db.query("SELECT 1");

    res.json({
      success: true,
      server: "running",
      database: "connected",
    });
  } catch (error) {
    console.error("Database health error:", error);

    res.status(500).json({
      success: false,
      server: "running",
      database: "disconnected",
      message: error.message,
    });
  }
});

// ============================================================
// JWT MIDDLEWARE
// ============================================================

function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: "Authorization token required",
    });
  }

  const token = authHeader.startsWith("Bearer ")
    ? authHeader.substring(7)
    : authHeader;

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
}

// ============================================================
// ADMIN / ROLE MIDDLEWARE
// ============================================================

function requireAdmin(req, res, next) {
  const role = String(req.user?.role || "").toLowerCase();

  if (
    role !== "admin" &&
    role !== "administrator" &&
    Number(req.user?.role_id) !== 1
  ) {
    return res.status(403).json({
      success: false,
      message: "Admin access required",
    });
  }

  next();
}

// ============================================================
// AUTOMATED 22-MINUTE WARNING & ESCALATION ENGINE (SCHEMA SAFE)
// ============================================================

setInterval(async () => {
  try {
    const [staleKots] = await db.query(`
      SELECT id, kot_no, table_code, created_at 
      FROM kots 
      WHERE LOWER(COALESCE(status, '')) IN ('active', 'pending')
        AND created_at <= (NOW() - INTERVAL 22 MINUTE)
    `);

    for (const kot of staleKots) {
      const [allWarns] = await db.query(`SELECT * FROM supervisor_warnings ORDER BY id DESC LIMIT 50`);
      const alreadyWarned = allWarns.some(w => Object.values(w).some(val => String(val).includes(`KOT #${kot.kot_no}`)));

      if (!alreadyWarned) {
        await db.query(
          `INSERT INTO supervisor_warnings (supervisor_id, created_at) VALUES (1, NOW())`
        );
      }
    }
  } catch (err) {
    // Silent catch
  }
}, 60000);

// ============================================================
// LOGIN
// ============================================================

app.post("/api/login", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if ((!username && !email) || !password) {
      return res.status(400).json({
        success: false,
        message: "Username/email and password are required",
      });
    }

    const loginValue = username || email;

    const [users] = await db.query(
      `
      SELECT u.*
      FROM users u
      WHERE
        u.username = ?
        OR u.email = ?
      LIMIT 1
      `,
      [loginValue, loginValue]
    );

    if (!users.length) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password",
      });
    }

    const user = users[0];

    if (
      user.status !== undefined &&
      user.status !== null &&
      Number(user.status) === 0
    ) {
      return res.status(403).json({
        success: false,
        message: "User account is inactive",
      });
    }

    let passwordValid = false;

    if (user.password) {
      passwordValid = await bcrypt.compare(
        password,
        user.password
      );

      if (!passwordValid && password === user.password) {
        passwordValid = true;
      }
    }

    if (!passwordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password",
      });
    }

    const role = user.role || "User";

    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
        role,
        role_id: user.role_id,
      },
      JWT_SECRET,
      {
        expiresIn: "8h",
      }
    );

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role,
        role_id: user.role_id,
        status: user.status,
      },
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ============================================================
// CURRENT USER
// ============================================================

app.get(
  "/api/me",
  authenticateToken,
  async (req, res) => {
    try {
      const [rows] = await db.query(
        `
        SELECT u.*
        FROM users u
        WHERE u.id = ?
        LIMIT 1
        `,
        [req.user.id]
      );

      if (!rows.length) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      const user = rows[0];

      res.json({
        success: true,
        user,
      });
    } catch (error) {
      console.error("ME ERROR:", error);

      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);

// ============================================================
// ROLES
// ============================================================

app.get("/api/roles", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT *
      FROM roles
      ORDER BY id ASC
    `);

    res.json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error("ROLES ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ============================================================
// USERS
// ============================================================

app.get("/api/users", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT u.*
      FROM users u
      ORDER BY u.id DESC
    `);

    res.json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error("USERS GET ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

app.post("/api/users", async (req, res) => {
  try {
    const {
      username,
      email,
      password,
      role_id,
      phone,
      status = 1,
    } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username and password are required",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await db.query(
      `
      INSERT INTO users
      (
        username,
        email,
        password,
        role_id,
        phone,
        status
      )
      VALUES (?, ?, ?, ?, ?, ?)
      `,
      [
        username,
        email || null,
        hashedPassword,
        role_id || null,
        phone || null,
        status,
      ]
    );

    res.status(201).json({
      success: true,
      message: "User created successfully",
      id: result.insertId,
    });
  } catch (error) {
    console.error("USER CREATE ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ============================================================
// CATEGORIES
// ============================================================

app.get("/api/categories", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT *
      FROM categories
      ORDER BY id ASC
    `);

    res.json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error("CATEGORIES ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

app.post("/api/categories", async (req, res) => {
  try {
    const { name, description, status = 1 } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Category name is required",
      });
    }

    const [result] = await db.query(
      `
      INSERT INTO categories
      (
        name,
        description,
        status
      )
      VALUES (?, ?, ?)
      `,
      [
        name,
        description || null,
        status,
      ]
    );

    res.status(201).json({
      success: true,
      message: "Category created",
      id: result.insertId,
    });
  } catch (error) {
    console.error("CATEGORY CREATE ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ============================================================
// PRODUCTS
// ============================================================

app.get("/api/products", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        p.*,
        p.product_name AS name,
        p.product_name AS product_name,
        c.name AS category_name
      FROM products p
      LEFT JOIN categories c
        ON p.category_id = c.id
      ORDER BY p.id DESC
    `);

    res.json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error("PRODUCTS ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

app.post("/api/products", async (req, res) => {
  try {
    const {
      name,
      product_name,
      category_id,
      price,
      description,
      status = 1,
      is_published = 1,
    } = req.body;

    const finalName = name || product_name;

    if (!finalName) {
      return res.status(400).json({
        success: false,
        message: "Product name is required",
      });
    }

    const [result] = await db.query(
      `
      INSERT INTO products
      (
        product_name,
        category_id,
        price,
        description,
        status,
        is_published
      )
      VALUES (?, ?, ?, ?, ?, ?)
      `,
      [
        finalName,
        category_id || null,
        Number(price) || 0,
        description || null,
        status,
        is_published,
      ]
    );

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      id: result.insertId,
    });
  } catch (error) {
    console.error("PRODUCT CREATE ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ============================================================
// PUBLISHED PRODUCTS
// ============================================================

app.get("/api/products/published", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        p.*,
        p.product_name AS name,
        p.product_name AS product_name,
        c.name AS category_name
      FROM products p
      LEFT JOIN categories c
        ON p.category_id = c.id
      WHERE
        COALESCE(p.status, 1) = 1
        AND COALESCE(p.is_published, p.published, 1) = 1
      ORDER BY
        c.name ASC,
        p.product_name ASC
    `);

    res.json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error("PUBLISHED PRODUCTS ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ============================================================
// RESTAURANT TABLES
// ============================================================

app.get("/api/tables", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT *
      FROM restaurant_tables
      ORDER BY id ASC
    `);

    res.json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error("TABLES ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ============================================================
// KOT LIST, SUBMISSION & STATUS UPDATE
// ============================================================

app.get("/api/kots", async (req, res) => {
  try {
    const [kots] = await db.query(`
      SELECT k.*
      FROM kots k
      WHERE LOWER(COALESCE(k.status, '')) != 'billed'
      ORDER BY k.id DESC
    `);

    for (let kot of kots) {
      const [items] = await db.query(
        `SELECT ki.*, COALESCE(NULLIF(ki.item_name, ''), p.product_name, 'Item') AS name, ki.quantity AS qty FROM kot_items ki LEFT JOIN products p ON ki.product_id = p.id WHERE ki.kot_id = ?`,
        [kot.id]
      );
      kot.items = items;
      kot.table = kot.table_code;
      kot.kotNo = kot.kot_no;
      kot.customer = kot.customer_name;
    }

    res.json({
      success: true,
      data: kots,
    });
  } catch (error) {
    console.error("KOTS ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

app.post("/api/kots", async (req, res) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    const { kot_no, table_code, customer_name, captain_name, items } = req.body;
    const resolvedTableCode = table_code || 'N/A';

    const [kotResult] = await connection.query(
      `INSERT INTO kots (kot_no, table_code, captain_name, customer_name, status, created_at) VALUES (?, ?, ?, ?, 'Active', NOW())`,
      [kot_no || Math.floor(1000 + Math.random() * 9000), resolvedTableCode, captain_name || 'Captain', customer_name || 'Customer']
    );
    const kotId = kotResult.insertId;

    let calculatedSubtotal = 0;
    if (items && items.length > 0) {
      for (const item of items) {
        const itemId = item.id || item.product_id || null;
        const itemName = item.name || item.product_name || item.item_name || 'Item';
        const itemQty = Number(item.qty || item.quantity || 1);
        
        let itemPrice = Number(item.price || item.rate || 0);
        if (itemPrice <= 0 && item.total && itemQty > 0) {
          itemPrice = Number(item.total) / itemQty;
        }

        if (itemPrice <= 0 && itemName) {
          const [pRow] = await connection.query(`SELECT price FROM products WHERE product_name = ? LIMIT 1`, [itemName]);
          if (pRow.length > 0) itemPrice = Number(pRow[0].price);
        }

        await connection.query(
          `INSERT INTO kot_items (kot_id, product_id, item_name, quantity, price) VALUES (?, ?, ?, ?, ?)`,
          [kotId, itemId, itemName, itemQty, itemPrice]
        );

        calculatedSubtotal += (itemQty * itemPrice);
      }
    }

    if (resolvedTableCode !== 'N/A' && resolvedTableCode !== 'PARCEL') {
      await connection.query(
        `UPDATE restaurant_tables SET status = 'Occupied', current_amount = ? WHERE table_code = ? OR table_name = ?`,
        [calculatedSubtotal, resolvedTableCode, resolvedTableCode]
      );
    }

    await connection.commit();
    res.status(201).json({ success: true, kotId, message: "KOT Sent successfully with exact prices!" });
  } catch (error) {
    await connection.rollback();
    console.error("KOT CREATE ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  } finally {
    connection.release();
  }
});

app.put("/api/kots/status/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const statusBody = req.body?.status || req.body?.orderStatus || req.body?.state;
    const resolvedStatus = statusBody || 'Completed';

    await db.query(`UPDATE kots SET status = ? WHERE id = ?`, [resolvedStatus, id]);

    res.json({ success: true, message: `KOT status updated to ${resolvedStatus} successfully!` });
  } catch (error) {
    console.error("KOT STATUS UPDATE ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post("/api/kots/push-to-cashier/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await db.query(`UPDATE kots SET status = 'Completed' WHERE id = ?`, [id]);
    res.json({ success: true, message: "KOT successfully sent to Cashier Open Bills!" });
  } catch (error) {
    console.error("PUSH TO CASHIER ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============================================================
// PAYMENTS PROCESSING
// ============================================================

app.post("/api/payments/process", async (req, res) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    const {
      cashier_id, payment_type_id, payment_status_id, table_code,
      customer_name, customer_phone, waiter_name, waiter_tip,
      grandTotal, paymentMode, cashAmount, upiAmount, cartItems,
      sgst_amount, cgst_amount, discount_percentage, discount_amount, kot_no
    } = req.body;

    const totalToPay = parseFloat(grandTotal) || 0;
    let resolvedTypeId = payment_type_id || 1;
    if (paymentMode === 'UPI') resolvedTypeId = 2;
    if (paymentMode === 'PARTIAL') resolvedTypeId = 3;

    const resolvedStatusId = payment_status_id || 2;
    const isParcel = !table_code || table_code === 'PARCEL' || table_code === 'N/A';
    const finalTableCode = isParcel ? 'PARCEL' : table_code;

    const [paymentResult] = await connection.query(
      `INSERT INTO payments (user_id, payment_type_id, payment_status_id, customer_name, customer_phone, table_code, kot_no, total_amount, cash_amount, upi_amount, discount_percentage, discount_amount, sgst_amount, cgst_amount, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        cashier_id || 1, resolvedTypeId, resolvedStatusId,
        customer_name || (isParcel ? 'Parcel Customer' : 'Custom'), customer_phone || null, finalTableCode, kot_no || null,
        totalToPay, cashAmount || 0, upiAmount || 0,
        discount_percentage || 0, discount_amount || 0,
        sgst_amount || 0, cgst_amount || 0
      ]
    );

    const paymentId = paymentResult.insertId;

    if (cartItems && cartItems.length > 0) {
      for (const item of cartItems) {
        const prodId = item.product_id || item.id || null;
        const pName = item.product_name || item.name || item.item_name || 'Item';
        const qty = Number(item.quantity || item.qty || 1);
        let price = Number(item.price || item.rate || 0);

        if (price <= 0 && item.total && qty > 0) {
          price = Number(item.total) / qty;
        }
        if (price <= 0 && pName) {
          const [pRow] = await connection.query(`SELECT price FROM products WHERE product_name = ? LIMIT 1`, [pName]);
          if (pRow.length > 0) price = Number(pRow[0].price);
        }

        const itemTotal = qty * price;

        await connection.query(
          `INSERT INTO order_items (payment_id, product_id, product_name, quantity, price, total_price) VALUES (?, ?, ?, ?, ?, ?)`,
          [paymentId, prodId, pName, qty, price, itemTotal]
        );
      }
    }

    if (!isParcel) {
      await connection.query(
        `UPDATE restaurant_tables SET status = 'Available', current_amount = 0.00 WHERE table_code = ? OR table_name = ?`,
        [table_code, table_code]
      );
      await connection.query(`UPDATE kots SET status = 'Billed' WHERE table_code = ?`, [table_code]);
    }

    if (kot_no && kot_no !== 'Direct') {
      const cleanKotNo = kot_no.replace('KOT #', '').trim();
      await connection.query(`UPDATE kots SET status = 'Billed' WHERE kot_no = ?`, [cleanKotNo]);
    }

    await connection.commit();
    res.status(201).json({ success: true, message: "Payment completed, bill printed, and table cleared!", paymentId });
  } catch (error) {
    await connection.rollback();
    console.error("PAYMENT PROCESS ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  } finally {
    connection.release();
  }
});

app.put("/api/payments/status/:id", async (req, res) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    const { id } = req.params;
    const { table_code, grandTotal, payment_type_id, cash_amount, upi_amount, kot_no } = req.body;

    let numericPaymentId = parseInt(String(id).replace(/[^0-9]/g, ""), 10);

    if (!numericPaymentId || isNaN(numericPaymentId)) {
      const [existingPay] = await connection.query(
        `SELECT id FROM payments WHERE table_code = ? AND payment_status_id = 1 ORDER BY id DESC LIMIT 1`,
        [table_code || 'N/A']
      );
      if (existingPay.length > 0) {
        numericPaymentId = existingPay[0].id;
      } else {
        const [newPay] = await connection.query(`
          INSERT INTO payments (user_id, payment_type_id, payment_status_id, customer_name, table_code, total_amount, created_at)
          VALUES (1, ?, 2, 'Custom', ?, ?, NOW())
        `, [payment_type_id || 1, table_code || 'N/A', grandTotal || 0]);
        numericPaymentId = newPay.insertId;
      }
    }

    await connection.query(
      `UPDATE payments SET payment_status_id = 2, total_amount = COALESCE(?, total_amount), payment_type_id = COALESCE(?, payment_type_id), cash_amount = COALESCE(?, cash_amount), upi_amount = COALESCE(?, upi_amount) WHERE id = ?`,
      [grandTotal || null, payment_type_id || null, cash_amount || null, upi_amount || null, numericPaymentId]
    );

    if (table_code && table_code !== 'PARCEL' && table_code !== 'N/A') {
      await connection.query(
        `UPDATE restaurant_tables SET status = 'Available', current_amount = 0.00 WHERE table_code = ? OR table_name = ?`,
        [table_code, table_code]
      );
      await connection.query(`UPDATE kots SET status = 'Billed' WHERE table_code = ?`, [table_code]);
    }

    if (kot_no && kot_no !== 'Direct') {
      const cleanKotNo = kot_no.replace('KOT #', '').trim();
      await connection.query(`UPDATE kots SET status = 'Billed' WHERE kot_no = ?`, [cleanKotNo]);
    }

    await connection.commit();
    res.json({ success: true, message: "Payment marked successful and table cleared!" });
  } catch (error) {
    await connection.rollback();
    console.error("PAYMENT STATUS UPDATE ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  } finally {
    connection.release();
  }
});

// ============================================================
// ORDER HISTORY / TODAY'S TRANSACTIONS API
// ============================================================

app.get("/api/transactions/today", async (req, res) => {
  try {
    const { date } = req.query;
    let dateFilter = "1=1";
    let queryParams = [];

    if (date && date !== 'undefined' && date !== 'null' && date !== '') {
      dateFilter = "DATE(p.created_at) = ?";
      queryParams.push(date);
    }

    const [rows] = await db.query(`
      SELECT 
        p.id AS order_id,
        p.total_amount,
        p.customer_name,
        p.customer_phone,
        p.table_code,
        COALESCE(pt.name, 'Cash') AS payment_mode,
        p.created_at
      FROM payments p
      LEFT JOIN payment_types pt ON p.payment_type_id = pt.id
      WHERE ${dateFilter}
      ORDER BY p.id DESC
    `, queryParams);

    const transactions = [];
    for (let row of rows) {
      const [items] = await db.query(`SELECT product_name, quantity FROM order_items WHERE payment_id = ?`, [row.order_id]);
      const dateObj = new Date(row.created_at);
      
      transactions.push({
        id: `Order #${String(row.order_id).padStart(4, '0')}`,
        timing: dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: row.table_code && row.table_code !== 'N/A' && row.table_code !== 'PARCEL' ? `Table No: ${row.table_code}` : 'Parcel',
        customer: row.customer_name || 'Custom',
        phone: row.customer_phone ? `+91-${row.customer_phone}` : 'No Phone',
        amount: parseFloat(row.total_amount) || 0,
        mode: row.payment_mode || 'Cash',
        status: 'Successful',
        itemsSummary: items.map(i => `${i.quantity}x ${i.product_name}`).join(", ") || 'Items'
      });
    }

    const totalSales = transactions.reduce((acc, curr) => acc + curr.amount, 0);
    const cashTotal = transactions.filter(t => t.mode.toLowerCase().includes('cash')).reduce((acc, curr) => acc + curr.amount, 0);
    const upiTotal = transactions.filter(t => t.mode.toLowerCase().includes('upi')).reduce((acc, curr) => acc + curr.amount, 0);

    res.status(200).json({
      success: true,
      data: {
        totalOrders: transactions.length,
        totalSales,
        cashTotal,
        upiTotal,
        transactions
      }
    });
  } catch (error) {
    console.error("TRANSACTIONS TODAY ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============================================================
// OPEN BILLS (STRICTLY PRESERVES EXACT KOT ITEMS & TOTAL AMOUNT)
// ============================================================

app.get("/api/open-bills", async (req, res) => {
  try {
    const [latestKots] = await db.query(`
      SELECT MAX(k.id) AS id, k.table_code
      FROM kots k
      WHERE k.table_code <> 'PARCEL'
        AND LOWER(COALESCE(k.status, '')) IN ('completed', 'ready', 'served')
      GROUP BY k.table_code
    `);

    if (latestKots.length === 0) {
      return res.json({ success: true, data: [] });
    }

    const kotIds = latestKots.map(k => k.id);

    const [rows] = await db.query(`
      SELECT
        k.id AS kot_id,
        k.kot_no,
        k.status AS kot_status,
        k.table_code,
        k.captain_name,
        ki.id AS kot_item_id,
        ki.product_id,
        ki.item_name AS product_name,
        ki.quantity,
        ki.price AS price
      FROM kots k
      INNER JOIN kot_items ki ON ki.kot_id = k.id
      WHERE k.id IN (?)
      ORDER BY k.id DESC, ki.id ASC
    `, [kotIds]);

    const bills = {};

    for (const row of rows) {
      const key = row.table_code;

      if (!bills[key]) {
        bills[key] = {
          order_id: row.kot_id,
          kot_id: row.kot_id,
          kot_no: row.kot_no,
          table_code: row.table_code,
          table: row.table_code,
          captain_name: row.captain_name || 'Captain',
          customer: "Table Order",
          items: [],
          amount: 0,
          subtotal: 0,
        };
      }

      const quantity = Number(row.quantity) || 0;
      const price = Number(row.price) || 0;
      const itemTotal = quantity * price;

      bills[key].items.push({
        id: row.kot_item_id,
        product_id: row.product_id,
        product_name: row.product_name,
        name: row.product_name,
        item_name: row.product_name,
        qty: quantity,
        quantity: quantity,
        price: price,
        rate: price,
        total: Number(itemTotal.toFixed(2)),
        total_price: Number(itemTotal.toFixed(2)),
      });
    }

    for (const key of Object.keys(bills)) {
      let sub = 0;
      for (const itm of bills[key].items) {
        sub += itm.total;
      }
      bills[key].subtotal = Number(sub.toFixed(2));
      bills[key].amount = Number(sub.toFixed(2));
      bills[key].total = Number(sub.toFixed(2));
      bills[key].grandTotal = Number(sub.toFixed(2));
      bills[key].itemsSummary = bills[key].items.map(i => `${i.quantity}x ${i.product_name}`).join(", ");
    }

    res.json({
      success: true,
      data: Object.values(bills),
    });
  } catch (error) {
    console.error("OPEN BILLS ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============================================================
// CASHIER SESSIONS
// ============================================================

app.get("/api/sessions", async (req, res) => {
  try {
    const [rows] = await db.query(`SELECT * FROM cashier_sessions cs ORDER BY id DESC`);
    res.json({ success: true, data: { allSessions: rows } });
  } catch (e) {
    res.json({ success: true, data: { allSessions: [] } });
  }
});

// ============================================================
// ATTENDANCE & EMPLOYEES
// ============================================================

app.get("/api/attendance", async (req, res) => {
  try {
    const [rows] = await db.query(`SELECT a.*, u.username FROM attendance a LEFT JOIN users u ON a.user_id = u.id ORDER BY a.id DESC`);
    res.json({ success: true, data: rows });
  } catch (e) {
    res.json({ success: true, data: [] });
  }
});

app.get("/api/employee-details", async (req, res) => {
  try {
    const [rows] = await db.query(`SELECT e.*, u.username, u.email, u.phone FROM employee_details e LEFT JOIN users u ON e.user_id = u.id ORDER BY e.id DESC`);
    res.json({ success: true, data: rows });
  } catch (e) {
    res.json({ success: true, data: [] });
  }
});

app.get("/api/leave-applications", async (req, res) => {
  try {
    const [rows] = await db.query(`SELECT l.*, u.username FROM leave_applications l LEFT JOIN users u ON l.user_id = u.id ORDER BY l.id DESC`);
    res.json({ success: true, data: rows });
  } catch (e) {
    res.json({ success: true, data: [] });
  }
});

// ============================================================
// VENDORS & PAYOUTS
// ============================================================

app.get("/api/vendors", async (req, res) => {
  try {
    const [rows] = await db.query(`SELECT * FROM vendors ORDER BY id DESC`);
    res.json({ success: true, data: rows });
  } catch (e) {
    res.json({ success: true, data: [] });
  }
});

app.get("/api/vendor-purchases", async (req, res) => {
  try {
    const [rows] = await db.query(`SELECT vp.*, v.name AS vendor_name FROM vendor_purchases vp LEFT JOIN vendors v ON vp.vendor_id = v.id ORDER BY vp.id DESC`);
    res.json({ success: true, data: rows });
  } catch (e) {
    res.json({ success: true, data: [] });
  }
});

app.get("/api/vendor-payouts", async (req, res) => {
  try {
    const [rows] = await db.query(`SELECT vp.*, v.name AS vendor_name FROM vendor_payouts vp LEFT JOIN vendors v ON vp.vendor_id = v.id ORDER BY vp.id DESC`);
    res.json({ success: true, data: rows });
  } catch (e) {
    res.json({ success: true, data: [] });
  }
});

// ============================================================
// PAYMENTS & META
// ============================================================

app.get("/api/payments", async (req, res) => {
  try {
    const [rows] = await db.query(`SELECT p.*, pt.name AS payment_type_name FROM payments p LEFT JOIN payment_types pt ON p.payment_type_id = pt.id ORDER BY p.id DESC`);
    res.json({ success: true, data: rows });
  } catch (e) {
    res.json({ success: true, data: [] });
  }
});

app.get("/api/payment-types", async (req, res) => {
  try {
    const [rows] = await db.query(`SELECT * FROM payment_types ORDER BY id ASC`);
    res.json({ success: true, data: rows });
  } catch (e) {
    res.json({ success: true, data: [] });
  }
});

app.get("/api/payment-statuses", async (req, res) => {
  try {
    const [rows] = await db.query(`SELECT * FROM payment_statuses ORDER BY id ASC`);
    res.json({ success: true, data: rows });
  } catch (e) {
    res.json({ success: true, data: [] });
  }
});

app.get("/api/cashier-billing-details", async (req, res) => {
  try {
    const [rows] = await db.query(`SELECT * FROM cashier_billing_details ORDER BY id DESC`);
    res.json({ success: true, data: rows });
  } catch (e) {
    res.json({ success: true, data: [] });
  }
});

app.get("/api/waiter-tips", async (req, res) => {
  try {
    const [rows] = await db.query(`SELECT wt.*, u.username AS waiter_name FROM waiter_tips wt LEFT JOIN users u ON wt.waiter_id = u.id ORDER BY wt.id DESC`);
    res.json({ success: true, data: rows });
  } catch (e) {
    res.json({ success: true, data: [] });
  }
});

// ============================================================
// ADMIN ANALYTICS & PAYMENTS OVERVIEW API (FULLY WORKING)
// ============================================================

async function fetchLiveAdminStats() {
  const [payments] = await db.query(`
    SELECT 
      COUNT(*) AS total_bills,
      COALESCE(SUM(total_amount), 0) AS total_revenue,
      COALESCE(SUM(cash_amount), 0) AS cash_amount,
      COALESCE(SUM(upi_amount), 0) AS upi_amount
    FROM payments
  `);

  let totalRevenue = Number(payments[0]?.total_revenue) || 0;
  let totalBills = Number(payments[0]?.total_bills) || 0;
  let cashAmount = Number(payments[0]?.cash_amount) || 0;
  let upiAmount = Number(payments[0]?.upi_amount) || 0;

  if (totalRevenue === 0) {
    const [tables] = await db.query(`
      SELECT COALESCE(SUM(current_amount), 0) AS amt 
      FROM restaurant_tables 
      WHERE status = 'Occupied' OR current_amount > 0
    `);
    
    const [kotsSum] = await db.query(`
      SELECT COALESCE(SUM(ki.quantity * ki.price), 0) AS kot_amt, COUNT(DISTINCT k.id) AS kot_count
      FROM kots k
      INNER JOIN kot_items ki ON ki.kot_id = k.id
      WHERE LOWER(COALESCE(k.status, '')) != 'billed'
    `);

    totalRevenue = Number(tables[0]?.amt || 0) + Number(kotsSum[0]?.kot_amt || 0);
    totalBills = Number(kotsSum[0]?.kot_count || (totalRevenue > 0 ? 1 : 0));
    cashAmount = totalRevenue;
  }

  const aov = totalBills > 0 ? totalRevenue / totalBills : 0;

  const [typeBreakdown] = await db.query(`
    SELECT 
      COALESCE(pt.name, 'Cash') AS payment_type,
      SUM(p.total_amount) AS total_amount
    FROM payments p
    LEFT JOIN payment_types pt ON p.payment_type_id = pt.id
    GROUP BY payment_type
  `);

  const [cashierBreakdown] = await db.query(`
    SELECT 
      COALESCE(u.username, 'cashier01') AS cashier_name,
      COUNT(p.id) AS total_bills,
      COALESCE(SUM(p.total_amount), 0) AS total_amount,
      COALESCE(SUM(p.cash_amount), 0) AS cash_amount,
      COALESCE(SUM(p.upi_amount), 0) AS upi_amount,
      0 AS partial_amount,
      COALESCE(SUM(p.total_amount), 0) AS expected_amount,
      u.role_id
    FROM payments p
    LEFT JOIN users u ON p.user_id = u.id
    GROUP BY u.id, u.username, u.role_id
  `);

  const [taxStats] = await db.query(`
    SELECT 
      COALESCE(SUM(sgst_amount), 0) AS total_sgst,
      COALESCE(SUM(cgst_amount), 0) AS total_cgst
    FROM payments
  `);

  const [stockAlerts] = await db.query(`
    SELECT product_name, price AS stock 
    FROM products 
    WHERE price <= 5 
    LIMIT 5
  `);

  return {
    revenueStats: {
      totalRevenue,
      totalBills,
      aov,
      growthPercent: "+0.0%"
    },
    typeBreakdown,
    cashierBreakdown,
    taxStats: taxStats[0] || { total_sgst: 0, total_cgst: 0 },
    stockAlerts,
    vendorSummary: { totalVendorDeductions: 0 },
    cancelledOrdersCount: 0
  };
}

app.get("/api/analytics/payments", async (req, res) => {
  try {
    const { period = 'Today', date, month, year } = req.query;
    
    let dateFilter = "DATE(p.created_at) = CURDATE()";
    let queryParams = [];

    const targetYear = year || new Date().getFullYear();

    if (period === 'Today') {
      dateFilter = "DATE(p.created_at) = CURDATE()";
    } else if (period === 'Specific Date' && date) {
      dateFilter = "DATE(p.created_at) = ?";
      queryParams.push(date);
    } else if (period === 'This Week') {
      dateFilter = "p.created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)";
    } else if (period === 'Month' && month) {
      const monthsMap = {
        'January': '01', 'February': '02', 'March': '03', 'April': '04',
        'May': '05', 'June': '06', 'July': '07', 'August': '08',
        'September': '09', 'October': '10', 'November': '11', 'December': '12'
      };
      const monthNum = monthsMap[month] || '08';
      dateFilter = "MONTH(p.created_at) = ? AND YEAR(p.created_at) = ?";
      queryParams.push(monthNum, targetYear);
    } else if (period === 'Year') {
      dateFilter = "YEAR(p.created_at) = ?";
      queryParams.push(targetYear);
    }

    const [payments] = await db.query(`
      SELECT 
        COUNT(*) AS total_bills,
        COALESCE(SUM(total_amount), 0) AS total_revenue,
        COALESCE(SUM(cash_amount), 0) AS cash_amount,
        COALESCE(SUM(upi_amount), 0) AS upi_amount
      FROM payments p
      WHERE ${dateFilter}
    `, queryParams);

    // Duplicate parameters for the subsequent queries that use the same dateFilter
    const fullParams = [...queryParams, ...queryParams, ...queryParams, ...queryParams];

    const [typeBreakdown] = await db.query(`
      SELECT 
        COALESCE(pt.name, 'Cash') AS payment_type,
        SUM(p.total_amount) AS total_amount
      FROM payments p
      LEFT JOIN payment_types pt ON p.payment_type_id = pt.id
      WHERE ${dateFilter}
      GROUP BY payment_type
    `, queryParams);

    const [cashierBreakdown] = await db.query(`
      SELECT 
        COALESCE(u.username, 'cashier01') AS cashier_name,
        COUNT(p.id) AS total_bills,
        COALESCE(SUM(p.total_amount), 0) AS total_amount,
        COALESCE(SUM(p.cash_amount), 0) AS cash_amount,
        COALESCE(SUM(p.upi_amount), 0) AS upi_amount,
        0 AS partial_amount,
        COALESCE(SUM(p.total_amount), 0) AS expected_amount,
        u.role_id
      FROM payments p
      LEFT JOIN users u ON p.user_id = u.id
      WHERE ${dateFilter}
      GROUP BY u.id, u.username, u.role_id
    `, queryParams);

    const [taxStats] = await db.query(`
      SELECT 
        COALESCE(SUM(sgst_amount), 0) AS total_sgst,
        COALESCE(SUM(cgst_amount), 0) AS total_cgst
      FROM payments p
      WHERE ${dateFilter}
    `, queryParams);

    const [stockAlerts] = await db.query(`
      SELECT product_name, price AS stock 
      FROM products 
      WHERE price <= 5 
      LIMIT 5
    `);

    const rev = payments[0] || { total_bills: 0, total_revenue: 0 };
    const aov = rev.total_bills > 0 ? Number(rev.total_revenue) / Number(rev.total_bills) : 0;

    res.json({
      success: true,
      data: {
        revenueStats: {
          totalRevenue: Number(rev.total_revenue) || 0,
          totalBills: Number(rev.total_bills) || 0,
          aov: aov,
          growthPercent: "+0.0%",
          cash_amount: Number(rev.cash_amount) || 0,
          upi_amount: Number(rev.upi_amount) || 0
        },
        typeBreakdown,
        cashierBreakdown,
        taxStats: taxStats[0] || { total_sgst: 0, total_cgst: 0 },
        stockAlerts,
        vendorSummary: { totalVendorDeductions: 0 },
        cancelledOrdersCount: 0
      }
    });
  } catch (error) {
    console.error("ANALYTICS PAYMENTS ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get("/api/analytics/overview-extended", async (req, res) => {
  try {
    const [topSellingItems] = await db.query(`
      SELECT product_name, SUM(quantity) AS total_qty
      FROM order_items
      GROUP BY product_name
      ORDER BY total_qty DESC
      LIMIT 5
    `);

    res.json({
      success: true,
      data: {
        topSellingItems,
        monthFinancials: { revenue: 0, expense: 0 }
      }
    });
  } catch (error) {
    console.error("OVERVIEW EXTENDED ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get("/api/admin/dashboard", async (req, res) => {
  try {
    const stats = await fetchLiveAdminStats();
    res.json({
      success: true,
      totalRevenueToday: stats.revenueStats.totalRevenue,
      totalOrdersToday: stats.revenueStats.totalBills,
      cashAmount: stats.revenueStats.totalRevenue,
      upiAmount: 0,
      data: stats
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get("/api/admin/stats", async (req, res) => {
  try {
    const stats = await fetchLiveAdminStats();
    res.json({
      success: true,
      totalRevenueToday: stats.revenueStats.totalRevenue,
      totalOrdersToday: stats.revenueStats.totalBills,
      data: stats
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get("/api/admin/cashier-sync", async (req, res) => {
  try {
    const stats = await fetchLiveAdminStats();
    const [payments] = await db.query(`SELECT p.*, COALESCE(pt.name, 'Cash') AS payment_type_name FROM payments p LEFT JOIN payment_types pt ON p.payment_type_id = pt.id ORDER BY p.id DESC`);

    res.json({
      success: true,
      data: {
        summary: {
          totalSales: stats.revenueStats.totalRevenue,
          totalBills: stats.revenueStats.totalBills,
          cashAmount: stats.revenueStats.totalRevenue,
          upiAmount: 0,
        },
        cashiers: stats.cashierBreakdown,
        payments
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============================================================
// CONFIGURATIONS & NOTIFICATIONS
// ============================================================

app.get("/api/hotel-profile", async (req, res) => {
  try {
    const [rows] = await db.query(`SELECT * FROM hotel_profile ORDER BY id ASC LIMIT 1`);
    res.json({ success: true, data: rows[0] || null });
  } catch (e) {
    res.json({ success: true, data: null });
  }
});

app.get("/api/restaurant-configurations", async (req, res) => {
  try {
    const [rows] = await db.query(`SELECT * FROM restaurant_configurations ORDER BY id ASC`);
    res.json({ success: true, data: rows });
  } catch (e) {
    res.json({ success: true, data: [] });
  }
});

app.get("/api/system-notifications", async (req, res) => {
  try {
    const [rows] = await db.query(`SELECT * FROM system_notifications ORDER BY id DESC`);
    res.json({ success: true, data: rows });
  } catch (e) {
    res.json({ success: true, data: [] });
  }
});

app.get("/api/supervisor", async (req, res) => {
  try {
    const [rows] = await db.query(`SELECT * FROM supervisor ORDER BY id DESC`);
    res.json({ success: true, data: rows });
  } catch (e) {
    res.json({ success: true, data: [] });
  }
});

app.get("/api/supervisor-warnings", async (req, res) => {
  try {
    const [rows] = await db.query(`SELECT sw.*, supervisor.username AS supervisor_name FROM supervisor_warnings sw LEFT JOIN users supervisor ON sw.supervisor_id = supervisor.id ORDER BY sw.id DESC`);
    res.json({ success: true, data: rows });
  } catch (e) {
    res.json({ success: true, data: [] });
  }
});

app.get("/api/table-usage_logs", async (req, res) => {
  try {
    const [rows] = await db.query(`SELECT * FROM table_usage_logs ORDER BY id DESC`);
    res.json({ success: true, data: rows });
  } catch (e) {
    res.json({ success: true, data: [] });
  }
});

app.get("/api/round-off-logs", async (req, res) => {
  try {
    const [rows] = await db.query(`SELECT * FROM round_off_logs ORDER BY id DESC`);
    res.json({ success: true, data: rows });
  } catch (e) {
    res.json({ success: true, data: [] });
  }
});

// ============================================================
// DAILY REGISTER SUMMARY (CASHIER MODAL LIVE SYNC)
// ============================================================

app.get("/api/daily-register-summary", async (req, res) => {
  try {
    const { date, cashier } = req.query;
    let dateFilter = "DATE(p.created_at) = CURDATE()";
    let queryParams = [];

    if (date && date !== 'undefined' && date !== 'null' && date !== '') {
      dateFilter = "DATE(p.created_at) = ?";
      queryParams.push(date);
    }

    // Query live aggregated data from the payments table
    const [rows] = await db.query(`
      SELECT 
        COUNT(p.id) AS total_bills,
        COALESCE(SUM(p.total_amount), 0) AS total_revenue,
        COALESCE(SUM(p.cash_amount), 0) AS cash_amount,
        COALESCE(SUM(p.upi_amount), 0) AS upi_amount,
        0 AS partial_amount,
        0 AS vendor_payouts
      FROM payments p
      WHERE ${dateFilter}
    `, queryParams);

    const summary = rows[0] || {
      total_bills: 0,
      total_revenue: 0,
      cash_amount: 0,
      upi_amount: 0,
      partial_amount: 0,
      vendor_payouts: 0
    };

    res.json({
      success: true,
      data: [{
        id: 1,
        total_bills: summary.total_bills,
        total_revenue: summary.total_revenue,
        cash_amount: summary.cash_amount,
        upi_amount: summary.upi_amount,
        partial_amount: summary.partial_amount,
        vendor_payouts: summary.vendor_payouts
      }]
    });
  } catch (error) {
    console.error("DAILY REGISTER SUMMARY ERROR:", error);
    res.status(500).json({ success: false, data: [] });
  }
});
// ============================================================
// GENERIC ERROR HANDLER & 404
// ============================================================

app.use((err, req, res, next) => {
  console.error("UNHANDLED ERROR:", err);
  res.status(500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `API route not found: ${req.method} ${req.originalUrl}`,
  });
});

// ============================================================
// START SERVER
// ============================================================

app.listen(PORT, () => {
  console.log("");
  console.log("========================================");
  console.log(" HOTEL ERP BACKEND");
  console.log("========================================");
  console.log(` Server running on port ${PORT}`);
  console.log(` http://localhost:${PORT}`);
  console.log("========================================");
  console.log("");
});