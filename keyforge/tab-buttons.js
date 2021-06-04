function openModule(evt, moduleName) {
  [].forEach.call(
    document.getElementsByClassName("tabContent"),
    x => x.style.display="none");
      let active = evt.currentTarget.className.includes("active");
  [].forEach.call(
    document.getElementsByClassName("tabLink"),
    x => x.className = x.className.replace(" active", ""));
    // console.log(evt.currentTarget.attributes.onclick.value);
  document.getElementById(moduleName).style.display = active ? "none" : "block";
  evt.currentTarget.className += active ? "" : " active";
}
