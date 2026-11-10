from flask import Flask, render_template, request, jsonify, session, redirect, url_for, send_file
import sqlite3, os, io, json
from datetime import datetime, timedelta
from functools import wraps
import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from database import get_db, hash_pw, init_db, backup_db

app = Flask(__name__)
app.secret_key = 'hospital_erp_2024_ultra_secure'
app.permanent_session_lifetime = timedelta(hours=10)

# ─── Helpers ──────────────────────────────────────────────────────────────────
def login_required(f):
    @wraps(f)
    def dec(*a, **kw):
        if 'user' not in session: return redirect(url_for('login'))
        return f(*a, **kw)
    return dec

def patient_required(f):
    @wraps(f)
    def dec(*a, **kw):
        if 'patient' not in session: return redirect(url_for('patient_login'))
        return f(*a, **kw)
    return dec

def doctor_required(f):
    @wraps(f)
    def dec(*a, **kw):
        if 'doctor_user' not in session: return redirect(url_for('doctor_login'))
        return f(*a, **kw)
    return dec

def admin_required(f):
    @wraps(f)
    def dec(*a, **kw):
        if 'user' not in session: return redirect(url_for('login'))
        if session.get('role') != 'Admin': return jsonify({'error':'Admin only'}), 403
        return f(*a, **kw)
    return dec

def gen_id(prefix, table, col):
    db = get_db()
    count = db.execute(f"SELECT COUNT(*) as c FROM {table}").fetchone()['c'] + 1
    db.close()
    return f"{prefix}-{count:04d}"

def excel_response(rows, sheet_name):
    if not rows: return jsonify({'error':'No data'}), 404
    wb = openpyxl.Workbook(); ws = wb.active; ws.title = sheet_name[:31]
    hf = PatternFill('solid', fgColor='1F4E79')
    hfont = Font(color='FFFFFF', bold=True)
    thin = Border(left=Side(style='thin'),right=Side(style='thin'),top=Side(style='thin'),bottom=Side(style='thin'))
    alt = PatternFill('solid', fgColor='EBF3FB')
    headers = list(rows[0].keys())
    ws.append(headers)
    for cell in ws[1]:
        cell.fill=hf; cell.font=hfont
        cell.alignment=Alignment(horizontal='center'); cell.border=thin
    for i,row in enumerate(rows,2):
        ws.append(list(row))
        for cell in ws[i]:
            cell.border=thin
            if i%2==0: cell.fill=alt
    for col in ws.columns:
        ml=max((len(str(c.value or '')) for c in col),default=10)
        ws.column_dimensions[col[0].column_letter].width=min(ml+4,40)
    buf=io.BytesIO(); wb.save(buf); buf.seek(0)
    fname=f"{sheet_name.replace(' ','_')}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.xlsx"
    return send_file(buf,as_attachment=True,download_name=fname,
                     mimetype='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')

# ══════════════════════════════════════════════════════════════════
# ── ADMIN / STAFF PORTAL ──────────────────────────────────────────
# ══════════════════════════════════════════════════════════════════

@app.route('/')
def index():
    if 'user' in session: return redirect(url_for('dashboard'))
    return redirect(url_for('login'))

@app.route('/login', methods=['GET','POST'])
def login():
    if request.method=='POST':
        d=request.get_json()
        db=get_db()
        u=db.execute("SELECT * FROM users WHERE username=? AND password=? AND is_active=1",
                     (d['username'],hash_pw(d['password']))).fetchone()
        db.close()
        if u:
            session.permanent=True
            session.update({'user':u['username'],'role':u['role'],
                            'user_id':u['id'],'full_name':u['full_name']})
            return jsonify({'success':True,'role':u['role']})
        return jsonify({'success':False,'message':'Invalid credentials'})
    return render_template('admin/login.html')

@app.route('/logout')
def logout():
    session.clear(); return redirect(url_for('login'))

@app.route('/dashboard')
@login_required
def dashboard():
    hi = get_db().execute("SELECT * FROM hospital_info LIMIT 1").fetchone()
    return render_template('admin/dashboard.html',
                           user=session['user'], role=session['role'],
                           full_name=session.get('full_name',''),
                           hospital=dict(hi) if hi else {})

@app.route('/api/dashboard-stats')
@login_required
def dashboard_stats():
    db=get_db()
    today=datetime.now().strftime('%Y-%m-%d')
    s={
        'total_patients':db.execute("SELECT COUNT(*) c FROM patients").fetchone()['c'],
        'total_doctors':db.execute("SELECT COUNT(*) c FROM doctors").fetchone()['c'],
        'today_appointments':db.execute("SELECT COUNT(*) c FROM appointments WHERE appt_date=?",(today,)).fetchone()['c'],
        'admitted_patients':db.execute("SELECT COUNT(*) c FROM admissions WHERE status='Admitted'").fetchone()['c'],
        'pending_labs':db.execute("SELECT COUNT(*) c FROM lab_tests WHERE status='Pending'").fetchone()['c'],
        'low_stock':db.execute("SELECT COUNT(*) c FROM pharmacy WHERE quantity<=reorder_level").fetchone()['c'],
        'today_revenue':db.execute("SELECT COALESCE(SUM(paid),0) c FROM billing WHERE invoice_date=?",(today,)).fetchone()['c'],
        'unpaid_bills':db.execute("SELECT COUNT(*) c FROM billing WHERE payment_status='Unpaid'").fetchone()['c'],
        'appt_by_status':[dict(r) for r in db.execute("SELECT status,COUNT(*) cnt FROM appointments GROUP BY status").fetchall()],
        'monthly_revenue':[dict(r) for r in db.execute("""
            SELECT strftime('%Y-%m',invoice_date) mo,COALESCE(SUM(paid),0) total
            FROM billing GROUP BY mo ORDER BY mo DESC LIMIT 6""").fetchall()],
        'dept_patients':[dict(r) for r in db.execute("""
            SELECT department,COUNT(*) cnt FROM appointments GROUP BY department ORDER BY cnt DESC LIMIT 6""").fetchall()],
        'recent_appointments':[dict(r) for r in db.execute("""
            SELECT * FROM appointments ORDER BY created_at DESC LIMIT 8""").fetchall()],
    }
    db.close(); return jsonify(s)

# ── Hospital Info ──────────────────────────────────────────────────
@app.route('/api/hospital-info', methods=['GET','POST'])
@login_required
def hospital_info():
    db=get_db()
    if request.method=='GET':
        r=db.execute("SELECT * FROM hospital_info LIMIT 1").fetchone()
        db.close(); return jsonify(dict(r) if r else {})
    d=request.get_json()
    ex=db.execute("SELECT id FROM hospital_info LIMIT 1").fetchone()
    fields=['name','address','city','state','country','phone','email','website','tagline']
    vals=[d.get(f,'') for f in fields]
    if ex:
        sets=','.join(f"{f}=?" for f in fields)
        db.execute(f"UPDATE hospital_info SET {sets},updated_at=CURRENT_TIMESTAMP WHERE id=?",vals+[ex['id']])
    else:
        cols=','.join(fields); phs=','.join(['?']*len(fields))
        db.execute(f"INSERT INTO hospital_info({cols}) VALUES({phs})",vals)
    db.commit(); db.close(); return jsonify({'success':True})

# ── Manage List ────────────────────────────────────────────────────
@app.route('/api/manage-list', methods=['GET','POST'])
@login_required
def manage_list():
    db=get_db()
    if request.method=='GET':
        r=db.execute("SELECT * FROM manage_list ORDER BY list_name,list_item").fetchall()
        db.close(); return jsonify([dict(x) for x in r])
    d=request.get_json()
    db.execute("INSERT INTO manage_list(list_name,list_item) VALUES(?,?)",(d['list_name'],d['list_item']))
    db.commit(); db.close(); return jsonify({'success':True})

@app.route('/api/manage-list/<int:i>', methods=['DELETE'])
@login_required
def del_list_item(i):
    db=get_db(); db.execute("DELETE FROM manage_list WHERE id=?",(i,))
    db.commit(); db.close(); return jsonify({'success':True})

@app.route("/api/list-items/<name>")
@login_required
def list_items(n):
    db=get_db()
    r=db.execute("SELECT list_item FROM manage_list WHERE list_name=? ORDER BY list_item",(n,)).fetchall()
    db.close(); return jsonify([x['list_item'] for x in r])

@app.route('/api/list-names')
@login_required
def list_names():
    db=get_db()
    r=db.execute("SELECT DISTINCT list_name FROM manage_list ORDER BY list_name").fetchall()
    db.close(); return jsonify([x['list_name'] for x in r])

# ── Users ──────────────────────────────────────────────────────────
@app.route('/api/users', methods=['GET','POST'])
@login_required
def users():
    db=get_db()
    if request.method=='GET':
        r=db.execute("SELECT id,username,role,full_name,email,is_active,created_at FROM users").fetchall()
        db.close(); return jsonify([dict(x) for x in r])
    d=request.get_json()
    try:
        db.execute("INSERT INTO users(username,password,role,full_name,email) VALUES(?,?,?,?,?)",
                   (d['username'],hash_pw(d['password']),d.get('role','Staff'),d.get('full_name',''),d.get('email','')))
        db.commit(); db.close(); return jsonify({'success':True})
    except sqlite3.IntegrityError:
        db.close(); return jsonify({'success':False,'message':'Username exists'})

@app.route('/api/users/<int:uid>', methods=['PUT','DELETE'])
@admin_required
def user_action(uid):
    db=get_db()
    if request.method=='DELETE':
        db.execute("DELETE FROM users WHERE id=?",(uid,))
        db.commit(); db.close(); return jsonify({'success':True})
    d=request.get_json()
    db.execute("UPDATE users SET role=?,full_name=?,email=?,is_active=?,password=? WHERE id=?",
               (d.get('role'),d.get('full_name'),d.get('email'),d.get('is_active',1),
                hash_pw(d['password']) if d.get('password') else
                db.execute("SELECT password FROM users WHERE id=?",(uid,)).fetchone()['password'], uid))
    db.commit(); db.close(); return jsonify({'success':True})

# ── Generic CRUD factory ───────────────────────────────────────────
def crud_routes(table, fields, prefix, id_col='id'):
    def get_all():
        db=get_db()
        s=request.args.get('search','')
        sort=request.args.get('sort','id')
        order='DESC' if request.args.get('order','DESC')=='DESC' else 'ASC'
        dfrom=request.args.get('date_from','')
        dto=request.args.get('date_to','')
        safe_sort = sort if sort in (['id']+list(fields.keys())) else 'id'
        q=f"SELECT * FROM {table} WHERE 1=1"
        params=[]
        if s:
            conds=' OR '.join([f"CAST({f} AS TEXT) LIKE ?" for f in fields.keys()])
            q+=f" AND ({conds})"; params+=[f'%{s}%']*len(fields)
        if dfrom: q+=" AND created_at>=?"; params.append(dfrom)
        if dto: q+=" AND created_at<=?"; params.append(dto+' 23:59:59')
        q+=f" ORDER BY {safe_sort} {order}"
        r=db.execute(q,params).fetchall()
        db.close(); return jsonify([dict(x) for x in r])

    def create():
        d=request.get_json(); db=get_db()
        cols=list(fields.keys()); vals=[d.get(c,'') for c in cols]
        phs=','.join(['?']*len(cols))
        try:
            cur=db.execute(f"INSERT INTO {table}({','.join(cols)}) VALUES({phs})",vals)
            db.commit(); nid=cur.lastrowid; db.close()
            return jsonify({'success':True,'id':nid})
        except sqlite3.IntegrityError as e:
            db.close(); return jsonify({'success':False,'message':str(e)})

    def update(rid):
        d=request.get_json(); db=get_db()
        cols=list(fields.keys()); vals=[d.get(c,'') for c in cols]
        sets=','.join(f"{c}=?" for c in cols)
        db.execute(f"UPDATE {table} SET {sets} WHERE id=?",vals+[rid])
        db.commit(); db.close(); return jsonify({'success':True})

    def delete(rid):
        db=get_db(); db.execute(f"DELETE FROM {table} WHERE id=?",(rid,))
        db.commit(); db.close(); return jsonify({'success':True})

    return get_all, create, update, delete

# ── Doctors ────────────────────────────────────────────────────────
DOC_F={'doc_id':str,'full_name':str,'specialization':str,'qualification':str,
       'phone':str,'email':str,'department':str,'schedule':str,
       'status':str,'consultation_fee':float,'remark':str}
dg,dc,du,dd=crud_routes('doctors',DOC_F,'doc')
app.add_url_rule('/api/doctors','dg',login_required(dg),methods=['GET'])
app.add_url_rule('/api/doctors','dc',login_required(dc),methods=['POST'])
app.add_url_rule('/api/doctors/<int:rid>','du',login_required(du),methods=['PUT'])
app.add_url_rule('/api/doctors/<int:rid>','dd',login_required(dd),methods=['DELETE'])

# ── Patients ───────────────────────────────────────────────────────
PAT_F={'patient_id':str,'full_name':str,'dob':str,'gender':str,'blood_group':str,
       'phone':str,'email':str,'address':str,'next_of_kin':str,'kin_phone':str,
       'allergies':str,'chronic_conditions':str,'status':str,'remark':str}
pg,pc,pu,pd_=crud_routes('patients',PAT_F,'pat')
app.add_url_rule('/api/patients','pg',login_required(pg),methods=['GET'])
app.add_url_rule('/api/patients','pc',login_required(pc),methods=['POST'])
app.add_url_rule('/api/patients/<int:rid>','pu',login_required(pu),methods=['PUT'])
app.add_url_rule('/api/patients/<int:rid>','pd_',login_required(pd_),methods=['DELETE'])

# ── Appointments ───────────────────────────────────────────────────
APPT_F={'appt_id':str,'patient_id':str,'patient_name':str,'doctor_id':str,
        'doctor_name':str,'department':str,'appt_date':str,'appt_time':str,
        'reason':str,'status':str,'notes':str,'fee':float,'booked_by':str}
ag,ac,au,ad=crud_routes('appointments',APPT_F,'appt')
app.add_url_rule('/api/appointments','ag',login_required(ag),methods=['GET'])
app.add_url_rule('/api/appointments','ac',login_required(ac),methods=['POST'])
app.add_url_rule('/api/appointments/<int:rid>','au',login_required(au),methods=['PUT'])
app.add_url_rule('/api/appointments/<int:rid>','ad',login_required(ad),methods=['DELETE'])

# ── Vitals ─────────────────────────────────────────────────────────
VIT_F={'patient_id':str,'recorded_by':str,'bp_systolic':int,'bp_diastolic':int,
       'pulse':int,'temperature':float,'weight':float,'height':float,
       'oxygen_sat':float,'glucose':float,'recorded_date':str,'remark':str}
vg,vc,vu,vd=crud_routes('vitals',VIT_F,'vit')
app.add_url_rule('/api/vitals','vg',login_required(vg),methods=['GET'])
app.add_url_rule('/api/vitals','vc',login_required(vc),methods=['POST'])
app.add_url_rule('/api/vitals/<int:rid>','vu',login_required(vu),methods=['PUT'])
app.add_url_rule('/api/vitals/<int:rid>','vd',login_required(vd),methods=['DELETE'])

# ── OPD Visits ─────────────────────────────────────────────────────
OPD_F={'visit_id':str,'patient_id':str,'patient_name':str,'doctor_id':str,
       'doctor_name':str,'visit_date':str,'chief_complaint':str,'diagnosis':str,
       'prescription':str,'follow_up_date':str,'referral':str,'notes':str,
       'fee':float,'status':str}
og,oc,ou,od=crud_routes('opd_visits',OPD_F,'opd')
app.add_url_rule('/api/opd-visits','og',login_required(og),methods=['GET'])
app.add_url_rule('/api/opd-visits','oc',login_required(oc),methods=['POST'])
app.add_url_rule('/api/opd-visits/<int:rid>','ou',login_required(ou),methods=['PUT'])
app.add_url_rule('/api/opd-visits/<int:rid>','od',login_required(od),methods=['DELETE'])

# ── Admissions (IPD) ───────────────────────────────────────────────
ADM_F={'admission_id':str,'patient_id':str,'patient_name':str,'doctor_id':str,
       'doctor_name':str,'ward':str,'bed_no':str,'admission_date':str,
       'discharge_date':str,'diagnosis':str,'notes':str,'status':str,'fee_per_day':float}
admg,admc,admu,admd=crud_routes('admissions',ADM_F,'adm')
app.add_url_rule('/api/admissions','admg',login_required(admg),methods=['GET'])
app.add_url_rule('/api/admissions','admc',login_required(admc),methods=['POST'])
app.add_url_rule('/api/admissions/<int:rid>','admu',login_required(admu),methods=['PUT'])
app.add_url_rule('/api/admissions/<int:rid>','admd',login_required(admd),methods=['DELETE'])

# ── Lab Tests ──────────────────────────────────────────────────────
LAB_F={'lab_id':str,'patient_id':str,'patient_name':str,'doctor_id':str,
       'doctor_name':str,'test_name':str,'test_date':str,'result':str,
       'reference_range':str,'status':str,'fee':float,'released_to_patient':int,'remark':str}
lbg,lbc,lbu,lbd=crud_routes('lab_tests',LAB_F,'lab')
app.add_url_rule('/api/lab-tests','lbg',login_required(lbg),methods=['GET'])
app.add_url_rule('/api/lab-tests','lbc',login_required(lbc),methods=['POST'])
app.add_url_rule('/api/lab-tests/<int:rid>','lbu',login_required(lbu),methods=['PUT'])
app.add_url_rule('/api/lab-tests/<int:rid>','lbd',login_required(lbd),methods=['DELETE'])

# ── Pharmacy ───────────────────────────────────────────────────────
PH_F={'medicine_name':str,'category':str,'unit':str,'quantity':int,'reorder_level':int,
      'unit_price':float,'expiry_date':str,'supplier':str,'status':str,'remark':str}
phg,phc,phu,phd=crud_routes('pharmacy',PH_F,'ph')
app.add_url_rule('/api/pharmacy','phg',login_required(phg),methods=['GET'])
app.add_url_rule('/api/pharmacy','phc',login_required(phc),methods=['POST'])
app.add_url_rule('/api/pharmacy/<int:rid>','phu',login_required(phu),methods=['PUT'])
app.add_url_rule('/api/pharmacy/<int:rid>','phd',login_required(phd),methods=['DELETE'])

# ── Prescriptions ──────────────────────────────────────────────────
RX_F={'rx_id':str,'patient_id':str,'patient_name':str,'doctor_id':str,
      'doctor_name':str,'visit_id':str,'medicines':str,'instructions':str,
      'dispensed':int,'dispensed_by':str,'dispensed_date':str}
rxg,rxc,rxu,rxd=crud_routes('prescriptions',RX_F,'rx')
app.add_url_rule('/api/prescriptions','rxg',login_required(rxg),methods=['GET'])
app.add_url_rule('/api/prescriptions','rxc',login_required(rxc),methods=['POST'])
app.add_url_rule('/api/prescriptions/<int:rid>','rxu',login_required(rxu),methods=['PUT'])
app.add_url_rule('/api/prescriptions/<int:rid>','rxd',login_required(rxd),methods=['DELETE'])

# ── Billing ────────────────────────────────────────────────────────
BILL_F={'invoice_no':str,'patient_id':str,'patient_name':str,'items':str,
        'subtotal':float,'discount':float,'total':float,'paid':float,'balance':float,
        'payment_method':str,'payment_status':str,'issued_by':str,'invoice_date':str}
blg,blc,blu,bld=crud_routes('billing',BILL_F,'bl')
app.add_url_rule('/api/billing','blg',login_required(blg),methods=['GET'])
app.add_url_rule('/api/billing','blc',login_required(blc),methods=['POST'])
app.add_url_rule('/api/billing/<int:rid>','blu',login_required(blu),methods=['PUT'])
app.add_url_rule('/api/billing/<int:rid>','bld',login_required(bld),methods=['DELETE'])

# ── Staff ──────────────────────────────────────────────────────────
ST_F={'staff_id':str,'full_name':str,'role':str,'department':str,'phone':str,
      'email':str,'shift':str,'salary':float,'status':str,'join_date':str,'remark':str}
stg,stc,stu,std=crud_routes('staff',ST_F,'st')
app.add_url_rule('/api/staff','stg',login_required(stg),methods=['GET'])
app.add_url_rule('/api/staff','stc',login_required(stc),methods=['POST'])
app.add_url_rule('/api/staff/<int:rid>','stu',login_required(stu),methods=['PUT'])
app.add_url_rule('/api/staff/<int:rid>','std',login_required(std),methods=['DELETE'])

# ── Expenses ───────────────────────────────────────────────────────
EXP_F={'category':str,'amount':float,'expense_date':str,'description':str,
       'payment_method':str,'approved_by':str,'department':str,'status':str,'remark':str}
exg,exc,exu,exd=crud_routes('expenses',EXP_F,'ex')
app.add_url_rule('/api/expenses','exg',login_required(exg),methods=['GET'])
app.add_url_rule('/api/expenses','exc',login_required(exc),methods=['POST'])
app.add_url_rule('/api/expenses/<int:rid>','exu',login_required(exu),methods=['PUT'])
app.add_url_rule('/api/expenses/<int:rid>','exd',login_required(exd),methods=['DELETE'])

# ── Wards ──────────────────────────────────────────────────────────
WD_F={'ward_name':str,'ward_type':str,'total_beds':int,'occupied_beds':int,
      'floor':str,'status':str,'remark':str}
wdg,wdc,wdu,wdd=crud_routes('wards',WD_F,'wd')
app.add_url_rule('/api/wards','wdg',login_required(wdg),methods=['GET'])
app.add_url_rule('/api/wards','wdc',login_required(wdc),methods=['POST'])
app.add_url_rule('/api/wards/<int:rid>','wdu',login_required(wdu),methods=['PUT'])
app.add_url_rule('/api/wards/<int:rid>','wdd',login_required(wdd),methods=['DELETE'])

# ── Notifications ──────────────────────────────────────────────────
@app.route('/api/notifications')
@login_required
def get_notifs():
    db=get_db()
    r=db.execute("SELECT * FROM notifications WHERE recipient_type='staff' ORDER BY created_at DESC LIMIT 20").fetchall()
    db.close(); return jsonify([dict(x) for x in r])

@app.route('/api/notifications/mark-read', methods=['POST'])
@login_required
def mark_read():
    db=get_db()
    db.execute("UPDATE notifications SET is_read=1 WHERE recipient_type='staff'")
    db.commit(); db.close(); return jsonify({'success':True})

# ── Export ─────────────────────────────────────────────────────────
EXPORT_MAP={
    'doctors':('doctors','Doctors'), 'patients':('patients','Patients'),
    'appointments':('appointments','Appointments'), 'vitals':('vitals','Vitals'),
    'opd-visits':('opd_visits','OPD Visits'), 'admissions':('admissions','Admissions'),
    'lab-tests':('lab_tests','Lab Tests'), 'pharmacy':('pharmacy','Pharmacy'),
    'prescriptions':('prescriptions','Prescriptions'), 'billing':('billing','Billing'),
    'staff':('staff','Staff'), 'expenses':('expenses','Expenses'),
    'wards':('wards','Wards'),
}
@app.route('/api/export/<module>')
@login_required
def export(module):
    if module not in EXPORT_MAP: return jsonify({'error':'Unknown'}),404
    table,name=EXPORT_MAP[module]
    db=get_db(); rows=db.execute(f"SELECT * FROM {table}").fetchall(); db.close()
    return excel_response([dict(r) for r in rows], name)

# ── Backup ─────────────────────────────────────────────────────────
@app.route('/api/backup', methods=['POST'])
@login_required
def do_backup():
    path=backup_db(); return jsonify({'success':True,'path':os.path.basename(path)})

# ── Reports ────────────────────────────────────────────────────────
@app.route('/api/reports', methods=['POST'])
@login_required
def reports():
    d=request.get_json()
    rname=d.get('report_name','')
    dfrom=d.get('date_from',''); dto=d.get('date_to','')
    RPTS={
        'Daily Appointments':("SELECT appt_date,patient_name,doctor_name,department,appt_time,status,reason FROM appointments WHERE 1=1",'appt_date'),
        'Patient List':("SELECT patient_id,full_name,gender,blood_group,phone,email,status FROM patients WHERE 1=1",'created_at'),
        'Revenue Report':("SELECT invoice_date,invoice_no,patient_name,total,paid,balance,payment_status FROM billing WHERE 1=1",'invoice_date'),
        'Lab Test Report':("SELECT test_date,lab_id,patient_name,doctor_name,test_name,status,result FROM lab_tests WHERE 1=1",'test_date'),
        'OPD Report':("SELECT visit_date,visit_id,patient_name,doctor_name,chief_complaint,diagnosis FROM opd_visits WHERE 1=1",'visit_date'),
        'Admission Report':("SELECT admission_date,admission_id,patient_name,doctor_name,ward,status FROM admissions WHERE 1=1",'admission_date'),
        'Expense Report':("SELECT expense_date,category,amount,description,department,status FROM expenses WHERE 1=1",'expense_date'),
        'Pharmacy Stock':("SELECT medicine_name,category,quantity,reorder_level,unit_price,expiry_date,status FROM pharmacy WHERE 1=1",'created_at'),
    }
    if rname not in RPTS: return jsonify({'error':'Unknown report'}),400
    q,dc=RPTS[rname]; params=[]
    if dfrom: q+=f" AND {dc}>=?"; params.append(dfrom)
    if dto: q+=f" AND {dc}<=?"; params.append(dto)
    db=get_db(); rows=db.execute(q,params).fetchall(); db.close()
    return jsonify([dict(r) for r in rows])

@app.route('/api/export-report', methods=['POST'])
@login_required
def export_report():
    d=request.get_json()
    rows=d.get('rows',[]); name=d.get('report_name','Report')
    if not rows: return jsonify({'error':'No data'}),404
    wb=openpyxl.Workbook(); ws=wb.active; ws.title=name[:31]
    hf=PatternFill('solid',fgColor='1F4E79'); hfont=Font(color='FFFFFF',bold=True)
    thin=Border(left=Side(style='thin'),right=Side(style='thin'),top=Side(style='thin'),bottom=Side(style='thin'))
    alt=PatternFill('solid',fgColor='EBF3FB')
    ws.append(list(rows[0].keys()))
    for cell in ws[1]: cell.fill=hf; cell.font=hfont; cell.border=thin
    for i,r in enumerate(rows,2):
        ws.append(list(r.values()))
        for cell in ws[i]:
            cell.border=thin
            if i%2==0: cell.fill=alt
    for col in ws.columns:
        ml=max((len(str(c.value or '')) for c in col),default=10)
        ws.column_dimensions[col[0].column_letter].width=min(ml+4,40)
    buf=io.BytesIO(); wb.save(buf); buf.seek(0)
    fname=f"{name.replace(' ','_')}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.xlsx"
    return send_file(buf,as_attachment=True,download_name=fname,
                     mimetype='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')

# ─── session info ─────────────────────────────────────────────────
@app.route('/api/session')
def sess_info():
    return jsonify({'user':session.get('user',''),'role':session.get('role',''),
                    'full_name':session.get('full_name','')})

# ══════════════════════════════════════════════════════════════════
# ── DOCTOR PORTAL ─────────────────────────────────────────────────
# ══════════════════════════════════════════════════════════════════

@app.route('/doctor/login', methods=['GET','POST'])
def doctor_login():
    if request.method=='POST':
        d=request.get_json()
        db=get_db()
        u=db.execute("SELECT * FROM users WHERE username=? AND password=? AND role='Doctor' AND is_active=1",
                     (d['username'],hash_pw(d['password']))).fetchone()
        if u:
            # find matching doctor record
            doc=db.execute("SELECT * FROM doctors WHERE email=? OR full_name=?",(u['email'],u['full_name'])).fetchone()
            db.close()
            session.permanent=True
            session['doctor_user']=u['username']
            session['doctor_name']=u['full_name']
            session['doctor_id']=doc['doc_id'] if doc else ''
            session['doctor_db_id']=doc['id'] if doc else None
            return jsonify({'success':True})
        db.close(); return jsonify({'success':False,'message':'Invalid doctor credentials'})
    return render_template('doctor/login.html')

@app.route('/doctor/logout')
def doctor_logout():
    for k in ['doctor_user','doctor_name','doctor_id','doctor_db_id']:
        session.pop(k,None)
    return redirect(url_for('doctor_login'))

@app.route('/doctor')
@doctor_required
def doctor_dashboard():
    return render_template('doctor/dashboard.html',
                           doctor_name=session['doctor_name'],
                           doctor_id=session['doctor_id'])

@app.route('/api/doctor/my-appointments')
@doctor_required
def doctor_appointments():
    db=get_db()
    did=session['doctor_id']
    r=db.execute("SELECT * FROM appointments WHERE doctor_id=? ORDER BY appt_date DESC,appt_time DESC",(did,)).fetchall()
    db.close(); return jsonify([dict(x) for x in r])

@app.route('/api/doctor/my-patients')
@doctor_required
def doctor_patients():
    db=get_db()
    did=session['doctor_id']
    r=db.execute("""SELECT DISTINCT p.* FROM patients p
                    JOIN appointments a ON p.patient_id=a.patient_id
                    WHERE a.doctor_id=? ORDER BY p.full_name""",(did,)).fetchall()
    db.close(); return jsonify([dict(x) for x in r])

@app.route('/api/doctor/opd-visits', methods=['GET','POST'])
@doctor_required
def doctor_opd():
    db=get_db()
    if request.method=='GET':
        did=session['doctor_id']
        r=db.execute("SELECT * FROM opd_visits WHERE doctor_id=? ORDER BY visit_date DESC",(did,)).fetchall()
        db.close(); return jsonify([dict(x) for x in r])
    d=request.get_json()
    d['doctor_id']=session['doctor_id']
    d['doctor_name']=session['doctor_name']
    d['visit_id']=d.get('visit_id') or gen_id('VIS','opd_visits','visit_id')
    cols=['visit_id','patient_id','patient_name','doctor_id','doctor_name','visit_date',
          'chief_complaint','diagnosis','prescription','follow_up_date','referral','notes','fee','status']
    vals=[d.get(c,'') for c in cols]
    cur=db.execute(f"INSERT INTO opd_visits({','.join(cols)}) VALUES({','.join(['?']*len(cols))})",vals)
    db.commit(); db.close(); return jsonify({'success':True,'id':cur.lastrowid})

@app.route('/api/doctor/lab-requests', methods=['GET','POST'])
@doctor_required
def doctor_labs():
    db=get_db()
    if request.method=='GET':
        did=session['doctor_id']
        r=db.execute("SELECT * FROM lab_tests WHERE doctor_id=? ORDER BY test_date DESC",(did,)).fetchall()
        db.close(); return jsonify([dict(x) for x in r])
    d=request.get_json()
    d['lab_id']=gen_id('LAB','lab_tests','lab_id')
    d['doctor_id']=session['doctor_id']; d['doctor_name']=session['doctor_name']
    cols=['lab_id','patient_id','patient_name','doctor_id','doctor_name','test_name','test_date','result','reference_range','status','fee','remark']
    vals=[d.get(c,'') for c in cols]
    cur=db.execute(f"INSERT INTO lab_tests({','.join(cols)}) VALUES({','.join(['?']*len(cols))})",vals)
    db.commit(); db.close(); return jsonify({'success':True,'id':cur.lastrowid})

@app.route('/api/doctor/prescriptions', methods=['GET','POST'])
@doctor_required
def doctor_prescriptions():
    db=get_db()
    if request.method=='GET':
        did=session['doctor_id']
        r=db.execute("SELECT * FROM prescriptions WHERE doctor_id=? ORDER BY created_at DESC",(did,)).fetchall()
        db.close(); return jsonify([dict(x) for x in r])
    d=request.get_json()
    d['rx_id']=gen_id('RX','prescriptions','rx_id')
    d['doctor_id']=session['doctor_id']; d['doctor_name']=session['doctor_name']
    cols=['rx_id','patient_id','patient_name','doctor_id','doctor_name','visit_id','medicines','instructions']
    vals=[d.get(c,'') for c in cols]
    cur=db.execute(f"INSERT INTO prescriptions({','.join(cols)}) VALUES({','.join(['?']*len(cols))})",vals)
    db.commit(); db.close(); return jsonify({'success':True,'id':cur.lastrowid})

@app.route('/api/doctor/vitals/<patient_id>')
@doctor_required
def doctor_patient_vitals(patient_id):
    db=get_db()
    r=db.execute("SELECT * FROM vitals WHERE patient_id=? ORDER BY recorded_date DESC LIMIT 20",(patient_id,)).fetchall()
    db.close(); return jsonify([dict(x) for x in r])

@app.route('/api/doctor/update-appointment/<int:rid>', methods=['PUT'])
@doctor_required
def doc_update_appt(rid):
    d=request.get_json(); db=get_db()
    db.execute("UPDATE appointments SET status=?,notes=? WHERE id=?",(d.get('status'),d.get('notes'),rid))
    db.commit(); db.close(); return jsonify({'success':True})

# ══════════════════════════════════════════════════════════════════
# ── PATIENT PORTAL ────────────────────────────────────────────────
# ══════════════════════════════════════════════════════════════════

@app.route('/patient/login', methods=['GET','POST'])
def patient_login():
    if request.method=='POST':
        d=request.get_json()
        db=get_db()
        p=db.execute("SELECT * FROM patients WHERE patient_id=? AND patient_password=? AND is_registered=1",
                     (d['patient_id'],hash_pw(d['password']))).fetchone()
        db.close()
        if p:
            session.permanent=True
            session['patient']=p['patient_id']
            session['patient_name']=p['full_name']
            session['patient_db_id']=p['id']
            return jsonify({'success':True})
        return jsonify({'success':False,'message':'Invalid Patient ID or password'})
    return render_template('patient/login.html')

@app.route('/patient/register', methods=['GET','POST'])
def patient_register():
    if request.method=='POST':
        d=request.get_json()
        db=get_db()
        p=db.execute("SELECT * FROM patients WHERE patient_id=? AND phone=?",(d['patient_id'],d['phone'])).fetchone()
        if not p:
            db.close(); return jsonify({'success':False,'message':'Patient ID or phone not found. Please visit the hospital to register.'})
        if p['is_registered']:
            db.close(); return jsonify({'success':False,'message':'This patient is already registered. Please login.'})
        db.execute("UPDATE patients SET patient_password=?,email=?,is_registered=1 WHERE patient_id=?",
                   (hash_pw(d['password']),d.get('email',''),d['patient_id']))
        db.commit(); db.close()
        return jsonify({'success':True})
    return render_template('patient/register.html')

@app.route('/patient/logout')
def patient_logout():
    for k in ['patient','patient_name','patient_db_id']: session.pop(k,None)
    return redirect(url_for('patient_login'))

@app.route('/patient')
@patient_required
def patient_dashboard():
    return render_template('patient/dashboard.html',
                           patient_name=session['patient_name'],
                           patient_id=session['patient'])

# Patient API endpoints
@app.route('/api/patient/profile')
@patient_required
def patient_profile():
    db=get_db()
    p=db.execute("SELECT * FROM patients WHERE patient_id=?",(session['patient'],)).fetchone()
    db.close()
    if not p: return jsonify({})
    r=dict(p); r.pop('patient_password',None); return jsonify(r)

@app.route('/api/patient/appointments')
@patient_required
def patient_appointments():
    db=get_db()
    r=db.execute("SELECT * FROM appointments WHERE patient_id=? ORDER BY appt_date DESC,appt_time DESC",(session['patient'],)).fetchall()
    db.close(); return jsonify([dict(x) for x in r])

@app.route('/api/patient/book-appointment', methods=['POST'])
@patient_required
def patient_book_appt():
    d=request.get_json(); db=get_db()
    pid=session['patient']; pname=session['patient_name']
    appt_id=gen_id('APPT','appointments','appt_id')
    doc=db.execute("SELECT * FROM doctors WHERE doc_id=?",(d['doctor_id'],)).fetchone()
    db.execute("""INSERT INTO appointments(appt_id,patient_id,patient_name,doctor_id,doctor_name,
               department,appt_date,appt_time,reason,status,booked_by)
               VALUES(?,?,?,?,?,?,?,?,?,?,?)""",
               (appt_id,pid,pname,d['doctor_id'],
                doc['full_name'] if doc else d['doctor_id'],
                doc['department'] if doc else '',
                d['appt_date'],d['appt_time'],d.get('reason',''),
                'Pending','Patient'))
    db.commit(); db.close()
    return jsonify({'success':True,'appt_id':appt_id})

@app.route('/api/patient/cancel-appointment/<int:aid>', methods=['PUT'])
@patient_required
def patient_cancel_appt(aid):
    db=get_db()
    db.execute("UPDATE appointments SET status='Cancelled' WHERE id=? AND patient_id=?",(aid,session['patient']))
    db.commit(); db.close(); return jsonify({'success':True})

@app.route('/api/patient/vitals')
@patient_required
def patient_vitals():
    db=get_db()
    r=db.execute("SELECT * FROM vitals WHERE patient_id=? ORDER BY recorded_date DESC LIMIT 30",(session['patient'],)).fetchall()
    db.close(); return jsonify([dict(x) for x in r])

@app.route('/api/patient/lab-results')
@patient_required
def patient_lab_results():
    db=get_db()
    r=db.execute("SELECT * FROM lab_tests WHERE patient_id=? AND released_to_patient=1 ORDER BY test_date DESC",(session['patient'],)).fetchall()
    db.close(); return jsonify([dict(x) for x in r])

@app.route('/api/patient/prescriptions')
@patient_required
def patient_prescriptions():
    db=get_db()
    r=db.execute("SELECT * FROM prescriptions WHERE patient_id=? ORDER BY created_at DESC",(session['patient'],)).fetchall()
    db.close(); return jsonify([dict(x) for x in r])

@app.route('/api/patient/bills')
@patient_required
def patient_bills():
    db=get_db()
    r=db.execute("SELECT * FROM billing WHERE patient_id=? ORDER BY invoice_date DESC",(session['patient'],)).fetchall()
    db.close(); return jsonify([dict(x) for x in r])

@app.route('/api/patient/opd-history')
@patient_required
def patient_opd():
    db=get_db()
    r=db.execute("SELECT * FROM opd_visits WHERE patient_id=? ORDER BY visit_date DESC",(session['patient'],)).fetchall()
    db.close(); return jsonify([dict(x) for x in r])

@app.route('/api/patient/doctors')
@patient_required
def patient_get_doctors():
    db=get_db()
    r=db.execute("SELECT doc_id,full_name,specialization,department,schedule,consultation_fee FROM doctors WHERE status='Active' ORDER BY full_name").fetchall()
    db.close(); return jsonify([dict(x) for x in r])

@app.route('/api/patient/notifications')
@patient_required
def patient_notifs():
    db=get_db()
    r=db.execute("SELECT * FROM notifications WHERE recipient_type='patient' AND recipient_id=? ORDER BY created_at DESC LIMIT 20",(session['patient'],)).fetchall()
    db.close(); return jsonify([dict(x) for x in r])

@app.route('/api/patient/vitals/add', methods=['POST'])
@patient_required
def patient_add_vitals():
    d=request.get_json(); db=get_db()
    cols=['patient_id','recorded_by','bp_systolic','bp_diastolic','pulse','temperature','weight','height','oxygen_sat','glucose','recorded_date','remark']
    vals=[session['patient'],'Self',d.get('bp_systolic',''),d.get('bp_diastolic',''),d.get('pulse',''),d.get('temperature',''),d.get('weight',''),d.get('height',''),d.get('oxygen_sat',''),d.get('glucose',''),d.get('recorded_date',''),d.get('remark','')]
    db.execute(f"INSERT INTO vitals({','.join(cols)}) VALUES({','.join(['?']*len(cols))})",vals)
    db.commit(); db.close(); return jsonify({'success':True})

if __name__ == '__main__':
    init_db()
    print("🏥 Hospital ERP starting on http://127.0.0.1:5001")
    app.run(debug=False, host='127.0.0.1', port=5001)
