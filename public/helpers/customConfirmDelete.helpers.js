const customConfirm = (callback) => {
  // in `customAlertBox` element we are gonna store custom alert and other elements
  const customAlertBox = document.createElement("div");
  customAlertBox.style.width = "400px";
  customAlertBox.style.height = "200px";
  customAlertBox.style.margin = "auto";
  customAlertBox.style.backgroundColor = "white";
  customAlertBox.style.color = "black";

  // in `createAlertMsg` element we are gonna store custom alert
  const createAlertMsg = document.createElement("p");
  createAlertMsg.innerText = "are you sure you want to delete this file ?";
  createAlertMsg.style.fontSize = "13px";
  createAlertMsg.style.color = "red";

  //   customAlertOK , in this element we are gonno say yes for deleting a file
  const customAlertOK = document.createElement("button");
  customAlertOK.innerText = "delete";
  customAlertOK.style.padding = " 12px 14px";
  customAlertOK.style.backgroundColor = "orange";
  customAlertOK.style.borderRadius = "15px";

  //   customAlertCancel , in this element we are gonno say yes for deleting a file
  const customAlertCancel = document.createElement("button");
  customAlertOK.innerText = "delete";
  customAlertOK.style.padding = " 12px 14px";
  customAlertOK.style.backgroundColor = "orange";
  customAlertOK.style.borderRadius = "15px";
};
