# 메뉴관리모듈의 Blueprint 생성코드 및 관련 view들이 들어가는 곳입니다.
# https://flask.palletsprojects.com/en/1.1.x/tutorial/views/ 참고
# https://flask.palletsprojects.com/en/1.1.x/tutorial/blog/ 참고
import functools
import json
from flask import (
    Blueprint, flash, g, redirect, render_template, request, session, url_for, jsonify
)
from werkzeug.security import check_password_hash, generate_password_hash

from kiosk.db import get_db

def set_query(n):
    if n == 1:
        return 'SELECT NAME, PRICE FROM MENU WHERE ID IN (SELECT MENU_ID FROM MENU_CATEGORY WHERE CATEGORY_TAG ="햄버거")'
    elif n == 2:
        return 'SELECT NAME, PRICE FROM MENU WHERE ID IN (SELECT MENU_ID FROM MENU_CATEGORY WHERE CATEGORY_TAG ="디저트" OR CATEGORY_TAG="치킨")'
    elif n == 3:
        return 'SELECT NAME, PRICE FROM MENU WHERE ID IN (SELECT MENU_ID FROM MENU_CATEGORY WHERE CATEGORY_TAG ="음료"  OR CATEGORY_TAG="커피")'


bp = Blueprint('manage_menu', __name__, url_prefix='/manage_menu')

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
# def view_menu():
#     db = get_db()
#     c = db.cursor()
    
#     global category_tag    
#     category_tag=1
#     query = set_query(category_tag)
#     c.execute(query)
#     info = c.fetchall()
#     if request.method == 'GET':
#         if request.args.get('burger'):
#             category_tag =1
#             query = set_query(category_tag)
#             c.execute(query )
#             info = c.fetchall()
#         elif request.args.get('dessert'):
#             category_tag=2
#             query = set_query(category_tag)
#             c.execute(query)
#             info = c.fetchall()
#         elif request.args.get('beverage'):
#             category_tag=3
#             query = set_query(category_tag)
#             c.execute(query)
#             info = c.fetchall()
#     db.close()
#     return render_template('/manage_menu/manage_menu.html', data=info)

@bp.route('/detail', methods=['POST'])
def view_detail():
    db = get_db()
    #TODO: fetch menu's category
    db.row_factory = dict_factory
    c = db.cursor()
    # query=set_query(category_tag)
    # c.execute(query)
    # info = c.fetchall()
    if request.method=='POST':
        menu_id=request.get_json()
        # global original_name
        # original_name = menu_name
        res = c.execute('SELECT ID, NAME, IMAGE_PATH, PRICE, DESC, \
                        WEIGHT_G, KCAL, PROTEIN_G, PROTEIN_PCENT, SODIUM_MG, \
                        SODIUM_PCENT, SUGAR_G, SAT_FAT_G, SAT_FAT_PCENT, CAFFEINE_MG, \
                        ALLERGY_INFO \
                        FROM MENU WHERE ID=?',(menu_id,))
        menu_detail = res.fetchone()
        db.close()
        print(menu_detail)
        return json.dumps(menu_detail)

def dict_factory(cursor, row):
    d = {}
    for idx, col in enumerate(cursor.description):
        d[col[0]] = row[idx]
    return d

@bp.route('/add', methods=['POST'])
def add_menu():
    db = get_db()
    c = db.cursor()
    # query=set_query(category_tag)
    # c.execute(query)
    # info = c.fetchall()
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
            # c.execute('SELECT ID FROM MENU WHERE ID=?', (menu_id,))
            # tmp = c.fetchone()
            menu_id = c.lastrowid
            c.execute(
                'INSERT INTO "MENU_CATEGORY" VALUES (?,?)', (menu_id, menu_category)
                )
            db.commit()
            db.close()
            # global name
            # name = menu_name
            # return jsonify(done=True, name=menu_name)
            flash(f'{menu_name}을/를 추가하였습니다.')
            return redirect(url_for('manage_menu.view_menu'))

        flash(error)
        db.close()
        # return jsonify(done=False, name=menu_name, error=error)
        return redirect(url_for('manage_menu.view_menu'))



@bp.route('/change', methods=['POST'])
def change_menu():
    db = get_db()
    c = db.cursor()
    # query=set_query(category_tag)
    # c.execute(query)
    # info = c.fetchall()
    if request.method=='POST':
        menu_id = request.form['id']
        menu_name = request.form['name']
        #menu_image = str(request.form['img'])
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
        
        # c.execute('SELECT ID FROM MENU WHERE NAME=?', (original_name,))
        # tmp = c.fetchone()
        # menu_id=tmp[0]
        db.execute('UPDATE MENU SET NAME=?, PRICE=?, DESC=?, WEIGHT_G=?, KCAL=?, PROTEIN_G=?, PROTEIN_PCENT=?, SODIUM_MG=?, SODIUM_PCENT=?, SUGAR_G=?, SAT_FAT_G=?, SAT_FAT_PCENT=?, CAFFEINE_MG=?, ALLERGY_INFO=? WHERE ID=?',(menu_name, menu_price, menu_desc, menu_weight, menu_kcal, menu_protein_g, menu_protein_pct, menu_sodium_g, menu_sodium_pct, menu_sugar, menu_satfat_g, menu_satfat_pct, menu_caff, menu_allergy, menu_id)
                   )
        db.commit()
        db.close()

        # global names
        # names=[]                                        #변경 전 후 메뉴명 리스트
        # names.append(original_name)
        # names.append(menu_name)
        # return jsonify(done=True)
        flash('메뉴 수정이 완료되었습니다.')
        return redirect(url_for('manage_menu.view_menu'))

@bp.route('/delete', methods=['POST'])
def delete_menu():
    db = get_db()
    c = db.cursor()
    # query=set_query(category_tag)
    # c.execute(query)
    # info = c.fetchall()
    if request.method=='POST':
        menu_id = request.form['id']
        menu_name=request.form['name']
        # c.execute('SELECT ID FROM MENU WHERE ID=?', (menu_name,))
        # tmp = c.fetchone()
        # menu_id=tmp[0]
        db.execute(
            'DELETE FROM "MENU_CATEGORY" WHERE MENU_ID=?', (menu_id,))
        db.execute(
            'DELETE FROM "MENU" WHERE ID=?', (menu_id,))
        db.commit()
        db.close()

        # global name
        name = menu_name
        # return jsonify(done=True, name=name)
        flash(f'{name}을/를 삭제하였습니다.')
        return redirect(url_for('manage_menu.view_menu'))