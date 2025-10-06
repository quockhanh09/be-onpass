require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const sql = require('mssql');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const cors = require('cors');

app.use(cors({
    origin: 'http://localhost:5173', // allow your frontend
    methods: ['GET','POST','PUT','DELETE'],
}));

const config = {
    server: process.env.DB_SERVER || "192.168.1.123",
    database: process.env.DB_DATABASE || "TuVanKhachHang",
    user: process.env.DB_USER || "users",
    password: process.env.DB_PASSWORD || "1234",
    options: { encrypt: true, trustServerCertificate: true },
    pool: { max: 10, min: 0, idleTimeoutMillis: 30000 }
};

app.post('/api/tuvan', async (req, res) => {
    const { TenDichVu, TenHinhThuc, HoTen, MaVung, SoDienThoai } = req.body;

    if (!HoTen || !MaVung || !SoDienThoai) {
        return res.status(400).json({ error: "Thiếu dữ liệu bắt buộc" });
    }

    try {
        const pool = await sql.connect(config);

        await pool.request()
            .input('TenDichVu', sql.NVarChar, TenDichVu || null)
            .input('TenHinhThuc', sql.NVarChar, TenHinhThuc || '')
            .input('HoTen', sql.NVarChar, HoTen)
            .input('MaVung', sql.NVarChar, MaVung)
            .input('SoDienThoai', sql.NVarChar, SoDienThoai)
            .query(`
                INSERT INTO YeuCau 
                (TenDichVu, TenHinhThuc, HoTen, MaVung, SoDienThoai, NgayTao)
                VALUES 
                (@TenDichVu, @TenHinhThuc, @HoTen, @MaVung, @SoDienThoai, GETDATE())
            `);

        const result = await pool.request()
            .query('SELECT TOP 1 * FROM YeuCau ORDER BY YeuCauID DESC');

        res.json({ message: "✅ Lưu thành công!", data: result.recordset });
    } catch (err) {
        console.error("DB error:", err);
        res.status(500).json({ error: err.message });
    }
});


app.post('/api/tuvanemail', async (req, res) => {
    const { TenDichVu, HoTen, Email, MaVung, SoDienThoai, TieuDe, NoiDung, HinhThucID } = req.body;

    if (!HoTen || !MaVung || !SoDienThoai || !Email || !TieuDe || !NoiDung) {
        return res.status(400).json({ error: "Thiếu dữ liệu bắt buộc" });
    }

    try {
        const pool = await sql.connect(config);

        const idHinhThuc = HinhThucID || 3; 

        const hinhThucResult = await pool.request()
            .input('HinhThucID', sql.Int, idHinhThuc)
            .query('SELECT TenHinhThuc FROM HinhThucTuVan WHERE HinhThucID = @HinhThucID');

        const TenHinhThuc = hinhThucResult.recordset[0]?.TenHinhThuc || '';

        await pool.request()
            .input('TenDichVu', sql.NVarChar, TenDichVu || null)
            .input('TenHinhThuc', sql.NVarChar, TenHinhThuc)
            .input('HoTen', sql.NVarChar, HoTen)
            .input('Email', sql.NVarChar, Email)
            .input('MaVung', sql.NVarChar, MaVung)
            .input('SoDienThoai', sql.NVarChar, SoDienThoai)
            .input('TieuDe', sql.NVarChar, TieuDe)
            .input('NoiDung', sql.NVarChar, NoiDung)
            .input('HinhThucID', sql.Int, idHinhThuc)
            .query(`
                INSERT INTO YeuCau 
                (TenDichVu, TenHinhThuc, HoTen, Email, MaVung, SoDienThoai, TieuDe, NoiDung, HinhThucID, NgayTao)
                VALUES 
                (@TenDichVu, @TenHinhThuc, @HoTen, @Email, @MaVung, @SoDienThoai, @TieuDe, @NoiDung, @HinhThucID, GETDATE())
            `);

        const result = await pool.request()
            .query('SELECT TOP 1 * FROM YeuCau ORDER BY YeuCauID DESC');

        res.json({ message: "✅ Lưu thành công!", data: result.recordset });

    } catch (err) {
        console.error("DB error:", err);
        res.status(500).json({ error: err.message });
    }
});


app.post('/api/tuvangoidien', async (req, res) => {
    const { TenDichVu, HoTen, Email, MaVung, SoDienThoai, HinhThucID } = req.body;

    if (!HoTen || !MaVung || !SoDienThoai || !Email) {
        return res.status(400).json({ error: "Thiếu dữ liệu bắt buộc" });
    }

    try {
        const pool = await sql.connect(config);

        const idHinhThuc = HinhThucID || 2; 
        const hinhThucResult = await pool.request()
            .input('HinhThucID', sql.Int, idHinhThuc)
            .query('SELECT TenHinhThuc FROM HinhThucTuVan WHERE HinhThucID = @HinhThucID');

        const TenHinhThuc = hinhThucResult.recordset[0]?.TenHinhThuc || '';

        await pool.request()
            .input('TenDichVu', sql.NVarChar, TenDichVu || null)
            .input('TenHinhThuc', sql.NVarChar, TenHinhThuc)
            .input('HoTen', sql.NVarChar, HoTen)
            .input('Email', sql.NVarChar, Email)
            .input('MaVung', sql.NVarChar, MaVung)
            .input('SoDienThoai', sql.NVarChar, SoDienThoai)
            .input('HinhThucID', sql.Int, idHinhThuc)
            .query(`
                INSERT INTO YeuCau 
                (TenDichVu, TenHinhThuc, HoTen, Email, MaVung, SoDienThoai, HinhThucID, NgayTao)
                VALUES 
                (@TenDichVu, @TenHinhThuc, @HoTen, @Email, @MaVung, @SoDienThoai, @HinhThucID, GETDATE())
            `);

        const result = await pool.request()
            .query('SELECT TOP 1 * FROM YeuCau ORDER BY YeuCauID DESC');

        res.json({ message: "✅ Lưu thành công!", data: result.recordset });

    } catch (err) {
        console.error("DB error:", err);
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/tuvantructiep', async (req, res) => {
    const { TenDichVu, HoTen, Email, MaVung, SoDienThoai, ChonNgay, Gio } = req.body;

  
    if (!HoTen || !MaVung || !SoDienThoai || !Email || !ChonNgay || !Gio) {
        return res.status(400).json({ error: "Thiếu dữ liệu bắt buộc" });
    }

    try {
        const pool = await sql.connect(config);
        const idHinhThuc = 4; 

        const hinhThucResult = await pool.request()
            .input('HinhThucID', sql.Int, idHinhThuc)
            .query('SELECT TenHinhThuc FROM HinhThucTuVan WHERE HinhThucID = @HinhThucID');
        const TenHinhThuc = hinhThucResult.recordset[0]?.TenHinhThuc || '';

      
        const [h, m] = Gio.split(':').map(Number);
        const GioSQL = new Date();
        GioSQL.setHours(h, m, 0, 0);

    
        await pool.request()
            .input('TenDichVu', sql.NVarChar, TenDichVu || null)
            .input('TenHinhThuc', sql.NVarChar, TenHinhThuc)
            .input('HoTen', sql.NVarChar, HoTen)
            .input('Email', sql.NVarChar, Email)
            .input('MaVung', sql.NVarChar, MaVung)
            .input('SoDienThoai', sql.NVarChar, SoDienThoai)
            .input('HinhThucID', sql.Int, idHinhThuc)
            .input('ChonNgay', sql.Date, ChonNgay)
            .input('Gio', sql.Time(0), GioSQL)
            .query(`
                INSERT INTO YeuCau 
                (TenDichVu, TenHinhThuc, HoTen, Email, MaVung, SoDienThoai, HinhThucID, ChonNgay, Gio, NgayTao)
                VALUES 
                (@TenDichVu, @TenHinhThuc, @HoTen, @Email, @MaVung, @SoDienThoai, @HinhThucID, @ChonNgay, @Gio, GETDATE())
            `);

   
        const result = await pool.request()
            .query('SELECT TOP 1 * FROM YeuCau ORDER BY YeuCauID DESC');

        res.json({ message: "✅ Lưu thành công!", data: result.recordset });

    } catch (err) {
        console.error("DB error:", err);
        res.status(500).json({ error: err.message });
    }
});


const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server chạy port ${port}`));

process.on('SIGINT', async () => {
    try { await sql.close(); } catch(e){/*ignore*/ }
    process.exit();
});
