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

//Basic route
app.get("/", (req, res) => {
  res.send("Hello World!");
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
    res.status(201).json({
      message: "Operation report created successfully", //mengirim response berhasil
      operationReportId,
      status,
    });
  } catch (error) {
    await client.query("ROLLBACK"); //membatalkan transaksi jika terjadi error
    console.error("Error inserting operation data", error); //menampilkan error jika terjadi error
    res.status(400).json({
      error: error.message || "Terjadi kesalahan saat menyimpan data operasi",
    });
  } finally {
    client.release(); //mengakhiri koneksi ke database
  }
});

// Route untuk menampilkan semua data dari operation_report
app.get("/operation-reports", async (req, res) => {
  try {
    const { startDate, endDate, grup, lokasi } = req.query;
    let query = "SELECT * FROM operation_report WHERE 1=1";
    const params = [];
    let paramCount = 1;

    if (startDate && endDate) {
      query += ` AND tanggal BETWEEN $${paramCount++} AND $${paramCount++}`;
      params.push(startDate, endDate);
    } else if (startDate) {
      query += ` AND tanggal >= $${paramCount++}`;
      params.push(startDate);
    } else if (endDate) {
      query += ` AND tanggal <= $${paramCount++}`;
      params.push(endDate);
    }

    if (grup) {
      query += ` AND grup ILIKE $${paramCount++}`;
      params.push(`%${grup}%`);
    }

    if (lokasi) {
      query += ` AND lokasi ILIKE $${paramCount++}`;
      params.push(`%${lokasi}%`);
    }

    query += " ORDER BY tanggal DESC";

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching operation reports", error);
    res
      .status(500)
      .json({
        error: "Terjadi kesalahan saat mengambil data operation report",
      });
  }
});

// Route untuk menampilkan data operation_report berdasarkan ID
app.get("/operation-reports/:id", async (req, res) => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ error: "ID tidak valid" });
  }

  try {
    const result = await pool.query(
      "SELECT * FROM operation_report WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ error: "Operation report tidak ditemukan" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching operation report", error);
    res
      .status(500)
      .json({
        error: "Terjadi kesalahan saat mengambil data operation report",
      });
  }
});

// app.put('/operation-reports/:id', async (req, res) => {
//   const id = parseInt(req.params.id);
//   const { shift, grup, pengawas, lokasi, pic } = req.body;

//   console.log("Received data:", { id, shift, grup, pengawas, lokasi, pic });

//   const client = await pool.connect();

//   try {
//     await client.query('BEGIN');

//     // Periksa apakah operation_report dengan ID tersebut ada
//     const checkResult = await client.query('SELECT * FROM operation_report WHERE id = $1', [id]);
//     if (checkResult.rows.length === 0) {
//       throw new Error('Operation report tidak ditemukan');
//     }

//     const existingStatus = checkResult.rows[0].status;
//     const existingTanggal = checkResult.rows[0].tanggal;

//     // Update operation_report tanpa mengubah tanggal dan status
//     const updateQuery = `
//       UPDATE operation_report
//       SET shift = $1, grup = $2, pengawas = $3, lokasi = $4, pic = $5
//       WHERE id = $6
//       RETURNING *
//     `;
//     const updateValues = [shift, grup, pengawas, lokasi, pic, id];
//     console.log("Update query:", updateQuery);
//     console.log("Update values:", updateValues);

//     const updateResult = await client.query(updateQuery, updateValues);

//     console.log("Update result:", updateResult.rows[0]);

//     // Update grup dan lokasi di production_report atau hourmeter_report yang terkait
//     if (existingStatus === 'PRODUCTION') {
//       await client.query(
//         'UPDATE production_report SET grup = $1, lokasi = $2 WHERE operation_report_id = $3',
//         [grup, lokasi, id]
//       );
//     } else if (existingStatus === 'HOUR_METER') {
//       await client.query(
//         'UPDATE hourmeter_report SET grup = $1, lokasi = $2 WHERE operation_report_id = $3',
//         [grup, lokasi, id]
//       );
//     }

//     await client.query('COMMIT');
//     res.json({
//       message: 'Operation report berhasil diperbarui',
//       updatedReport: {
//         ...updateResult.rows[0],
//         tanggal: existingTanggal,
//         status: existingStatus
//       }
//     });
//   } catch (error) {
//     await client.query('ROLLBACK');
//     console.error('Error updating operation data', error);
//     res.status(500).json({
//       error: 'Terjadi kesalahan server saat memperbarui data operasi',
//       details: error.message,
//       stack: error.stack
//     });
//   } finally {
//     client.release();
//   }
// });

//Route untuk mengambil data dari database
app.get("/reports", async (req, res) => {
  const { status, startDate, endDate, grup, lokasi } = req.query;
  console.log("Query params received:", {
    status,
    startDate,
    endDate,
    grup,
    lokasi,
  });

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

    res.status(201).json({
      message: "Production report berhasil dibuat",
      id: result.rows[0].id, //mengirim response berhasil
    });
  } catch (error) {
    await client.query("ROLLBACK"); //membatalkan transaksi jika terjadi error
    console.error("Error saat menyisipkan data produksi:", error);
    res.status(400).json({
      error: error.message || "Terjadi kesalahan saat menyimpan data produksi",
    });
  } finally {
    client.release(); //mengakhiri koneksi ke database
  }
});

app.put("/production-reports/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const { alat, timbunan, material, jarak, tipe, ritase } = req.body;

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Periksa apakah production_report dengan ID tersebut ada
    const checkResult = await client.query(
      "SELECT * FROM production_report WHERE id = $1",
      [id]
    );
    if (checkResult.rows.length === 0) {
      throw new Error("Production report tidak ditemukan");
    }

    // Update production_report
    await client.query(
      "UPDATE production_report SET alat = $1, timbunan = $2, material = $3, jarak = $4, tipe = $5, ritase = $6 WHERE id = $7",
      [alat, timbunan, material, jarak, tipe, ritase, id]
    );

    await client.query("COMMIT");
    res.json({ message: "Production report berhasil diperbarui" });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error updating production data", error);
    res
      .status(500)
      .json({
        error: "Terjadi kesalahan server saat memperbarui data produksi",
      });
  } finally {
    client.release();
  }
});

// Endpoint untuk menghapus satu entri production_report
app.delete("/production-reports/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  console.log("Attempting to delete production report with ID:", id);

  if (isNaN(id)) {
    console.error("Invalid ID:", req.params.id);
    res.status(400).json({ error: "ID laporan produksi tidak valid" });
    return;
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Periksa apakah laporan produksi ada
    const checkResult = await client.query(
      "SELECT * FROM production_report WHERE id = $1",
      [id]
    );
    console.log("Check result:", checkResult.rows);
    if (checkResult.rows.length === 0) {
      console.log("Production report not found in database");
      await client.query("ROLLBACK");
      res.status(404).json({ error: "Laporan produksi tidak ditemukan" });
      return;
    }

    const operationReportId = checkResult.rows[0].operation_report_id;

    // Hapus production_report
    const deleteProductionResult = await client.query(
      "DELETE FROM production_report WHERE id = $1",
      [id]
    );
    console.log(
      `Deleted ${deleteProductionResult.rowCount} production report(s)`
    );

    if (deleteProductionResult.rowCount === 0) {
      console.log("Failed to delete production report");
      throw new Error("Gagal menghapus laporan produksi");
    }

    // Periksa apakah masih ada production_report lain untuk operation_report yang sama
    const remainingProductionReports = await client.query(
      "SELECT COUNT(*) FROM production_report WHERE operation_report_id = $1",
      [operationReportId]
    );

    if (parseInt(remainingProductionReports.rows[0].count) === 0) {
      // Jika tidak ada lagi production_report, hapus operation_report terkait
      const deleteOperationResult = await client.query(
        "DELETE FROM operation_report WHERE id = $1",
        [operationReportId]
      );
      console.log(
        `Deleted ${deleteOperationResult.rowCount} operation report(s)`
      );
    } else {
      console.log(
        `${remainingProductionReports.rows[0].count} production report(s) still associated with operation report ${operationReportId}`
      );
    }

    await client.query("COMMIT");
    console.log("Delete operation successful");
    res.json({ message: "Laporan produksi berhasil dihapus" });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error deleting data", error);
    res
      .status(500)
      .json({ error: "Terjadi kesalahan server saat menghapus data" });
  } finally {
    client.release();
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
    res.status(201).json({
      message: "Hour Meter report berhasil dibuat",
      id: result.rows[0].id,
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error saat menyisipkan data produksi:", error);
    res.status(400).json({
      error: error.message || "Terjadi kesalahan saat menyimpan data produksi",
    });
  } finally {
    client.release();
  }
});

app.put("/hourmeter-reports/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const {
    equipment,
    hm_awal,
    hm_akhir,
    jam_lain,
    breakdown,
    no_operator,
    hujan,
    ket,
  } = req.body;

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Periksa apakah hourmeter_report dengan ID tersebut ada
    const checkResult = await client.query(
      "SELECT * FROM hourmeter_report WHERE id = $1",
      [id]
    );
    if (checkResult.rows.length === 0) {
      throw new Error("Hourmeter report tidak ditemukan");
    }

    // Update hourmeter_report
    await client.query(
      "UPDATE hourmeter_report SET equipment = $1, hm_awal = $2, hm_akhir = $3, jam_lain = $4, breakdown = $5, no_operator = $6, hujan = $7, ket = $8 WHERE id = $9",
      [
        equipment,
        hm_awal,
        hm_akhir,
        jam_lain,
        breakdown,
        no_operator,
        hujan,
        ket,
        id,
      ]
    );

    await client.query("COMMIT");
    res.json({ message: "Hourmeter report berhasil diperbarui" });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error updating hourmeter data", error);
    res
      .status(500)
      .json({
        error: "Terjadi kesalahan server saat memperbarui data hourmeter",
      });
  } finally {
    client.release();
  }
});

// Endpoint untuk menghapus satu entri hourmeter_report
app.delete("/hourmeter-reports/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  console.log("Attempting to delete hourmeter report with ID:", id);

  if (isNaN(id)) {
    console.error("Invalid ID:", req.params.id);
    res.status(400).json({ error: "ID laporan hourmeter tidak valid" });
    return;
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Periksa apakah laporan hourmeter ada
    const checkResult = await client.query(
      "SELECT * FROM hourmeter_report WHERE id = $1",
      [id]
    );
    console.log("Check result:", checkResult.rows);
    if (checkResult.rows.length === 0) {
      console.log("Hourmeter report not found in database");
      await client.query("ROLLBACK");
      res.status(404).json({ error: "Laporan hourmeter tidak ditemukan" });
      return;
    }

    const operationReportId = checkResult.rows[0].operation_report_id;

    // Hapus hourmeter_report
    const deleteHourmeterResult = await client.query(
      "DELETE FROM hourmeter_report WHERE id = $1",
      [id]
    );
    console.log(
      `Deleted ${deleteHourmeterResult.rowCount} hourmeter report(s)`
    );

    if (deleteHourmeterResult.rowCount === 0) {
      console.log("Failed to delete hourmeter report");
      throw new Error("Gagal menghapus laporan hourmeter");
    }

    // Periksa apakah masih ada hourmeter_report lain untuk operation_report yang sama
    const remainingHourmeterReports = await client.query(
      "SELECT COUNT(*) FROM hourmeter_report WHERE operation_report_id = $1",
      [operationReportId]
    );

    if (parseInt(remainingHourmeterReports.rows[0].count) === 0) {
      // Jika tidak ada lagi hourmeter_report, hapus operation_report terkait
      const deleteOperationResult = await client.query(
        "DELETE FROM operation_report WHERE id = $1",
        [operationReportId]
      );
      console.log(
        `Deleted ${deleteOperationResult.rowCount} operation report(s)`
      );
    } else {
      console.log(
        `${remainingHourmeterReports.rows[0].count} hourmeter report(s) still associated with operation report ${operationReportId}`
      );
    }

    await client.query("COMMIT");
    console.log("Delete operation successful");
    res.json({ message: "Laporan hourmeter berhasil dihapus" });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error deleting hourmeter data", error);
    res
      .status(500)
      .json({
        error: "Terjadi kesalahan server saat menghapus data hourmeter",
      });
  } finally {
    client.release();
  }
});

console.log("Registered routes:");
app._router.stack.forEach(function (r) {
  if (r.route && r.route.path) {
    console.log(r.route.stack[0].method.toUpperCase(), r.route.path);
  }
});

app.listen(port, () => {
  console.log(`Server running at http://192.168.100.129:${port}`);
});
