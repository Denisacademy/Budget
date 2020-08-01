var budgetController = (function() {
  
  var Expense = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  var Income = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  var calculateTotal = function(type) {
    var sum = 0;
    data.allItems[type].forEach(function(cur) {
      sum += cur.value;
    });
    data.totals[type] = sum;
  };

  var data = {
    allItems: {
      exp: [],  //new item
      inc: []
    },
    totals: {
      exp: 0,
      inc: 0
    },
    budget: 0,
    percentage: -1// doens`t exist at this point 
  }

  return {
    addItem : function(type, des, val) {
      var newItem, ID;

      //create new ID
      if(data.allItems[type].length > 0) {
        ID = data.allItems[type][data.allItems[type].length-1].id + 1;

      } else {
        ID = 0;
      } 

      //Create new item   based on type inc or exp
      if(type === 'exp') {
        newItem = new Expense(ID, des, val);
      } else if(type === "inc") {
        newItem = new Income(ID, des, val);
      }
      
      //push it into our data structure
      data.allItems[type].push(newItem);
      
      //return the new elem
      return newItem;
    },

    calculateBudget: function() {

      // calculate total income and expenses
      calculateTotal('exp');
      calculateTotal('inc');

      // calculate the budget: income - expenses
      data.budget = data.totals.inc - data.totals.exp;
      // calculate the percentage of income that we spent
      if(data.totals.inc > 0) {
        data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100); 
        //Expense = 100 and income 300, spent 33.33% = 100 / 300 = 0.333 * 100
      } else {
        data.percentage = -1;
      }
    },
    getBudget: function() {
      return {
        budget: data.budget,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp,
        percentage: data.percentage
      }
    },

    testing: function() {
      console.log(data);
    }
  };

})();

//UI controller====***
var UIcontroller = (function() {
  // Some code -- collect neccesary fields

  var DOMstrings = {  //short way
    inputType: '.add__type',
    inputDescription: '.add__description',
    inputValue: '.add__value',
    inputButton: '.add__btn',
    incomeContainer: '.income__list',
    expensesContainer: '.expenses__list',
    budgetLabel: '.budget__value',
    incomeLabel: '.budget__income--value',
    expensesLabel: '.budget__expenses--value',
    percentageLabel: '.budget__expenses--percentage',
    container: '.container'


  }
  //console.log(DOMstrings);
    return {
      getInput: function() {
        return {
          //type: document.querySelector('.add__type').value, //inc /exp
          type: document.querySelector(DOMstrings.inputType).value, //inc /exp
          description: document.querySelector(DOMstrings.inputDescription).value,
          value: parseFloat(document.querySelector(DOMstrings.inputValue).value)//string to number
        };
      },

      addListItem: function(obj, type) {  //==obj from constructor (exp and inc)============ Make HTML
        var html, newHtml, element;

        // Create HTML string with placeholder text
        if(type === "inc") {
          element = DOMstrings.incomeContainer;
          html = `<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div>
          <div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>`
        } else if(type === "exp") {
            element = DOMstrings.expensesContainer;
            html = `<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div>
            <div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>`
        }


        // Replace placeholder text with some actual data
        newHtml = html.replace('%id%', obj.id);  // regexp - регулярка типа
        newHtml = newHtml.replace('%description%', obj.description);
        newHtml = newHtml.replace('%value%', obj.value);

        // Insert the HTML into the DOM
        document.querySelector(element).insertAdjacentHTML('beforeend', newHtml); // element is a container either exp or inc
      },

      clearFields: function() {//document.querySelectorAll('.add__description , .add__value')
        var fields, fieldsArr;

        fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);

        fieldsArr = Array.prototype.slice.call(fields);//make array form dom elements

        fieldsArr.forEach(function(current, index) {
          current.value = "";
        });

        fieldsArr[0].focus();// after adding item to clear fileds and set focus on description

      },

      displayBudget: function(obj) {
        //debugger
        document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
        document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalInc;
        document.querySelector(DOMstrings.expensesLabel).textContent = obj.totalExp;
        document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage;

        if(obj.percentage > 0) {
          document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + "%";
        } else {
          document.querySelector(DOMstrings.percentageLabel).textContent = "---"; //show _ if there is only expenses

        }

      },

      getDOMstrings: function() {
        return DOMstrings;
      }
    }
})();


//GLOBAL APP controller===*** //btn
var controller = (function(budgetCtrl, UICtrl) {
  
  var setupEventListeners = function() { //?????
    var DOM = UICtrl.getDOMstrings(); //get input and el button document
    
    document.querySelector(DOM.inputButton).addEventListener('click', ctrlAddItem); //btn add
 
    document.addEventListener('keypress', function(event) { //alternat add item
      if(event.keyCode === 13 || event.which === 13) {
        ctrlAddItem();//console.log(event.key === 'Enter');
      } 
    });

    document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);//catch event on the element clicked (buble)

  };
 
  var updateBudget = function() {
    // 1. Calculate the budget
    budgetCtrl.calculateBudget();
    
    // 2. return the budget
    var budget = budgetController.getBudget();
    
    // 3. Display budget on the UI
    console.log(budget);
    UICtrl.displayBudget(budget);
  };

  
  var ctrlAddItem = function() {
    var input, newItem;
    
    // 1. Get the field input data
    input = UICtrl.getInput();
    console.log(input);
    
    if(input.description !== "" && !isNaN(input.value) && input.value > 0) { //!false && !NaN && value > 0
      // 2. Add the item to the budget controller
      newItem = budgetCtrl.addItem(input.type, input.description, input.value); //*----FROM BUDGET 
      
      // 3. Add the item to the UI
      UICtrl.addListItem(newItem, input.type); // MARK UP UI
      
      // 4. Clear the fields
      UICtrl.clearFields();

      // 5. Calculate and update budget 
      updateBudget();
    }

  };

  var ctrlDeleteItem = function(event) {
    var itemID, splitID, type, ID;

    itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

    if (itemID) { //inc-1

      splitID = itemID.split('-')//get massive with "inc-0" ['inc', '0']
      type = splitID[0];
      ID = splitID[1];

      // 1. delete the item from dat structure

      // 2. Delete the item from the UI

      // 3. Update and show the new budget
    }

    console.log(splitID); //button is parent for x

  }


    return {
      init: function() {
        console.log('Application started...');
        UICtrl.displayBudget({
          budget: 0,
          totalInc: 0,
          totalExp: 0,
          percentage: -1
        }); // update fields when we start app
        setupEventListeners();
      }
    }

})(budgetController, UIcontroller);

controller.init();