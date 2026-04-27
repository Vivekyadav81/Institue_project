const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mysql = require('mysql2/promise');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key-123';

// Auth Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Authentication required' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid or expired token' });
    req.user = user;
    next();
  });
};

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '..', 'frontend', 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});
const fileFilter = (req, file, cb) => {
  const allowed = /image\/(jpeg|png|gif|webp)|video\/(mp4|webm|ogg|quicktime)/;
  if (allowed.test(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only images and videos are allowed'), false);
  }
};
const upload = multer({ storage, fileFilter, limits: { fileSize: 200 * 1024 * 1024 } }); // 200MB limit

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(uploadsDir));

// Database connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'mastermind_classes',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Nodemailer Transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Email helper function
const sendNotificationEmail = async (subject, html) => {
  console.log(`Attempting to send email: ${subject}`);
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS || process.env.EMAIL_USER === 'your-email@gmail.com') {
      console.warn('Gmail credentials not configured. Skipping email notification.');
      return;
    }
    await transporter.sendMail({
      from: `"Master Mind Classes" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, // Send to self
      subject,
      html
    });
    console.log('✅ Notification email sent successfully');
  } catch (error) {
    console.error('❌ Error sending email:', error);
  }
};

// Test DB Connection & Sync Schema
pool.getConnection()
  .then(async (connection) => {
    console.log('Database connected successfully');
    
    // Create Tables if not exist
    const createStudentsTable = `
      CREATE TABLE IF NOT EXISTS students (
        id INT AUTO_INCREMENT PRIMARY KEY,
        student_name VARCHAR(100) NOT NULL,
        \`class\` VARCHAR(50),
        competitive_exam VARCHAR(100),
        stream VARCHAR(50),
        phone_number VARCHAR(15) NOT NULL,
        parent_name VARCHAR(100) NOT NULL,
        address TEXT NOT NULL,
        demo_requested BOOLEAN DEFAULT FALSE,
        registration_type VARCHAR(50) DEFAULT 'standard',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    const createInquiriesTable = `
      CREATE TABLE IF NOT EXISTS inquiries (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        phone VARCHAR(15) NOT NULL,
        message TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    const createSlidesTable = `
      CREATE TABLE IF NOT EXISTS slides (
        id INT AUTO_INCREMENT PRIMARY KEY,
        image_url TEXT NOT NULL,
        title VARCHAR(255),
        subtitle TEXT,
        \`order_index\` INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    const createSettingsTable = `
      CREATE TABLE IF NOT EXISTS settings (
        setting_key VARCHAR(100) PRIMARY KEY,
        setting_value TEXT
      );
    `;

    const createFacultyTable = `
      CREATE TABLE IF NOT EXISTS faculty (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        qualification VARCHAR(255),
        experience VARCHAR(255),
        image TEXT,
        display_mode VARCHAR(20) DEFAULT 'cover',
        zoom FLOAT DEFAULT 1.0,
        offset_x INT DEFAULT 0,
        offset_y INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    const createGalleryTable = `
      CREATE TABLE IF NOT EXISTS gallery (
        id INT AUTO_INCREMENT PRIMARY KEY,
        image_url TEXT NOT NULL,
        caption VARCHAR(255),
        category VARCHAR(100),
        media_type VARCHAR(10) DEFAULT 'image',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    const createActivitiesTable = `
      CREATE TABLE IF NOT EXISTS activities (
        id INT AUTO_INCREMENT PRIMARY KEY,
        image_url TEXT NOT NULL,
        caption VARCHAR(255),
        order_index INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    const createClassesTable = `
      CREATE TABLE IF NOT EXISTS classes_offered (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        subtitle VARCHAR(255),
        description TEXT,
        icon VARCHAR(50) DEFAULT 'BookOpen',
        order_index INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    const createCoursesTable = `
      CREATE TABLE IF NOT EXISTS courses (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        class_level VARCHAR(255),
        subjects TEXT,
        duration VARCHAR(255),
        timing VARCHAR(255),
        color VARCHAR(50) DEFAULT 'blue',
        order_index INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    const createAdminAuthTable = `
      CREATE TABLE IF NOT EXISTS admin_auth (
        id INT PRIMARY KEY AUTO_INCREMENT,
        email VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        reset_token VARCHAR(255),
        reset_token_expiry TIMESTAMP NULL
      );
    `;

    await connection.query(createStudentsTable);
    await connection.query(createInquiriesTable);
    await connection.query(createSlidesTable);
    await connection.query(createGalleryTable);
    await connection.query(createActivitiesTable);
    await connection.query(createSettingsTable);
    await connection.query(createFacultyTable);
    await connection.query(createClassesTable);
    await connection.query(createCoursesTable);
    await connection.query(createAdminAuthTable);

    // Migration: add media_type column to gallery if missing
    try {
      const [galCols] = await connection.query('DESCRIBE gallery');
      const galColNames = galCols.map(c => c.Field);
      if (!galColNames.includes('media_type')) {
        await connection.query('ALTER TABLE gallery ADD COLUMN media_type VARCHAR(10) DEFAULT \'image\'');
        console.log('Migration: Added media_type column to gallery table');
      }
    } catch (err) {
      console.error('Gallery migration error:', err);
    }

    // Seed default admin if table is empty or update old placeholder
    const [adminRows] = await connection.query('SELECT * FROM admin_auth');
    if (adminRows.length === 0) {
      const hashedPassword = bcrypt.hashSync('12345678', 10);
      await connection.query(
        'INSERT INTO admin_auth (email, password) VALUES (?, ?)',
        ['info@mastermindclassesmbd.com', hashedPassword]
      );
      console.log('Migration: Seeded default admin credentials');
    } else if (adminRows.find(a => a.email === 'vivekyadav22550@gmail.com')) {
      const hashedPassword = bcrypt.hashSync('12345678', 10);
      await connection.query(
        'UPDATE admin_auth SET email = ?, password = ? WHERE email = ?',
        ['info@mastermindclassesmbd.com', hashedPassword, 'vivekyadav22550@gmail.com']
      );
      console.log('Migration: Updated placeholder admin to info@mastermindclassesmbd.com');
    }

    // Seed default classes if table is empty
    const [classRows] = await connection.query('SELECT COUNT(*) as count FROM classes_offered');
    if (classRows[0].count === 0) {
      await connection.query(`
        INSERT INTO classes_offered (title, subtitle, description, icon, order_index) VALUES
        ('Classes V – VIII', 'All Subjects', 'Building a strong foundation with focus on conceptual clarity in Mathematics, Science, English, and Social Studies.', 'BookOpen', 1),
        ('Classes IX – X', 'All Subjects', 'Board exam preparation strategy with rigorous testing, doubt clearing sessions, and comprehensive study material.', 'Target', 2),
        ('Classes XI – XII', 'PCM • PCB • Commerce • Humanities', 'Specialized faculty for each stream focusing on board excellence and competitive exam orientation.', 'Users', 3)
      `);
      console.log('Migration: Seeded default classes offered');
    }

    // Seed default courses if table is empty
    const [courseRows] = await connection.query('SELECT COUNT(*) as count FROM courses');
    if (courseRows[0].count === 0) {
      await connection.query(`
        INSERT INTO courses (name, class_level, subjects, duration, timing, color, order_index) VALUES
        ('Foundation Batch', 'Classes V – VIII', 'Mathematics, Science, English, Social Studies', '1 Year Academic Program', 'Evening Batches (4 PM - 7 PM)', 'blue', 1),
        ('Board Preparation', 'Classes IX – X', 'Maths, Physics, Chemistry, Biology, English, SST', '1 Year Intensive Program', 'Evening Batches (4 PM - 8 PM)', 'purple', 2),
        ('Science Excellence (PCM/PCB)', 'Classes XI – XII', 'Physics, Chemistry, Maths, Biology', '1 or 2 Year Integrated Program', 'Morning & Evening Batches', 'emerald', 3),
        ('Commerce / Humanities', 'Classes XI – XII', 'Accountancy, Economics, Business Studies, History, Pol. Science', '1 or 2 Year Program', 'Evening Batches', 'amber', 4),
        ('Competitive Exams (CUET)', 'Class XII Appeared/Passed', 'Domain Specific Subjects, General Test, Languages', 'Crash Course & Year-long', 'Flexible Timings', 'rose', 5),
        ('Teaching Exams (CTET)', 'Graduates / B.Ed', 'Child Development, Pedagogy, Maths, EVS, Languages', '6 Months Comprehensive', 'Morning Batches', 'indigo', 6)
      `);
      console.log('Migration: Seeded default courses');
    }
    
    // Migration: Add columns to faculty if they don't exist
    try {
      const [columns] = await connection.query('DESCRIBE faculty');
      const columnNames = columns.map(c => c.Field);

      if (!columnNames.includes('display_mode')) {
        await connection.query('ALTER TABLE faculty ADD COLUMN display_mode VARCHAR(20) DEFAULT "cover"');
        console.log('Migration: Added display_mode column to faculty table');
      }
      
      if (!columnNames.includes('zoom')) {
        await connection.query('ALTER TABLE faculty ADD COLUMN zoom FLOAT DEFAULT 1.0, ADD COLUMN offset_x INT DEFAULT 0, ADD COLUMN offset_y INT DEFAULT 0');
        console.log('Migration: Added zoom and offset columns to faculty table');
      }
    } catch (err) {
      console.error('Migration error:', err);
    }
    
    // Seed default settings if empty
    await connection.query(`INSERT IGNORE INTO settings (setting_key, setting_value) VALUES ('logo_url', '/logo-transparent.png')`);
    await connection.query(`INSERT IGNORE INTO settings (setting_key, setting_value) VALUES ('cta_badge', 'Specialized Coaching')`);
    await connection.query(`INSERT IGNORE INTO settings (setting_key, setting_value) VALUES ('cta_title', 'Preparing for CTET or CUET')`);
    await connection.query(`INSERT IGNORE INTO settings (setting_key, setting_value) VALUES ('cta_description', 'Join our expert-led batches specifically designed to help you crack competitive exams with top percentiles.')`);
    console.log('Database tables verified/created');
    
    connection.release();
  })
  .catch(err => {
    console.error('Database connection failed:', err);
  });

// API Routes

// Registration Endpoint
app.post('/api/register', async (req, res) => {
  console.log('POST /api/register received:', req.body.student_name);
  try {
    const { student_name, class: student_class, competitive_exam, stream, phone_number, parent_name, address, demo_requested, registration_type } = req.body;
    
    // Basic validation: must have student_name, phone, parent, address, AND either class or competitive_exam
    if (!student_name || (!student_class && !competitive_exam) || !phone_number || !parent_name || !address) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const query = `
      INSERT INTO students (student_name, \`class\`, competitive_exam, stream, phone_number, parent_name, address, demo_requested, registration_type)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const [result] = await pool.execute(query, [
      student_name, 
      student_class || null,
      competitive_exam || null,
      stream || null, 
      phone_number, 
      parent_name, 
      address, 
      demo_requested ? 1 : 0, 
      registration_type || 'standard'
    ]);

    // Send Gmail Notification
    await sendNotificationEmail(
      `New Student Registration: ${student_name}`,
      `<h2>New Student Registration Received</h2>
       <p><strong>Student Name:</strong> ${student_name}</p>
       <p><strong>Parent Name:</strong> ${parent_name}</p>
       <p><strong>Phone:</strong> ${phone_number}</p>
       <p><strong>Class:</strong> ${student_class || 'N/A'}</p>
       <p><strong>Exam:</strong> ${competitive_exam || 'N/A'}</p>
       <p><strong>Address:</strong> ${address}</p>
       <p><strong>Registration Type:</strong> ${registration_type}</p>
       <p><strong>Demo Requested:</strong> ${demo_requested ? 'Yes' : 'No'}</p>
      `
    );

    res.status(201).json({ message: 'Registration successful', id: result.insertId });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Error completing registration', error: error.message });
  }
});

// Inquiry Endpoint
app.post('/api/inquiry', async (req, res) => {
  console.log('POST /api/inquiry received:', req.body.name);
  try {
    const { name, phone, message } = req.body;

    if (!name || !phone || !message) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const query = `INSERT INTO inquiries (name, phone, message) VALUES (?, ?, ?)`;
    const [result] = await pool.execute(query, [name, phone, message]);

    // Send Gmail Notification
    await sendNotificationEmail(
      `New Website Inquiry: ${name}`,
      `<h2>New Inquiry Received</h2>
       <p><strong>Name:</strong> ${name}</p>
       <p><strong>Phone:</strong> ${phone}</p>
       <p><strong>Message:</strong> ${message}</p>
      `
    );

    res.status(201).json({ message: 'Inquiry received', id: result.insertId });
  } catch (error) {
    console.error('Inquiry error:', error);
    res.status(500).json({ message: 'Error submitting inquiry', error: error.message });
  }
});

// Admin Registration Management
app.get('/api/register', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM students ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching registrations' });
  }
});

app.delete('/api/register/:id', authenticateToken, async (req, res) => {
  try {
    const [result] = await pool.execute('DELETE FROM students WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Registration not found' });
    res.json({ message: 'Registration deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting registration' });
  }
});

// Admin Inquiry Management
app.get('/api/inquiry', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM inquiries ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching inquiries' });
  }
});

app.delete('/api/inquiry/:id', authenticateToken, async (req, res) => {
  try {
    const [result] = await pool.execute('DELETE FROM inquiries WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Inquiry not found' });
    res.json({ message: 'Inquiry deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting inquiry' });
  }
});

// Admin Login
app.post('/api/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const [rows] = await pool.execute('SELECT * FROM admin_auth WHERE email = ?', [email]);
    
    if (rows.length === 0) return res.status(401).json({ message: 'Invalid email or password' });

    const admin = rows[0];
    const match = await bcrypt.compare(password, admin.password);
    
    if (!match) return res.status(401).json({ message: 'Invalid email or password' });

    const token = jwt.sign({ id: admin.id, email: admin.email }, JWT_SECRET, { expiresIn: '8h' });
    res.status(200).json({ token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Admin Forgot Password
app.post('/api/admin/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const [rows] = await pool.execute('SELECT * FROM admin_auth WHERE email = ?', [email]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Email address not found.' });
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expiry = new Date(Date.now() + 3600000); // 1 hour

    await pool.execute(
      'UPDATE admin_auth SET reset_token = ?, reset_token_expiry = ? WHERE email = ?',
      [token, expiry, email]
    );

    const origin = req.get('referer') ? new URL(req.get('referer')).origin : `http://${req.headers.host}`;
    const resetLink = `${origin}/admin/reset-password?token=${token}`;

    await sendNotificationEmail(
      `Admin Password Reset`,
      `<h2>Password Reset Request</h2>
       <p>You requested a password reset for the Admin Dashboard.</p>
       <p>Click the link below to set a new password:</p>
       <p><a href="${resetLink}">${resetLink}</a></p>
       <p>This link will expire in 1 hour.</p>
      `
    );

    res.status(200).json({ message: 'Password reset link sent to your email.' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Failed to send reset link.' });
  }
});

// Admin Reset Password
app.post('/api/admin/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    const [rows] = await pool.execute(
      'SELECT * FROM admin_auth WHERE reset_token = ? AND reset_token_expiry > NOW()',
      [token]
    );

    if (rows.length === 0) {
      return res.status(400).json({ message: 'Invalid or expired reset token.' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await pool.execute(
      'UPDATE admin_auth SET password = ?, reset_token = NULL, reset_token_expiry = NULL WHERE id = ?',
      [hashedPassword, rows[0].id]
    );

    res.status(200).json({ message: 'Password has been reset successfully.' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Failed to reset password.' });
  }
});

// Slides API
app.get('/api/slides', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM slides ORDER BY order_index ASC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching slides' });
  }
});

app.post('/api/slides', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'Image file is required' });
    const image_url = '/uploads/' + req.file.filename;
    const { title, subtitle, order_index } = req.body;
    const [result] = await pool.execute(
      'INSERT INTO slides (image_url, title, subtitle, order_index) VALUES (?, ?, ?, ?)',
      [image_url, title || '', subtitle || '', order_index || 0]
    );
    res.status(201).json({ id: result.insertId, image_url });
  } catch (error) {
    res.status(500).json({ message: 'Error adding slide' });
  }
});

app.delete('/api/slides/:id', authenticateToken, async (req, res) => {
  try {
    await pool.execute('DELETE FROM slides WHERE id = ?', [req.params.id]);
    res.json({ message: 'Slide deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting slide' });
  }
});

app.put('/api/slides/:id', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    const { title, subtitle } = req.body;
    const id = req.params.id;
    let query = 'UPDATE slides SET title=?, subtitle=?';
    let params = [title || '', subtitle || ''];
    if (req.file) {
      query += ', image_url=?';
      params.push('/uploads/' + req.file.filename);
    }
    query += ' WHERE id=?';
    params.push(id);
    await pool.execute(query, params);
    res.json({ message: 'Slide updated' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating slide' });
  }
});

// Activities API
app.get('/api/activities', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM activities ORDER BY order_index ASC, created_at DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching activities' });
  }
});

app.post('/api/activities', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'Image file is required' });
    const image_url = '/uploads/' + req.file.filename;
    const { caption, order_index } = req.body;
    const [result] = await pool.execute(
      'INSERT INTO activities (image_url, caption, order_index) VALUES (?, ?, ?)',
      [image_url, caption || '', order_index || 0]
    );
    res.status(201).json({ id: result.insertId, image_url });
  } catch (error) {
    res.status(500).json({ message: 'Error adding activity image' });
  }
});

app.delete('/api/activities/:id', authenticateToken, async (req, res) => {
  try {
    await pool.execute('DELETE FROM activities WHERE id = ?', [req.params.id]);
    res.json({ message: 'Activity image deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting activity image' });
  }
});

app.put('/api/activities/:id', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    const { caption } = req.body;
    const id = req.params.id;
    let query = 'UPDATE activities SET caption=?';
    let params = [caption || ''];
    if (req.file) {
      query += ', image_url=?';
      params.push('/uploads/' + req.file.filename);
    }
    query += ' WHERE id=?';
    params.push(id);
    await pool.execute(query, params);
    res.json({ message: 'Activity updated' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating activity' });
  }
});

// Gallery API
app.get('/api/gallery', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM gallery ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching gallery' });
  }
});

app.post('/api/gallery', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'Media file is required' });
    const media_url = '/uploads/' + req.file.filename;
    const media_type = req.file.mimetype.startsWith('video/') ? 'video' : 'image';
    const { caption, category } = req.body;
    const [result] = await pool.execute(
      'INSERT INTO gallery (image_url, caption, category, media_type) VALUES (?, ?, ?, ?)',
      [media_url, caption || '', category || '', media_type]
    );
    res.status(201).json({ id: result.insertId, image_url: media_url, media_type });
  } catch (error) {
    res.status(500).json({ message: 'Error adding media to gallery' });
  }
});

app.delete('/api/gallery/:id', authenticateToken, async (req, res) => {
  try {
    await pool.execute('DELETE FROM gallery WHERE id = ?', [req.params.id]);
    res.json({ message: 'Image deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting image' });
  }
});

app.put('/api/gallery/:id', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    const { caption, category } = req.body;
    const id = req.params.id;
    let query = 'UPDATE gallery SET caption=?, category=?';
    let params = [caption || '', category || ''];
    if (req.file) {
      query += ', image_url=?';
      params.push('/uploads/' + req.file.filename);
    }
    query += ' WHERE id=?';
    params.push(id);
    await pool.execute(query, params);
    res.json({ message: 'Gallery image updated' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating gallery image' });
  }
});

// Settings API
app.get('/api/settings', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM settings');
    const settings = {};
    rows.forEach(r => { settings[r.setting_key] = r.setting_value });
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching settings' });
  }
});

app.post('/api/settings/logo', authenticateToken, upload.single('logo'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'Logo file is required' });
    const logo_url = '/uploads/' + req.file.filename;
    await pool.execute(
      'INSERT INTO settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = ?',
      ['logo_url', logo_url, logo_url]
    );
    res.json({ message: 'Logo updated successfully', logo_url });
  } catch (error) {
    res.status(500).json({ message: 'Error updating logo' });
  }
});

app.post('/api/settings', authenticateToken, async (req, res) => {
  try {
    const { settings } = req.body;
    if (!settings || typeof settings !== 'object') {
      return res.status(400).json({ message: 'Invalid settings data' });
    }
    
    for (const [key, value] of Object.entries(settings)) {
      await pool.execute(
        'INSERT INTO settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = ?',
        [key, value, value]
      );
    }
    res.json({ message: 'Settings updated successfully' });
  } catch (error) {
    console.error('Settings update error:', error);
    res.status(500).json({ message: 'Error updating settings' });
  }
});

// Faculty API
app.get('/api/faculty', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM faculty ORDER BY created_at ASC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching faculty' });
  }
});

app.post('/api/faculty', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    const image_url = req.file ? '/uploads/' + req.file.filename : null;
    const { name, qualification, experience, display_mode, zoom, offset_x, offset_y } = req.body;
    
    if (!name) return res.status(400).json({ message: 'Name is required' });

    const [result] = await pool.execute(
      'INSERT INTO faculty (name, qualification, experience, image, display_mode, zoom, offset_x, offset_y) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [name, qualification || '', experience || '', image_url || '', display_mode || 'cover', zoom || 1.0, offset_x || 0, offset_y || 0]
    );
    res.status(201).json({ id: result.insertId, image_url });
  } catch (error) {
    res.status(500).json({ message: 'Error adding faculty member' });
  }
});

app.put('/api/faculty/:id', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    const { name, qualification, experience, display_mode, zoom, offset_x, offset_y } = req.body;
    const id = req.params.id;

    let query = 'UPDATE faculty SET name=?, qualification=?, experience=?, display_mode=?, zoom=?, offset_x=?, offset_y=?';
    let params = [name, qualification || '', experience || '', display_mode || 'cover', zoom || 1.0, offset_x || 0, offset_y || 0];

    if (req.file) {
      const image_url = '/uploads/' + req.file.filename;
      query += ', image=?';
      params.push(image_url);
    }

    query += ' WHERE id=?';
    params.push(id);

    const [result] = await pool.execute(query, params);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Faculty member not found' });
    }
    
    res.json({ message: 'Faculty member updated' });
  } catch (error) {
    console.error('Error updating faculty:', error);
    res.status(500).json({ message: 'Error updating faculty member' });
  }
});


app.delete('/api/faculty/:id', authenticateToken, async (req, res) => {
  try {
    console.log(`Attempting to delete faculty with ID: ${req.params.id}`);
    const [result] = await pool.execute('DELETE FROM faculty WHERE id = ?', [req.params.id]);
    console.log(`Delete result:`, result);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Faculty member not found' });
    }
    res.json({ message: 'Faculty member deleted' });
  } catch (error) {
    console.error(`Error deleting faculty ${req.params.id}:`, error);
    res.status(500).json({ message: 'Error deleting faculty member' });
  }
});

// Classes Offered API
app.get('/api/classes', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM classes_offered ORDER BY order_index ASC, id ASC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching classes' });
  }
});

app.post('/api/classes', authenticateToken, async (req, res) => {
  try {
    const { title, subtitle, description, icon, order_index } = req.body;
    if (!title) return res.status(400).json({ message: 'Title is required' });

    const [result] = await pool.execute(
      'INSERT INTO classes_offered (title, subtitle, description, icon, order_index) VALUES (?, ?, ?, ?, ?)',
      [title, subtitle || '', description || '', icon || 'BookOpen', order_index || 0]
    );
    res.status(201).json({ id: result.insertId });
  } catch (error) {
    res.status(500).json({ message: 'Error adding class' });
  }
});

app.put('/api/classes/:id', authenticateToken, async (req, res) => {
  try {
    const { title, subtitle, description, icon, order_index } = req.body;
    const id = req.params.id;

    if (!title) return res.status(400).json({ message: 'Title is required' });

    const [result] = await pool.execute(
      'UPDATE classes_offered SET title=?, subtitle=?, description=?, icon=?, order_index=? WHERE id=?',
      [title, subtitle || '', description || '', icon || 'BookOpen', order_index || 0, id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Class not found' });
    }
    res.json({ message: 'Class updated' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating class' });
  }
});

app.delete('/api/classes/:id', authenticateToken, async (req, res) => {
  try {
    const [result] = await pool.execute('DELETE FROM classes_offered WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Class not found' });
    }
    res.json({ message: 'Class deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting class' });
  }
});

// Courses API
app.get('/api/courses', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM courses ORDER BY order_index ASC, id ASC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching courses' });
  }
});

app.post('/api/courses', authenticateToken, async (req, res) => {
  try {
    const { name, class_level, subjects, duration, timing, color, order_index } = req.body;
    if (!name) return res.status(400).json({ message: 'Name is required' });

    const [result] = await pool.execute(
      'INSERT INTO courses (name, class_level, subjects, duration, timing, color, order_index) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, class_level || '', subjects || '', duration || '', timing || '', color || 'blue', order_index || 0]
    );
    res.status(201).json({ id: result.insertId });
  } catch (error) {
    res.status(500).json({ message: 'Error adding course' });
  }
});

app.put('/api/courses/:id', authenticateToken, async (req, res) => {
  try {
    const { name, class_level, subjects, duration, timing, color, order_index } = req.body;
    const id = req.params.id;

    if (!name) return res.status(400).json({ message: 'Name is required' });

    const [result] = await pool.execute(
      'UPDATE courses SET name=?, class_level=?, subjects=?, duration=?, timing=?, color=?, order_index=? WHERE id=?',
      [name, class_level || '', subjects || '', duration || '', timing || '', color || 'blue', order_index || 0, id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json({ message: 'Course updated' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating course' });
  }
});

app.delete('/api/courses/:id', authenticateToken, async (req, res) => {
  try {
    const [result] = await pool.execute('DELETE FROM courses WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json({ message: 'Course deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting course' });
  }
});

// Serve Static Frontend files in production
app.use(express.static(path.join(__dirname, '..', 'frontend', 'dist')));

// SPA Catch-all: serve index.html for all non-API routes
app.get(/^(?!\/api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'dist', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
