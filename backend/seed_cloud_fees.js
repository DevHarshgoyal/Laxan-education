const pool = require('./config/db');

async function seedCloudFees() {
  console.log('Seeding cloud fee tables (member_cloude, payfee_cloude, dues)...');

  try {
    // 1. Clear existing seed/dummy data in the 3 tables
    await pool.query('DELETE FROM payfee_cloude');
    await pool.query('DELETE FROM dues');
    await pool.query('DELETE FROM member_cloude');

    // ── Student 1: LX-2025-0142 (Abhishek Kirar) ───────────────
    await pool.query(`
      INSERT INTO member_cloude (memberid, name, startdate, course, totalfee)
      VALUES (?, ?, ?, ?, ?)
    `, ['LX-2025-0142', 'Abhishek Kirar', '2025-08-01', 'SSC Combo', '28000']);

    await pool.query(`
      INSERT INTO payfee_cloude (memberid, name, feesdate, installment, recno, pmode)
      VALUES 
        (?, ?, ?, ?, ?, ?),
        (?, ?, ?, ?, ?, ?)
    `, [
      'LX-2025-0142', 'Abhishek Kirar', '2025-08-05', '10000', 'REC-LX-001', 'UPI',
      'LX-2025-0142', 'Abhishek Kirar', '2025-11-10', '8000', 'REC-LX-002', 'Netbanking'
    ]);

    await pool.query(`
      INSERT INTO dues (mid, nextduedate, installment, status, usr)
      VALUES 
        (?, ?, ?, ?, ?),
        (?, ?, ?, ?, ?)
    `, [
      'LX-2025-0142', '2026-09-15', '5000', 'Pending', 'admin',
      'LX-2025-0142', '2026-10-15', '5000', 'Pending', 'admin'
    ]);

    // ── Student 2: 238 (Rahul Sharma) ──────────────────────────
    await pool.query(`
      INSERT INTO member_cloude (memberid, name, startdate, course, totalfee)
      VALUES (?, ?, ?, ?, ?)
    `, ['238', 'Rahul Sharma', '2025-07-15', 'Banking Foundation', '30000']);

    await pool.query(`
      INSERT INTO payfee_cloude (memberid, name, feesdate, installment, recno, pmode)
      VALUES 
        (?, ?, ?, ?, ?, ?),
        (?, ?, ?, ?, ?, ?),
        (?, ?, ?, ?, ?, ?)
    `, [
      '238', 'Rahul Sharma', '2025-07-20', '15000', 'REC-238-001', 'Cash',
      '238', 'Rahul Sharma', '2025-09-15', '10000', 'REC-238-002', 'UPI',
      '238', 'Rahul Sharma', '2025-12-01', '4500', 'REC-238-003', 'UPI'
    ]);

    await pool.query(`
      INSERT INTO dues (mid, nextduedate, installment, status, usr)
      VALUES (?, ?, ?, ?, ?)
    `, ['238', '2026-09-25', '500', 'Pending', 'accounts']);

    // ── Student 3: TEST-ID-001 (Test User) ─────────────────────
    await pool.query(`
      INSERT INTO member_cloude (memberid, name, startdate, course, totalfee)
      VALUES (?, ?, ?, ?, ?)
    `, ['TEST-ID-001', 'Test User', '2026-01-01', 'SSC Combo', '25000']);

    await pool.query(`
      INSERT INTO payfee_cloude (memberid, name, feesdate, installment, recno, pmode)
      VALUES (?, ?, ?, ?, ?, ?)
    `, ['TEST-ID-001', 'Test User', '2026-01-10', '10000', 'REC-TEST-001', 'Card']);

    await pool.query(`
      INSERT INTO dues (mid, nextduedate, installment, status, usr)
      VALUES (?, ?, ?, ?, ?)
    `, ['TEST-ID-001', '2026-09-10', '15000', 'Pending', 'admin']);

    console.log('✅ Seed successful!');
    const [members] = await pool.query('SELECT memberid, name, course, totalfee FROM member_cloude');
    console.log('\n--- Seeded member_cloude ---');
    console.table(members);

    const [payments] = await pool.query('SELECT recno, memberid, installment, pmode, feesdate FROM payfee_cloude');
    console.log('\n--- Seeded payfee_cloude ---');
    console.table(payments);

    const [dues] = await pool.query('SELECT mid, installment, nextduedate, status, usr FROM dues');
    console.log('\n--- Seeded dues ---');
    console.table(dues);

  } catch (err) {
    console.error('❌ Error seeding cloud fee tables:', err);
  } finally {
    process.exit(0);
  }
}

seedCloudFees();
