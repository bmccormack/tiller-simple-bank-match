// **** SETUP VARIABLES  ****

const ACCOUNT_NAME = "Simple - Shared" // The name of your Simple account in Tiller
const SHEET_TRANSACTIONS = "Transactions" // The name of your Transactions spreadsheet in Tiller.
// map Simple categories to Tiller expenses.
const CATEGORY_MAP = {
  "🛍 Shopping": "Shopping",
  "🎄Christmas" : "Christmas",
  "🎓 Education" : "Kids Education",
  "💗 Generosity Fund" : "Giving",
  "🍓 Groceries" : "Groceries",
  "👕 Kids Clothing" : "Kids Clothing",
  "🌮 Restaurants": "Restaurants",
  "": "Safe to Spend (Shared)"
}
// Some transactions, like transfers, may not map to expenses in Simple. If
// a key in this map matches a transaction's Full Description, this category
// will be used instead of the CATEGORY_MAP above.
const DESCRIPTION_CATEGORY_OVERRIDE = {
  "Transfer from Chase Checking" : "Transfer"
}

// **** RUNTIME VARIABLES ****

const IS_LIVE = false // if true, will update the category when the script is run. Set to false for a dry run.
const ONE_AT_A_TIME = false // if true, will only process one transaction at a time. Helpful when testing.
const START_AT_ROW = 1 // 1-based row numbers, like in the spreadsheet. Use to start go to a specific row.

// This is the function that updates the Transactions spreadsheet.
function parseTransactions() {
  let ss = SpreadsheetApp.getActiveSpreadsheet()
  let sheet = ss.getSheetByName(SHEET_TRANSACTIONS)
  
  let rangeValues = sheet.getDataRange().getValues()

  const IX_CATEGORY = 3
  const IX_DATE = 1
  const IX_AMOUNT = 4
  const IX_ACCOUNT = 5
  const IX_DESCRIPTION = 2 //not used; transaction names only match full description, which is sometimes different
  const IX_FULL_DESCRIPTION = 12

  let simple_transactions = new Transactions()

  for (let i = START_AT_ROW - 1; i < rangeValues.length; i++){
    let date = rangeValues[i][IX_DATE]
    let category = rangeValues[i][IX_CATEGORY]
    let full_description = rangeValues[i][IX_FULL_DESCRIPTION]
    let amount = rangeValues[i][IX_AMOUNT]
    let account = rangeValues[i][IX_ACCOUNT]

    //only update transactions if the category is empty and the account name
    //matches the account we wish to update  
    if(category !== "" || account !== ACCOUNT_NAME){
      continue;
    }

    let matched_transaction = simple_transactions.findTransaction(full_description, date, amount)

    if (matched_transaction){
      Logger.log(rangeValues[i])
      Logger.log("matched!")
      Logger.log(matched_transaction)

      let new_category = null

      if (full_description in DESCRIPTION_CATEGORY_OVERRIDE){
        new_category = DESCRIPTION_CATEGORY_OVERRIDE[full_description]
      } else {
        new_category = CATEGORY_MAP[TransactionHelpers.getExpenseCategory(matched_transaction)]
      }

      Logger.log(new_category)
      if (IS_LIVE){
        sheet.getRange(i+1,IX_CATEGORY+1).setValue(new_category)
      }
    } else {
      Logger.log(rangeValues[i])
      Logger.log("no match")
    }

    if (ONE_AT_A_TIME) {break;}
  }
}
