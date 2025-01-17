document.addEventListener("DOMContentLoaded", function () {
  let txtInput = document.getElementById("add"); // حقل إدخال النص
  let radioInputs = document.querySelectorAll('input[type="radio"]'); // أزرار الراديو
  let submitButton = document.getElementById("submet"); // زر الإضافة
  let listContainer = document.getElementById("list-container"); // الحاوية الرئيسية للقوائم

  // تفعيل زر الإضافة بناءً على الإدخال
  txtInput.addEventListener("input", enableButton);
  radioInputs.forEach((radio) =>
    radio.addEventListener("change", enableButton)
  );

  function enableButton() {
    const isRadioChecked = Array.from(radioInputs).some(
      (radio) => radio.checked
    );
    const isTextEntered = txtInput.value.trim() !== "";
    submitButton.disabled = !(isRadioChecked && isTextEntered);
  }

  // استدعاء إضافة مهمة عند الضغط على زر الإضافة
  submitButton.addEventListener("click", addTask);

  // استدعاء إضافة مهمة عند الضغط على "Enter"
  txtInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter" && !submitButton.disabled) {
      e.preventDefault(); // منع السلوك الافتراضي
      addTask();
      // استدعاء نفس دالة الإضافة
    }
  });

  function addTask() {
    if (txtInput.value === "") {
      alert("You must write something!");
      return;
    }

    let selectedRadio = document.querySelector('input[name="option"]:checked');
    let containerId, listId, headerText;

    if (selectedRadio) {
      switch (selectedRadio.id) {
        case "day":
          containerId = "day-container";
          listId = "day-list";
          headerText = "Tasks Of Day";
          break;
        case "week":
          containerId = "week-container";
          listId = "week-list";
          headerText = "Tasks Of Week";
          break;
        case "month":
          containerId = "month-container";
          listId = "month-list";
          headerText = "Tasks Of Month";
          break;
      }

      let container = document.getElementById(containerId);
      if (!container) {
        container = document.createElement("div");
        container.id = containerId;

        let p = document.createElement("p");
        p.textContent = headerText;
        p.className = "header-text";
        container.appendChild(p);

        let ul = document.createElement("ul");
        ul.id = listId;
        container.appendChild(ul);

        listContainer.appendChild(container);
      }

      let ul = document.getElementById(listId);
      let li = document.createElement("li");
      li.innerHTML = txtInput.value;
      ul.appendChild(li);

      let span = document.createElement("span");
      span.innerHTML = "\u00d7";
      span.className = "close";
      li.appendChild(span);
      txtInput.value = "";

      li.addEventListener("click", function () {
        li.classList.toggle("checked");
        save();
      });

      span.onclick = function () {
        let div = this.parentElement;
        let ul = div.parentElement;
        ul.removeChild(div);
        let container = ul.parentElement;
        removeHeaderIfEmpty(container, ul);
        save();
      };

      save();
    }
  }

  function removeHeaderIfEmpty(container, ul) {
    if (ul.children.length === 0) {
      container.remove();
      // إزالة الحاوية بالكامل عند فراغ القائمة
    }
  }

  function save() {
    localStorage.setItem("data", listContainer.innerHTML);
  }

  function show() {
    listContainer.innerHTML = localStorage.getItem("data") || "";
    let listItems = listContainer.getElementsByTagName("li");
    for (let i = 0; i < listItems.length; i++) {
      let li = listItems[i];

      li.addEventListener("click", function () {
        li.classList.toggle("checked");
        save();
      });

      let span = li.getElementsByClassName("close")[0];
      span.onclick = function () {
        let div = this.parentElement;
        let ul = div.parentElement;
        ul.removeChild(div);
        let container = ul.parentElement;
        removeHeaderIfEmpty(container, ul);
        save();
      };
    }
  }

  show();
});
