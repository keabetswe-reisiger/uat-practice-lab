/* Original practice questions (not from any official exam). Format: Q(topic, level, question, correct answer, [three wrong answers], explanation).
   The correct answer is stored first and the page shuffles the options each time. */
window.DS_Q=window.DS_Q||[];
(function(){const Q=(t,l,q,c,w,why)=>DS_Q.push({t,l,q,c,w,why});
/* ---- Foundations ---- */
const F='Foundations';
Q(F,'B',`A café wants to know whether rainy days change flat white sales. What should happen first?`,`State the question and decide what data would answer it`,[`Build a neural network on every column in the till`,`Buy a bigger screen so the charts will look better`,`Delete the oldest sales so that the file is smaller`],`A clear question tells you which data and methods are worth using. Tools and models come after.`);
Q(F,'B',`In the usual data science workflow, cleaning happens`,`After collecting the data and before modelling`,[`Only after the final report has been sent to the owner`,`Before any data exists, so that it will arrive tidy`,`Only if a model fails badly during the testing stage`],`Raw data almost always has gaps and errors, so it is cleaned before analysis and modelling.`);
Q(F,'B',`Which column holds categorical data?`,`Branch name`,[`Price in rand`,`Cups sold`,`Minutes waiting`],`A branch name names a group. The other three are measured or counted numbers.`);
Q(F,'B',`Cup size recorded as small, medium or large is`,`Ordinal`,[`Continuous`,`Discrete numeric`,`Free text`],`The sizes are categories with a natural order, which is the definition of ordinal.`);
Q(F,'B',`The number of customers entering in an hour is`,`Discrete`,[`Continuous`,`Nominal`,`Ordinal`],`Customers are counted in whole numbers, so the data is discrete.`);
Q(F,'B',`Waiting time measured in seconds is best called`,`Continuous`,[`Nominal`,`Ordinal`,`Discrete categorical`],`Time can take any value in a range, so it is continuous.`);
Q(F,'B',`In tidy data each row is`,`One observation`,[`One variable`,`One table`,`One chart`],`Tidy data puts one observation in each row and one variable in each column.`);
Q(F,'B',`A table has 4 drinks and 6 monthly columns. In long form it has`,`24 rows`,[`10 rows`,`6 rows`,`4 rows`],`Each drink and month pair is one row, and 4 times 6 equals 24.`);
Q(F,'I',`Which statement about the data science workflow is most accurate?`,`Steps are often repeated as you learn more about the data`,[`It must always be followed strictly in one pass`,`Modelling always comes first`,`Communication is optional`],`Findings later in a project often send you back to cleaning or collection.`);
Q(F,'B',`A dataset is`,`A collection of data, often a table of rows and columns`,[`A kind of chart that shows rows of numbers over time`,`A statistical test used to compare two group means`,`A programming language used for cleaning data in tables`],`A dataset is simply the collected data you analyse.`);
Q(F,'I',`Why is a phone number stored as a number, such as 0821234567, a poor choice?`,`It is an identifier, so arithmetic is meaningless and leading zeros can be lost`,[`Phone numbers are too long for any spreadsheet to hold`,`Numbers take far longer to sort than any text does`,`Storing it that way makes the table tidier and smaller`],`Identifiers should be stored as text. You never add or average phone numbers.`);
Q(F,'B',`An insight is most useful when it`,`Changes a decision or action`,[`Contains many numbers`,`Uses complex methods`,`Is shown in 3D`],`The value of analysis is the decision it improves.`);
Q(F,'I',`Which is an example of a variable that is NOT numeric?`,`Payment method (cash, card, voucher)`,[`Cups sold during a single morning shift`,`Price of one flat white in rand and cents`,`Temperature outside the shop in degrees Celsius`],`Payment method is a category. The others are numbers.`);
Q(F,'I',`A column of dates written as text strings such as "02/03/2026" should usually be`,`Converted to a proper date type`,[`Left as text for sorting`,`Averaged`,`Deleted`],`A date type lets you sort, group by month and compute differences correctly.`);
/* ---- Descriptive statistics ---- */
const S='Descriptive statistics';
Q(S,'B',`What is the mean of 2, 4, 6 and 8?`,`5`,[`4`,`6`,`20`],`The sum is 20 and there are 4 values, so the mean is 5.`);
Q(S,'B',`What is the median of 3, 9, 1, 7 and 5?`,`5`,[`7`,`1`,`3`],`Sorted: 1, 3, 5, 7, 9. The middle value is 5.`);
Q(S,'B',`What is the median of 2, 4, 6 and 10?`,`5`,[`4`,`6`,`10`],`With an even count, average the two middle values: (4 + 6) / 2 = 5.`);
Q(S,'B',`The mode of 2, 3, 3, 4, 3, 5 is`,`3`,[`2`,`4`,`5`],`3 appears three times, more than any other value.`);
Q(S,'B',`Data: 10, 12, 11, 13, 90. Which description of the centre is more typical?`,`The median, 12`,[`The mean, 27.2`,`The range, 80`,`The sum, 136`],`The extreme value 90 pulls the mean up. The median of 12 describes a normal value.`);
Q(S,'B',`The range of 4, 9, 2, 12 and 7 is`,`10`,[`12`,`2`,`6.8`],`Largest minus smallest: 12 minus 2 equals 10.`);
Q(S,'I',`For 2, 4, 4, 4, 5, 5, 7, 9 the population standard deviation is`,`2`,[`4`,`5`,`32`],`The sum of squared distances from the mean 5 is 32. Divided by 8 that is 4, and the square root is 2.`);
Q(S,'I',`Why do we use n minus 1 when computing a sample variance?`,`A sample tends to understate the spread of the population`,[`To make the calculation quicker on a very large sample`,`Because n is always one too large in a real dataset`,`To remove the outliers from the sample before summing`],`Dividing by n minus 1 corrects the bias that comes from using the sample mean.`);
Q(S,'I',`Two datasets have the same mean. The one with the larger standard deviation`,`Has values spread further from the mean`,[`Has a larger mean, even though both means are equal`,`Has no outliers, because spread rules those out`,`Is more accurate, since variation measures accuracy`],`Standard deviation measures typical distance from the mean.`);
Q(S,'I',`Q1 = 20 and Q3 = 32. The IQR is`,`12`,[`52`,`26`,`6`],`IQR is Q3 minus Q1, which is 12.`);
Q(S,'I',`Q1 = 20, Q3 = 32. By the 1.5 times IQR rule, the upper fence is`,`50`,[`44`,`38`,`32`],`1.5 times 12 is 18, and 32 plus 18 equals 50.`);
Q(S,'I',`A value of 55 with fences 2 and 50 is`,`An outlier by the 1.5 IQR rule`,[`Inside the fences`,`The median`,`Definitely an error`],`It is above the upper fence. It still needs investigating before you decide what to do.`);
Q(S,'B',`The 50th percentile is the same as the`,`Median`,[`Mean`,`Mode`,`Range`],`Half the values lie below the median.`);
Q(S,'I',`A right-skewed distribution typically has`,`Mean greater than median`,[`Mean less than median`,`Mean equal to mode always`,`No tail`],`A long tail of large values pulls the mean above the median.`);
Q(S,'I',`Daily sales are 40, 45, 50, 55, 210. Which change would barely move the median?`,`Doubling 210 to 420`,[`Changing 50 to 500`,`Removing 45`,`Changing 40 to 60`],`The median is the middle value, so changing the extreme value does not shift it.`);
Q(S,'A',`Adding a constant of 10 to every value in a dataset`,`Raises the mean by 10 and leaves the standard deviation unchanged`,[`Raises both the mean and the standard deviation by 10`,`Leaves the mean unchanged and raises the spread by 10`,`Doubles the variance but leaves the mean where it was`],`Shifting every value moves the centre but not the spread.`);
/* ---- Probability ---- */
const P='Probability';
Q(P,'B',`The probability of drawing a red card from a standard deck (26 red out of 52) is`,`0.5`,[`0.26`,`0.25`,`2`],`26 divided by 52 equals 0.5.`);
Q(P,'B',`P(rain) = 0.2. P(no rain) is`,`0.8`,[`0.2`,`1.2`,`0`],`The complement is 1 minus 0.2.`);
Q(P,'B',`A probability can never be`,`Greater than 1`,[`Exactly 0`,`Exactly 1`,`0.5`],`Probabilities run from 0 (impossible) to 1 (certain).`);
Q(P,'B',`Two independent events have probabilities 0.4 and 0.5. The chance that both happen is`,`0.2`,[`0.9`,`0.45`,`0.1`],`For independent events multiply: 0.4 times 0.5 equals 0.2.`);
Q(P,'I',`A coin is flipped twice. The chance of two heads is`,`0.25`,[`0.5`,`0.75`,`1`],`0.5 times 0.5 equals 0.25.`);
Q(P,'I',`The chance of at least one head in two flips is`,`0.75`,[`0.25`,`0.5`,`1`],`It is 1 minus the chance of no heads, which is 1 minus 0.25.`);
Q(P,'I',`3 of 20 cups are returned. The probability that a random cup is returned is`,`0.15`,[`0.3`,`0.85`,`3`],`3 divided by 20 equals 0.15.`);
Q(P,'I',`Events that cannot both happen at once are called`,`Mutually exclusive`,[`Independent`,`Conditional`,`Complementary only`],`If one occurs, the other cannot, so they are mutually exclusive.`);
Q(P,'A',`P(A) = 0.5, P(B) = 0.4, and they are mutually exclusive. P(A or B) is`,`0.9`,[`0.2`,`0.1`,`0.45`],`For mutually exclusive events add the probabilities: 0.5 plus 0.4.`);
Q(P,'A',`A test is 90% accurate for people who have a condition. This tells you directly that`,`Nothing yet about how likely a positive person has the condition without the base rate`,[`Exactly 90% of the people who test positive truly have it`,`That nobody with the condition is ever missed by the test`,`That the test makes no mistakes for healthy people either`],`The chance a positive result is real also depends on how common the condition is, which is the base rate.`);
Q(P,'I',`Rolling a fair die, the probability of an even number is`,`0.5`,[`1/6`,`1/3`,`2/3`],`Three of the six faces are even, so 3 divided by 6.`);
Q(P,'A',`Conditional probability P(A given B) means`,`The chance of A once B is known to have happened`,[`The chance of A and B happening together at once`,`The chance of B happening, with no reference to A`,`The chance that neither of the two events happens`],`It narrows the world to the cases where B occurred.`);
/* ---- Distributions and sampling ---- */
const D='Distributions and sampling';
Q(D,'I',`In a normal distribution, about what share of values lie within 2 standard deviations of the mean?`,`95%`,[`68%`,`99.7%`,`50%`],`The empirical rule gives about 68%, 95% and 99.7% for 1, 2 and 3 standard deviations.`);
Q(D,'I',`Mean 50, SD 8. The z-score of 66 is`,`2`,[`16`,`1.5`,`8`],`(66 minus 50) divided by 8 equals 2.`);
Q(D,'I',`A z-score of -1 means the value is`,`One standard deviation below the mean`,[`One whole unit below the mean, in the original units`,`Impossible, because z-scores can never be negative`,`Exactly equal to the mean of the whole dataset`],`The sign shows the direction and the size counts standard deviations.`);
Q(D,'I',`A random sample is one in which`,`Every member has a fair chance of being chosen`,[`The largest values are chosen`,`Only volunteers appear`,`People are chosen by the researcher`],`Random selection protects against systematic bias.`);
Q(D,'I',`Surveying only customers who stay for a second visit risks`,`Survivorship bias`,[`Perfect coverage`,`Random error only`,`No bias`],`Those who left after the first visit are missing, and they may think differently.`);
Q(D,'I',`SD 20 and n = 100. The standard error of the mean is`,`2`,[`20`,`0.2`,`200`],`20 divided by the square root of 100 equals 2.`);
Q(D,'I',`To halve the standard error you need`,`Four times as many observations`,[`Twice as many observations as the study used before`,`Half as many observations as the study used before`,`The same number of observations measured twice over`],`The standard error shrinks with the square root of n.`);
Q(D,'A',`The central limit theorem says that`,`Sample means tend towards a normal distribution as n grows`,[`All real-world data is normally distributed already`,`Small samples always give the exact population mean`,`The mean and the median are always equal in any data`],`Averages of many independent observations are approximately normal, even if the data is not.`);
Q(D,'I',`Income data is usually described as`,`Right-skewed`,[`Left-skewed`,`Perfectly symmetrical`,`Uniform`],`A few very high incomes create a long tail to the right.`);
Q(D,'I',`A larger sample generally`,`Reduces random sampling error`,[`Removes all bias`,`Increases the standard error`,`Makes the mean change sign`],`More data lowers the standard error, but it cannot fix a biased way of choosing the sample.`);
Q(D,'A',`Which sample is least representative of all visitors to a mall?`,`People asked outside one shop at 10 am on a Tuesday`,[`Every 50th visitor through all entrances across the week`,`A random selection of till slips`,`A random sample of Wi-Fi log-ins`],`A single shop and time slot excludes most visitors, which creates selection bias.`);
Q(D,'B',`A histogram is used to show`,`The distribution of one numerical variable`,[`The relationship between two categories`,`Change in a single total over time only`,`The order of events`],`It counts how many values fall in each range.`);
})();
