define(['common/pic-dropdown'], function (dropdown) {
    //CONSTANTS
    const FORWARD = 1;
    const BACKWARD = -1;
    const SELECTED = 'selected';
    const OPEN = 'open';
    
    //CSS CLASS CONSANTS
    const NAV_ELEMENT_CLASS = '.nav-menu';
    const NAV_DROPDOWN_MENU = 'nav-dropdown-menu';
    const NAV_DROPDOWN_MENU_CLASS = '.' + NAV_DROPDOWN_MENU;
    const HEADER_BTN_CLASS = '.header-btn';
    const DROPDOWN_CLASS = '.dropdown';
    const SELECTED_CLASS = '.' + SELECTED;
    const SELECTED_HEADER_TAB_CLASS = HEADER_BTN_CLASS + SELECTED_CLASS;
    const SELECTED_DROPDOWN_ITEM_CLASS = DROPDOWN_CLASS + SELECTED_CLASS;
    const OPEN_NAV_DROPDOWN_CLASS = '.nav-dropdown-menu.' + OPEN;
    const DROPDOWN_TOGGLE = 'dropdown-toggle';
    const DROPDOWN_TOGGLE_CLASS = '.' + DROPDOWN_TOGGLE;

    let view = undefined;
    let dropdownToggle = undefined;

    let setView = (newView) => {
        view = newView;
    }

    let getView = () => {
        return view;
    }

    /*
        Sets the current view to the view that is passed in and sets if the dropdown view if it exists. If it doesnt, 
        it initializes the dropdown view with the current view.

        @param {view} view - the view that is currently being viewed
        @param {view} dropdownView - a reference to a nav-dropdown. If it is undefined, it will initialize a new dropdown view
    */
    let init = (view) => {
        if (view) {
            dropdown.init(view);
            setView(view);
        } else {
            console.error('view is undefined');
        }
    }

    /*
        This function handles the upArrowKey event for both the nav-dropdown and the nav-menu. In the case that the nav-dropdown
        is open, the upArrowKey event will select the previous element in the dropdown. In the case that the nav-dropdown is closed,
        the upArrowKey will open the nav-dropdown and select the last element in the dropdown.
         
        Note: The view needs to be defined before calling this function.
    */
    let upKeyPressed = (e) => {
        console.debug('nav-menu.js: upKeyPressed');
        if (getView()) {
            const selectedTab = getView().el.querySelector(SELECTED_HEADER_TAB_CLASS);
            if (isDropdown(selectedTab)) {
                const selectedSubMenu = selectedTab.nextElementSibling;
                if (selectedSubMenu && selectedSubMenu.classList.contains(NAV_DROPDOWN_MENU)) {
                    const dropdownItems = selectedSubMenu.querySelectorAll(DROPDOWN_CLASS);
                    !selectedSubMenu.classList.contains(OPEN) && getDropdownToggle(selectedTab).click();
                    move(BACKWARD, dropdownItems);
                }
            }
        } else {
            console.error('view is undefined');
        }
    }

    /*
        This function handles the downArrowKey event for both the nav-dropdown and the nav-menu. In the case that the nav-dropdown is open,
        the downArrowKey event will select the next element in the dropdown. In the case that the nav-dropdown is closed, the downArrowKey
        will open the nav-dropdown and select the first element in the dropdown.

        Note: The view needs to be defined before calling this function.
    */
    let downKeyPressed = (e) => {
        console.debug('nav-menu.js: downKeyPressed');
        if (getView()) {
            const selectedTab = getView().el.querySelector(SELECTED_HEADER_TAB_CLASS);
            if (isDropdown(selectedTab)) {
                const selectedSubMenu = selectedTab.nextElementSibling;
                if (selectedSubMenu && selectedSubMenu.classList.contains(NAV_DROPDOWN_MENU)) {
                    const dropdownItems = selectedSubMenu.querySelectorAll(DROPDOWN_CLASS);
                    !selectedSubMenu.classList.contains(OPEN) && getDropdownToggle(selectedTab).click();
                    move(FORWARD, dropdownItems);
                }
            }
        } else {
            console.error('view is undefined');
        }
    }

    /*
        This function handles the leftArrow event for both the nav-dropdown and the nav-menu. In the case that the nav-dropdown is open,
        the leftArrow event close the dropdown and move to the next tab to the left. In the case that the nav-dropdown is closed, the
        leftArrow will select the tab to the left of the current tab.

        Note: The view needs to be defined before calling this function.
    */
    let leftKeyPressed = () => {
        console.debug('nav-menu.js: leftKeyPressed');
        if (getView()) {
            const tabs = getView().el.querySelectorAll(HEADER_BTN_CLASS);
            move(BACKWARD, tabs, true);
        } else {
            console.error('view is undefined');
        }
    }

    /*
        This function handles the right event for both the nav-dropdown and the nav-menu. In the case that the nav-dropdown is open,
        the rightArrow event close the dropdown and move to the next tab to the right. In the case that the nav-dropdown is closed,
        the rightArrow will select the tab to the right of the current tab.
        
        Note: The view needs to be defined before calling this function.
    */
    let rightKeyPressed = () => {
        console.debug('nav-menu.js: rightKeyPressed');
        if (getView()) {
            const tabs = getView().el.querySelectorAll(HEADER_BTN_CLASS);
            move(FORWARD, tabs, true);
        } else {
            console.error('view is undefined');
        }
    }
    
    /*
        This function handles the select event for both the nav-dropdown and the nav-menu. In the case that the nav-dropdown is open,
        the select event select the current menu item. In the case that the nav-dropdown is closed, the select event will trigger 
        navigation to the currently selected tab. If the selected tab is a dropdown, the select event will open the dropdown and 
        select the first item in the dropdown.
        
        Note: The view needs to be defined before calling this function.
    */
    let selectItem = (e) => {
        console.debug('nav-menu.js: selectItem');
        if (getView()) {
            const selectedTab = getView().el.querySelector(SELECTED_HEADER_TAB_CLASS);
            if (isDropdown(selectedTab)) {
                const selectedSubMenu = selectedTab.parentElement.querySelector(NAV_DROPDOWN_MENU_CLASS);
                if (selectedSubMenu.classList.contains(OPEN)) {
                    const selectedOption = selectedSubMenu.querySelector('.selected');
                    if (selectedOption) {
                        selectedOption.classList.remove(SELECTED);
                        selectedOption.getElementsByTagName('a')[0].click();
                    }
                } else {
                    getDropdownToggle(selectedTab).click();
                    selectedSubMenu.querySelector('.dropdown:first-child').classList.add(SELECTED);
                }
            } else {
                selectedTab.click();
                dropdown.closeDropdown();
            }
        } else {
            console.error('view is undefined');
        }
    }

    /*
        This function handles the escape event for both the nav-dropdown and the nav-menu. In the case that the nav-dropdown is open,
        the escape event will close the dropdown. In the case that the nav-dropdown is closed it will do nothing.

        @param {Object} event - The event object.
        Note: The view needs to be defined before calling this function.
    */
    let escapeKeyPressed = (e) => {
        console.debug('nav-menu.js: escapeKeyPressed');
        dropdown.closeDropdown(e);
    }

    /*
        This function handles the home event for both the nav-dropdown and the nav-menu. In the case that the nav-dropdown is open,
        the home event will select the first item in the dropdown. In the case that the nav-dropdown is closed it selects the first
        tab in the nav-menu.

        @param {Object} event - The event object.
        Note: The view needs to be defined before calling this function.
    */
    let homeKeyPressed = (e) => {
        console.debug('nav-menu.js: homeKeyPressed');
        if (getView()) {
            const selectedTab = getView().el.querySelector(SELECTED_HEADER_TAB_CLASS);
            if (isDropdown(selectedTab) && selectedTab.parentElement.querySelector(OPEN_NAV_DROPDOWN_CLASS)) {
                selectedTab.parentElement.querySelector(SELECTED_DROPDOWN_ITEM_CLASS).classList.remove(SELECTED);
                const drowpdownFirstItem = selectedTab.parentElement.querySelector('.dropdown:first-child');
                drowpdownFirstItem.classList.add(SELECTED);
                setActivedescendant(drowpdownFirstItem);
            } else {
                const tabs = getView().el.querySelectorAll(HEADER_BTN_CLASS);
                selectedTab.classList.remove(SELECTED);
                tabs[0].classList.add(SELECTED);
                setActivedescendant(tabs[0]);
            }
        } else {
            console.error('view is undefined');
        }
    }

    /*
        This function handles the end event for both the nav-dropdown and the nav-menu. In the case that the nav-dropdown is open,
        the end event will select the last item in the dropdown. In the case that the nav-dropdown is closed it selects the last
        tab in the nav-menu.

        Note: The view needs to be defined before calling this function.
    */
    let endKeyPressed = () => {
        console.debug('nav-menu.js: endKeyPressed');
        if (getView()) {
            const selectedTab = getView().el.querySelector(SELECTED_HEADER_TAB_CLASS);
            if (isDropdown(selectedTab) && selectedTab.parentElement.querySelector(OPEN_NAV_DROPDOWN_CLASS)) {
                selectedTab.parentElement.querySelector(SELECTED_DROPDOWN_ITEM_CLASS).classList.remove(SELECTED);
                const item = selectedTab.parentElement.querySelector('.dropdown:last-child');
                item.classList.add(SELECTED);
                setActivedescendant(item);
            } else {
                const tabs = getView().el.querySelectorAll(HEADER_BTN_CLASS);
                selectedTab.classList.remove(SELECTED);
                tabs[tabs.length - 1].classList.add(SELECTED);
                setActivedescendant(tabs[tabs.length - 1]);
            }
        } else {
            console.error('view is undefined');
        }
    }
    
    /*
        This function handles the tab event for both the nav-dropdown and the nav-menu. The tab event will select the first item in 
        the dropdown that matches the letter key pressed. If that item is already selected it will try and find the next item that 
        matches that letter. If there is no matches then it remains on the current tab. If the nav-dropdown is closed it will do 
        the behavior same for the header tabs.

        @param {Object} event - The event object which is used to get the letter pressed.

        Note: The view needs to be defined before calling this function.
    */
    let letterKeyPressed = (e) => {
        console.debug('nav-menu.js: letterKeyPressed');
        if (getView()) {
            const letter = String.fromCharCode(e.which);
            let selectedItem = getView().el.querySelector(SELECTED_HEADER_TAB_CLASS);
            let itemList = [];
            if (isDropdown(selectedItem) && selectedItem.parentElement.querySelector(OPEN_NAV_DROPDOWN_CLASS)) {
                itemList = selectedItem.parentElement.querySelectorAll(DROPDOWN_CLASS);
                selectedItem = selectedItem.parentElement.querySelector(SELECTED_DROPDOWN_ITEM_CLASS);
                setActivedescendant(selectedItem);
            } else {
                itemList = getView().el.querySelectorAll(HEADER_BTN_CLASS);
            }
            for (let i = 0; i < itemList.length; i++) {
                if (itemList[i].innerText.toUpperCase().startsWith(letter) && !itemList[i].classList.contains(SELECTED)) {
                    selectedItem.classList.remove(SELECTED);
                    itemList[i].classList.add(SELECTED);
                    setActivedescendant(itemList[i]);
                    break;
                }
            }
        } else {
            console.error('view is undefined');
        }
    }

    //Private functions

    /*
        This function returns true if the element is defined and is a dropdown.

        @param {element} el - the element to check
    */
    let isDropdown = (el) => {
        return el && el.classList.contains('nav-dropdown');
    }


    let getDropdownToggle = (el) => {
        if (el && el.classList.contains(DROPDOWN_TOGGLE)) {
            return el;
        } else if (el && el.nextElementSibling.contains('dropdown-toggle')) {
            return el.nextElementSibling;
        } else {
            console.error('nav-menu.js: could not find dropdown toggle');
        }
        console.error('nav-menu.js: getDropdownToggle: element is undefined');
        return null;
    }

    /*
        Moves the selected tab to the left of the current tab. If the current tab is the first tab, it will move to the last tab.
        @param {array} tabs - an array of all the tabs in the nav-menu
        @param {number} i - the index of the current selected tab
    */
    let selectPrev = (tabs, i) => {
        if (i > 0) {
            tabs[i - 1].classList.add(SELECTED);
            setActivedescendant(tabs[i - 1]);
        } else {
            tabs[tabs.length - 1].classList.add(SELECTED);
            setActivedescendant(tabs[tabs.length - 1]);
        }
    }
    
    // (i > 0) ? tabs[i - 1].classList.add(SELECTED) && setActivedescendant(tabs[i - 1].innerText) : tabs[tabs.length - 1].classList.add(SELECTED) && setActivedescendant(tabs[length - 1].innerText);

    /*
        Moves the selected tab to the right. If it is the last tab, it will move to the first tab.
        @param {array} tabs - an array of all the tabs in the nav-menu
        @param {number} i - the index of the  current selected tab
    */
    let selectNext = (tabs, i) => {
        if (i < tabs.length - 1) {
            tabs[i + 1].classList.add(SELECTED);
            setActivedescendant(tabs[i + 1]);
        } else {
            tabs[0].classList.add(SELECTED) 
            setActivedescendant(tabs[0])
        }
    };

    /*
    
        Moves the selected item to the next item in the passed in array in the direction indicated by the direction parameter.

        @param {number} direction - the direction to move the selected item. 1 for forward and -1 for backward.
        @param {array} items - an array of items to move the selected item to.
        @param {boolean} closeDropdown - if true, the dropdown will be closed.
    */
    let move = (direction, items, closeDropdown) => {
        if (items && !_.isEmpty(items)) {
            const itemsArray = Array.from(items)
            const selectedItem = itemsArray.find(item => item.classList.contains(SELECTED));
            let index = -1; 
            if (selectedItem) {
                index = itemsArray.indexOf(selectedItem);
                selectedItem.classList.remove(SELECTED);
                closeDropdown && dropdown.closeDropdown(selectedItem);
            }
            index = handleLooping(direction, itemsArray.length, index);
            (direction === FORWARD) ? selectNext(items, index) : selectPrev(items, index);
        }
    }

    /*
        This function handles the looping of the items in the array. If the index is at the end of the array, it will prepare the
        next selection to loop back to the beginning.

        @param {number} direction - the direction to move the selected item. 1 for forward and -1 for backward.
        @param {number} length - the length of the array.
        @param {number} index - the index of the selected item.
    */
    let handleLooping = (direction, length, index) => {
        return index === -1 ? (direction === FORWARD ? -1 : length) : index;
    }

    let setActivedescendant = (element) => {
        if (getView()) {
            getView().el.querySelector(NAV_ELEMENT_CLASS).setAttribute('aria-activedescendant', element.id);
        }
    }



    return {
        init: init,
        view: getView,
        setView: setView,
        upKeyPressed: upKeyPressed,
        downKeyPressed: downKeyPressed,
        leftKeyPressed: leftKeyPressed,
        rightKeyPressed: rightKeyPressed,
        selectItem: selectItem,
        escapeKeyPressed: escapeKeyPressed,
        homeKeyPressed: homeKeyPressed,
        endKeyPressed: endKeyPressed,
        letterKeyPressed: letterKeyPressed
    }
});