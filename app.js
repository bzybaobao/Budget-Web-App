//from outsise we can not acess the scope of the controller.
var budgetControlloer = (function(){
    //private
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
      exp: [],
      inc: []
    },
    
    totals: {
        exp: 0,
        inc: 0
    },
    budget: 0,
    percentage: -1
};
    
var calculateTotal = function (type) {
    var sum = 0;
    data.allItems[type].forEach(function(cur) {
        sum+=cur.value;
    });
    data.totals[type]= sum;
}

return {
    addItem: function(type, des, val) {
        var newItem, ID;
        //[1,2,3,4,5], next ID = 6
        //[1 2 4 6 8], next ID = 9
        //ID = last ID +1
        if (data.allItems[type].length > 0) {
            ID =data.allItems[type][data.allItems[type].length - 1].id + 1;
        } else {
            ID = 0;
        }
        
        
        if(type === 'exp') {
            newItem = new Expense(ID,des,val);
        } else if (type === "inc") {
            newItem = new Income(ID, des, val);
        }
        data.allItems[type].push(newItem);
        return newItem;
    },
    
    deleteItem: function(type, id) {
        var ids, index;
        ids = data.allItems[type].map(function(current){
           return current.id; 
        });
        
        index = ids.indexOf(id);
        //console.log(index);
        
        if (index !== -1) {
            data.allItems[type].splice(index,1);
             //console.log(index);
        }
     },
    
    calculateBudget : function () {
        //calculate the total income
        calculateTotal("exp");
        calculateTotal("inc");
        data.budget = data.totals.inc - data.totals.exp;
        if (data.totals.inc > 0) {
            data.percentage = Math.round((data.totals.exp/data.totals.inc)*100);
        } else {
            data.percentage = -1;
        }
},
    testing: function() {
        console.log(data);
    },
    getBudget: function() {
        return {
            budget: data.budget,
            totalInc: data.totals.inc,
            totalExp: data.totals.exp,
            percentage: data.percentage
        }
    }
    
};

})();//exection;  // return publicTest function 给   (closure)budgetController.





var UIController = (function(){
    var DOMstrings = {
      inputType: '.add__type',
      inputDescription: '.add__description',
      inputValue: ".add__value",
      inputBtn: '.add__btn',
      incomeContainer: '.income__list',
      expensesContainer: '.expenses__list',
      budgetLabel: '.budget__value',
      incomeLabel: '.budget__income--value',
      expensesLabel: '.budget__expenses--value',
      percentageLabel: '.budget__expenses--percentage',
      container: '.container'
    };
    return { //return object
        getInput: function(){
            return {  //object;
                type: document.querySelector(DOMstrings.inputType).value,//will be inc or exp
                description:document.querySelector(DOMstrings.inputDescription).value,
                    value : parseFloat(document.querySelector(DOMstrings.inputValue).value)
                   };
           
        },
        
        getDOMstrings: function() {
            return DOMstrings;
        },
        
        displayBudget: function(obj) {
       
            document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
            document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalInc;
            document.querySelector(DOMstrings.expensesLabel).textContent = obj.totalExp;
         
            
            if (obj.percentage > 0) {
                   document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + "%";
                
            } else {
                document.querySelector(DOMstrings.percentageLabel).textContent = "---";
            }
            
            
        },
        
        clearFields: function() {
          var fields, fieldsArr;//LIST to array we use call method
          fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);
         fieldsArr = Array.prototype.slice.call(fields);
        
          fieldsArr.forEach(function(current, index, array){
              //console.log(current.val);
              current.value = "";
          });
           fieldsArr[0].focus();
       
   
        },
        
        addListItem : function(obj, type) {
            var html, newHtml,element;
            //create the html strings.
            if (type === 'inc') {
                 element = DOMstrings.incomeContainer;
                 html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if (type ==='exp') {
                console.log("exp");
                  element = DOMstrings.expensesContainer;
                  html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
          
            //change the placeholder text with some actual data.
            newHtml =  html.replace("%id%",obj.id);
            newHtml = newHtml.replace("%description%", obj.description);
            newHtml = newHtml.replace("%value%", obj.value);
            //insert the html into the dom.
            document.querySelector(element).insertAdjacentHTML("beforeend", newHtml);
        },
        
        deleteListItem: function(selectItem) {
            var temp = document.getElementById(selectItem);
            temp.parentNode.removeChild(temp);
        }
        
        
    };
    
})();

var controller = (function(budgetCtrl, UICtrl){
    var setupEventListeners = function () {
        var DOM = UICtrl.getDOMstrings();
        document.querySelector(DOM.inputBtn).addEventListener('click',ctrlAddItem);
        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
        document.addEventListener('keypress', function(event) {
            if (event.keyCode === 13 || event.which === 13 ) {
                ctrlAddItem();
            }
        });
    };
    
    var updateBudget = function() {
        //calculate the budget
        budgetCtrl.calculateBudget();
        //return the budget
        var budget = budgetCtrl.getBudget();
        //display thebudet on UI.
        UICtrl.displayBudget(budget);
    }
    
    var ctrlDeleteItem = function(event) {
        //console.log("fds");
        var itemID,  type, ID;
        var splitId;
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        if (itemID) {
            splitId = itemID.split('-');
            type = splitId[0];
            ID = parseInt(splitId[1]);
        } 
        //delete the item from data structure
        budgetCtrl.deleteItem(type,ID);
        //delete the item from ui
        UICtrl.deleteListItem(itemID);
        updateBudget();
        //update the calculation
    }
    
    var ctrlAddItem = function() {
        var input , newItem;
         // 1. get the field input data
        
        input = UICtrl.getInput();
        if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
          // 2. add the item to the budget controller
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);
            // 3. add the item to the UI
            UICtrl.addListItem(newItem, input.type);

            // 4. clear the fields.
            UICtrl.clearFields();
            updateBudget();
        }
        // 4. calculate the budget
        
        // 5. display the budget on the UI.
        //console.log(input);
        
    };
    
    return {
        init: function() {
              
             UICtrl.displayBudget({
                 budget: 0,
                 totalInc: 0,
                 totalExp: 0,
                 percentage: 0
             });
            console.log("Application has started");
            setupEventListeners();
        }
    }
    
})(budgetControlloer,UIController);
  controller.init();

