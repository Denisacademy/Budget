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

  var data = {
    allItems: {
      exp: [],  //new item
      inc: []
    },
    totals: {
      exp: 0,
      inc: 0
    }
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
    testing: function() {
      console.log(data);
    }
  };

})();

//UI controller====***
var UIcontroller = (function() {
  // Some code -- collect neccesary fields

  var DOMstring = {  //short way
    inputType: '.add__type',
    inputDescription: '.add__description',
    inputValue: '.add__value',
    inputButton: '.add__btn',
    incomeContainer: '.income__list',
    expensesContainer: '.expenses__list',

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

      addListItem: function(obj, type) {  //==obj from constructor (exp and inc)============ Make HTML
        var html, newHtml, element;

        // Create HTML string with placeholder text
        if(type === "inc") {
          element = DOMstring.incomeContainer;
          html = `<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div>
          <div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>`
        } else if(type === "exp") {
            element = DOMstring.expensesContainer;
            html = `<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div>
            <div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>`
        }


        // Replace placeholder text with some actual data
        newHtml = html.replace('%id%', obj.id);  // regexp - регулярка типа
        newHtml = newHtml.replace('%description%', obj.description);
        newHtml = newHtml.replace('%value%', obj.value);

        // Insert the HTML into the DOM
        document.querySelector(element).insertAdjacentHTML('beforeend', newHtml); // element is a container either exp or inc
      },

      getDOMstrings: function() {
        return DOMstring;
      }
    }
})();


//GLOBAL APP controller===*** //btn
var controller = (function(budgetCtrl, UICtrl) {
  
  var setupEventListeners = function() {
    var DOM = UIcontroller.getDOMstrings(); //get input and el button document
    
    document.querySelector(DOM.inputButton).addEventListener('click', ctrlAddItem); //btn add
 
    document.addEventListener('keypress', function(event) { //alternat add item
      if(event.keyCode === 13 || event.which ===13) {
        ctrlAddItem();//console.log(event.key === 'Enter');
      } 
    });
  };
 
  
  var ctrlAddItem = function() {
    var input, newItem;
    // 1. Get the field input data
    input = UICtrl.getInput();
    console.log(input);
    // 2. Add the item to the budget controller
    newItem = budgetCtrl.addItem(input.type, input.description, input.value); //*----FROM BUDGET 
    // 3. Add the item to the UI
    
    UIcontroller.addListItem(newItem, input.type); // MARK UP UI

    // 4. Calculate the budget
    
    // 5. Display budget on the UI

  };

    return {
      init: function() {
        console.log('Application started...');
        setupEventListeners();
      }
    }

})(budgetController, UIcontroller);

controller.init();