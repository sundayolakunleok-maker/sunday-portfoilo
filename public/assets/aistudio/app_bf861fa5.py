from flask import Flask, render_template, request, jsonify, session, redirect, url_for, send_file
import sqlite3, os, json, io
from datetime import datetime, timedelta
from functools import wraps
import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from database import get_db, hash_password, init_db, backup_db, DB_PATH

app = Flask(__name__)
app.secret_key = 'mfg_erp_secret_2024_secure_key'
app.permanent_session_lifetime = timedelta(hours=8)

# ─── Auth Helpers ────────────────────────────────────────────────────────────

def login_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        if 'user' not in session:
            return redirect(url_for('login'))
        return f(*args, **kwargs)
    return decorated

def admin_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        if 'user' not in session:
            return redirect(url_for('login'))
        if session.get('role') != 'Admin':
            return jsonify({'error': 'Admin access required'}), 403
        return f(*args, **kwargs)
    return decorated

# ─── Auth Routes ─────────────────────────────────────────────────────────────

@app.route('/')
def index():
    if 'user' not in session:
        return redirect(url_for('login'))
    return redirect(url_for('dashboard'))

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        data = request.get_json()
        username = data.get('username', '').strip()
        password = data.get('password', '').strip()
        db = get_db()
        user = db.execute(
            "SELECT * FROM users WHERE username=? AND password=?",
            (username, hash_password(password))
        ).fetchone()
        db.close()
        if user:
            session.permanent = True
            session['user'] = username
            session['role'] = user['role']
            session['user_id'] = user['id']
            return jsonify({'success': True, 'role': user['role']})
        return jsonify({'success': False, 'message': 'Invalid credentials'})
    return render_template('login.html')

@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('login'))

# ─── Main Pages ───────────────────────────────────────────────────────────────

@app.route('/dashboard')
@login_required
def dashboard():
    return render_template('dashboard.html', user=session['user'], role=session['role'])

@app.route('/api/dashboard-stats')
@login_required
def dashboard_stats():
    db = get_db()
    stats = {
        'production_orders': db.execute("SELECT COUNT(*) as c FROM production_orders").fetchone()['c'],
        'machines': db.execute("SELECT COUNT(*) as c FROM machines").fetchone()['c'],
        'employees': db.execute("SELECT COUNT(*) as c FROM employees").fetchone()['c'],
        'suppliers': db.execute("SELECT COUNT(*) as c FROM suppliers").fetchone()['c'],
        'pending_orders': db.execute("SELECT COUNT(*) as c FROM production_orders WHERE status='Pending'").fetchone()['c'],
        'active_machines': db.execute("SELECT COUNT(*) as c FROM machines WHERE status='Active'").fetchone()['c'],
        'total_inventory': db.execute("SELECT COALESCE(SUM(quantity),0) as c FROM inventory WHERE transaction_type='IN'").fetchone()['c'],
        'total_expenses': db.execute("SELECT COALESCE(SUM(amount),0) as c FROM expenses").fetchone()['c'],
        'production_chart': [],
        'expense_chart': [],
        'qc_chart': {}
    }
    # Production by status
    rows = db.execute("SELECT status, COUNT(*) as cnt FROM production_orders GROUP BY status").fetchall()
    stats['production_chart'] = [{'status': r['status'], 'count': r['cnt']} for r in rows]
    # Monthly expenses
    rows = db.execute("""
        SELECT strftime('%Y-%m', date) as month, SUM(amount) as total
        FROM expenses GROUP BY month ORDER BY month DESC LIMIT 6
    """).fetchall()
    stats['expense_chart'] = [{'month': r['month'], 'total': round(r['total'],2)} for r in rows]
    # QC stats
    qc = db.execute("SELECT qc_status, COUNT(*) as cnt FROM quality_control GROUP BY qc_status").fetchall()
    stats['qc_chart'] = {r['qc_status']: r['cnt'] for r in qc}
    db.close()
    return jsonify(stats)

# ─── Company ──────────────────────────────────────────────────────────────────

@app.route('/api/company', methods=['GET', 'POST'])
@login_required
def company():
    db = get_db()
    if request.method == 'GET':
        row = db.execute("SELECT * FROM company LIMIT 1").fetchone()
        db.close()
        return jsonify(dict(row) if row else {})
    data = request.get_json()
    existing = db.execute("SELECT id FROM company LIMIT 1").fetchone()
    if existing:
        db.execute("""UPDATE company SET name=?,address=?,city=?,state=?,country=?,
            postal_code=?,phone=?,updated_at=CURRENT_TIMESTAMP WHERE id=?""",
            (data.get('name'), data.get('address'), data.get('city'), data.get('state'),
             data.get('country'), data.get('postal_code'), data.get('phone'), existing['id']))
    else:
        db.execute("""INSERT INTO company(name,address,city,state,country,postal_code,phone)
            VALUES(?,?,?,?,?,?,?)""",
            (data.get('name'), data.get('address'), data.get('city'), data.get('state'),
             data.get('country'), data.get('postal_code'), data.get('phone')))
    db.commit()
    db.close()
    return jsonify({'success': True})

# ─── Users ────────────────────────────────────────────────────────────────────

@app.route('/api/users', methods=['GET'])
@admin_required
def get_users():
    db = get_db()
    rows = db.execute("SELECT id, username, role, created_at FROM users").fetchall()
    db.close()
    return jsonify([dict(r) for r in rows])

@app.route('/api/users', methods=['POST'])
@admin_required
def add_user():
    data = request.get_json()
    db = get_db()
    try:
        db.execute("INSERT INTO users(username,password,role) VALUES(?,?,?)",
                   (data['username'], hash_password(data['password']), data.get('role','User')))
        db.commit()
        db.close()
        return jsonify({'success': True})
    except sqlite3.IntegrityError:
        db.close()
        return jsonify({'success': False, 'message': 'Username already exists'})

@app.route('/api/users/<int:uid>', methods=['DELETE'])
@admin_required
def delete_user(uid):
    db = get_db()
    db.execute("DELETE FROM users WHERE id=?", (uid,))
    db.commit()
    db.close()
    return jsonify({'success': True})

@app.route('/api/users/<int:uid>/reset', methods=['POST'])
@admin_required
def reset_user(uid):
    data = request.get_json()
    db = get_db()
    db.execute("UPDATE users SET password=?,role=? WHERE id=?",
               (hash_password(data['password']), data.get('role','User'), uid))
    db.commit()
    db.close()
    return jsonify({'success': True})

# ─── Manage List ──────────────────────────────────────────────────────────────

@app.route('/api/manage-list', methods=['GET'])
@login_required
def get_manage_list():
    db = get_db()
    rows = db.execute("SELECT * FROM manage_list ORDER BY list_name, list_item").fetchall()
    db.close()
    return jsonify([dict(r) for r in rows])

@app.route('/api/manage-list/names', methods=['GET'])
@login_required
def get_list_names():
    db = get_db()
    rows = db.execute("SELECT DISTINCT list_name FROM manage_list ORDER BY list_name").fetchall()
    db.close()
    return jsonify([r['list_name'] for r in rows])

@app.route('/api/manage-list/items/<list_name>', methods=['GET'])
@login_required
def get_list_items(list_name):
    db = get_db()
    rows = db.execute("SELECT list_item FROM manage_list WHERE list_name=? ORDER BY list_item",
                      (list_name,)).fetchall()
    db.close()
    return jsonify([r['list_item'] for r in rows])

@app.route('/api/manage-list', methods=['POST'])
@login_required
def add_list_item():
    data = request.get_json()
    db = get_db()
    db.execute("INSERT INTO manage_list(list_name,list_item) VALUES(?,?)",
               (data['list_name'], data['list_item']))
    db.commit()
    db.close()
    return jsonify({'success': True})

@app.route('/api/manage-list/<int:item_id>', methods=['DELETE'])
@login_required
def delete_list_item(item_id):
    db = get_db()
    db.execute("DELETE FROM manage_list WHERE id=?", (item_id,))
    db.commit()
    db.close()
    return jsonify({'success': True})

# ─── Generic CRUD Factory ─────────────────────────────────────────────────────

def make_crud(table, fields, unique_field=None):
    def get_all():
        db = get_db()
        search = request.args.get('search', '')
        sort = request.args.get('sort', 'id')
        order = request.args.get('order', 'DESC')
        date_from = request.args.get('date_from', '')
        date_to = request.args.get('date_to', '')
        allowed_sorts = ['id'] + list(fields.keys())
        if sort not in allowed_sorts:
            sort = 'id'
        if order not in ['ASC', 'DESC']:
            order = 'DESC'
        query = f"SELECT * FROM {table} WHERE 1=1"
        params = []
        if search:
            conditions = ' OR '.join([f"{f} LIKE ?" for f in fields.keys()])
            query += f" AND ({conditions})"
            params.extend([f'%{search}%'] * len(fields))
        if date_from:
            query += " AND created_at >= ?"
            params.append(date_from)
        if date_to:
            query += " AND created_at <= ?"
            params.append(date_to + ' 23:59:59')
        query += f" ORDER BY {sort} {order}"
        rows = db.execute(query, params).fetchall()
        db.close()
        return jsonify([dict(r) for r in rows])

    def create():
        data = request.get_json()
        db = get_db()
        cols = list(fields.keys())
        vals = [data.get(c, '') for c in cols]
        placeholders = ','.join(['?'] * len(cols))
        col_str = ','.join(cols)
        try:
            cursor = db.execute(f"INSERT INTO {table}({col_str}) VALUES({placeholders})", vals)
            db.commit()
            new_id = cursor.lastrowid
            db.close()
            return jsonify({'success': True, 'id': new_id})
        except sqlite3.IntegrityError as e:
            db.close()
            return jsonify({'success': False, 'message': str(e)})

    def update(record_id):
        data = request.get_json()
        db = get_db()
        cols = list(fields.keys())
        vals = [data.get(c, '') for c in cols]
        set_str = ','.join([f"{c}=?" for c in cols])
        if 'updated_at' in [col[0] for col in db.execute(f"PRAGMA table_info({table})").fetchall()]:
            set_str += ',updated_at=CURRENT_TIMESTAMP'
        db.execute(f"UPDATE {table} SET {set_str} WHERE id=?", vals + [record_id])
        db.commit()
        db.close()
        return jsonify({'success': True})

    def delete(record_id):
        db = get_db()
        db.execute(f"DELETE FROM {table} WHERE id=?", (record_id,))
        db.commit()
        db.close()
        return jsonify({'success': True})

    return get_all, create, update, delete

# ─── Production Orders ────────────────────────────────────────────────────────

PO_FIELDS = {
    'po_id': str, 'product_name': str, 'batch_no': str, 'start_date': str,
    'end_date': str, 'materials_used': str, 'machine_name': str,
    'operator_name': str, 'planned_qty': int, 'actual_qty': int,
    'status': str, 'remark': str
}
po_get, po_create, po_update, po_delete = make_crud('production_orders', PO_FIELDS)
app.add_url_rule('/api/production-orders', 'po_get', login_required(po_get), methods=['GET'])
app.add_url_rule('/api/production-orders', 'po_create', login_required(po_create), methods=['POST'])
app.add_url_rule('/api/production-orders/<int:record_id>', 'po_update', login_required(po_update), methods=['PUT'])
app.add_url_rule('/api/production-orders/<int:record_id>', 'po_delete', login_required(po_delete), methods=['DELETE'])

# ─── Machines ─────────────────────────────────────────────────────────────────

MACHINE_FIELDS = {
    'machine_name': str, 'type': str, 'location': str, 'machine_id': str,
    'capacity_per_day': int, 'status': str, 'last_maintenance': str,
    'next_maintenance': str, 'remark': str
}
m_get, m_create, m_update, m_delete = make_crud('machines', MACHINE_FIELDS)
app.add_url_rule('/api/machines', 'm_get', login_required(m_get), methods=['GET'])
app.add_url_rule('/api/machines', 'm_create', login_required(m_create), methods=['POST'])
app.add_url_rule('/api/machines/<int:record_id>', 'm_update', login_required(m_update), methods=['PUT'])
app.add_url_rule('/api/machines/<int:record_id>', 'm_delete', login_required(m_delete), methods=['DELETE'])

# ─── Raw Materials ────────────────────────────────────────────────────────────

RM_FIELDS = {
    'item_name': str, 'unit': str, 'transaction_type': str,
    'reorder_level': int, 'amount_issued': float, 'remark': str
}
rm_get, rm_create, rm_update, rm_delete = make_crud('raw_materials', RM_FIELDS)
app.add_url_rule('/api/raw-materials', 'rm_get', login_required(rm_get), methods=['GET'])
app.add_url_rule('/api/raw-materials', 'rm_create', login_required(rm_create), methods=['POST'])
app.add_url_rule('/api/raw-materials/<int:record_id>', 'rm_update', login_required(rm_update), methods=['PUT'])
app.add_url_rule('/api/raw-materials/<int:record_id>', 'rm_delete', login_required(rm_delete), methods=['DELETE'])

# ─── Employees ────────────────────────────────────────────────────────────────

EMP_FIELDS = {
    'name': str, 'role': str, 'shift_time': str,
    'contact_no': str, 'email': str, 'remark': str
}
emp_get, emp_create, emp_update, emp_delete = make_crud('employees', EMP_FIELDS)
app.add_url_rule('/api/employees', 'emp_get', login_required(emp_get), methods=['GET'])
app.add_url_rule('/api/employees', 'emp_create', login_required(emp_create), methods=['POST'])
app.add_url_rule('/api/employees/<int:record_id>', 'emp_update', login_required(emp_update), methods=['PUT'])
app.add_url_rule('/api/employees/<int:record_id>', 'emp_delete', login_required(emp_delete), methods=['DELETE'])

# ─── Suppliers ────────────────────────────────────────────────────────────────

SUP_FIELDS = {
    'supplier_name': str, 'company': str, 'address': str,
    'email': str, 'phone': str, 'products_supplied': str, 'payment_terms': str
}
sup_get, sup_create, sup_update, sup_delete = make_crud('suppliers', SUP_FIELDS)
app.add_url_rule('/api/suppliers', 'sup_get', login_required(sup_get), methods=['GET'])
app.add_url_rule('/api/suppliers', 'sup_create', login_required(sup_create), methods=['POST'])
app.add_url_rule('/api/suppliers/<int:record_id>', 'sup_update', login_required(sup_update), methods=['PUT'])
app.add_url_rule('/api/suppliers/<int:record_id>', 'sup_delete', login_required(sup_delete), methods=['DELETE'])

# ─── Inventory ────────────────────────────────────────────────────────────────

INV_FIELDS = {
    'item_name': str, 'transaction_type': str, 'unit': str,
    'quantity': float, 'transaction_date': str, 'remark': str
}
inv_get, inv_create, inv_update, inv_delete = make_crud('inventory', INV_FIELDS)
app.add_url_rule('/api/inventory', 'inv_get', login_required(inv_get), methods=['GET'])
app.add_url_rule('/api/inventory', 'inv_create', login_required(inv_create), methods=['POST'])
app.add_url_rule('/api/inventory/<int:record_id>', 'inv_update', login_required(inv_update), methods=['PUT'])
app.add_url_rule('/api/inventory/<int:record_id>', 'inv_delete', login_required(inv_delete), methods=['DELETE'])

# ─── Purchases ────────────────────────────────────────────────────────────────

PUR_FIELDS = {
    'po_number': str, 'supplier_name': str, 'item_name': str,
    'quantity': float, 'unit_price': float, 'total_cost': float,
    'delivery_date': str, 'remark': str
}
pur_get, pur_create, pur_update, pur_delete = make_crud('purchases', PUR_FIELDS)
app.add_url_rule('/api/purchases', 'pur_get', login_required(pur_get), methods=['GET'])
app.add_url_rule('/api/purchases', 'pur_create', login_required(pur_create), methods=['POST'])
app.add_url_rule('/api/purchases/<int:record_id>', 'pur_update', login_required(pur_update), methods=['PUT'])
app.add_url_rule('/api/purchases/<int:record_id>', 'pur_delete', login_required(pur_delete), methods=['DELETE'])

# ─── Expenses ─────────────────────────────────────────────────────────────────

EXP_FIELDS = {
    'category': str, 'amount': float, 'date': str, 'description': str,
    'payment_method': str, 'vendor': str, 'approved_by': str,
    'status': str, 'department': str
}
exp_get, exp_create, exp_update, exp_delete = make_crud('expenses', EXP_FIELDS)
app.add_url_rule('/api/expenses', 'exp_get', login_required(exp_get), methods=['GET'])
app.add_url_rule('/api/expenses', 'exp_create', login_required(exp_create), methods=['POST'])
app.add_url_rule('/api/expenses/<int:record_id>', 'exp_update', login_required(exp_update), methods=['PUT'])
app.add_url_rule('/api/expenses/<int:record_id>', 'exp_delete', login_required(exp_delete), methods=['DELETE'])

# ─── Quality Control ──────────────────────────────────────────────────────────

QC_FIELDS = {
    'order_id': str, 'batch_no': str, 'inspection_date': str,
    'inspected_items': str, 'inspector_name': str, 'defect_type': str,
    'qty_checked': int, 'qty_defective': int, 'qc_status': str, 'remark': str
}
qc_get, qc_create, qc_update, qc_delete = make_crud('quality_control', QC_FIELDS)
app.add_url_rule('/api/quality-control', 'qc_get', login_required(qc_get), methods=['GET'])
app.add_url_rule('/api/quality-control', 'qc_create', login_required(qc_create), methods=['POST'])
app.add_url_rule('/api/quality-control/<int:record_id>', 'qc_update', login_required(qc_update), methods=['PUT'])
app.add_url_rule('/api/quality-control/<int:record_id>', 'qc_delete', login_required(qc_delete), methods=['DELETE'])

# ─── Reports & Export ─────────────────────────────────────────────────────────

REPORT_QUERIES = {
    'Production Summary': {
        'table': 'production_orders',
        'query': "SELECT po_id,product_name,batch_no,start_date,end_date,materials_used,machine_name,operator_name,planned_qty,actual_qty,status,remark,created_at FROM production_orders WHERE 1=1",
        'date_col': 'start_date'
    },
    'Inventory Report': {
        'table': 'inventory',
        'query': "SELECT item_name,transaction_type,unit,quantity,transaction_date,remark,created_at FROM inventory WHERE 1=1",
        'date_col': 'transaction_date'
    },
    'Purchase Report': {
        'table': 'purchases',
        'query': "SELECT po_number,supplier_name,item_name,quantity,unit_price,total_cost,delivery_date,remark,created_at FROM purchases WHERE 1=1",
        'date_col': 'delivery_date'
    },
    'QC Report': {
        'table': 'quality_control',
        'query': "SELECT order_id,batch_no,inspection_date,inspected_items,inspector_name,defect_type,qty_checked,qty_defective,qc_status,remark,created_at FROM quality_control WHERE 1=1",
        'date_col': 'inspection_date'
    },
    'Expense Report': {
        'table': 'expenses',
        'query': "SELECT category,amount,date,description,payment_method,vendor,approved_by,status,department,created_at FROM expenses WHERE 1=1",
        'date_col': 'date'
    },
}

@app.route('/api/reports/generate', methods=['POST'])
@login_required
def generate_report():
    data = request.get_json()
    report_name = data.get('report_name')
    date_from = data.get('date_from', '')
    date_to = data.get('date_to', '')
    if report_name not in REPORT_QUERIES:
        return jsonify({'error': 'Unknown report'}), 400
    rpt = REPORT_QUERIES[report_name]
    query = rpt['query']
    params = []
    if date_from:
        query += f" AND {rpt['date_col']} >= ?"
        params.append(date_from)
    if date_to:
        query += f" AND {rpt['date_col']} <= ?"
        params.append(date_to)
    db = get_db()
    rows = db.execute(query, params).fetchall()
    db.close()
    return jsonify([dict(r) for r in rows])

@app.route('/api/export/<module>', methods=['GET'])
@login_required
def export_excel(module):
    MODULE_MAP = {
        'production-orders': ('production_orders', 'Production Orders'),
        'machines': ('machines', 'Machines'),
        'raw-materials': ('raw_materials', 'Raw Materials'),
        'employees': ('employees', 'Employees'),
        'suppliers': ('suppliers', 'Suppliers'),
        'inventory': ('inventory', 'Inventory'),
        'purchases': ('purchases', 'Purchases'),
        'expenses': ('expenses', 'Expenses'),
        'quality-control': ('quality_control', 'Quality Control'),
        'manage-list': ('manage_list', 'Manage List'),
    }
    if module not in MODULE_MAP:
        return jsonify({'error': 'Unknown module'}), 404
    table, sheet_name = MODULE_MAP[module]
    db = get_db()
    rows = db.execute(f"SELECT * FROM {table}").fetchall()
    db.close()
    if not rows:
        return jsonify({'error': 'No data to export'}), 404

    wb = openpyxl.Workbook()
    ws = wb.active
    ws.title = sheet_name

    # Header style
    header_fill = PatternFill(start_color='1F4E79', end_color='1F4E79', fill_type='solid')
    header_font = Font(color='FFFFFF', bold=True, size=11)
    header_align = Alignment(horizontal='center', vertical='center')
    thin_border = Border(
        left=Side(style='thin'), right=Side(style='thin'),
        top=Side(style='thin'), bottom=Side(style='thin')
    )

    headers = list(rows[0].keys())
    ws.append(headers)
    for cell in ws[1]:
        cell.fill = header_fill
        cell.font = header_font
        cell.alignment = header_align
        cell.border = thin_border

    alt_fill = PatternFill(start_color='EBF3FB', end_color='EBF3FB', fill_type='solid')
    for i, row in enumerate(rows, start=2):
        ws.append(list(row))
        for cell in ws[i]:
            cell.border = thin_border
            if i % 2 == 0:
                cell.fill = alt_fill

    for col in ws.columns:
        max_len = max((len(str(c.value or '')) for c in col), default=10)
        ws.column_dimensions[col[0].column_letter].width = min(max_len + 4, 40)
    ws.row_dimensions[1].height = 25

    buf = io.BytesIO()
    wb.save(buf)
    buf.seek(0)
    filename = f"{sheet_name.replace(' ', '_')}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.xlsx"
    return send_file(buf, as_attachment=True, download_name=filename,
                     mimetype='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')

@app.route('/api/export-report', methods=['POST'])
@login_required
def export_report():
    data = request.get_json()
    report_name = data.get('report_name')
    rows_data = data.get('rows', [])
    if not rows_data:
        return jsonify({'error': 'No data'}), 404
    wb = openpyxl.Workbook()
    ws = wb.active
    ws.title = report_name[:31]
    header_fill = PatternFill(start_color='1F4E79', end_color='1F4E79', fill_type='solid')
    header_font = Font(color='FFFFFF', bold=True)
    thin_border = Border(left=Side(style='thin'), right=Side(style='thin'),
                         top=Side(style='thin'), bottom=Side(style='thin'))
    headers = list(rows_data[0].keys())
    ws.append(headers)
    for cell in ws[1]:
        cell.fill = header_fill
        cell.font = header_font
        cell.border = thin_border
    alt_fill = PatternFill(start_color='EBF3FB', end_color='EBF3FB', fill_type='solid')
    for i, row in enumerate(rows_data, 2):
        ws.append(list(row.values()))
        for cell in ws[i]:
            cell.border = thin_border
            if i % 2 == 0:
                cell.fill = alt_fill
    for col in ws.columns:
        max_len = max((len(str(c.value or '')) for c in col), default=10)
        ws.column_dimensions[col[0].column_letter].width = min(max_len + 4, 40)
    buf = io.BytesIO()
    wb.save(buf)
    buf.seek(0)
    filename = f"{report_name.replace(' ', '_')}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.xlsx"
    return send_file(buf, as_attachment=True, download_name=filename,
                     mimetype='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')

# ─── Backup ───────────────────────────────────────────────────────────────────

@app.route('/api/backup', methods=['POST'])
@admin_required
def do_backup():
    path = backup_db()
    return jsonify({'success': True, 'path': path})

@app.route('/api/backups', methods=['GET'])
@admin_required
def list_backups():
    from database import BACKUP_DIR
    files = []
    if os.path.exists(BACKUP_DIR):
        for f in sorted(os.listdir(BACKUP_DIR), reverse=True):
            if f.endswith('.db'):
                full = os.path.join(BACKUP_DIR, f)
                files.append({'name': f, 'size': os.path.getsize(full),
                              'modified': datetime.fromtimestamp(os.path.getmtime(full)).strftime('%Y-%m-%d %H:%M')})
    return jsonify(files)

@app.route('/api/session-info')
def session_info():
    return jsonify({'user': session.get('user', ''), 'role': session.get('role', '')})

if __name__ == '__main__':
    init_db()
    print("🏭 Manufacturing ERP starting on http://127.0.0.1:5000")
    app.run(debug=False, host='127.0.0.1', port=5000)
