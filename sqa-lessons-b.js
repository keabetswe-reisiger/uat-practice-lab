/* Lessons 18-30: joins, subqueries, sets and CTEs */
window.LESSONS=window.LESSONS||[];
(function(){const L=(...a)=>{const [id,lv,part,t,plain,cof,db,ex,exNote,task,sol,quiz]=a;window.LESSONS.push({id,lv,part,t,plain,cof,db,ex,exNote,task,sol,quiz})};
const P3='3. Joins',P4='4. Subqueries, sets and CTEs';

L('L18','Intermediate',P3,'Why tables are split: keys',
'Data is split into tables so each fact is stored once. A primary key is a column (usually id) that identifies each row. A foreign key is a column that holds another table\'s key, such as orders.customer_id pointing at customers.id.',
'You do not rewrite the customer\'s address on every order slip. The slip carries a customer number and you look the person up in the customer book.',
'coffee','SELECT id, customer_id, product_id, qty FROM orders LIMIT 5;','Those ids point at rows in customers and products. A JOIN follows them.',
'Show the <b>id</b>, <b>customer_id</b> and <b>product_id</b> of the first 3 orders by id.','SELECT id, customer_id, product_id FROM orders ORDER BY id LIMIT 3',
[['What does a primary key do?','Identifies each row uniquely','Sorts the table','Stores prices','It is the unique identifier of a row.'],['A foreign key is...','A column pointing to another table\'s key','A second primary key','A password','It links rows between tables.'],['Why not repeat the customer address on every order?','Duplicated facts get out of step and waste space','SQL forbids it','It is slower to type','Storing a fact once avoids contradictions.']]);

L('L19','Intermediate',P3,'INNER JOIN',
'JOIN puts columns from two tables side by side by matching a key. INNER JOIN keeps only rows that have a match on both sides. Use table aliases (o, c) to keep it short.',
'Pinning each order slip to its customer card. A slip with no matching card is left out of an inner join.',
'coffee','SELECT o.id, c.name, o.qty FROM orders o JOIN customers c ON c.id = o.customer_id ORDER BY o.id LIMIT 8;','ON says how the tables match. Forgetting it makes every row pair with every row.',
'Show <b>customers.name</b> and <b>orders.qty</b> for the order with id <b>1</b>.','SELECT c.name, o.qty FROM orders o JOIN customers c ON c.id = o.customer_id WHERE o.id = 1',
[['INNER JOIN returns...','Only rows with a match in both tables','All rows from both tables','Rows without a match','Unmatched rows are dropped.'],['What goes after ON?','The matching condition','The sort order','The table name','ON defines how rows match.'],['What is <code>o</code> in <code>FROM orders o</code>?','A table alias','A column','A keyword','An alias shortens the name.']]);

L('L20','Intermediate',P3,'LEFT JOIN and finding what is missing',
'LEFT JOIN keeps every row from the left table and fills the right side with NULL when there is no match. Add WHERE right.key IS NULL to find rows with no partner, such as customers who never ordered.',
'You hold every customer card and look for slips. Cards without slips still appear, with the slip fields blank.',
'coffee','SELECT c.name, COUNT(o.id) AS orders FROM customers c LEFT JOIN orders o ON o.customer_id = c.id GROUP BY c.id, c.name ORDER BY orders LIMIT 5;','COUNT(o.id) counts matches only, so customers with none show 0.',
'Show the <b>name</b> of customers who have <b>never placed an order</b>.','SELECT c.name FROM customers c LEFT JOIN orders o ON o.customer_id = c.id WHERE o.id IS NULL',
[['LEFT JOIN keeps...','Every row from the left table','Only matching rows','Only the right table','Left rows are always kept.'],['How do you find left rows with no match?','<code>WHERE right_key IS NULL</code>','<code>WHERE right_key = 0</code>','<code>HAVING 1</code>','Unmatched rows have NULL on the right.'],['Why use <code>COUNT(o.id)</code> not <code>COUNT(*)</code> after a LEFT JOIN?','COUNT(*) would count the NULL row as 1','COUNT(*) is not allowed','They are identical','A customer with no orders must show 0.']]);

L('L21','Intermediate',P3,'Joining three tables',
'Chain joins one after another. Each JOIN adds another table by its own ON. Think of it as building a wide table, one link at a time.',
'Order slip, customer card and the price list on the wall: all three are needed to print a proper receipt.',
'coffee','SELECT c.name AS customer, p.name AS product, o.qty, o.qty * p.price AS line_total FROM orders o JOIN customers c ON c.id = o.customer_id JOIN products p ON p.id = o.product_id ORDER BY o.id LIMIT 6;','Check that every JOIN has its own ON.',
'Show the <b>product name</b> and <b>line_total</b> (qty * price) of order <b>id 1</b>.','SELECT p.name, o.qty * p.price AS line_total FROM orders o JOIN products p ON p.id = o.product_id WHERE o.id = 1',
[['Can you JOIN more than two tables?','Yes, add a JOIN ... ON for each','No, never','Only with UNION','Joins can be chained.'],['What happens if a JOIN has no ON?','Every row pairs with every row','An error always','Nothing','It becomes a cross join.'],['Which gives a line total?','<code>o.qty * p.price</code>','<code>o.qty + p.price</code>','<code>COUNT(o.qty)</code>','Quantity times unit price.']]);

L('L22','Intermediate',P3,'Self-join: a table joined to itself',
'When one table points at itself, such as employee to manager, join it with two different aliases. One alias plays the employee and the other plays the manager.',
'An org chart: each person card carries their boss\'s number. To print "person - boss" you look each boss number up in the same card box.',
'hr','SELECT e.name AS employee, m.name AS manager FROM employees e LEFT JOIN employees m ON m.id = e.manager_id ORDER BY e.id LIMIT 8;','LEFT JOIN keeps the top boss, who has no manager.',
'Show the <b>name</b> of everyone whose <b>manager is Zinhle Dube</b>.',"SELECT e.name FROM employees e JOIN employees m ON m.id = e.manager_id WHERE m.name = 'Zinhle Dube'",
[['Why two aliases in a self-join?','To tell the two roles of the same table apart','SQL requires three tables','To speed it up','Aliases let one table play two parts.'],['Which keeps the top boss who has no manager?','LEFT JOIN','INNER JOIN','CROSS JOIN','LEFT JOIN keeps unmatched left rows.'],['A column that points to the same table\'s id is often called...','A self-referencing foreign key','A cartesian key','An alias key','The employee-manager pattern.']]);

L('L23','Intermediate',P3,'CROSS JOIN and join fan-out',
'A CROSS JOIN pairs every row with every row. Fan-out is the quiet bug where a join to a "many" table repeats a "one" row, which inflates sums.',
'Two lists of 5 shirts and 4 trousers give 20 outfits (cross join). If a customer has 3 orders, joining customers to orders shows that customer 3 times.',
'coffee','SELECT COUNT(*) AS pairs FROM products CROSS JOIN customers;','12 products times 25 customers is 300 pairs.',
'Show the number of <b>pairs</b> you get from <b>products CROSS JOIN customers WHERE price &gt; 40</b>, as <b>pairs</b>.','SELECT COUNT(*) AS pairs FROM products CROSS JOIN customers WHERE price > 40',
[['A CROSS JOIN of 5 rows and 4 rows gives...','20 rows','9 rows','4 rows','Every row pairs with every row.'],['Fan-out means...','One row repeated by a join to many rows','A faster join','A missing join','It inflates counts and sums.'],['To avoid double counting after a join you can...','Aggregate before joining or count DISTINCT ids','Use SELECT *','Add ORDER BY','Collapse the many side first.']]);

L('L24','Intermediate',P3,'Aggregating across joins',
'Join first to get the columns you need, then GROUP BY. Group by the id as well as the name, because two different people can share a name.',
'Revenue per customer needs the price from the products list and the quantity from orders, then a total per person.',
'coffee',"SELECT c.id, c.name, SUM(o.qty * p.price) AS spent FROM orders o JOIN customers c ON c.id = o.customer_id JOIN products p ON p.id = o.product_id WHERE o.status = 'paid' GROUP BY c.id, c.name ORDER BY spent DESC LIMIT 5;",'Group by c.id so two customers with the same name stay separate.',
'Show each product <b>category</b> and the <b>total qty</b> sold as <b>cups</b> (join orders to products).','SELECT p.category, SUM(o.qty) AS cups FROM orders o JOIN products p ON p.id = o.product_id GROUP BY p.category',
[['Group by id as well as name because...','Different rows can share a name','SQL needs two columns','Names are numbers','ids are unique, names may not be.'],['Join first or group first?','Join to get the columns, then group','Always group first','Order does not matter at all','You need the joined columns to summarise.'],['A total per category needs...','JOIN to categories, then GROUP BY category','Only ORDER BY','Only WHERE','Summaries need GROUP BY.']]);

L('L25','Intermediate',P4,'Subqueries in WHERE',
'A subquery is a query inside another query. In WHERE you can compare with one value (a scalar subquery) or test membership with IN (a list).',
'"Which products cost more than the average?" first needs the average, then the comparison. The inner question is answered first.',
'coffee','SELECT name, price FROM products WHERE price > (SELECT AVG(price) FROM products) ORDER BY price;','The brackets hold a complete SELECT that returns one value.',
'Show the <b>name</b> of products that cost <b>more than the average price</b>.','SELECT name FROM products WHERE price > (SELECT AVG(price) FROM products)',
[['A scalar subquery returns...','One value','Many tables','Nothing','It is a single value.'],['<code>WHERE id IN (SELECT ...)</code> checks...','Whether id is in the inner list','The sort order','The table size','IN compares with a list.'],['Which runs first?','The inner query','The outer query','Neither','The outer needs the inner result.']]);

L('L26','Intermediate',P4,'Subqueries in FROM and SELECT',
'A subquery in FROM is a temporary table (give it an alias). A scalar subquery in SELECT adds one value to every row. Both can be tidier as a CTE (lesson 29).',
'Counting first, then ranking the counts: you first make a small summary sheet, then work from that sheet.',
'coffee','SELECT t.customer_id, t.n FROM (SELECT customer_id, COUNT(*) AS n FROM orders GROUP BY customer_id) t WHERE t.n >= 8 ORDER BY t.n DESC;','The inner query is named t so the outer one can use it.',
'Using a subquery in FROM, show <b>customer_id</b> and <b>n</b> where the customer\'s order count <b>n is at least 9</b>.','SELECT t.customer_id, t.n FROM (SELECT customer_id, COUNT(*) AS n FROM orders GROUP BY customer_id) t WHERE t.n >= 9',
[['A subquery in FROM must have...','An alias','A semicolon inside','An ORDER BY','Derived tables need a name.'],['A scalar subquery in SELECT returns...','One value per outer row','A whole table','Nothing','One value is attached to each row.'],['Which is usually more readable for long queries?','A CTE','Deep nesting','Repeating the query','CTEs give each step a name.']]);

L('L27','Intermediate',P4,'EXISTS and NOT EXISTS',
'EXISTS asks "is there at least one matching row?". It stops at the first match, which is fast, and it does not duplicate rows like a join can. NOT EXISTS finds rows with no match.',
'"Do we have any order from this customer?" is EXISTS. You do not need to count them, only to find one.',
'coffee','SELECT name FROM customers c WHERE EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.id AND o.status = \'cancelled\');','The inner query refers to the outer row c, which is called a correlated subquery.',
'Show the <b>name</b> of customers with <b>no orders</b>, using NOT EXISTS.','SELECT name FROM customers c WHERE NOT EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.id)',
[['EXISTS returns true when...','The inner query finds at least one row','The inner query finds nothing','The table is empty','It tests for any row.'],['A correlated subquery...','Uses a column from the outer query','Has no WHERE','Runs only once ever','It depends on the outer row.'],['Which is safer than NOT IN when NULLs may exist?','NOT EXISTS','NOT IN','NOT LIKE','NOT IN with a NULL in the list returns nothing.']]);

L('L28','Intermediate',P4,'UNION, UNION ALL, INTERSECT and EXCEPT',
'Set operators stack the results of two queries that have the same number of columns. UNION removes repeats, UNION ALL keeps all rows (faster), INTERSECT keeps common rows, EXCEPT keeps rows in the first but not the second.',
'Two guest lists for two parties. UNION is everyone invited at all (once). INTERSECT is the people on both lists. EXCEPT is on list A but not list B.',
'coffee',"SELECT name FROM products WHERE category = 'Coffee' UNION SELECT name FROM products WHERE price < 30 ORDER BY name;",'Columns are matched by position, not by name.',
'Show names of products priced under 30 <b>EXCEPT</b> those in the <b>Food</b> category.',"SELECT name FROM products WHERE price < 30 EXCEPT SELECT name FROM products WHERE category = 'Food'",
[['UNION ALL versus UNION?','UNION ALL keeps duplicates and is faster','UNION ALL removes duplicates','They are identical','UNION does extra work to remove repeats.'],['What must match between the two queries?','Number of columns (and compatible types)','The table names','The WHERE clauses','Columns are lined up by position.'],['EXCEPT returns...','Rows in the first query but not the second','Rows in both','All rows','It subtracts the second from the first.']]);

L('L29','Advanced',P4,'CTEs: WITH makes queries readable',
'A CTE (common table expression) is a named temporary result you define with WITH and then use like a table. You can chain several. It does not store anything on disk.',
'Writing your working on separate labelled sheets (monthly totals, then average of those) instead of one giant page.',
'coffee',"WITH monthly AS (SELECT strftime('%Y-%m', order_date) AS month, SUM(qty) AS cups FROM orders GROUP BY month) SELECT month, cups FROM monthly WHERE cups > (SELECT AVG(cups) FROM monthly) ORDER BY month;",'monthly is used twice: once to list and once to average.',
'Using a CTE named <b>t</b> of order counts per customer, show <b>customer_id</b> where <b>n &gt; 8</b>.','WITH t AS (SELECT customer_id, COUNT(*) AS n FROM orders GROUP BY customer_id) SELECT customer_id FROM t WHERE n > 8',
[['A CTE starts with...','WITH','CTE','TEMP','WITH name AS (...).'],['Does a CTE store data permanently?','No, it exists only for that query','Yes in a new table','Yes in a view','It is temporary.'],['Why use CTEs?','They name each step and make long queries readable','They are always faster','They change data','Readability is the main gain.']]);

L('L30','Advanced',P4,'Recursive CTEs: trees and sequences',
'A recursive CTE has a starting query, then a step that refers to itself, combined with UNION ALL. It repeats until the step returns nothing. Use it for org charts, category trees and generated date lists.',
'Walking up from a driver to their boss, then the boss\'s boss, until you reach the managing director.',
'hr','WITH RECURSIVE chain(id, name, lvl) AS (SELECT id, name, 0 FROM employees WHERE manager_id IS NULL UNION ALL SELECT e.id, e.name, chain.lvl + 1 FROM employees e JOIN chain ON e.manager_id = chain.id) SELECT * FROM chain ORDER BY lvl, id LIMIT 10;','Level 0 is the top. Each loop adds the next level down.',
'Show the <b>number of employees</b> below the top level (lvl &gt; 0) in the chain, as <b>n</b>. Use the same recursive CTE.','WITH RECURSIVE chain(id, lvl) AS (SELECT id, 0 FROM employees WHERE manager_id IS NULL UNION ALL SELECT e.id, chain.lvl + 1 FROM employees e JOIN chain ON e.manager_id = chain.id) SELECT COUNT(*) AS n FROM chain WHERE lvl > 0',
[['A recursive CTE has...','A start part and a part that refers to itself','Two unrelated queries','No SELECT','Anchor plus recursive step.'],['What stops the recursion?','The step returns no new rows','A timer','LIMIT only','It ends when there is nothing more to add.'],['Which problem suits recursion?','An org chart','A simple sum','Sorting names','Hierarchies of unknown depth.']]);
})();
