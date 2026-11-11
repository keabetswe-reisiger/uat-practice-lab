/* Lessons 31-48: window functions, changing data, design, speed and the real world.
   A try-it solution may be a string, or {sql, check} for statements that change data (the check query is compared afterwards). */
window.LESSONS=window.LESSONS||[];
(function(){const L=(...a)=>{const [id,lv,part,t,plain,cof,db,ex,exNote,task,sol,quiz]=a;window.LESSONS.push({id,lv,part,t,plain,cof,db,ex,exNote,task,sol,quiz})};
const P5='5. Window functions',P6='6. Changing data and keeping it safe',P7='7. Design, speed and the real world';

L('L31','Advanced',P5,'Window functions: the idea of OVER()',
'A window function calculates across related rows but keeps every row, unlike GROUP BY which squashes them. OVER() defines the "window" of rows. Empty OVER() means all rows.',
'Beside every drink on the price list you write the shop-wide average, so each line shows how far it is above or below. No line disappears.',
'coffee','SELECT name, price, round(AVG(price) OVER (), 1) AS shop_avg, round(price - AVG(price) OVER (), 1) AS diff FROM products ORDER BY diff DESC;','12 rows in, 12 rows out.',
'Show each product <b>name</b> and <b>price</b> plus the <b>highest price in the shop</b> as <b>top_price</b>, using a window.','SELECT name, price, MAX(price) OVER () AS top_price FROM products',
[['A window function differs from GROUP BY because it...','Keeps every row','Removes rows','Deletes data','It adds a calculation beside each row.'],['What does an empty <code>OVER ()</code> mean?','The window is all rows','No rows','One row','No partition or order is given.'],['Which keyword introduces a window?','OVER','WINDOW ONLY','GROUPED','OVER defines the window.']]);

L('L32','Advanced',P5,'PARTITION BY and running totals',
'PARTITION BY restarts the calculation for each group. ORDER BY inside OVER makes it cumulative (a running total) from the first row to the current one.',
'Each customer has their own loyalty card with a running count of cups. A new customer starts again at zero.',
'coffee','SELECT customer_id, order_date, qty, SUM(qty) OVER (PARTITION BY customer_id ORDER BY order_date, id) AS running_cups FROM orders WHERE customer_id IN (3, 8) ORDER BY customer_id, order_date, id LIMIT 10;','Add the id to ORDER BY so ties on the same day have a fixed order.',
'Show <b>id</b> and a running total of <b>qty</b> over all orders ordered by id, as <b>running</b>, for orders <b>id 1 to 5</b>.','SELECT id, SUM(qty) OVER (ORDER BY id) AS running FROM orders WHERE id <= 5',
[['PARTITION BY does what?','Restarts the window for each group','Sorts the table','Deletes duplicates','It splits rows into independent windows.'],['A running total uses...','SUM(...) OVER (ORDER BY ...)','COUNT(*) only','GROUP BY only','ORDER BY inside OVER builds the cumulative sum.'],['Why add a tie-breaker such as id to the ORDER BY?','Rows with the same date need a fixed order','It is required syntax','It speeds the query','Without it, the running order of ties is undefined.']]);

L('L33','Advanced',P5,'ROW_NUMBER, RANK and DENSE_RANK',
'ROW_NUMBER gives 1, 2, 3 with no ties. RANK gives tied rows the same number and then skips (1, 1, 3). DENSE_RANK does not skip (1, 1, 2). Add PARTITION BY to rank inside each group.',
'A prize list: if two people tie for first, RANK gives both first then third; DENSE_RANK gives both first then second.',
'hr','SELECT name, salary, RANK() OVER (ORDER BY salary DESC) AS rnk, DENSE_RANK() OVER (ORDER BY salary DESC) AS dense, ROW_NUMBER() OVER (ORDER BY salary DESC, id) AS rn FROM employees LIMIT 8;','Two reps earn 34500, so they tie.',
'Show <b>name</b> and <b>RANK</b> of salary (highest = 1) as <b>rnk</b> for the <b>Sales Rep</b> employees.',"SELECT name, RANK() OVER (ORDER BY salary DESC) AS rnk FROM employees WHERE title = 'Sales Rep'",
[['Two tied rows get ranks 1, 1 then 3. That is...','RANK','DENSE_RANK','ROW_NUMBER','RANK skips after a tie.'],['Which never repeats a number?','ROW_NUMBER','RANK','DENSE_RANK','ROW_NUMBER gives each row its own number.'],['Ranking inside each department needs...','PARTITION BY dept_id','GROUP BY dept_id','HAVING dept_id','PARTITION BY restarts the ranking per group.']]);

L('L34','Advanced',P5,'LAG and LEAD: compare with the row before or after',
'LAG(x) reads the value from the previous row in the window and LEAD(x) from the next one. They are how you work out change since last time.',
'Today\'s takings next to yesterday\'s: the difference tells you whether the day was better.',
'farm','SELECT day, rain_mm, LAG(rain_mm) OVER (ORDER BY day) AS yesterday, rain_mm - LAG(rain_mm) OVER (ORDER BY day) AS change FROM weather ORDER BY day LIMIT 7;','The first row has no previous day, so LAG gives NULL.',
'Show <b>day</b> and <b>max_temp</b> of the <b>previous day</b> as <b>prev_temp</b> for the first 5 days.','SELECT day, LAG(max_temp) OVER (ORDER BY day) AS prev_temp FROM weather ORDER BY day LIMIT 5',
[['LAG reads...','The previous row','The next row','The first row','LAG looks back.'],['What does LAG return for the first row?','NULL','0','An error','There is no earlier row.'],['LEAD is the opposite of...','LAG','RANK','SUM','LEAD looks forward.']]);

L('L35','Advanced',P5,'Moving averages and frames',
'A frame limits the window around the current row: ROWS BETWEEN 6 PRECEDING AND CURRENT ROW gives a 7-row moving window. Moving averages smooth out noisy daily numbers.',
'The weather office does not quote one rainy day. It quotes the 7-day average so one storm does not mislead.',
'farm','SELECT day, rain_mm, round(AVG(rain_mm) OVER (ORDER BY day ROWS BETWEEN 6 PRECEDING AND CURRENT ROW), 2) AS avg7 FROM weather ORDER BY day LIMIT 10;','At the start the frame has fewer than 7 rows, so the average uses what exists.',
'Show <b>day</b> and the <b>3-day moving average</b> of <b>max_temp</b> (this day and the 2 before), rounded to 1 decimal as <b>avg3</b>, for the first 6 days.','SELECT day, round(AVG(max_temp) OVER (ORDER BY day ROWS BETWEEN 2 PRECEDING AND CURRENT ROW), 1) AS avg3 FROM weather ORDER BY day LIMIT 6',
[['<code>ROWS BETWEEN 6 PRECEDING AND CURRENT ROW</code> covers...','7 rows','6 rows','1 row','Six before plus the current row.'],['A moving average is used to...','Smooth out day-to-day noise','Delete rows','Sort rows','It shows the trend.'],['Frames need...','ORDER BY inside OVER','GROUP BY','A join','Frames depend on row order.']]);

L('L36','Advanced',P5,'Top-N per group, NTILE and removing duplicates',
'Put ROW_NUMBER() in a CTE, then keep rn = 1 (or rn <= 3) to get the top rows per group. The same trick removes duplicates. NTILE(4) splits rows into four equal buckets (quartiles).',
'"Who is the best-paid person in each department?" Rank within each department, then keep only number 1.',
'hr','WITH r AS (SELECT name, dept_id, salary, ROW_NUMBER() OVER (PARTITION BY dept_id ORDER BY salary DESC, id) AS rn FROM employees WHERE dept_id IS NOT NULL) SELECT dept_id, name, salary FROM r WHERE rn = 1 ORDER BY dept_id;','Filter on rn in the outer query because you cannot use a window function in WHERE.',
'Show the <b>name</b> of the <b>lowest-paid</b> employee in each department (<b>dept_id</b> not NULL), with dept_id first.','WITH r AS (SELECT dept_id, name, ROW_NUMBER() OVER (PARTITION BY dept_id ORDER BY salary, id) AS rn FROM employees WHERE dept_id IS NOT NULL) SELECT dept_id, name FROM r WHERE rn = 1',
[['Why use a CTE for top-N per group?','You cannot filter on a window function in WHERE','CTEs are required for ORDER BY','It is faster','Compute rn first, then filter.'],['NTILE(4) does what?','Splits rows into 4 equal groups','Returns 4 rows','Adds 4','It creates quartile buckets.'],['ROW_NUMBER can remove duplicates by...','Keeping only rn = 1 per duplicate group','Deleting the table','Using DISTINCT twice','Number the copies and keep the first.']]);

L('L37','Beginner',P6,'INSERT: adding rows',
'INSERT INTO table (columns) VALUES (...) adds a row. Always name the columns. You can add many rows at once. Constraints (lesson 39) can refuse a bad row.',
'Writing a new customer card and filing it. You name which fields you are filling in.',
'coffee',"INSERT INTO customers(id, name, city) VALUES (100, 'Test Person', 'Durban');\nSELECT id, name, city FROM customers WHERE id = 100;",'Each Run uses a fresh copy of the database, so you cannot break anything here.',
"Add a customer with <b>id 101</b>, name <b>Lebo</b> and city <b>Pretoria</b> (joined can stay empty).",{sql:"INSERT INTO customers(id, name, city) VALUES (101, 'Lebo', 'Pretoria')",check:'SELECT id, name, city, joined FROM customers WHERE id = 101'},
[['Why name the columns in INSERT?','So values go to the right columns even if the table changes','SQL requires it for SELECT','It makes it slower','Named columns are safer and clearer.'],['Can one INSERT add several rows?','Yes, with several value lists','No, never','Only with UPDATE','VALUES (...), (...) adds many rows.'],['What can stop an INSERT?','A constraint such as NOT NULL','The ORDER BY','A comment','Constraints refuse invalid data.']]);

L('L38','Beginner',P6,'UPDATE and DELETE (carefully)',
'UPDATE changes existing rows and DELETE removes them. Without WHERE they affect every row, so write the WHERE first and test it with a SELECT.',
'Changing the price on the wall: you only change the one line, not every price in the shop.',
'coffee',"UPDATE products SET price = price + 2 WHERE category = 'Tea';\nSELECT name, price FROM products WHERE category = 'Tea';",'Always run the same WHERE as a SELECT first to see which rows will change.',
'Raise the <b>price of Espresso by 3</b> (id 1).',{sql:'UPDATE products SET price = price + 3 WHERE id = 1',check:'SELECT id, name, price FROM products ORDER BY id'},
[['What happens if UPDATE has no WHERE?','Every row changes','Nothing','An error always','Without WHERE, all rows are affected.'],['A safe habit before DELETE is to...','Run the same WHERE as a SELECT first','Run it twice','Add LIMIT 0','Preview the affected rows.'],['Which removes rows?','DELETE FROM','DROP ROWS','REMOVE FROM','DELETE removes rows. DROP removes a whole table.']]);

L('L39','Intermediate',P6,'CREATE TABLE and constraints',
'CREATE TABLE defines columns and rules. PRIMARY KEY identifies rows, NOT NULL forbids blanks, UNIQUE forbids repeats, CHECK enforces a rule, and FOREIGN KEY ... REFERENCES links to another table. Rules in the database protect data from every app that uses it.',
'A form that refuses to be filed if the name is blank or the price is negative, however the clerk fills it in.',
'coffee',"CREATE TABLE pets(id INTEGER PRIMARY KEY, name TEXT NOT NULL, age INTEGER CHECK (age >= 0));\nSELECT name, type, \"notnull\" AS not_null, pk FROM pragma_table_info('pets');",'pragma_table_info lists the columns of a table.',
'Create a table <b>staff</b> with <b>id INTEGER PRIMARY KEY</b>, <b>name TEXT NOT NULL</b> and <b>wage INTEGER</b>.',{sql:'CREATE TABLE staff(id INTEGER PRIMARY KEY, name TEXT NOT NULL, wage INTEGER)',check:"SELECT name, type, \"notnull\" AS not_null, pk FROM pragma_table_info('staff')"},
[['Which stops a blank name?','NOT NULL','UNIQUE','PRIMARY KEY only','NOT NULL forbids missing values.'],['CHECK (age &gt;= 0) enforces...','A rule on the values','A sort order','A join','CHECK tests every new value.'],['A foreign key guarantees...','The linked row exists in the other table','Values are unique','Values are sorted','It keeps links valid.']]);

L('L40','Advanced',P6,'Transactions: all or nothing',
'A transaction groups statements so they all succeed (COMMIT) or all are undone (ROLLBACK). Databases promise ACID: Atomic (all or nothing), Consistent (rules kept), Isolated (others do not see half-done work), Durable (saved once committed).',
'Moving R100 from one till to another. Taking it out and failing to put it in would lose money, so both steps must happen together or not at all.',
'coffee',"BEGIN;\nUPDATE products SET price = 0 WHERE category = 'Coffee';\nROLLBACK;\nSELECT name, price FROM products WHERE category = 'Coffee';",'ROLLBACK undid the update, so prices are unchanged.',
'Start a transaction, <b>raise the Espresso price by 5</b>, then <b>COMMIT</b>.',{sql:'BEGIN; UPDATE products SET price = price + 5 WHERE id = 1; COMMIT;',check:'SELECT id, price FROM products ORDER BY id'},
[['ROLLBACK does what?','Undoes the uncommitted changes','Saves the changes','Deletes the table','It reverses the transaction.'],['The A in ACID stands for...','Atomic (all or nothing)','Automatic','Alphabetical','Atomicity means all steps or none.'],['When are changes safe from a crash?','After COMMIT','After BEGIN','After SELECT','Durability applies once committed.']]);

L('L41','Intermediate',P6,'Views: saved queries',
'A view is a saved SELECT that behaves like a table. It stores the question, not the answer, so it always shows current data. Views hide complexity and can limit what people see.',
'A laminated "top sellers" sheet that is re-printed from the order book every time you look at it.',
'coffee',"CREATE VIEW paid_orders AS SELECT * FROM orders WHERE status = 'paid';\nSELECT COUNT(*) AS paid FROM paid_orders;",'A view is created once and then queried like a table.',
"Create a view <b>cheap_products</b> of products with <b>price &lt; 30</b>.",{sql:'CREATE VIEW cheap_products AS SELECT * FROM products WHERE price < 30',check:'SELECT id, name, price FROM cheap_products ORDER BY id'},
[['A view stores...','A saved query','A copy of the data','An index','The definition is stored, data is read live.'],['Why use a view?','To simplify and control access','To make the table bigger','To add rows','Views wrap complex queries.'],['Is the data in a view always current?','Yes, it is read from the tables each time','No, it is a frozen copy','Only at midnight','The query runs when you use the view.']]);

L('L42','Advanced',P7,'Normalisation: 1NF, 2NF, 3NF',
'Normalising means splitting data so each fact lives in one place. 1NF: one value per cell. 2NF: every column depends on the whole key. 3NF: columns depend only on the key, not on other columns. It prevents update, insert and delete anomalies. Reporting databases sometimes denormalise on purpose.',
'A single giant sheet repeats "Thandi, Johannesburg" on every order. If Thandi moves, you must fix every line, and you will miss one.',
'coffee',"WITH flat(order_id, customer, city, product, price) AS (VALUES (1,'Thandi','Johannesburg','Latte',40),(2,'Thandi','Johannesburg','Mocha',45),(3,'Sipho','Durban','Latte',40))\nSELECT customer, city FROM flat GROUP BY customer, city;",'The flat sheet repeats customer and city. A customers table would hold them once.',
'From the flat sheet, show the number of <b>distinct customers</b> as <b>n</b>. Start with the same WITH and VALUES lines.',"WITH flat(order_id, customer, city, product, price) AS (VALUES (1,'Thandi','Johannesburg','Latte',40),(2,'Thandi','Johannesburg','Mocha',45),(3,'Sipho','Durban','Latte',40)) SELECT COUNT(DISTINCT customer) AS n FROM flat",
[['What is an update anomaly?','Changing a repeated fact in one place but not another','A faster update','A broken index','Duplicated data gets inconsistent.'],['3NF says columns should depend on...','The key and nothing but the key','Each other','The sort order','No column depends on a non-key column.'],['Why might a report database denormalise?','To make reads faster and simpler','Because normal forms are illegal','To save rows','It trades duplication for speed.']]);

L('L43','Advanced',P7,'Indexes and EXPLAIN QUERY PLAN',
'An index is a sorted lookup structure on a column, like the index at the back of a book. It speeds up searches and joins on that column but slows writes slightly and uses space. EXPLAIN QUERY PLAN shows whether a query SCANs the whole table or SEARCHes using an index.',
'Finding one customer\'s orders in an unsorted pile means reading every slip. A tab-indexed folder per customer lets you jump straight there.',
'coffee','EXPLAIN QUERY PLAN SELECT * FROM orders WHERE customer_id = 3;','Look for SCAN (slow on big tables). After CREATE INDEX it says SEARCH ... USING INDEX.',
'Create an index named <b>idx_orders_customer</b> on <b>orders(customer_id)</b>.',{sql:'CREATE INDEX idx_orders_customer ON orders(customer_id)',check:"SELECT name, tbl_name FROM sqlite_master WHERE type = 'index' AND name = 'idx_orders_customer'"},
[['What does an index speed up?','Searches and joins on the indexed column','Every INSERT','Table creation','It makes lookups faster.'],['The cost of an index is...','Extra space and slower writes','Wrong results','Lost data','Indexes must be kept up to date.'],['SCAN in a query plan means...','The whole table is read','An index is used','The query failed','SEARCH means an index is used.']]);

L('L44','Advanced',P7,'Writing fast queries: sargable conditions',
'A condition is "sargable" when the database can use an index. Wrapping the column in a function (WHERE substr(order_date,1,7) = ...) hides it from the index. Compare the plain column to a range instead. Also select only the columns you need and filter early.',
'Asking the librarian for books published "between 1950 and 1960" is quick. Asking for "books where the year, with its last digit removed, equals 195" forces them to check every book.',
'coffee',"EXPLAIN QUERY PLAN SELECT COUNT(*) FROM orders WHERE order_date >= '2026-03-01' AND order_date < '2026-04-01';",'Use a range on the plain column instead of a function of the column.',
"Count the orders in March 2026 as <b>n</b> using a <b>range</b> on <b>order_date</b> (from 2026-03-01 up to but not including 2026-04-01).","SELECT COUNT(*) AS n FROM orders WHERE order_date >= '2026-03-01' AND order_date < '2026-04-01'",
[['Which condition can use an index on order_date?','<code>order_date &gt;= \'2026-03-01\'</code>','<code>substr(order_date,1,7) = \'2026-03\'</code>','<code>lower(order_date) = ...</code>','Functions on the column block index use.'],['Why avoid <code>SELECT *</code> in big queries?','It reads and sends columns you do not need','It is invalid SQL','It sorts the data','Less data means faster queries.'],['Filtering early (WHERE before joins) helps because...','Fewer rows are carried through later steps','It changes the answer','It adds indexes','Smaller intermediate results are cheaper.']]);

L('L45','Intermediate',P7,'Dialects: SQLite, MySQL, PostgreSQL, SQL Server, Oracle',
'The core of SQL (SELECT, JOIN, GROUP BY) is shared, but details differ. Top rows: LIMIT (SQLite, MySQL, PostgreSQL), TOP (SQL Server), FETCH FIRST (Oracle, PostgreSQL). Text join: || or CONCAT. Date functions and auto-number columns all differ. Learn the standard core, then look up the rest.',
'Coffee is coffee in every country, but the word for flat white on the menu changes. The idea is the same, the spelling varies.',
'coffee','SELECT sqlite_version() AS engine_version;','This site runs SQLite inside your browser. Other databases use different date and text functions.',
'Show the <b>name</b> of the <b>single most expensive</b> product, using LIMIT.','SELECT name FROM products ORDER BY price DESC LIMIT 1',
[['How do you get the top 5 rows in SQL Server?','<code>SELECT TOP 5 ...</code>','<code>LIMIT 5</code>','<code>FETCH 5 LIMIT</code>','SQL Server uses TOP.'],['Which is true?','The core SQL is shared but details differ per database','All databases are identical','Each uses a different language entirely','Learn the standard core first.'],['Which is the standard text join?','<code>||</code> (CONCAT in some databases)','<code>&amp;&amp;</code>','<code>PLUS</code>','|| is standard, CONCAT is common in MySQL.']]);

L('L46','Intermediate',P7,'Cleaning messy data',
'Real data has stray spaces, mixed case and duplicates. Use trim() and lower() to standardise, then DISTINCT or GROUP BY to find repeats. Find duplicates with GROUP BY ... HAVING COUNT(*) &gt; 1.',
'"Thandi", "thandi " and "THANDI" are one customer. Standardise first, then count.',
'coffee',"WITH raw(name) AS (VALUES ('Thandi'),(' thandi '),('THANDI'),('Sipho'))\nSELECT lower(trim(name)) AS clean, COUNT(*) AS copies FROM raw GROUP BY clean HAVING COUNT(*) > 1;",'Clean first, then compare.',
"From the values (' Anele','anele ','ANELE','Zodwa'), show the number of <b>distinct cleaned names</b> as <b>n</b>. Use lower(trim(name)).","WITH raw(name) AS (VALUES (' Anele'),('anele '),('ANELE'),('Zodwa')) SELECT COUNT(DISTINCT lower(trim(name))) AS n FROM raw",
[['Why clean before counting duplicates?','Different spellings of one value would count separately','Cleaning is slow','SQL forbids it','Standardising reveals true duplicates.'],['How do you list values that appear more than once?','<code>GROUP BY x HAVING COUNT(*) &gt; 1</code>','<code>WHERE COUNT(*) &gt; 1</code>','<code>DISTINCT x</code>','HAVING filters grouped counts.'],['Which standardises case?','<code>lower()</code> or <code>upper()</code>','<code>trim()</code>','<code>round()</code>','lower and upper change case.']]);

L('L47','Advanced',P7,'Turning a business question into SQL, and pivots',
'Method: (1) say the question in plain words, (2) name the tables and the join keys, (3) decide the grain (one row per what?), (4) filter, (5) group and summarise, (6) sanity-check totals. A pivot turns values into columns using SUM(CASE WHEN ...).',
'The owner asks "how are drink sales split by order status?". You decide one row per category, one column per status, then count.',
'coffee',"SELECT p.category, SUM(CASE WHEN o.status = 'paid' THEN o.qty ELSE 0 END) AS paid, SUM(CASE WHEN o.status = 'pending' THEN o.qty ELSE 0 END) AS pending, SUM(CASE WHEN o.status = 'cancelled' THEN o.qty ELSE 0 END) AS cancelled FROM orders o JOIN products p ON p.id = o.product_id GROUP BY p.category;",'Each CASE picks out one status, so each status becomes a column.',
'Show each <b>category</b> with the <b>paid qty</b> as <b>paid</b> and the <b>cancelled qty</b> as <b>cancelled</b> (join orders and products).',"SELECT p.category, SUM(CASE WHEN o.status = 'paid' THEN o.qty ELSE 0 END) AS paid, SUM(CASE WHEN o.status = 'cancelled' THEN o.qty ELSE 0 END) AS cancelled FROM orders o JOIN products p ON p.id = o.product_id GROUP BY p.category",
[['What is the "grain" of a query?','What one result row represents','The sort order','The table size','Decide it first: one row per customer, per month, and so on.'],['A pivot uses...','SUM(CASE WHEN ...)','UNION','LIMIT','CASE inside an aggregate makes columns.'],['A good last step is to...','Sanity-check totals against a simple count','Delete the data','Add DISTINCT','Totals should agree with a known number.']]);

L('L48','Advanced',P7,'Putting it all together: a report query',
'Real reports mix joins, CTEs, aggregates and window functions. Build them in layers: first a CTE that joins and filters, then a second step that summarises, then the final SELECT that ranks and tidies.',
'The monthly owner report: revenue per product, ranked within category, in one clear sheet.',
'coffee',"WITH sales AS (SELECT p.category, p.name, SUM(o.qty * p.price) AS revenue FROM orders o JOIN products p ON p.id = o.product_id WHERE o.status = 'paid' GROUP BY p.id, p.category, p.name) SELECT category, name, revenue, RANK() OVER (PARTITION BY category ORDER BY revenue DESC) AS rank_in_category FROM sales ORDER BY category, rank_in_category;",'Layer 1 builds revenue, layer 2 ranks it.',
'Show the <b>name</b> of the <b>top-earning product (paid orders, qty * price)</b> in each <b>category</b>, category first.',"WITH sales AS (SELECT p.category, p.name, SUM(o.qty * p.price) AS revenue FROM orders o JOIN products p ON p.id = o.product_id WHERE o.status = 'paid' GROUP BY p.id, p.category, p.name), r AS (SELECT category, name, RANK() OVER (PARTITION BY category ORDER BY revenue DESC) AS rk FROM sales) SELECT category, name FROM r WHERE rk = 1",
[['Why build a report in layers?','Each step is simple to check','SQL needs three queries','It is required for ranking','Layers make errors easier to find.'],['Where do you filter on a window rank?','In an outer query or CTE','In WHERE of the same SELECT','In GROUP BY','Window results are not available in WHERE.'],['Which step catches fan-out errors?','Comparing totals with a simple count','Adding more joins','Using SELECT *','Reconcile your total with a known figure.']]);
})();
