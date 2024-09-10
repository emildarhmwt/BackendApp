const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

const app = express();
const port = 3000;

app.use(bodyParser.json());

// PostgreSQL connection
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'AplikasiReport',
    password: 'emilda123',
    port: 5432,
});

// Basic route
app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Route untuk mendapatkan semua reports
app.get('/reports', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                or.id as operation_id, 
                or.tanggal, 
                or.shift, 
                or.grup, 
                or.pengawas, 
                or.lokasi, 
                or.status, 
                or.pic,
                COALESCE(json_agg(
                    json_build_object(
                        'id', pr.id,
                        'alat', pr.alat,
                        'timbunan', pr.timbunan,
                        'material', pr.material,
                        'jarak', pr.jarak,
                        'tipe', pr.tipe,
                        'ritase', pr.ritase
                    ) 
                    ORDER BY pr.id
                ) FILTER (WHERE pr.id IS NOT NULL), '[]') as productions
            FROM operation_report or
            LEFT JOIN production_report pr ON or.id = pr.operation_report_id
            GROUP BY or.id
            ORDER BY or.tanggal DESC
        `);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching data', error);
        res.status(500).send('Server error');
    }
});

// Route untuk mendapatkan satu report berdasarkan ID
app.get('/reports/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const result = await pool.query(`
            SELECT 
                or.id as operation_id, 
                or.tanggal, 
                or.shift, 
                or.grup, 
                or.pengawas, 
                or.lokasi, 
                or.status, 
                or.pic,
                COALESCE(json_agg(
                    json_build_object(
                        'id', pr.id,
                        'alat', pr.alat,
                        'timbunan', pr.timbunan,
                        'material', pr.material,
                        'jarak', pr.jarak,
                        'tipe', pr.tipe,
                        'ritase', pr.ritase
                    ) 
                    ORDER BY pr.id
                ) FILTER (WHERE pr.id IS NOT NULL), '[]') as productions
            FROM operation_report or
            LEFT JOIN production_report pr ON or.id = pr.operation_report_id
            WHERE or.id = $1
            GROUP BY or.id
        `, [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).send('Report not found');
        }
        
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching data', error);
        res.status(500).send('Server error');
    }
});

// Route untuk menambahkan operation_report
app.post('/operation-reports', async (req, res) => {
    const { tanggal, shift, grup, pengawas, lokasi, status, pic } = req.body;
    
    const client = await pool.connect();
    
    try {
        await client.query('BEGIN');
        
        // Validasi input
        if (!tanggal || !shift || !grup || !pengawas || !lokasi || !status || !pic) {
            throw new Error('Data operasi tidak lengkap');
        }

        const operationResult = await client.query(
            'INSERT INTO operation_report(tanggal, shift, grup, pengawas, lokasi, status, pic) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id',
            [tanggal, shift, grup, pengawas, lokasi, status, pic]
        );
        
        const operationReportId = operationResult.rows[0].id;
        
        await client.query('COMMIT');
        res.status(201).json({ message: 'Operation report created successfully', operationReportId });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error inserting operation data', error);
        res.status(400).json({ error: error.message || 'Terjadi kesalahan saat menyimpan data operasi' });
    } finally {
        client.release();
    }
});

// Route untuk menambahkan production_report
app.post('/production-reports', async (req, res) => {
    console.log('Received production report data:', req.body);
    const {alat, timbunan, material, jarak, tipe, ritase, operation_report_id} = req.body;
    
    const client = await pool.connect();
    
    try {
        await client.query('BEGIN');
        
        // Validasi input
        const missingFields = [];
        if (!operation_report_id) missingFields.push('operation_report_id');
        if (!alat) missingFields.push('alat');
        if (!timbunan) missingFields.push('timbunan');
        if (!material) missingFields.push('material');
        if (jarak === undefined) missingFields.push('jarak');
        if (!tipe) missingFields.push('tipe');
        if (ritase === undefined) missingFields.push('ritase');

        if (missingFields.length > 0) {
            throw new Error(`Data produksi tidak lengkap. Field yang hilang: ${missingFields.join(', ')}`);
        }

        // Periksa apakah operation_report_id valid
        const operationCheck = await client.query('SELECT id FROM operation_report WHERE id = $1', [operation_report_id]);
        if (operationCheck.rows.length === 0) {
            throw new Error('Operation report dengan ID tersebut tidak ditemukan');
        }

        await client.query(
            'INSERT INTO production_report(alat, timbunan, material, jarak, tipe, ritase, operation_report_id) VALUES($1, $2, $3, $4, $5, $6, $7)',
            [alat, timbunan, material, jarak, tipe, ritase, operation_report_id]
        );
        
        await client.query('COMMIT');
        res.status(201).json({ message: 'Production report berhasil dibuat' });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error saat menyisipkan data produksi:', error);
        res.status(400).json({ error: error.message || 'Terjadi kesalahan saat menyimpan data produksi' });
    } finally {
        client.release();
    }
});

// Route untuk mengupdate report
app.put('/reports/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    const { tanggal, shift, grup, pengawas, lokasi, status, pic, productions } = req.body;
    
    const client = await pool.connect();
    
    try {
        await client.query('BEGIN');
        
        await client.query(
            'UPDATE operation_report SET tanggal = $1, shift = $2, grup = $3, pengawas = $4, lokasi = $5, status = $6, pic = $7 WHERE id = $8',
            [tanggal, shift, grup, pengawas, lokasi, status, pic, id]
        );
        
        // Hapus production_report yang lama
        await client.query('DELETE FROM production_report WHERE operation_report_id = $1', [id]);
        
        // Tambahkan production_report yang baru
        for (const production of productions) {
            const { alat, timbunan, material, jarak, tipe, ritase } = production;
            await client.query(
                'INSERT INTO production_report(alat, timbunan, material, jarak, tipe, ritase, operation_report_id) VALUES($1, $2, $3, $4, $5, $6, $7)',
                [alat, timbunan, material, jarak, tipe, ritase, id]
            );
        }
        
        await client.query('COMMIT');
        res.json({ message: 'Report updated successfully' });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error updating data', error);
        res.status(500).send('Server error');
    } finally {
        client.release();
    }
});

// Route untuk menghapus report
app.delete('/reports/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    
    const client = await pool.connect();
    
    try {
        await client.query('BEGIN');
        
        // Hapus production_report terkait
        await client.query('DELETE FROM production_report WHERE operation_report_id = $1', [id]);
        
        // Hapus operation_report
        await client.query('DELETE FROM operation_report WHERE id = $1', [id]);
        
        await client.query('COMMIT');
        res.status(204).send();
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error deleting data', error);
        res.status(500).send('Server error');
    } finally {
        client.release();
    }
});

app.listen(port, () => {
    console.log(`Server running at http://192.168.1.45:${port}`);
});
