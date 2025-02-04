define(["jquery", "common/keyboard-nav"],function($, keyboardNav){
    let view = undefined;

    const OPEN = 'open';
    const SELECTED = 'selected';
    const SECLECTED_CLASS = '.' + SELECTED;
    const NAV_DROPDOWN_MENU_CLASS = '.nav-dropdown-menu';
    const OPEN_NAV_DROPDOWN_CLASS = NAV_DROPDOWN_MENU_CLASS + '.' + OPEN;

    /*
        Initialize the dropdown menu with the provided view. Adds any events needed for the dropddown to the view. 
        To find the nav-dropdown-menu we need to find the parent element as the dropdown button is its sibling.

        @param {view} The view that the dropdown menu is being added to.
        @param {events} An array of events that the dropdown menu should listen for.
    */
    let init = (view, events) => {
        if (view.el) {
            setView(view);
            events && events.forEach(event => getView().delegateEvents(_.extend(getView().events, event)));
        } else {
            console.error('view is undefined');
        }
    }

    let dropdownFocus = (e) => {
        console.debug("subMenuFocus");
        const selectedTab = e.target.closest('.header-btn');
        const currentView = keyboardNav.getCurrentView();
        if (selectedTab && !currentView) {
            let viewName = selectedTab.parentElement.id;
            const dashLoc = viewName.indexOf('-');
            viewName = viewName.substring(0,dashLoc) + viewName.charAt(dashLoc+1).toUpperCase() + viewName.substring(dashLoc+2);
            keyboardNav.setCurrentView(viewName);
        }
        selectedTab.classList.add(SELECTED);
    }

    let dropdownBlur = (e) => {
        console.debug("subMenuBlur", e);
        closeDropdown(e);
    }

    let toggleDropdown = (e) => {
        console.debug("toggleDropdown", e.target);
        const tab = e.target.closest('.header-btn');
        const dropdown = tab.nextElementSibling;
        toggleArrow(tab);
        if (dropdown.classList.contains(OPEN)) {
            dropdown.classList.remove(OPEN);
            dropdown.setAttribute('aria-expanded', false);
        } else {
            dropdown.classList.add(OPEN);
            dropdown.setAttribute('aria-expanded', true);
            $(dropdown).offset({
                top: $(tab).parent().offset().top + $(tab).parent().outerHeight(), 
                left: $(tab).offset().left
            });
            getView().el.querySelector('#header-tabs').focus();
        }
    }

    let closeDropdown = (e) => {
        console.debug("closeDropdown", e);
        const dropdown = getView().el.querySelector(OPEN_NAV_DROPDOWN_CLASS);
        if (dropdown) {
            const selectedOption = dropdown.querySelector(SECLECTED_CLASS);
            selectedOption && selectedOption.classList.remove(SELECTED);
            const icons = dropdown.parentNode.querySelectorAll('i.fa');
            if (icons) {
                icons.forEach(icon => {
                    icon.classList.remove('fa-caret-up');
                    icon.classList.add('fa-caret-down');
                });		
            }
            dropdown.classList.remove(OPEN);
            dropdown.setAttribute('aria-expanded', false);
        }
    }

    let getView = () => {
        return view;
    }

    let setView = (newView) => {
        view = newView;
    }

    let isOpen = () => {
        const openDropdown = getView().el.querySelector(OPEN_NAV_DROPDOWN_CLASS);
        return openDropdown !== null && openDropdown !== undefined;
    }

    let toggleArrow = (target) => {
        const icon = target.querySelector('i.fa');
        if (icon && icon.classList.contains('fa-caret-down')) {
            icon.classList.remove('fa-caret-down');
            icon.classList.add('fa-caret-up');
        } else if (icon && icon.classList.contains('fa-caret-up')) {
            icon.classList.remove('fa-caret-up');
            icon.classList.add('fa-caret-down');
        }
    };

    return {
        init: init,
        getView: getView,
        setView: setView,
        dropdownFocus: dropdownFocus,
        dropdownBlur: dropdownBlur,
        toggleDropdown: toggleDropdown,
        closeDropdown: closeDropdown,
        isOpen: isOpen
    };
});
