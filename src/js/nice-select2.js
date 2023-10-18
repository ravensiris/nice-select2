import "../scss/nice-select2.scss";

// utility functions
function triggerClick(el) {
  const event = document.createEvent("MouseEvents");
  event.initEvent("click", true, false);
  el.dispatchEvent(event);
}

function triggerChange(el) {
  const event = document.createEvent("HTMLEvents");
  event.initEvent("change", true, false);
  el.dispatchEvent(event);
}

function triggerFocusIn(el) {
  const event = document.createEvent("FocusEvent");
  event.initEvent("focusin", true, false);
  el.dispatchEvent(event);
}

function triggerFocusOut(el) {
  const event = document.createEvent("FocusEvent");
  event.initEvent("focusout", true, false);
  el.dispatchEvent(event);
}

function triggerModalOpen(el) {
  const event = document.createEvent("UIEvent");
  event.initEvent("modalopen", true, false);
  el.dispatchEvent(event);
}

function triggerModalClose(el) {
  const event = document.createEvent("UIEvent");
  event.initEvent("modalclose", true, false);
  el.dispatchEvent(event);
}

function triggerValidationMessage(el, type) {
  if (type === "invalid") {
    addClass(this.dropdown, "invalid");
    removeClass(this.dropdown, "valid");
  } else {
    addClass(this.dropdown, "valid");
    removeClass(this.dropdown, "invalid");
  }
}

function attr(el, key) {
  if (el[key] !== undefined) {
    return el[key];
  }
  return el.getAttribute(key);
}

function hasClass(el, className) {
  if (el) {
    return el.classList.contains(className);
  } else {
    return false;
  }
}

function addClass(el, className) {
  if (el) return el.classList.add(className);
}

function removeClass(el, className) {
  if (el) return el.classList.remove(className);
}

const defaultOptions = {
  data: null,
  searchable: false,
  showSelectedItems: false,
};

export default function NiceSelect(element, options) {
  this.el = element;
  this.config = Object.assign({}, defaultOptions, options || {});
  this.data = this.config.data;
  this.selectedOptions = [];

  this.placeholder =
    attr(this.el, "placeholder") ||
    this.config.placeholder ||
    "Select an option";
  this.searchtext =
    attr(this.el, "searchtext") || this.config.searchtext || "Search";
  this.selectedtext =
    attr(this.el, "selectedtext") || this.config.selectedtext || "selected";

  this.dropdown = null;
  this.multiple = attr(this.el, "multiple");
  this.disabled = attr(this.el, "disabled");

  this.create();
}

NiceSelect.prototype.create = function () {
  this.el.style.opacity = "0";
  this.el.style.width = "0";
  this.el.style.padding = "0";
  this.el.style.height = "0";
  if (this.data) {
    this.processData(this.data);
  } else {
    this.extractData();
  }

  this.renderDropdown();
  this.bindEvent();
};

NiceSelect.prototype.processData = function (data) {
  const options = [];
  data.forEach((item) => {
    options.push({
      data: item,
      attributes: {
        selected: !!item.selected,
        disabled: !!item.disabled,
        optgroup: item.value === "optgroup",
		classList: item.classList
      },
    });
  });
  this.options = options;
};

NiceSelect.prototype.extractData = function () {
  const options = this.el.querySelectorAll("option,optgroup");
  const data = [];
  const allOptions = [];
  const selectedOptions = [];

  options.forEach((item) => {
    let itemData;
    if (item.tagName === "OPTGROUP") {
      itemData = {
        text: item.label,
        value: "optgroup",
      };
    } else {
      let text = item.innerText;
      if (item.dataset.display !== undefined) {
        text = item.dataset.display;
      }

	  const selectedClass = item.dataset.selectedClass

      itemData = {
        text,
        value: item.value,
        selected: item.getAttribute("selected") != null,
        disabled: item.getAttribute("disabled") != null,
		classList: item.classList,
	    selectedClass
      };
    }

    const attributes = {
      selected: item.getAttribute("selected") != null,
      disabled: item.getAttribute("disabled") != null,
      optgroup: item.tagName === "OPTGROUP",
	  classList: item.classList
    };

    data.push(itemData);
    allOptions.push({ data: itemData, attributes });
  });

  this.data = data;
  this.options = allOptions;
  this.options.forEach((item) => {
    if (item.attributes.selected) {
      selectedOptions.push(item);
    }
  });

  this.selectedOptions = selectedOptions;
};

NiceSelect.prototype.renderDropdown = function () {
  const classes = [
    "nice-select",
    attr(this.el, "class") || "",
    this.disabled ? "disabled" : "",
    this.multiple ? "has-multiple" : "",
  ];


  let searchHtml = '<div class="nice-select-search-box">';
  searchHtml += `<input type="text" class="nice-select-search" placeholder="${this.searchtext}..." title="search"/>`;
  searchHtml += "</div>";

  let html = `<div class="${classes.join(" ")}" tabindex="${
    this.disabled ? null : 0
  }">`;
  html += `<span class="${
    this.multiple ? "multiple-options" : "current"
  }"></span>`;
  html += '<div class="nice-select-dropdown">';
  html += `${this.config.searchable ? searchHtml : ""}`;
  html += '<ul class="list"></ul>';
  html += "</div>";
  html += "</div>";

  this.el.insertAdjacentHTML("afterend", html);

  this.dropdown = this.el.nextElementSibling;
  this._renderSelectedItems();
  this._renderItems();
};

NiceSelect.prototype._renderSelectedItems = function () {
  if (this.multiple) {
    let selectedHtml = "";

    if (
      this.config.showSelectedItems ||
      this.config.showSelectedItems ||
      window.getComputedStyle(this.dropdown).width === "auto" ||
      this.selectedOptions.length < 2
    ) {
      this.selectedOptions.forEach(function (item) {
        selectedHtml += `<span class="current">${item.data.text}</span>`;
      });

      selectedHtml = selectedHtml === "" ? this.placeholder : selectedHtml;
    } else {
      selectedHtml = this.selectedOptions.length + " " + this.selectedtext;
    }

    this.dropdown.querySelector(".multiple-options").innerHTML = selectedHtml;
  } else {
    const html =
      this.selectedOptions.length > 0
        ? this.selectedOptions[0].data.text
        : this.placeholder;

	const selectedClass = this.selectedOptions[0]?.data.selectedClass
	const currentElem = this.dropdown.querySelector(".current")

    currentElem.innerHTML = html;

	if (selectedClass) {
		currentElem.className = `current ${selectedClass}`
	} else {
		currentElem.className = "current"
	}
  }
};

NiceSelect.prototype._renderItems = function () {
  const ul = this.dropdown.querySelector("ul");
  this.options.forEach((item) => {
    ul.appendChild(this._renderItem(item));
  });
};

NiceSelect.prototype._renderItem = function (option) {
  const el = document.createElement("li");

  el.innerHTML = option.data.text;

  if (option.attributes.optgroup) {
    addClass(el, "optgroup");
  } else {
    el.setAttribute("data-value", option.data.value);
    const classList = [
      "option",
      option.attributes.selected ? "selected" : undefined, 
      option.attributes.disabled ? "disabled" : undefined,
    ].filter(x => x !== undefined);

	if (option.attributes.classList){
		classList.push(...option.attributes.classList)
	}

    el.addEventListener("click", this._onItemClicked.bind(this, option));
    el.classList.add(...classList);
  }

  option.element = el;
  return el;
};

NiceSelect.prototype.update = function () {
  this.extractData();
  if (this.dropdown) {
    const open = hasClass(this.dropdown, "open");
    this.dropdown.parentNode.removeChild(this.dropdown);
    this.create();

    if (open) {
      triggerClick(this.dropdown);
    }
  }

  if (attr(this.el, "disabled")) {
    this.disable();
  } else {
    this.enable();
  }
};

NiceSelect.prototype.disable = function () {
  if (!this.disabled) {
    this.disabled = true;
    addClass(this.dropdown, "disabled");
  }
};

NiceSelect.prototype.enable = function () {
  if (this.disabled) {
    this.disabled = false;
    removeClass(this.dropdown, "disabled");
  }
};

NiceSelect.prototype.clear = function () {
  this.resetSelectValue();
  this.selectedOptions = [];
  this._renderSelectedItems();
  this.update();

  triggerChange(this.el);
};

NiceSelect.prototype.destroy = function () {
  if (this.dropdown) {
    this.dropdown.parentNode.removeChild(this.dropdown);
    this.el.style.display = "";
  }
};

NiceSelect.prototype.bindEvent = function () {
  this.dropdown.addEventListener("click", this._onClicked.bind(this));
  this.dropdown.addEventListener("keydown", this._onKeyPressed.bind(this));
  this.dropdown.addEventListener("focusin", triggerFocusIn.bind(this, this.el));
  this.dropdown.addEventListener(
    "focusout",
    triggerFocusOut.bind(this, this.el)
  );
  this.el.addEventListener(
    "invalid",
    triggerValidationMessage.bind(this, this.el, "invalid")
  );
  window.addEventListener("click", this._onClickedOutside.bind(this));

  if (this.config.searchable) {
    this._bindSearchEvent();
  }
};

NiceSelect.prototype._bindSearchEvent = function () {
  const searchBox = this.dropdown.querySelector(".nice-select-search");
  if (searchBox) {
    searchBox.addEventListener("click", function (e) {
      e.stopPropagation();
      return false;
    });
  }

  searchBox.addEventListener("input", this._onSearchChanged.bind(this));
};

NiceSelect.prototype._onClicked = function (e) {
  e.preventDefault();
  if (!hasClass(this.dropdown, "open")) {
    addClass(this.dropdown, "open");
    triggerModalOpen(this.el);
  } else {
    if (this.multiple) {
      if (e.target === this.dropdown.querySelector(".multiple-options")) {
        removeClass(this.dropdown, "open");
        triggerModalClose(this.el);
      }
    } else {
      removeClass(this.dropdown, "open");
      triggerModalClose(this.el);
    }
  }

  if (hasClass(this.dropdown, "open")) {
    const search = this.dropdown.querySelector(".nice-select-search");
    if (search) {
      search.value = "";
      search.focus();
    }

    let t = this.dropdown.querySelector(".focus");
    removeClass(t, "focus");
    t = this.dropdown.querySelector(".selected");
    addClass(t, "focus");
    this.dropdown.querySelectorAll("ul li").forEach(function (item) {
      item.style.display = "";
    });
  } else {
    this.dropdown.focus();
  }
};

NiceSelect.prototype._onItemClicked = function (option, e) {
  const optionEl = e.target;

  if (!hasClass(optionEl, "disabled")) {
    if (this.multiple) {
      if (hasClass(optionEl, "selected")) {
        removeClass(optionEl, "selected");
        this.selectedOptions.splice(this.selectedOptions.indexOf(option), 1);
        this.el
          .querySelector(`option[value="${optionEl.dataset.value}"]`)
          .removeAttribute("selected");
      } else {
        addClass(optionEl, "selected");
        this.selectedOptions.push(option);
      }
    } else {
      this.options.forEach(function (item) {
        removeClass(item.element, "selected");
      });
      this.selectedOptions.forEach(function (item) {
        removeClass(item.element, "selected");
      });

      addClass(optionEl, "selected");
      this.selectedOptions = [option];
    }

    this._renderSelectedItems();
    this.updateSelectValue();
  }
};

NiceSelect.prototype.updateSelectValue = function () {
  if (this.multiple) {
    const select = this.el;
    this.selectedOptions.forEach(function (item) {
      const el = select.querySelector(`option[value="${item.data.value}"]`);
      if (el) {
        el.setAttribute("selected", true);
      }
    });
  } else if (this.selectedOptions.length > 0) {
    this.el.value = this.selectedOptions[0].data.value;
  }
  triggerChange(this.el);
};

NiceSelect.prototype.resetSelectValue = function () {
  if (this.multiple) {
    const select = this.el;
    this.selectedOptions.forEach(function (item) {
      const el = select.querySelector(`option[value="${item.data.value}"]`);
      if (el) {
        el.removeAttribute("selected");
      }
    });
  } else if (this.selectedOptions.length > 0) {
    this.el.selectedIndex = -1;
  }

  triggerChange(this.el);
};

NiceSelect.prototype._onClickedOutside = function (e) {
  if (!this.dropdown.contains(e.target)) {
    removeClass(this.dropdown, "open");
    triggerModalClose(this.el);
  }
};

NiceSelect.prototype._onKeyPressed = function (e) {
  // Keyboard events

  const focusedOption = this.dropdown.querySelector(".focus");

  const open = hasClass(this.dropdown, "open");

  // Enter
  if (e.keyCode === 13) {
    if (open) {
      triggerClick(focusedOption);
    } else {
      triggerClick(this.dropdown);
    }
  } else if (e.keyCode === 40) {
    // Down
    if (!open) {
      triggerClick(this.dropdown);
    } else {
      const next = this._findNext(focusedOption);
      if (next) {
        const t = this.dropdown.querySelector(".focus");
        removeClass(t, "focus");
        addClass(next, "focus");
      }
    }
    e.preventDefault();
  } else if (e.keyCode === 38) {
    // Up
    if (!open) {
      triggerClick(this.dropdown);
    } else {
      const prev = this._findPrev(focusedOption);
      if (prev) {
        const t = this.dropdown.querySelector(".focus");
        removeClass(t, "focus");
        addClass(prev, "focus");
      }
    }
    e.preventDefault();
  } else if (e.keyCode === 27 && open) {
    // Esc
    triggerClick(this.dropdown);
  } else if (e.keyCode === 32 && open) {
    // Space
    return false;
  }
  return false;
};

NiceSelect.prototype._findNext = function (el) {
  if (el) {
    el = el.nextElementSibling;
  } else {
    el = this.dropdown.querySelector(".list .option");
  }

  while (el) {
    if (!hasClass(el, "disabled") && el.style.display !== "none") {
      return el;
    }
    el = el.nextElementSibling;
  }

  return null;
};

NiceSelect.prototype._findPrev = function (el) {
  if (el) {
    el = el.previousElementSibling;
  } else {
    el = this.dropdown.querySelector(".list .option:last-child");
  }

  while (el) {
    if (!hasClass(el, "disabled") && el.style.display !== "none") {
      return el;
    }
    el = el.previousElementSibling;
  }

  return null;
};

NiceSelect.prototype._onSearchChanged = function (e) {
  const open = hasClass(this.dropdown, "open");
  let text = e.target.value;
  text = text.toLowerCase();

  if (text === "") {
    this.options.forEach(function (item) {
      item.element.style.display = "";
    });
  } else if (open) {
    const matchReg = new RegExp(text);
    this.options.forEach(function (item) {
      const optionText = item.data.text.toLowerCase();
      const matched = matchReg.test(optionText);
      item.element.style.display = matched ? "" : "none";
    });
  }

  this.dropdown.querySelectorAll(".focus").forEach(function (item) {
    removeClass(item, "focus");
  });

  const firstEl = this._findNext(null);
  addClass(firstEl, "focus");
};

export function bind(el, options) {
  return new NiceSelect(el, options);
}
