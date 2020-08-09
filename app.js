var budgetController = (function() {
  
  var Expense = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
    this.percentage = -1;
  };

  Expense.prototype.calcPercentage = function(totalIncome) {
    if(totalIncome > 0) {
      this.percentage = Math.round((this.value / totalIncome) * 100);
    } else {
      this.percentage = -1;
    }
  };

  Expense.prototype.getPercentage = function() {
    return this.percentage;
  }


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

    deleteItem: function(type, id) {
      var ids, index;
      // id = 3
      // data.allItems[type][id];
      // ids [1 2 4 6 8]
      // index 3

      ids = data.allItems[type].map(function(current) {//return mass with ids
        return current.id;
      });

      index = ids.indexOf(id);
      if (index !== -1) {
        data.allItems[type].splice(index, 1);
      }

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

    calculatePercentages: function() {
        /*
        a=20
        b=10
        c=40
        income = 100
        a = 20/100 =20%
        b= 10/100 = 10%
        c= 40/100 - 40%
        */
       data.allItems.exp.forEach(function(cur) {
        cur.calcPercentage(data.totals.inc);
     });
 },

    getPercentages: function() {
      var allPerc = data.allItems.exp.map(function(cur) {
        return cur.getPercentage();
      });
      return allPerc;
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
var UIController = (function() {
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
    container: '.container',
    expensesPercentageLabel: '.item__percentage'
  };

  var formatNumber = function(num, type) {
    var numSplit, int, dec;
    /*
    + or -before number
    exactly 2 decimal points 
    comma separating the thousands

    2310.4657 -> + 2,310.46
    2000 -> 2,000.00
    */

    num = Math.abs(num);
    num = num.toFixed(2);

    numSplit = num.split('.');

    int = numSplit[0];
    if (int.length > 3) {
      int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3); // inp 2310 = 2,310 || 23510 = 23,510
    }

    
    dec = numSplit[1];

    type === 'exp' ? sign = '-' : sign = '+';
    
    return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;

  }



  var nodeListForEach = function(list, callback) { // CALLBACK CHECK imp forEach()
    for(var i = 0; i < list.length; i++) {
      callback(list[i], i); 
    }
  }; 


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
        if (type === "inc") {
          element = DOMstrings.incomeContainer;
          html = `<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div>
          <div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>`
        } else if (type === "exp") {
            element = DOMstrings.expensesContainer;
            html = `<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div>
            <div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>`
        }

        // Replace placeholder text with some actual data
        newHtml = html.replace('%id%', obj.id);  // regexp - регулярка типа
        newHtml = newHtml.replace('%description%', obj.description);
        newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));

        // Insert the HTML into the DOM
        document.querySelector(element).insertAdjacentHTML('beforeend', newHtml); // element is a container either exp or inc
      },

      deleteListItem: function(selectorID) {
        var el = document.getElementById(selectorID);
        el.parentNode.removeChild(el);//???
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
        
        obj.budget > 0 ? type = 'inc' : type = 'exp' ;
        
        //debugger
        /*document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
        document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalInc;
        document.querySelector(DOMstrings.expensesLabel).textContent = obj.totalExp;
        document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage;*/ //another part


        document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type);
        document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
        document.querySelector(DOMstrings.expensesLabel).textContent = formatNumber(obj.totalExp, 'exp');

        if(obj.percentage > 0) {
          document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + "%";
        } else {
          document.querySelector(DOMstrings.percentageLabel).textContent = "---"; //show _ if there is only expenses

        }

      },

      displayPercentages: function(percentages) { 

        var fields = document.querySelectorAll(DOMstrings.expensesPercentageLabel);
        console.log(fields);

        /*
        Array.from(fil).forEach(current => {
          if(current > 0) {
            textContent = percentages[index] + '%';
          } else {
            current.textContent = '---';
          }
      })
        */




        nodeListForEach(fields, function(current, index) {//Call back fun
          // Do stuff
          if(percentages[index] > 0) {
            current.textContent = percentages[index] + '%';
          } else {
            current.textContent = '---';
          }

        });

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

      // 6. Calculate and update percentages
      updatePercentages();
    }

  };

  var updatePercentages = function() {
    // 1. Calculate percentages
    budgetCtrl.calculatePercentages();
    
    // 2. Read percentages from the budget controller
    var percentages = budgetCtrl.getPercentages();
    
    // 3. Updae the UI the new percentages
    console.log(percentages);
    UICtrl.displayPercentages(percentages);
  };


  var ctrlDeleteItem = function(event) {
    var itemID, splitID, type, ID;

    itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

    if (itemID) { //inc-1

      splitID = itemID.split('-')//get massive with "inc-0" ['inc', '0']
      type = splitID[0];
      ID = parseInt(splitID[1]);

      // 1. delete the item from dat structure
      budgetCtrl.deleteItem(type, ID);

      // 2. Delete the item from the UI
      UICtrl.deleteListItem(itemID);

      // 3. Update and show the new budget
      updateBudget();

      // 6. Calculate and update percentages
        updatePercentages();
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

})(budgetController, UIController);

controller.init();






