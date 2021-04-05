# 메뉴관리모듈의 Blueprint 생성코드 및 관련 view들이 들어가는 곳입니다.
# https://flask.palletsprojects.com/en/1.1.x/tutorial/views/ 참고
# https://flask.palletsprojects.com/en/1.1.x/tutorial/blog/ 참고
import functools
import json
import os
from flask import (
    Blueprint, flash, g, redirect, render_template, request, session, url_for, jsonify, current_app
)
from werkzeug.security import check_password_hash, generate_password_hash
from werkzeug.utils import secure_filename

from kiosk.db import get_db
from kiosk.auth import login_required


bp = Blueprint('manage_menu', __name__, url_prefix='/manage_menu')

# Protect entire Blueprint with a login
@bp.before_request
@login_required
def login_required_for_all_request():    
    pass  

@bp.route('/', methods=['GET'])
def view_menu():
    burgers = fetch_menu_by_category('햄버거')
    desserts = fetch_menu_by_category('디저트')
    drinks = fetch_menu_by_category('음료')   
    return render_template('/manage_menu/manage_menu.html', burgers=burgers, desserts=desserts, drinks=drinks) 

def fetch_menu_by_category(menu_cat):
    sql = \
    '''
    SELECT ID, NAME, PRICE
    FROM MENU M INNER JOIN MENU_CATEGORY C
    ON M.ID=C.MENU_ID
    WHERE CATEGORY_TAG=?
    '''
    db = get_db()
    return db.execute(sql, (menu_cat,)).fetchall()

@bp.route('/detail', methods=['POST'])
def view_detail():
    db = get_db()
    if request.method=='POST':
        menu_id=request.get_json()
        c = db.cursor()
        
        categories = c.execute('''SELECT CATEGORY_TAG FROM MENU_CATEGORY
                                WHERE MENU_ID = ?''',(menu_id,)).fetchall()
        categories = tuple(row[0] for row in categories)
        print(categories)
        db.row_factory = dict_factory
        res = db.execute('SELECT ID, NAME, IMAGE_PATH, PRICE, DESC, \
                        WEIGHT_G, KCAL, PROTEIN_G, PROTEIN_PCENT, SODIUM_MG, \
                        SODIUM_PCENT, SUGAR_G, SAT_FAT_G, SAT_FAT_PCENT, CAFFEINE_MG, \
                        ALLERGY_INFO \
                        FROM MENU WHERE ID=?',(menu_id,))
        menu_detail = res.fetchone()
        
        db.close()
        print(menu_detail)
        return jsonify(menu_detail=menu_detail, categories=categories)

def dict_factory(cursor, row):
    d = {}
    for idx, col in enumerate(cursor.description):
        d[col[0]] = row[idx]
    return d


@bp.route('/add', methods=['POST'])
def add_menu():
    db = get_db()
    c = db.cursor()
    if request.method == 'POST':
        menu_name = request.form['name']
        menu_image = str(request.form['img'])
        menu_price = int(request.form['price'])
        menu_desc = request.form['desc']
        menu_weight = float(request.form['weight'])
        menu_kcal = float(request.form['kcal'])
        menu_protein_g = float(request.form['protein_g'])
        menu_protein_pct = float(request.form['protein_pct'])
        menu_sodium_g = float(request.form['sodium_g'])
        menu_sodium_pct = float(request.form['sodium_pct'])
        menu_sugar = float(request.form['sugar'])
        menu_satfat_g = float(request.form['satfat_g'])
        menu_satfat_pct = float(request.form['satfat_pct'])
        menu_caff = float(request.form['caff'])
        menu_allergy = request.form['allergy']
        menu_category = request.form['category']
        
        error = None
    
        if db.execute(
            'SELECT ID FROM "MENU" WHERE NAME = ?', (menu_name,)
        ).fetchone() is not None:
            error = 'Menu {} is already registered.'.format(menu_name)

        if error is None:
            c.execute(
                'INSERT INTO MENU (NAME, IMAGE_PATH, PRICE, DESC, IS_SOLDOUT, WEIGHT_G, KCAL, PROTEIN_G, PROTEIN_PCENT, SODIUM_MG, SODIUM_PCENT, SUGAR_G, SAT_FAT_G, SAT_FAT_PCENT, CAFFEINE_MG, ALLERGY_INFO) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',(menu_name, menu_image, menu_price, menu_desc, 0, menu_weight, menu_kcal, menu_protein_g, menu_protein_pct, menu_sodium_g, menu_sodium_pct, menu_sugar, menu_satfat_g, menu_satfat_pct, menu_caff, menu_allergy)
                )
            menu_id = c.lastrowid
            c.execute(
                'INSERT INTO "MENU_CATEGORY" VALUES (?,?)', (menu_id, menu_category)
                )
            db.commit()
            db.close()
            flash(f'{menu_name}을/를 추가하였습니다.')
            return redirect(url_for('manage_menu.view_menu'))

        flash(error)
        db.close()
        return redirect(url_for('manage_menu.view_menu'))

def allowed_img_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in current_app.config['ALLOWED_IMG_EXTENSIONS']

@bp.route('/change', methods=['POST'])
def change_menu():
    
    db = get_db()
    c = db.cursor()

    if request.method=='POST':
        menu_id = request.form['id']
        menu_name = request.form['name']
        menu_price = int(request.form['price'])
        menu_desc = request.form['desc']
        menu_weight = float(request.form['weight'])
        menu_kcal = float(request.form['kcal'])
        menu_protein_g = float(request.form['protein_g'])
        menu_protein_pct = float(request.form['protein_pct'])
        menu_sodium_g = float(request.form['sodium_g'])
        menu_sodium_pct = float(request.form['sodium_pct'])
        menu_sugar = float(request.form['sugar'])
        menu_satfat_g = float(request.form['satfat_g'])
        menu_satfat_pct = float(request.form['satfat_pct'])
        menu_caff = float(request.form['caff'])
        menu_allergy = request.form['allergy']
        image_path = ""

        # check if the post request has the file part
        if 'img' not in request.files:
            flash('No file part')
            return redirect(url_for('manage_menu.view_menu'))
        file = request.files['img']
        # if user does not select file, browser also
        # submit an empty part without filename
        if file.filename == '':
            flash('No selected file')
            return redirect(url_for('manage_menu.view_menu'))
        if file and allowed_img_file(file.filename):
            filename = menu_id + '.' + secure_filename(file.filename).rsplit('.', 1)[1].lower()
            abs_path = os.path.join(current_app.config['MENU_IMAGE_FOLDER'], filename)
            image_path = '/' + os.path.relpath(abs_path,start=current_app.root_path)
            image_path = image_path.replace('\\','/')
            print('image_path:', image_path)
            file.save(abs_path)
            print(f"uploaded {os.path.join(current_app.config['MENU_IMAGE_FOLDER'], filename)}")
        db.execute('UPDATE MENU SET NAME=?, IMAGE_PATH=?, PRICE=?, DESC=?, WEIGHT_G=?, KCAL=?, PROTEIN_G=?, PROTEIN_PCENT=?, SODIUM_MG=?, SODIUM_PCENT=?, SUGAR_G=?, SAT_FAT_G=?, SAT_FAT_PCENT=?, CAFFEINE_MG=?, ALLERGY_INFO=? WHERE ID=?',(menu_name, image_path, menu_price, menu_desc, menu_weight, menu_kcal, menu_protein_g, menu_protein_pct, menu_sodium_g, menu_sodium_pct, menu_sugar, menu_satfat_g, menu_satfat_pct, menu_caff, menu_allergy, menu_id)
                   )
        db.commit()
        db.close()

        flash('메뉴 수정이 완료되었습니다.')
        return redirect(url_for('manage_menu.view_menu'))

@bp.route('/delete', methods=['POST'])
def delete_menu():
    db = get_db()
    c = db.cursor()
    if request.method=='POST':
        menu_id = request.form['id']
        menu_name=request.form['name']
        db.execute(
            'DELETE FROM "MENU_CATEGORY" WHERE MENU_ID=?', (menu_id,))
        db.execute(
            'DELETE FROM "MENU" WHERE ID=?', (menu_id,))
        db.commit()
        db.close()

        name = menu_name
        flash(f'{name}을/를 삭제하였습니다.')
        return redirect(url_for('manage_menu.view_menu'))