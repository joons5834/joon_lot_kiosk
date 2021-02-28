# 판매관리모듈(매출관리모듈)의 Blueprint 생성코드 및 관련 view들이 들어가는 곳입니다.
# https://flask.palletsprojects.com/en/1.1.x/tutorial/views/ 참고
# https://flask.palletsprojects.com/en/1.1.x/tutorial/blog/ 참고
import functools

from flask import (
    Blueprint, flash, g, redirect, render_template, request, session, url_for
)
from werkzeug.security import check_password_hash, generate_password_hash

from kiosk.db import get_db
from kiosk.auth import login_required

bp=Blueprint('manage_sale', __name__, url_prefix='/manage_sale')

# Protect entire Blueprint with a login
@bp.before_request
@login_required
def login_required_for_all_request():    
    pass  

@bp.route('/')
def sale_btn():
    return render_template('/manage_sale/sale_btn.html')

@bp.route('/pay_record')
def pay_record():
    db = get_db()
    c = db.cursor()
    db.execute("CREATE TEMP VIEW [ORDER_SUM_TEMP] AS SELECT A.ORDER_ID,A.ITEM_NO,MAIN_ORDER,OPTION_ORDER FROM (select ORDER_ID,ITEM_NO,group_concat(M.NAME || QTY, '|') AS MAIN_ORDER from ORDER_ITEM O INNER JOIN MENU M ON O.MAIN_DISH_ID = M.ID group by ORDER_ID, ITEM_NO) A LEFT JOIN (select ORDER_ID,ITEM_NO,group_concat(M.NAME || OPT_QTY) AS OPTION_ORDER from OPT_CHOICE O INNER JOIN MENU M ON O.OPTION_ID = M.ID group by ORDER_ID,ITEM_NO) B ON (A.ORDER_ID, A.ITEM_NO) = (B.ORDER_ID, B.ITEM_NO)")
    query="SELECT ORDER_ID, O.WAIT_NO, date(O.ORDERED_AT) AS DATE, strftime('%H:%M',O.ORDERED_AT) AS TIME, O.RECEIPT_TOTAL, group_concat(MAIN_ORDER || '(' || coalesce(OPTION_ORDER,'-') || ')') AS ORDER_SUM FROM [ORDER_SUM_TEMP] S INNER JOIN ORDERS O ON S.ORDER_ID = O.ID GROUP BY ORDER_ID"
    c.execute(query)
    data=c.fetchall()
    total_query="SELECT SUM(RECEIPT_TOTAL) FROM ORDERS"
    c.execute(total_query)
    total = c.fetchall()
    db.commit()
    db.close()
    return render_template('/manage_sale/pay_record.html', data=data, total=total)

@bp.route('/pay_data', methods=['POST'])
def pay_data():
    if request.method=="POST":
        date=str(request.form['date'])
        db = get_db()
        c = db.cursor() 
        db.execute("CREATE TEMP VIEW [ORDER_SUM_TEMP] AS SELECT A.ORDER_ID,A.ITEM_NO,MAIN_ORDER,OPTION_ORDER FROM (select ORDER_ID,ITEM_NO,group_concat(M.NAME || QTY, '|') AS MAIN_ORDER from ORDER_ITEM O INNER JOIN MENU M ON O.MAIN_DISH_ID = M.ID group by ORDER_ID, ITEM_NO) A LEFT JOIN (select ORDER_ID,ITEM_NO,group_concat(M.NAME || OPT_QTY) AS OPTION_ORDER from OPT_CHOICE O INNER JOIN MENU M ON O.OPTION_ID = M.ID group by ORDER_ID,ITEM_NO) B ON (A.ORDER_ID, A.ITEM_NO) = (B.ORDER_ID, B.ITEM_NO)")
        query="SELECT ORDER_ID, O.WAIT_NO, date(O.ORDERED_AT) AS DATE, strftime('%H:%M',O.ORDERED_AT) AS TIME, O.RECEIPT_TOTAL, group_concat(MAIN_ORDER || '(' || coalesce(OPTION_ORDER,'-') || ')') AS ORDER_SUM FROM [ORDER_SUM_TEMP] S INNER JOIN ORDERS O ON S.ORDER_ID = O.ID WHERE O.ORDERED_AT LIKE '%" +date+"%'GROUP BY ORDER_ID"
        c.execute(query)
        data=c.fetchall()
        total_query="SELECT SUM(RECEIPT_TOTAL) FROM ORDERS WHERE ORDERED_AT LIKE '%"+date+"%'"
        c.execute(total_query)
        total=c.fetchall()    
        db.commit()
        db.close()
        return render_template('/manage_sale/pay_record.html', data=data, total=total)

@bp.route('/delete_data', methods=['POST'])
def delete_data():
    if request.method=="POST":
        order_id = request.form['order_id']
        
        db=get_db()
        c=db.cursor()  
        c.execute("DELETE FROM OPT_CHOICE WHERE ORDER_ID=?", (order_id))
        c.execute("DELETE FROM ORDER_ITEM WHERE ORDER_ID=?", (order_id))
        c.execute("DELETE FROM ORDERS WHERE ID=?", (order_id))

        db.commit()
        db.close()
        return redirect(url_for('manage_sale.pay_record'))
    return redirect(url_for('manage_sale.pay_record'))
        

    
@bp.route('/menu_record')
def menu_record():
    db = get_db()
    c = db.cursor()
    db.execute('CREATE TEMP VIEW [SALE_STAT_BY_ID_FILTERED] AS SELECT MENU_ID, SUM(SALE_CNT) AS SALE_TOTAL, SUM(PAY) AS PAY_TOTAL FROM (SELECT MAIN_DISH_ID as MENU_ID, QTY as SALE_CNT, MAIN_DISH_TOTAL as PAY, O.ORDERED_AT as AT FROM ORDER_ITEM I INNER JOIN ORDERS O ON I.ORDER_ID = O.ID UNION ALL SELECT OPTION_ID as MENU_ID, OPT_QTY as SALE_CNT, OPT_TOTAL as PAY, O.ORDERED_AT as AT FROM OPT_CHOICE C INNER JOIN ORDERS O ON C.ORDER_ID = O.ID) GROUP BY MENU_ID')
    c.execute('SELECT M.NAME, S.SALE_TOTAL, S.PAY_TOTAL, GROUP_CONCAT(C.CATEGORY_TAG) FROM (([SALE_STAT_BY_ID_FILTERED] S INNER JOIN MENU M ON S.MENU_ID = M.ID) INNER JOIN MENU_CATEGORY C ON M.ID = C.MENU_ID) GROUP BY NAME')
    data = c.fetchall()
    db.commit()
    db.close()
    return render_template('/manage_sale/menu_record.html', data=data)

@bp.route('/menu_data', methods=['POST','GET'])
def menu_data():
    db = get_db()
    c = db.cursor()    

    if request.method == "GET":
        db.execute('CREATE TEMP VIEW [SALE_STAT_BY_ID_FILTERED] AS SELECT MENU_ID, SUM(SALE_CNT) AS SALE_TOTAL, SUM(PAY) AS PAY_TOTAL FROM (SELECT MAIN_DISH_ID as MENU_ID, QTY as SALE_CNT, MAIN_DISH_TOTAL as PAY, O.ORDERED_AT as AT FROM ORDER_ITEM I INNER JOIN ORDERS O ON I.ORDER_ID = O.ID UNION ALL SELECT OPTION_ID as MENU_ID, OPT_QTY as SALE_CNT, OPT_TOTAL as PAY, O.ORDERED_AT as AT FROM OPT_CHOICE C INNER JOIN ORDERS O ON C.ORDER_ID = O.ID) GROUP BY MENU_ID')
        if request.args.get('burger'):
            c.execute('SELECT M.NAME, S.SALE_TOTAL, S.PAY_TOTAL, GROUP_CONCAT(C.CATEGORY_TAG) FROM (([SALE_STAT_BY_ID_FILTERED] S INNER JOIN MENU M ON S.MENU_ID = M.ID) INNER JOIN MENU_CATEGORY C ON M.ID = C.MENU_ID) WHERE CATEGORY_TAG LIKE "%버거%" GROUP BY NAME')
        elif request.args.get('dessert'):
            c.execute('SELECT M.NAME, S.SALE_TOTAL, S.PAY_TOTAL, GROUP_CONCAT(C.CATEGORY_TAG) FROM (([SALE_STAT_BY_ID_FILTERED] S INNER JOIN MENU M ON S.MENU_ID = M.ID) INNER JOIN MENU_CATEGORY C ON M.ID = C.MENU_ID) WHERE CATEGORY_TAG="디저트" OR CATEGORY_TAG="치킨" GROUP BY NAME')
        elif request.args.get('drink'):
            c.execute('SELECT M.NAME, S.SALE_TOTAL, S.PAY_TOTAL, GROUP_CONCAT(C.CATEGORY_TAG) FROM (([SALE_STAT_BY_ID_FILTERED] S INNER JOIN MENU M ON S.MENU_ID = M.ID) INNER JOIN MENU_CATEGORY C ON M.ID = C.MENU_ID) WHERE CATEGORY_TAG="음료" OR CATEGORY_TAG="커피" GROUP BY NAME')
        data=c.fetchall()
        db.commit()
        db.close()
        return render_template('/manage_sale/menu_record.html', data=data)

    elif request.method=="POST":
        name=request.form['menu_input']
        date=request.form['date']
        query="CREATE TEMP VIEW [SALE_STAT_BY_ID_FILTERED_DATE] AS SELECT MENU_ID, SUM(SALE_CNT) AS SALE_TOTAL, SUM(PAY) AS PAY_TOTAL FROM (SELECT MAIN_DISH_ID as MENU_ID, QTY as SALE_CNT, MAIN_DISH_TOTAL as PAY, O.ORDERED_AT as AT FROM ORDER_ITEM I INNER JOIN ORDERS O ON I.ORDER_ID = O.ID UNION ALL SELECT OPTION_ID as MENU_ID, OPT_QTY as SALE_CNT, OPT_TOTAL as PAY, O.ORDERED_AT as AT FROM OPT_CHOICE C INNER JOIN ORDERS O ON C.ORDER_ID = O.ID) WHERE AT LIKE '%"+date+"%' GROUP BY MENU_ID"
        db.execute(query)
        c.execute('SELECT M.NAME, S.SALE_TOTAL, S.PAY_TOTAL, C.CATEGORY_TAG FROM (([SALE_STAT_BY_ID_FILTERED_DATE] S INNER JOIN MENU M ON S.MENU_ID = M.ID) INNER JOIN MENU_CATEGORY C ON M.ID = C.MENU_ID) WHERE M.NAME=?', (name,))

        data=c.fetchall()
        db.commit()
        db.close()
        return render_template('/manage_sale/menu_record.html', data=data)
        
            
