////////////////////////////////
// "Control" object constructor
////////////////////////////////
//function Control(id, title, standard, reqId, reqRef, description, questions, extRef, tasks, hidden) {
class Control{
  
  constructor(id, title, standard, reqId, reqRef, description, questions, extRef, tasks, hidden) {
  this.id = id;
  this.title = title;
  this.standard = standard;
  this.reqId = reqId;
  this.reqRef = reqRef;
  this.description = description;
  this.questions = questions;
  this.extRef = extRef;
  this.tasks = tasks;
  this.hidden = hidden;

  // Return the content of the control in plain text
  this.info = function () {
    return (
      "Control id:"                   + this.id               + " ; " +
      "Control title: "               + this.title            + " ; " +
      "Standard: "                    + this.standard         + " ; " +
      "Requirement: "                 + this.reqId            + " ; " +
      "References: "                  + this.reqRef           + " ; " +
      "Description: "                 + this.description      + " ; " +
      "Questions: "                   + this.questions        + " ; " +
      "External references: "         + this.extRef           + " ; " +
      "Tasks associated: "            + this.tasks            + " ; " +
      "Control should stay hidden: "  + this.hidden
    );
  };

  // Return a html "card" for this control
  this.card = function () {
    let aCard = document.createElement("div");
    aCard.classList.add("card", this.id);

    // TITLE
    let aTitle = document.createElement("div");
    aTitle.classList.add("title");
    const titleText = document.createTextNode(this.title);
    aTitle.appendChild(titleText);

    // SUMMARY
    let aSummary = document.createElement("div");
    aSummary.classList.add("summary");
    const summaryText = document.createTextNode(this.description);
    aSummary.appendChild(summaryText);

    // CHECKBOX & BUTTONS
    let aButtonsContainer = document.createElement("div");
    aButtonsContainer.classList.add("buttonsContainer");
    let aLabel = document.createElement("label");
    aLabel.classList.add("customCheckbox");
    const labelText = document.createTextNode("Hidden");
    aLabel.appendChild(labelText);
    let anInput = document.createElement("input");
    anInput.type = "checkbox";
    if (this.hidden) {
      anInput.setAttribute("checked", "true");
    }
    anInput.addEventListener("change", (e) => {
      if (this.hidden) {
        this.hidden = false;
      } else {
        this.hidden = true;
      }
    });
    aLabel.appendChild(anInput);
    aButtonsContainer.appendChild(aLabel);
    let aSpan = document.createElement("span");
    aSpan.classList.add("checkmark");
    aLabel.appendChild(aSpan);
    let editButton = document.createElement("div");
    editButton.classList.add("edit");
    let aEditButton = document.createElement("button");
    aEditButton.classList.add("editControlButton");
    const editLabel = document.createTextNode("Edit");
    aEditButton.appendChild(editLabel);
    editButton.appendChild(aEditButton);
    editButton.addEventListener("click", (e) => {
      editControl(this.id);
    });
    aButtonsContainer.appendChild(editButton);
    let deleteButton = document.createElement("div");
    deleteButton.classList.add("delete");
    let aDeleteButton = document.createElement("button");
    aDeleteButton.classList.add("deleteCardButton");
    const deleteLabel = document.createTextNode("Delete");
    aDeleteButton.appendChild(deleteLabel);
    deleteButton.appendChild(aDeleteButton);
    deleteButton.addEventListener("click", (e) => {
      removeControlFromLibrary(this.id);
      removeCardFromDom(this.id);
    });
    aButtonsContainer.appendChild(deleteButton);

    aCard.appendChild(aTitle);
    aCard.appendChild(aSummary);
    aCard.appendChild(aButtonsContainer);
    return aCard;
  };
}
}

////////////////////////////////////
// "Control" library initialization
////////////////////////////////////
function prefillLibrary() {
  myLibrary[0] = new Control(
    0,
    "Control Title",
    "",
    "",
    "",
    "Control summary description (more or less 30 words)",
    "",
    "",
    "",
    true
  );

  myLibrary[1] = new Control(
    1,
    "Enforce 2FA on banking accounts",
    "ISO/CEI 27001:2013",
    "A.5.1.1-1",
    "",
    "Deploy, document, train users and audit a 2FA on both bank (TD and Desjardins) account accesses. This should be done for every set of credentials allowing access (even if read-only) to our accounts.",
    "",
    "",
    "",
    false
  );

  myLibrary[2] = new Control(
    2,
    "Review firewalls rules and configurations",
    "ISO/CEI 27001:2013",
    "A.5.1.1-1",
    "",
    "Firewall rules should be reviewed regularly to remove rules unused anymore, avoid contradiction between rules, make sure no rule is not commented (identifying the owner), VPN permissions are not to permissive and admin accesses are secured. This should be done for every firewall and rules should analyzed globally.",
    "",
    "",
    "",
    false
  );
}

/////////////////////////////////////////
// Inject the control library in the DOM
/////////////////////////////////////////
function addLibraryToPage() {
  for (let i = 0; i < myLibrary.length; i++) {
    document.getElementsByClassName("cardContainer")[0].appendChild(myLibrary[i].card());
  }
}

//////////////////
// Button actions
//////////////////

// Open modal ("+") button
const add_new_control_btn = document.querySelector(".addControl");
add_new_control_btn.addEventListener("click", (e) => {
  modal.style.display = "block";
  modal.scrollTo(0, 0);
});

// Close modal ("x") button
const close_modal_btn = document.querySelector(".closeModal");
close_modal_btn.addEventListener("click", (e) => {
  modal.style.display = "none";
});

// "Save new control" button
const save_control_btn = document.getElementById("save-button");
save_control_btn.addEventListener("click", (e) => {
  let index = myLibrary.length;
  myLibrary[index] = new Control(
    controlNumber++,
    document.getElementById("controlTitle").value,
    document.getElementById("standards").value,
    document.getElementById("requirementId").value,
    document.getElementById("requirementReference").value,
    document.getElementById("requirementDescription").value,
    document.getElementById("questions").value,
    document.getElementById("externalLinks").value,
    document.getElementById("associatedTasks").value,
    document.getElementById("hide").checked
  );
  document.getElementsByClassName("cardContainer")[0].appendChild(myLibrary[index].card());
  document.getElementsByClassName("controlDetailsForm")[0].reset();
  e.preventDefault();
  modal.style.display = "none";
});

// Edit button
function editControl (id) {
  controlUpdating = id;
  const controlToUpdate = myLibrary.find(e => e.id == id);
  editModal.style.display = "block";
  editModal.scrollTo(0, 0);
  document.getElementById("editControlTitle").value = controlToUpdate.title;
  document.getElementById("editStandards").value = controlToUpdate.standard;
  document.getElementById("editRequirementId").value = controlToUpdate.reqId;
  document.getElementById("editRequirementReference").value = controlToUpdate.reqRef;
  document.getElementById("editRequirementDescription").value = controlToUpdate.description;
  document.getElementById("editQuestions").value = controlToUpdate.questions;
  document.getElementById("editExternalLinks").value = controlToUpdate.extRef;
  document.getElementById("editAssociatedTasks").value = controlToUpdate.tasks;
  document.getElementById("editHide").checked = controlToUpdate.hidden;
}

// Close edit modal ("x") button
const close_edit_modal_btn = document.querySelector(".closeEditModal");
close_edit_modal_btn.addEventListener("click", (e) => {
  editModal.style.display = "none";
  document.getElementsByClassName("controlDetailsForm")[0].reset();
  controlUpdating = null;
});

// "Update control" button 
const update_control_btn = document.getElementById("update-button");
update_control_btn.addEventListener("click", (e) => {
  const controlToUpdate = myLibrary.find((e) => e.id == controlUpdating);
  controlToUpdate.title = document.getElementById("editControlTitle").value;
  controlToUpdate.standard = document.getElementById("editStandards").value;
  controlToUpdate.reqId = document.getElementById("editRequirementId").value;
  controlToUpdate.reqRef = document.getElementById("editRequirementReference").value;
  controlToUpdate.description = document.getElementById("editRequirementDescription").value;
  controlToUpdate.questions = document.getElementById("editQuestions").value;
  controlToUpdate.extRef = document.getElementById("editExternalLinks").value;
  controlToUpdate.tasks = document.getElementById("editAssociatedTasks").value;
  controlToUpdate.hidden = document.getElementById("editHide").checked;

  document.getElementsByClassName("controlDetailsForm")[0].reset();
  e.preventDefault();
  updateDom(controlToUpdate);

  editModal.style.display = "none";
});

function updateDom (controlToUpdate) {
  cardToUpdate = document.getElementsByClassName(controlToUpdate.id)[0]
  cardToUpdate.firstChild.textContent = controlToUpdate.title;
  cardToUpdate.childNodes[1].textContent = controlToUpdate.description;
  if (controlToUpdate.hidden) {
    cardToUpdate.childNodes[2].childNodes[0].childNodes[1].checked = true;
  } else {
    cardToUpdate.childNodes[2].childNodes[0].childNodes[1].checked = false;
  }
}

// Remove button actions
function removeControlFromLibrary (id) {
  for (var i = 0; i < myLibrary.length; i++) {
    if (myLibrary[i].id == id) {
      myLibrary.splice(i, 1);
    }
  }
}

function removeCardFromDom (id) {
  const cardToRemove = document.getElementsByClassName(id);
  cardToRemove[0].remove();
}

////////////////////
// Initialization //
////////////////////
let myLibrary = [];
let controlNumber = 0;
let controlUpdating;
//prefillLibrary();
addLibraryToPage();

