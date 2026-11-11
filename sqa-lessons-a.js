/* Lessons 1-17: foundations and summaries. L(id,level,part,title,plain,coffee,db,example,exampleNote,taskText,taskSolution,quiz)
   quiz item = [question, RIGHT answer, wrong, wrong, wrong(optional), explanation] (shuffled when shown) */
window.LESSONS=window.LESSONS||[];
(function(){const L=(...a)=>{const [id,lv,part,t,plain,cof,db,ex,exNote,task,sol,quiz]=a;window.LESSONS.push({id,lv,part,t,plain,cof,db,ex,exNote,task,sol,quiz})};
const P1='1. Foundations',P2='2. Summaries and dates';

L('L01','Beginner',P1,'What a database and SQL are',
'A database is an organised set of tables, like spreadsheets that follow strict rules. SQL (say "sequel" or "S-Q-L") is the language you use to ask a database questions and to change its data. You write a request, and the database sends back rows.',
'Think of the order book at a coffee shop. Each page lists orders in the same columns. SQL is you asking the manager: "Show me every order for Flat White this week." You do not flip pages yourself.',
'coffee','SELECT * FROM products;','The star <code>*</code> means "all columns". <code>FROM products</code> says which table. The semicolon ends the statement.',
'Show everything in the <b>customers</b> table.','SELECT * FROM customers',
[['What does SQL let you do?','Ask questions of a database and change its data','Draw charts only','Replace Excel formulas only','SQL is the language for querying and changing data held in tables.'],['In a table, one horizontal record (for example one customer) is called a...','Row','Column','Schema','A row is one record. A column is one kind of fact about every record.'],['Which part of <code>SELECT * FROM products</code> names the table?','products','SELECT','*','FROM is followed by the table name.']]);

L('L02','Beginner',P1,'Tables, rows, columns and data types',
'A table holds one kind of thing, such as products. Each column is one fact (name, price) and every column has a type: whole numbers (INTEGER), decimals (REAL), text (TEXT). SQLite is flexible about types, but real databases are strict, so respect them.',
'A price list on the wall: one line per product (row), with columns Name and Price. You would never write "cheap" in the Price column. The type is the rule that stops that.',
'coffee','SELECT name, price FROM products;','Naming the columns returns only those columns, in the order you list them.',
'Show the <b>name</b> and <b>city</b> of every customer.','SELECT name, city FROM customers',
[['Which type suits a price like 32.50?','REAL (a decimal number)','TEXT','A whole-number type only','Prices with cents need a decimal type.'],['What is a column?','One kind of fact stored for every row','One record','A whole database','Columns hold the same kind of fact for all rows.'],['Why do tables have types?','To keep the data consistent and safe to calculate with','To make queries slower','Only to save disk space','Types stop a name being stored where a number belongs.']]);

L('L03','Beginner',P1,'SELECT: choosing columns and giving them names',
'After SELECT you list what you want. AS gives a column a friendlier name (an alias). You can also select fixed text or a calculation. The table itself is never changed by a SELECT.',
'Printing a menu for customers: you choose which columns appear and you rename "price" to "Price in rand" without rewriting the till.',
'coffee','SELECT name AS product, price AS price_in_rand FROM products;','Aliases only change the heading in the result, not the table.',
'Show product <b>name</b> as <b>item</b> and <b>price</b> as <b>rand</b>.','SELECT name AS item, price AS rand FROM products',
[['What does <code>AS</code> do?','Gives a column or table a temporary name','Deletes a column','Sorts the data','An alias is a temporary label used in the result.'],['Does SELECT change the table?','No, it only reads data','Yes, it edits rows','Yes, it deletes rows','SELECT is read-only.'],['Which is valid?','<code>SELECT name, price FROM products</code>','<code>SELECT name price FROM products</code>','<code>SELECT FROM products name, price</code>','Columns are separated by commas and SELECT comes first.']]);

L('L04','Beginner',P1,'Filtering rows with WHERE',
'WHERE keeps only the rows that pass a test. Use = for equal, &lt;&gt; or != for not equal, and &gt; &lt; &gt;= &lt;= for size. Text goes in single quotes, numbers do not.',
'The manager says: "Only bring me the Tea orders." WHERE is that instruction. Rows that fail the test are left on the shelf.',
'coffee',"SELECT name, price FROM products WHERE category = 'Tea';",'Single quotes mark text. Double quotes are for column names, so avoid them for text.',
'Show the <b>name</b> of products that cost <b>more than 35</b>.','SELECT name FROM products WHERE price > 35',
[['Where does WHERE go?','After FROM','Before SELECT','After ORDER BY','WHERE comes after FROM and before GROUP BY or ORDER BY.'],['How do you write the text Tea?',"<code>'Tea'</code> in single quotes",'<code>Tea</code> with no quotes','<code>#Tea#</code>','Text values use single quotes.'],['<code>WHERE price &lt;&gt; 30</code> keeps rows where price is...','Not 30','Exactly 30','Less than 30','&lt;&gt; means not equal.']]);

L('L05','Beginner',P1,'AND, OR and NOT',
'Combine tests with AND (both true), OR (either true) and NOT (flip it). AND is worked out before OR, so use brackets to say what you mean.',
'"Coffee AND under R40" gives cheap coffees. "Coffee OR Tea" gives every hot drink. Without brackets, "Coffee OR Tea AND under R30" does not mean what you think.',
'coffee',"SELECT name, category, price FROM products WHERE (category = 'Coffee' OR category = 'Tea') AND price < 40;",'The brackets make the OR happen first.',
'Show the <b>name</b> of Food products that cost <b>less than 28</b>.',"SELECT name FROM products WHERE category = 'Food' AND price < 28",
[['Which is worked out first when there are no brackets?','AND','OR','They are equal','AND binds tighter than OR.'],['<code>WHERE a = 1 OR b = 2</code> keeps a row when...','Either test is true','Both tests are true','Neither test is true','OR needs only one true side.'],['What does NOT do?','Reverses a true/false test','Deletes rows','Sorts rows','NOT turns true into false and false into true.']]);

L('L06','Beginner',P1,'IN, BETWEEN and LIKE',
'IN checks a list. BETWEEN checks a range and includes both ends. LIKE matches text patterns: % means any characters and _ means exactly one character.',
'Looking for names that start with "S" in a customer book is LIKE \'S%\'. Asking for orders on days 1 to 7 is BETWEEN.',
'coffee',"SELECT name FROM customers WHERE name LIKE 'S%';",'LIKE in SQLite ignores upper/lower case for plain English letters.',
'Show the <b>name</b> of products priced <b>BETWEEN 30 AND 40</b>.','SELECT name FROM products WHERE price BETWEEN 30 AND 40',
[['Is 40 included in <code>BETWEEN 30 AND 40</code>?','Yes, both ends are included','No, only the start','No, only the end','BETWEEN is inclusive at both ends.'],['<code>LIKE \'%a\'</code> matches text that...','Ends with a','Starts with a','Contains exactly one a','% means any characters before the final a.'],['<code>IN (1, 2, 3)</code> is a short way to write...','<code>= 1 OR = 2 OR = 3</code> for one column','<code>BETWEEN 1 AND 3</code> only','<code>AND</code> of three tests','IN checks membership of a list.']]);

L('L07','Beginner',P1,'Sorting with ORDER BY',
'Without ORDER BY the database may return rows in any order. ORDER BY sorts by one or more columns. ASC (smallest first) is the default and DESC is largest first.',
'A manager who wants the dearest drinks first says "sort by price, highest on top". If two share a price, you add a second sort such as name.',
'coffee','SELECT name, price FROM products ORDER BY price DESC, name;','Sorting by two columns breaks ties.',
'Show <b>name</b> and <b>price</b> of products, cheapest first, then by name.','SELECT name, price FROM products ORDER BY price, name',
[['Default sort direction?','Ascending (smallest first)','Descending','Random','ASC is the default.'],['Is row order guaranteed without ORDER BY?','No','Yes, by id','Yes, by name','Only ORDER BY guarantees order.'],['How do you sort largest first?','<code>ORDER BY price DESC</code>','<code>ORDER BY price BIG</code>','<code>SORT price</code>','DESC means descending.']]);

L('L08','Beginner',P1,'LIMIT and OFFSET: top rows and pages',
'LIMIT caps how many rows come back. OFFSET skips rows first. With ORDER BY you get "top 5" or page 2. SQL Server uses TOP and Oracle uses FETCH FIRST, so this is a dialect difference.',
'"Show me the three most expensive items" is ORDER BY price DESC LIMIT 3. Page 2 of a menu with 5 lines a page is LIMIT 5 OFFSET 5.',
'coffee','SELECT name, price FROM products ORDER BY price DESC LIMIT 3;','Always pair LIMIT with ORDER BY, or "top" has no meaning.',
'Show the <b>name</b> of the <b>2 cheapest</b> products.','SELECT name FROM products ORDER BY price LIMIT 2',
[['Which clause makes "top 3"?','<code>ORDER BY ... LIMIT 3</code>','<code>GROUP BY 3</code>','<code>WHERE TOP 3</code>','Sort first, then limit.'],['<code>LIMIT 5 OFFSET 10</code> returns...','Rows 11 to 15','Rows 5 to 10','Rows 1 to 5','OFFSET skips 10 rows then 5 are returned.'],['Why add ORDER BY to a LIMIT query?','Otherwise which rows you get is not defined','LIMIT will not run without it','It makes the query faster','Without sorting, "first rows" are arbitrary.']]);

L('L09','Beginner',P1,'DISTINCT: removing repeats',
'DISTINCT returns each different value once. It works on the whole row you select, so with two columns it removes repeated pairs.',
'Asking "which cities do our customers live in?" should list each city once, not once per customer.',
'coffee','SELECT DISTINCT city FROM customers;','NULL appears once if there is a missing city.',
'Show each <b>category</b> in products once.','SELECT DISTINCT category FROM products',
[['DISTINCT removes...','Repeated rows in the result','Rows from the table','NULLs only','It only affects the result, not the table.'],['With <code>SELECT DISTINCT a, b</code> a row is a repeat when...','Both a and b match another row','Only a matches','Only b matches','DISTINCT works on the whole selected row.'],['Does DISTINCT change stored data?','No','Yes','Only on Mondays','It is read-only.']]);

L('L10','Beginner',P1,'NULL: the missing value',
'NULL means "unknown or not recorded". It is not zero and not an empty string. Any comparison with NULL is unknown, so use IS NULL and IS NOT NULL. COALESCE(x, y) swaps a NULL for a default.',
'A customer who never told you their city has NULL city. Asking "city = Cape Town" does not include them, and "city <> Cape Town" does not either.',
'coffee',"SELECT name, COALESCE(city, 'Unknown') AS city FROM customers WHERE city IS NULL;",'<code>WHERE city = NULL</code> never finds anything. Use IS NULL.',
'Show the <b>name</b> of customers whose <b>city is missing</b>.','SELECT name FROM customers WHERE city IS NULL',
[['How do you find missing values?','<code>IS NULL</code>','<code>= NULL</code>','<code>= 0</code>','Only IS NULL tests for NULL.'],['What is <code>NULL = NULL</code>?','Unknown (not true)','True','False and then true','Comparisons with NULL give unknown.'],['<code>COALESCE(city, \'n/a\')</code> returns...','city, or n/a when city is NULL','Always n/a','Always city','COALESCE returns the first non-NULL value.']]);

L('L11','Beginner',P1,'Calculated columns and CASE',
'You can do arithmetic in SELECT: + - * /. CASE WHEN works like if/else and builds labels. Dividing two whole numbers in SQLite gives a whole number, so multiply by 1.0 first when you need decimals.',
'The till shows qty times price. A sign says "Cheap" under R30, "Standard" under R40, else "Premium": that is CASE.',
'coffee',"SELECT name, price, CASE WHEN price < 30 THEN 'Cheap' WHEN price < 40 THEN 'Standard' ELSE 'Premium' END AS band FROM products;",'CASE tests top to bottom and stops at the first match.',
'Show product <b>name</b> and <b>price * 1.15</b> as <b>with_vat</b>.','SELECT name, price * 1.15 AS with_vat FROM products',
[['In what order does CASE test its WHEN lines?','Top to bottom, first match wins','All at once','Bottom to top','CASE stops at the first true WHEN.'],['What is 7 / 2 in SQLite with whole numbers?','3','3.5','4','Integer division drops the remainder.'],['Which makes 7 / 2 give 3.5?','<code>7 * 1.0 / 2</code>','<code>7 // 2</code>','<code>7 div 2</code>','Multiplying by 1.0 forces decimal maths.']]);

L('L12','Beginner',P2,'Counting and summing: COUNT, SUM, AVG, MIN, MAX',
'Aggregate functions squash many rows into one answer. COUNT(*) counts rows, COUNT(column) counts non-NULL values, SUM adds, AVG averages, MIN and MAX find extremes.',
'At closing time you do not read every slip. You ask: how many orders, how many cups in total, what was the biggest order?',
'coffee',"SELECT COUNT(*) AS orders, SUM(qty) AS cups, MAX(qty) AS biggest FROM orders WHERE status = 'paid';",'Without GROUP BY you get one summary row for the whole table.',
'Show the <b>average price</b> of products as <b>avg_price</b>.','SELECT AVG(price) AS avg_price FROM products',
[['<code>COUNT(*)</code> counts...','All rows','Only non-NULL rows of one column','Distinct values','COUNT(*) counts every row.'],['<code>COUNT(city)</code> ignores...','Rows where city is NULL','Rows with a long city name','Duplicate cities','COUNT(column) skips NULLs.'],['Which gives the highest value?','<code>MAX(price)</code>','<code>TOP(price)</code>','<code>BIG(price)</code>','MAX returns the largest value.']]);

L('L13','Beginner',P2,'GROUP BY: one answer per group',
'GROUP BY splits rows into groups and runs the aggregate on each group. Every selected column must be either in GROUP BY or inside an aggregate.',
'Instead of one total for the whole shop, you want one total per drink category, like sorting slips into piles first.',
'coffee','SELECT category, COUNT(*) AS products, AVG(price) AS avg_price FROM products GROUP BY category;','One row per category comes back.',
'Show each <b>category</b> and the <b>number of products</b> as <b>n</b>.','SELECT category, COUNT(*) AS n FROM products GROUP BY category',
[['What does GROUP BY do?','Makes one result row per group','Sorts the table','Deletes duplicates from the table','It collects rows into groups for aggregates.'],['In a grouped query, a plain column must be...','In GROUP BY or inside an aggregate','Always the first column','Numeric','Otherwise the value is ambiguous.'],['<code>GROUP BY category</code> with 4 categories returns...','4 rows','1 row','As many rows as the table','One row per group.']]);

L('L14','Intermediate',P2,'HAVING versus WHERE',
'WHERE filters rows before grouping. HAVING filters groups after the aggregate is worked out. You cannot use SUM or COUNT inside WHERE.',
'WHERE is "only count Tuesday orders". HAVING is "after counting, only show customers with more than 5 orders".',
'coffee',"SELECT customer_id, COUNT(*) AS n FROM orders WHERE status = 'paid' GROUP BY customer_id HAVING COUNT(*) >= 6;",'The paid filter runs first, the count filter runs after grouping.',
'Show <b>customer_id</b> and <b>n</b> (order count) for customers with <b>more than 7 orders</b>.','SELECT customer_id, COUNT(*) AS n FROM orders GROUP BY customer_id HAVING COUNT(*) > 7',
[['Which filters on an aggregate such as COUNT(*)?','HAVING','WHERE','ORDER','HAVING works on groups.'],['Which runs first?','WHERE','HAVING','They run together','Rows are filtered before grouping.'],['Is <code>WHERE COUNT(*) &gt; 3</code> allowed?','No, use HAVING','Yes always','Only with ORDER BY','Aggregates cannot be used in WHERE.']]);

L('L15','Intermediate',P2,'Working with dates',
'SQLite stores dates as text like 2026-03-15. Use date(), strftime() and date arithmetic such as date(x, \'+7 days\'). strftime(\'%Y-%m\', d) groups by month. Other databases have different names but the same ideas.',
'"Sales by month" means cutting each order date down to year and month, then grouping on that.',
'coffee',"SELECT strftime('%Y-%m', order_date) AS month, COUNT(*) AS orders FROM orders GROUP BY month ORDER BY month;",'Always store dates as YYYY-MM-DD so they sort correctly as text.',
'Show the <b>number of orders</b> placed in <b>2026-03</b> as <b>n</b>.',"SELECT COUNT(*) AS n FROM orders WHERE strftime('%Y-%m', order_date) = '2026-03'",
[['Why store dates as YYYY-MM-DD?','They sort correctly and are unambiguous','They take less space','Computers cannot read other formats','Year first makes text order equal date order.'],['<code>strftime(\'%Y-%m\', d)</code> gives...','Year and month, like 2026-03','The weekday name','The day number','%Y is year and %m is month.'],['<code>date(\'2026-03-01\', \'+7 days\')</code> returns...','2026-03-08','2026-03-07','2026-04-01','It adds seven days.']]);

L('L16','Intermediate',P2,'Text functions',
'Common text tools: length(), upper(), lower(), substr(text, start, count), replace(), trim(), and || to join text. Names differ slightly between databases (for example CONCAT in MySQL).',
'Cleaning the customer book: trim stray spaces, make names tidy, cut the first three letters of a code.',
'coffee',"SELECT upper(name) AS shout, length(name) AS letters, substr(name, 1, 3) AS first3 FROM customers LIMIT 5;",'<code>||</code> joins text in SQLite and PostgreSQL.',
"Show customer <b>name</b> and the text <b>name || ' - ' || city</b> as <b>label</b> for customers who have a city.","SELECT name, name || ' - ' || city AS label FROM customers WHERE city IS NOT NULL",
[['What does <code>||</code> do in SQLite?','Joins text together','Means OR','Divides numbers','It is the text join operator.'],['<code>substr(\'Coffee\', 1, 3)</code> returns...','Cof','off','Cof ee','It takes 3 letters starting at position 1.'],['<code>trim(\'  hi \')</code> returns...','hi','hi with spaces','HI','trim removes spaces at the ends.']]);

L('L17','Intermediate',P2,'Numbers: rounding, casting and percentages',
'round(x, 2) rounds to two decimals. CAST(x AS INTEGER) changes type. For a percentage, multiply by 100.0 before dividing so the answer is not cut to a whole number.',
'The owner asks what share of orders were cancelled. Counting cancelled and dividing by all orders gives a share, which you present as a rounded percentage.',
'coffee',"SELECT round(100.0 * SUM(status = 'cancelled') / COUNT(*), 1) AS pct_cancelled FROM orders;",'In SQLite a true test equals 1, so SUM of a test counts matches. Other databases need CASE.',
'Show the <b>percentage of orders with status paid</b> rounded to 1 decimal as <b>pct_paid</b>.',"SELECT round(100.0 * SUM(CASE WHEN status = 'paid' THEN 1 ELSE 0 END) / COUNT(*), 1) AS pct_paid FROM orders",
[['Why write <code>100.0 *</code> before dividing?','To avoid whole-number division','To make it faster','To round the result','Decimals stop the answer being cut to a whole number.'],['<code>round(3.14159, 2)</code> returns...','3.14','3.1','3.142','Two decimals.'],['A safe, portable way to count matches inside SUM is...','<code>SUM(CASE WHEN test THEN 1 ELSE 0 END)</code>','<code>SUM(test)</code> in every database','<code>COUNT(test)</code>','CASE works in every database.']]);
})();
