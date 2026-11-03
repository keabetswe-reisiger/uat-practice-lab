window.WORKPLACE=window.WORKPLACE||[];
WORKPLACE.push(
{
 "id": "devtools",
 "title": "Browser DevTools for testers",
 "intro": "DevTools is a toolbox built into your browser that lets you look behind the page you see. These lessons use Chrome-style DevTools; Firefox is similar, with the same panels under slightly different names.",
 "lessons": [
  {
   "t": "Opening DevTools and the Elements panel",
   "plain": "DevTools opens with F12 or Ctrl+Shift+I (Cmd+Option+I on a Mac), or by right-clicking any part of a page and choosing Inspect. The Elements panel shows the page's HTML structure and the CSS rules applied to each piece. You can edit text and styles there to try things out, but the change only lives in your browser until you refresh. Nothing is saved on the server.",
   "coffee": "Inspecting a page is like lifting the counter flap to see how the barista actually builds the cup. Editing the text is like writing a different name on a takeaway cup to see how it looks, without changing the real menu.",
   "steps": [
    "Open any web page in Chrome or Firefox and press F12.",
    "Click the small arrow icon at the top left of DevTools (Select element), then click a button or heading on the page.",
    "In the Elements panel, double-click the highlighted text and type something new. Watch the page change.",
    "On the right, find the Styles area, untick a CSS rule or change a colour value and see the effect.",
    "Press F5 to refresh and confirm that your edits disappear."
   ],
   "code": "Shortcuts\nF12 or Ctrl+Shift+I   open or close DevTools\nCtrl+Shift+C           pick an element on the page\nF5                     reload (your temporary edits vanish)",
   "tryit": "Open order.html in this app (or any page of it), press F12, and use the Select element arrow to click a button. Change its text to something very long, such as 'Place my order right now please', and see whether the layout still looks fine. Take a screenshot as if it were bug evidence.",
   "quiz": [
    {
     "q": "You edit a heading's text in the Elements panel and then refresh the page. What happens?",
     "o": [
      "The page reloads and your edit is gone",
      "The change is saved on the server for everyone",
      "The change stays until you clear your cookies",
      "The browser asks the developer to approve the edit"
     ],
     "a": 0,
     "why": "Elements edits only change the copy of the page in your browser's memory. Refreshing loads the page again from the server, so the edit disappears. It is never sent to the server, never tied to cookies, and needs no approval."
    },
    {
     "q": "Which is a good use of editing text in the Elements panel?",
     "o": [
      "Fixing a bug permanently for customers",
      "Changing the price a customer will be charged",
      "Deleting a faulty feature from the app",
      "Checking how the layout copes with a very long name or message"
     ],
     "a": 3,
     "why": "Temporary edits are a quick way to test how a layout handles long or odd text. They cannot fix, charge, or remove anything for real, because the server is untouched."
    },
    {
     "q": "What does the Select element (arrow) tool do?",
     "o": [
      "Selects text so you can copy it to a report",
      "Takes a screenshot of the whole page",
      "Lets you click something on the page and jumps to its HTML in the Elements panel",
      "Selects the next failing test case"
     ],
     "a": 2,
     "why": "The tool links what you see to its code, so you can inspect exactly that item. It does not copy text, take screenshots, or have anything to do with test cases."
    }
   ]
  },
  {
   "t": "Console: reading errors and warnings",
   "plain": "The Console tab is where the page and the browser write messages. Red entries are errors, yellow ones are warnings, and plain ones are information. A red error usually points to a file and line number, which developers use to find the cause. As a tester you do not need to fix it, but you should copy the message into your bug report.",
   "coffee": "The Console is like the grinder's error beeps and the till's warning lights. You may not repair the machine, but telling the technician exactly which light flashed saves hours.",
   "steps": [
    "Open DevTools and click the Console tab.",
    "Reload the page with the Console open so you catch messages from page load.",
    "Look for red entries (errors) and yellow ones (warnings). Click the small arrow beside an error to expand it.",
    "Note the message text and the file name and line number on the right.",
    "Right-click inside the Console and choose Save as, or select and copy the text, to paste into a bug report."
   ],
   "code": "Typical messages\nUncaught TypeError: Cannot read properties of null\nFailed to load resource: the server responded with a status of 404\nGET https://example.com/api/orders 500 (Internal Server Error)",
   "tryit": "Open api-lab.html in this app with the Console open. Press Send on a request, then look for any red or yellow messages. Write down one message exactly as shown, plus what you clicked just before it appeared.",
   "quiz": [
    {
     "q": "In the Console, what does a red entry normally mean?",
     "o": [
      "The page loaded perfectly",
      "An error occurred that is worth investigating",
      "The page uses a red colour theme",
      "The browser is out of date"
     ],
     "a": 1,
     "why": "Red marks errors, which are real problems such as failed requests or broken scripts. It is about the message level, not the page colour, speed, or browser version."
    },
    {
     "q": "You see a red error while testing but the page seems to work. What should you do?",
     "o": [
      "Ignore it because the page works",
      "Delete it from the Console",
      "Refresh until it goes away and say nothing",
      "Report it with the message text, because it may cause problems in other situations"
     ],
     "a": 3,
     "why": "Hidden errors often cause failures later or on other devices, so they are worth reporting with the exact text. Ignoring or hiding them removes the evidence developers need."
    },
    {
     "q": "Why reload the page while the Console is already open?",
     "o": [
      "It captures messages produced while the page is loading",
      "It makes the page faster",
      "It clears the server's cache",
      "It changes red errors to yellow warnings"
     ],
     "a": 0,
     "why": "Many errors happen during load, before you could open DevTools by hand. Opening first means those messages are recorded. Reloading does not speed anything up or change severity."
    }
   ]
  },
  {
   "t": "Network tab: requests, status codes, response body, timing",
   "plain": "The Network tab lists every request the page makes to a server, such as fetching an order list or sending a payment. Each row shows a status code (200 means OK, 404 not found, 500 server error), the size, and the time taken. Click a row to see what was sent and what came back in the Response tab. Tick Preserve log so rows are not cleared when the page navigates to another page.",
   "coffee": "The Network tab is the order slip trail between the till and the kitchen. Each slip shows what was asked, what came back, and how long it took. If the kitchen sends back 'we have no such item', that is a 404.",
   "steps": [
    "Open DevTools and click the Network tab.",
    "Tick Preserve log so your list survives page changes.",
    "Do an action on the page, for example press a Send or Submit button.",
    "Click the new row. Read the Status, then open the Headers, Payload and Response tabs.",
    "Look at the Time column to spot slow requests, and use the filter box or the Fetch/XHR button to hide image and style files."
   ],
   "code": "Status code cheat sheet\n200 OK            request worked\n201 Created       something new was saved\n400 Bad Request   the request was wrong or incomplete\n401 / 403         not logged in / not allowed\n404 Not Found     the thing does not exist\n500 Server Error  the server broke",
   "tryit": "Open api-lab.html with the Network tab open and Preserve log ticked. Press Send and find the request row. Write down its status code, the time it took, and the first line of the response body. Then try sending something invalid and compare the status code.",
   "quiz": [
    {
     "q": "A request row shows status 500. What does that most likely mean?",
     "o": [
      "The page took 500 milliseconds",
      "The item was not found",
      "The server hit an error while handling the request",
      "The user is not logged in"
     ],
     "a": 2,
     "why": "The 5xx range means the server failed, so 500 is a server error. Timing is shown in the Time column, not the status. Not found is 404 and not logged in is 401."
    },
    {
     "q": "Why would a tester tick Preserve log?",
     "o": [
      "To make requests faster",
      "To keep earlier requests visible after the page navigates or reloads",
      "To hide failed requests",
      "To save the log to the server"
     ],
     "a": 1,
     "why": "Without it the list clears whenever the page changes, so you could lose the request that failed. It does not affect speed, hide anything, or upload data."
    },
    {
     "q": "Where would you look to see exactly what data the server sent back?",
     "o": [
      "The Response tab of the selected request",
      "The Elements panel only",
      "The Lighthouse report",
      "The browser's bookmarks"
     ],
     "a": 0,
     "why": "The Response (or Preview) tab shows the body returned by that request. Elements shows the page's HTML, Lighthouse scores quality, and bookmarks are unrelated."
    }
   ]
  },
  {
   "t": "Application tab: localStorage and cookies",
   "plain": "The Application tab (called Storage in Firefox) shows data the page keeps inside your browser. localStorage holds saved values such as a basket or settings and stays until cleared. Cookies are small pieces of data sent to the server with requests, often used to keep you logged in. Testers inspect these to check what is stored, to clear data for a clean start, and to simulate a fresh user.",
   "coffee": "localStorage is like the notepad a barista keeps by the machine with a regular's usual order. Cookies are like the loyalty card you hand over each visit so they know who you are.",
   "steps": [
    "Open DevTools and click the Application tab (Storage in Firefox).",
    "In the left list expand Local storage and click the site address. Read the keys and values.",
    "Double-click a value to edit it, then reload the page and see if the app copes with it.",
    "Expand Cookies and look at names, expiry dates and the Secure and HttpOnly columns.",
    "Right-click the site entry and choose Clear to reset, then reload to test the first-time-visitor experience."
   ],
   "code": "Quick console checks\nlocalStorage.getItem('key')   read one saved value\nlocalStorage.clear()          wipe saved values for this site\ndocument.cookie               list cookies readable by the page",
   "tryit": "Use any page of this app that saves your progress. Open Application, then Local storage, and find the keys the app created. Change one value to something odd (such as empty text), reload, and note whether the app handles it or breaks. Then clear storage and see what a brand new user would see.",
   "quiz": [
    {
     "q": "You want to test the experience of a brand-new visitor on a site you have used before. What is a good step?",
     "o": [
      "Buy a new computer",
      "Only refresh with F5",
      "Rename the browser",
      "Clear the site's local storage and cookies, then reload"
     ],
     "a": 3,
     "why": "The saved data is what makes the site recognise you, so clearing it gives a fresh start. A plain refresh keeps that data, and hardware or browser names are irrelevant."
    },
    {
     "q": "What is a cookie mainly used for?",
     "o": [
      "Making images load faster only",
      "Writing the page's HTML",
      "Storing small data that is sent to the server, such as a login session",
      "Counting how many tests you have run"
     ],
     "a": 2,
     "why": "Cookies travel with requests, which is why they suit login sessions. They are not for speeding up images, they are not the page code, and they know nothing about your test count."
    },
    {
     "q": "If you edit a localStorage value to something invalid and the app crashes, what does that tell you?",
     "o": [
      "Nothing, because users never do that",
      "The app may not handle unexpected stored data, which is worth reporting",
      "Your browser is broken",
      "The server is down"
     ],
     "a": 1,
     "why": "Real data can become corrupted or old, so a crash is a resilience weakness. Dismissing it assumes perfect data, and the failure came from your edit, not from the browser or server."
    }
   ]
  },
  {
   "t": "Responsive and device mode for compatibility testing",
   "plain": "Device mode (the phone-and-tablet icon, Ctrl+Shift+M) resizes the page to simulate phones, tablets and narrow windows. You can also pick a throttling speed to imitate slow mobile data. It is a fast first check for layout problems such as text cut off, buttons overlapping, or horizontal scrolling. It is only a simulation, so important findings should be confirmed on a real device.",
   "coffee": "Device mode is like checking whether your menu board is readable both from the front of the shop and from across the street. It helps a lot, but you still walk outside to confirm.",
   "steps": [
    "Open DevTools and press Ctrl+Shift+M to toggle device mode.",
    "Choose a device from the dropdown at the top, for example a small phone, or drag the page edges to resize.",
    "Click the rotate icon to test landscape and portrait.",
    "Scroll through the whole page and look for cut-off text, overlapping buttons, or sideways scrolling.",
    "Set the throttling dropdown to a slow connection and reload to see how it behaves on slow data."
   ],
   "code": "Common widths to try\n360 px   small phone\n768 px   tablet portrait\n1280 px  laptop",
   "tryit": "Open order.html in this app in device mode at a 360 px width. Check that every button can be reached and read, and note any sideways scrolling. Then rotate to landscape and compare. Write one finding with the screen width as part of the environment.",
   "quiz": [
    {
     "q": "What is device mode best described as?",
     "o": [
      "A real phone connected by cable",
      "A way to hack other devices",
      "A replacement for all real-device testing",
      "A simulation of screen size and sometimes network speed"
     ],
     "a": 3,
     "why": "It imitates screen sizes and conditions inside your browser. It is not a real device and cannot replace real-device checks for things like touch feel and performance."
    },
    {
     "q": "At a narrow phone width you notice you must scroll sideways to read the page. Is this worth reporting?",
     "o": [
      "Yes, it is a layout problem on small screens",
      "No, scrolling is always fine",
      "Only if the page is blue",
      "Only if the server is slow"
     ],
     "a": 0,
     "why": "Sideways scrolling on mobile usually means content does not fit the screen, which hurts usability. Colour and server speed are unrelated to that problem."
    },
    {
     "q": "Why include the screen width in a bug report environment?",
     "o": [
      "It makes the report look longer",
      "Developers only fix widths above 1000 px",
      "The bug may only appear at that size, so developers need it to reproduce",
      "It changes the severity automatically"
     ],
     "a": 2,
     "why": "Layout bugs are often size-specific, so the width is needed to reproduce them. Length for its own sake is no use, developers fix by impact not width, and severity is a human decision."
    }
   ]
  },
  {
   "t": "Lighthouse and basic accessibility checks",
   "plain": "Lighthouse is a built-in tool (the Lighthouse tab in Chrome) that scans a page and scores Performance, Accessibility, Best practices and SEO, with a list of what to improve. For accessibility it can spot things like low colour contrast, images without alt text, and form fields without labels. An automated score is only a starting point because it cannot judge everything, so also try using the page with only the keyboard.",
   "coffee": "Lighthouse is like a health inspector's checklist walking through your shop: it catches the obvious problems fast, but you still need to taste the coffee yourself.",
   "steps": [
    "Open DevTools and click the Lighthouse tab (it may be under the double arrow menu).",
    "Choose Accessibility (and Performance if you like) and a Mobile or Desktop mode.",
    "Click Analyze page load and wait for the report.",
    "Read the failed items and click each to see which element is affected.",
    "Separately, press Tab repeatedly to check you can reach every button and see where focus is."
   ],
   "code": "Quick keyboard test\nTab          move to the next control\nShift+Tab    move back\nEnter/Space  activate a button\nEsc          close a pop-up",
   "tryit": "Run Lighthouse on order.html in this app with Accessibility ticked. Note the score and the first issue it lists. Then use Tab only, with no mouse, to move through the page and write down any control you cannot reach or cannot see focus on.",
   "quiz": [
    {
     "q": "A page scores 100 for accessibility in Lighthouse. What is the safest conclusion?",
     "o": [
      "The page is perfectly accessible for everyone",
      "The automated checks found no issues, but manual checks are still needed",
      "The page will never have bugs",
      "The page is fast on all phones"
     ],
     "a": 1,
     "why": "Automated tools only catch a portion of accessibility problems. A full score does not guarantee usability for everyone, bug-freeness, or speed, which is a separate score."
    },
    {
     "q": "Which is a typical accessibility problem Lighthouse can detect?",
     "o": [
      "Low contrast between text and background",
      "A confusing business rule",
      "A slow supplier",
      "A typo in the invoice PDF"
     ],
     "a": 0,
     "why": "Contrast ratios can be measured automatically. Business rules, suppliers and PDFs are outside what a page scan can judge."
    },
    {
     "q": "Why test with only the Tab key?",
     "o": [
      "Because mice are banned",
      "To speed up the page",
      "To find server errors",
      "To check people who cannot use a mouse can reach and use every control"
     ],
     "a": 3,
     "why": "Keyboard users and some assistive tools depend on tabbing, so every control must be reachable. It is not about bans, speed or server errors."
    }
   ]
  }
 ]
},
{
 "id": "git",
 "title": "Git and GitHub for testers",
 "intro": "Developers store their work in Git and share it on GitHub, so knowing the basics helps you understand what changed and what to retest. You cannot run Git inside this app, so try these commands in a real free GitHub account on your own computer.",
 "lessons": [
  {
   "t": "What version control is",
   "plain": "Version control records every change made to a project, who made it, and when, so you can go back to any earlier version. Git is the most popular tool for this, and GitHub is a website that stores Git projects online so teams can share them. Each project is called a repository, often shortened to repo. Note that you cannot run Git inside this app, so create a free GitHub account and practise there.",
   "coffee": "Think of a recipe book that keeps every previous version of every recipe, with a note of who changed the milk ratio and why. If a new recipe tastes bad, you can open the old page and compare.",
   "steps": [
    "Go to github.com and create a free account.",
    "Click New repository, give it a name such as practice-testing, tick Add a README, and create it.",
    "Open the README file on GitHub and click History to see the list of saved changes.",
    "Install Git from git-scm.com if you want to work on your own computer.",
    "Run the check below to confirm Git is installed."
   ],
   "code": "git --version     shows the installed Git version, proving it works\ngit config --global user.name \"Your Name\"      tells Git who you are\ngit config --global user.email \"you@example.com\"  your email for commits",
   "tryit": "This app cannot run Git, so do this in a real free GitHub account: create a repository called practice-testing, then open its README and click History to see the first saved change. Note the author, date and message.",
   "quiz": [
    {
     "q": "What is the main purpose of version control?",
     "o": [
      "To make the app run faster",
      "To write test cases automatically",
      "To record changes over time so earlier versions can be recovered and compared",
      "To hide bugs from users"
     ],
     "a": 2,
     "why": "Version control keeps a history of changes. It does not speed up the app, write test cases, or hide anything."
    },
    {
     "q": "What is the difference between Git and GitHub?",
     "o": [
      "They are the same thing",
      "Git is the tool that tracks changes, GitHub is a website that hosts Git projects online",
      "GitHub is a programming language",
      "Git is a website and GitHub is the tool"
     ],
     "a": 1,
     "why": "Git is software on your computer that tracks changes, while GitHub is an online service for storing and sharing those projects. Neither is a programming language."
    },
    {
     "q": "What is a repository?",
     "o": [
      "A single bug report",
      "A type of web browser",
      "A testing metric",
      "A project folder along with its full change history"
     ],
     "a": 3,
     "why": "A repo holds the project files and the history of changes to them. It is not a bug report, a browser, or a metric."
    }
   ]
  },
  {
   "t": "Clone and pull",
   "plain": "Cloning copies a whole repository from GitHub onto your computer for the first time. Pulling later fetches the newest changes from GitHub into your copy. Testers pull before testing so they are checking the latest version, not an old one. Running these needs a terminal and Git installed, so practise on your own computer with a real GitHub account.",
   "coffee": "Cloning is photocopying the whole recipe book for your own shop. Pulling is checking each morning whether head office added new pages, and copying those in.",
   "steps": [
    "On GitHub, open your repo, click the green Code button and copy the HTTPS link.",
    "Open a terminal on your computer in a folder where you keep projects.",
    "Run the clone command with your link.",
    "Move into the new folder with cd, then run git status.",
    "Later, run git pull to fetch new changes before you test."
   ],
   "code": "git clone https://github.com/YOUR-NAME/practice-testing.git   copy the repo to your computer\ncd practice-testing    move into the project folder\ngit status             show if anything differs from GitHub\ngit pull               fetch and merge the newest changes",
   "tryit": "This app cannot run Git. In a real GitHub account, edit the README on the GitHub website, then on your computer run git pull inside your clone and confirm the new text appears in your local README file.",
   "quiz": [
    {
     "q": "When do you use git clone?",
     "o": [
      "The first time, to copy a repository from GitHub to your computer",
      "Every time you want to save a change",
      "To delete a repository",
      "To write a bug report"
     ],
     "a": 0,
     "why": "Clone makes your first local copy. Saving changes is done with commit, and it neither deletes repositories nor writes reports."
    },
    {
     "q": "Why should a tester run git pull before testing?",
     "o": [
      "To delete old test cases",
      "To log in to GitHub",
      "To make sure they test the latest version of the code",
      "To change the colour of the app"
     ],
     "a": 2,
     "why": "Pulling brings your copy up to date, so you do not report bugs already fixed. It does not delete tests, log you in, or alter the app's look."
    },
    {
     "q": "What does git status tell you?",
     "o": [
      "How many users the app has",
      "Whether your local files differ from the last saved state",
      "The server's response time",
      "Which bugs are critical"
     ],
     "a": 1,
     "why": "Status lists changed, new or staged files in your working copy. It has no information about users, timing, or bug severity."
    }
   ]
  },
  {
   "t": "Branches",
   "plain": "A branch is a separate line of work inside a repository, so a developer can build a new feature without disturbing the main version. The main branch is usually called main. When the work is ready it is merged back in. Testers often test on a feature branch to check work before it reaches main, so you need to know how to switch branches.",
   "coffee": "A branch is like testing a new cappuccino recipe on a side counter. The main counter keeps serving the proven recipe until the new one is approved and moved across.",
   "steps": [
    "Inside your cloned project, run git branch to list branches; the current one has a star.",
    "Create a new practice branch with git switch -c and a name.",
    "Make a small edit to a file and save it.",
    "Run git status to see your change on that branch.",
    "Switch back to main and notice the edit is not there."
   ],
   "code": "git branch                      list branches\ngit switch -c test/my-practice  create and move to a new branch\ngit switch main                 go back to the main branch\ngit switch feature-login        move to an existing branch to test it",
   "tryit": "This app cannot run Git. In a real clone, create a branch named test/my-practice, change a line in README, run git status, then switch to main and confirm the change is not visible there. Note what that shows about branches.",
   "quiz": [
    {
     "q": "Why do developers work on branches?",
     "o": [
      "To build and change things without disturbing the main version",
      "To make the repository bigger",
      "To avoid writing code",
      "Because GitHub requires it for logins"
     ],
     "a": 0,
     "why": "Branches isolate work in progress. They are not about size, avoiding code, or logins."
    },
    {
     "q": "You are told a bug fix is on branch fix-receipt. What do you do before testing it?",
     "o": [
      "Test main and hope",
      "Delete the branch",
      "Create a new empty repo",
      "Switch to the fix-receipt branch (after pulling) and test there"
     ],
     "a": 3,
     "why": "The fix only exists on that branch, so you must be on it and up to date. Testing main would not include the fix, and deleting or recreating removes the work."
    },
    {
     "q": "Which command creates a new branch and moves to it?",
     "o": [
      "git pull",
      "git status",
      "git switch -c new-branch-name",
      "git clone"
     ],
     "a": 2,
     "why": "The -c option creates the branch while switching. Pull fetches changes, status reports, and clone copies a repo."
    }
   ]
  },
  {
   "t": "Commits and good commit messages",
   "plain": "A commit is a saved snapshot of your changes with a message explaining what and why. You first stage the files you want to include with git add, then commit them. A good message is short, specific, and in the present tense, for example 'Add test cases for checkout discount'. Vague messages like 'stuff' or 'fixed' make history useless for everyone, including testers.",
   "coffee": "A commit message is the label on a recipe change, like 'Reduce sugar in latte syrup from 20 ml to 15 ml'. 'Changed recipe' tells nobody anything.",
   "steps": [
    "Edit or add a file in your practice repo, such as a new test-cases.txt.",
    "Run git status to see it listed as changed or untracked.",
    "Stage it with git add followed by the file name.",
    "Commit with git commit -m and a clear message in quotes.",
    "Run git log --oneline and find your commit at the top."
   ],
   "code": "git add test-cases.txt                        stage a file for the next commit\ngit commit -m \"Add login test cases for wrong password\"   save a snapshot with a message\ngit log --oneline                             show a short list of commits\n\nGood:  Add 5 test cases for empty basket checkout\nBad:   update   /   fixed stuff   /   asdf",
   "tryit": "This app cannot run Git. In your real practice repo, create test-cases.txt with three lines of your own test ideas, stage and commit it with a clear message, then run git log --oneline and read your commit back.",
   "quiz": [
    {
     "q": "Which commit message is best?",
     "o": [
      "changes",
      "Fix wrong total when two discounts are applied",
      "fixed it",
      "asdf"
     ],
     "a": 1,
     "why": "It says what was fixed and in which situation. The others say nothing useful, so nobody could tell later what changed."
    },
    {
     "q": "What does git add do?",
     "o": [
      "Saves permanently to GitHub",
      "Deletes files",
      "Creates a branch",
      "Stages chosen changes so they are included in the next commit"
     ],
     "a": 3,
     "why": "Add prepares changes for a commit; it does not upload them, delete anything, or branch."
    },
    {
     "q": "After git commit, is your work already on GitHub?",
     "o": [
      "No, it is saved on your computer until you push",
      "Yes, instantly",
      "Yes, but only for admins",
      "Only if the message is long"
     ],
     "a": 0,
     "why": "A commit is local. Sharing it on GitHub needs git push, regardless of who you are or how long the message is."
    }
   ]
  },
  {
   "t": "Push and pull requests",
   "plain": "Pushing uploads your local commits to GitHub. A pull request, or PR, is a request on GitHub asking the team to review your branch and merge it into main. People can comment on specific lines and approve or ask for changes. Testers may add test files through PRs, and often read PRs to see what developers changed so they know what to retest.",
   "coffee": "Pushing is sending your new recipe page to head office. A pull request is asking the head barista to read it, comment, and approve it before it goes into the official recipe book.",
   "steps": [
    "On your practice branch, make sure your changes are committed.",
    "Run git push with -u origin and your branch name for the first push.",
    "Open your repo on GitHub and click the yellow Compare & pull request banner.",
    "Write a clear title and a short description of what changed and how to test it.",
    "Click Create pull request and then look at the Files changed tab."
   ],
   "code": "git push -u origin test/my-practice    upload your branch to GitHub\n\nPull request description template\nWhat changed: Added test cases for checkout\nHow to check: Open test-cases.txt\nAnything risky: none",
   "tryit": "This app cannot run Git. In a real GitHub repo, push your practice branch, open a pull request into main, and write a description. Do not merge it yet; open the Files changed tab and read what GitHub highlights.",
   "quiz": [
    {
     "q": "What does git push do?",
     "o": [
      "Downloads other people's changes",
      "Deletes your branch",
      "Uploads your local commits to GitHub",
      "Runs all tests"
     ],
     "a": 2,
     "why": "Push sends commits upward to the remote repository. Downloading is pull, and push neither deletes branches nor runs tests."
    },
    {
     "q": "What is a pull request for?",
     "o": [
      "Asking for a salary rise",
      "Asking the team to review your branch and merge it into another branch",
      "Pulling the app off the store",
      "Downloading the repo"
     ],
     "a": 1,
     "why": "A PR starts review and merging. It has nothing to do with salaries, app stores, or downloading."
    },
    {
     "q": "As a tester, why read a pull request's description and changed files?",
     "o": [
      "To see what changed and decide what to retest",
      "To fix typos only",
      "To grade the developer",
      "Because it is required to log in"
     ],
     "a": 0,
     "why": "PRs show exactly which areas were touched, guiding your retesting. Typos, grading and logins are not the tester's purpose here."
    }
   ]
  },
  {
   "t": "Reading a diff and commit history",
   "plain": "A diff shows exactly which lines were added (green, with a plus sign) and removed (red, with a minus sign) between two versions. The commit history lists changes in order with author, date and message. Testers use both to find which areas changed, which tells them what to retest and which risks to focus on. You do not need to understand all the code, just the files and features touched.",
   "coffee": "A diff is the marked-up recipe page showing which amounts were crossed out and which were written in. If only the syrup changed, you taste-test the drinks that use syrup first.",
   "steps": [
    "On GitHub open a repo and click Commits to see the history list.",
    "Click one commit to see its diff, with red removed lines and green added lines.",
    "Note the file names changed; ask which features they belong to.",
    "On your computer run git log --oneline, then git show on a commit id.",
    "Compare two branches with git diff and decide which test cases to rerun."
   ],
   "code": "git log --oneline              short history of commits\ngit show abc1234               show one commit's changes\ngit diff main..feature-login   compare two branches\n\n- total = price + tax\n+ total = price + tax - discount     (red line removed, green line added)",
   "tryit": "This app cannot run Git. In your real practice repo, make two commits that change a line, then open the second commit on GitHub and read its diff. Write one sentence saying what changed and which test you would run again.",
   "quiz": [
    {
     "q": "In a diff, what does a green line starting with a plus sign mean?",
     "o": [
      "A line that was deleted",
      "A line with an error",
      "A line that was tested",
      "A line that was added"
     ],
     "a": 3,
     "why": "Green plus lines are additions. Deleted lines are red with a minus sign, and colours do not indicate errors or testing."
    },
    {
     "q": "A commit only changes the receipt printing file. What is a sensible retest focus?",
     "o": [
      "The entire company",
      "Nothing, ever",
      "Receipt printing and anything that depends on it",
      "Only the login page"
     ],
     "a": 2,
     "why": "Risk-based retesting targets the changed area and its neighbours. Retesting nothing risks missing bugs, and unrelated areas like login are low priority for this change."
    },
    {
     "q": "What does git log --oneline give you?",
     "o": [
      "The server's error log",
      "A short list of past commits with their messages",
      "A list of failed tests",
      "A copy of the app"
     ],
     "a": 1,
     "why": "It prints one line per commit with an id and message. It is not a server log, a test result list, or an app copy."
    }
   ]
  }
 ]
},
{
 "id": "docs",
 "title": "Test documents you will be asked to write",
 "intro": "Testers communicate through documents: plans, cases, bug reports, matrices and summaries. Each lesson gives a plain template you can copy and fill in, using a coffee-ordering app as the example.",
 "lessons": [
  {
   "t": "The test plan",
   "plain": "A test plan says what you will test, what you will not test, how, who does it, when, and what counts as finished. It aligns the team before testing starts, so nobody is surprised. Keep it short and clear; a one-page plan that people read beats a long one nobody opens.",
   "coffee": "A test plan is like the opening checklist for a new coffee shop: what we will check, who checks the machines, by what time, and when we agree we are ready to open the doors.",
   "steps": [
    "Write the goal in one sentence.",
    "List what is in scope and out of scope.",
    "Decide the types of testing and the devices or browsers.",
    "Name who tests and the dates.",
    "Write entry and exit criteria, meaning when testing can start and when it is done."
   ],
   "code": "TEST PLAN: Coffee Ordering App v1.0\nGoal: Check customers can browse, order and pay correctly.\nIn scope: browse menu, add to basket, checkout, order status\nOut of scope: supplier ordering, staff payroll\nApproach: manual functional testing, basic accessibility, mobile browser check\nEnvironments: Chrome and Firefox on laptop, Android phone\nPeople: Kea (tester), dev lead for questions\nDates: 10 to 14 Nov\nEntry: build deployed to test site and test data loaded\nExit: all high-priority cases pass, no open critical bugs\nRisks: late builds, test payment service unavailable",
   "tryit": "Open order.html in this app and use it as your example app. Copy the template and fill it in for what you can see on that page. Make sure you list at least one thing out of scope.",
   "quiz": [
    {
     "q": "What is the purpose of exit criteria in a test plan?",
     "o": [
      "To list the testers' names",
      "To describe the app's colour",
      "To record bug ids",
      "To say when testing can be considered finished"
     ],
     "a": 3,
     "why": "Exit criteria define done. Names belong in the people section, colours are design, and bug ids are in the bug tracker."
    },
    {
     "q": "Why list what is out of scope?",
     "o": [
      "To avoid misunderstandings about what will not be tested",
      "To waste space",
      "To lower the quality bar secretly",
      "Because plans must be long"
     ],
     "a": 0,
     "why": "Stating exclusions sets expectations so nobody assumes untested areas are safe. It is not filler or a hidden way to cut quality."
    },
    {
     "q": "Which test plan is better for a beginner team?",
     "o": [
      "A 200-page plan nobody reads",
      "No plan, just start",
      "A clear one-page plan that people actually read",
      "A plan with only dates"
     ],
     "a": 2,
     "why": "A concise plan is read and used. An unread plan has no value, no plan leaves confusion, and dates alone say nothing about what or how."
    }
   ]
  },
  {
   "t": "The test case",
   "plain": "A test case is one specific check, written so anyone can run it and get the same result. It has an ID, a title, preconditions (what must be true first), numbered steps, and an expected result. Good test cases are small, clear and test one thing. Write the expected result before you run it so you are not influenced by what you see.",
   "coffee": "A test case is like a recipe card for a quality check: 'Pour the espresso, add 150 ml milk, taste: should be sweet, not bitter.' Anyone following it gets the same answer.",
   "steps": [
    "Give it a unique ID and a short title.",
    "Write preconditions, such as being logged in or having an item in the basket.",
    "Write numbered steps, one action each.",
    "Write the expected result clearly and measurably.",
    "Leave space for actual result and Pass or Fail when you run it."
   ],
   "code": "ID: TC-012\nTitle: Remove item from basket updates the total\nPreconditions: user has 2 items in the basket\nSteps:\n 1. Open the basket page\n 2. Click Remove on the first item\nExpected result: item disappears and total is recalculated to the remaining item only\nActual result: (fill in when run)\nStatus: Pass / Fail\nTested by / date:",
   "tryit": "Open order.html in this app. Write two test cases for the basket or ordering feature on it: one normal case and one that uses an empty or invalid value. Use the template and include the preconditions.",
   "quiz": [
    {
     "q": "What is a precondition?",
     "o": [
      "A bug found before testing",
      "What must be true before the steps begin",
      "The final result",
      "A person's job title"
     ],
     "a": 1,
     "why": "Preconditions set up the starting state, such as being logged in. They are not bugs, results, or roles."
    },
    {
     "q": "Which expected result is best?",
     "o": [
      "Basket total shows R45.00 after removing the R20.00 item from R65.00",
      "It works",
      "Looks fine",
      "Should be OK"
     ],
     "a": 0,
     "why": "It is specific and checkable. The others are vague, so two testers could disagree about whether they passed."
    },
    {
     "q": "Why write the expected result before running the test?",
     "o": [
      "It makes the test faster",
      "Developers demand it",
      "It lets you skip the steps",
      "To avoid being influenced by what you see on screen"
     ],
     "a": 3,
     "why": "Deciding in advance keeps you honest about what is right. Speed, demands from others, and skipping steps are not the reason."
    }
   ]
  },
  {
   "t": "The bug report",
   "plain": "A bug report tells a developer exactly what is wrong so they can reproduce and fix it. It has a clear title, the environment, numbered steps, expected result, actual result, severity, and evidence like a screenshot. One bug per report, no blame, and just facts. A great report saves hours of back-and-forth.",
   "coffee": "A bug report is like telling the technician: 'Grinder 2, on the morning shift, when I press double shot the burr jams after 5 seconds. Here is a video.' Not just 'the grinder is broken'.",
   "steps": [
    "Reproduce the bug at least twice and note the exact steps.",
    "Write a title that says what and where, not just 'It broke'.",
    "Record the environment: browser and version, device, app version, and user type.",
    "Write expected versus actual result in plain words.",
    "Attach a screenshot or short recording and the Console or Network message if there is one."
   ],
   "code": "Title: Basket total does not update after removing an item\nEnvironment: Chrome 130, Windows 11, test site build 1.0.3, logged-in customer\nSteps:\n 1. Add Latte and Muffin to basket\n 2. Open basket\n 3. Click Remove on Latte\nExpected: total shows the Muffin price only\nActual: total still shows the price of both items\nSeverity: Medium (wrong amount shown; the final charge is unaffected)\nEvidence: screenshot basket-total.png, Console shows no errors",
   "tryit": "Open api-lab.html in this app, send a request that gives an error or an odd result, and write a bug report using the template. Include the status code from the Network tab as evidence.",
   "quiz": [
    {
     "q": "Which is the best bug title?",
     "o": [
      "Broken",
      "Please fix urgently!!!",
      "Basket total not updated after removing an item",
      "Developer made a mistake"
     ],
     "a": 2,
     "why": "It names the feature and the symptom. The others are vague, emotional, or blame someone instead of describing the problem."
    },
    {
     "q": "Why include the environment in a report?",
     "o": [
      "To make the report longer",
      "The bug may depend on the browser, device or version, so developers need it to reproduce",
      "To impress the manager",
      "It is only for the tester"
     ],
     "a": 1,
     "why": "Many bugs only occur in certain setups, so the environment is a clue. It is not for length or show, and developers use it too."
    },
    {
     "q": "What should a bug report's steps be like?",
     "o": [
      "A short guess",
      "A long story about your day",
      "Only 'try it yourself'",
      "Numbered, one action each, so anyone can repeat them"
     ],
     "a": 3,
     "why": "Clear numbered steps allow the bug to be reproduced. Guesses, stories and invitations to explore do not."
    }
   ]
  },
  {
   "t": "The traceability matrix",
   "plain": "A traceability matrix is a table linking each requirement to the test cases that check it. It shows at a glance whether every requirement has at least one test and which requirements failed. It also helps when a requirement changes, because you can see which tests to update. Gaps in the table, where a requirement has no test, are the most useful finding.",
   "coffee": "It is like a checklist linking each menu promise, such as 'every cup is ready in 5 minutes', to the checks you do for it. If a promise has no check, you could be promising something you never verify.",
   "steps": [
    "List each requirement with an ID, such as REQ-01.",
    "List your test cases with IDs, such as TC-01.",
    "Draw a table with requirements down the side and the linked test cases next to each.",
    "Add a status column using the latest results.",
    "Look for requirements with no test case and fix the gap."
   ],
   "code": "Req ID | Requirement                          | Test cases    | Status\nREQ-01 | Customer can add an item to basket   | TC-01, TC-02  | Pass\nREQ-02 | Customer can remove an item          | TC-03         | Fail\nREQ-03 | Order total is calculated correctly  | TC-04, TC-05  | Pass\nREQ-04 | Customer sees order status           | (none yet)    | Not covered",
   "tryit": "Write four requirements for the ordering page in order.html in this app, in your own words. Then write the test case ids that would cover them and find at least one requirement that currently has no test.",
   "quiz": [
    {
     "q": "What does a traceability matrix link together?",
     "o": [
      "Requirements and test cases",
      "Testers and developers",
      "Bugs and salaries",
      "Browsers and phones"
     ],
     "a": 0,
     "why": "It maps requirements to the tests that check them. The other pairings are not what the matrix is for."
    },
    {
     "q": "A requirement row shows no test cases. What does this mean?",
     "o": [
      "It is fully tested",
      "It can be ignored",
      "It is a coverage gap and needs a test",
      "It has passed"
     ],
     "a": 2,
     "why": "With no test the requirement is unchecked, so you cannot know if it works. It is neither tested, ignorable, nor passed."
    },
    {
     "q": "A requirement changes. How does the matrix help?",
     "o": [
      "It automatically fixes the code",
      "It shows which test cases may need updating",
      "It deletes old requirements",
      "It emails the customer"
     ],
     "a": 1,
     "why": "Because tests are linked to the requirement, you can find them quickly. The matrix does not change code or send messages."
    }
   ]
  },
  {
   "t": "The test summary report",
   "plain": "A test summary report tells managers the outcome of testing in plain words: what was tested, the results, open bugs, risks, and your recommendation. Managers want to decide whether to release, so start with the conclusion, then support it with numbers. Be honest, brief and clear, and avoid jargon.",
   "coffee": "It is the end-of-day shop report to the owner: how many orders, what went wrong, what needs fixing tomorrow, and whether you recommend opening the new branch on Monday.",
   "steps": [
    "Start with a one-sentence conclusion and recommendation.",
    "Give simple numbers: tests run, passed, failed, blocked.",
    "List open bugs by severity, naming the most important ones.",
    "State risks and anything not tested.",
    "End with what you need from the manager, such as a decision or time."
   ],
   "code": "TEST SUMMARY: Coffee Ordering App build 1.0.3\nRecommendation: Do not release yet; one high-severity bug open.\nScope tested: browse, basket, checkout, order status (Chrome, Firefox, Android)\nResults: 40 run, 34 passed, 4 failed, 2 blocked\nOpen bugs: 1 High (payment fails on Android), 2 Medium, 3 Low\nNot tested: supplier ordering (out of scope), very slow networks\nRisks: Android payment fix is not yet verified\nNext step: retest after fix, expected 2 days",
   "tryit": "Imagine you have tested order.html in this app. Write a summary for the owner using the template: invent realistic numbers, but clearly mark them as example numbers, and give a recommendation in the first line.",
   "quiz": [
    {
     "q": "Where should the recommendation go in a summary for a manager?",
     "o": [
      "At the start, followed by the supporting numbers",
      "At the very end after pages of detail",
      "Nowhere",
      "Only in a separate email"
     ],
     "a": 0,
     "why": "Managers need the conclusion first to make a decision. Burying it or omitting it defeats the purpose."
    },
    {
     "q": "Which statement is good plain wording?",
     "o": [
      "Defect density exceeded the threshold per KLOC",
      "Stuff is bad",
      "Everything is probably fine",
      "One serious bug stops customers paying on Android, so I suggest waiting"
     ],
     "a": 3,
     "why": "It is specific, clear and gives advice. The jargon line is unclear for most managers, and the others are vague or unsupported."
    },
    {
     "q": "Why mention what was not tested?",
     "o": [
      "To look lazy",
      "To make the report longer",
      "So the manager knows the remaining risk",
      "Because it is a rule to list five items"
     ],
     "a": 2,
     "why": "Untested areas are unknown risk, so the reader should be told. It is not about looks, length, or number rules."
    }
   ]
  },
  {
   "t": "Test data and exploratory test charters",
   "plain": "Test data is the information you type or load to run tests, and good data includes normal values, boundaries, empty values and awkward ones. A charter is a short mission for exploratory testing, where you learn and test at the same time without fixed steps. It states what to explore, with what approach, and what to find, usually in a time box of 30 to 90 minutes. Take notes as you go.",
   "coffee": "Test data is the ingredients you use to check a drink: normal milk, no milk, a huge order. A charter is telling a trainee barista, 'For 30 minutes, explore what happens when orders are changed after paying, and write down anything odd.'",
   "steps": [
    "For each field list a normal value, the smallest and largest allowed values, an empty value and an invalid value.",
    "Never use real customers' personal data; invent test data.",
    "Write a charter in one sentence using Explore, With, To discover.",
    "Set a time box, such as 45 minutes.",
    "During the session note what you tried, what you found, and questions; turn findings into bug reports."
   ],
   "code": "TEST DATA for 'Quantity' (allowed 1 to 10)\nNormal: 3   Boundaries: 1, 10   Just outside: 0, 11\nEmpty: (blank)   Invalid: -2, abc, 2.5\n\nCHARTER\nExplore: the basket and checkout\nWith: odd quantities, quick double-clicks, and going back and forward in the browser\nTo discover: wrong totals, duplicate orders, or confusing messages\nTime box: 45 minutes\nNotes: (record what you tried and found)",
   "tryit": "Open order.html in this app and run a 20-minute exploratory session using the charter template. Write down at least five different inputs you tried and note anything surprising.",
   "quiz": [
    {
     "q": "A Quantity field accepts 1 to 10. Which set best covers boundaries?",
     "o": [
      "5 only",
      "0, 1, 10, 11",
      "100, 200, 300",
      "3, 4, 5"
     ],
     "a": 1,
     "why": "Bugs often occur at the edges, so you test just inside and just outside the limits. A single middle value or random large values miss the edges."
    },
    {
     "q": "What is an exploratory test charter?",
     "o": [
      "A fixed script with exact steps and results",
      "A legal contract",
      "A list of passed tests",
      "A short mission and time box that guides testing while you learn"
     ],
     "a": 3,
     "why": "A charter gives direction without scripting every step. It is not a rigid script, a contract, or a results list."
    },
    {
     "q": "Which is the best choice of test data for a customer name?",
     "o": [
      "Invented names, including one with an apostrophe and a very long one",
      "A real customer's name copied from the database",
      "Only the letter A",
      "No data at all"
     ],
     "a": 0,
     "why": "Invented data protects privacy, and unusual names reveal handling problems. Real personal data is a privacy risk, and a single letter or nothing covers too little."
    }
   ]
  }
 ]
}
);
