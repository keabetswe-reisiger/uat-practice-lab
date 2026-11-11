/* Interview and exam bank. X(topic, question, RIGHT answer, wrong, wrong, wrong, explanation). Original questions. Options are shuffled when shown. */
window.EXAM=window.EXAM||[];
(function(){const X=(topic,q,r,a,b,c,why)=>window.EXAM.push({id:'x'+(window.EXAM.length+1),topic,q,o:[r,a,b,c],why});
// ---- Basics and NULL
X('Basics and NULL','Which statement about NULL is correct?','NULL means unknown or missing, and <code>NULL = NULL</code> is not true','NULL is the same as 0','NULL is the same as an empty string','<code>x = NULL</code> finds all missing values','Comparing anything with NULL gives unknown, so you must use IS NULL.');
X('Basics and NULL','A table has 10 rows and 3 have NULL in <code>city</code>. What does <code>COUNT(city)</code> return?','7','10','3','0','COUNT(column) counts only non-NULL values.');
X('Basics and NULL','What does <code>SELECT COALESCE(NULL, NULL, 5, 6)</code> return?','5','6','NULL','11','COALESCE returns the first non-NULL argument.');
X('Basics and NULL','Which query returns rows where <code>city</code> is missing?','<code>WHERE city IS NULL</code>','<code>WHERE city = NULL</code>','<code>WHERE city = \'\'</code>','<code>WHERE city = 0</code>','Only IS NULL tests for NULL.');
X('Basics and NULL','What is the result of <code>5 + NULL</code>?','NULL','5','0','An error','Arithmetic with NULL gives NULL.');
X('Basics and NULL','Which data type is the best fit for storing money amounts exactly in most databases?','A fixed-precision decimal (NUMERIC/DECIMAL)','A floating-point number','Text','A date','Decimals avoid rounding errors that floats can introduce.');
X('Basics and NULL','What does <code>SELECT DISTINCT city FROM customers</code> return?','Each different city once, including NULL once if present','Every city including repeats','Only non-NULL cities','The count of cities','DISTINCT removes repeated values from the result.');
X('Basics and NULL','Which is true about SELECT?','It reads data and does not change the table','It deletes duplicate rows from the table','It can only read one column','It always sorts the rows','SELECT is read-only.');
X('Basics and NULL','What is a primary key?','A column (or columns) that uniquely identifies each row','A column that may contain duplicates','A sorted copy of the table','A password for the table','A primary key is unique and not NULL.');
X('Basics and NULL','Which keyword gives a column a temporary nickname in the result?','AS','LIKE','TOP','FROM','AS creates an alias.');
// ---- Filtering and sorting
X('Filtering and sorting','Which condition includes both 10 and 20?','<code>BETWEEN 10 AND 20</code>','<code>&gt; 10 AND &lt; 20</code>','<code>IN (10..20)</code>','<code>LIKE 10-20</code>','BETWEEN is inclusive at both ends.');
X('Filtering and sorting','What does <code>WHERE name LIKE \'A%\'</code> match?','Text starting with A','Text ending with A','Text containing exactly one A','Text of one letter','% stands for any characters after A.');
X('Filtering and sorting','What does <code>_</code> mean in a LIKE pattern?','Exactly one character','Any number of characters','The end of the text','An underscore only','_ matches a single character.');
X('Filtering and sorting','What is the default order when ORDER BY has no direction?','Ascending','Descending','Random','Insertion order','ASC is the default.');
X('Filtering and sorting','Which makes "top 3 by price" in SQLite or PostgreSQL?','<code>ORDER BY price DESC LIMIT 3</code>','<code>SELECT TOP 3 WHERE price</code>','<code>LIMIT 3 ORDER price</code>','<code>GROUP BY price LIMIT 3</code>','Sort largest first, then limit.');
X('Filtering and sorting','How is the "top 3 rows" written in SQL Server?','<code>SELECT TOP 3 ...</code>','<code>LIMIT 3</code>','<code>ROWNUM &lt; 3</code> only','<code>FIRST 3</code>','SQL Server uses TOP; Oracle and PostgreSQL support FETCH FIRST.');
X('Filtering and sorting','What does <code>a = 1 OR b = 2 AND c = 3</code> do without brackets?','Treats <code>b = 2 AND c = 3</code> first','Treats <code>a = 1 OR b = 2</code> first','Raises an error','Evaluates strictly left to right','AND is evaluated before OR.');
X('Filtering and sorting','Without ORDER BY, the order of rows returned is...','Not guaranteed','Always by primary key','Always by insertion time','Alphabetical','Only ORDER BY guarantees order.');
// ---- Aggregation
X('Aggregation','Which clause filters groups after aggregation?','HAVING','WHERE','ON','LIMIT','HAVING works on aggregated results.');
X('Aggregation','Why does <code>SELECT dept, name, COUNT(*) FROM emp GROUP BY dept</code> fail in strict SQL?','<code>name</code> is neither grouped nor aggregated','COUNT cannot be used with GROUP BY','dept is not a number','GROUP BY needs ORDER BY','Every selected column must be grouped or aggregated.');
X('Aggregation','Which is the order of execution?','FROM, WHERE, GROUP BY, HAVING, SELECT, ORDER BY','SELECT, FROM, WHERE, GROUP BY, ORDER BY','WHERE, FROM, SELECT, GROUP BY','GROUP BY, WHERE, FROM, SELECT','The logical order starts at FROM, and SELECT happens late.');
X('Aggregation','Can you use a SELECT alias in WHERE in standard SQL?','No, WHERE runs before SELECT','Yes always','Only with GROUP BY','Only in SQLite','Aliases do not exist yet when WHERE is evaluated.');
X('Aggregation','What does <code>AVG(x)</code> do with NULL values?','Ignores them','Treats them as 0','Fails','Counts them as 1','Aggregates skip NULLs.');
X('Aggregation','What is <code>COUNT(DISTINCT customer_id)</code>?','The number of different customers','The number of rows','The number of NULLs','The largest id','DISTINCT inside COUNT counts unique values.');
X('Aggregation','Which gives the percentage of paid orders without whole-number division errors?','<code>100.0 * SUM(CASE WHEN paid THEN 1 ELSE 0 END) / COUNT(*)</code>','<code>SUM(paid) / COUNT(*) * 100</code> with integers','<code>COUNT(paid) / 100</code>','<code>AVG(100)</code>','Force decimal maths and count with CASE.');
X('Aggregation','Which query counts orders per customer including customers with none?','<code>customers LEFT JOIN orders ... COUNT(o.id)</code>','<code>customers JOIN orders ... COUNT(*)</code>','<code>orders GROUP BY customer_id</code>','<code>COUNT(*) FROM customers</code>','LEFT JOIN keeps all customers; COUNT(o.id) gives 0 for none.');
X('Aggregation','<code>WHERE</code> versus <code>HAVING</code>: which can use <code>SUM(x) &gt; 100</code>?','HAVING','WHERE','Both','Neither','Aggregate conditions belong in HAVING.');
X('Aggregation','What does <code>GROUP BY 1, 2</code> mean in many databases?','Group by the first and second selected columns','Group by the values 1 and 2','Limit to 2 groups','A syntax error everywhere','Numbers refer to select-list positions (a shortcut best avoided in production).');
// ---- Joins
X('Joins','INNER JOIN returns...','Only rows with matches in both tables','All rows of both tables','All rows of the left table','Rows without matches','Unmatched rows are dropped.');
X('Joins','LEFT JOIN returns...','All left rows, with NULLs where the right has no match','Only matching rows','All right rows','The cross product','Left rows are always kept.');
X('Joins','How do you find customers with no orders?','LEFT JOIN orders and WHERE orders.id IS NULL','INNER JOIN orders and WHERE orders.id IS NULL','CROSS JOIN orders','GROUP BY customer','Unmatched left rows have NULL on the right.');
X('Joins','Joining a customer with 3 orders to the orders table produces...','3 rows for that customer','1 row','0 rows','9 rows','Each matching order makes a row.');
X('Joins','What is fan-out?','A join to a "many" table repeating a "one" row and inflating sums','A faster join','Using an index','A type of subquery','Aggregate before the join or count distinct ids to avoid it.');
X('Joins','What does CROSS JOIN of 4 and 5 rows give?','20 rows','9 rows','5 rows','4 rows','Every row pairs with every row.');
X('Joins','A self-join is used when...','A table refers to itself, like employee and manager','Two tables share a name','You need a subquery','There are NULLs','Alias the same table twice.');
X('Joins','What happens if you forget the ON in an INNER JOIN?','Syntax error or an unintended cross product (depending on database)','Nothing, it still matches by name','It becomes a LEFT JOIN','The query is faster','Always state how tables match.');
X('Joins','Which join returns rows present in either table, with NULL where no match?','FULL OUTER JOIN','INNER JOIN','CROSS JOIN','SELF JOIN','FULL OUTER keeps unmatched rows from both sides (not available in every database or version).');
X('Joins','Putting a filter on the right table in WHERE after a LEFT JOIN, such as <code>WHERE o.status = \'paid\'</code>, can...','Turn the LEFT JOIN into an inner join in effect','Make it faster only','Keep all left rows','Do nothing','Rows with NULL right side fail the WHERE test; put the condition in ON to keep them.');
X('Joins','The foreign key <code>orders.customer_id</code> points to...','<code>customers.id</code>','<code>orders.id</code>','<code>products.id</code>','Nothing','It stores the key of the related customer.');
X('Joins','Which is best to list products never ordered?','<code>NOT EXISTS</code> or a LEFT JOIN with IS NULL','<code>JOIN</code> with <code>COUNT</code>','<code>UNION</code>','<code>ORDER BY</code>','Anti-join patterns find missing matches.');
X('Joins','A join between tables with 100 and 200 rows on a unique key can return at most how many rows when each left row matches at most one right row?','100','200','300','20000','Each left row yields at most one result row.');
X('Joins','Which type of join is described by "keep everything from the right table"?','RIGHT JOIN','LEFT JOIN','INNER JOIN','CROSS JOIN','A RIGHT JOIN mirrors a LEFT JOIN.');
// ---- Subqueries
X('Subqueries','A correlated subquery is one that...','References a column of the outer query','Has no WHERE','Runs only once','Returns many columns','It is evaluated in relation to each outer row.');
X('Subqueries','What does <code>EXISTS (SELECT 1 ...)</code> test?','Whether at least one row is returned','The value of 1','The count of rows','The sort order','EXISTS is true if the subquery returns any row.');
X('Subqueries','Why can <code>NOT IN (subquery)</code> return no rows unexpectedly?','A NULL in the list makes the result unknown','NOT IN is invalid','It is case sensitive','It needs an index','Comparisons with NULL are unknown, so no row passes.');
X('Subqueries','A scalar subquery returns...','A single value','A table of rows','A list of columns','Nothing','One row and one column.');
X('Subqueries','Which finds products priced above the average?','<code>WHERE price &gt; (SELECT AVG(price) FROM products)</code>','<code>WHERE price &gt; AVG(price)</code>','<code>HAVING price &gt; AVG</code>','<code>GROUP BY AVG(price)</code>','Aggregates cannot sit directly in WHERE.');
X('Subqueries','A derived table is...','A subquery in FROM with an alias','A view','A temporary index','A foreign key','It acts like a temporary table inside the query.');
X('Subqueries','Which is usually the clearest way to name several reusable steps?','CTEs (WITH)','Deeply nested subqueries','Repeating the query','Using SELECT *','CTEs label each step.');
X('Subqueries','<code>x IN (1, 2, 3)</code> is equivalent to...','<code>x = 1 OR x = 2 OR x = 3</code>','<code>x BETWEEN 1 AND 3</code> only','<code>x = 1 AND x = 2</code>','<code>x LIKE 1</code>','IN tests membership of a list.');
// ---- Set operations
X('Set operations','Difference between UNION and UNION ALL?','UNION removes duplicates, UNION ALL keeps them','UNION ALL removes duplicates','They are identical','UNION needs ORDER BY','UNION ALL is usually faster.');
X('Set operations','What must two queries share to be combined with UNION?','The same number of columns with compatible types','The same table','The same WHERE','The same column names','Columns are matched by position.');
X('Set operations','Which returns rows in the first query but not the second?','EXCEPT (MINUS in Oracle)','INTERSECT','UNION','CROSS JOIN','EXCEPT subtracts.');
X('Set operations','INTERSECT returns...','Rows present in both queries','Rows in either query','Rows only in the first','All rows','The common rows.');
X('Set operations','Where does ORDER BY go in a UNION?','At the very end, applying to the combined result','After each query','Before UNION','Inside GROUP BY','Sorting applies to the final combined set.');
// ---- CTEs and recursion
X('CTEs and recursion','A CTE is introduced with...','WITH','CTE','TEMP','USING','WITH name AS (...).');
X('CTEs and recursion','Is a CTE stored permanently?','No, it exists only for the one statement','Yes in the database file','Yes until restart','Only if recursive','It is a named temporary result.');
X('CTEs and recursion','Which problem is best solved with a recursive CTE?','Walking an org chart of unknown depth','Adding two numbers','Counting rows','Sorting text','Hierarchies need repeated self-reference.');
X('CTEs and recursion','A recursive CTE needs...','An anchor query and a recursive step joined with UNION ALL','Two unrelated queries','A loop keyword','An index','Anchor plus step.');
X('CTEs and recursion','What ends a recursive CTE?','The recursive step produces no new rows','A timer','LIMIT only','A COMMIT','It stops when nothing new is added.');
X('CTEs and recursion','Why might you pick a CTE over a nested subquery?','Readability: each step has a name','CTEs always run faster','Nested subqueries are invalid','CTEs change data','Performance is often similar; clarity improves.');
// ---- Window functions
X('Window functions','What makes a window function different from GROUP BY?','It keeps every row','It removes rows','It cannot use SUM','It only works on text','The result is added beside each row.');
X('Window functions','Which function numbers rows 1, 2, 3 without ties?','ROW_NUMBER','RANK','DENSE_RANK','NTILE','ROW_NUMBER gives unique numbers.');
X('Window functions','Values 100, 100, 90 ranked by RANK give...','1, 1, 3','1, 2, 3','1, 1, 2','1, 2, 2','RANK leaves a gap after a tie.');
X('Window functions','The same values ranked with DENSE_RANK give...','1, 1, 2','1, 1, 3','1, 2, 3','2, 2, 1','DENSE_RANK has no gaps.');
X('Window functions','What does <code>PARTITION BY dept</code> do?','Restarts the window for each department','Sorts by dept','Filters dept','Joins dept','It splits rows into independent windows.');
X('Window functions','Which gives a running total?','<code>SUM(x) OVER (ORDER BY d)</code>','<code>SUM(x) GROUP BY d</code>','<code>COUNT(x) OVER ()</code>','<code>MAX(x)</code>','ORDER BY inside OVER makes it cumulative.');
X('Window functions','What does LAG(x) return?','The value from the previous row in the window','The next value','The first value','The average','LAG looks back.');
X('Window functions','Can you filter on a window function in WHERE of the same query?','No, wrap it in a CTE or subquery first','Yes always','Only with HAVING','Only in SQLite','Window results are computed after WHERE.');
X('Window functions','How do you get the top earner per department?','ROW_NUMBER() OVER (PARTITION BY dept ORDER BY salary DESC) then keep 1','GROUP BY dept only','ORDER BY dept LIMIT 1','HAVING MAX(salary)','Rank within each group, then filter.');
X('Window functions','What does NTILE(4) do?','Splits ordered rows into 4 roughly equal buckets','Returns the 4th row','Adds 4','Limits to 4 rows','Useful for quartiles.');
X('Window functions','Which frame gives a 3-row moving window ending at the current row?','<code>ROWS BETWEEN 2 PRECEDING AND CURRENT ROW</code>','<code>ROWS BETWEEN 3 PRECEDING AND 3 FOLLOWING</code>','<code>RANGE 3</code>','<code>PARTITION 3</code>','Two before plus the current row.');
X('Window functions','How can you remove duplicate rows keeping the newest?','ROW_NUMBER() OVER (PARTITION BY key ORDER BY updated DESC) and keep rn = 1','DISTINCT *','ORDER BY key','GROUP BY without columns','Number the copies per key and keep the first.');
// ---- DML, DDL and constraints
X('DML, DDL and constraints','Which statement removes all rows but keeps the table, with a WHERE for control?','DELETE FROM table WHERE ...','DROP TABLE','TRUNCATE ... WHERE','REMOVE','DELETE can use WHERE; DROP removes the table itself.');
X('DML, DDL and constraints','What happens if UPDATE has no WHERE?','Every row is updated','Nothing changes','An error always','Only the first row changes','Always test the WHERE first with SELECT.');
X('DML, DDL and constraints','What does NOT NULL do?','Forbids missing values in the column','Forbids zeros','Sorts values','Makes a key','It guards against blanks.');
X('DML, DDL and constraints','What does UNIQUE do?','Stops duplicate values in the column','Sorts the column','Requires a number','Makes the column hidden','Duplicates are rejected.');
X('DML, DDL and constraints','What does CHECK (price &gt; 0) do?','Rejects rows that break the rule','Sorts by price','Creates an index','Adds a default','The database enforces the rule.');
X('DML, DDL and constraints','What does a FOREIGN KEY enforce?','The referenced row must exist in the other table','Values must be unique','Values must be sorted','The column must be text','It protects links between tables.');
X('DML, DDL and constraints','Which is DDL (data definition)?','CREATE TABLE','SELECT','INSERT','UPDATE','DDL defines structures. INSERT/UPDATE/DELETE are DML.');
X('DML, DDL and constraints','What does <code>INSERT INTO t(a, b) VALUES (1, 2)</code> do?','Adds one row with a = 1 and b = 2','Updates a row','Creates a table','Selects rows','It adds a row.');
X('DML, DDL and constraints','What is a view?','A saved query that behaves like a table','A copy of a table','An index','A constraint','Its data is read live from the base tables.');
X('DML, DDL and constraints','Why name the columns in INSERT?','So values go to the intended columns even if the table changes','It is faster to run','It is required in SELECT','It avoids constraints','Explicit columns are safer.');
// ---- Transactions and ACID
X('Transactions and ACID','What does ROLLBACK do?','Undoes uncommitted changes','Saves changes','Drops the table','Starts a transaction','It reverses the open transaction.');
X('Transactions and ACID','Which ACID letter guarantees all steps happen or none?','Atomicity','Consistency','Isolation','Durability','Atomic means all or nothing.');
X('Transactions and ACID','Durability means...','Committed data survives a crash','Queries are always fast','Data is sorted','Rows are unique','Once committed it stays.');
X('Transactions and ACID','Isolation means...','Concurrent transactions do not see each other\'s half-done work','Each table is separate','Users are separate','Disks are separate','It controls what concurrent users see.');
X('Transactions and ACID','Transferring R100 between two accounts should use...','One transaction with both updates','Two separate auto-commits','Two SELECTs','A view','Both updates must succeed together.');
X('Transactions and ACID','What is a dirty read?','Reading data another transaction has not yet committed','Reading old rows','Reading NULLs','Reading an index','Stronger isolation levels prevent it.');
X('Transactions and ACID','What happens to uncommitted changes if the connection drops?','They are rolled back','They are saved','They are kept forever','They are emailed','Uncommitted work is not durable.');
X('Transactions and ACID','Consistency in ACID means...','A transaction moves the database from one valid state to another','All users see the same screen','Every row is the same','Queries are repeated','Constraints and rules remain satisfied.');
// ---- Indexes and performance
X('Indexes and performance','An index mainly speeds up...','Searches and joins on the indexed columns','INSERT speed','Table creation','Backups','It acts like a sorted lookup.');
X('Indexes and performance','What is a cost of adding many indexes?','Slower writes and more space','Wrong answers','Lost data','Syntax errors','Every index must be maintained on writes.');
X('Indexes and performance','Which condition can normally use an index on <code>order_date</code>?','<code>order_date &gt;= \'2026-03-01\'</code>','<code>substr(order_date,1,7) = \'2026-03\'</code>','<code>lower(order_date) = ...</code>','<code>order_date + 0 = 5</code>','Wrapping the column in a function usually blocks index use.');
X('Indexes and performance','What does EXPLAIN (QUERY PLAN) show?','How the database intends to run the query','The query result','Table sizes only','Syntax errors','Use it to see scans versus index searches.');
X('Indexes and performance','A full table scan means...','Every row is read','An index was used','The query failed','Rows are sorted','Fine for small tables, slow for big ones.');
X('Indexes and performance','Why avoid <code>SELECT *</code> in production queries?','It reads and sends unnecessary columns and hides changes','It is a syntax error','It sorts data','It locks the database','Select only what you need.');
X('Indexes and performance','Which index helps <code>WHERE customer_id = ? ORDER BY order_date</code>?','A composite index on (customer_id, order_date)','An index on order_date only','No index','An index on status','The leading column filters and the next provides order.');
X('Indexes and performance','Is a high-cardinality column (many different values) usually a good index candidate?','Yes, it is selective','No, never','Only booleans are','Only text','Selective indexes narrow rows quickly.');
X('Indexes and performance','A common reason a query is slow on a big table is...','Missing index or non-sargable conditions','Too many comments','A short table name','Using uppercase','Check the plan first.');
X('Indexes and performance','Which is true about <code>LIKE \'%abc\'</code> and a normal index?','The leading wildcard usually prevents index use','It always uses the index','It is faster than <code>LIKE \'abc%\'</code>','It sorts rows','A prefix match can use an index; a suffix match cannot.');
// ---- Normalisation and modelling
X('Normalisation and modelling','What is an update anomaly?','Changing a repeated fact in one row but not others','A slow update','A locked update','An index error','Duplicated facts drift out of step.');
X('Normalisation and modelling','1NF requires...','One atomic value per cell','A foreign key','No NULLs','An index','No repeating groups in a single cell.');
X('Normalisation and modelling','2NF is about...','Columns depending on the whole key, not part of it','Indexes','Views','Triggers','It removes partial dependencies.');
X('Normalisation and modelling','3NF says columns should depend on...','The key and nothing but the key','Each other','Row order','Table names','No transitive dependencies.');
X('Normalisation and modelling','A many-to-many relationship between students and courses is modelled with...','A junction (link) table with two foreign keys','One table with comma lists','A view','A single foreign key','The junction holds one row per pairing.');
X('Normalisation and modelling','Why might a reporting database be denormalised?','To make reads simpler and faster','Because normal forms are illegal','To save rows','To avoid keys','It trades some duplication for speed.');
X('Normalisation and modelling','In an ER diagram a one-to-many relationship between customers and orders is stored by...','A customer_id foreign key in orders','An order_id in customers','A third table always','Duplicating customers','The many side holds the key.');
X('Normalisation and modelling','What is a surrogate key?','An artificial identifier such as an auto-number id','A natural identifier like an ID number','A foreign key','A password','It has no business meaning.');
// ---- Dialects and tools
X('Dialects and tools','Which concatenates text in standard SQL and SQLite/PostgreSQL?','<code>||</code>','<code>&amp;&amp;</code>','<code>+</code> everywhere','<code>PLUS</code>','|| is standard; SQL Server uses + and CONCAT.');
X('Dialects and tools','Which database uses <code>SELECT TOP 5</code>?','SQL Server','SQLite','PostgreSQL','MySQL','TOP is T-SQL.');
X('Dialects and tools','Which is true about SQL dialects?','The core is shared but functions and details differ','All databases are identical','Each has a different language','SQL has no standard','Learn the core, then look up differences.');
X('Dialects and tools','What does ISO date text YYYY-MM-DD allow?','Correct sorting and comparison as text','Faster joins','Smaller storage','Time zones','Year-first dates sort chronologically.');
X('Dialects and tools','Which tool would you use to see a query\'s plan in PostgreSQL?','EXPLAIN (or EXPLAIN ANALYZE)','SHOW PLAN only','DESCRIBE','PRAGMA','EXPLAIN is the standard approach there.');
// ---- Reading questions
X('Reading business questions','"Revenue per month" needs which grain?','One row per month','One row per order','One row per customer','One row per product','Decide what a result row represents before you write SQL.');
X('Reading business questions','After a complex join your total looks too high. First check...','Fan-out from joining to a many table','The font','The index','The table name','Compare against a simple count or sum.');
X('Reading business questions','Best habit before DELETE or UPDATE on real data?','Run the same WHERE as a SELECT and use a transaction','Run it immediately','Remove the WHERE','Disable constraints','Preview and be able to roll back.');
X('Reading business questions','A pivot (values to columns) is usually built with...','SUM(CASE WHEN ... THEN ... END)','UNION ALL only','ORDER BY','LIMIT','CASE inside an aggregate.');
X('Reading business questions','Which is the best way to compare two sets of customers (A but not B)?','EXCEPT or NOT EXISTS','UNION','CROSS JOIN','ORDER BY','Subtract set B from set A.');
X('Reading business questions','You get 1 row where you expected 50. A likely cause is...','A GROUP BY or aggregate without the right grouping','A missing semicolon','Wrong font','Too many columns','Check what grain the query returns.');
})();

/* Talk-it-through cards for interviews: question, model answer */
window.TALK=[
['Explain INNER JOIN and LEFT JOIN as if to a manager.','INNER JOIN keeps only rows that have a partner on both sides. LEFT JOIN keeps every row from the left table and shows blanks where there is no partner. I use LEFT JOIN to find things that are missing, such as customers with no orders.'],
['What is the difference between WHERE and HAVING?','WHERE filters individual rows before grouping. HAVING filters groups after the aggregate has been calculated, for example customers with more than five orders.'],
['How do you find duplicate rows?','Group by the columns that should be unique and keep groups with COUNT(*) greater than 1. To remove them, number the copies with ROW_NUMBER over the key and delete or ignore rows where the number is greater than 1.'],
['What is a window function and when would you use one?','It calculates across related rows but keeps every row. I use it for running totals, rankings, comparing with the previous row (LAG) and top-N per group.'],
['Explain a primary key and a foreign key.','A primary key uniquely identifies a row in its table. A foreign key is a column that holds another table\'s key, which links the rows and lets the database stop invalid links.'],
['What is normalisation and why do it?','It is splitting data so each fact is stored once. It avoids update, insert and delete anomalies and wasted space. For reporting you sometimes denormalise on purpose to make queries simpler.'],
['How would you make a slow query faster?','Look at the query plan first. Check for missing indexes on join and filter columns, avoid functions on indexed columns in WHERE, select only needed columns, filter early, and check for fan-out from joins. Then measure again.'],
['What are ACID properties?','Atomicity: all or nothing. Consistency: rules stay satisfied. Isolation: concurrent work does not interfere. Durability: committed data survives a crash.'],
['What is the difference between UNION and UNION ALL?','UNION removes duplicate rows and so does extra work. UNION ALL keeps every row and is faster. Use UNION ALL when you know there are no duplicates or you want them.'],
['What does NULL mean and how do you handle it?','NULL means unknown or missing. It is not zero or an empty string. I test it with IS NULL, replace it with COALESCE and remember that comparisons with NULL are never true.'],
['What is a CTE and why use it?','A common table expression names a temporary result with WITH. It makes long queries readable by giving each step a name and lets me reuse a step more than once.'],
['What is the difference between DELETE, TRUNCATE and DROP?','DELETE removes chosen rows and can be rolled back. TRUNCATE quickly removes all rows and keeps the table (behaviour varies by database). DROP removes the whole table.'],
['What is an index and what is its trade-off?','A sorted structure that lets the database find rows quickly. The trade-off is extra storage and slower inserts and updates, so I index columns used for filtering and joining and not everything.'],
['How do you get the top N rows per group?','Use ROW_NUMBER or RANK with PARTITION BY the group and ORDER BY the measure in a CTE, then filter on the rank in the outer query.'],
['What is the order in which SQL runs a query?','Logically: FROM and JOIN, WHERE, GROUP BY, HAVING, SELECT, DISTINCT, ORDER BY, then LIMIT. That is why a SELECT alias cannot be used in WHERE.'],
['What is a view and when would you use one?','A view is a saved query that behaves like a table. I use it to simplify repeated logic and to show people only the columns or rows they are allowed to see.'],
['How do you avoid double counting after a join?','Know the grain. Aggregate the many side first in a subquery or CTE and then join, or count distinct keys. Always reconcile the total with a simple count.'],
['What is a self-join? Give an example.','Joining a table to itself with two aliases, such as employees to managers using manager_id.'],
['How would you explain a transaction?','A group of statements treated as one unit. If anything fails I roll back so no half-finished change is saved. Transferring money between accounts is the classic example.'],
['What would you check when a report total is wrong?','The grain of the result, the join keys, NULL handling, duplicates, date boundaries (inclusive or exclusive) and whether a filter in WHERE has accidentally turned a LEFT JOIN into an inner join.'],
['SQL versus Excel: when is each better?','Excel is fine for small, one-off analysis I can see. SQL is better when the data is large, shared, needs repeating, or lives in a database. They complement each other.'],
['How do you protect data when changing it?','Back up, write the WHERE as a SELECT first, use a transaction, check the number of affected rows, and test on a copy before production.'],
['What is a data warehouse, in plain words?','A database designed for reporting across a business, often combining data from several systems, usually with denormalised tables built for fast summaries.'],
['What is the difference between a clustered and a non-clustered index?','A clustered index decides how the table rows are physically ordered (one per table in SQL Server). A non-clustered index is a separate structure that points to the rows. (Terminology varies by database.)'],
['How do you handle dates correctly in reports?','Use consistent formats, decide whether ranges include the end day (I prefer a half-open range: start inclusive, end exclusive), and watch time zones and time parts.']
];
