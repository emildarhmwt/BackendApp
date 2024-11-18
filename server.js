const express = require("express"); // import modul express
const bodyParser = require("body-parser"); // import modul body-parser
const { Pool } = require("pg"); // import modul pg(mengelola koneksi ke databse postgresql)
const app = express(); // membuat instance express
const port = 3000; // port untuk server
const bcrypt = require("bcrypt");

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

app.get("/users", async (req, res) => {
  try {
    const result = await pool.query("SELECT id, username FROM user_report");
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching user data", error);
    res.status(500).json({
      error: "Terjadi kesalahan saat mengambil data user",
    });
  }
});

app.get("/muatan", async (req, res) => {
  try {
    const result = await pool.query("SELECT id, tipe, jumlah FROM muatan");
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching user data", error);
    res.status(500).json({
      error: "Terjadi kesalahan saat mengambil data muatan",
    });
  }
});

app.get("/equipment", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, equipment, tipe_unit FROM equipment"
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching equipment data", error);
    res.status(500).json({
      error: "Terjadi kesalahan saat mengambil data equipment",
    });
  }
});

app.get("/lokasi", async (req, res) => {
  try {
    const result = await pool.query("SELECT id, lokasi FROM lokasi");
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching lokasi data", error);
    res.status(500).json({
      error: "Terjadi kesalahan saat mengambil data lokasi",
    });
  }
});

app.get("/pengawas", async (req, res) => {
  try {
    const result = await pool.query("SELECT id, nama FROM barcode_pengawas");
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching data", error);
    res.status(500).json({
      error: "Terjadi kesalahan saat mengambil data",
    });
  }
});

app.get("/pengawas-ttd", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, jabatan, nama, nip, name, file_path FROM barcode_pengawas"
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching data", error);
    res.status(500).json({
      error: "Terjadi kesalahan saat mengambil data",
    });
  }
});

app.get("/kontraktor-ttd", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, jabatan, nama, nip, name, file_path FROM barcode_kontraktor"
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching data", error);
    res.status(500).json({
      error: "Terjadi kesalahan saat mengambil data",
    });
  }
});

app.get("/kontraktor", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, username FROM kontraktor_report"
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching data", error);
    res.status(500).json({
      error: "Terjadi kesalahan saat mengambil data",
    });
  }
});

app.get("/grup", async (req, res) => {
  try {
    const result = await pool.query("SELECT id, grup FROM grup");
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching data", error);
    res.status(500).json({
      error: "Terjadi kesalahan saat mengambil data",
    });
  }
});

app.get("/shift", async (req, res) => {
  try {
    const result = await pool.query("SELECT id, shift FROM shift");
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching data", error);
    res.status(500).json({
      error: "Terjadi kesalahan saat mengambil data",
    });
  }
});

app.get("/executor", async (req, res) => {
  try {
    const result = await pool.query("SELECT id, executor FROM executor");
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching data", error);
    res.status(500).json({
      error: "Terjadi kesalahan saat mengambil data",
    });
  }
});

app.get("/alat", async (req, res) => {
  try {
    const result = await pool.query("SELECT id, alat FROM alat");
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching data", error);
    res.status(500).json({
      error: "Terjadi kesalahan saat mengambil data",
    });
  }
});

app.get("/timbunan", async (req, res) => {
  try {
    const result = await pool.query("SELECT id, timbunan FROM timbunan");
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching data", error);
    res.status(500).json({
      error: "Terjadi kesalahan saat mengambil data",
    });
  }
});

app.get("/material", async (req, res) => {
  try {
    const result = await pool.query("SELECT id, material FROM material");
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching data", error);
    res.status(500).json({
      error: "Terjadi kesalahan saat mengambil data",
    });
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
    if (status !== "Produksi" && status !== "Jam Jalan") {
      throw new Error('Status harus berupa "Produksi" atau "Jam Jalan"');
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
// app.get("/operation-reports", async (req, res) => {
//   try {
//     const { startDate, endDate, grup, lokasi } = req.query;
//     let query = "SELECT * FROM operation_report WHERE 1=1";
//     const params = [];
//     let paramCount = 1;

//     if (startDate && endDate) {
//       query += ` AND tanggal BETWEEN $${paramCount++} AND $${paramCount++}`;
//       params.push(startDate, endDate);
//     } else if (startDate) {
//       query += ` AND tanggal >= $${paramCount++}`;
//       params.push(startDate);
//     } else if (endDate) {
//       query += ` AND tanggal <= $${paramCount++}`;
//       params.push(endDate);
//     }

//     if (grup) {
//       query += ` AND grup ILIKE $${paramCount++}`;
//       params.push(`%${grup}%`);
//     }

//     if (lokasi) {
//       query += ` AND lokasi ILIKE $${paramCount++}`;
//       params.push(`%${lokasi}%`);
//     }

//     query += " ORDER BY tanggal DESC";

//     const result = await pool.query(query, params);
//     res.json(result.rows);
//   } catch (error) {
//     console.error("Error fetching operation reports", error);
//     res.status(500).json({
//       error: "Terjadi kesalahan saat mengambil data operation report",
//     });
//   }
// });

// Route untuk menampilkan data operation_report berdasarkan ID
// app.get("/operation-reports/:id", async (req, res) => {
//   const id = parseInt(req.params.id);

//   if (isNaN(id)) {
//     return res.status(400).json({ error: "ID tidak valid" });
//   }

//   try {
//     const result = await pool.query(
//       "SELECT * FROM operation_report WHERE id = $1",
//       [id]
//     );

//     if (result.rows.length === 0) {
//       return res
//         .status(404)
//         .json({ error: "Operation report tidak ditemukan" });
//     }

//     res.json(result.rows[0]);
//   } catch (error) {
//     console.error("Error fetching operation report", error);
//     res.status(500).json({
//       error: "Terjadi kesalahan saat mengambil data operation report",
//     });
//   }
// });

//Route untuk mengambil data dari database
app.get("/reports", async (req, res) => {
  const { status, startDate, endDate } = req.query;
  console.log("Query params received:", {
    status,
    startDate,
    endDate,
  });

  try {
    let query;
    let params = [];
    let paramCount = 1;

    if (status === "Produksi") {
      query = `
        SELECT op.*, pr.*
        FROM operation_report op
        LEFT JOIN production_report pr ON op.id = pr.operation_report_id
        WHERE op.status = $${paramCount++}
      `;
      params.push("Produksi");
    } else if (status === "Jam Jalan") {
      query = `
        SELECT op.*, hr.*
        FROM operation_report op
        LEFT JOIN hourmeter_report hr ON op.id = hr.operation_report_id
        WHERE op.status = $${paramCount++}
      `;
      params.push("Jam Jalan");
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
    excecutor,
    alat,
    timbunan,
    material,
    jarak,
    tipe,
    ritase,
    muatan,
    volume,
    tipe2,
    ritase2,
    muatan2,
    volume2,
    totalRitase,
    totalVolume,
    prosesAdmin,
    prosesPengawas,
    prosesKontraktor,
    alasanReject,
    kontraktor,
    namePengawas,
    filePengawas,
    nameKontraktor,
    fileKontraktor,
    operation_report_id,
  } = req.body; //mengambil data dari body request

  const calculatedTotalRitase = ritase + ritase2; // totalRitase merupakan hasil dari ritase + ritase
  const calculatedVolume = parseFloat((ritase * muatan).toFixed(2)); // volume hasil dari ritase * muatan
  const calculatedVolume2 = parseFloat((ritase2 * muatan2).toFixed(2)); // volume2 hasil dari ritase2 * muatan2
  const calculatedTotalVolume = parseFloat(
    (calculatedVolume + calculatedVolume2).toFixed(2)
  ); // totalVolume hasil dari volume + volume2

  const client = await pool.connect(); //membuat koneksi ke database

  try {
    await client.query("BEGIN");

    // Validasi input
    const missingFields = []; //array untuk menyimpan field yang hilang
    if (!operation_report_id) missingFields.push("operation_report_id"); //mengecek apakah operation_report_id ada
    if (!excecutor) missingFields.push("excecutor");
    if (!alat) missingFields.push("alat"); //mengecek apakah alat ada
    if (!timbunan) missingFields.push("timbunan"); //mengecek apakah timbunan ada
    if (!material) missingFields.push("material"); //mengecek apakah material ada
    if (jarak === undefined) missingFields.push("jarak"); //mengecek apakah jarak ada
    if (!tipe) missingFields.push("tipe"); //mengecek apakah tipe ada
    if (ritase === undefined) missingFields.push("ritase"); //mengecek apakah ritase ada
    if (muatan === undefined) missingFields.push("muatan");
    if (volume === undefined) missingFields.push("volume");
    if (!tipe2) missingFields.push("tipe2"); //mengecek apakah tipe ada
    if (ritase2 === undefined) missingFields.push("ritase2"); //mengecek apakah ritase ada
    if (muatan2 === undefined) missingFields.push("muatan2");
    if (volume2 === undefined) missingFields.push("volume2");

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
    if (operationCheck.rows[0].status !== "Produksi") {
      throw new Error("Operation report ini bukan untuk production"); //mengecek apakah status operation_report_id adalah production
    }

    //menambahkan data ke table production_report
    const result = await client.query(
      "INSERT INTO production_report(alat, timbunan, material, jarak, tipe, ritase, proses_admin, proses_pengawas, proses_kontraktor, alasan_reject, excecutor, tipe2, ritase2, muatan, volume, total_ritase, kontraktor, muatan2, volume2, total_volume, name_pengawas, file_pengawas, name_kontraktor, file_kontraktor, operation_report_id) VALUES($1, $2, $3, $4, $5, $6, 'Uploaded', null, null, null, $7, $8, $9, $10, $11, $12, null, $13, $14, $15, null, null, null, null, $16) RETURNING id",
      // Update the number of parameters to match the placeholders
      [
        alat,
        timbunan,
        material,
        jarak,
        tipe,
        ritase,
        excecutor,
        tipe2,
        ritase2,
        muatan,
        calculatedVolume,
        calculatedTotalRitase,
        muatan2,
        calculatedVolume2,
        calculatedTotalVolume,
        operation_report_id,
      ]
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
  const {
    alat,
    timbunan,
    material,
    jarak,
    tipe,
    ritase,
    excecutor,
    tipe2,
    ritase2,
    muatan,
    volume,
    total_ritase,
    muatan2,
    volume2,
    total_volume,
  } = req.body;

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
      "UPDATE production_report SET alat = $1, timbunan = $2, material = $3, jarak = $4, tipe = $5, ritase = $6, proses_admin = 'Uploaded', proses_pengawas = null, proses_kontraktor = null, alasan_reject = null, excecutor = $7, tipe2 = $8, ritase2 = $9, muatan = $10, volume = $11, total_ritase = $12, kontraktor = null, muatan2 = $13, volume2 = $14, total_volume = $15, name_pengawas = null, file_pengawas = null, name_kontraktor = null, file_kontraktor = null WHERE id = $16",
      [
        alat,
        timbunan,
        material,
        jarak,
        tipe,
        ritase,
        excecutor,
        tipe2,
        ritase2,
        muatan,
        volume,
        total_ritase,
        muatan2,
        volume2,
        total_volume,
        id,
      ]
    );

    await client.query("COMMIT");
    res.json({ message: "Production report berhasil diperbarui" });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error updating production data", error);
    res.status(500).json({
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
    proses_admin,
    proses_pengawas,
    proses_kontraktor,
    alasan_reject,
    tipe_unit,
    total_hm,
    jam_operasi,
    no_order,
    kontraktor,
    name_pengawas,
    file_pengawas,
    name_kontraktor,
    file_kontraktor,
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
    if (tipe_unit === undefined) missingFields.push("tipe_unit");
    if (total_hm === undefined) missingFields.push("total_hm");
    if (jam_operasi === undefined) missingFields.push("jam_operasi");
    if (no_order === undefined) missingFields.push("no_order");

    //mengecek apakah ada field yang hilang
    if (missingFields.length > 0) {
      throw new Error(
        `Data hour meter tidak lengkap. Field yang hilang: ${missingFields.join(
          ", "
        )}`
      );
    }

    // Validasi tipe data
    // if (typeof equipment !== "string" || equipment.length > 100) {
    //   throw new Error(
    //     "Equipment harus berupa string dengan panjang maksimal 100 karakter"
    //   );
    // }
    // if (typeof ket !== "string" || ket.length > 100) {
    //   throw new Error(
    //     "Ket harus berupa string dengan panjang maksimal 100 karakter"
    //   );
    // }

    //mengecek apakah field yang diinput berupa angka
    const doubleFields = [
      "hm_awal",
      "hm_akhir",
      "jam_lain",
      "breakdown",
      "no_operator",
      "hujan",
      "total_hm",
      "jam_operasi",
      "no_order",
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
      "INSERT INTO hourmeter_report(operation_report_id, equipment, hm_awal, hm_akhir, jam_lain, breakdown, no_operator, hujan, ket, proses_admin, proses_pengawas, proses_kontraktor, alasan_reject, tipe_unit, total_hm, jam_operasi, no_order, kontraktor, name_pengawas, file_pengawas, name_kontraktor, file_kontraktor) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, 'Uploaded', null, null, null, $10, $11, $12, $13, null, null, null, null, null) RETURNING id",
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
        tipe_unit,
        total_hm,
        jam_operasi,
        no_order,
      ]
    );
    if (operationCheck.rows[0].status !== "Jam Jalan") {
      throw new Error("Operation report ini bukan untuk hour meter");
    }

    await client.query("COMMIT");
    res.status(201).json({
      message: "Hour Meter report berhasil dibuat",
      id: result.rows[0].id,
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error saat menyisipkan data jam jalan:", error);
    res.status(400).json({
      error: error.message || "Terjadi kesalahan saat menyimpan data jam jalan",
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
    tipe_unit,
    jam_operasi,
    no_order,
    total_hm,
  } = req.body;

  console.log("Data received for update:", req.body);
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

    const updateQuery = `
      UPDATE hourmeter_report 
      SET equipment = $1, hm_awal = $2, hm_akhir = $3, jam_lain = $4, breakdown = $5, 
          no_operator = $6, hujan = $7, ket = $8, proses_admin = 'Uploaded', 
          proses_pengawas = null, proses_kontraktor = null, alasan_reject = null, 
          tipe_unit = $9, total_hm = $10, jam_operasi = $11, no_order = $12, 
          kontraktor = null, name_pengawas = null, file_pengawas = null, 
          name_kontraktor = null, file_kontraktor = null 
      WHERE id = $13
    `;
    console.log("Executing update query:", updateQuery);

    const result = await client.query(updateQuery, [
      equipment,
      hm_awal,
      hm_akhir,
      jam_lain,
      breakdown,
      no_operator,
      hujan,
      ket,
      tipe_unit,
      total_hm,
      jam_operasi,
      no_order,
      id,
    ]);
    console.log("Rows affected:", result.rowCount);

    console.log("Parameters sent to query:", [
      equipment,
      hm_awal,
      hm_akhir,
      jam_lain,
      breakdown,
      no_operator,
      hujan,
      ket,
      tipe_unit,
      total_hm,
      jam_operasi,
      no_order,
      id,
    ]);

    await client.query("COMMIT");
    res.json({ message: "Hourmeter report berhasil diperbarui" });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error updating hourmeter data", error);
    res.status(500).json({
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
    res.status(500).json({
      error: "Terjadi kesalahan server saat menghapus data hourmeter",
    });
  } finally {
    client.release();
  }
});

app.get("/admins/:id", async (req, res) => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ error: "ID tidak valid" });
  }

  try {
    const result = await pool.query(
      "SELECT * FROM admin_report WHERE id = $1",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Admin tidak ditemukan" });
    }

    const userData = result.rows[0];
    console.log("Data yang dikirim ke client:", userData);
    res.json(userData);
  } catch (error) {
    console.error("Error fetching admin data", error);
    res.status(500).json({
      error: "Terjadi kesalahan saat mengambil data admin",
    });
  }
});

// Route untuk menambahkan admin
app.post("/admins", async (req, res) => {
  console.log("Received admin data:", req.body);
  const { nama, username, password } = req.body; //mengambil data dari body request

  const client = await pool.connect(); //membuat koneksi ke database

  try {
    await client.query("BEGIN"); //memulai transaksi baru

    // Validasi input
    if (!nama || !username || !password) {
      throw new Error("Data admin tidak lengkap");
    }

    //menambahkan data ke table admin
    const result = await client.query(
      "INSERT INTO admin_report(nama,username,password) VALUES($1, $2, $3) RETURNING id",
      [nama, username, password]
    );

    const adminId = result.rows[0].id; //mengambil id dari data yang baru ditambahkan

    await client.query("COMMIT"); //mengakhiri transaksi dan menyimpan perubahan ke database
    res.status(201).json({
      message: "Admin berhasil ditambahkan", //mengirim response berhasil
      adminId,
    });
  } catch (error) {
    await client.query("ROLLBACK"); //membatalkan transaksi jika terjadi error
    console.error("Error inserting admin data", error); //menampilkan error jika terjadi error
    res.status(400).json({
      error: error.message || "Terjadi kesalahan saat menyimpan data admin",
    });
  } finally {
    client.release(); //mengakhiri koneksi ke database
  }
});

app.get("/admins", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM admin_report");
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching admin data", error);
    res.status(500).json({
      error: "Terjadi kesalahan saat mengambil data admin",
    });
  }
});

app.put("/admins/:id", async (req, res) => {
  const id = parseInt(req.params.id);

  // Validate ID
  if (isNaN(id)) {
    return res.status(400).json({ error: "ID tidak valid" });
  }

  const { nama, username, password } = req.body;

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Periksa apakah admin dengan ID tersebut ada
    const checkResult = await client.query(
      "SELECT * FROM admin_report WHERE id = $1",
      [id]
    );
    if (checkResult.rows.length === 0) {
      throw new Error("Admin tidak ditemukan");
    }

    // Log the ID being updated
    console.log("Updating admin with ID:", id);

    // Update admin
    await client.query(
      "UPDATE admin_report SET nama = $1, username = $2, password = $3 WHERE id = $4",
      [nama, username, password, id]
    );

    await client.query("COMMIT");
    res.json({ message: "Admin berhasil diperbarui" });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error updating admin data", error);
    res.status(500).json({
      error: "Terjadi kesalahan server saat memperbarui data admin",
    });
  } finally {
    client.release();
  }
});

app.delete("/admins/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  console.log("Attempting to delete admin with ID:", id); // Log the ID being deleted

  if (isNaN(id)) {
    console.error("Invalid ID:", req.params.id);
    res.status(400).json({ error: "ID admin tidak valid" });
    return;
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Periksa apakah admin ada
    const checkResult = await client.query(
      "SELECT * FROM admin_report WHERE id = $1",
      [id]
    );
    console.log("Check result:", checkResult.rows); // Log the result of the check
    if (checkResult.rows.length === 0) {
      console.log("Admin not found in database");
      await client.query("ROLLBACK");
      res.status(404).json({ error: "Admin tidak ditemukan" });
      return;
    }

    // Hapus admin
    await client.query("DELETE FROM admin_report WHERE id = $1", [id]);

    await client.query("COMMIT");
    console.log("Delete admin successful");
    res.json({ message: "Admin berhasil dihapus" });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error deleting admin data", error);
    res.status(500).json({
      error: "Terjadi kesalahan server saat menghapus data admin",
    });
  } finally {
    client.release();
  }
});

// Route untuk menambahkan user
app.post("/users", async (req, res) => {
  console.log("Received user data:", req.body);
  const { nama, username, password } = req.body; //mengambil data dari body request

  const client = await pool.connect(); //membuat koneksi ke database

  try {
    await client.query("BEGIN"); //memulai transaksi baru

    // Validasi input
    if (!nama || !username || !password) {
      throw new Error("Data user tidak lengkap");
    }

    const result = await client.query(
      "INSERT INTO user_report(nama, username, password) VALUES($1, $2, $3) RETURNING id",
      [nama, username, password]
    );

    const userId = result.rows[0].id;

    await client.query("COMMIT");
    res.status(201).json({
      message: "User berhasil ditambahkan",
      userId,
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error inserting user data", error);
    res.status(400).json({
      error: error.message || "Terjadi kesalahan saat menyimpan data user",
    });
  } finally {
    client.release();
  }
});

app.get("/users", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM user_report");
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching user data", error);
    res.status(500).json({
      error: "Terjadi kesalahan saat mengambil data user",
    });
  }
});

app.put("/users/:id", async (req, res) => {
  const id = parseInt(req.params.id);

  // Validate ID
  if (isNaN(id)) {
    return res.status(400).json({ error: "ID tidak valid" });
  }

  const { nama, username, password } = req.body;

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Periksa apakah admin dengan ID tersebut ada
    const checkResult = await client.query(
      "SELECT * FROM user_report WHERE id = $1",
      [id]
    );
    if (checkResult.rows.length === 0) {
      throw new Error("User tidak ditemukan");
    }

    // Log the ID being updated
    console.log("Updating user with ID:", id);

    // Update admin
    await client.query(
      "UPDATE user_report SET nama = $1, username = $2, password = $3 WHERE id = $4",
      [nama, username, password, id]
    );

    await client.query("COMMIT");
    res.json({ message: "User berhasil diperbarui" });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error updating user data", error);
    res.status(500).json({
      error: "Terjadi kesalahan server saat memperbarui data user",
    });
  } finally {
    client.release();
  }
});

app.delete("/users/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  console.log("Attempting to delete user with ID:", id); // Log the ID being deleted

  if (isNaN(id)) {
    console.error("Invalid ID:", req.params.id);
    res.status(400).json({ error: "ID user tidak valid" });
    return;
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Periksa apakah admin ada
    const checkResult = await client.query(
      "SELECT * FROM user_report WHERE id = $1",
      [id]
    );
    console.log("Check result:", checkResult.rows); // Log the result of the check
    if (checkResult.rows.length === 0) {
      console.log("User not found in database");
      await client.query("ROLLBACK");
      res.status(404).json({ error: "User tidak ditemukan" });
      return;
    }

    // Hapus admin
    await client.query("DELETE FROM user_report WHERE id = $1", [id]);

    await client.query("COMMIT");
    console.log("Delete user successful");
    res.json({ message: "User berhasil dihapus" });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error deleting user data", error);
    res.status(500).json({
      error: "Terjadi kesalahan server saat menghapus data user",
    });
  } finally {
    client.release();
  }
});

// Route untuk login
app.post("/login", async (req, res) => {
  const { username, password, role } = req.body;
  console.log("Login attempt:", { username, password, role });
  const client = await pool.connect();
  try {
    let query;
    let params = [username];

    if (role === "admin") {
      query = "SELECT * FROM admin_report WHERE username = $1";
    } else if (role === "user") {
      query = "SELECT * FROM user_report WHERE username = $1";
    } else if (role === "kontraktor") {
      query = "SELECT * FROM kontraktor_report WHERE username = $1";
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Role tidak valid" });
    }

    const result = await client.query(query, params);
    if (result.rows.length === 0) {
      return res
        .status(401)
        .json({ success: false, message: "Username atau password salah" });
    }

    const user = result.rows[0];
    const hashedPassword = user.password.replace("$2y$", "$2a$");
    const isPasswordValid = await bcrypt.compare(password, hashedPassword);

    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ success: false, message: "Username atau password salah" });
    }

    res.status(200).json({
      success: true,
      message: "Login berhasil",
      userId: user.id,
      username: user.username,
      role: role,
    });
  } catch (error) {
    console.error("Error during login", error);
    res
      .status(500)
      .json({ success: false, message: "Terjadi kesalahan saat login" });
  } finally {
    client.release();
  }
});

//Pengawas
//Approve dan Reject Pengawas (Produksi) (Pengawas)
app.post("/update-reject-reason", async (req, res) => {
  const { operation_report_id, alasan_reject } = req.body;

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Validasi input
    if (!operation_report_id || !alasan_reject) {
      throw new Error(
        "Data tidak lengkap. Pastikan operation_report_id dan alasan_reject diisi."
      );
    }

    // Update alasan_reject pada production_report
    const result = await client.query(
      "UPDATE production_report SET alasan_reject = $1, proses_pengawas = 'Rejected Pengawas' WHERE operation_report_id = $2",
      [alasan_reject, operation_report_id]
    );

    if (result.rowCount === 0) {
      throw new Error(
        "Tidak ada laporan produksi ditemukan dengan ID tersebut."
      );
    }

    await client.query("COMMIT");
    res.status(200).json({ message: "Alasan reject berhasil diperbarui." });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error updating reject reason:", error);
    res.status(500).json({
      error:
        error.message || "Terjadi kesalahan saat memperbarui alasan reject.",
    });
  } finally {
    client.release();
  }
});

app.post("/update-approve-reason", async (req, res) => {
  const {
    operation_report_id,
    kontraktor,
    name_pengawas,
    file_pengawas,
  } = req.body;

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Update alasan_reject pada production_report
    const result = await client.query(
      "UPDATE production_report SET proses_pengawas = 'Approved Pengawas', kontraktor = $1, name_pengawas = $2, file_pengawas = $3 WHERE operation_report_id = $4",
      [kontraktor, name_pengawas, file_pengawas, operation_report_id]
    );

    if (result.rowCount === 0) {
      throw new Error(
        "Tidak ada laporan produksi ditemukan dengan ID tersebut."
      );
    }

    await client.query("COMMIT");
    res.status(200).json({ message: "approve berhasil diperbarui." });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error updating approve reason:", error);
    res.status(500).json({
      error: error.message || "Terjadi kesalahan saat memperbarui approve.",
    });
  } finally {
    client.release();
  }
});

//Approve dan Reject setelah di reject kontraktor (Produksi)
app.post("/update-reject-reason-produksi", async (req, res) => {
  const { operation_report_id, alasan_reject } = req.body;

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Validasi input
    if (!operation_report_id || !alasan_reject) {
      throw new Error(
        "Data tidak lengkap. Pastikan operation_report_id dan alasan_reject diisi."
      );
    }

    // Update alasan_reject pada production_report
    const result = await client.query(
      "UPDATE production_report SET proses_pengawas = 'Rejected Pengawas', proses_kontraktor = null, alasan_reject = $1, kontraktor = null, name_pengawas = null, file_pengawas = null WHERE operation_report_id = $2",
      [alasan_reject, operation_report_id]
    );

    if (result.rowCount === 0) {
      throw new Error(
        "Tidak ada laporan produksi ditemukan dengan ID tersebut."
      );
    }

    await client.query("COMMIT");
    res.status(200).json({ message: "Alasan reject berhasil diperbarui." });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error updating reject reason:", error);
    res.status(500).json({
      error:
        error.message || "Terjadi kesalahan saat memperbarui alasan reject.",
    });
  } finally {
    client.release();
  }
});

app.post("/update-approve-reason-produksi", async (req, res) => {
  const { operation_report_id } = req.body;

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Update alasan_reject pada production_report
    const result = await client.query(
      "UPDATE production_report SET proses_kontraktor = null, alasan_reject = null WHERE operation_report_id = $1",
      [operation_report_id]
    );

    if (result.rowCount === 0) {
      throw new Error(
        "Tidak ada laporan produksi ditemukan dengan ID tersebut."
      );
    }

    await client.query("COMMIT");
    res.status(200).json({ message: "approve berhasil diperbarui." });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error updating approve reason:", error);
    res.status(500).json({
      error: error.message || "Terjadi kesalahan saat memperbarui approve.",
    });
  } finally {
    client.release();
  }
});

//Approve dan Reject setelah di reject kontraktor (Jam Jalan)
app.post("/update-reject-reason-jamjalan", async (req, res) => {
  const { operation_report_id, alasan_reject } = req.body;

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Validasi input
    if (!operation_report_id || !alasan_reject) {
      throw new Error(
        "Data tidak lengkap. Pastikan operation_report_id dan alasan_reject diisi."
      );
    }

    // Update alasan_reject pada production_report
    const result = await client.query(
      "UPDATE hourmeter_report SET proses_pengawas = 'Rejected Pengawas', proses_kontraktor = null, alasan_reject = $1, kontraktor = null, name_pengawas = null, file_pengawas = null WHERE operation_report_id = $2",
      [alasan_reject, operation_report_id]
    );

    if (result.rowCount === 0) {
      throw new Error(
        "Tidak ada laporan jam jalan ditemukan dengan ID tersebut."
      );
    }

    await client.query("COMMIT");
    res.status(200).json({ message: "Alasan reject berhasil diperbarui." });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error updating reject reason:", error);
    res.status(500).json({
      error:
        error.message || "Terjadi kesalahan saat memperbarui alasan reject.",
    });
  } finally {
    client.release();
  }
});

app.post("/update-approve-reason-jamjalan", async (req, res) => {
  const { operation_report_id } = req.body;

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Update alasan_reject pada production_report
    const result = await client.query(
      "UPDATE hourmeter_report SET proses_kontraktor = null, alasan_reject = null WHERE operation_report_id = $1",
      [operation_report_id]
    );

    if (result.rowCount === 0) {
      throw new Error(
        "Tidak ada laporan jam jalan ditemukan dengan ID tersebut."
      );
    }

    await client.query("COMMIT");
    res.status(200).json({ message: "approve berhasil diperbarui." });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error updating approve reason:", error);
    res.status(500).json({
      error: error.message || "Terjadi kesalahan saat memperbarui approve.",
    });
  } finally {
    client.release();
  }
});

//Approve dan Reject Jam Jalan (Pengawas)
app.post("/update-reject-hourmeter", async (req, res) => {
  const { operation_report_id, alasan_reject } = req.body;

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Validasi input
    if (!operation_report_id || !alasan_reject) {
      throw new Error(
        "Data tidak lengkap. Pastikan operation_report_id dan alasan_reject diisi."
      );
    }

    // Update alasan_reject pada production_report
    const result = await client.query(
      "UPDATE hourmeter_report SET alasan_reject = $1, proses_pengawas = 'Rejected Pengawas' WHERE operation_report_id = $2",
      [alasan_reject, operation_report_id]
    );

    if (result.rowCount === 0) {
      throw new Error(
        "Tidak ada laporan jam jalan ditemukan dengan ID tersebut."
      );
    }

    await client.query("COMMIT");
    res.status(200).json({ message: "Alasan reject berhasil diperbarui." });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error updating reject reason:", error);
    res.status(500).json({
      error:
        error.message || "Terjadi kesalahan saat memperbarui alasan reject.",
    });
  } finally {
    client.release();
  }
});

app.post("/update-approve-hourmeter", async (req, res) => {
  const {
    operation_report_id,
    kontraktor,
    name_pengawas,
    file_pengawas,
  } = req.body;

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const result = await client.query(
      "UPDATE hourmeter_report SET proses_pengawas = 'Approved Pengawas', kontraktor = $1, name_pengawas = $2, file_pengawas = $3 WHERE operation_report_id = $4",
      [kontraktor, name_pengawas, file_pengawas, operation_report_id]
    );

    if (result.rowCount === 0) {
      throw new Error(
        "Tidak ada laporan jam jalan ditemukan dengan ID tersebut."
      );
    }

    await client.query("COMMIT");
    res.status(200).json({ message: "approve berhasil diperbarui." });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error updating approve reason:", error);
    res.status(500).json({
      error: error.message || "Terjadi kesalahan saat memperbarui approve.",
    });
  } finally {
    client.release();
  }
});

//Kontraktor
//Approve dan Reject Pengawas (Produksi) (Kontraktor)
app.post("/update-reject-kontraktor", async (req, res) => {
  const { operation_report_id, alasan_reject } = req.body;

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Validasi input
    if (!operation_report_id || !alasan_reject) {
      throw new Error(
        "Data tidak lengkap. Pastikan operation_report_id dan alasan_reject diisi."
      );
    }

    // Update alasan_reject pada production_report
    const result = await client.query(
      "UPDATE production_report SET alasan_reject = $1, proses_kontraktor = 'Rejected Kontraktor' WHERE operation_report_id = $2",
      [alasan_reject, operation_report_id]
    );

    if (result.rowCount === 0) {
      throw new Error(
        "Tidak ada laporan produksi ditemukan dengan ID tersebut."
      );
    }

    await client.query("COMMIT");
    res.status(200).json({ message: "Alasan reject berhasil diperbarui." });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error updating reject reason:", error);
    res.status(500).json({
      error:
        error.message || "Terjadi kesalahan saat memperbarui alasan reject.",
    });
  } finally {
    client.release();
  }
});

app.post("/update-approve-kontraktor", async (req, res) => {
  const { operation_report_id, name_kontraktor, file_kontraktor } = req.body;

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Update alasan_reject pada production_report
    const result = await client.query(
      "UPDATE production_report SET proses_kontraktor = 'Approved Kontraktor', name_kontraktor = $1, file_kontraktor = $2 WHERE operation_report_id = $3",
      [name_kontraktor, file_kontraktor, operation_report_id]
    );

    if (result.rowCount === 0) {
      throw new Error(
        "Tidak ada laporan produksi ditemukan dengan ID tersebut."
      );
    }

    await client.query("COMMIT");
    res.status(200).json({ message: "approve berhasil diperbarui." });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error updating approve reason:", error);
    res.status(500).json({
      error: error.message || "Terjadi kesalahan saat memperbarui approve.",
    });
  } finally {
    client.release();
  }
});

//Approve dan Reject (Jam Jalan)
app.post("/update-reject-hourmeter-kontraktor", async (req, res) => {
  const { operation_report_id, alasan_reject } = req.body;

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Validasi input
    if (!operation_report_id || !alasan_reject) {
      throw new Error(
        "Data tidak lengkap. Pastikan operation_report_id dan alasan_reject diisi."
      );
    }

    // Update alasan_reject pada production_report
    const result = await client.query(
      "UPDATE hourmeter_report SET alasan_reject = $1, proses_kontraktor = 'Rejected Kontraktor' WHERE operation_report_id = $2",
      [alasan_reject, operation_report_id]
    );

    if (result.rowCount === 0) {
      throw new Error(
        "Tidak ada laporan jam jalan ditemukan dengan ID tersebut."
      );
    }

    await client.query("COMMIT");
    res.status(200).json({ message: "Alasan reject berhasil diperbarui." });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error updating reject reason:", error);
    res.status(500).json({
      error:
        error.message || "Terjadi kesalahan saat memperbarui alasan reject.",
    });
  } finally {
    client.release();
  }
});

app.post("/update-approve-hourmeter-kontraktor", async (req, res) => {
  const { operation_report_id, name_kontraktor, file_kontraktor } = req.body;

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const result = await client.query(
      "UPDATE hourmeter_report SET proses_kontraktor = 'Approved Kontraktor', name_kontraktor = $1, file_kontraktor = $2 WHERE operation_report_id = $3",
      [name_kontraktor, file_kontraktor, operation_report_id]
    );

    if (result.rowCount === 0) {
      throw new Error(
        "Tidak ada laporan jam jalan ditemukan dengan ID tersebut."
      );
    }

    await client.query("COMMIT");
    res.status(200).json({ message: "approve berhasil diperbarui." });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error updating approve reason:", error);
    res.status(500).json({
      error: error.message || "Terjadi kesalahan saat memperbarui approve.",
    });
  } finally {
    client.release();
  }
});

//Okay Produksi dan Jam Jalan
app.post("/okay-produksi", async (req, res) => {
  const { operation_report_id, id } = req.body;

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Validasi input
    if (!id || !operation_report_id) {
      throw new Error(
        "Data tidak lengkap. Pastikan id dan operation_report_id diisi."
      );
    }

    // Update alasan_reject pada production_report
    const result = await client.query(
      "UPDATE production_report SET operation_report_id = $1, proses_pengawas = null, proses_kontraktor = null, alasan_reject = null, kontraktor = null, name_pengawas = null, file_pengawas = null, name_kontraktor = null, file_kontraktor = null WHERE id = $2",
      [operation_report_id, id]
    );

    if (result.rowCount === 0) {
      throw new Error(
        "Tidak ada laporan produksi ditemukan dengan ID tersebut."
      );
    }

    await client.query("COMMIT");
    res.status(200).json({ message: "Laporan produksi berhasil diperbarui." });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error updating reject reason:", error);
    res.status(500).json({
      error:
        error.message || "Terjadi kesalahan saat memperbarui laporan produksi.",
    });
  } finally {
    client.release();
  }
});

app.post("/okay-hourmeter", async (req, res) => {
  const { operation_report_id, id } = req.body;

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Validasi input
    if (!id || !operation_report_id) {
      throw new Error(
        "Data tidak lengkap. Pastikan id dan operation_report_id diisi."
      );
    }

    // Update alasan_reject pada production_report
    const result = await client.query(
      "UPDATE hourmeter_report SET operation_report_id = $1, proses_pengawas = null, proses_kontraktor = null, alasan_reject = null, kontraktor = null, name_pengawas = null, file_pengawas = null, name_kontraktor = null, file_kontraktor = null WHERE id = $2",
      [operation_report_id, id]
    );

    if (result.rowCount === 0) {
      throw new Error(
        "Tidak ada laporan jam jalan ditemukan dengan ID tersebut."
      );
    }

    await client.query("COMMIT");
    res.status(200).json({ message: "Laporan jam jalan berhasil diperbarui." });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error updating reject reason:", error);
    res.status(500).json({
      error:
        error.message ||
        "Terjadi kesalahan saat memperbarui laporan jam jalan.",
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
  console.log(`Server running at http://192.168.1.122:${port}`);
});
