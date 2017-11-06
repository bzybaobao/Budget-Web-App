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
    }
};

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
    testing: function() {
        console.log(data);
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
      expensesContainer: '.expenses__list'
    };
    return { //return object
        getInput: function(){
            return {  //object;
                type: document.querySelector(DOMstrings.inputType).value,//will be inc or exp
                description:document.querySelector(DOMstrings.inputDescription).value,
                    value : document.querySelector(DOMstrings.inputValue).value
                   };
           
        },
        
        getDOMstrings: function() {
            return DOMstrings;
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
                 html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if (type ==='exp') {
                console.log("exp");
                  element = DOMstrings.expensesContainer;
                  html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
          
            //change the placeholder text with some actual data.
            newHtml =  html.replace("%id%",obj.id);
            newHtml = newHtml.replace("%description%", obj.description);
            newHtml = newHtml.replace("%value%", obj.value);
            //insert the html into the dom.
            document.querySelector(element).insertAdjacentHTML("beforeend", newHtml);
        }
        
        
    };
    
})();

var controller = (function(budgetCtrl, UICtrl){
    var setupEventListeners = function () {
        var DOM = UICtrl.getDOMstrings();
        document.querySelector(DOM.inputBtn).addEventListener('click',ctrlAddItem);

        document.addEventListener('keypress', function(event) {
            if (event.keyCode ===13 || event.which ===13 ) {
                ctrlAddItem();
            }
        });
    };
    
    var ctrlAddItem = function() {
        var input , newItem;
         // 1. get the field input data
        input = UICtrl.getInput();
          // 2. add the item to the budget controller
        newItem = budgetCtrl.addItem(input.type, input.description, input.value);
        // 3. add the item to the UI
        UICtrl.addListItem(newItem, input.type);
        
        // 4. clear the fields.
        UICtrl.clearFields();
        // 4. calculate the budget
        // 5. display the budget on the UI.
        //console.log(input);
        
    };
    
    return {
        init: function() {
            console.log("Application has started");
            setupEventListeners();
        }
    }
    
})(budgetControlloer,UIController);
  controller.init();

