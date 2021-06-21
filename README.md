# lot_kiosk
웹앱으로 패스트푸드점의 무인 키오스크를 구현하는 프로젝트로,
[웹앱 키오스크 만들기 프로젝트](https://github.com/joons5834/lot_kiosk)의 fork입니다.

[여기](https://flask.palletsprojects.com/en/1.1.x/tutorial/layout/)에 나오는 리포지토리 구조를 모방하여 생성하였습니다.

## 프로젝트 구성과 기능
 * 고객주문모듈
   * 고객이 매장에서 주문할 때 사용하는 페이지입니다.
   * 장바구니에 주문들을 담은 뒤 결제하면 주문관리모듈에 주문 사항이 전달됩니다.
 * 주문관리모듈
   * 주방 등에서 주문내역을 확인할 때 사용하는 페이지입니다.
   * 주문 확인, 재고 관리, 조리완료 처리 기능 등이 있습니다.
 * 메뉴관리모듈
   * 메뉴의 추가, 삭제, 수정이 가능한 페이지입니다.
 * 판매관리모듈
   * 매출현황, 결제 이력 확인이 가능한 페이지입니다.

## 사용 기술
* `Flask`
* Vanilla JS
* `Socket.IO`
  * 주문 완료시 주방에 주문 내역 실시간 알림
  * 조리 완료시 홀에 실시간 알림

[//]: # (todo: write getting started for users)

## 키오스크 서버 설치하기 
### 요구 사항
1. 키오스크 서버 전용 파이썬 가상환경
   * `venv` 등을 이용해 구성
1. `sqlite3` 버전 `3.33.0` 이상
1. `pip` `9.0.0` 이상

### 서버 설치 요령
1. 요구 사항에 맞게 환경 구성
1. .whl 파일 [다운로드](https://www.mediafire.com/file/lmornoboce6rzzx/kiosk-1.0.0-py3-none-any.whl/file)
1. 전용 가상환경을 구동
1. `pip install 다운로드받은.whl파일경로`

[//]: # (todo: write getting started for users)

## 프로젝트 시작하기
1. `Flask`를 [설치](https://flask.palletsprojects.com/en/1.1.x/installation/#installation)하신 후 
1. 프로젝트의 루트 디렉토리에서
   * 윈도우 PowerShell의 경우  
    ```
    > $env:FLASK_APP = 'kiosk'
    > $env:FLASK_ENV = 'development'
    > flask run
    ```
   * 리눅스 및 맥 터미널의 경우  
   ```
   $ export FLASK_APP=kiosk
   $ export FLASK_ENV=development
   $ flask run
   ```
   * 윈도우 CMD의 경우  
    ```
    > set FLASK_APP=kiosk
    > set FLASK_ENV=development
    > flask run
    ```
    를 하시면
   ```
   * Serving Flask app "kiosk"
   * Environment: development
   * Debug mode: on
   * Running on http://127.0.0.1:5000/ (Press CTRL+C to quit)
   * Restarting with stat
   * Debugger is active!
   * Debugger PIN: 855-212-761
   ```
    과 같은 화면이 나옵니다.
1. http://127.0.0.1:5000/hello 에서 "Hello,World!" 메세지가 나오면 Flask설치와 리포지토리 세팅이 완료된 것입니다.
## 프론트엔드 팀원분들에게
프론트엔드를 담당하시는 경우 html 파일은 kiosk/templates 디렉토리에 넣어 주시고 css파일/javascript가 포함된 파일/
DB에 들어가지 않는 이미지 파일(로고 이미지 등) 등 정적 리소스 파일은 kiosk/static 디렉토리에 넣어주시기 바랍니다. 
## 데모 데이터베이스
개발할 때 쓰일 데모용 데이터베이스를 생성하는 기능을 추가하였습니다.
### 데이터베이스 변경사항(커밋 날짜 기준)
#### v0.08(21/03/29)
* 삭제한 메뉴 중 일부 다시 추가
  * 주문시 재료 소진 반영 테스트 용도
  * `스위트어스어썸버거`, `스위트어스어썸버거세트`, `불고기버거`, `포테이토`, `포테이토L` 및 토핑류 추가
#### v0.07(20/12/13)
* 원활한 데모 영상 제작을 위해 사진 데이터 없는 메뉴 삭제
#### v0.06(20/12/7)
* 주문 데모 데이터 추가
  * `ORDERS`, `ORDER_ITEM`, `OPT_CHOICE` 테이블에 데이터 추가
#### v0.05(20/12/6)
* `ORDER` 테이블의 명칭을 `ORDERS`로 변경
* `OPT_CHOICE` 테이블에서 `ITEM_NO`와 `ORDER_ID` 컬럼의 외래키 제약 수정
  * `ORDER_ITEM` 테이블의 복합키 `(ITEM_NO, ORDER_ID)`를 참조하는 복합 외래키 `(ITEM_NO, ORDER_ID)`로 수정
#### v0.04(20/12/5)
* MENU_CATEGORY 테이블의 CATEGORY_TAG 컬럼의 자료형을 INT에서 TEXT로 수정
* INGREDIENT 테이블에 IMAGE_PATH 컬럼 추가
* 리포지토리에 이미지가 있는 메뉴에 한해 IMAGE_PATH 수정
* INGREDIENT의 일부 원재료명 수정
  * 감자채 -> 감자, 콘옥수수 -> 옥수수
* INGREDIENT의 일부 원재료에 더미 IMAGE_PATH 추가
  * 양상추, 양파, 패티류, 토핑류, 감자, 옥수수
#### v0.03(20/11/28)
* 버거 및 버거세트류의 옵션명 및 선택 수량 추가
* INGREDIENT 테이블 생성 및 기본 재료 추가(더미 데이터)
* INGRD_USE 테이블 생성 및 일부 메뉴의 재료 사용 정보 추가(더미 데이터)
  * 스위트어스어썸버거, 스위트어스어썸버거세트, 불고기버거, 새우버거 등
#### v0.02(20/11/26)
* MENU 테이블의 제품 설명, 영양 정보, 알레르기 정보를 업데이트 하였습니다. 일부 기간 한정 메뉴 및 소스류, 일부 디저트류외 모든 메뉴의 상세정보가 업데이트 되었습니다.
#### v0.01(20/11/25 19:00)
* MENU_OPT 테이블에서 MAX_QTY가 정해져 있지 않은 경우 '?' 대신 `NULL` 값으로 표기하도록 했습니다.
#### v0(20/11/25)
* 고객주문모듈 개발을 위한 최소한의 데이터셋만 탑재되어 있습니다. 
  * MENU, MENU_CATEGORY, MENU_OPT, OPT_PRICE 테이블에만 데이터가 있습니다.
  * 대부분의 메뉴는 아직 정보가 불완전합니다.
* 스위트어스어썸버거와 스위트어스어썸버거세트는 정보가 완전하여 메뉴 상세정보와 세트 메뉴 선택, 상세 영양정보, 알레르기 정보 확인이 가능합니다.
* 치킨-풀팩, 치킨-하프팩은 알레르기 정보를 제외한 모든 정보 확인이 가능합니다.
* 메뉴 정보가 실제 매장 데이터와는 차이가 있을 수 있습니다.

### 사용법
1. 웹서버가 작동중이어서 콘솔 명령어가 입력 안 될 경우 `CTRL-C`를 눌러 웹서버를 중단합니다. 
   * 웹서버가 작동중이지 않더라도 사용가능합니다.
   * 웹서버 작동을 유지해야 한다면 새 콘솔 창을 띄워 `프로젝트 시작하기`의 환경변수 세팅을 다시 합니다.
1. 리포지토리 루트 디렉터리에서 콘솔창에 `flask init-demo-db`를 입력하시면 됩니다. 
1. 정상적으로 초기화가 되면
콘솔 창에 'Initialized the demo database.' 문구가 뜨고 instance 디렉터리에 .sqlite 데이터베이스 파일이 생성됩니다. 
1. 개발/테스트 하실 때 SQLite용 GUI 클라이언트를 이용하면 엑셀을 이용하듯 데이터를 열람할 수 있습니다.
(참고) `flask init-db` 명령을 입력할 경우 DB 스키마만 있는 빈 데이터베이스로 초기화됩니다.
## Contribution guidelines
현재 contribution guidelines가 구체적으로 정해져 있지는 않습니다. 다만, 기본적인 사항 몇 가지는 지켜주시면 될 것 같습니다.
* 커밋 메세지는 간결하면서도 알아듣기 쉽게 작성해주세요.
* branch 이름은 누가, 어떤 일을 하고 있는지 알 수 있도록 지어 주세요.
* merge전에 테스트 해주시고 이미 합의된 style을 지키고 있는지 확인해 주세요.
  * python의 경우 PEP8을 준수하고 변수/함수명은 snake_case, 클래스명은 CamelCase을 따릅니다.
