var budgetController = (function() {
  
})();

//UI controller
var UIcontroller = (function() {
  // Some code -- collect neccesary fields

  var DOMstring = {
    inputType: '.add__type',
    inputDescription: '.add__description',
    inputValue: '.add__value',
    inputButton: '.add__btn'
  }

    return {
      getInput: function() {
        return {
          //type: document.querySelector('.add__type').value, //inc /exp
          type: document.querySelector(DOMstring.inputType).value, //inc /exp
          description: document.querySelector(DOMstring.inputDescription).value,
          value: document.querySelector(DOMstring.inputValue).value
        };
      },
      getDOMstrings: function() {
        return DOMstring;
      }
    }
})();


//GLOBAL APP controller //btn
var controller = (function(budgetCtrl, UICtrl) {
  
  var DOM = UIcontroller.getDOMstrings();
  
  var ctrlAddItem = function() {
    
    // 1. Get the field input data
    var input = UICtrl.getInput();
    
    // 2. Add the item to the budget controller
    
    // 3. Add the item to the UI
    
    // 4. Calculate the budget
    
    // 5. Display budget on the UI

  }

  document.querySelector(DOM.inputButton).addEventListener('click', ctrlAddItem);
 

  document.addEventListener('keypress', function(event) {
    if(event.keyCode === 13 || event.which ===13) {}
    //console.log(event.key === 'Enter');
    ctrlAddItem();
})

})(budgetController, UIcontroller);