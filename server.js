const express = require("express");
const bodyParser = require("body-parser");
const { Pool } = require("pg");

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// PostgreSQL connection
// const pool = new Pool({
//   user: "postgres",
//   host: "localhost",
//   database: "Aplikasi",
//   password: "emilda123",
//   port: 5432,
// });

const pool = new Pool({
     connectionString: process.env.DATABASE_URL,
     ssl: {
       rejectUnauthorized: false
     }
   });

// Basic route
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/reports", async (req, res) => {
  const { status, tanggal, grup, lokasi } = req.query;

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

    if (tanggal) {
      query += ` AND op.tanggal = $${paramCount++}`;
      params.push(tanggal);
    }
    if (grup) {
      query += ` AND op.grup ILIKE $${paramCount++}`;
      params.push(`%${grup}%`);
    }
    if (lokasi) {
      query += ` AND op.lokasi ILIKE $${paramCount++}`;
      params.push(`%${lokasi}%`);
    }

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching data", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Route untuk menambahkan operation_report
app.post("/operation-reports", async (req, res) => {
  const { tanggal, shift, grup, pengawas, lokasi, status, pic } = req.body;

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

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

    const operationResult = await client.query(
      "INSERT INTO operation_report(tanggal, shift, grup, pengawas, lokasi, status, pic) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id",
      [tanggal, shift, grup, pengawas, lokasi, status, pic]
    );

    const operationReportId = operationResult.rows[0].id;

    await client.query("COMMIT");
    res
      .status(201)
      .json({
        message: "Operation report created successfully",
        operationReportId,
        status,
      });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error inserting operation data", error);
    res
      .status(400)
      .json({
        error: error.message || "Terjadi kesalahan saat menyimpan data operasi",
      });
  } finally {
    client.release();
  }
});

// Route untuk menambahkan production_report
app.post("/production-reports", async (req, res) => {
  console.log("Received production report data:", req.body);
  const {
    alat,
    timbunan,
    material,
    jarak,
    tipe,
    ritase,
    operation_report_id,
  } = req.body;

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Validasi input
    const missingFields = [];
    if (!operation_report_id) missingFields.push("operation_report_id");
    if (!alat) missingFields.push("alat");
    if (!timbunan) missingFields.push("timbunan");
    if (!material) missingFields.push("material");
    if (jarak === undefined) missingFields.push("jarak");
    if (!tipe) missingFields.push("tipe");
    if (ritase === undefined) missingFields.push("ritase");

    if (missingFields.length > 0) {
      throw new Error(
        `Data produksi tidak lengkap. Field yang hilang: ${missingFields.join(
          ", "
        )}`
      );
    }

    // Periksa apakah operation_report_id valid
    const operationCheck = await client.query(
      "SELECT id, status FROM operation_report WHERE id = $1",
      [operation_report_id]
    );
    if (operationCheck.rows.length === 0) {
      throw new Error("Operation report dengan ID tersebut tidak ditemukan");
    }
    if (operationCheck.rows[0].status !== "PRODUCTION") {
      throw new Error("Operation report ini bukan untuk production");
    }

    const result = await client.query(
      "INSERT INTO production_report(alat, timbunan, material, jarak, tipe, ritase, operation_report_id) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id",
      [alat, timbunan, material, jarak, tipe, ritase, operation_report_id]
    );

    await client.query("COMMIT");
    res
      .status(201)
      .json({
        message: "Production report berhasil dibuat",
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

app.post("/hourmeter-reports", async (req, res) => {
  console.log("Received production report data:", req.body);
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

  const client = await pool.connect();

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
     console.log(`Server running on port ${port}`);
   });
