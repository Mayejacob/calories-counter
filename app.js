// storage controller

// Item Controller
const ItemCtrl = (function() {
    // Item Constructor
    const Item = function(id, name, calories){
        this.id = id;
        this.name = name;
        this.calories = calories;
    }

    // Data Structure / State
    const data = {
        items: [
            // {id: 0, name: 'Steak Dinner', calories: 1200},
            // {id: 1, name: 'Cookie', calories: 400},
            // {id: 2, name: 'Egg', calories: 300},
        ],
        currentItem: null,
        totalCalories: 0
    }

    // public methods
    return{
        getItems: function(){
            return data.items;
        },
        addItem: function(name, calories){
            let  ID
            // create ID
            if(data.items.length > 0){
                ID = data.items[data.items.length - 1].id + 1;
            }else{
                ID = 0;
            }
            // calories to number
            calories = parseInt(calories)
            // create item
            newItem = new Item(ID, name, calories);
            // add to items array
            data.items.push(newItem)

            return newItem
        },
        getItemById: function(id){
            let found = null;
            data.items.forEach(function(item){
                if(item.id === id){
                    found = item;
                }
            })
            return found;
        },
        updateItem: function(name, calories){
            // callories to number
            calories = parseInt(calories);
            let found = null;
            data.items.forEach(function(item){
                if(item.id === data.currentItem.id){
                    item.name = name;
                    item.calories = calories;
                    found = item;
                }
            })
            return found;
        },
        deleteItem: function(id){
            // get the ids
            ids = data.items.map(function(item){
                return item.id;
            })
            // get index
            const index = ids.indexOf(id);
            // remove item
            data.items.splice(index, 1)
        },
        clearAllItems: function(){
            data.items = []
        },
        setCurrentItem: function(item){
            data.currentItem = item;
        },
        getCurrentItem: function(){
            return data.currentItem
        },
        getTotalCalories: function(){
            let total = 0;
            // loop through and add calories
            data.items.forEach(function(item){
                total += item.calories;
            });
            // set total calories in data structure
            data.totalCalories = total

            // return total
            return data.totalCalories
        },
        logData: function(){
            return data;
        }
    }
})();

// UI controller
const UICtrl = (function() {
    const UISelectors = {
        itemList: '#item-list',
        listItems: '#item-list li',
        addBtn: '.add-btn',
        updateBtn: '.update-btn',
        deletBtn: '.delete-btn',
        backBtn: '.back-btn',
        clearBtn: '.clear-btn',
        itemNameInput: '#item-name',
        itemCaloriesInput: '#item-calories',
        totalCalories: '.total-calories',
    }
    // public methods
    return {
        populateItemList: function(items){
            let html = '';
            items.forEach(function(item){
                html += `
                <li class="collection-item" id="item-${item.id}">
                    <strong>${item.name}:</strong> <em>${item.calories} Calories</em>
                    <a href="#" class="secondary-content">
                        <i class="edit-item fa fa-pencil"></i>
                    </a>
                </li>
                `;
            });

            // insert list items
            document.querySelector(UISelectors.itemList).innerHTML = html;
        },
        getItemInput: function(){
            return {
                name:document.querySelector(UISelectors.itemNameInput).value,
                calories: document.querySelector(UISelectors.itemCaloriesInput).value
            }
        },
        addListItem: function(item){
            // show the list items
            document.querySelector(UISelectors.itemList).style.display = 'block';
            // create li element
            const li = document.createElement('li')
            // add class'
            li.className = 'collection-item'
            // add id
            li.id = `item-${item.id}`;
            // add html
            li.innerHTML = `
                <strong>${item.name}:</strong> <em>${item.calories} Calories</em>
                <a href="#" class="secondary-content">
                    <i class="edit-item fa fa-pencil"></i>
                </a>
            `;
            // insert item
            document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li)
        },
        updateListItem: function(item){
            let listItems = document.querySelectorAll(UISelectors.listItems)
            // turn nodelist into array
            listItems =Array.from(listItems)
            listItems.forEach(function(listItem){
                const itemID = listItem.getAttribute('id')
                if(itemID === `item-${item.id}`){
                    document.querySelector(`#${itemID}`).innerHTML = `
                        <strong>${item.name}:</strong> <em>${item.calories} Calories</em>
                        <a href="#" class="secondary-content">
                            <i class="edit-item fa fa-pencil"></i>
                        </a>
                    `;
                }
            })
        },
        deleteListItem: function(id){
            const itemID = `#item-${id}`
            const item = document.querySelector(itemID)
            item.remove()
        },
        clearInput: function() {
            document.querySelector(UISelectors.itemNameInput).value = '';
            document.querySelector(UISelectors.itemCaloriesInput).value = '';
        },
        addItemToForm: function(){
            document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
            document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;
            UICtrl.showEditState()
        },
        removeItems: function(){
            let listItems = document.querySelectorAll(UISelectors.listItems)
            // turn nodelist into array
            listItems = Array.from(listItems)
            listItems.forEach(function(item){
                item.remove()
            })
        },
        hideList: function(){
            document.querySelector(UISelectors.itemList).style.display = 'none';
        },
        showTotalCalories: function(totalCalories){
            document.querySelector(UISelectors.totalCalories).textContent = totalCalories
        },
        clearEditState: function(){
            UICtrl.clearInput();
            document.querySelector(UISelectors.updateBtn).style.display = 'none';
            document.querySelector(UISelectors.deletBtn).style.display = 'none';
            document.querySelector(UISelectors.backBtn).style.display = 'none';
            document.querySelector(UISelectors.addBtn).style.display = 'inline';
        },
        showEditState: function(){
            document.querySelector(UISelectors.updateBtn).style.display = 'inline';
            document.querySelector(UISelectors.deletBtn).style.display = 'inline';
            document.querySelector(UISelectors.backBtn).style.display = 'inline';
            document.querySelector(UISelectors.addBtn).style.display = 'none';
        },
        getSelectors: function(){
            return UISelectors;
        }
    }
})();


// App Controller
const App = (function(ItemCtrl, UICtrl) {
    // load  event listners
    const loadEventListeners = function (){
        // get UI Selectors
        const UISelectors = UICtrl.getSelectors();

        // Add item event
        document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit)
        
        // Dissable submit on enter
        document.addEventListener('keypress', function(e){
            if(e.keyCode === 13 || e.which === 13){
                e.preventDefault()
                return false;
            }
        })
        // edit icon click event
        document.querySelector(UISelectors.itemList).addEventListener('click', itemEditClick)
        // update item event
        document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdateSubmit)
        // Back button event
        document.querySelector(UISelectors.backBtn).addEventListener('click', UICtrl.clearEditState)
        // Delete item event
        document.querySelector(UISelectors.deletBtn).addEventListener('click', itemDeleteSubmit)
        // Clear all items event
        document.querySelector(UISelectors.clearBtn).addEventListener('click', clearAllItemsClick)
    }
    // Add item submit
    const itemAddSubmit = function(e){

        // get form input from UI Controller
        const input = UICtrl.getItemInput();
        // validate form
        if(input.name !== '' && input.calories !== ''){
            // Add Item
            const newItem = ItemCtrl.addItem(input.name, input.calories);
            
            // Add item to ui list
            UICtrl.addListItem(newItem)
            // get total calories
            const totalCalories = ItemCtrl.getTotalCalories();
            // add total calories to UI
            UICtrl.showTotalCalories(totalCalories);
            // clear fields
            UICtrl.clearInput();
        }
        e.preventDefault();
    }
    // click edit item
    const itemEditClick = function(e){
        if(e.target.classList.contains('edit-item')){
            // get he list item id
            const listId = e.target.parentNode.parentNode.id
            // break into an array
            const liestIDArr = listId.split('-')
            // get the actual id
            const id = parseInt(liestIDArr[1]);

            // get item
            const itemToEdit = ItemCtrl.getItemById(id);
            // set current item
            ItemCtrl.setCurrentItem(itemToEdit);
            // add item to form
            UICtrl.addItemToForm()
        }

        e.preventDefault()
    }
    // update item and submit
    const itemUpdateSubmit = function(e){
        // get item input
        const input = UICtrl.getItemInput();
        // update item
        const updatedItem = ItemCtrl.updateItem(input.name, input.calories)
        // update ui
        UICtrl.updateListItem(updatedItem)

        // get total calories
        const totalCalories = ItemCtrl.getTotalCalories();
        // add total calories to UI
        UICtrl.showTotalCalories(totalCalories);

        UICtrl.clearEditState()

        e.preventDefault()
    }
    // Delete item event
    const itemDeleteSubmit = function(e){
        // get current item
        const currentItem = ItemCtrl.getCurrentItem();
        // delte from data structure
        ItemCtrl.deleteItem(currentItem.id);

        // delete from UI
        UICtrl.deleteListItem(currentItem.id)
        // get total calories
        const totalCalories = ItemCtrl.getTotalCalories();
        // add total calories to UI
        UICtrl.showTotalCalories(totalCalories);

        UICtrl.clearEditState()


        e.preventDefault()
    }

    // clear all items events
    const clearAllItemsClick = function(e){
        // delete all items from data structure
        ItemCtrl.clearAllItems()
        // get total calories
        const totalCalories = ItemCtrl.getTotalCalories();
        // add total calories to UI
        UICtrl.showTotalCalories(totalCalories)
        // remove from ui
        UICtrl.removeItems()
        // hide UL
        UICtrl.hideList()
    }
    // public methods
    return {
        init: function(){
            // clear deit state
            UICtrl.clearEditState()
            // Fetch items from data structure
            const items = ItemCtrl.getItems()
            // check if if any items
            if(items.length === 0){
                UICtrl.hideList();
            }else{
                // Populate list with items
                UICtrl.populateItemList(items);
            }

            // get total calories
            const totalCalories = ItemCtrl.getTotalCalories();
            // add total calories to UI
            UICtrl.showTotalCalories(totalCalories)

            // load eventlisteners
            loadEventListeners()
        }
    }
})(ItemCtrl, UICtrl);

// initialize app
App.init()