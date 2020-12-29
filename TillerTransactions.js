const ACCOUNT_NAME = "Simple - Shared"
const SHEET_TRANSACTIONS = "Transactions"
const IS_LIVE = true
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

  for (let i = 0; i < rangeValues.length; i++){
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
      let new_category = CATEGORY_MAP[TransactionHelpers.getExpenseCategory(matched_transaction)]
      Logger.log(new_category)
      if (IS_LIVE){
        sheet.getRange(i+1,IX_CATEGORY+1).setValue(new_category)
      }
    } else {
      Logger.log(rangeValues[i])
      Logger.log("no match")
    }
  }
}
