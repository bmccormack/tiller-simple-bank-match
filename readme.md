Do you use [Simple](https://www.simple.com/) bank to manage expenses and 
[Tiller](https://www.tillerhq.com/) to keep up with your finances? This 
Google Apps Script code is intended to help update transaction categories
in your Google spreadsheet budget with Expense information from Simple.

## Before you begin

This is intended for individuals with basic coding abilities and an existing
familiarity with Google Apps Script. You'll need to be familiar with editing
code in the Google Apps Script editor and executing functions from there.

## Steps to update transactions

### Tiller spreadsheet: Initial setup

You should already have a Tiller budget spreadsheet with accounts added,
transactions pulled, etc.. You'll need transactions that match your bank
account in Simple that do not yet have a category assigned to them.

1. In your Google spreadsheet, go to **Tools > Script editor** in the menu.
2. In the Google Apps Script editor, add the following files (the `.gs` 
   extension will be added automatically):
   - TillerTransactions.gs
   - SimpleTransactions.gs
   - JSON_simple.gs
3. Copy the code from this repository to the corresponding files in the Google
   Apps Script editor.
4. In TillerTransactions.gs, edit the following data:
   - `ACCOUNT_NAME` should match the name of your Simple account as it shows up
     in the Transactions spreadsheet.
   - `SHEET_TRANSACTIONS` is the name of your Transactions spreadsheet.
   - `CATEGORY_MAP`- Update this to map your Simple categories to your Simple
     Expense names. NOTE: Expenses from "Safe to Spend" in Simple will not have
     an expense. Map the empty string `""` to the appropriate category in your
     Tiller budget.
   - `DESCRIPTION_CATEGORY_OVERRIDE` - Some transactions, like transfers, may 
     not map to expenses in Simple. If a key in this map matches a transactions 
     Full Description, this category will be used instead of the `CATEGORY_MAP`.


### Simple: Downloading transactions

1. Log in to your Simple account in the web browser
2. Go to **Activity** and view your transactions.
3. Hover over the Download icon (next to "List" and "Graph") and choose
   "Export as JSON".
4. Open this file in a text editor on your computer.

### Tiller spreadsheet: Importing transactions

1. Copy the contents of the JSON export from Simple to your clipboard.
2. In the Google Apps Script editor, open JSON_simple.gs.
3. Replace `{}` with the entire contents of the JSON export from Simple.

### Tiller spreadsheet: Executing the script

1. In the Google Apps Script editor, open TillerTransactions.gs.
2. Optionally, you can change the following variables at run time, which 
   can be useful when you're getting started.
   - `IS_LIVE`: When `false`, will run the script without updating the 
   spreadsheet.
   - `ONE_AT_A_TIME`: When `true`, will only process a single row. 
   - `START_AT_ROW`: The 1-based row number to start at. When used with
      `ONE_AT_A_TIME`, can be used to update a single row.
3. In the Google Apps Script editor, run the function `parseTransactions`
4. You can view the execution logs in Google Apps Script to see which
   transcations did or did not match.

## Etc.

- This script matches based on *Expense* data in Simple, not *category*
  data in Simple.
- Date matching is done based on `when_received` in Simple, which appears to
  match with the transaction date in the Tiller spreadsheet.
- Sometimes the data downloaded from Tiller doesn't match what's in Simple.
  From what I can tell, this is due to certain data being obfuscated in the
  transaction description (potentially attempting to remove sensitive data?).
  At this time, there's not a workaround for these types of transactions.
- You can potentially use 
  [Clasp](https://developers.google.com/apps-script/guides/clasp) to maintain
  the files in Google Apps Script.