const express = require("express"); // import modul express
const bodyParser = require("body-parser"); // import modul body-parser
const { Pool } = require("pg"); // import modul pg(mengelola koneksi ke databse postgresql)

const app = express(); // membuat instance express
const port = 3000; // port untuk server

app.use(bodyParser.json()); // middleware untuk mengurai body request menjadi json

// PostgreSQL connection
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "Aplikasi",
  password: "emilda123",
  port: 5432,
});

// Basic route
app.get("/", (req, res) => {
  res.send("Hello World!");
});

//Route untuk mengambil data dari database
app.get("/reports", async (req, res) => {
  const { status, startDate, endDate, grup, lokasi } = req.query;
  console.log("Query params received:", { status, startDate, endDate, grup, lokasi });

  try {
    let query;
    let params = [];
    let paramCount = 1;

    if (status === "PRODUCTION") {
      query = `
        SELECT op.*, pr.*
        FROM operation_report op
        LEFT JOIN production_report pr ON op.id = pr.operation_report_id
        WHERE op.status = $${paramCount++}
      `;
      params.push("PRODUCTION");
    } else if (status === "HOUR_METER") {
      query = `
        SELECT op.*, hr.*
        FROM operation_report op
        LEFT JOIN hourmeter_report hr ON op.id = hr.operation_report_id
        WHERE op.status = $${paramCount++}
      `;
      params.push("HOUR_METER");
    } else {
      query = "SELECT * FROM operation_report WHERE 1=1";
    }

    // Filter berdasarkan rentang tanggal atau tanggal tunggal
    if (startDate && endDate) {
      query += ` AND op.tanggal BETWEEN $${paramCount++} AND $${paramCount++}`;
      params.push(startDate, endDate);
    } else if (startDate) {
      query += ` AND op.tanggal >= $${paramCount++}`;
      params.push(startDate);
    } else if (endDate) {
      query += ` AND op.tanggal <= $${paramCount++}`;
      params.push(endDate);
    }

    if (grup) {
      query += ` AND op.grup ILIKE $${paramCount++}`;
      params.push(`%${grup}%`);
    }
    if (lokasi) {
      query += ` AND op.lokasi ILIKE $${paramCount++}`;
      params.push(`%${lokasi}%`);
    }

    console.log("Final query:", query);
    console.log("Query params:", params);

    const result = await pool.query(query, params);
    console.log("Query result count:", result.rows.length);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching data", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Route untuk menambahkan operation_report
app.post("/operation-reports", async (req, res) => {
  const { tanggal, shift, grup, pengawas, lokasi, status, pic } = req.body; //mengambil data dari body request

  const client = await pool.connect(); //membuat koneksi ke database

  try {
    await client.query("BEGIN"); //memulai transaksi baru

    // Validasi input
    if (
      !tanggal ||
      !shift ||
      !grup ||
      !pengawas ||
      !lokasi ||
      !status ||
      !pic
    ) {
      throw new Error("Data operasi tidak lengkap");
    }

    // Validasi status
    if (status !== "PRODUCTION" && status !== "HOUR_METER") {
      throw new Error('Status harus berupa "PRODUCTION" atau "HOUR_METER"');
    }

    //menambahkan data ke table operation_report
    const operationResult = await client.query(
      "INSERT INTO operation_report(tanggal, shift, grup, pengawas, lokasi, status, pic) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id",
      [tanggal, shift, grup, pengawas, lokasi, status, pic]
    );

    const operationReportId = operationResult.rows[0].id; //mengambil id dari data yang baru ditambahkan

    await client.query("COMMIT"); //mengakhiri transaksi dan menyimpan perubahan ke database
    res
      .status(201)
      .json({
        message: "Operation report created successfully", //mengirim response berhasil
        operationReportId,
        status,
      });
  } catch (error) {
    await client.query("ROLLBACK"); //membatalkan transaksi jika terjadi error
    console.error("Error inserting operation data", error); //menampilkan error jika terjadi error
    res
      .status(400)
      .json({
        error: error.message || "Terjadi kesalahan saat menyimpan data operasi",
      });
  } finally {
    client.release(); //mengakhiri koneksi ke database
  }
});

// Route untuk menambahkan production_report
app.post("/production-reports", async (req, res) => {
  console.log("Received production report data:", req.body); //menampilkan data yang dikirim dari client
  const {
    alat,
    timbunan,
    material,
    jarak,
    tipe,
    ritase,
    operation_report_id,
  } = req.body; //mengambil data dari body request

  const client = await pool.connect(); //membuat koneksi ke database

  try {
    await client.query("BEGIN");

    // Validasi input
    const missingFields = []; //array untuk menyimpan field yang hilang
    if (!operation_report_id) missingFields.push("operation_report_id"); //mengecek apakah operation_report_id ada
    if (!alat) missingFields.push("alat"); //mengecek apakah alat ada
    if (!timbunan) missingFields.push("timbunan"); //mengecek apakah timbunan ada
    if (!material) missingFields.push("material"); //mengecek apakah material ada
    if (jarak === undefined) missingFields.push("jarak"); //mengecek apakah jarak ada
    if (!tipe) missingFields.push("tipe"); //mengecek apakah tipe ada
    if (ritase === undefined) missingFields.push("ritase"); //mengecek apakah ritase ada

    //mengecek apakah ada field yang hilang
    if (missingFields.length > 0) {
      throw new Error(
        `Data produksi tidak lengkap. Field yang hilang: ${missingFields.join(
          ", "
        )}`
      );
    }

    // Periksa apakah operation_report_id valid
    const operationCheck = await client.query(
      "SELECT id, status FROM operation_report WHERE id = $1", //mengecek apakah operation_report_id ada
      [operation_report_id]
    );
    if (operationCheck.rows.length === 0) {
      throw new Error("Operation report dengan ID tersebut tidak ditemukan");
    }
    if (operationCheck.rows[0].status !== "PRODUCTION") {
      throw new Error("Operation report ini bukan untuk production"); //mengecek apakah status operation_report_id adalah production
    }

    //menambahkan data ke table production_report
    const result = await client.query(
      "INSERT INTO production_report(alat, timbunan, material, jarak, tipe, ritase, operation_report_id) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id",
      [alat, timbunan, material, jarak, tipe, ritase, operation_report_id]
    );

    await client.query("COMMIT"); //mengakhiri transaksi dan menyimpan perubahan ke database

    res
      .status(201)
      .json({
        message: "Production report berhasil dibuat",
        id: result.rows[0].id, //mengirim response berhasil
      });
  } catch (error) {
    await client.query("ROLLBACK"); //membatalkan transaksi jika terjadi error
    console.error("Error saat menyisipkan data produksi:", error);
    res
      .status(400)
      .json({
        error:
          error.message || "Terjadi kesalahan saat menyimpan data produksi",
      });
  } finally {
    client.release(); //mengakhiri koneksi ke database
  }
});

// Route untuk menambahkan hourmeter_report
app.post("/hourmeter-reports", async (req, res) => {
  console.log("Received hourmeter report data:", req.body); //menampilkan data yang dikirim dari client
  const {
    operation_report_id,
    equipment,
    hm_awal,
    hm_akhir,
    jam_lain,
    breakdown,
    no_operator,
    hujan,
    ket,
  } = req.body;

  const client = await pool.connect(); //membuat koneksi ke database

  try {
    await client.query("BEGIN");

    // Validasi input
    const missingFields = [];
    if (!operation_report_id) missingFields.push("operation_report_id");
    if (!equipment) missingFields.push("equipment");
    if (hm_awal === undefined) missingFields.push("hm_awal");
    if (hm_akhir === undefined) missingFields.push("hm_akhir");
    if (jam_lain === undefined) missingFields.push("jam_lain");
    if (breakdown === undefined) missingFields.push("breakdown");
    if (no_operator === undefined) missingFields.push("no_operator");
    if (hujan === undefined) missingFields.push("hujan");
    if (ket === undefined) missingFields.push("ket");

    //mengecek apakah ada field yang hilang
    if (missingFields.length > 0) {
      throw new Error(
        `Data hour meter tidak lengkap. Field yang hilang: ${missingFields.join(
          ", "
        )}`
      );
    }

    // Validasi tipe data
    if (typeof equipment !== "string" || equipment.length > 100) {
      throw new Error(
        "Equipment harus berupa string dengan panjang maksimal 100 karakter"
      );
    }
    if (typeof ket !== "string" || ket.length > 100) {
      throw new Error(
        "Ket harus berupa string dengan panjang maksimal 100 karakter"
      );
    }

    //mengecek apakah field yang diinput berupa angka
    const doubleFields = [
      "hm_awal",
      "hm_akhir",
      "jam_lain",
      "breakdown",
      "no_operator",
      "hujan",
    ];
    for (const field of doubleFields) {
      if (isNaN(parseFloat(req.body[field]))) {
        throw new Error(`${field} harus berupa angka`);
      }
    }

    // Periksa apakah operation_report_id valid
    const operationCheck = await client.query(
      "SELECT id, status FROM operation_report WHERE id = $1",
      [operation_report_id]
    );
    if (operationCheck.rows.length === 0) {
      throw new Error("Operation report dengan ID tersebut tidak ditemukan");
    }

    const result = await client.query(
      "INSERT INTO hourmeter_report(operation_report_id, equipment, hm_awal, hm_akhir, jam_lain, breakdown, no_operator, hujan, ket) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id",
      [
        operation_report_id,
        equipment,
        hm_awal,
        hm_akhir,
        jam_lain,
        breakdown,
        no_operator,
        hujan,
        ket,
      ]
    );
    if (operationCheck.rows[0].status !== "HOUR_METER") {
      throw new Error("Operation report ini bukan untuk hour meter");
    }

    await client.query("COMMIT");
    res
      .status(201)
      .json({
        message: "Hour Meter report berhasil dibuat",
        id: result.rows[0].id,
      });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error saat menyisipkan data produksi:", error);
    res
      .status(400)
      .json({
        error:
          error.message || "Terjadi kesalahan saat menyimpan data produksi",
      });
  } finally {
    client.release();
  }
});

// Route untuk mengupdate report
// app.put('/reports/:id', async (req, res) => {
//     const id = parseInt(req.params.id);
//     const { tanggal, shift, grup, pengawas, lokasi, status, pic, productions } = req.body;

//     const client = await pool.connect();

//     try {
//         await client.query('BEGIN');

//         await client.query(
//             'UPDATE operation_report SET tanggal = $1, shift = $2, grup = $3, pengawas = $4, lokasi = $5, status = $6, pic = $7 WHERE id = $8',
//             [tanggal, shift, grup, pengawas, lokasi, status, pic, id]
//         );

//         // Hapus production_report yang lama
//         await client.query('DELETE FROM production_report WHERE operation_report_id = $1', [id]);

//         // Tambahkan production_report yang baru
//         for (const production of productions) {
//             const { alat, timbunan, material, jarak, tipe, ritase } = production;
//             await client.query(
//                 'INSERT INTO production_report(alat, timbunan, material, jarak, tipe, ritase, operation_report_id) VALUES($1, $2, $3, $4, $5, $6, $7)',
//                 [alat, timbunan, material, jarak, tipe, ritase, id]
//             );
//         }

//         await client.query('COMMIT');
//         res.json({ message: 'Report updated successfully' });
//     } catch (error) {
//         await client.query('ROLLBACK');
//         console.error('Error updating data', error);
//         res.status(500).send('Server error');
//     } finally {
//         client.release();
//     }
// });

// Route untuk menghapus report
// app.delete('/reports/:id', async (req, res) => {
//     const id = parseInt(req.params.id);

//     const client = await pool.connect();

//     try {
//         await client.query('BEGIN');

//         // Hapus production_report terkait
//         await client.query('DELETE FROM production_report WHERE operation_report_id = $1', [id]);

//         // Hapus operation_report
//         await client.query('DELETE FROM operation_report WHERE id = $1', [id]);

//         await client.query('COMMIT');
//         res.status(204).send();
//     } catch (error) {
//         await client.query('ROLLBACK');
//         console.error('Error deleting data', error);
//         res.status(500).send('Server error');
//     } finally {
//         client.release();
//     }
// });

app.listen(port, () => {
  console.log(`Server running at http://192.168.1.69:${port}`);
});
