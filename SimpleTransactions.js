// copy the whole JSON file of Simple transactions to JSON_simple.gs, after `const TRANSACTIONS = `

class Transactions {
  constructor(){
    this.data = TRANSACTIONS["transactions"];
  }

  findTransaction(description, date, amount){
    let date_string = TransactionHelpers.getStringFromDate(date)

    for (let i = 0; i < this.data.length; i++){
      let transaction = this.data[i]
      let transx_description = transaction["description"]
      let transx_amount = TransactionHelpers.getAmountAsDecimal(transaction)
      let transx_date = TransactionHelpers.getWhenReceivedDate(transaction)
      let transx_date_string = TransactionHelpers.getStringFromDate(transx_date)


      if (description == transx_description 
          && date_string == transx_date_string
          && Math.abs(amount) == transx_amount){
        
        return transaction
      }    
    }

    return null
  }
}

class TransactionHelpers {
  static getAmountAsDecimal(obj_transaction){
    let int_amount = obj_transaction["amounts"]["amount"]
    return int_amount / 10000.0
  }

  static getWhenReceivedDate(obj_transaction){
    return new Date(obj_transaction["times"]["when_received"])
  }

  static getStringFromDate(dt){
    let month = dt.getMonth() + 1
    return "" + dt.getFullYear()  + "-" + month + "-" + dt.getDate()
  }

  static getExpenseCategory(obj_transaction){
    //Simple saves expense info as "goal" info, and if there is no expense
    //category (i.e. it's "Safe to Spend"), there won't be an associated_goal_info
    //key. Make sure the CATEGORY_MAP includes an entry for an empty string.
    if (!("associated_goal_info" in obj_transaction)){
      return ""
    }

    return obj_transaction["associated_goal_info"]["name"]
  }
}





